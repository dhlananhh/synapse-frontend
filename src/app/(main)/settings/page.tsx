export default function SettingsPage() {
  return <div>Settings coming soon</div>
}

// import React from "react";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger
// } from "@/components/ui/tabs";
// import AccountTab from "@/components/features/settings/tabs/AccountTab";
// import ProfileTab from "@/components/features/settings/tabs/ProfileTab";
// import NotificationsTab from "@/components/features/settings/tabs/NotificationsTab";
// import EmailTab from "@/components/features/settings/tabs/EmailTab";
// import PreferencesTab from "@/components/features/settings/tabs/PreferencesTab";
// import PrivacyTab from "@/components/features/settings/tabs/PrivacyTab";

// export const dynamic = "force-dynamic";

// export default function SettingsPage() {
//   return (
//     <div className="mt-10 mb-10">
//       <h1 className="text-3xl font-bold mb-6">Settings</h1>

//       <Tabs defaultValue="account" className="w-full">
//         <TabsList className="grid w-full grid-cols-6 mb-6">
//           <TabsTrigger value="account">Account</TabsTrigger>
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="privacy">Privacy</TabsTrigger>
//           <TabsTrigger value="preferences">Preferences</TabsTrigger>
//           <TabsTrigger value="notifications">Notifications</TabsTrigger>
//           <TabsTrigger value="email">Email</TabsTrigger>
//         </TabsList>

//         <TabsContent value="account">
//           <AccountTab />
//         </TabsContent>
//         <TabsContent value="profile">
//           <ProfileTab />
//         </TabsContent>
//         <TabsContent value="privacy">
//           <PrivacyTab />
//         </TabsContent>
//         <TabsContent value="preferences">
//           <PreferencesTab />
//         </TabsContent>
//         <TabsContent value="notifications">
//           <NotificationsTab />
//         </TabsContent>
//         <TabsContent value="email">
//           <EmailTab />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
