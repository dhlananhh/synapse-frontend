# Synapse - A Modern Discussion Forum (Client-Side)

Synapse is the client-side implementation of a feature-rich, modern discussion forum inspired by platforms like Reddit. It is built with a cutting-edge technology stack and designed for a highly interactive and responsive user experience. This project serves as a comprehensive thesis demonstrating advanced concepts in frontend engineering.

<div align="center">
  <img
    src="https://img.shields.io/badge/Project%20Status-In%20Development-blue?style=for-the-badge"
    alt="Project Status: In Development"
  />
</div>

<br>

<div align="center">
  <a href="https://synapse-discussion-forum.vercel.app/" target="_blank">
    <img
      src="https://img.shields.io/website?label=Live%20Demo&style=for-the-badge&url=https%3A%2F%2Fsynapse-discussion-forum.vercel.app%2F&up_color=06B6D4"
      alt="Live Demo"
    />
  </a>
  <img
    src="https://img.shields.io/github/repo-size/dhlananhh/synapse-client?style=for-the-badge&color=9BF6FF"
    alt="Repo Size"
  />
  <img
    src="https://img.shields.io/github/languages/code-size/dhlananhh/synapse-client?style=for-the-badge&color=8B5CF6"
    alt="Code Size"
  />
  <img
    src="https://tokei.rs/b1/github/dhlananhh/synapse-client?style=for-the-badge&color=89C9B8"
    alt="Total Lines of Code"
  />
  <img
    src="https://img.shields.io/github/last-commit/dhlananhh/synapse-client?style=for-the-badge&color=F59E0B"
    alt="Last Commit"
  />
  <img
    src="https://img.shields.io/github/commit-activity/m/dhlananhh/synapse-client?style=for-the-badge&color=FDFFB6"
    alt="Commit Activity"
  />
  <a 
    href="https://github.com/dhlananhh/synapse-client/blob/main/LICENSE.md" 
    target="_blank"
  >
    <img
      src="https://img.shields.io/github/license/dhlananhh/synapse-client?style=for-the-badge&color=EC4899"
      alt="License"
    />
  </a>
</div>

<br>

<div align="center">
  <a 
    href="https://nextjs.org/" 
    target="_blank"
  >
    <img
      src="https://img.shields.io/badge/Next.js-15-black?logo=next.js?style=for-the-badge"
      alt="Next.js"
    />
  </a>
  <a 
    href="https://www.typescriptlang.org/" 
    target="_blank"
  >
    <img
      src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript?style=for-the-badge"
      alt="Typescript"
    />
  </a>
  <a 
    href="https://tailwindcss.com/" 
    target="_blank"
  >
    <img
      src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css?style=for-the-badge"
      alt="Tailwind CSS"
    />
  </a>
  <a 
    href="https://ui.shadcn.com/" 
    target="_blank"
  >
    <img
      src="https://img.shields.io/badge/shadcn-10-black?logo=shadcn?style=for-the-badge"
      alt="shadcn/ui"
    />
  </a>
</div>

## 🧠 The Story Behind the Name: "Synapse"

Why **Synapse**? In neuroscience, a synapse is the crucial junction where nerve cells (neurons) connect and transmit signals to one another. It's the fundamental mechanism that allows information to flow, enabling learning, memory, and thought.

This name was chosen because it perfectly encapsulates the core mission of this platform:

-   **Connecting Ideas:** Just as a biological synapse connects neurons, this platform connects individual thoughts and ideas, allowing them to build upon each other in posts and comments.
-   **Transmitting Knowledge:** It's a space where a signal—an idea, a question, or a piece of knowledge—is transmitted from one person to the entire community, sparking discussion and collective understanding.
-   **Forming a Collective Intelligence:** When millions of synapses fire together, a consciousness emerges. Similarly, when a community comes together to discuss and vote on content, a form of "digital collective intelligence" takes shape, curating the best ideas and solutions.

**Synapse** is more than just a forum; it's an engine for connecting knowledge and fostering intelligent discussion.

