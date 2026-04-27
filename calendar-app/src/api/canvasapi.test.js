import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";


const SCRIPT_PATH = "./canvasapi.js";


vi.mock("./apikey.js", () => ({
  ACCESS_TOKEN: "test-token-abc123",
}));

// ----- fixtures -----

const coursesPayload = {
  data: {
    allCourses: [
      {
        _id: "1",
        name: "CS101 Intro to Programming",
        state: "available",
        assignmentsConnection: {
          nodes: [
            { _id: "100", name: "HW1" },
            { _id: "101", name: "HW2" },
          ],
        },
      },
      {
        _id: "2",
        name: "Old course",
        state: "completed",
        assignmentsConnection: { nodes: [] },
      },
      {
        _id: "3",
        name: "Future course",
        state: "unpublished",
        assignmentsConnection: { nodes: [] },
      },
      {
        _id: "4",
        name: "Active seminar",
        state: "available",
        assignmentsConnection: { nodes: null }, // null edge case
      },
    ],
  },
};

const assignmentDetailPayload = {
  data: {
    assignment: {
      _id: "100",
      name: "HW1",
      courseId: "1",
      description: "<p>Solve problems</p>",
      dueAt: "2026-05-01T23:59:00Z",
      gradingType: "points",
      submissionsConnection: {
        nodes: [
          {
            _id: "999",
            state: "graded",
            score: 95,
            grade: "95",
            gradedAt: "2026-05-02T10:00:00Z",
            late: false,
            missing: false,
            submittedAt: "2026-04-30T22:00:00Z",
            attempt: 1,
            user: {
              _id: "u1",
              name: "Jane Doe",
              email: "jane@example.com",
              sortableName: "Doe, Jane",
            },
          },
        ],
      },
    },
  },
};

const graphqlErrorPayload = {
  errors: [{ message: "Assignment not found" }],
};

// ----- helpers -----

/** Return a fetch stub that picks a payload based on the GraphQL query body. */
function routingFetch(routes) {
  return vi.fn().mockImplementation(async (_url, options) => {
    const body = JSON.parse(options.body);
    for (const { match, payload } of routes) {
      if (match(body.query)) {
        return { ok: true, status: 200, json: async () => payload };
      }
    }
    throw new Error(`Unmocked query: ${body.query.slice(0, 80)}`);
  });
}

/** Re-execute the script's top-level code under the current mocks. */
async function runScript() {
  vi.resetModules();
  await import(SCRIPT_PATH);
}

/** Flatten console.* calls into a single searchable string. */
function flatten(spy) {
  return spy.mock.calls.map((args) => args.join(" ")).join("\n");
}

// ----- tests -----

