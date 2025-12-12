import { MetadataRoute } from "next";

// Note: Dynamic routes for communities, posts, and users have been temporarily
// removed because the mock-data.ts file was deleted.
// TODO: Implement fetching real data from your API or database to generate
// these routes again.

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  // Static routes that don't depend on external data
  const staticRoutes = [
    "/",
    "/feed",
    "/login",
    "/register",
    "/submit",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic routes are now empty arrays.
  // You should replace this with your actual data fetching logic.
  const communityRoutes: MetadataRoute.Sitemap = [];
  const postRoutes: MetadataRoute.Sitemap = [];
  const userRoutes: MetadataRoute.Sitemap = [];

  return [
    ...staticRoutes,
    ...communityRoutes,
    ...postRoutes,
    ...userRoutes,
  ];
}