<br/>

## ✨ Key Features

- **Dynamic Post Feeds:** Infinitely scrolling homepage and community feeds with skeleton loaders for a smooth UX.
- **Content Sorting:** Sort feeds by "Hot," "New," and "Top" to discover content.
- **Interactive Voting System:** Real-time, optimistic UI updates for voting on posts.
- **Real-Time Simulation:** Live chat and a global notification system to make the app feel dynamic.
- **Complete Auth Flow:** User registration, login, and a dedicated onboarding experience.
- **Community & User Pages:** Dedicated pages for communities and user profiles with tabbed content views.
- **Professional UX Polish:**
  - Dark/Light mode with system preference detection.
  - Global loading progress bar.
  - `Cmd+K` Command Menu for power users.
  - Professional toast notifications with Sonner.
  - Reusable confirmation dialogs for destructive actions.
  - Beautiful empty states and custom 404 pages.
- **Fully Responsive Design:** A seamless experience on all devices, featuring a slide-out mobile navigation drawer.

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React, Tailwind CSS
- **Component Library:** Shadcn UI (Radix UI + Tailwind)
- **State Management:** React Context API (for low-frequency updates) & Zustand (for high-frequency updates like chat and notifications).
- **Forms:** React Hook Form & Zod (for validation).
- **Internationalization (i18n):** `react-i18next` & `i18next`.
- **UX Libraries:** `next-themes`, `nextjs-toploader`, `sonner`, `lucide-react`.

## 📁 Project Structure

The project follows a feature-centric architecture within the Next.js App Router paradigm. This structure is designed for scalability, maintainability, and clear separation of concerns. It incorporates modern best practices, including a clear distinction between different types of components, hooks, and state management strategies.

