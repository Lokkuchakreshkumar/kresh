import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Iosevka+Charon:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Playwrite+GB+J:ital,wght@0,100..400;1,100..400&family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col font-sans`}
        suppressHydrationWarning
      >
        {/* Global SVG Displacement Filter for Glass Refraction */}
        <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
          <filter id="glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
            {/* Generate some subtle noise to act as a glass surface distortion */}
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0" in="noise" result="coloredNoise" />
            {/* Displace the pixels underneath very slightly based on the noise map */}
            <feDisplacementMap in="SourceGraphic" in2="coloredNoise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            {/* Add optical blur to mimic frosted glass */}
            <feGaussianBlur in="displaced" stdDeviation="12" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
            </feMerge>
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}
