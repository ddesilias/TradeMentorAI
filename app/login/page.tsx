import { auth } from '@/auth'
import LoginForm from '@/components/login-form'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = (await auth()) as Session

  if (session) {
    redirect('/')
  }

  return (
    <main className="flex items-center justify-center min-h-screen w-full">
      <LoginForm />
    </main>
  )
}
