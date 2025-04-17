import { AuthProvider } from '@/contexts/auth-context'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function PrivatePagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await auth()

  if (!user) {
    return redirect('/sign-in')
  }

  return <AuthProvider user={user}>{children}</AuthProvider>
}
