import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SECTIONS = ["work", "expertise", "experience", "about", "contact"];
const isMobile = testInfo => testInfo.project.name === "mobile";

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

  test("project details expand and collapse", async ({ page }) => {
    await page.goto("/");
    const details = page.locator(".project-details").first();
    await details.locator("summary").click();
    await expect(details.getByText("The challenge")).toBeVisible();
    await details.locator("summary").click();
    await expect(details.getByText("The challenge")).toBeHidden();
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
    await context.close();
  });

  test("reduced motion shows final state immediately", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
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
