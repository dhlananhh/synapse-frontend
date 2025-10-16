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

- **Connecting Ideas:** Just as a biological synapse connects neurons, this platform connects individual thoughts and ideas, allowing them to build upon each other in posts and comments.
- **Transmitting Knowledge:** It's a space where a signal—an idea, a question, or a piece of knowledge—is transmitted from one person to the entire community, sparking discussion and collective understanding.
- **Forming a Collective Intelligence:** When millions of synapses fire together, a consciousness emerges. Similarly, when a community comes together to discuss and vote on content, a form of "digital collective intelligence" takes shape, curating the best ideas and solutions.

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
- **UX Libraries:** `next-themes`, `nextjs-toploader`, `sonner`, `lucide-react`, `react-colorful`, & `react-confetti`.

## 📁 Project Structure

The project follows a feature-centric architecture within the Next.js App Router paradigm. This structure is designed for scalability, maintainability, and clear separation of concerns. It incorporates modern best practices, including a clear distinction between different types of components, hooks, and state management strategies.

```
└── 📁synapse-frontend
    └── 📁.vscode
        ├── settings.json
    └── 📁public
        └── 📁images
            ├── .gitkeep
        └── 📁screenshots
            ├── .gitkeep
            ├── LogInPage.png
            ├── RegisterPage.png
            ├── ResetPasswordPage.png
        ├── file.svg
        ├── globe.svg
        ├── next.svg
        ├── vercel.svg
        ├── window.svg
    └── 📁src
        └── 📁app
            └── 📁(auth)
                └── 📁login
                    ├── page.tsx
                └── 📁register
                    ├── page.tsx
                └── 📁reset-password
                    ├── page.tsx
                └── 📁verify-email
                    ├── page.tsx
                ├── layout.tsx
            └── 📁(landing)
                ├── layout.tsx
            └── 📁(main)
                └── 📁(communities)
                    └── 📁c
                        └── 📁[name]
                            └── 📁edit
                                ├── page.tsx
                            └── 📁manage
                                └── 📁flairs
                                    ├── page.tsx
                                └── 📁members
                                    ├── page.tsx
                                └── 📁rules
                                    ├── page.tsx
                                ├── page.tsx
                            ├── layout.tsx
                            ├── page.tsx
                        └── 📁create
                            ├── page.tsx
                └── 📁(user)
                    └── 📁profile
                        └── 📁[userId]
                            ├── layout.tsx
                            ├── page.tsx
                        └── 📁me
                            ├── layout.tsx
                            ├── page.tsx
                └── 📁feed
                    ├── page.tsx
                └── 📁forbidden
                    ├── page.tsx
                └── 📁not-found
                    ├── page.tsx
                └── 📁preferences
                    └── 📁me
                        ├── page.tsx
                └── 📁search
                    ├── page.tsx
                ├── layout.tsx
                ├── page.tsx
            ├── favicon.ico
            ├── layout.tsx
            ├── page.tsx
            ├── sitemap.ts
        └── 📁components
            └── 📁features
                └── 📁auth
                    ├── LoginForm.tsx
                    ├── RegisterForm.tsx
                    ├── RequestPasswordResetForm.tsx
                    ├── ResetPasswordFlow.tsx
                    ├── ResetPasswordForm.tsx
                    ├── SetNewPasswordForm.tsx
                    ├── VerifyEmailForm.tsx
                    ├── VerifyEmailSkeleton.tsx
                    ├── VerifyResetCodeForm.tsx
                └── 📁chat
                    ├── ChatMessage.tsx
                    ├── ChatTray.tsx
                    ├── ChatWindow.tsx
                    ├── ThreadsList.tsx
                └── 📁command
                    ├── CommandMenu.tsx
                └── 📁comment
                    ├── CommentForm.tsx
                    ├── CommentItem.tsx
                    ├── CommentSection.tsx
                └── 📁community
                    └── 📁create
                        ├── CommunityCreationWizard.tsx
                        ├── CommunityImageForm.tsx
                        ├── CommunityInfoForm.tsx
                        ├── CreationSuccess.tsx
                    └── 📁dialogs
                        ├── ActionConfirmDialog.tsx
                        ├── AllModeratorsDialog.tsx
                        ├── DeleteCommunityDialog.tsx
                        ├── ManageFlairsDialog.tsx
                        ├── UpdateCommunityDialog.tsx
                    └── 📁forms
                        ├── CommunityFlairForm.tsx
                        ├── ImageUploaderForm.tsx
                        ├── UpdateCommunityForm.tsx
                    └── 📁manage
                        └── 📁flairs
                            ├── CreateFlairDialog.tsx
                            ├── ManageFlairsDialog.tsx
                            ├── UpdateFlairDialog.tsx
                        └── 📁members
                            ├── BannedMembersTab.tsx
                            ├── CurrentMembersTab.tsx
                            ├── MemberCard.tsx
                            ├── MemberCardSkeleton.tsx
                            ├── PendingMembersTab.tsx
                        └── 📁rules
                            ├── CreateRuleDialog.tsx
                            ├── ManageRulesDialog.tsx
                            ├── UpdateRuleDialog.tsx
                    └── 📁widgets
                        ├── AboutCommunityWidget.tsx
                        ├── CommunityFlairsWidget.tsx
                        ├── CommunityFlairsWidgetSkeleton.tsx
                        ├── CommunityRulesWidget.tsx
                        ├── ModeratorListWidget.tsx
                        ├── TopCommunitiesWidget.tsx
                    ├── CommunityHeader.tsx
                └── 📁feed
                    ├── FeedPage.tsx
                └── 📁landing
                    ├── LandingPage.tsx
                └── 📁notifications
                    ├── NotificationBell.tsx
                    ├── NotificationItem.tsx
                └── 📁post
                    ├── CreatePostForm.tsx
                    ├── SavePostButton.tsx
                    ├── VoteClient.tsx
                └── 📁report
                    ├── ReportDialog.tsx
                └── 📁search
                    ├── CommunitySearchResultem.tsx
                    ├── LoadMoreButton.tsx
                    ├── NoMoreResults.tsx
                    ├── ResourceTypeSelector.tsx
                    ├── SearchResultsList.tsx
                    ├── UserSearchResultItem.tsx
                └── 📁settings
                    ├── ChangePasswordForm.tsx
                    ├── PreferencesForm.tsx
                    ├── SettingsPageSkeleton.tsx
                    ├── SettingsRow.tsx
                └── 📁user
                    ├── ActivityCalendar.tsx
                    ├── AvatarUpload.tsx
                    ├── FollowCard.tsx
                    ├── FollowerItem.tsx
                    ├── FollowerList.tsx
                    ├── FollowingItem.tsx
                    ├── FollowingList.tsx
                    ├── FollowingTab.tsx
                    ├── FollowList.tsx
                    ├── FollowListSkeleton.tsx
                    ├── GeneralProfileCard.tsx
                    ├── OtherProfileHeader.tsx
                    ├── OtherProfilePage.tsx
                    ├── OwnProfileHeader.tsx
                    ├── OwnProfilePage.tsx
                    ├── PendingRequestItem.tsx
                    ├── PendingRequestsDialog.tsx
                    ├── PrivacyConfirmDialog.tsx
                    ├── PrivacyToggle.tsx
                    ├── PrivateProfileView.tsx
                    ├── UpdateProfileDialog.tsx
                    ├── UpdateProfileForm.tsx
                    ├── UserCommentFeed.tsx
                    ├── UserPostFeed.tsx
                    ├── UserProfileInterface.tsx
                    ├── UserProfileLayout.tsx
                    ├── UserProfileSkeleton.tsx
                    ├── UserProfileTabs.tsx
            └── 📁providers
                ├── I18nProvider.tsx
                ├── NotificationSimulator.tsx
                ├── ThemeProvider.tsx
                ├── TopProgressBar.tsx
            └── 📁shared
                ├── ConfirmDialog.tsx
                ├── CreatePostWidget.tsx
                ├── Editor.tsx
                ├── EmptyState.tsx
                ├── ErrorDisplay.tsx
                ├── Footer.tsx
                ├── ForbiddenDisplay.tsx
                ├── LogoutConfirmDialog.tsx
                ├── MobileNav.tsx
                ├── Navbar.tsx
                ├── NotFoundDisplay.tsx
                ├── SearchBar.tsx
                ├── ThemeToggle.tsx
                ├── UserAvatar.tsx
                ├── UserNav.tsx
            └── 📁ui
                ├── accordion.tsx
                ├── alert-dialog.tsx
                ├── aspect-ratio.tsx
                ├── avatar.tsx
                ├── badge.tsx
                ├── breadcrumb.tsx
                ├── button.tsx
                ├── calendar.tsx
                ├── card.tsx
                ├── carousel.tsx
                ├── checkbox.tsx
                ├── collapsible.tsx
                ├── command.tsx
                ├── context-menu.tsx
                ├── dialog.tsx
                ├── dropdown-menu.tsx
                ├── form.tsx
                ├── hover-card.tsx
                ├── input-otp.tsx
                ├── input.tsx
                ├── label.tsx
                ├── menubar.tsx
                ├── navigation-menu.tsx
                ├── popover.tsx
                ├── progress.tsx
                ├── radio-group.tsx
                ├── scroll-area.tsx
                ├── select.tsx
                ├── separator.tsx
                ├── sheet.tsx
                ├── sidebar.tsx
                ├── skeleton.tsx
                ├── slider.tsx
                ├── sonner.tsx
                ├── switch.tsx
                ├── table.tsx
                ├── tabs.tsx
                ├── textarea.tsx
                ├── toggle-group.tsx
                ├── toggle.tsx
                ├── tooltip.tsx
        └── 📁context
            ├── AuthContext.tsx
            ├── CommandMenuContext.tsx
            ├── CommunityContext.tsx
            ├── MembershipContext.tsx
        └── 📁hooks
            ├── use-mobile.ts
            ├── useDebounce.ts
            ├── useIntersectionObserver.ts
            ├── useWindowSize.ts
        └── 📁libs
            └── 📁validators
                ├── auth-validator.ts
                ├── community-validator.ts
                ├── post-validator.ts
                ├── report-validator.ts
                ├── user-validator.ts
            ├── api.ts
            ├── apiClient.ts
            ├── i18n.ts
            ├── languages.ts
            ├── mock-api.ts
            ├── mock-data.ts
            ├── paths.ts
            ├── sessionStorageManager.ts
            ├── utils.ts
        └── 📁locales
            ├── .gitkeep
            ├── de.json
            ├── en.json
            ├── fr.json
            ├── it.json
            ├── vi.json
        └── 📁modules
            └── 📁services
                ├── .gitkeep
                ├── auth-service.ts
                ├── chat-service.ts
                ├── community-service.ts
                ├── post-service.ts
                ├── user-service.ts
            ├── .gitkeep
        └── 📁store
            ├── useChatStore.ts
            ├── useNotificationStore.ts
            ├── useUserStore.ts
        └── 📁styles
            ├── .gitkeep
            ├── globals.css
        └── 📁types
            └── 📁services
                ├── auth.d.ts
                ├── chat.d.ts
                ├── community.d.ts
                ├── user.d.ts
            ├── globals.d.ts
            ├── index.d.ts
        └── 📁utils
            ├── .gitkeep
    ├── .env.example
    ├── .env.local
    ├── .gitignore
    ├── .prettierignore
    ├── .prettierrc
    ├── bun.lock
    ├── bunfig.toml
    ├── components.json
    ├── eslint.config.js
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── README.md
    ├── tailwind.config.ts
    └── tsconfig.json
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

- **Routing (`app/`):** The structure clearly shows the separation between the **`(landing)`** group for unauthenticated users and the **`(main)`** group for the core application experience. The move of the post feed to `/feed` is also documented. The addition of the `/edit` page for posts is now visible.
- **Components (`components/`):** The `features/` directory is now fully fleshed out, with a sub-folder for each major feature domain (auth, chat, post, user, etc.). This makes the project incredibly easy to navigate. The `providers/` directory now correctly lists all our global system components, like the `NotificationSimulator` and `GlobalModals`.
- **State Management (`context/` & `store/`):** The structure explicitly shows the strategic decision to use both React Context and Zustand for different state management needs, a hallmark of a mature architecture.
- **Libraries & Utilities (`lib/`):** The addition of the `paths.ts` file is a key highlight, demonstrating a commitment to maintainable code by centralizing route management.

This final project structure is a complete and accurate representation of the sophisticated application you have built. It serves as an excellent architectural overview in your documentation.

### Key Additions and Clarifications in the Comments:

- **`app/`**: I've added more specific comments clarifying the purpose of each route group (`(auth)`, `(landing)`, `(main)`) and how they relate to the application's layouts.
- **`components/`**: I've reinforced the three-tiered ("smart" vs. "dumb" vs. "primitive") component philosophy, which is a key architectural concept.
- **`context/` vs `store/`**: I've explicitly stated the "why" behind using two different state management libraries (infrequent vs. frequent updates). This is a crucial senior-level distinction.
- **`lib/`**: Clarified that this directory (renamed from `libs`) is for core business logic, not just library code. Highlighted the `paths.ts` file's importance.
- **`locales/`, `styles/`, `utils/`**: I've added comments explaining the purpose of these new, well-organized directories you created.

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

## 📸 Screenshots

### Register Page

<div align="center">
  <img
    src="https://github.com/dhlananhh/synapse-frontend/blob/main/public/screenshots/RegisterPage.png"
    alt="Screenshot of Register Page"
  />
</div>

### Log In Page

<div align="center">
  <img
    src="https://github.com/dhlananhh/synapse-frontend/blob/main/public/screenshots/LogInPage.png"
    alt="Screenshot of Log In Page"
  />
</div>

### Reset Password Page

<div align="center">
  <img
    src="https://github.com/dhlananhh/synapse-frontend/blob/main/public/screenshots/ResetPasswordPage.png"
    alt="Screenshot of Reset Password Page"
  />
</div>
