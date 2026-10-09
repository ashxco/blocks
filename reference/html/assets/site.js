// Shared behaviour for the marketing templates. No dependencies.
(() => {
  const $$ = (s) => document.querySelectorAll(s);

  // Header: solid background once the page scrolls, full-screen menu on small screens
  const header = document.querySelector("[data-header]");
  const menuBtn = document.querySelector("[data-menu]");
  const sheet = document.querySelector("[data-sheet]");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (menuBtn && sheet) {
    const setOpen = (open) => {
      sheet.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      header.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
    };
    menuBtn.addEventListener("click", () => setOpen(sheet.hidden));
    sheet.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) setOpen(false); });
    matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }

  // Copy-to-clipboard buttons
  $$("[data-copy]").forEach((btn) => btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); } catch { /* clipboard unavailable */ }
    btn.classList.add("done");
    setTimeout(() => btn.classList.remove("done"), 1200);
  }));

  // Home: pipeline steps switch the terminal output
  const steps = $$("[data-step]");
  if (steps.length) {
    const logs = $$("[data-log]");
    let current = 0, timer;
    const show = (i) => {
      current = i;
      steps.forEach((s, j) => { s.classList.toggle("on", j === i); s.setAttribute("aria-pressed", String(j === i)); });
      logs.forEach((l, j) => l.classList.toggle("on", j === i));
    };
    steps.forEach((s, i) => s.addEventListener("click", () => { clearInterval(timer); show(i); }));
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setInterval(() => show((current + 1) % steps.length), 4500);
    }
  }

  // Pricing: monthly / yearly toggle
  const billing = $$("[data-billing]");
  billing.forEach((btn) => btn.addEventListener("click", () => {
    const period = btn.dataset.billing;
    billing.forEach((b) => { b.classList.toggle("on", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });
    $$("[data-monthly]").forEach((el) => { el.textContent = el.dataset[period]; });
  }));

  // Blog: category filter
  const chips = $$("[data-filter]");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    const cat = chip.dataset.filter;
    chips.forEach((c) => c.classList.toggle("on", c === chip));
    $$("[data-cat]").forEach((p) => { p.hidden = cat !== "All" && p.dataset.cat !== cat; });
  }));

  // Placeholder forms: show the confirmation instead of submitting
  $$("[data-fake-form]").forEach((form) => form.addEventListener("submit", (e) => {
    e.preventDefault();
    const done = form.querySelector(".form-done");
    if (done) done.hidden = false;
    form.reset();
  }));
})();
