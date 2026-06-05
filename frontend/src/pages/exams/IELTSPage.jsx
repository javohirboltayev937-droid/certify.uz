import { useState, useEffect } from 'react'
import { examsAPI } from '@/api/exams'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Spinner } from '@/components/common/Loading'

const SECTIONS = [
  { id: 'listening', label: 'Listening', icon: '🎧', desc: '40 savol · 30 daqiqa + 10 daqiqa ko\'chirish vaqti', color: 'bg-blue-50 border-blue-200' },
  { id: 'reading', label: 'Reading', icon: '📖', desc: '40 savol · 60 daqiqa. Academic va General', color: 'bg-green-50 border-green-200' },
  { id: 'writing', label: 'Writing', icon: '✍️', desc: '2 ta task · 60 daqiqa. Graph/Essay', color: 'bg-purple-50 border-purple-200' },
  { id: 'speaking', label: 'Speaking', icon: '🗣️', desc: '3 qism · 11-14 daqiqa. Ekzaminator bilan', color: 'bg-orange-50 border-orange-200' },
]

const BAND_SCORES = [
  { band: '9.0', level: 'Expert', color: 'bg-purple-600' },
  { band: '8.0-8.5', level: 'Very Good', color: 'bg-blue-600' },
  { band: '7.0-7.5', level: 'Good', color: 'bg-green-600' },
  { band: '6.0-6.5', level: 'Competent', color: 'bg-yellow-600' },
  { band: '5.0-5.5', level: 'Modest', color: 'bg-orange-600' },
  { band: '4.0-4.5', level: 'Limited', color: 'bg-red-600' },
]

export default function IELTSPage() {
  const [tips, setTips] = useState([])
  const [selectedSection, setSelectedSection] = useState('general')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    examsAPI.getIELTSTips(selectedSection === 'general' ? '' : selectedSection)
      .then(({ data }) => setTips(data.results || data))
      .finally(() => setLoading(false))
  }, [selectedSection])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-2">🏆 IELTS Tayyorgarlik</h1>
          <p className="text-blue-200 text-lg mb-6">
            International English Language Testing System — Band 4.0 dan 9.0 gacha
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/dtm" className="bg-white text-blue-800 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50">
              Mock test ishlash →
            </Link>
            <Link to="/courses?subject=english" className="border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10">
              Kurslar ko'rish
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* 4 sections */}
        <h2 className="text-2xl font-bold mb-4">IELTS 4 bo'limi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card p-5 border ${s.color}`}
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{s.label}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Band scores */}
        <h2 className="text-2xl font-bold mb-4">Band Score Jadvali</h2>
        <div className="card overflow-hidden mb-10">
          <table className="w-full">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="text-left px-4 py-3 text-sm">Band</th>
                <th className="text-left px-4 py-3 text-sm">Daraja</th>
                <th className="text-left px-4 py-3 text-sm">Foydalanish</th>
              </tr>
            </thead>
            <tbody>
              {BAND_SCORES.map(({ band, level, color }, i) => (
                <tr key={band} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3">
                    <span className={`${color} text-white font-bold px-3 py-1 rounded-lg text-sm`}>{band}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 text-sm">{level}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {band.includes('9') ? 'Magistratura (top universitetlar)' :
                     band.includes('8') ? 'Magistratura (xalqaro)' :
                     band.includes('7') ? 'Bakalavr (xalqaro)' :
                     band.includes('6') ? 'Ish va ta\'lim (Evropa/Avstraliya)' :
                     band.includes('5') ? 'Asosiy kommunikatsiya' : 'Cheklangan foydalanish'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips */}
        <h2 className="text-2xl font-bold mb-4">Tayyorgarlik maslahatlari</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          {['general', 'listening', 'reading', 'writing', 'speaking'].map(s => (
            <button key={s}
              onClick={() => setSelectedSection(s)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                selectedSection === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}>
              {s === 'general' ? 'Umumiy' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : tips.length > 0 ? (
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <h3 className="font-bold text-gray-900 mb-2">{i + 1}. {tip.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tip.content}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-400">
            <p>Bu bo'lim uchun maslahatlar hali qo'shilmagan</p>
          </div>
        )}
      </div>
    </div>
  )
}
