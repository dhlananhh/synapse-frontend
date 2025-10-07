import {
  mockPosts,
  allMockUsers,
  mockCommunities,
  allMockTrophies,
} from "./mock-data";
import {
  Award,
  User,
  Trophy,
  Post,
  Flair,
  Comment,
  SortType,
  Community,
  CommunityMemberWithRole,
  UserComment,
  Activity
} from "@/types";
import { TPostSchema } from "./validators/post-validator";
import {
  TCreateCommunitySchema,
  TEditCommunitySchema,
  TFlairSchema
} from "./validators/community-validator";


const POSTS_PER_PAGE = 6;


// export const fetchPosts = async (page: number): Promise<{ data: Post[], hasMore: boolean }> => {
//   await new Promise(resolve => setTimeout(resolve, 750));

//   const start = (page - 1) * POSTS_PER_PAGE;
//   const end = start + POSTS_PER_PAGE;

//   const postsSlice = mockPosts.slice(start, end);
//   const hasMore = end < mockPosts.length;

//   return {
//     data: postsSlice,
//     hasMore: hasMore,
//   };
// }


// export const fetchPosts = async (
//   page: number,
//   sortBy: SortType = "hot",
//   mutedCommunityIds: string[] = []
// ): Promise<{ data: Post[], hasMore: boolean }> => {

//   await new Promise(resolve => setTimeout(resolve, 500));

//   let sortedPosts = [ ...mockPosts ];

//   if (sortBy === "new") {
//     sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//   } else if (sortBy === "top") {
//     sortedPosts.sort((a, b) => b.votes - a.votes);
//   }

//   const visiblePosts = sortedPosts.filter(
//     post => !mutedCommunityIds.includes(post.community.id)
//   );

//   const start = (page - 1) * POSTS_PER_PAGE;
//   const end = start + POSTS_PER_PAGE;

//   const postsSlice = visiblePosts.slice(start, end);
//   const hasMore = end < visiblePosts.length;

//   return {
//     data: postsSlice,
//     hasMore: hasMore,
//   };
// }


export const fetchPostById = async (postId: string): Promise<Post> => {
  console.log("Attempting to fetch post:", postId);
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (postId.includes("error")) {
    throw new Error("Failed to fetch post from the database. The connection timed out.");
  }

  const post = mockPosts.find(p => p.id === postId);

  if (!post) {
    const notFoundError = new Error("Post not found");
    (notFoundError as any).status = 404;
    throw notFoundError;
  }

  return post;
}

export const updatePost = async (
  postId: string,
  data: Pick<TPostSchema, "title" | "content">
): Promise<Post> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const postIndex = mockPosts.findIndex(p => p.id === postId);
  if (postIndex === -1) {
    throw new Error("Post not found to update");
  }

  mockPosts[ postIndex ] = {
    ...mockPosts[ postIndex ],
    title: data.title,
    content: data.content,
  };

  return mockPosts[ postIndex ];
};

export const deletePost = async (postId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const postIndex = mockPosts.findIndex(p => p.id === postId);
  if (postIndex === -1) {
    console.warn("Attempted to delete a post that was not found.");
    return;
  }

  mockPosts.splice(postIndex, 1);
};

const findCommentAndParent = (comments: Comment[], commentId: string): {
  comment: Comment | null; parent: Comment[] | null
} => {
  for (const comment of comments) {
    if (comment.id === commentId) {
      return { comment, parent: comments };
    }
    if (comment.replies) {
      const found = findCommentAndParent(comment.replies, commentId);
      if (found.comment) return found;
    }
  }
  return { comment: null, parent: null };
};


export const updateComment = async (postId: string, commentId: string, newText: string): Promise<Comment> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const post = mockPosts.find(p => p.id === postId);
  if (!post) throw new Error("Post not found");

  const { comment } = findCommentAndParent(post.comments, commentId);
  if (!comment) throw new Error("Comment not found to update");

  comment.text = newText;
  return comment;
}


export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const post = mockPosts.find(p => p.id === postId);
  if (!post) throw new Error("Post not found");

  const { parent, comment } = findCommentAndParent(post.comments, commentId);
  if (parent && comment) {
    const index = parent.indexOf(comment);
    if (index > -1) {
      parent.splice(index, 1);
    }
  }
}


export const fetchCommunityMembers = async (
  communitySlug: string,
  page: number
): Promise<{ data: User[], hasMore: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 750));

  const membersWithRoles = allMockUsers.map((user, index) => ({
    ...user,
    role: index === 0 ? "Moderator" : "Member",
  }));

  const MEMBERS_PER_PAGE = 20;
  const start = (page - 1) * MEMBERS_PER_PAGE;
  const end = start + MEMBERS_PER_PAGE;

  const membersSlice = membersWithRoles.slice(start, end);
  const hasMore = end < membersWithRoles.length;

  return { data: membersSlice, hasMore };
}


