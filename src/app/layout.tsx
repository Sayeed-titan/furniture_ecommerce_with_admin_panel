import type { Metadata } from "next";
import { Inter, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeScript } from "@/components/site/theme/theme-script";
import "./globals.css";

/** Body/UI font — replaces Geist Sans, which read as too generic. Inter is
 *  the current standard for crisp, clean small-size text/UI rendering. */
const bodySans = Inter({
  variable: "--font-body-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Brand display serif — used by the President wordmark and landing. */
const displaySerif = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "President Furniture",
    template: "%s | President Furniture",
  },
  description:
    "President Furniture — office and industrial furniture supplied, delivered, and installed across Bangladesh. Desks, seating, storage, workstations, and industrial racking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodySans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased scroll-smooth snap-y snap-proximity`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