describe("Canvas grading script", () => {
  let logSpy;
  let warnSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("posts to the Ursinus GraphQL endpoint", async () => {
    const fetch = routingFetch([
      { match: (q) => q.includes("allCourses"), payload: coursesPayload },
      {
        match: (q) => q.includes("assignment(id:"),
        payload: assignmentDetailPayload,
      },
    ]);
    vi.stubGlobal("fetch", fetch);

    await runScript();

    expect(fetch.mock.calls[0][0]).toBe(
      "https://ursinus.instructure.com/api/graphql"
    );
  });

  it("uses POST with JSON content type and bearer auth", async () => {
    const fetch = routingFetch([
      { match: (q) => q.includes("allCourses"), payload: coursesPayload },
      {
        match: (q) => q.includes("assignment(id:"),
        payload: assignmentDetailPayload,
      },
    ]);
    vi.stubGlobal("fetch", fetch);

    await runScript();

    const opts = fetch.mock.calls[0][1];
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(opts.headers.Authorization).toBe("Bearer test-token-abc123");
  });

  it("queries allCourses first", async () => {
    const fetch = routingFetch([
      { match: (q) => q.includes("allCourses"), payload: coursesPayload },
      {
        match: (q) => q.includes("assignment(id:"),
        payload: assignmentDetailPayload,
      },
    ]);
    vi.stubGlobal("fetch", fetch);

    await runScript();

    const firstBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(firstBody.query).toContain("allCourses");
  });

  it("only fetches details for assignments inside available courses", async () => {
    const fetch = routingFetch([
      { match: (q) => q.includes("allCourses"), payload: coursesPayload },
      {
        match: (q) => q.includes("assignment(id:"),
        payload: assignmentDetailPayload,
      },
    ]);
    vi.stubGlobal("fetch", fetch);

    await runScript();

    const assignmentCalls = fetch.mock.calls.filter((call) =>
      JSON.parse(call[1].body).query.includes("assignment(id:")
    );

    // Only course 1 (available, 2 assignments) yields detail fetches.
    // Course 2 (completed) and 3 (unpublished) are filtered out.
    // Course 4 (available, null nodes) yields zero detail fetches.
    expect(assignmentCalls).toHaveLength(2);

    const ids = assignmentCalls.map((call) => {
      const m = JSON.parse(call[1].body).query.match(
        /assignment\(id: "(\d+)"\)/
      );
      return m[1];
    });
    expect(ids).toEqual(["100", "101"]);
  });

  it("logs each available course with its assignment count", async () => {
    vi.stubGlobal(
      "fetch",
      routingFetch([
        { match: (q) => q.includes("allCourses"), payload: coursesPayload },
        {
          match: (q) => q.includes("assignment(id:"),
          payload: assignmentDetailPayload,
        },
      ])
    );

    await runScript();

    const logged = flatten(logSpy);
    expect(logged).toContain("CS101 Intro to Programming (2 assignments)");
    expect(logged).toContain("Active seminar (0 assignments)");
    expect(logged).not.toContain("Old course");
    expect(logged).not.toContain("Future course");
  });

  it("logs assignment details (name, due, grading, submission count)", async () => {
    vi.stubGlobal(
      "fetch",
      routingFetch([
        { match: (q) => q.includes("allCourses"), payload: coursesPayload },
        {
          match: (q) => q.includes("assignment(id:"),
          payload: assignmentDetailPayload,
        },
      ])
    );

    await runScript();

    const logged = flatten(logSpy);
    expect(logged).toContain("Assignment: HW1");
    expect(logged).toContain("Due: 2026-05-01T23:59:00Z");
    expect(logged).toContain("Grading: points");
    expect(logged).toContain("Submissions: 1");
  });

  it("warns on per-assignment GraphQL errors and continues iterating", async () => {
    let assignmentCallIndex = 0;
    const fetch = vi.fn().mockImplementation(async (_url, options) => {
      const body = JSON.parse(options.body);
      if (body.query.includes("allCourses")) {
        return { ok: true, json: async () => coursesPayload };
      }
      assignmentCallIndex++;
      // First assignment errors, second succeeds.
      const payload =
        assignmentCallIndex === 1
          ? graphqlErrorPayload
          : assignmentDetailPayload;
      return { ok: true, json: async () => payload };
    });
    vi.stubGlobal("fetch", fetch);

    await runScript();

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const [warnMessage, errorText] = warnSpy.mock.calls[0];
    expect(warnMessage).toContain('"HW1"');
    expect(errorText).toBe("Assignment not found");

    // The second assignment still got logged after the first errored.
    expect(flatten(logSpy)).toContain("Assignment: HW1");
  });

  it("skips silently when assignment data is null", async () => {
    vi.stubGlobal(
      "fetch",
      routingFetch([
        { match: (q) => q.includes("allCourses"), payload: coursesPayload },
        {
          match: (q) => q.includes("assignment(id:"),
          payload: { data: { assignment: null } },
        },
      ])
    );

    await runScript();

    expect(warnSpy).not.toHaveBeenCalled();
    const logged = flatten(logSpy);
    expect(logged).toContain("CS101 Intro to Programming (2 assignments)");
    expect(logged).not.toContain("Assignment:");
    expect(logged).not.toContain("Due:");
  });

  it("treats null assignmentsConnection.nodes as empty (no detail fetches)", async () => {
    const onlyNullNodes = {
      data: {
        allCourses: [
          {
            _id: "4",
            name: "Active seminar",
            state: "available",
            assignmentsConnection: { nodes: null },
          },
        ],
      },
    };

    const fetch = routingFetch([
      { match: (q) => q.includes("allCourses"), payload: onlyNullNodes },
    ]);
    vi.stubGlobal("fetch", fetch);

    await runScript();

    expect(fetch).toHaveBeenCalledTimes(1); // courses only, no assignment fetches
    expect(flatten(logSpy)).toContain("Active seminar (0 assignments)");
  });

  it("makes the expected total number of fetch calls", async () => {
    const fetch = routingFetch([
      { match: (q) => q.includes("allCourses"), payload: coursesPayload },
      {
        match: (q) => q.includes("assignment(id:"),
        payload: assignmentDetailPayload,
      },
    ]);
    vi.stubGlobal("fetch", fetch);

    await runScript();

    // 1 courses query + 2 assignment detail queries (course 1 has 2,
    // course 4 has null nodes coalesced to []).
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("serializes the GraphQL query into the request body", async () => {
    const fetch = routingFetch([
      { match: (q) => q.includes("allCourses"), payload: coursesPayload },
      {
        match: (q) => q.includes("assignment(id:"),
        payload: assignmentDetailPayload,
      },
    ]);
    vi.stubGlobal("fetch", fetch);

    await runScript();

    for (const call of fetch.mock.calls) {
      const body = JSON.parse(call[1].body);
      expect(body).toHaveProperty("query");
      expect(typeof body.query).toBe("string");
    }
  });

  it("interpolates each assignment's _id into its detail query", async () => {
    const fetch = routingFetch([
      { match: (q) => q.includes("allCourses"), payload: coursesPayload },
      {
        match: (q) => q.includes("assignment(id:"),
        payload: assignmentDetailPayload,
      },
    ]);
    vi.stubGlobal("fetch", fetch);

    await runScript();

    const detailQueries = fetch.mock.calls
      .map((call) => JSON.parse(call[1].body).query)
      .filter((q) => q.includes("assignment(id:"));

    expect(detailQueries[0]).toContain('assignment(id: "100")');
    expect(detailQueries[1]).toContain('assignment(id: "101")');
  });
});
