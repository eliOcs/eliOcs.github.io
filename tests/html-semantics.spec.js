import { test, expect } from "@playwright/test";

const PAGES = [
  "/",
  "/projects/",
  "/resume/",
  "/work-with-me/",
  "/blog/ai-library-migration-guide/",
  "/blog/ai-powered-review-filestage/",
  "/blog/ai-slop-proof/",
  "/blog/communication-in-hard-times/",
  "/blog/engineering-culture/",
  "/blog/fair-background-file-processing/",
  "/blog/fighting-free-trial-abuse/",
  "/blog/measure-what-matters/",
  "/blog/permission-systems-for-enterprise/",
  "/blog/permission-systems-for-enterprise/demo.html",
  "/blog/scaling-engineering-squads/",
  "/blog/simple-js-toolkit/",
  "/blog/vendor-lock-in-nightmares/",
  "/blog/writing-good-unit-tests/",
];

const BLOG_POSTS = PAGES.filter(
  (path) => path.startsWith("/blog/") && !path.endsWith("demo.html"),
);

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

test("pages expose one main content landmark", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    await expect(
      page.locator("main"),
      `${path} should have one main`,
    ).toHaveCount(1);
  }
});

test("blog posts separate article content from the consulting CTA", async ({
  page,
}) => {
  for (const path of BLOG_POSTS) {
    await page.goto(path);
    await expect(
      page.locator("main article"),
      `${path} should identify its article`,
    ).toHaveCount(1);
    await expect(
      page.locator("article header.page-header"),
      `${path} should identify its article header`,
    ).toHaveCount(1);
    await expect(
      page.locator("article .wwm-final-cta"),
      `${path} should keep its CTA outside the article`,
    ).toHaveCount(0);
    await expect(page.locator("main aside.wwm-final-cta")).toHaveCount(1);
  }
});
