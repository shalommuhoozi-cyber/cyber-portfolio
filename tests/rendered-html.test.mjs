import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps GitHub Pages export isolated from the Sites build", async () => {
  const [config, layout, page, packageJson, workflow] = await Promise.all([
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
  ]);

  assert.match(config, /output:\s*"export"/);
  assert.match(config, /PAGES_BASE_PATH/);
  assert.doesNotMatch(layout, /from "next\/headers"|headers\(\)/);
  assert.match(layout, /shalommuhoozi-cyber\.github\.io/);
  assert.match(page, /pagesBasePath.*Shalom-Rubaramira-Resume\.pdf/s);
  assert.match(packageJson, /"build:pages": "next build"/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /path: \.\/out/);
});
