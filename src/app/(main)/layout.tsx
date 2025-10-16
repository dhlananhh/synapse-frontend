import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ChatTray } from "@/components/features/chat/ChatTray";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto mb-14 max-w-7xl flex-grow pt-8">
        { children }
      </main>
      <Footer />
      <ChatTray />
    </div>
  );
}
