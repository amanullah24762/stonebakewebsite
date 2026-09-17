import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["mobile", 390, 844],
]) {
  await page.setViewportSize({ width, height });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  for (
    let y = 0;
    y < (await page.evaluate(() => document.body.scrollHeight));
    y += 700
  ) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(350);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  await page.screenshot({
    path: `/tmp/stone-bake-${name}-final.png`,
    fullPage: true,
  });
  const bad = await page
    .locator("img")
    .evaluateAll((images) =>
      images.filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
    );
  console.log(
    `${name}: ${bad.length} failed images, overflow: ${await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)}`,
  );
}
await browser.close();
