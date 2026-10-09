import * as React from "react"

/*
 * Code inside docs prose: CSS variables (--button-*), props with a value
 * (stage={false}, size="sm", variant=“outline”) and JSX (<Example thumbnail>,
 * render={<Button variant="outline" />}). Each is found here and set in mono.
 */
const start = /--[a-z0-9-]+\*?|<\/?[A-Z]|\b[a-z][\w-]*=(?=[{"“'`])/g
const quotes: Record<string, string> = { '"': '"', "“": "”", "`": "`" }
/** Short code stays on one line; longer snippets may wrap at their spaces. */
const NOWRAP_MAX = 24

/** The end (exclusive) of the quoted, braced or JSX run that opens at `from`, or -1. */
function endOf(text: string, from: number): number {
  const open = text[from]
  const quote = open === "'" ? "'" : quotes[open]
  if (quote) {
    const end = text.indexOf(quote, from + 1)
    return end === -1 ? -1 : end + 1
  }
  if (open !== "{" && open !== "<") return -1
  let braces = 0
  for (let i = from; i < text.length; i++) {
    const c = text[i]
    if (quotes[c]) {
      const end = text.indexOf(quotes[c], i + 1)
      if (end === -1) return -1
      i = end
    } else if (c === "{") braces++
    else if (c === "}") {
      braces--
      if (open === "{" && braces === 0) return i + 1
      if (braces < 0) return -1
    } else if (c === ">" && open === "<" && braces === 0) return i + 1
  }
  return -1
}

function codeRuns(text: string) {
  const runs: { code: boolean; text: string }[] = []
  let last = 0
  for (const match of text.matchAll(start)) {
    const at = match.index
    if (at < last) continue
    let end = -1
    if (match[0].startsWith("--")) end = at + match[0].length
    else if (match[0].startsWith("<")) end = endOf(text, at)
    else end = endOf(text, at + match[0].length)
    if (end === -1) continue
    if (at > last) runs.push({ code: false, text: text.slice(last, at) })
    runs.push({ code: true, text: text.slice(at, end) })
    last = end
  }
  if (last < text.length) runs.push({ code: false, text: text.slice(last) })
  return runs
}

/** Text with CSS variables, props and JSX kept whole and set in mono. */
export function TokenText({ text }: { text: string }) {
  return (
    <>
      {codeRuns(text).map((run, index) =>
        run.code ? (
          <code
            key={index}
            className={
              run.text.length <= NOWRAP_MAX
                ? "font-mono text-code whitespace-nowrap text-foreground"
                : "font-mono text-code text-foreground"
            }
          >
            {run.text}
          </code>
        ) : (
          <React.Fragment key={index}>{run.text}</React.Fragment>
        )
      )}
    </>
  )
}
