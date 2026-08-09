import { test, expect } from "@playwright/test";

test("code samples preserve angle brackets and ampersands as text", async ({
  page,
}) => {
  await page.goto("/blog/simple-js-toolkit/");

  await expect(
    page.locator("pre").filter({ hasText: "QueryBuilder" }),
  ).toContainText("QueryBuilder<User, {}>");

  await page.goto("/blog/writing-good-unit-tests/");

  await expect(
    page.locator("pre").filter({ hasText: "gravatar.com" }),
  ).toContainText("?s=480&r=pg&d=https%3A");
});
