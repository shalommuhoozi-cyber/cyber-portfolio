import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host
    ? new URL(`${protocol}://${host}`)
    : new URL("http://localhost:3000");

  return {
    metadataBase,
    title: "Shalom Rubaramira | Cybersecurity Portfolio",
    description:
      "Cybersecurity portfolio of Shalom Rubaramira, a Monash IT student focused on secure networks, risk assessment and clear technical communication.",
    openGraph: {
      title: "Shalom Rubaramira | Secure systems. Clear thinking.",
      description:
        "Network security, risk assessment and evidence-led technical delivery.",
      type: "website",
      images: [{ url: "/og.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Shalom Rubaramira | Cybersecurity Portfolio",
      description: "Secure systems. Clear thinking.",
      images: ["/og.png"],
    },
  };
}

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
