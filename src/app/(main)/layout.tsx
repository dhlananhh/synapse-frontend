import { Navbar } from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex min-h-screen'>
      {/* Sidebar */}
      <aside className='w-70 bg-muted text-muted-foreground h-screen sticky top-[28px] flex-shrink-0'>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className='flex flex-col flex-grow'>
        <Navbar />
        <main className='flex-grow w-full pt-8 mb-14'>{children}</main>
      </div>
    </div>
  )
}
