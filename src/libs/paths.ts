export const PATHS = {
  home: "/",
  feed: "/feed",
  login: "/login",
  register: "/register",
  submit: "/submit",
  settings: "/settings",
  search: (query: string) =>
    `/search?q=${encodeURIComponent(query)}`,
  community: (slug: string) => `/c/${slug}`,
  post: (postId: string) => `/p/${postId}`,
  postEdit: (postId: string) => `/p/${postId}/edit`,
  userProfile: (username: string) => `/u/${username}`,
  communityMembers: (slug: string) => `/c/${slug}/members`,
  createCommunity: "/communities/create",
};
