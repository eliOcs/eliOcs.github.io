# eliocapella.com

- Static site generated with Eleventy and Nunjucks. Edit source files in `/src`;
  generated output lives in `/_site` and must not be committed.
- Target modern browsers. Prefer modern HTML and CSS best practices over legacy
  browser compatibility workarounds.
- Local development: `npm start`
- Production build: `npm run build`
- Shared styles live in `/src/style.css`.
- Pages use directory-based `index.html` output. Blog post sources live in
  `/src/blog/<slug>/index.njk`; keep post images in the same folder.
- Preserve the current priorities when editing: semantic HTML, accessibility,
  readability, and fast loading.
- Use a spaced normal hyphen (`-`), not an em dash, in site copy and metadata.
- Blog tone of voice: practical engineering lessons from the trenches, told with
  honesty, humility, and a bias toward simple systems that actually work.
