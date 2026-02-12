import { test, expect } from "@playwright/test";

test.setTimeout(60_000);

test("Authenticated UI: can create an article", async ({ page }) => {
    const title = `Automation Article ${Date.now()}`;

    await page.goto("/");
    await page.getByRole("link", { name: /new (post|article)/i }).click();
    await expect(page).toHaveURL(/editor/i, { timeout: 20_000 });

    const form = page.locator("form");
    const inputs = form.locator("input");
    const body = form.locator("textarea").first();

    await expect(inputs.first()).toBeVisible({ timeout: 20_000 });
    await inputs.nth(0).fill(title);
    await inputs.nth(1).fill("Created by Playwright");
    await body.fill("Hello from automation!");
    if (await inputs.count() >= 3) await inputs.nth(2).fill("playwright");

    await page.getByRole("button", { name: /publish/i }).click();
    await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 20_000 });
});
