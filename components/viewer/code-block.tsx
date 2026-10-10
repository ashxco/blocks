import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A small, dependency-free highlighter for the TSX, TS and shell snippets in
 * the docs. Colours are token roles read inside a `.dark` scope, because the
 * terminal surface is dark in both modes. The contrast gate
 * (scripts/check-contrast.mjs) holds every one of them to 4.5:1 on the dark
 * terminal in every theme:
 *
 *   plain       --terminal-foreground
 *   keyword     --brand
 *   tag         --chart-2
 *   attribute   --chart-4
 *   string      --chart-3
 *   comment and punctuation   --muted-foreground
 */

type Kind = "plain" | "keyword" | "tag" | "attr" | "string" | "number" | "comment" | "punct"

const kindClass: Record<Kind, string | undefined> = {
  plain: undefined,
  keyword: "text-brand",
  tag: "text-chart-2",
  attr: "text-chart-4",
  string: "text-chart-3",
  number: "text-chart-4",
  comment: "text-muted-foreground",
  punct: "text-muted-foreground",
}

const keywords = new Set(
  "import from export default const let var function return if else async await new type interface extends implements as typeof keyof in of for while do switch case break continue throw try catch finally class this null undefined true false void satisfies".split(
    " "
  )
)

interface Token {
  kind: Kind
  text: string
}

/**
 * Splits source into coloured tokens. Unknown text stays plain. A small mode
 * stack tells code from JSX children, so words and apostrophes in JSX text
 * ("Start for free", "Don't") are never read as keywords or strings.
 */
function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  // JSX children, or a {…} expression inside them with its brace depth.
  const stack: ({ mode: "children" } | { mode: "expr"; depth: number })[] = []
  // Inside a JSX tag (between "<Name" and ">"): closing tag or not, and {…} depth.
  let tag: { closing: boolean; braces: number } | null = null

  const push = (kind: Kind, text: string) => {
    const last = tokens[tokens.length - 1]
    if (last && last.kind === kind) last.text += text
    else tokens.push({ kind, text })
  }
  const match = (re: RegExp) => {
    re.lastIndex = i
    const m = re.exec(code)
    return m && m.index === i ? m : null
  }
  /** A "<" starts a tag unless it follows a value, as in generics or comparisons. */
  const canOpenTag = () => {
    for (let j = i - 1; j >= 0; j--) {
      const ch = code[j]
      if (ch === " " || ch === "\t") continue
      return !/[\w$)\]]/.test(ch)
    }
    return true
  }

  const comment = /\{\/\*[\s\S]*?\*\/\}|\/\*[\s\S]*?\*\/|\/\/[^\n]*/y
  const string = /`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y
  const tagOpen = /<\/?(?=[A-Za-z])/y
  const tagName = /[A-Za-z][\w.:-]*/y
  const attrName = /[A-Za-z_$][\w$:-]*/y
  const word = /[A-Za-z_$][\w$]*/y
  const number = /\d[\d_]*(?:\.\d+)?/y
  const space = /\s+/y
  const text = /[^<{]+/y

  while (i < code.length) {
    const top = stack[stack.length - 1]
    let m: RegExpExecArray | null

    // Inside a tag: attributes, strings and {…} values.
    if (tag) {
      if (tag.braces === 0 && code.startsWith("/>", i)) {
        push("punct", "/>")
        tag = null
        i += 2
        continue
      }
      if (tag.braces === 0 && code[i] === ">") {
        push("punct", ">")
        if (tag.closing) {
          if (top?.mode === "children") stack.pop()
        } else {
          stack.push({ mode: "children" })
        }
        tag = null
        i += 1
        continue
      }
      if ((m = match(space)) || (m = match(comment))) push(m[0].trim() ? "comment" : "plain", m[0])
      else if ((m = match(string))) push("string", m[0])
      else if (tag.braces === 0 && (m = match(attrName))) push("attr", m[0])
      else if (tag.braces > 0 && (m = match(word))) push(keywords.has(m[0]) ? "keyword" : "plain", m[0])
      else {
        const ch = code[i]
        if (ch === "{") tag.braces += 1
        if (ch === "}") tag.braces = Math.max(0, tag.braces - 1)
        push(tag.braces === 0 && (ch === "=" || ch === "{" || ch === "}") ? "punct" : "plain", ch)
        i += 1
        continue
      }
      i += m[0].length
      continue
    }

    // A tag opens, in code or in JSX children.
    if ((top?.mode === "children" || canOpenTag()) && (m = match(tagOpen))) {
      push("punct", m[0])
      i += m[0].length
      const name = match(tagName)
      if (name) {
        push("tag", name[0])
        i += name[0].length
      }
      tag = { closing: m[0] === "</", braces: 0 }
      continue
    }

    // JSX children: text stays plain; "{" starts an expression.
    if (top?.mode === "children") {
      if ((m = match(comment))) push("comment", m[0])
      else if (code[i] === "{") {
        push("punct", "{")
        stack.push({ mode: "expr", depth: 1 })
        i += 1
        continue
      } else if ((m = match(text))) push("plain", m[0])
      else {
        push("plain", code[i])
        i += 1
        continue
      }
      i += m[0].length
      continue
    }

    // Code.
    if ((m = match(space))) push("plain", m[0])
    else if ((m = match(comment))) push("comment", m[0])
    else if ((m = match(string))) push("string", m[0])
    else if ((m = match(word))) push(keywords.has(m[0]) ? "keyword" : "plain", m[0])
    else if ((m = match(number))) push("number", m[0])
    else {
      const ch = code[i]
      if (top?.mode === "expr") {
        if (ch === "{") top.depth += 1
        if (ch === "}") {
          top.depth -= 1
          if (top.depth === 0) {
            stack.pop()
            push("punct", "}")
            i += 1
            continue
          }
        }
      }
      push("plain", ch)
      i += 1
      continue
    }
    i += m[0].length
  }
  return tokens
}

/** Splits tokens into lines, keeping each token's colour. */
function toLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]]
  for (const token of tokens) {
    const parts = token.text.split("\n")
    parts.forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ kind: token.kind, text: part })
    })
  }
  return lines
}

/**
 * A highlighted, line-numbered code listing on the terminal surface. Line
 * numbers are generated content, so copying the code never picks them up.
 */
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const lines = React.useMemo(() => toLines(tokenize(code.replace(/\n$/, ""))), [code])
  const gutter = String(lines.length).length

  return (
    <pre
      className={cn(
        "dark overflow-auto bg-terminal py-5 font-mono text-code text-terminal-foreground [scrollbar-width:thin] sm:py-6",
        className
      )}
      style={{ "--bk-gutter": `${gutter}ch` } as React.CSSProperties}
    >
      <code className="grid min-w-max [counter-reset:line]">
        {lines.map((line, index) => (
          <span
            key={index}
            className={cn(
              "block pr-5 pl-4 [counter-increment:line] sm:pr-6",
              "before:mr-5 before:inline-block before:w-(--bk-gutter) before:text-right before:text-muted-foreground/70 before:content-[counter(line)] before:select-none"
            )}
          >
            {line.length === 0 ? "​" : null}
            {line.map((token, t) =>
              kindClass[token.kind] ? (
                <span key={t} className={kindClass[token.kind]}>
                  {token.text}
                </span>
              ) : (
                <React.Fragment key={t}>{token.text}</React.Fragment>
              )
            )}
          </span>
        ))}
      </code>
    </pre>
  )
}
