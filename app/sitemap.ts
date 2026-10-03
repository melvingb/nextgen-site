import type { MetadataRoute } from "next";
import { designs, extensions, services } from "@/lib/data";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/services",
    "/designs",
    "/extensions",
    "/portfolio",
    "/testimonials",
    "/contact",
    "/services/custom-development",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...services
      .filter((service) => service.slug !== "custom-development")
      .map((service) => ({
        url: `${site.url}/services/${service.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ...designs.map((design) => ({
      url: `${site.url}/designs/${design.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...extensions.map((extension) => ({
      url: `${site.url}/extensions/${extension.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
