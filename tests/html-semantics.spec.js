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

const INDEXABLE_PAGES = PAGES.filter((path) => !path.endsWith("demo.html"));

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

test("blog dates expose machine-readable publication dates", async ({
  page,
}) => {
  for (const path of BLOG_POSTS) {
    await page.goto(path);

    const publishedTime = await page
      .locator('meta[property="article:published_time"]')
      .getAttribute("content");
    const visibleDate = page.locator("article time[datetime]");

    await expect(
      visibleDate,
      `${path} should expose its visible date`,
    ).toHaveCount(1);
    await expect(visibleDate).toHaveAttribute(
      "datetime",
      publishedTime.slice(0, 10),
    );
  }

  await page.goto("/");
  await expect(page.locator(".blog-post-preview time[datetime]")).toHaveCount(
    BLOG_POSTS.length,
  );
});

test("indexable pages declare a self-referencing canonical URL", async ({
  page,
}) => {
  for (const path of INDEXABLE_PAGES) {
    await page.goto(path);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(
      canonical,
      `${path} should have one canonical URL`,
    ).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      "href",
      new URL(path, "https://eliocapella.com").href,
    );
    await expect(
      page.locator('link[rel="alternate"][type="application/atom+xml"]'),
      `${path} should advertise the Atom feed`,
    ).toHaveAttribute("href", "/feed.xml");
  }
});

test("homepage exposes its posts as a semantic ordered article index", async ({
  page,
}) => {
  await page.goto("/");

  const postList = page.locator('section[aria-labelledby="latest-posts"] > ol');
  await expect(postList.locator(":scope > li > article")).toHaveCount(
    BLOG_POSTS.length,
  );
  await expect(postList.locator("article > h2 > a")).toHaveCount(
    BLOG_POSTS.length,
  );
  await expect(postList.locator("article > a")).toHaveCount(0);
});

test("crawler discovery files cover every indexable page and blog post", async ({
  request,
}) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("User-agent: *");
  expect(robots).toContain("Sitemap: https://eliocapella.com/sitemap.xml");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<url>/g)).toHaveLength(INDEXABLE_PAGES.length);
  for (const path of INDEXABLE_PAGES) {
    expect(sitemap).toContain(
      `<loc>${new URL(path, "https://eliocapella.com").href}</loc>`,
    );
  }
  expect(sitemap).not.toContain("demo.html");

  const feed = await (await request.get("/feed.xml")).text();
  expect(feed.match(/<entry>/g)).toHaveLength(BLOG_POSTS.length);
  for (const path of BLOG_POSTS) {
    expect(feed).toContain(
      `<id>${new URL(path, "https://eliocapella.com").href}</id>`,
    );
  }
});

test("structured data identifies the site owner and every blog post", async ({
  page,
}) => {
  await page.goto("/");
  const profileData = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent(),
  );
  expect(profileData["@graph"].map((item) => item["@type"])).toEqual([
    "WebSite",
    "ProfilePage",
    "Person",
  ]);
  expect(profileData["@graph"][2]).toMatchObject({
    "@id": "https://eliocapella.com/#person",
    name: "Elio Capella Sánchez",
    url: "https://eliocapella.com/",
  });

  for (const path of BLOG_POSTS) {
    await page.goto(path);

    const data = JSON.parse(
      await page.locator('script[type="application/ld+json"]').textContent(),
    );
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    const publishedTime = await page
      .locator('meta[property="article:published_time"]')
      .getAttribute("content");

    expect(data).toMatchObject({
      "@type": "BlogPosting",
      "@id": `${canonical}#article`,
      headline: await page.locator("article h1").textContent(),
      description,
      datePublished: publishedTime,
      dateModified: publishedTime,
      author: {
        "@id": "https://eliocapella.com/#person",
        name: "Elio Capella Sánchez",
      },
      mainEntityOfPage: { "@id": canonical },
    });
  }
});

test("indexable pages expose a consistent primary navigation", async ({
  page,
}) => {
  for (const path of INDEXABLE_PAGES) {
    await page.goto(path);

    const navigation = page.locator('nav[aria-label="Primary"]');
    await expect(navigation, `${path} should have one primary nav`).toHaveCount(
      1,
    );
    await expect(navigation.locator("a")).toHaveCount(5);
    await expect(navigation.locator('a[aria-current="page"]')).toHaveCount(1);
    await expect(navigation.locator("a")).toContainText([
      "Home",
      "Writing",
      "Projects",
      "Resume",
      "Work with me",
    ]);
  }
});

test("interactive demo provides static context without competing for indexing", async ({
  page,
}) => {
  await page.goto("/blog/permission-systems-for-enterprise/demo.html");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,follow",
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Interactive permission system demo",
    }),
  ).toHaveCount(1);
  await expect(
    page.locator('main a[href="./"]'),
    "the demo should point agents back to its explanatory article",
  ).toHaveCount(1);
});
