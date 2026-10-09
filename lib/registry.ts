/**
 * The Blocks registry: every foundation page, component, molecule and
 * template the viewer knows about. Docs modules live at
 *   docs/components/<slug>.tsx  and  docs/molecules/<slug>.tsx
 * and are loaded through docs/index.ts.
 */

export interface RegistryEntry {
  slug: string
  title: string
  description: string
  group: string
}

export interface TemplateEntry extends RegistryEntry {
  /** Live route of the full-page template. */
  href: string
  kind: "marketing" | "auth" | "app"
}

export const foundations: RegistryEntry[] = [
  { slug: "colors", title: "Colour", group: "Foundations", description: "Primitive scales in OKLCH and the semantic roles that map them to light and dark themes." },
  { slug: "typography", title: "Typography", group: "Foundations", description: "Plus Jakarta Sans and Geist Mono, type roles from display to caption, and the size scale." },
  { slug: "spacing", title: "Spacing & layout", group: "Foundations", description: "The 4px spacing unit, page gutters, section rhythm, containers and breakpoints." },
  { slug: "shape", title: "Shape", group: "Foundations", description: "Corner radius scale from chips to panels, and borders instead of shadows." },
  { slug: "motion", title: "Motion", group: "Foundations", description: "Durations and easing curves, with reduced-motion behaviour." },
  { slug: "iconography", title: "Iconography", group: "Foundations", description: "Lucide icons: sizes, stroke and how they pair with text." },
  { slug: "tokens", title: "All tokens", group: "Foundations", description: "Every design token with its CSS variable, Tailwind utility and value in both themes." },
]

export const componentGroups = ["Actions", "Forms", "Overlays", "Navigation", "Data display", "Feedback", "Conversation"] as const

