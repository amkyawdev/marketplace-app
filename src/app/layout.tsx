import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Myanmar C2C Marketplace",
  description: "Secure Consumer-to-Consumer Marketplace with NRC Verification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen bg-pattern">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}