import { test, expect } from "@playwright/test";

const pages = [
  { name: "home", path: "/" },
  { name: "resume", path: "/resume/" },
  {
    name: "blog-scaling-engineering-squads",
    path: "/blog/scaling-engineering-squads/",
  },
  {
    name: "blog-communication-in-hard-times",
    path: "/blog/communication-in-hard-times/",
  },
  {
    name: "blog-fair-background-file-processing",
    path: "/blog/fair-background-file-processing/",
  },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport });

    for (const pageUnderTest of pages) {
      test(`${pageUnderTest.name} matches its visual baseline`, async ({
        page,
      }) => {
        await page.goto(pageUnderTest.path);
        // Full-page screenshots do not trigger lazy-loaded images. Remove this
        // workaround when https://github.com/microsoft/playwright/issues/19861
        // is resolved.
        await page
          .locator('img[loading="lazy"]')
          .evaluateAll(async (images) => {
            for (const image of images) image.loading = "eager";
            await Promise.all(images.map((image) => image.decode()));
          });

        await expect(page).toHaveScreenshot(
          `${pageUnderTest.name}-${viewport.name}.png`,
          {
            fullPage: true,
            timeout: 10000,
          },
        );
      });
    }
  });
}