export const components: RegistryEntry[] = [
  // Actions
  { slug: "button", title: "Button", group: "Actions", description: "Pill-shaped actions in primary, secondary, outline, ghost, link, brand, inverse and destructive variants." },
  { slug: "button-group", title: "Button group", group: "Actions", description: "Related buttons joined into one control." },
  { slug: "toggle", title: "Toggle", group: "Actions", description: "A button that stays pressed or unpressed, for formatting and view options in toolbars." },
  { slug: "toggle-group", title: "Toggle group", group: "Actions", description: "A set of toggles where one or many can be on." },
  // Forms
  { slug: "input", title: "Input", group: "Forms", description: "Single-line text field on a muted fill, in three sizes, with focus, invalid and disabled states." },
  { slug: "input-group", title: "Input group", group: "Forms", description: "Inputs with icons, text or buttons attached." },
  { slug: "input-otp", title: "One-time code", group: "Forms", description: "Segmented input for verification codes." },
  { slug: "textarea", title: "Textarea", group: "Forms", description: "Multi-line text field that grows with its content, for messages, notes and descriptions." },
  { slug: "label", title: "Label", group: "Forms", description: "Accessible label for a form control." },
  { slug: "field", title: "Field", group: "Forms", description: "Label, control, description and error laid out together." },
  { slug: "checkbox", title: "Checkbox", group: "Forms", description: "Select one or more independent options." },
  { slug: "radio-group", title: "Radio group", group: "Forms", description: "Select exactly one option from a set." },
  { slug: "switch", title: "Switch", group: "Forms", description: "Turn a setting on or off immediately." },
  { slug: "slider", title: "Slider", group: "Forms", description: "Pick a value or range by dragging." },
  { slug: "select", title: "Select", group: "Forms", description: "Choose one option from a styled list." },
  { slug: "native-select", title: "Native select", group: "Forms", description: "The platform select, styled to match." },
  { slug: "combobox", title: "Combobox", group: "Forms", description: "Searchable select with single or multiple values." },
  { slug: "calendar", title: "Calendar", group: "Forms", description: "Pick a date or a date range." },
  // Overlays
  { slug: "dialog", title: "Dialog", group: "Overlays", description: "A focused task on top of the page." },
  { slug: "alert-dialog", title: "Alert dialog", group: "Overlays", description: "Confirm a destructive or important action." },
  { slug: "sheet", title: "Sheet", group: "Overlays", description: "A panel that slides in from an edge." },
  { slug: "drawer", title: "Drawer", group: "Overlays", description: "A bottom panel with drag to dismiss, for touch." },
  { slug: "popover", title: "Popover", group: "Overlays", description: "Rich content anchored to a trigger." },
  { slug: "hover-card", title: "Hover card", group: "Overlays", description: "A preview shown on hover or focus." },
  { slug: "tooltip", title: "Tooltip", group: "Overlays", description: "A short label for an icon or control." },
  { slug: "dropdown-menu", title: "Dropdown menu", group: "Overlays", description: "Actions and options from a button." },
  { slug: "context-menu", title: "Context menu", group: "Overlays", description: "Actions on right-click or long-press." },
  { slug: "menubar", title: "Menubar", group: "Overlays", description: "Desktop-style application menus." },
  { slug: "command", title: "Command menu", group: "Overlays", description: "Searchable list of commands, usually on ⌘K." },
  // Navigation
  { slug: "tabs", title: "Tabs", group: "Navigation", description: "Switch between views in the same place." },
  { slug: "breadcrumb", title: "Breadcrumb", group: "Navigation", description: "Where the current page sits in the hierarchy." },
  { slug: "pagination", title: "Pagination", group: "Navigation", description: "Move between pages of results." },
  { slug: "navigation-menu", title: "Navigation menu", group: "Navigation", description: "Site navigation with rich dropdown panels." },
  { slug: "sidebar", title: "Sidebar", group: "Navigation", description: "Collapsible app navigation." },
  // Data display
  { slug: "card", title: "Card", group: "Data display", description: "A flat, bordered container for related content." },
  { slug: "item", title: "Item", group: "Data display", description: "A row with media, content and actions." },
  { slug: "table", title: "Table", group: "Data display", description: "Rows and columns of data." },
  { slug: "chart", title: "Chart", group: "Data display", description: "Area, bar and line charts themed with chart tokens." },
  { slug: "avatar", title: "Avatar", group: "Data display", description: "A person or team, with an initials fallback." },
  { slug: "badge", title: "Badge", group: "Data display", description: "Status and counts in app UI." },
  { slug: "kbd", title: "Keyboard key", group: "Data display", description: "Keyboard shortcuts." },
  { slug: "accordion", title: "Accordion", group: "Data display", description: "Stacked sections that expand." },
  { slug: "collapsible", title: "Collapsible", group: "Data display", description: "Show and hide one region." },
  { slug: "carousel", title: "Carousel", group: "Data display", description: "Swipeable slides." },
  { slug: "aspect-ratio", title: "Aspect ratio", group: "Data display", description: "Media at a fixed ratio." },
  { slug: "scroll-area", title: "Scroll area", group: "Data display", description: "Scrolling region with styled scrollbars." },
  { slug: "resizable", title: "Resizable", group: "Data display", description: "Panels the user can resize." },
  { slug: "separator", title: "Separator", group: "Data display", description: "A hairline between content." },
  { slug: "empty", title: "Empty state", group: "Data display", description: "What to show when there is nothing yet." },
  // Feedback
  { slug: "alert", title: "Alert", group: "Feedback", description: "An inline message about the page or a task." },
  { slug: "toast", title: "Toast", group: "Feedback", description: "Brief confirmation after an action." },
  { slug: "progress", title: "Progress", group: "Feedback", description: "How far a task has got." },
  { slug: "spinner", title: "Spinner", group: "Feedback", description: "Indeterminate loading." },
  { slug: "skeleton", title: "Skeleton", group: "Feedback", description: "Placeholder shapes while content loads." },
  // Conversation
  { slug: "message", title: "Message", group: "Conversation", description: "A chat message with avatar, header and footer." },
  { slug: "message-scroller", title: "Message scroller", group: "Conversation", description: "A conversation that stays pinned to the latest message." },
  { slug: "bubble", title: "Bubble", group: "Conversation", description: "Chat bubbles with reactions." },
  { slug: "attachment", title: "Attachment", group: "Conversation", description: "Files attached to a message or form." },
  { slug: "marker", title: "Marker", group: "Conversation", description: "Inline status markers in a conversation." },
  { slug: "questionnaire", title: "Questionnaire", group: "Conversation", description: "A multi-step question flow." },
]

