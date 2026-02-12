import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const authFile = path.join(process.cwd(), "playwright", ".auth", "user.json");
const API = process.env.CONDUIT_API_BASE_URL || "http://localhost:3000/api";

test.setTimeout(60_000);

test("auth setup: persist storageState via API token", async ({ page, request }) => {
    fs.mkdirSync(path.dirname(authFile), { recursive: true });

    // 1) Register user via API (get token)
    const ts = Date.now();
    const username = `auto_user_${ts}`;
    const email = `auto_${ts}@example.com`;
    const password = "Password123!";

    const res = await request.post(`${API}/users`, {
        data: { user: { username, email, password } },
    });
    expect(res.ok()).toBeTruthy();

    const { user } = await res.json();
    const token: string = user.token;

    // 2) Inject token BEFORE app loads (works across Conduit variants)
    await page.addInitScript((t: string) => {
        window.localStorage.setItem("jwt", t);
        window.localStorage.setItem("token", t);
    }, token);

    // 3) Load app and verify logged-in UI
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const newPostLink = page.getByRole("link", { name: /new (post|article)/i });
    await expect(newPostLink).toBeVisible({ timeout: 20_000 });
    await expect(page.locator(`a[href*="@${username}"]`)).toBeVisible();

    // 4) Save state for chromium-auth
    await page.context().storageState({ path: authFile });
});
