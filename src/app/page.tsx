import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
import { getAuthSession } from '@/lib/auth/utils'

export default async function Home() {
  const session = await getAuthSession()
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar session={session} />
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}