export const moleculeGroups = ["Site", "Marketing sections", "Commerce & content", "App", "Account"] as const

export const molecules: RegistryEntry[] = [
  // Site
  { slug: "site-header", title: "Site header", group: "Site", description: "Header that turns solid on scroll, with a full-screen menu on phones." },
  { slug: "site-footer", title: "Site footer", group: "Site", description: "Footer with newsletter sign-up, link columns and status." },
  { slug: "section-heading", title: "Section heading", group: "Site", description: "Split heading: bold title on the left, supporting text on the right." },
  { slug: "logo-cloud", title: "Logo row", group: "Site", description: "A row of supported technologies or customer logos." },
  { slug: "cta-band", title: "Call to action", group: "Site", description: "Dark panel with a pitch, actions and an install command." },
  { slug: "newsletter-form", title: "Newsletter form", group: "Site", description: "Email capture with inline confirmation." },
  { slug: "install-command", title: "Install command", group: "Site", description: "A shell command with a copy button." },
  { slug: "code-window", title: "Code window", group: "Site", description: "Terminal or editor frame for code and output." },
  // Marketing sections
  { slug: "hero", title: "Hero", group: "Marketing sections", description: "Split hero with headline, actions and a product visual." },
  { slug: "feature-bento", title: "Feature bento", group: "Marketing sections", description: "Mixed-size feature tiles with small product visuals." },
  { slug: "steps", title: "Steps", group: "Marketing sections", description: "How it works, in a row of cards." },
  { slug: "pipeline-showcase", title: "Pipeline showcase", group: "Marketing sections", description: "Selectable steps beside a terminal that shows each step's output." },
  { slug: "comparison", title: "Comparison", group: "Marketing sections", description: "Side-by-side cards: you versus the alternative." },
  { slug: "testimonial", title: "Testimonial", group: "Marketing sections", description: "A large customer quote with a result." },
  { slug: "stats", title: "Stats", group: "Marketing sections", description: "A band of headline numbers." },
  { slug: "faq", title: "FAQ", group: "Marketing sections", description: "Questions and answers beside a heading." },
  { slug: "app-mockup", title: "App mockup", group: "Marketing sections", description: "A product screen built from real components." },
  // Commerce & content
  { slug: "pricing-plans", title: "Pricing plans", group: "Commerce & content", description: "Plan cards with a monthly or yearly switch and a featured plan." },
  { slug: "plan-matrix", title: "Plan comparison", group: "Commerce & content", description: "Feature table across plans." },
  { slug: "changelog-entry", title: "Changelog entry", group: "Commerce & content", description: "A dated release on a timeline." },
  { slug: "post-card", title: "Post card", group: "Commerce & content", description: "Blog post card, plus a featured layout." },
  { slug: "team-grid", title: "Team grid", group: "Commerce & content", description: "People with photos, names and roles." },
  { slug: "contact-panel", title: "Contact panel", group: "Commerce & content", description: "Contact form beside a dark panel of other ways to reach you." },
  // App
  { slug: "app-shell", title: "App shell", group: "App", description: "Sidebar navigation, top bar and content area, responsive down to mobile." },
  { slug: "page-header", title: "Page header", group: "App", description: "Title, description and actions at the top of an app page." },
  { slug: "stat-card", title: "Stat card", group: "App", description: "A metric with change and a small trend." },
  { slug: "chart-card", title: "Chart card", group: "App", description: "A titled chart with a period switch." },
  { slug: "data-table", title: "Data table", group: "App", description: "Search, filter, sort, select and paginate rows." },
  { slug: "activity-feed", title: "Activity feed", group: "App", description: "Recent events with people and timestamps." },
  { slug: "command-menu", title: "Command menu", group: "App", description: "⌘K palette for navigation and actions." },
  { slug: "user-menu", title: "User menu", group: "App", description: "Account, theme and sign-out menu." },
  { slug: "notifications", title: "Notifications", group: "App", description: "Notification popover with unread state." },
  // Account
  { slug: "auth-form", title: "Auth form", group: "Account", description: "Sign in and sign up with email and social providers." },
  { slug: "onboarding-steps", title: "Onboarding steps", group: "Account", description: "A multi-step setup flow with progress." },
  { slug: "settings-section", title: "Settings section", group: "Account", description: "A settings group: description on the left, controls on the right." },
  { slug: "billing-summary", title: "Billing summary", group: "Account", description: "Current plan, usage and payment method." },
  { slug: "members-list", title: "Members list", group: "Account", description: "Team members with roles and an invite dialog." },
  { slug: "danger-zone", title: "Danger zone", group: "Account", description: "Irreversible actions behind confirmation." },
]