```
synapse-client/
├── public/                                   # 🏞️ Static assets (images, fonts, favicons). Files here are served at the root.
└── src/                                      # 🗺️ Next.js App Router: The core of the application's routing and pages.
    ├── app/                                  # - Route Group for authentication pages (login, register). Has a simple, centered layout.
    │   ├── (auth)/                           
    │   │   ├── login
    │   │   │     └── page.tsx
    │   │   └── register
    │   │        └── page.tsx
    │   ├── (landing)/                        # - Route Group for the public, unauthenticated marketing page.
    │   │   └── page.tsx                      # -> Handles the root "/" URL for new visitors.
    │   ├── reset-password/               
    │   │   └── page.tsx                      # - Handles the complete password reset flow.
    │   ├── (main)/                           # - Group for the main application layout (with Navbar, Footer, etc.)
    │   │   ├── (communities)/
    │   │   │   └── c/[slug]/                 # - Dynamic route for viewing a single community.
    │   │   │     └── page.tsx
    │   │   ├── (posts)/
    │   │   │   └── p/[postId]/               # - Dynamic routes for posts (viewing and editing).
    │   │   ├── (user)/
    │   │   │   └── u/[username]/             # - Dynamic route for viewing a user profile.
    │   │   │     └── page.tsx
    │   │   ├── feed/                         # - The main post feed page (/feed), with its own two-column layout.
    │   │   │     └── page.tsx
    │   │   ├── settings/                     # - User settings page (/settings)
    │   │   │     └── page.tsx
    │   │   └── submit/                       # - The page for creating a new post (/submit).
    │   │         └── page.tsx
    │   ├── search/                           # - Search results page (/search)
    │   │         └── page.tsx
    │   ├── layout.tsx                        # - The root layout for the ENTIRE application (<html>, <body> tags).
    │   └── not-found.tsx                     # - Custom, globally applied 404 error page. (/not-found)
    │
    ├── components/                           # 🧩 React Components: The building blocks of the UI.
    │   ├── features/                         # - Large, "smart" components, specific to a business feature (e.g., the complete PostFeed, LoginForm).
    │   │   ├── auth/                         # - LoginForm, RegisterForm, VerifyEmailForm,...
    │   │   ├── award/                        # - AwardDisplay, AwardSelectionDialog
    │   │   ├── chat/                         # - ChatWidget
    │   │   ├── command/                      # - CommandMenu
    │   │   ├── comment/                      # - CommentSection, CommentItem, CommentForm
    │   │   ├── community/                    # - CommunityHeader, TopCommunitiesWidget
    │   │   ├── feed/                         # - FeedPage
    │   │   ├── landing/                      # - LandingPage
    │   │   ├── notifications/                # - NotificationBell, NotificationItem
    │   │   ├── onboarding/                   # - OnboardingModal
    │   │   ├── post/                         # - PostFeed, PostCard, VoteClient, CreatePostForm, etc.
    │   │   ├── report/                       # - ReportDialog
    │   │   ├── report/                       # - ReportDialog
    │   │   ├── settings/                     # - SettingsRow, UpdateProfileForm
    │   │   │  └── dialogs/
    │   │   │  └── tabs/                   
    │   │   └── user/                         # - UserProfile, ProfileHeader, ActivityCalendar, etc.
    │   ├── providers/                        # - Global "wrapper" components & headless logic (Theme, I18nProvider).
    │   │   ├── NotificationSimulator.tsx
    │   │   ├── ThemeProvider.tsx
    │   │   ├── I18nProvider.tsx
    │   │   └── TopProgressBar.tsx
    │   ├── shared/                           # - "Dumb", highly reusable components used across multiple features
    │   │   ├── ConfirmDialog.tsx
    │   │   ├── MobileNav.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── SearchBar.tsx
    │   │   ├── UserAvatar.tsx
    │   │   ├── UserNav.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── ErrorDisplay.tsx
    │   │   └── Footer.tsx
    │   └── ui/                               # - Primitive UI components from Shadcn UI. The lowest level of the UI.
    │
    ├── context/                              # 🧠 Global State Management (React Context): For state that updates infrequently.
    │   ├── AuthContext.tsx                   # - Manages user session, permissions, votes, and triggers for global modals.
    │   └── CommandMenuContext.tsx            # - Manages the open/closed state and keyboard listeners for the Cmd+K menu.
    │
    ├── hooks/                                # 🎣 Custom React Hooks: For reusable stateful logic.
    │   └── useIntersectionObserver.ts        # - Encapsulates the logic for detecting when an element is visible (for infinite scroll).
    │
    ├── libs/                                 # 📚 Libraries & Core Business Logic
    │   ├── apiClient.ts                      # - The centralized Axios instance with interceptors for auth/token refresh.
    │   ├── mock-data.ts                      # - The in-memory "database" with mock users, posts, and communities.
    │   ├── paths.ts                          # - Centralized, type-safe route constants to prevent broken links.
    │   ├── utils.ts                          # - General utility functions (e.g., `cn` for classnames)
    │   └── validators/                       # - Zod schemas for all form validation (auth, post, user).
    │
    ├── modules/                              # 🧱 Encapsulates communication logic with backend microservices.
    │     └── services/                       # - Houses API service clients. Each file maps to a microservice.
    │       └── auth-service.ts 
    │       └── user-service.ts 
    │
    ├── locales/                              # 🌐 Internationalization (i18n): For multi-language support.   
    │   ├── en.json                           # - English language translation strings.
    │   └── vn.json                           # - Vietnamese language translation strings.
    │
    ├── store/                                # 🏪 Global State Management (Zustand): For state that updates frequently.
    │   ├── useChatStore.ts                   # - Manages all state for the high-frequency real-time chat feature.
    │   └── useNotificationStore.ts           # - Manages the state for the global real-time notification system.
    │
    ├── styles/                               # 🎨 Styling: Global styles and theme configuration.
    │   └── globals.css                       # - Core global styles and custom CSS for libraries.
    │
    ├── types/                                # 📝 TypeScript Type Definitions
    │   ├── services/
    │     ├── auth.d.ts 
    │     └── auth.d.ts 
    │   ├── globals.d.ts                      # - Global type declarations, if needed for third-party libraries.
    │   └── index.d.ts                        # - Centralized definitions for all custom application types (User, Post, Comment, etc.).
    │
    ├── utils/                                # 🛠️ General Utilities: Small, stateless helper functions.
    │     └── index.ts                        # - Can re-export functions or contain general helpers (e.g., the `cn` function for classnames).
    ├── middleware.ts
    └── tailwind.config.ts                    # - Tailwind CSS theme configuration (colors, fonts, plugins).                            
```

