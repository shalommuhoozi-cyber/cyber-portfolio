import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the cybersecurity portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Shalom Rubaramira \| Cybersecurity Portfolio/i);
  assert.match(html, /Secure systems/i);
  assert.match(html, /Secure multi-campus enterprise network/i);
  assert.match(html, /Shalom-Rubaramira-Resume\.pdf/i);
  assert.match(html, /aria-label="Toggle light and dark mode"/i);
  assert.match(html, /Sculpture colour palette/);
  assert.match(html, /aria-label="Play animations"/);
  assert.match(html, /Iris/);
  assert.match(html, /Tide/);
  assert.match(html, /Ember/);
  assert.match(html, /<main[^>]+id="content"[^>]+tabindex="-1"/i);
  assert.equal((html.match(/<main\b/gi) ?? []).length, 1);
  assert.doesNotMatch(html, /UTC\+10|Carlton/i);
  assert.doesNotMatch(
    html,
    /(?:\u00c3.|\u00c2.|\u00e2[\u0080-\u00bf])/u,
  );
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("returns a custom 404 with working recovery links for a missing nested route", async () => {
  const response = await render("/missing/nested/page");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /404\. Page not found\./);
  assert.match(html, /SIGNAL LOST \/ ERROR 404/);
  assert.match(html, /href="\/"[^>]*>Back to home/);
  assert.match(html, /href="\/#work"/);
  assert.match(html, /<meta(?=[^>]*\bname="robots")(?=[^>]*\bcontent="noindex")[^>]*>/);
});

test("keeps GitHub Pages export isolated from the Sites build", async () => {
  const [config, layout, page, themeToggle, styles, packageJson, workflow] =
    await Promise.all([
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/theme-toggle.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
  ]);

  assert.match(config, /output:\s*"export"/);
  assert.match(config, /PAGES_BASE_PATH/);
  assert.doesNotMatch(layout, /from "next\/headers"|headers\(\)/);
  assert.match(layout, /shalommuhoozi-cyber\.github\.io/);
  assert.match(layout, /shalom-portfolio-theme/);
  assert.match(layout, /canonicalUrl/);
  assert.match(page, /pagesBasePath.*Shalom-Rubaramira-Resume\.pdf/s);
  assert.match(themeToggle, /Toggle light and dark mode/);
  assert.match(styles, /data-theme="light"/);
  assert.match(packageJson, /"build:pages": "next build"/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /path: \.\/out/);
});
