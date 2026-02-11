import { test, expect } from "@playwright/test";

test("UI smoke: homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "conduit" })).toBeVisible();
  await expect(page.getByText("Global Feed")).toBeVisible();
});
