import Navbar from "@/components/shared/Navbar"
import Sidebar from "@/components/shared/Sidebar"


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">

      <div className="flex-shrink-0 z-30 hidden md:block">
        <div className="sticky top-0 h-screen w-[270px] border-r bg-background">
          <Sidebar />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">

        <Navbar />

        <main className="flex-1 pt-16 px-0 md:px-6 w-full max-w-full">
          { children }
        </main>

      </div>
    </div>
  )
}
