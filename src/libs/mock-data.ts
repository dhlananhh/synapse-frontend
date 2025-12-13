// // import types
// import { Award, Post, Flair, User, Trophy, Community } from '@/types'

// // import icons
// import { FaAward, FaMedal } from 'react-icons/fa6'
// import { SiThunderbird } from 'react-icons/si'
// import { BsFillCake2Fill } from 'react-icons/bs'
// import {
//   GiStarSattelites,
//   GiSteelwingEmblem,
//   GiLaurelCrown,
//   GiHeartburn,
//   GiSparkles,
//   GiRocketFlight,
// } from 'react-icons/gi'
// import { BsPostcardHeart } from 'react-icons/bs'

// // Mock Awards
// export const allMockAwards: Award[] = [
//   {
//     id: 'award1',
//     name: 'Brilliant',
//     description: 'For an exceptionally insightful comment or post.',
//     cost: 100,
//     Icon: GiSteelwingEmblem,
//   },
//   {
//     id: 'award2',
//     name: 'Wholesome',
//     description: 'For content that warms the heart.',
//     cost: 50,
//     Icon: GiHeartburn,
//   },
//   {
//     id: 'award3',
//     name: 'Helpful',
//     description: 'A token of thanks for a helpful post.',
//     cost: 75,
//     Icon: FaMedal,
//   },
//   {
//     id: 'award4',
//     name: 'Mind Blown',
//     description: 'When a post or comment is simply mind-blowing.',
//     cost: 200,
//     Icon: GiRocketFlight,
//   },
//   {
//     id: 'award5',
//     name: 'Inspiring',
//     description: 'For content that inspires and motivates.',
//     cost: 125,
//     Icon: GiSparkles,
//   },
// ]

// // Mock Trohies
// export const allMockTrophies: Trophy[] = [
//   {
//     id: 't1',
//     name: 'First Post',
//     description: 'You took your first step as a contributor!',
//     Icon: GiStarSattelites,
//   },
//   {
//     id: 't2',
//     name: 'Prolific Commenter',
//     description: 'Awarded for making over 50 comments.',
//     Icon: BsPostcardHeart,
//   },
//   {
//     id: 't3',
//     name: 'Top 10% Karma',
//     description: 'Your contributions are highly valued by the community.',
//     Icon: GiLaurelCrown,
//   },
//   {
//     id: 't4',
//     name: 'Community Pioneer',
//     description: 'Created a community that gained over 100 members.',
//     Icon: SiThunderbird,
//   },
//   {
//     id: 't5',
//     name: 'One-Year Club',
//     description: 'You have been a member of Synapse for over one year.',
//     Icon: BsFillCake2Fill,
//   },
//   {
//     id: 't6',
//     name: 'Helpful Hand',
//     description: 'Received an award on one of your posts or comments.',
//     Icon: FaAward,
//   },
// ]

// // Mock Admin
// export const adminUser: User = {
//   id: 'u_admin',
//   firstName: 'Synapse',
//   lastName: 'Admin',
//   email: 'synapse_admin@synapse.com',
//   username: 'synapse_admin',
//   displayName: 'Synapse Admin',
//   avatarUrl: 'https://i.pravatar.cc/150?u=admin',
//   createdAt: '2024-01-01T00:00:00Z',
//   karma: {
//     post: 7500,
//     comment: 2499,
//   },
//   gender: 'Female',
//   bannerUrl: 'https://placehold.co/1200x400/06b6d4/FFFFFF?text=Synapse+Admin',
// }

