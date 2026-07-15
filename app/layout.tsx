import type { Metadata } from "next";
import "./globals.css";

const pagesBasePath = process.env.PAGES_BASE_PATH ?? "";
const siteUrl = pagesBasePath
  ? `https://shalommuhoozi-cyber.github.io${pagesBasePath}`
  : "https://shalom-rubaramira-cyber.shalommuhoozi.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Shalom Rubaramira | Cybersecurity Portfolio",
  description:
    "Cybersecurity portfolio of Shalom Rubaramira, a Monash IT student focused on secure networks, risk assessment and clear technical communication.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Shalom Rubaramira | Secure systems. Clear thinking.",
    description:
      "Network security, risk assessment and evidence-led technical delivery.",
    type: "website",
    url: siteUrl,
    images: [{ url: `${siteUrl}/og.png` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shalom Rubaramira | Cybersecurity Portfolio",
    description: "Secure systems. Clear thinking.",
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
