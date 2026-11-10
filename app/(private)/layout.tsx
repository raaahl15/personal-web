import type { Metadata } from "next";
import { fontVariables, themeScript } from "@/lib/fonts";
import "../globals.css";

// Root layout area privat (Life OS + login). Hanya bahasa Indonesia (K-17) dan tidak diindeks.
export const metadata: Metadata = {
  title: { default: "Life OS", template: "%s — Life OS" },
  robots: { index: false, follow: false },
};

export default function PrivateRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
