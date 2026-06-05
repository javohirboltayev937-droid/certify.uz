import { Link } from 'react-router-dom'
import { AcademicCapIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-brand rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Certify.uz</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              O'zbekistondagi eng keng qamrovli sertifikat va imtihon tayyorgarlik platformasi.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-sm">📱</span>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-sm">💬</span>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-sm">📺</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Imtihonlar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/exams/ielts" className="hover:text-white transition-colors">IELTS Tayyorgarlik</Link></li>
              <li><Link to="/exams/cefr" className="hover:text-white transition-colors">CEFR Daraja</Link></li>
              <li><Link to="/exams/national" className="hover:text-white transition-colors">Milliy Sertifikat</Link></li>
              <li><Link to="/dtm" className="hover:text-white transition-colors">DTM Test</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Fanlar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses?subject=english" className="hover:text-white transition-colors">🇬🇧 Ingliz tili</Link></li>
              <li><Link to="/courses?subject=mathematics" className="hover:text-white transition-colors">🔢 Matematika</Link></li>
              <li><Link to="/courses?subject=physics" className="hover:text-white transition-colors">⚛️ Fizika</Link></li>
              <li><Link to="/courses?subject=biology" className="hover:text-white transition-colors">🧬 Biologiya</Link></li>
              <li><Link to="/courses?subject=chemistry" className="hover:text-white transition-colors">🧪 Kimyo</Link></li>
              <li><Link to="/courses?subject=history" className="hover:text-white transition-colors">📜 Tarix</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Sayt</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/pricing" className="hover:text-white transition-colors">Narxlar</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Biz haqimizda</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Bog'lanish</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Ko'p beriladigan savollar</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2024 Certify.uz. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300">Maxfiylik</Link>
            <Link to="/terms" className="hover:text-gray-300">Shartlar</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
