import designsData from "@/content/designs.json";
import extensionsData from "@/content/extensions.json";
import portfolioData from "@/content/portfolio.json";
import testimonialsData from "@/content/testimonials.json";

export type Design = {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  repo: string;
  demoStyle: string;
  features: string[];
  details: string;
};

export type Extension = {
  slug: string;
  title: string;
  description: string;
  image: string;
  platform: string;
  status: string;
  version: string;
  repo: string;
  repoUrl: string;
  download: string;
  features: string[];
  screenshots: string[];
};

export type PortfolioItem = {
  name: string;
  description: string;
  image: string;
};

export type Testimonial = {
  name: string;
  role: string;
  platform: string;
  rating: number;
  text: string;
};

export const designs = designsData as Design[];
export const extensions = extensionsData as Extension[];
export const extension = extensions[0];
export const portfolio = portfolioData as PortfolioItem[];
export const testimonials = testimonialsData as Testimonial[];

export const services = [
  {slug:"phpbb",title:"phpBB services",summary:"Upgrades, migrations, styles, extensions, troubleshooting and long-term phpBB support."},
  {slug:"xenforo",title:"XenForo services",summary:"Migration assistance, configuration, maintenance and targeted customization for XenForo communities."},
  {slug:"vbulletin",title:"vBulletin services",summary:"Maintenance, migrations and modernization work for established vBulletin communities."},
  {slug:"migrations",title:"Forum migrations",summary:"Careful migrations between major forum platforms with emphasis on data integrity and continuity."},
  {slug:"custom-development",title:"Custom development",summary:"Purpose-built themes, extensions, integrations and performance work for forum communities."}
];
