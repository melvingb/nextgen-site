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
      <body className={adventPro.variable}>
        <JsonLd data={{"@context":"https://schema.org","@type":"Organization",name:site.name,url:site.url,sameAs:[site.github]}}/>
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
