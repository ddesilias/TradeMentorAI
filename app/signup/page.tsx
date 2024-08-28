import { auth } from '@/auth'
import SignupForm from '@/components/signup-form'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function SignupPage() {
  const session = (await auth()) as Session

  if (session) {
    redirect('/')
  }

  return (
    <main className="flex items-center justify-center min-h-screen w-full">
      <SignupForm />
    </main>
  )
}
