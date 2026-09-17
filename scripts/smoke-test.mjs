import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(baseURL, { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/stone-bake-desktop.png", fullPage: true });
for (const route of [
  "menu",
  "about",
  "offers",
  "gallery",
  "reviews",
  "contact",
  "order",
]) {
  const response = await page.goto(`${baseURL}/${route}`, {
    waitUntil: "networkidle",
  });
  assert.equal(response.status(), 200, route);
  assert.equal(
    await page.locator("h1").count(),
    1,
    `${route} must have one h1`,
  );
}
await page.goto(`${baseURL}/menu`);
await page.getByRole("button", { name: "Burgers", exact: true }).click();
await expect(page.locator(".food-card")).toHaveCount(3);
await page.getByRole("button", { name: "All favorites", exact: true }).click();
await page.getByRole("searchbox").fill("tikka");
await expect(page.locator(".food-card")).toHaveCount(1);
await page
  .getByRole("button", { name: "Add Chicken Tikka Pizza to order" })
  .first()
  .click();
const dialog = page.getByRole("dialog");
await dialog
  .getByRole("button", { name: "Add one Chicken Tikka Pizza" })
  .click();
assert.match(await dialog.innerText(), /Rs\. 2,398/);
await page.keyboard.press("Escape");
await page.reload();
await page.getByRole("button", { name: "Open cart, 2 items" }).click();
await dialog.getByRole("button", { name: "Continue to checkout" }).click();
await dialog.getByLabel("Your name").fill("Test Customer");
await dialog.getByLabel("Phone number").fill("03256120333");
await dialog.getByLabel("Delivery address").fill("Dina test address");
await page.evaluate(() => {
  window.open = (url) => {
    window.__orderUrl = url;
    return null;
  };
});
await dialog.getByRole("button", { name: "Send order on WhatsApp" }).click();
const url = await page.evaluate(() => window.__orderUrl);
assert.ok(url.startsWith("https://wa.me/923256120333?text="));
const message = new URL(url).searchParams.get("text");
assert.ok(message.includes("2 × Chicken Tikka Pizza"));
assert.ok(message.includes("Dina test address"));
assert.ok(message.includes("Rs. 2,398"));
await page.keyboard.press("Escape");
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(baseURL, { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/stone-bake-mobile.png", fullPage: true });
assert.equal(
  await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  ),
  false,
  "No mobile horizontal overflow",
);
await page.getByRole("button", { name: "Toggle navigation" }).click();
await page
  .getByRole("navigation", { name: "Mobile navigation" })
  .getByRole("link", { name: "Our Menu" })
  .click();
await page.waitForURL("**/menu");
assert.equal(
  await page.getByRole("navigation", { name: "Mobile navigation" }).count(),
  0,
);
await page.goto(`${baseURL}/menu?category=Burgers`);
await expect(
  page.locator(".food-card"),
  "Deep-link category filtering",
).toHaveCount(3);
assert.deepEqual(errors, [], "No browser runtime errors");
await browser.close();
console.log(
  "PASS: all routes, categories, search, cart quantities and persistence, WhatsApp payload, mobile navigation and overflow.",
);
