import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "Kresh - Install Intelligence",
  description: "The open registry where developers package, share, and compose intelligence modules for AI systems.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID && process.env.NEXT_PUBLIC_DATAFAST_DOMAIN && (
          <Script
            data-website-id={process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID}
            data-domain={process.env.NEXT_PUBLIC_DATAFAST_DOMAIN}
            src="https://datafa.st/js/script.js"
            strategy="afterInteractive"
          />
        )}
        {process.env.NEXT_PUBLIC_FEATBACK_SITE_ID && (
          <Script
            src="https://featback.vercel.app/widget.js"
            data-site-id={process.env.NEXT_PUBLIC_FEATBACK_SITE_ID}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col font-sans`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
