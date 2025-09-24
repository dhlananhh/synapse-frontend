import React from "react";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/libs/utils";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import I18nProvider from "@/components/providers/I18nProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TopProgressBar from "@/components/providers/TopProgressBar";
// import ChatWidget from "@/components/features/chat/ChatWidget";
import NotificationSimulator from "@/components/providers/NotificationSimulator";
import { CommandMenuProvider } from "@/context/CommandMenuContext";


const lexend = Lexend({
  subsets: [ "latin" ],
  variable: "--font-sans",
  weight: [ "300", "400", "500", "600", "700" ],
});


export const metadata: Metadata = {
  title: "Synapse - Where Minds Connect",
  description: "Synapse is a modern discussion forum where communities share and explore knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={
        cn(
          "min-h-screen bg-background font-sans antialiased",
          lexend.variable
        )
      }>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TopProgressBar />

            <CommandMenuProvider>
              <AuthProvider>
                <NotificationSimulator />
                { children }
                {/* <ChatWidget /> */ }
              </AuthProvider>
            </CommandMenuProvider>

            <Toaster
              richColors
              position="top-right"
              theme="system"
            />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
