import { MetadataRoute } from "next";
import {
  mockCommunities,
  mockPosts,
} from "@/libs/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

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

  const communityRoutes = mockCommunities.map(
    (community) => ({
      url: `${siteUrl}/c/${community.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })
  );

  const postRoutes = mockPosts.map((post) => ({
    url: `${siteUrl}/p/${post.id}`,
    lastModified: new Date(post.createdAt).toISOString(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }));

  const allUsers = [
    ...new Map(
      mockPosts.map((post) => [
        post.author.username,
        post.author,
      ])
    ).values(),
  ];

  const userRoutes = allUsers.map((user) => ({
    url: `${siteUrl}/u/${user.username}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...communityRoutes,
    ...postRoutes,
    ...userRoutes,
  ];
}
