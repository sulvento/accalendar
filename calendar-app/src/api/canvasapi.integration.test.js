import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const SCRIPT_PATH = "./canvasapi.js";
const CANVAS_HOST = "https://ursinus.instructure.com";
const MOCK_HOST = process.env.MOCK_CANVAS_URL || "http://localhost:8080";


vi.mock("./apikey.js", () => ({
  ACCESS_TOKEN: "integration-test-token",
}));


function installFetchUrlRewrite() {
  const realFetch = globalThis.fetch.bind(globalThis);
  const spy = vi.fn(async (url, opts) => {
    const rewritten =
      typeof url === "string" && url.startsWith(CANVAS_HOST)
        ? url.replace(CANVAS_HOST, MOCK_HOST)
        : url;
    return realFetch(rewritten, opts);
  });
  vi.stubGlobal("fetch", spy);
  return spy;
}

/** GET WireMock's request journal so we can assert on what was actually sent. */
async function getWireMockRequests() {
  const res = await fetch(`${MOCK_HOST}/__admin/requests`);
  if (!res.ok) {
    throw new Error(`WireMock admin returned ${res.status}`);
  }
  const body = await res.json();
  // Only count requests against /api/graphql (ignore admin chatter).
  return body.requests.filter((r) => r.request.url === "/api/graphql");
}

/** Wipe the request journal between tests so assertions are independent. */
async function resetWireMockJournal() {
  await fetch(`${MOCK_HOST}/__admin/requests`, { method: "DELETE" });
}

describe("Canvas script — integration against WireMock", () => {
  let logSpy;
  let warnSpy;

  beforeEach(async () => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await resetWireMockJournal();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("can reach the WireMock service container", async () => {
    const res = await fetch(`${MOCK_HOST}/__admin/mappings`);
    expect(res.ok).toBe(true);
    const data = await res.json();
    // Two mappings registered by the workflow: courses + assignment detail.
    expect(data.mappings.length).toBeGreaterThanOrEqual(2);
  });

  it("runs end-to-end: courses query + per-assignment detail queries", async () => {
    installFetchUrlRewrite();

    vi.resetModules();
    await import(SCRIPT_PATH);

    const requests = await getWireMockRequests();

    // Courses fixture has 1 available course w/ 2 assignments and 1 available
    // course w/ null nodes → expect 1 courses call + 2 detail calls = 3.
    expect(requests).toHaveLength(3);

    // First request was the courses query.
    expect(requests[0].request.body).toContain("allCourses");

    // Subsequent requests fetched assignment 100 and 101.
    const assignmentBodies = requests.slice(1).map((r) => r.request.body);
    expect(assignmentBodies.some((b) => b.includes('assignment(id: "100")'))).toBe(
      true
    );
    expect(assignmentBodies.some((b) => b.includes('assignment(id: "101")'))).toBe(
      true
    );
  });

  it("sends the bearer token in the Authorization header", async () => {
    installFetchUrlRewrite();

    vi.resetModules();
    await import(SCRIPT_PATH);

    const requests = await getWireMockRequests();
    expect(requests.length).toBeGreaterThan(0);

    for (const req of requests) {
      const auth = req.request.headers.Authorization;
      expect(auth).toBe("Bearer integration-test-token");
    }
  });

  it("logs courses and assignment details from real HTTP responses", async () => {
    installFetchUrlRewrite();

    vi.resetModules();
    await import(SCRIPT_PATH);

    const out = logSpy.mock.calls.map((c) => c.join(" ")).join("\n");

    expect(out).toContain("CS101 Intro to Programming (2 assignments)");
    expect(out).toContain("Active seminar (0 assignments)");
    expect(out).not.toContain("Old course"); // filtered out (state: completed)

    expect(out).toContain("Assignment: HW1");
    expect(out).toContain("Due: 2026-05-01T23:59:00Z");
    expect(out).toContain("Grading: points");
    expect(out).toContain("Submissions: 1");
  });

  it("sends Content-Type: application/json on every GraphQL request", async () => {
    installFetchUrlRewrite();

    vi.resetModules();
    await import(SCRIPT_PATH);

    const requests = await getWireMockRequests();
    for (const req of requests) {
      expect(req.request.headers["Content-Type"]).toBe("application/json");
    }
  });
});
