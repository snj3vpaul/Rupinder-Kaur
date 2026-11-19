import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "./globals.css";
import { site } from "@/data/content";

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Rupinder Kaur | Software Engineer in Test", template: "%s | Rupinder Kaur" },
  description: "Rupinder Kaur is an Ottawa-based Software Engineer in Test who finds the issues others overlook and stays with them until they are fixed: test automation, performance, CI/CD and systems modernization.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_CA", url: site.url,
    title: "Rupinder Kaur: finding what everyone else overlooks",
    description: "Software Engineer in Test. Automation, performance and the quiet defects that slip past everyone else.",
    siteName: "Rupinder Kaur"
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true }
};

export const viewport = { themeColor: "#0b0b0b" };

// Runs before paint: theme, "js" flag, and whether the intro loader should play
// (once per session, never under reduced motion).
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var s=localStorage.getItem('rk-theme');d.dataset.theme=s==='dark'||s==='light'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){d.dataset.theme='light'}try{if(sessionStorage.getItem('rk-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-done')}else{sessionStorage.setItem('rk-intro','1');d.classList.add('intro')}}catch(e){d.classList.add('intro-done')}})()`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: bootScript }} /></head>
      <body>{children}</body>
    </html>
  );
}
