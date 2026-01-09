import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', label: 'Acasă' },
  { href: '/users', label: 'Utilizatori' },
  { href: '/courses', label: 'Cursuri' },
  { href: '/subjects', label: 'Subiecte' },
  { href: '/classes', label: 'Clase' },
  { href: '/submissions', label: 'Trimiteri' },
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="font-medium text-gray-900">
              E-Learning
            </Link>
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    router.pathname === item.href || router.pathname.startsWith(item.href + '/')
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
