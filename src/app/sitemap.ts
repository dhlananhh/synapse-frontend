import { MetadataRoute } from "next";

// Note: Dynamic routes for communities, posts, and users are still placeholders.
// TODO: Implement fetching real data from your API or database to generate
// dynamic routes for items like /c/[name], /u/[userId], etc.

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Comprehensive list of static routes based on the file structure in `src/app/`
  const staticRoutes = [
    "/",
    "/login",
    "/register",
    "/reset-password",
    "/verify-email",
    "/admin",
    "/admin/communities",
    "/admin/users",
    "/forbidden",
    "/home", // Main feed page
    "/search",
    "/submit",
    "/preferences/me",
    "/c", // Main communities page
    "/c/create",
    "/c/me", // My communities
    "/u/me", // My profile
    "/u/me/communities",
    "/u/me/posts",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic routes remain empty. They should be populated by fetching data.
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
