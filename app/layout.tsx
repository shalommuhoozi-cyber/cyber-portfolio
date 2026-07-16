import type { Metadata, Viewport } from "next";
import "./globals.css";

const themeScript = `(() => {
  try {
    const savedTheme = localStorage.getItem("shalom-portfolio-theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    const theme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : preferredTheme;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();`;

const pagesBasePath = process.env.PAGES_BASE_PATH ?? "";
const isCloudflarePages = Boolean(
  process.env.CF_PAGES || process.env.CLOUDFLARE_PAGES,
);
const isCloudflareWorkers = Boolean(process.env.CLOUDFLARE_WORKERS);
const siteUrl = pagesBasePath
  ? `https://shalommuhoozi-cyber.github.io${pagesBasePath}`
  : isCloudflareWorkers
    ? "https://portfolio.shalommuhoozi-cyber.workers.dev"
    : isCloudflarePages
      ? "https://shalom-cyber-portfolio.pages.dev"
      : "https://shalom-rubaramira-cyber.shalommuhoozi.chatgpt.site";
const canonicalUrl =
  "https://shalommuhoozi-cyber.github.io/cyber-portfolio/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Shalom Rubaramira | Cybersecurity Portfolio",
  description:
    "Cybersecurity portfolio of Shalom Rubaramira, a Monash IT student focused on secure networks, risk assessment and clear technical communication.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Shalom Rubaramira | Secure systems. Clear thinking.",
    description:
      "Network security, risk assessment and evidence-led technical delivery.",
    type: "website",
    url: canonicalUrl,
    images: [{ url: `${siteUrl}/og.png` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shalom Rubaramira | Cybersecurity Portfolio",
    description: "Secure systems. Clear thinking.",
    images: [`${siteUrl}/og.png`],
  },
  icons: {
    icon: [{ url: `${siteUrl}/favicon.svg`, type: "image/svg+xml" }],
  },
  authors: [{ name: "Shalom Rubaramira" }],
  creator: "Shalom Rubaramira",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
