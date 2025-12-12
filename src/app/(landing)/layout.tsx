import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";


export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{ children }</main>
      <Footer />
    </div>
  );
}
