import Link from 'next/link'
import { AcademicCapIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-lg text-white mb-3">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-4 h-4 text-white" />
              </div>
              Certify<span className="text-primary-400">.uz</span>
            </div>
            <p className="text-sm leading-relaxed">
              O'zbekistondagi eng yirik imtihon tayyorgarlik platformasi.
            </p>
          </div>
          {[
            { title: 'Xizmatlar', links: [['Kurslar', '/courses'], ['Imtihonlar', '/exams'], ['DTM Test', '/dtm'], ['Narxlar', '/pricing']] },
            { title: 'Imtihonlar', links: [['IELTS', '/exams/ielts'], ['CEFR', '/exams/cefr'], ['Milliy sertifikat', '/exams/national'], ['DTM', '/dtm']] },
            { title: 'Kompaniya', links: [['Biz haqimizda', '/about'], ['Aloqa', '/contact'], ['Maxfiylik', '/privacy'], ['Shartlar', '/terms']] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-white text-sm mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} Certify.uz. Barcha huquqlar himoyalangan.</p>
          <p>Payme · Click · UzCard · Humo</p>
        </div>
      </div>
    </footer>
  )
}
