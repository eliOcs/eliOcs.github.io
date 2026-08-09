export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/CNAME": "CNAME",
    "src/favicon.ico": "favicon.ico",
    "src/fonts": "fonts",
    "src/image-gallery.js": "image-gallery.js",
    "src/projects": "projects",
    "src/resume": "resume",
    "src/robots.txt": "robots.txt",
    "src/selfie.jpg": "selfie.jpg",
    "src/selfie_circled.png": "selfie_circled.png",
    "src/style.css": "style.css",
    "src/work-with-me": "work-with-me",
  });
  eleventyConfig.addPassthroughCopy(
    "src/blog/**/*.{avif,excalidraw,html,jpeg,jpg,png,svg}",
  );

  eleventyConfig.addCollection("blogPosts", (collectionApi) =>
    collectionApi
      .getFilteredByTag("blogPosts")
      .sort((left, right) =>
        right.data.published.localeCompare(left.data.published),
      ),
  );

  eleventyConfig.addFilter("dateOnly", (value) => value.slice(0, 10));
  eleventyConfig.addFilter("readableDate", (value) => {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      timeZone: "UTC",
      year: "numeric",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  });
  eleventyConfig.addFilter("jsonString", (value) => JSON.stringify(value));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: false,
    markdownTemplateEngine: false,
    templateFormats: ["njk"],
  };
}
