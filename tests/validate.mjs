import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const page = read("app/page.js");
const css = read("app/globals.css");
const data = read("data/content.js");
const layout = read("app/layout.js");
const pkg = JSON.parse(read("package.json"));

const ids = ["top", "main", "work", "expertise", "experience", "about", "contact"];
for (const id of ids) assert.match(page, new RegExp(`id="${id}"`), `Missing section #${id}`);
for (const href of ["#work", "#expertise", "#experience", "#about", "#contact"]) assert.ok(page.includes(href), `Missing href ${href}`);
assert.match(page, /className="skip-link"/);
assert.match(page, /<details className="mobile-nav">/);
assert.match(page, /aria-label="Primary navigation"/);
assert.match(page, /application\/ld\+json/);
assert.match(page, /className="hero-masthead"/);
assert.match(page, /className="method-grid"/);
assert.ok(!page.includes('className="hero-art"'), "Boxed hero art should not return");
assert.match(css, /\.method-note\s*\{/);
assert.ok(!css.includes('.section-dark-card {'), "Skills should not have separate card backgrounds");
assert.match(css, /prefers-reduced-motion: reduce/);
assert.match(css, /:focus-visible/);
assert.match(css, /@media \(max-width: 600px\)/);
assert.match(layout, /metadataBase/);
assert.match(layout, /canonical/);
// Social platforms do not render SVG og:images: the preview must be generated as PNG.
assert.ok(existsSync(new URL("../app/opengraph-image.js", import.meta.url)), "Missing PNG social preview (app/opengraph-image.js)");
assert.match(read("app/opengraph-image.js"), /image\/png/);
assert.ok(existsSync(new URL("../app/icon.svg", import.meta.url)), "Missing favicon (app/icon.svg)");
assert.ok(!/og-image\.svg|favicon\.svg/.test(layout), "Layout must not reference static icon/OG files that do not exist");
assert.ok(existsSync(new URL("../app/sitemap.js", import.meta.url)));
assert.ok(!/Automation coverage achieved|Test cases designed & executed|illustrative — edit the numbers/i.test(data), "Unverified statistics must not be displayed");
for (const legacy of ["Effects", "Typewriter", "Gallery", "Icons"]) {
  assert.ok(!existsSync(new URL(`../components/${legacy}.js`, import.meta.url)), `Dead component ${legacy}.js should stay deleted`);
}
// Motion must never hide content without JS, and must respect reduced motion.
assert.match(css, /\.motion-ready \.reveal:not\(\.in-view\)/, "Reveal styles must be gated behind .motion-ready");
assert.match(css, /animation-iteration-count: 1 !important/, "Reduced motion must stop infinite animations");
// Arrows (↗) promise navigation: only use them inside links.
assert.ok(!/<span aria-hidden="true">↗<\/span><\/(li|span)>/.test(page), "Decorative ↗ on a non-link");
// v3: loader, WebGL and metrics rules.
const { metrics, toolbelt } = await import("../data/content.js");
for (const m of metrics) {
  if (m.value !== null) assert.ok(m.source && m.source.trim().length > 3, `Metric "${m.label}" has a value but no source`);
}
assert.ok(metrics.some(m => m.value !== null), "At least one verified metric should be published");
assert.match(css, /\.loader \{ display: none; \}/, "Loader must be hidden unless JS opts in");
assert.match(css, /\.js\.intro \.loader/, "Loader must only show under .js.intro");
assert.match(layout, /prefers-reduced-motion: reduce[^"]*intro-done/, "Reduced-motion visitors must skip the intro");
const heroScan = read("components/HeroScan.js");
assert.ok(!/from "three"/.test(page + heroScan), "three.js must be imported dynamically, never in the main bundle");
assert.match(heroScan, /import\("three"\)/);
assert.match(heroScan, /visually-hidden/, "WebGL scene needs a text alternative");
assert.match(heroScan, /setMode\("fallback"\)/, "WebGL scene needs a no-WebGL fallback");
assert.ok(toolbelt.length >= 8, "Toolbelt should list the evidenced tools");
assert.ok(pkg.scripts.build && pkg.scripts.check && pkg.scripts["test:e2e"], "Missing build / check / test:e2e scripts");
console.log(`PASS: ${ids.length} section IDs, accessible navigation, SEO assets, motion settings and content checks.`);
