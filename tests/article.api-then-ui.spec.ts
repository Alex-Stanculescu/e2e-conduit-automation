import { test, expect } from "@playwright/test";
import "dotenv/config";

const API = process.env.CONDUIT_API_BASE_URL || "http://localhost:3000/api";

async function registerUser(request: any) {
  const uniq = Date.now();
  const payload = {
    user: {
      username: `qa_${uniq}`,
      email: `qa_${uniq}@example.com`,
      password: "Passw0rd!Passw0rd!",
    },
  };

  const res = await request.post(`${API}/users`, { data: payload });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  return json.user.token as string;
}

async function createArticle(request: any, token: string, title: string) {
  const payload = {
    article: {
      title,
      description: "created by automation",
      body: "hello from Playwright",
      tagList: ["qa", "playwright"],
    },
  };

  const res = await request.post(`${API}/articles`, {
    data: payload,
    headers: { Authorization: `Token ${token}` },
  });
  expect(res.ok()).toBeTruthy();

  const json = await res.json();
  return json.article.slug as string;
}

test("API→UI: created article is visible on its page", async ({ request, page }) => {
  const token = await registerUser(request);
  const title = `Automation Article ${Date.now()}`;

  const slug = await createArticle(request, token, title);

  await page.goto(`/article/${slug}`);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});