// // Mock Users
// const user1: User = {
//   id: 'u1',
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'johndoe@synapse.com',
//   username: 'john_doe',
//   displayName: 'John Doe',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u1',
//   createdAt: '2023-05-10T12:00:00Z',
//   karma: {
//     post: 900,
//     comment: 350,
//   },
//   gender: 'Male',
//   bannerUrl: 'https://placehold.co/1200x400/1f2937/d1d5db?text=John+Doe',
// }
// const user2: User = {
//   id: 'u2',
//   firstName: 'Dev',
//   lastName: 'Guru',
//   email: 'dev_guru@synapse.com',
//   username: 'dev_guru',
//   displayName: 'Dev Guru',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u2',
//   createdAt: '2022-11-20T15:30:00Z',
//   karma: {
//     post: 2800,
//     comment: 600,
//   },
//   gender: 'Male',
// }
// const user3: User = {
//   id: 'u3',
//   firstName: 'Jane',
//   lastName: 'Smith',
//   email: 'janesmith@synapse.com',
//   username: 'jane_smith',
//   displayName: 'Jane Smith',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u3',
//   createdAt: '2022-11-20T15:30:00Z',
//   karma: {
//     post: 550,
//     comment: 300,
//   },
//   gender: 'Female',
// }

// const user4: User = {
//   id: 'u4',
//   firstName: 'Alex',
//   lastName: 'Riley',
//   email: 'alexriley@synapse.com',
//   username: 'code_wizard',
//   displayName: 'Alex Riley',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u4',
//   createdAt: '2023-02-15T18:45:00Z',
//   karma: { post: 1500, comment: 600 },
//   gender: 'Male',
// }

// const user5: User = {
//   id: 'u5',
//   firstName: 'Chloe',
//   lastName: 'Davis',
//   email: 'chloedavis@synapse.com',
//   username: 'pixel_artist',
//   displayName: 'Chloe Davis',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u5',
//   createdAt: '2023-11-05T20:00:00Z',
//   karma: { post: 800, comment: 750 },
//   gender: 'Female',
// }

// const user6: User = {
//   id: 'u6',
//   firstName: 'Mia',
//   lastName: 'Evans',
//   email: 'miaevans@synapse.com',
//   username: 'gamer_girl99',
//   displayName: 'Mia Evans',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u6',
//   createdAt: '2024-03-20T11:10:00Z',
//   karma: { post: 150, comment: 300 },
//   gender: 'Female',
// }

// const user7: User = {
//   id: 'u7',
//   username: 'happy_explorer',
//   firstName: 'Leo',
//   lastName: 'Carter',
//   email: 'leocarter@synapse.com',
//   displayName: 'Leo Carter',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u7',
//   createdAt: '2022-09-12T08:00:00Z',
//   karma: { post: 120, comment: 200 },
//   gender: 'Male',
// }

// const user8: User = {
//   id: 'u8',
//   firstName: 'Evelyn',
//   lastName: 'Reed',
//   email: 'evelynreed@synapse.com',
//   username: 'quantum_leap',
//   displayName: 'Dr. Evelyn Reed',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u8',
//   createdAt: '2023-01-30T14:25:00Z',
//   karma: { post: 4000, comment: 1600 },
//   gender: 'Female',
// }

// const user9: User = {
//   id: 'u9',
//   firstName: 'Sam',
//   lastName: 'Jones',
//   email: 'samjones@synapse.com',
//   username: 'data_dynamo',
//   displayName: 'Sam Jones',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u9',
//   createdAt: '2023-07-22T16:05:00Z',
//   karma: { post: 950, comment: 850 },
//   gender: 'Other',
// }

// const user10: User = {
//   id: 'u10',
//   firstName: 'Olivia',
//   lastName: 'Chen',
//   email: 'oliviachen@synapse.com',
//   username: 'ux_unicorn',
//   displayName: 'Olivia Chen',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u10',
//   createdAt: '2023-04-18T22:30:00Z',
//   karma: { post: 1800, comment: 1100 },
//   gender: 'Female',
// }

// const user11: User = {
//   id: 'u11',
//   firstName: 'Ben',
//   lastName: 'Harris',
//   email: 'benharris@synapse.com',
//   username: 'backend_bison',
//   displayName: 'Ben Harris',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u11',
//   createdAt: '2022-12-01T06:00:00Z',
//   karma: { post: 700, comment: 400 },
//   gender: 'Male',
// }

// const user12: User = {
//   id: 'u12',
//   firstName: 'Fiona',
//   lastName: 'Garcia',
//   email: 'fiona_garcia@synapse.com',
//   username: 'frontend_fox',
//   displayName: 'Fiona Garcia',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u12',
//   createdAt: '2024-01-10T19:55:00Z',
//   karma: { post: 480, comment: 300 },
//   gender: 'Female',
// }

