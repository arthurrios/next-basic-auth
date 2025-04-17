import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function PublicPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await auth()

  if (user) {
    return redirect('/')
  }

  return <div>{children}</div>
}
