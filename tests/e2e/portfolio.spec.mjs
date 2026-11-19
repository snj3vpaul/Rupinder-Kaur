import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SECTIONS = ["expertise", "work", "experience", "about", "contact"];
const isMobile = testInfo => testInfo.project.name === "mobile";

// Behave like a returning visitor (intro already seen) unless a test opts in.
test.beforeEach(async ({ page }, testInfo) => {
  if (!testInfo.title.includes("[intro]")) await page.addInitScript(() => sessionStorage.setItem("rk-intro", "1"));
});

test.describe("health", () => {
  test("loads with no console errors and no failed requests", async ({ page }) => {
    const problems = [];
    page.on("console", m => { if (m.type() === "error") problems.push(`console: ${m.text()}`); });
    page.on("pageerror", e => problems.push(`pageerror: ${e.message}`));
    page.on("response", r => { if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`); });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(problems).toEqual([]);
  });

  test("social preview image is a 1200x630 PNG and favicon resolves", async ({ page, request }) => {
    await page.goto("/");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    const ogPath = new URL(og).pathname + new URL(og).search;
    const res = await request.get(ogPath);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
    const icon = await page.locator('link[rel="icon"]').getAttribute("href");
    expect((await request.get(icon)).status()).toBe(200);
  });

  test("external links open safely", async ({ page }) => {
    await page.goto("/");
    for (const link of await page.locator('a[target="_blank"]').all()) {
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });

  test("decorative arrows only appear on real links", async ({ page }) => {
    await page.goto("/");
    const fakes = await page.locator(":not(a) > span:text-is('↗')").count();
    const certArrows = await page.locator(".certifications li").filter({ hasText: "↗" }).count();
    expect(fakes + certArrows).toBe(0);
  });
});

test.describe("navigation", () => {
  test("every nav link reaches its section and becomes the current location", async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo), "desktop nav only");
    await page.goto("/");
    for (const id of SECTIONS) {
      const link = page.locator(`.desktop-nav a[href="#${id}"]`);
      await link.click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
      await expect(link).toHaveAttribute("aria-current", "location");
    }
  });

  test("mobile menu closes after choosing a link, on Escape and on outside tap", async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo), "mobile nav only");
    await page.goto("/");
    const menu = page.locator(".mobile-nav");
    await menu.locator("summary").click();
    await expect(menu).toHaveAttribute("open", "");
    await menu.locator('nav a[href="#experience"]').click();
    await expect(menu).not.toHaveAttribute("open", "");
    await expect(page.locator("#experience-title")).toBeInViewport();

    await menu.locator("summary").click();
    await page.keyboard.press("Escape");
    await expect(menu).not.toHaveAttribute("open", "");

    await menu.locator("summary").click();
    await page.mouse.click(20, 400);
    await expect(menu).not.toHaveAttribute("open", "");
  });

  test("skip link moves focus to main content", async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo), "keyboard flow");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("interactions", () => {
  test("theme choice persists across reloads", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const before = await html.getAttribute("data-theme");
    await page.locator(".theme-toggle").click();
    const after = before === "dark" ? "light" : "dark";
    await expect(html).toHaveAttribute("data-theme", after);
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", after);
  });

  test("How I think suite finishes green and can be re-run", async ({ page }) => {
    await page.goto("/");
    const suite = page.locator("#how-i-think");
    await expect(suite.locator(".run-pass")).toHaveCount(4);
    await expect(suite.locator(".run-pass").last()).toHaveCSS("opacity", "1", { timeout: 6000 });
    await expect(suite.locator(".run-summary-text")).toContainText("4 passed");
    await suite.locator(".run-again").click();
    await expect(suite.locator(".run-pass").last()).toHaveCSS("opacity", "0");
    await expect(suite.locator(".run-pass").last()).toHaveCSS("opacity", "1", { timeout: 6000 });
  });

  test("copy email puts the address on the clipboard", async ({ page, context, browserName }, testInfo) => {
    test.skip(browserName !== "chromium", "clipboard permissions are chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/#contact");
    const button = page.locator(".copy-email");
    await button.click();
    await expect(button).toContainText("Copied");
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toMatch(/@/);
  });

  test("case files open and close from the work cards", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator(".work-toggle").first();
    const detail = page.locator("#work-detail");
    await expect(detail).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(detail.getByText("The challenge")).toBeVisible();
    await page.locator(".work-toggle").nth(2).click();
    await expect(detail).toContainText("CASE FILE 03");
    await page.locator(".work-toggle").nth(2).click();
    await expect(detail).toBeHidden();
  });

  test("spot the bug: misses are counted, the odd toggle is found", async ({ page }) => {
    await page.goto("/");
    const game = page.locator(".bug-game");
    await game.locator(".bug-toggle:not(.is-odd)").first().click();
    await expect(game.locator(".bug-game-status")).toContainText("1 miss");
    await game.locator(".bug-toggle.is-odd").click();
    await expect(game.locator(".bug-game-status")).toContainText("Logged as RK-102");
    await game.locator(".bug-reset").click();
    await expect(game.locator(".bug-game-status")).toContainText("Click the one");
  });

  test("tool marquee moves and lists every tool for assistive tech", async ({ page }) => {
    await page.goto("/");
    await page.locator(".marquee").scrollIntoViewIfNeeded();
    const track = page.locator(".marquee-track").first();
    await expect.poll(() => track.evaluate(el => el.style.transform)).not.toBe("");
    const a = await track.evaluate(el => el.style.transform);
    await page.waitForTimeout(600);
    const b = await track.evaluate(el => el.style.transform);
    expect(a).not.toEqual(b);
    await expect(page.locator(".marquee ul.visually-hidden li")).toHaveCount(15);
  });

  test("metrics count up and finish verified with a source", async ({ page }) => {
    await page.goto("/");
    await page.locator(".metrics").scrollIntoViewIfNeeded();
    const cells = page.locator(".metric");
    const n = await cells.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      await expect(cells.nth(i)).toHaveClass(/is-verified/, { timeout: 5000 });
      await expect(cells.nth(i).locator(".metric-source")).toContainText("Verified ·");
    }
    await expect(cells.first().locator(".metric-value")).toHaveText("4+");
  });
});

test.describe("intro and WebGL", () => {
  test("[intro] loader plays once, then never blocks the page", async ({ page }) => {
    await page.goto("/");
    const loader = page.locator(".loader");
    await expect(loader).toBeVisible();
    await expect(loader).toBeHidden({ timeout: 5000 });
    await page.locator(".bug-toggle").first().click(); // would fail if the loader intercepted clicks
    await page.reload();
    await expect(loader).toBeHidden();
  });

  test("hero scan renders WebGL or a labelled fallback", async ({ page }) => {
    await page.goto("/");
    const scan = page.locator(".hero-scan");
    await expect(scan).toHaveClass(/is-(webgl|fallback)/, { timeout: 8000 });
    if ((await scan.getAttribute("class")).includes("is-webgl")) {
      await expect(scan.locator(".scan-pin.is-found").first()).toBeVisible({ timeout: 9000 });
    } else {
      await expect(scan.locator(".hero-scan-layers")).toBeVisible();
    }
    await expect(scan.locator(".visually-hidden")).toContainText("issues");
  });

  test("work graphics draw on every card", async ({ page }) => {
    await page.goto("/");
    await page.locator("#work").scrollIntoViewIfNeeded();
    const canvases = page.locator(".work-canvas");
    await expect(canvases).toHaveCount(4);
    for (const c of await canvases.all()) {
      const box = await c.boundingBox();
      expect(box.width).toBeGreaterThan(100);
      expect(box.height).toBeGreaterThan(100);
    }
  });
});

test.describe("resilience", () => {
  test("all content is visible with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    for (const el of await page.locator(".reveal").all()) {
      await expect(el).toHaveCSS("opacity", "1");
    }
    await expect(page.locator(".loader")).toBeHidden();
    await expect(page.locator(".metric-value").first()).toHaveText("4+");
    await context.close();
  });

  test("reduced motion shows final state immediately", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(".loader")).toBeHidden();
    await page.locator("#contact").scrollIntoViewIfNeeded();
    for (const el of await page.locator(".reveal").all()) {
      await expect(el).toHaveClass(/in-view/);
    }
    await expect(page.locator(".run-pass").last()).toHaveCSS("opacity", "1");
    await context.close();
  });

  test("no horizontal overflow at any section", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("accessibility", () => {
  for (const theme of ["light", "dark"]) {
    test(`no serious or critical axe violations (${theme})`, async ({ page }) => {
      await page.addInitScript(t => localStorage.setItem("rk-theme", t), theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const blocking = results.violations.filter(v => ["serious", "critical"].includes(v.impact));
      expect(blocking.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
    });
  }
});
