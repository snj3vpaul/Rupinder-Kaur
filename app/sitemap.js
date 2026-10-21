import { site } from "@/data/content";
export default function sitemap() {
  return [{ url: site.url, changeFrequency: "monthly", priority: 1 }];
}
