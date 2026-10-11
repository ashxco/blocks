/**
 * The Blocks registry: every foundation page and component the viewer knows
 * about. Component docs modules live at docs/components/<slug>.tsx and are
 * loaded through docs/index.ts.
 */

export interface RegistryEntry {
  slug: string
  title: string
  description: string
  group: string
}

export const foundations: RegistryEntry[] = [
  {
    slug: "get-started",
    title: "Get started",
    group: "Foundations",
    description:
      "Install Blocks in a Next.js app with the shadcn CLI or from npm: the base styles, then any component.",
  },
  {
    slug: "themes",
    title: "Themes",
    group: "Foundations",
    description:
      "Presets that set the accent, neutrals, radii and fonts in light and dark, and how to make your own.",
  },
  {
    slug: "colors",
    title: "Colour",
    group: "Foundations",
    description:
      "The theme's accent and neutral scales, the fixed OKLCH scales behind them, and the semantic roles that map them to light and dark.",
  },
  {
    slug: "typography",
    title: "Typography",
    group: "Foundations",
    description:
      "The theme's heading, text and mono families, type roles from display to caption, and the size scale.",
  },
  {
    slug: "spacing",
    title: "Spacing & layout",
    group: "Foundations",
    description:
      "The 4px spacing unit, page gutters, section rhythm, containers, the system grid and breakpoints.",
  },
  {
    slug: "shape",
    title: "Shape",
    group: "Foundations",
    description:
      "The theme's radius scale and component radii, from chips to panels, and borders instead of shadows.",
  },
  {
    slug: "motion",
    title: "Motion",
    group: "Foundations",
    description: "Durations and easing curves, with reduced-motion behaviour.",
  },
  {
    slug: "iconography",
    title: "Iconography",
    group: "Foundations",
    description: "Lucide icons: sizes, stroke and how they pair with text.",
  },
  {
    slug: "tokens",
    title: "All tokens",
    group: "Foundations",
    description:
      "Every design token with its CSS variable, Tailwind utility and value in light and dark, for any theme.",
  },
]

export const componentGroups = [
  "Layout",
  "Actions",
  "Forms",
  "Overlays",
  "Navigation",
  "Data display",
  "Feedback",
  "Conversation",
] as const