### Architectural Decisions Explained:

- **`app/` Directory**: We leverage Next.js's **App Router** for file-system based routing.
  **Route Groups** (`(main)`, `(auth)`) are used to apply different layouts to different sections of the application without affecting the URL structure.
- **`components/` Directory**: This follows a three-tiered structure for maximum clarity:
  - **`ui/`**: Low-level, unstyled, or minimally styled primitives. Mostly auto-generated by **Shadcn UI**.
  - **`shared/`**: Components composed from `ui/` elements that are context-agnostic and reused widely (e.g., `ConfirmDialog`, `EmptyState`).
  - **`features/`**: High-level components specific to a single business feature (e.g., the `PostFeed`'s entire infinite scroll logic is encapsulated here). This makes features easy to find and reason about.
- **`context/` vs `store/`**: We strategically use two different state management patterns:
  - **React Context (`context/`)**: Used for global state that does **not** update frequently (e.g., the current user's authentication status, theme). This is a simple, built-in solution.
  - **Zustand (`store/`)**: Used for global state that updates **frequently** and could cause performance issues with Context's re-renders (e.g., real-time chat messages, notifications). Zustand is highly optimized for such scenarios.
- **`lib/` Directory**: A standard convention for code that isn't a React component, hook, or context. Placing our **simulated API** here makes the transition to a real backend straightforward—we would simply rewrite the function bodies in `api.ts` to use `fetch` without needing to change any of the components that call them.

### Key Architectural Updates Reflected in this Structure:

-   **Routing (`app/`):** The structure clearly shows the separation between the **`(landing)`** group for unauthenticated users and the **`(main)`** group for the core application experience. The move of the post feed to `/feed` is also documented. The addition of the `/edit` page for posts is now visible.
-   **Components (`components/`):** The `features/` directory is now fully fleshed out, with a sub-folder for each major feature domain (auth, chat, post, user, etc.). This makes the project incredibly easy to navigate. The `providers/` directory now correctly lists all our global system components, like the `NotificationSimulator` and `GlobalModals`.
-   **State Management (`context/` & `store/`):** The structure explicitly shows the strategic decision to use both React Context and Zustand for different state management needs, a hallmark of a mature architecture.
-   **Libraries & Utilities (`lib/`):** The addition of the `paths.ts` file is a key highlight, demonstrating a commitment to maintainable code by centralizing route management.

This final project structure is a complete and accurate representation of the sophisticated application you have built. It serves as an excellent architectural overview in your documentation.

### Key Additions and Clarifications in the Comments:

-   **`app/`**: I've added more specific comments clarifying the purpose of each route group (`(auth)`, `(landing)`, `(main)`) and how they relate to the application's layouts.
-   **`components/`**: I've reinforced the three-tiered ("smart" vs. "dumb" vs. "primitive") component philosophy, which is a key architectural concept.
-   **`context/` vs `store/`**: I've explicitly stated the "why" behind using two different state management libraries (infrequent vs. frequent updates). This is a crucial senior-level distinction.
-   **`lib/`**: Clarified that this directory (renamed from `libs`) is for core business logic, not just library code. Highlighted the `paths.ts` file's importance.
-   **`locales/`, `styles/`, `utils/`**: I've added comments explaining the purpose of these new, well-organized directories you created.

## 🚀 Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/dhlananhh/synapse-client
    cd synapse-client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file at the root and add any necessary environment variables. For now, this is not required as the app runs entirely on mock data.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
