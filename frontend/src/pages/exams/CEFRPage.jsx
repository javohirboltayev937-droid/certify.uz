import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const LEVELS = [
  { level: 'A1', name: 'Beginner', color: 'bg-gray-100 border-gray-300', desc: 'Asosiy so\'z va iboralar. Oddiy savollar va javoblar.', examples: ['Ismingiz nima?', 'Qayerda yashasiz?', 'Necha yoshsiz?'] },
  { level: 'A2', name: 'Elementary', color: 'bg-blue-50 border-blue-200', desc: 'Kundalik muloqot. Oddiy jumlalar va iboralar.', examples: ['Ish haqida gapirish', 'Yo\'l so\'rash', 'Xarid qilish'] },
  { level: 'B1', name: 'Intermediate', color: 'bg-green-50 border-green-200', desc: 'Tanish mavzular haqida fikr bildira olish.', examples: ['Sayohat', 'Orzular', 'Voqealar'] },
  { level: 'B2', name: 'Upper Intermediate', color: 'bg-yellow-50 border-yellow-200', desc: 'Murakkab mavzular. Texnik va kasb suhbatlari.', examples: ['Mutaxassislik mavzulari', 'Munozara', 'Tahlil'] },
  { level: 'C1', name: 'Advanced', color: 'bg-orange-50 border-orange-200', desc: 'Murakkab va uzoq matnlar. Akademik yozuv.', examples: ['Akademik matnlar', 'Spontan nutq', 'Ijodiy yozish'] },
  { level: 'C2', name: 'Proficiency', color: 'bg-purple-50 border-purple-200', desc: 'Ona tili darajasi. Har qanday vaziyatda muloqot.', examples: ['Ona tilida muloqot', 'Akademik muvaffaqiyat', 'Professional daraja'] },
]

export default function CEFRPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-green-700 to-emerald-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-2">🌍 CEFR Daraja Tizimi</h1>
          <p className="text-green-200 text-lg">
            Common European Framework of Reference for Languages — A1 dan C2 gacha
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">CEFR daraja darajalari</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {LEVELS.map((l, i) => (
            <motion.div
              key={l.level}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`card p-5 border ${l.color}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-extrabold text-gray-900">{l.level}</span>
                <span className="text-sm font-semibold text-gray-600">{l.name}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{l.desc}</p>
              <ul className="space-y-1">
                {l.examples.map(e => (
                  <li key={e} className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="text-green-500">✓</span> {e}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="card p-6 bg-green-50 border border-green-200">
          <h3 className="font-bold text-green-900 mb-2">IELTS ↔ CEFR mos keladigan darajalar</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-green-300">
                  <th className="text-left py-2 text-green-800">CEFR</th>
                  <th className="text-left py-2 text-green-800">IELTS Band</th>
                  <th className="text-left py-2 text-green-800">Daraja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-200">
                {[
                  ['C2', '8.5 - 9.0', 'Proficiency'],
                  ['C1', '7.0 - 8.0', 'Advanced'],
                  ['B2', '5.5 - 6.5', 'Upper Intermediate'],
                  ['B1', '4.0 - 5.0', 'Intermediate'],
                  ['A2', '3.0 - 3.5', 'Elementary'],
                  ['A1', '1.0 - 2.5', 'Beginner'],
                ].map(([cefr, ielts, level]) => (
                  <tr key={cefr}>
                    <td className="py-2 font-bold text-green-800">{cefr}</td>
                    <td className="py-2 text-gray-700">{ielts}</td>
                    <td className="py-2 text-gray-600">{level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/courses?subject=english" className="btn-primary">
            Ingliz tili kurslarini ko'rish →
          </Link>
        </div>
      </div>
    </div>
  )
}
