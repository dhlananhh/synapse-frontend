import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { GlobalChatManager } from "@/components/features/chat/GlobalChatManager";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 w-full container mx-auto max-w-full px-4 py-6 pt-16">
        { children }
      </main>

      <Footer />
      <GlobalChatManager />
    </div>
  );
}