export const templates: TemplateEntry[] = [
  // Marketing
  { slug: "home", title: "Home", kind: "marketing", group: "Marketing", href: "/live", description: "Landing page: hero, logo row, pipeline, feature bento, comparison, testimonial, open-source band and CTA." },
  { slug: "features", title: "Features", kind: "marketing", group: "Marketing", href: "/live/features", description: "Product tour with feature rows and a capability list." },
  { slug: "pricing", title: "Pricing", kind: "marketing", group: "Marketing", href: "/live/pricing", description: "Plans, comparison table and FAQ." },
  { slug: "changelog", title: "Changelog", kind: "marketing", group: "Marketing", href: "/live/changelog", description: "Releases on a timeline." },
  { slug: "blog", title: "Blog", kind: "marketing", group: "Marketing", href: "/live/blog", description: "Featured post, latest list and filters." },
  { slug: "blog-post", title: "Blog post", kind: "marketing", group: "Marketing", href: "/live/blog/post", description: "Article with contents, code and related posts." },
  { slug: "about", title: "About", kind: "marketing", group: "Marketing", href: "/live/about", description: "Mission, numbers, values and team." },
  { slug: "contact", title: "Contact", kind: "marketing", group: "Marketing", href: "/live/contact", description: "Contact form and other ways to get in touch." },
  { slug: "error-404", title: "Not found", kind: "marketing", group: "Marketing", href: "/live/error-404", description: "Page-not-found screen." },
  // Auth
  { slug: "sign-in", title: "Sign in", kind: "auth", group: "Account", href: "/live/sign-in", description: "Email, password and social sign-in." },
  { slug: "sign-up", title: "Sign up", kind: "auth", group: "Account", href: "/live/sign-up", description: "Create an account." },
  { slug: "forgot-password", title: "Reset password", kind: "auth", group: "Account", href: "/live/forgot-password", description: "Request a reset link." },
  { slug: "onboarding", title: "Onboarding", kind: "auth", group: "Account", href: "/live/onboarding", description: "Set up a workspace in three steps." },
  // App
  { slug: "dashboard", title: "Dashboard", kind: "app", group: "App", href: "/live/app", description: "Metrics, charts, recent deployments and activity." },
  { slug: "projects", title: "Projects", kind: "app", group: "App", href: "/live/app/projects", description: "Data table of projects with filters." },
  { slug: "settings", title: "Settings", kind: "app", group: "App", href: "/live/app/settings", description: "Profile, notifications and danger zone." },
  { slug: "billing", title: "Billing", kind: "app", group: "App", href: "/live/app/billing", description: "Plan, usage, payment method and invoices." },
  { slug: "team", title: "Team", kind: "app", group: "App", href: "/live/app/team", description: "Members, roles and invitations." },
]
