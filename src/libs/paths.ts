export const paths = {
  home: "/home",
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  search: "/search",
  submit: "/submit",
  forbidden: "/forbidden",
  notFound: "/not-found",
  community: {
    create: "/c/create",
    detail: (name: string) => `/c/${name}`,
    edit: (name: string) => `/c/${name}/edit`,
    manage: (name: string) => `/c/${name}/manage`,
    members: (name: string) => `/c/${name}/members`,
  },
  post: {
    detail: (communityName: string, postId: string) => `/c/${communityName}/posts/${postId}`,
    edit: (postId: string) => `/u/me/posts/${postId}/edit`,
  },
  user: {
    detail: (userId: string) => `/u/${userId}`,
    me: "/u/me",
    myPosts: "/u/me/posts",
    myCommunities: "/u/me/communities",
    preferences: "/preferences/me",
  },
  admin: {
    dashboard: "/admin",
    users: "/admin/users",
    communities: "/admin/communities",
  },
};