// const user13: User = {
//   id: 'u13',
//   firstName: 'Dan',
//   lastName: 'Martinez',
//   email: 'dan_martinez@synapse.com',
//   username: 'devops_drake',
//   displayName: 'Dan Martinez',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u13',
//   createdAt: '2023-09-03T13:00:00Z',
//   karma: { post: 600, comment: 350 },
//   gender: 'Male',
// }

// const user14: User = {
//   id: 'u14',
//   firstName: 'Rachel',
//   lastName: 'Nguyen',
//   email: 'rachelnguyen@synapse.com',
//   username: 'react_rocket',
//   displayName: 'Rachel Nguyen',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u14',
//   createdAt: '2024-02-05T10:00:00Z',
//   karma: { post: 320, comment: 300 },
//   gender: 'Female',
// }

// const user15: User = {
//   id: 'u15',
//   firstName: 'Nate',
//   lastName: 'Robinson',
//   email: 'nate_robinson@synapse.com',
//   username: 'node_ninja',
//   displayName: 'Nate Robinson',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u15',
//   createdAt: '2023-03-12T00:00:00Z',
//   karma: { post: 1000, comment: 350 },
//   gender: 'Male',
// }

// const user16: User = {
//   id: 'u16',
//   firstName: 'Casey',
//   lastName: 'Thompson',
//   email: 'caseythompson@synapse.com',
//   username: 'cloud_creator',
//   displayName: 'Casey Thompson',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u16',
//   createdAt: '2024-04-01T17:20:00Z',
//   karma: {
//     post: 100,
//     comment: 150,
//   },
//   gender: 'Prefer not to say',
// }

// const user17: User = {
//   id: 'u17',
//   firstName: 'Aaron',
//   lastName: 'Walker',
//   email: 'aaronwalker@synapse.com',
//   username: 'agile_ace',
//   displayName: 'Aaron Walker',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u17',
//   createdAt: '2023-06-19T09:40:00Z',
//   karma: {
//     post: 75,
//     comment: 100,
//   },
//   gender: 'Male',
// }

// const user18: User = {
//   id: 'u18',
//   firstName: 'Diana',
//   lastName: 'Lewis',
//   email: 'dianalewis@synapse.com',
//   username: 'design_diva',
//   displayName: 'Diana Lewis',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u18',
//   createdAt: '2023-10-30T21:00:00Z',
//   karma: {
//     post: 2200,
//     comment: 900,
//   },
//   gender: 'Female',
// }

// const user19: User = {
//   id: 'u19',
//   firstName: 'Abby',
//   lastName: 'Howard',
//   email: 'abbyhoward@synapse.com',
//   username: 'design_abby',
//   displayName: 'Abby Howard',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u19',
//   createdAt: '2024-05-01T12:00:00Z',
//   karma: {
//     post: 45,
//     comment: 50,
//   },
//   gender: 'Female',
// }

// const user20: User = {
//   id: 'u20',
//   firstName: 'Tom',
//   lastName: 'Clark',
//   email: 'tomclark@synapse.com',
//   username: 'tester_titan',
//   displayName: 'Tom Clark',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u20',
//   createdAt: '2024-05-01T12:00:00Z',
//   karma: {
//     post: 2300,
//     comment: 1000,
//   },
//   gender: 'Male',
// }

// const user21: User = {
//   id: 'u21',
//   firstName: 'Mia',
//   lastName: 'Houston',
//   email: 'alissa.houston@synapse.com',
//   username: 'design_alissa',
//   displayName: 'Alissa Houston',
//   avatarUrl: 'https://i.pravatar.cc/150?u=u21',
//   createdAt: '2024-05-01T12:00:00Z',
//   karma: {
//     post: 50,
//     comment: 100,
//   },
//   gender: 'Female',
// }

// export const allMockUsers = [
//   adminUser,
//   user1,
//   user2,
//   user3,
//   user4,
//   user5,
//   user6,
//   user7,
//   user8,
//   user9,
//   user10,
//   user11,
//   user12,
//   user13,
//   user14,
//   user15,
//   user16,
//   user17,
//   user18,
//   user19,
//   user20,
//   user21,
// ]

