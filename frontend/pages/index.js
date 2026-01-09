import Layout from '../components/Layout';
import Link from 'next/link';

const sections = [
  {
    title: 'Utilizatori',
    description: 'Gestionează utilizatorii sistemului (profesori, elevi)',
    href: '/users',
  },
  {
    title: 'Cursuri',
    description: 'Administrează cursurile disponibile',
    href: '/courses',
  },
  {
    title: 'Subiecte',
    description: 'Creează și editează subiecte cu exerciții',
    href: '/subjects',
  },
  {
    title: 'Clase Virtuale',
    description: 'Gestionează clasele virtuale',
    href: '/classes',
  },
  {
    title: 'Trimiteri',
    description: 'Vizualizează răspunsurile elevilor',
    href: '/submissions',
  },
];

export default function Home() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900">E-Learning Platform</h1>
        <p className="text-gray-500 mt-1">Sistem de gestionare pentru învățământul online</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <h2 className="font-medium text-gray-900">{section.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{section.description}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
