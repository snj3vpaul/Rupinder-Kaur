import "./globals.css";
import { site } from "@/data/content";

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Rupinder Kaur | Software Engineer in Test", template: "%s | Rupinder Kaur" },
  description: "Rupinder Kaur is an Ottawa-based Software Engineer in Test working across test automation, performance, CI/CD and systems modernization.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_CA", url: site.url,
    title: "Rupinder Kaur — Quality Engineering, by design",
    description: "Automation, performance and thoughtful testing for reliable software delivery.",
    siteName: "Rupinder Kaur", images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Rupinder Kaur — Quality Engineering" }]
  },
  twitter: { card: "summary_large_image", images: ["/og-image.svg"] },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }) {
  const themeScript = `(function(){try{var stored=localStorage.getItem('rk-theme');var theme=stored==='dark'||stored==='light'?stored:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme}catch(e){document.documentElement.dataset.theme='light'}})()`;
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>{children}</body>
    </html>
  );
}
