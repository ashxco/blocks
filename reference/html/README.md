# Marketing page templates

Static HTML templates with placeholder content. Open `templates.html` in a browser to see them all.

| Page | File |
|---|---|
| Home | `index.html` |
| Features | `features.html` |
| Pricing (monthly/yearly toggle, FAQ) | `pricing.html` |
| Changelog | `changelog.html` |
| Blog index (category filter) | `blog.html` |
| Blog post | `blog-post.html` |
| About | `about.html` |
| Contact (form) | `contact.html` |
| 404 | `404.html` |

## Customising

- **Brand:** replace "Lumen" and the placeholder copy in each page.
- **Look:** edit the tokens at the top of `assets/styles.css` (colours, accent, glow colours, fonts, radii). Every page uses that one stylesheet.
- **Behaviour:** `assets/site.js` handles the mobile menu, the home page pipeline steps, the pricing toggle, the blog filter and the placeholder form confirmations. Forms don't send anything yet.
- **Fonts:** Plus Jakarta Sans and Geist Mono from Google Fonts.

No build step or dependencies. To port into a Next.js + shadcn/ui app, copy the tokens into your Tailwind theme and rebuild each section as a component.
