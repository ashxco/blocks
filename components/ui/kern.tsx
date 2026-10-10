import * as React from "react"

/*
 * Plus Jakarta Sans, the default theme's heading font, keeps wide side
 * bearings on commas and full stops. At display sizes, with the type roles'
 * tight tracking, they look detached from the word before them ("Ship
 * anything ."). Kern pulls them back in.
 *
 * How far depends on the theme's heading font, so the pull is a themed
 * token, --kern-pull (component.kern.pull). Each theme sets it for its
 * heading face: a face with wide bearings, or a monospaced one that gives
 * every mark a full cell, needs a larger pull; a face that already sets its
 * marks close to the letter needs little or none. Never hard-code a pull.
 *
 * Use it inside text-hero, text-display, text-h1 and text-h2 headings:
 *
 *   <h2 className="text-h2 text-foreground"><Kern>{title}</Kern></h2>
 *
 * Strings are kerned wherever they sit: directly, in fragments and in plain
 * elements such as a highlighted <span>. Components are left alone.
 */

/** Pull applied to a punctuation mark that ends a word: the theme's --kern-pull. */
const PUNCT_PULL = "-ms-(--kern-pull)"

/** A sentence mark that ends a word: followed by a space or the end of the text. */
const TRAILING_MARK = /(?<=[\p{L}\p{N}’”)])([.,;:!?])(?=\s|$)/u
/** The same mark at the very start of a string that follows an element. */
const LEADING_MARK = /^([.,;:!?])(?=\s|$)/u

/** One punctuation mark, kerned in to the word before it. */
function Punct({ children }: { children: React.ReactNode }) {
  return (
    <span data-slot="punct" className={PUNCT_PULL}>
      {children}
    </span>
  )
}

function kernString(text: string, afterElement: boolean, keyPrefix: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let rest = text

  if (afterElement) {
    const leading = LEADING_MARK.exec(rest)
    if (leading) {
      parts.push(<Punct key={`${keyPrefix}l`}>{leading[1]}</Punct>)
      rest = rest.slice(leading[1].length)
    }
  }

  const pieces = rest.split(TRAILING_MARK)
  pieces.forEach((piece, index) => {
    if (!piece) return
    parts.push(
      index % 2 === 1 ? (
        <Punct key={`${keyPrefix}${index}`}>{piece}</Punct>
      ) : (
        <React.Fragment key={`${keyPrefix}${index}`}>{piece}</React.Fragment>
      )
    )
  })

  if (parts.length === 1 && !afterElement && pieces.length === 1) return text
  return parts
}

/** Kerns a list of siblings. The result is spread back as static children, so no keys are needed. */
function kernChildren(children: React.ReactNode[], keyPrefix: string): React.ReactNode[] {
  let previousWasElement = false
  return children.map((child, index) => {
    const kerned = kernNode(child, previousWasElement, `${keyPrefix}${index}.`)
    previousWasElement = React.isValidElement(child)
    return kerned
  })
}

function kernNode(node: React.ReactNode, afterElement: boolean, keyPrefix: string): React.ReactNode {
  if (typeof node === "string") return kernString(node, afterElement, keyPrefix)

  if (Array.isArray(node)) return kernChildren(node, keyPrefix)

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    const isPlain = node.type === React.Fragment || typeof node.type === "string"
    const { children } = node.props
    if (!isPlain || children == null) return node
    return Array.isArray(children)
      ? React.cloneElement(node, undefined, ...kernChildren(children, `${keyPrefix}c`))
      : React.cloneElement(node, undefined, kernNode(children, false, `${keyPrefix}c`))
  }

  return node
}

/** A heading's text with every word-ending comma, full stop, colon and question mark kerned in. */
function Kern({ children }: { children?: React.ReactNode }) {
  if (Array.isArray(children)) return React.createElement(React.Fragment, null, ...kernChildren(children, "k"))
  return <>{kernNode(children, false, "k")}</>
}

export { Kern, Punct }