export const deleteCommunity = async (communityId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const communityIndex = mockCommunities.findIndex(c => c.id === communityId);

  if (communityIndex === -1) {
    console.warn("Attempted to delete a community that was not found.");
    throw new Error("Community not found.");
  }


  const postsToDelete = mockPosts.filter(p => p.community.id === communityId);

  postsToDelete.forEach(post => {
    const postIndex = mockPosts.findIndex(p => p.id === post.id);
    if (postIndex > -1) {
      mockPosts.splice(postIndex, 1);
    }
  });

  mockCommunities.splice(communityIndex, 1);

  console.log(`Community with ID ${communityId} and all its posts have been deleted.`);
};


export const updateCommunityModerators = async (
  communityId: string,
  moderatorIds: string[]
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 750));

  const community = mockCommunities.find(c => c.id === communityId);
  if (!community) {
    throw new Error("Community not found while updating moderators.");
  }

  community.moderatorIds = moderatorIds;
  console.log(`Moderators for community ${community.slug} updated.`);
}


export const reportContent = async (
  itemId: string,
  itemType: "POST" | "COMMENT",
  reason: string,
  reportingUserId: string
): Promise<{ success: true }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`
    --- CONTENT REPORT SUBMITTED ---
    Item ID: ${itemId}
    Item Type: ${itemType}
    Reason: ${reason}
    Reported by User: ${reportingUserId}
    ---------------------------------
    `);

  return { success: true };
};


export const fetchPostsByIds = async (postIds: string[]): Promise<Post[]> => {
  await new Promise(resolve => setTimeout(resolve, 750));

  const foundPosts = mockPosts.filter(post => postIds.includes(post.id));

  return foundPosts.sort((a, b) => postIds.indexOf(a.id) - postIds.indexOf(b.id));
}


export const requestPasswordReset = async (email: string): Promise<{ success: true }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`--- PASSWORD RESET REQUESTED ---
    Email: ${email}
    -----------------------------`);

  return { success: true };
}


export const resetPassword = async (token: string, newPassword: string): Promise<{ success: true }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`--- PASSWORD RESET ---
    Token Used: ${token}
    New Password: [redacted]
    ----------------------`);

  return { success: true };
}


export const fetchUsersByIds = async (userIds: string[]): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 750));
  const foundUsers = allMockUsers.filter(user => userIds.includes(user.id));
  return foundUsers;
};


export const fetchUserTrophies = async (username: string): Promise<Trophy[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  let seed = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const earnedTrophies: Trophy[] = [];

  allMockTrophies.forEach(trophy => {
    seed = (seed * 9301 + 49297) % 233280;
    const random = seed / 233280;
    if (random > 0.4) {
      earnedTrophies.push(trophy);
    }
  });

  if (earnedTrophies.length === 0) {
    return [ allMockTrophies[ 0 ] ];
  }

  return earnedTrophies;
};


export const createCommunity = async (
  data: TCreateCommunitySchema,
  ownerId: string
): Promise<Community> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const slugExists = mockCommunities.some(c => c.slug === data.slug);
  if (slugExists) {
    throw new Error("A community with this URL (slug) already exists.");
  }

  const newCommunity: Community = {
    id: `comm_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    slug: data.slug,
    description: data.description || "",
    createdAt: new Date().toISOString(),
    memberCount: 1,
    ownerId: ownerId,
    moderatorIds: [],
    imageUrl: `https://i.pravatar.cc/150?u=${data.slug}`,
  };

  mockCommunities.push(newCommunity);
  console.log("New community created:", newCommunity);

  return newCommunity;
};


export const uploadImage = async (file: File): Promise<string> => {
  console.log(`Simulating upload for file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
  await new Promise(resolve => setTimeout(resolve, 1500));

  const newImageUrl = `https://picsum.photos/seed/${Math.random()}/400`;

  console.log(`Upload complete. New URL: ${newImageUrl}`);
  return newImageUrl;
};


export const updateCommunity = async (
  communityId: string,
  data: TEditCommunitySchema
): Promise<Community> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
  if (communityIndex === -1) {
    throw new Error("Community not found. Update failed.");
  }

  mockCommunities[ communityIndex ] = {
    ...mockCommunities[ communityIndex ],
    name: data.name,
    description: data.description || "",
  };

  console.log("Community updated:", mockCommunities[ communityIndex ]);
  return mockCommunities[ communityIndex ];
};


export const fetchCommunityModerators = async (communityId: string): Promise<CommunityMemberWithRole[]> => {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network latency

  const community = mockCommunities.find(c => c.id === communityId);
  if (!community) {
    throw new Error("Community not found.");
  }

  const owner = allMockUsers.find(u => u.id === community.ownerId);
  const moderators = allMockUsers.filter(u => community.moderatorIds.includes(u.id));

  const moderatorList: CommunityMemberWithRole[] = [];

  if (owner) {
    moderatorList.push({ ...owner, role: "Owner" });
  }

  moderators.forEach(mod => {
    if (mod.id !== owner?.id) {
      moderatorList.push({ ...mod, role: "Moderator" });
    }
  });

  return moderatorList;
};