// // Mock Communities
// export const mockCommunities: Community[] = [
//   {
//     id: 'comm1',
//     slug: 'nextjs',
//     name: 'Next.js Developers',
//     imageUrl: 'https://i.pravatar.cc/150?u=comm1',
//     description:
//       'A community for developers passionate about the Next.js framework, Vercel, and the future of the web.',
//     createdAt: '2023-01-15T10:00:00Z',
//     memberCount: 15432,
//     ownerId: user1.id,
//     moderatorIds: [user2.id],
//   },
//   {
//     id: 'comm2',
//     slug: 'react',
//     name: 'React Community',
//     imageUrl: 'https://i.pravatar.cc/150?u=comm2',
//     description:
//       'Discuss all things React: hooks, components, state management, and the ecosystem.',
//     createdAt: '2022-08-20T14:30:00Z',
//     memberCount: 120543,
//     ownerId: user3.id,
//     moderatorIds: [],
//   },
//   {
//     id: 'comm3',
//     slug: 'webdev',
//     name: 'Web Development',
//     imageUrl: 'https://i.pravatar.cc/150?u=comm3',
//     description:
//       'The central hub for news, articles, and discussions about modern web development.',
//     createdAt: '2021-05-01T18:00:00Z',
//     memberCount: 250100,
//     ownerId: user4.id,
//     moderatorIds: [],
//   },
// ]

// // Mock Posts
// export const mockPosts: Post[] = [
//   {
//     id: 'p1',
//     title: 'How to structure a Next.js App Router project?',
//     content:
//       "Hey everyone, I'm a final year student working on my thesis project, a forum system. I'm using the latest version of Next.js with App Router and I'm a bit confused about how to structure my folders professionally for easy maintenance.I've looked at the official docs, but I'd love to see some real- world, battle - tested examples.Any advice on where to put components, libs, hooks, and how to handle state management would be greatly appreciated!",
//     author: user3,
//     community: { id: 'comm1', slug: 'nextjs', name: 'Next.js Developers' },
//     createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
//     votes: 128,
//     comments: [
//       {
//         id: 'c1',
//         text: 'Great question! The key is separation of concerns. I always use a `features` directory inside `components` for large, feature-specific components.',
//         author: user1,
//         createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
//         votes: 15,
//         replies: [
//           {
//             id: 'c3',
//             text: 'This! And use a `shared` directory for truly reusable things like a custom Button or Card.',
//             author: user2,
//             createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
//             votes: 8,
//           },
//         ],
//       },
//       {
//         id: 'c2',
//         text: 'For state, avoid overusing Context API for frequently updated state. Zustand is a great lightweight alternative.',
//         author: user2,
//         createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
//         votes: 12,
//       },
//     ],
//   },
//   {
//     id: 'p2',
//     title: 'Shadcn UI vs. other component libraries',
//     content:
//       'What are your thoughts on Shadcn UI? I love that I own the code, but is it scalable for a very large application compared to something like Material-UI or Mantine? Discuss!',
//     author: user1,
//     community: { id: 'comm2', slug: 'react', name: 'React Community' },
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
//     votes: 76,
//     comments: [],
//   },
//   {
//     id: 'p3',
//     title: 'The future of server-side rendering',
//     content:
//       'With React Server Components, the game has changed. What do you think is the future of SSR? Will SPAs become a thing of the past for content-heavy sites?',
//     author: user2,
//     community: { id: 'comm3', slug: 'webdev', name: 'Web Development' },
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
//     votes: 250,
//     comments: [],
//   },
// ]

// // Mock Flairs
// export const mockFlairs: Flair[] = [
//   { id: 'f1', name: 'Discussion', color: '#06b6d4', communityId: 'comm1' },
//   { id: 'f2', name: 'Question', color: '#f59e0b', communityId: 'comm1' },
//   { id: 'f3', name: 'Showcase', color: '#8b5cf6', communityId: 'comm2' },
// ]
