import { Navbar } from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex min-h-screen flex-col'>
      <Navbar />

      <main className='container mx-auto max-w-7xl flex-grow pt-8 mb-14'>{children}</main>

      <Footer />
    </div>
  )
}