export const getAllComments = (): UserComment[] => {
  const allComments: UserComment[] = [];

  mockPosts.forEach(post => {
    const mapComments = (comments: any[]) => {
      comments.forEach(comment => {
        allComments.push({
          ...comment,
          postId: post.id,
          postTitle: post.title,
          postAuthor: post.author.username,
        });
        if (comment.replies) {
          mapComments(comment.replies);
        }
      });
    };
    mapComments(post.comments);
  });

  return allComments;
}

export const generateUserActivity = (username: string): Activity[] => {
  const today = new Date();
  const activities: Activity[] = [];

  let seed = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    seed = (seed * 9301 + 49297) % 233280;
    const random = seed / 233280;

    let count = 0;
    if (random > 0.3) {
      count = Math.floor(random * 10);
    }

    let level: Activity[ "level" ] = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count > 2 && count <= 4) level = 2;
    else if (count > 4 && count <= 6) level = 3;
    else if (count > 6) level = 4;

    activities.push({
      date: date.toISOString().slice(0, 10),
      count,
      level
    });
  }

  return activities.reverse();
};


export let mockFlairs: Flair[] = [
  { id: "f1", name: "Discussion", color: "#06b6d4", communityId: "comm1" },
  { id: "f2", name: "Question", color: "#f59e0b", communityId: "comm1" },
  { id: "f3", name: "Showcase", color: "#8b5cf6", communityId: "comm2" },
];


export const fetchFlairsForCommunity = async (communityId: string): Promise<Flair[]> => {
  await new Promise(r => setTimeout(r, 400));
  return mockFlairs.filter(f => f.communityId === communityId);
}


export const createFlair = async (data: TFlairSchema, communityId: string): Promise<Flair> => {
  await new Promise(r => setTimeout(r, 600));
  const newFlair: Flair = { ...data, id: `f${Date.now()}`, communityId };
  mockFlairs.push(newFlair);
  return newFlair;
}


export const updateFlair = async (flairId: string, data: TFlairSchema): Promise<Flair> => {
  await new Promise(r => setTimeout(r, 600));
  const index = mockFlairs.findIndex(f => f.id === flairId);
  if (index === -1) throw new Error("Flair not found");
  mockFlairs[ index ] = { ...mockFlairs[ index ], ...data };
  return mockFlairs[ index ];
}


export const deleteFlair = async (flairId: string): Promise<void> => {
  await new Promise(r => setTimeout(r, 600));
  mockFlairs = mockFlairs.filter(f => f.id !== flairId);
}


export const giveAwardToPost = async (postId: string, award: Award): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    if (!post.receivedAwards) {
      post.receivedAwards = [];
    }
    post.receivedAwards.push(award);
  } else {
    throw new Error("Post not found to give award.");
  }
}


export const createPost = async (data: TPostSchema, author: User): Promise<Post> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const community = mockCommunities.find(c => c.id === data.communityId);
  if (!community) {
    throw new Error("Community not found.");
  }

  const newPost: Post = {
    id: `p${Date.now()}`,
    title: data.title,
    content: data.content,
    author: author,
    community: {
      id: community.id,
      slug: community.slug,
      name: community.name,
    },
    createdAt: new Date().toISOString(),
    votes: 1,
    comments: [],
    receivedAwards: [],
  };

  if (data.flairId) {
    const flair = mockFlairs.find(f => f.id === data.flairId);
    if (flair) {
      newPost.flair = flair;
    }
  }

  mockPosts.unshift(newPost);
  return newPost;
};


export const fetchPosts = async (
  page: number,
  sortBy: SortType = "hot",
  mutedCommunityIds: string[] = [],
  options: {
    filterByCommunityId?: string;
    filterByFlairId?: string;
  } = {}
): Promise<{ data: Post[], hasMore: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  let sortedPosts = [ ...mockPosts ];

  let visiblePosts = sortedPosts.filter(
    post => !mutedCommunityIds.includes(post.community.id)
  );

  if (options.filterByCommunityId) {
    visiblePosts = visiblePosts.filter(p => p.community.id === options.filterByCommunityId);
  }
  if (options.filterByFlairId) {
    visiblePosts = visiblePosts.filter(p => p.flair?.id === options.filterByFlairId);
  }

  if (sortBy === "new") {
    visiblePosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === "top") {
    visiblePosts.sort((a, b) => b.votes - a.votes);
  }

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const postsSlice = visiblePosts.slice(start, end);
  const hasMore = end < visiblePosts.length;

  return { data: postsSlice, hasMore };
}