import { gzipSync } from "node:zlib";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";

const outputDirectory = resolve("out");
const bundleDirectory = resolve(".wrangler");
const bundlePath = join(bundleDirectory, "cloudflare-portfolio-worker.js");
const redirectedAssets = new Set(["og.png"]);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );

  return files.flat();
}

const assets = {};
for (const path of await listFiles(outputDirectory)) {
  const fileName = relative(outputDirectory, path).split(sep).join("/");
  if (redirectedAssets.has(fileName)) continue;

  assets[`/${fileName}`] = {
    body: (await readFile(path)).toString("base64"),
    contentType:
      contentTypes[extname(fileName).toLowerCase()] ??
      "application/octet-stream",
  };
}

const archive = gzipSync(Buffer.from(JSON.stringify(assets)), {
  level: 9,
}).toString("base64");

const worker = `const ARCHIVE = ${JSON.stringify(archive)};
const GITHUB_ASSET_ROOT = "https://shruba256.github.io/cyber-portfolio";
let assetsPromise;

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function getAssets() {
  if (!assetsPromise) {
    assetsPromise = (async () => {
      const compressed = decodeBase64(ARCHIVE);
      const stream = new Blob([compressed])
        .stream()
        .pipeThrough(new DecompressionStream("gzip"));
      return JSON.parse(await new Response(stream).text());
    })();
  }
  return assetsPromise;
}

function redirectAsset(pathname) {
  if (pathname === "/og.png") return GITHUB_ASSET_ROOT + "/og.png";
  return null;
}

async function handleRequest(request) {
  const url = new URL(request.url);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const redirect = redirectAsset(pathname);
  if (redirect) return Response.redirect(redirect, 302);

  if (pathname.endsWith("/")) pathname += "index.html";
  const assets = await getAssets();
  let asset = assets[pathname];
  if (!asset && !pathname.split("/").pop()?.includes(".")) {
    asset = assets[pathname + ".html"];
  }

  let status = 200;
  if (!asset) {
    asset = assets["/404.html"];
    status = 404;
  }

  const headers = new Headers({
    "Content-Type": asset.contentType,
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  });
  headers.set(
    "Cache-Control",
    pathname.startsWith("/_next/static/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=300",
  );

  return new Response(
    request.method === "HEAD" ? null : decodeBase64(asset.body),
    { status, headers },
  );
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
`;

await mkdir(bundleDirectory, { recursive: true });
await writeFile(bundlePath, worker);
console.log(
  JSON.stringify({
    assetCount: Object.keys(assets).length,
    bundlePath,
    bytes: Buffer.byteLength(worker),
  }),
);
