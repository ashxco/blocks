import * as React from "react"

/** Text with CSS variables such as --button-* kept whole and set in mono. */
export function TokenText({ text }: { text: string }) {
  const parts = text.split(/(--[a-z0-9-]+\*?)/g)
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className="font-mono text-code whitespace-nowrap text-foreground">
            {part}
          </code>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  )
}
