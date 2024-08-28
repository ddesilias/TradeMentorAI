import { Button } from '@/components/ui/button'
import Link from 'next/link'
export default function MainNav() {
  return (
    <>
      <nav className="ml-4 flex sm:justify-center space-x-4">
        {[
          ['Chat', '/'],
          ['Cryptocurrency', '/cryptocurrency'],
          ['News', '/news'],
          ['Trading Journal', '/trading-journal']
        ].map(([title, url]) => (
          <Button variant="ghost" key={url}>
            <Link
              href={url}
            >
              {title}
            </Link>
          </Button>
        ))}
      </nav>
    </>
  )
}
