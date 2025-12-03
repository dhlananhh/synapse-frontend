import { Navbar } from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex min-h-screen'>
      {/* Sidebar */}
      <aside className='w-70 bg-muted text-muted-foreground flex-shrink-0'>
        <div className='sticky top-[32px] max-h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide'>
          {/* Sidebar content is scrollable */}
          <Sidebar />
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex flex-col flex-grow'>
        <Navbar />
        <main className='flex-grow w-full pt-8 mb-14 px-4 sm:px-6 lg:px-8'>{children}</main>
      </div>
    </div>
  )
}
