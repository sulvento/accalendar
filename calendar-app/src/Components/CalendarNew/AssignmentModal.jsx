import React from "react"
import { useTheme } from "../../ThemeContext"

const URL_REGEX = /(https?:\/\/[^\s<>"]+)/g

const ALLOWED_TAGS = new Set([
  "p", "div", "span", "br", "hr",
  "b", "strong", "i", "em", "u", "s", "strike",
  "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td"
])

function getStatusColor(status, theme) {
  if (status === "submitted") return theme.statusSubmitted
  if (status === "graded") return theme.statusGraded
  if (status === "missing") return theme.statusMissing
  return theme.statusUnsubmitted
}

function getStatusLabel(status) {
  if (status === "submitted") return "Submitted"
  if (status === "graded") return "Graded"
  if (status === "missing") return "Missing"
  return "Not submitted"
}

function linkStyle(theme) {
  return {
    color: theme.accent,
    textDecoration: "underline",
    wordBreak: "break-word"
  }
}

function autolinkText(text, theme, keyPrefix) {
  if (!text) return null

  const parts = text.split(URL_REGEX)

  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return React.createElement(
        "a",
        {
          key: `${keyPrefix}-${i}`,
          href: part,
          target: "_blank",
          rel: "noopener noreferrer",
          style: linkStyle(theme)
        },
        part
      )
    }
    return part
  })
}

function nodeToReact(node, theme, keyPrefix) {
  if (node.nodeType === 3) {
    const text = node.textContent
    if (!text) return null
    return (
      <React.Fragment key={keyPrefix}>
        {autolinkText(text, theme, keyPrefix)}
      </React.Fragment>
    )
  }

  if (node.nodeType !== 1) return null

  const tag = node.tagName.toLowerCase()

  if (tag === "br") return <br key={keyPrefix} />
  if (tag === "hr") return <hr key={keyPrefix} />
  if (tag === "img" || tag === "script" || tag === "style" || tag === "iframe") {
    return null
  }

  const children = Array.from(node.childNodes).map((child, i) =>
    nodeToReact(child, theme, `${keyPrefix}-${i}`)
  )

  if (tag === "a") {
    const href = node.getAttribute("href")
    if (!href) {
      return <span key={keyPrefix}>{children}</span>
    }
    return React.createElement(
      "a",
      {
        key: keyPrefix,
        href: href,
        target: "_blank",
        rel: "noopener noreferrer",
        style: linkStyle(theme)
      },
      children
    )
  }

  if (ALLOWED_TAGS.has(tag)) {
    return React.createElement(tag, { key: keyPrefix }, children)
  }

  return <span key={keyPrefix}>{children}</span>
}

function renderDescription(html, theme) {
  if (!html || typeof html !== "string") {
    return "No description available"
  }

  const trimmed = html.trim()
  if (!trimmed) return "No description available"

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(trimmed, "text/html")
    const nodes = Array.from(doc.body.childNodes)

    if (nodes.length === 0) {
      return autolinkText(trimmed, theme, "plain")
    }

    return nodes.map((node, i) => nodeToReact(node, theme, `root-${i}`))
  } catch (e) {
    return autolinkText(trimmed, theme, "plain")
  }
}

function AssignmentModal({ assignment, closeModal }) {
  const { theme } = useTheme()

  const statusColor = getStatusColor(assignment.submissionStatus, theme)
  const statusLabel = getStatusLabel(assignment.submissionStatus)
  const renderedDescription = renderDescription(assignment.description, theme)

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: theme.modalOverlay,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: theme.surface,
        color: theme.text,
        padding: "22px",
        borderRadius: "12px",
        width: "420px",
        maxHeight: "75vh",
        overflowY: "auto",
        boxShadow: theme.modalShadow
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "12px", color: theme.text }}>
          {assignment.title}
        </h3>

        <p><strong>Course:</strong> {assignment.course}</p>
        <p><strong>Due Date:</strong> {assignment.dueDate}</p>

        {assignment.type && (
          <p><strong>Type:</strong> {assignment.type}</p>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: "8px 0"
        }}>
          <strong>Status:</strong>
          <span style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: statusColor,
            border: assignment.submissionStatus === "unsubmitted"
              ? `1px solid ${theme.textMuted}`
              : "none",
            flexShrink: 0
          }} />
          <span>{statusLabel}</span>
        </div>

        {assignment.submissionStatus === "graded" &&
         assignment.score != null &&
         assignment.pointsPossible != null && (
          <p>
            <strong>Score:</strong> {assignment.score} / {assignment.pointsPossible}
          </p>
        )}

        <div style={{ marginTop: "12px" }}>
          <strong>Description:</strong>
          <div style={{
            fontSize: "14px",
            lineHeight: "1.4",
            maxHeight: "240px",
            overflowY: "auto",
            backgroundColor: theme.surfaceAlt,
            color: theme.text,
            padding: "10px",
            borderRadius: "8px",
            whiteSpace: "normal",
            wordBreak: "break-word"
          }}>
            {renderedDescription}
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "15px"
        }}>
          <button
            onClick={closeModal}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.surfaceAlt,
              color: theme.text,
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssignmentModal