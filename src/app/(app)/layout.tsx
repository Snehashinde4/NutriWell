import { checkAuth, getAuthSession } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import NextAuthProvider from "@/lib/auth/Provider";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  const session = await getAuthSession()
  return (<main>
    <NextAuthProvider>
      <div className="flex h-screen">
        <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
          <Navbar  session={session} />
          {children}
        </main>
      </div>
    </NextAuthProvider>
    <Toaster richColors />
  </main>)
}
