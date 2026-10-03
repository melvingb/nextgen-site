import type {Metadata} from "next";
import { Advent_Pro } from "next/font/google";
import "./globals.css";
import {PublicChrome} from "@/components/PublicChrome";
import {JsonLd} from "@/components/JsonLd";
import {site} from "@/lib/site";

const adventPro = Advent_Pro({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-brand",
  display: "swap",
});

const themeBootstrap = `
(function () {
  try {
    var saved = localStorage.getItem("theme") || "system";
    var dark =
      saved === "dark" ||
      (saved === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (_) {
    var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }
})();
`;

export const metadata: Metadata = {
  metadataBase:new URL(site.url),
  title:{default:"Forum development, migrations & support | nextgen solutions",template:"%s | nextgen solutions"},
  description:site.description,
  alternates:{canonical:"/"},
  openGraph:{type:"website",siteName:site.name,title:"nextgen solutions",description:site.description,url:site.url,images:["/assets/images/og-default.png"]},
  twitter:{card:"summary_large_image",title:"nextgen solutions",description:site.description,images:["/assets/images/og-default.png"]},
  icons:{icon:"/assets/favicon/favicon.ico",apple:"/assets/favicon/apple-touch-icon.png"}
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html{background:#f4f7fb}html[data-theme='dark']{background:#0b0b0c;color-scheme:dark}html[data-theme='light']{color-scheme:light}",
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={adventPro.variable}>
        <JsonLd data={{"@context":"https://schema.org","@type":"Organization",name:site.name,url:site.url,sameAs:[site.github]}}/>
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
