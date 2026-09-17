import { chromium } from "@playwright/test";
import assert from "node:assert/strict";

const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 950 },
  });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.locator(".hero-copy.is-revealed").waitFor();
  const words = page.locator("h1 .motion-word");
  assert.equal(await words.count(), 6);
  assert.equal(
    await words.first().evaluate((el) => getComputedStyle(el).animationName),
    "word-reveal",
  );
  assert.equal(
    await words.last().evaluate((el) => getComputedStyle(el).animationDelay),
    "0.5s",
  );
  await page.waitForTimeout(1600);
  await page.screenshot({ path: "/tmp/stone-bake-reference-desktop.png" });
  const ribbon = page.locator(".flavor-marquee");
  await ribbon.scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    document.querySelector(".flavor-marquee")?.classList.contains("is-in-view"),
  );
  const track = page.locator(".flavor-track");
  await page.mouse.move(0, 0);
  assert.equal(
    await track.evaluate((el) => getComputedStyle(el).animationPlayState),
    "running",
  );
  await page.getByRole("button", { name: "Pause moving banner" }).click();
  assert.equal(
    await track.evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
  );
  await page.getByRole("button", { name: "Play moving banner" }).click();
  await page.keyboard.press("Tab");
  await page.mouse.move(0, 0);
  assert.equal(
    await track.evaluate((el) => getComputedStyle(el).animationPlayState),
    "running",
  );
  const card = page.locator(".food-grid .reveal").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    document
      .querySelector(".food-grid .reveal")
      ?.classList.contains("is-revealed"),
  );
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `No overflow at ${width}px`,
    );
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await words.first().evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  assert.equal(
    await track.evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  assert.equal(
    await page.locator('.flavor-group[aria-hidden="true"]').isVisible(),
    false,
  );
  assert.equal(
    await page.getByRole("button", { name: "Pause moving banner" }).isVisible(),
    false,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "/tmp/stone-bake-reference-mobile.png" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: word timing, scroll reveal, marquee pause/resume, responsive overflow, reduced motion, and browser errors.",
  );
} finally {
  await browser.close();
}