export const components: RegistryEntry[] = [
  // Layout
  {
    slug: "container",
    title: "Container",
    group: "Layout",
    description:
      "A centred column at a container width, with the page gutters on both sides.",
  },
  {
    slug: "stack",
    title: "Stack",
    group: "Layout",
    description:
      "Children in a vertical flow, spaced by one gap from the spacing scale.",
  },
  {
    slug: "inline",
    title: "Inline",
    group: "Layout",
    description:
      "A row of buttons, badges or metadata that wraps when it runs out of room.",
  },
  {
    slug: "grid",
    title: "Grid",
    group: "Layout",
    description:
      "The system grid of 4, 8 and 12 columns, with items that span columns at each breakpoint.",
  },
  // Actions
  {
    slug: "button",
    title: "Button",
    group: "Actions",
    description:
      "Actions in primary, secondary, outline, ghost, link, brand, inverse and destructive variants, shaped by the theme's button radius.",
  },
  {
    slug: "button-group",
    title: "Button group",
    group: "Actions",
    description: "Related buttons joined into one control.",
  },
  {
    slug: "toggle",
    title: "Toggle",
    group: "Actions",
    description:
      "A button that stays pressed or unpressed, for formatting and view options in toolbars.",
  },
  {
    slug: "toggle-group",
    title: "Toggle group",
    group: "Actions",
    description: "A set of toggles where one or many can be on.",
  },
  // Forms
  {
    slug: "input",
    title: "Input",
    group: "Forms",
    description:
      "Single-line text field on a muted fill, in three sizes, with focus, invalid and disabled states.",
  },
  {
    slug: "input-group",
    title: "Input group",
    group: "Forms",
    description: "Inputs with icons, text or buttons attached.",
  },
  {
    slug: "input-otp",
    title: "One-time code",
    group: "Forms",
    description: "Segmented input for verification codes.",
  },
  {
    slug: "textarea",
    title: "Textarea",
    group: "Forms",
    description:
      "Multi-line text field that grows with its content, for messages, notes and descriptions.",
  },
  {
    slug: "label",
    title: "Label",
    group: "Forms",
    description: "Accessible label for a form control.",
  },
  {
    slug: "field",
    title: "Field",
    group: "Forms",
    description: "Label, control, description and error laid out together.",
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    group: "Forms",
    description: "Select one or more independent options.",
  },
  {
    slug: "radio-group",
    title: "Radio group",
    group: "Forms",
    description: "Select exactly one option from a set.",
  },
  {
    slug: "switch",
    title: "Switch",
    group: "Forms",
    description: "Turn a setting on or off immediately.",
  },
  {
    slug: "slider",
    title: "Slider",
    group: "Forms",
    description: "Pick a value or range by dragging.",
  },
  {
    slug: "select",
    title: "Select",
    group: "Forms",
    description: "Choose one option from a styled list.",
  },
  {
    slug: "native-select",
    title: "Native select",
    group: "Forms",
    description: "The platform select, styled to match.",
  },
  {
    slug: "combobox",
    title: "Combobox",
    group: "Forms",
    description: "Searchable select with single or multiple values.",
  },
  {
    slug: "calendar",
    title: "Calendar",
    group: "Forms",
    description: "Pick a date or a date range.",
  },
  // Overlays
  {
    slug: "dialog",
    title: "Dialog",
    group: "Overlays",
    description: "A focused task on top of the page.",
  },
  {
    slug: "alert-dialog",
    title: "Alert dialog",
    group: "Overlays",
    description: "Confirm a destructive or important action.",
  },
  {
    slug: "sheet",
    title: "Sheet",
    group: "Overlays",
    description: "A panel that slides in from an edge.",
  },
  {
    slug: "drawer",
    title: "Drawer",
    group: "Overlays",
    description: "A bottom panel with drag to dismiss, for touch.",
  },
  {
    slug: "popover",
    title: "Popover",
    group: "Overlays",
    description: "Rich content anchored to a trigger.",
  },
  {
    slug: "hover-card",
    title: "Hover card",
    group: "Overlays",
    description: "A preview shown on hover or focus.",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    group: "Overlays",
    description: "A short label for an icon or control.",
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown menu",
    group: "Overlays",
    description: "Actions and options from a button.",
  },
  {
    slug: "context-menu",
    title: "Context menu",
    group: "Overlays",
    description: "Actions on right-click or long-press.",
  },
  {
    slug: "menubar",
    title: "Menubar",
    group: "Overlays",
    description: "Desktop-style application menus.",
  },
  {
    slug: "command",
    title: "Command",
    group: "Overlays",
    description:
      "Searchable list of commands, the building block of a ⌘K menu.",
  },
  // Navigation
  {
    slug: "tabs",
    title: "Tabs",
    group: "Navigation",
    description: "Switch between views in the same place.",
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    group: "Navigation",
    description: "Where the current page sits in the hierarchy.",
  },
  {
    slug: "pagination",
    title: "Pagination",
    group: "Navigation",
    description: "Move between pages of results.",
  },
  {
    slug: "navigation-menu",
    title: "Navigation menu",
    group: "Navigation",
    description: "Site navigation with rich dropdown panels.",
  },
  {
    slug: "sidebar",
    title: "Sidebar",
    group: "Navigation",
    description:
      "App navigation down the left edge. It collapses to icons and opens as a sheet on phones.",
  },
  // Data display
  {
    slug: "card",
    title: "Card",
    group: "Data display",
    description: "A flat, bordered container for related content.",
  },
  {
    slug: "item",
    title: "Item",
    group: "Data display",
    description: "A row with media, content and actions.",
  },
  {
    slug: "table",
    title: "Table",
    group: "Data display",
    description:
      "Rows and columns for data people scan and compare, such as invoices or tasks.",
  },
  {
    slug: "chart",
    title: "Chart",
    group: "Data display",
    description: "Area, bar and line charts themed with chart tokens.",
  },
  {
    slug: "avatar",
    title: "Avatar",
    group: "Data display",
    description: "A person or team, with an initials fallback.",
  },
  {
    slug: "badge",
    title: "Badge",
    group: "Data display",
    description: "Status and counts in app UI.",
  },
  {
    slug: "kbd",
    title: "Keyboard key",
    group: "Data display",
    description:
      "Keys and shortcuts shown inline in menus, tooltips and help text.",
  },
  {
    slug: "accordion",
    title: "Accordion",
    group: "Data display",
    description:
      "Stacked sections that expand in place, for FAQs and long lists of details.",
  },
  {
    slug: "collapsible",
    title: "Collapsible",
    group: "Data display",
    description:
      "Shows and hides one region, such as advanced options or the rest of a list.",
  },
  {
    slug: "carousel",
    title: "Carousel",
    group: "Data display",
    description:
      "A row of slides people swipe or step through, for screenshots, quotes and posts.",
  },
  {
    slug: "aspect-ratio",
    title: "Aspect ratio",
    group: "Data display",
    description:
      "Keeps images, video and embeds at a fixed ratio as their width changes.",
  },
  {
    slug: "scroll-area",
    title: "Scroll area",
    group: "Data display",
    description: "Scrolling region with styled scrollbars.",
  },
  {
    slug: "resizable",
    title: "Resizable",
    group: "Data display",
    description:
      "Panels people resize by dragging a handle, for split views such as a list beside its details.",
  },
  {
    slug: "separator",
    title: "Separator",
    group: "Data display",
    description:
      "A hairline that divides groups of content, menu items or toolbar controls.",
  },
  {
    slug: "empty",
    title: "Empty state",
    group: "Data display",
    description: "What to show when there is nothing yet.",
  },
  // Feedback
  {
    slug: "alert",
    title: "Alert",
    group: "Feedback",
    description: "An inline message about the page or a task.",
  },
  {
    slug: "toast",
    title: "Toast",
    group: "Feedback",
    description:
      "A brief confirmation after an action, with an undo or a link when there is one.",
  },
  {
    slug: "progress",
    title: "Progress",
    group: "Feedback",
    description:
      "How far an upload, import or setup has got, when the total is known.",
  },
  {
    slug: "spinner",
    title: "Spinner",
    group: "Feedback",
    description:
      "Shows that something is loading when there is no way to tell how long it will take.",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    group: "Feedback",
    description: "Placeholder shapes while content loads.",
  },
  // Conversation
  {
    slug: "message",
    title: "Message",
    group: "Conversation",
    description: "A chat message with avatar, header and footer.",
  },
  {
    slug: "message-scroller",
    title: "Message scroller",
    group: "Conversation",
    description: "A conversation that stays pinned to the latest message.",
  },
  {
    slug: "bubble",
    title: "Bubble",
    group: "Conversation",
    description: "Chat bubbles with reactions.",
  },
  {
    slug: "attachment",
    title: "Attachment",
    group: "Conversation",
    description: "Files attached to a message or form.",
  },
  {
    slug: "marker",
    title: "Marker",
    group: "Conversation",
    description: "Inline status markers in a conversation.",
  },
  {
    slug: "questionnaire",
    title: "Questionnaire",
    group: "Conversation",
    description: "A multi-step question flow.",
  },
]
