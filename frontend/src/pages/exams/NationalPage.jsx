import { useState, useEffect } from 'react'
import { examsAPI } from '@/api/exams'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Spinner } from '@/components/common/Loading'

const SUBJECTS = [
  { icon: '🇬🇧', name: 'Ingliz tili', slug: 'english' },
  { icon: '🇷🇺', name: 'Rus tili', slug: 'russian' },
  { icon: '🇺🇿', name: 'O\'zbek tili', slug: 'uzbek' },
  { icon: '🇩🇪', name: 'Nemis tili', slug: 'german' },
  { icon: '🇫🇷', name: 'Fransuz tili', slug: 'french' },
  { icon: '🔢', name: 'Matematika', slug: 'mathematics' },
  { icon: '⚛️', name: 'Fizika', slug: 'physics' },
  { icon: '🧪', name: 'Kimyo', slug: 'chemistry' },
  { icon: '🧬', name: 'Biologiya', slug: 'biology' },
  { icon: '📜', name: 'Tarix', slug: 'history' },
]

export default function NationalPage() {
  const [certs, setCerts] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = selectedSubject ? { 'subject__slug': selectedSubject } : {}
    setLoading(true)
    examsAPI.getNationalCerts(params)
      .then(({ data }) => setCerts(data.results || data))
      .finally(() => setLoading(false))
  }, [selectedSubject])

  const LEVEL_COLORS = {
    A1: 'bg-gray-100 text-gray-700',
    A2: 'bg-blue-100 text-blue-700',
    B1: 'bg-green-100 text-green-700',
    B2: 'bg-yellow-100 text-yellow-700',
    C1: 'bg-orange-100 text-orange-700',
    C2: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-2">🇺🇿 Milliy Sertifikat</h1>
          <p className="text-purple-200 text-lg">
            O'zbekiston Milliy sertifikat tizimi — barcha fanlardan A1 dan C2 gacha
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* About */}
        <div className="card p-6 bg-purple-50 border border-purple-200 mb-8">
          <h2 className="font-bold text-purple-900 mb-2">Milliy sertifikat nima?</h2>
          <p className="text-purple-800 text-sm leading-relaxed">
            Milliy sertifikat — O'zbekiston hukumati tomonidan tasdiqlangan til va fan sertifikatlash tizimi.
            Davlat xizmatlari, universitetga kirish, ish joyi uchun zarur bo'lgan rasmiy hujjat.
            CEFR darajalari asosida (A1-C2) beriladi.
          </p>
        </div>

        {/* Subject filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedSubject('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              !selectedSubject ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            Barchasi
          </button>
          {SUBJECTS.map(s => (
            <button
              key={s.slug}
              onClick={() => setSelectedSubject(s.slug === selectedSubject ? '' : s.slug)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedSubject === s.slug ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : certs.length === 0 ? (
          <div className="card p-10 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>Bu fan uchun sertifikat topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{SUBJECTS.find(s => s.name === cert.subject_name)?.icon || '📚'}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{cert.subject_name}</h3>
                      <span className={`badge text-sm ${LEVEL_COLORS[cert.level]}`}>{cert.level} daraja</span>
                    </div>
                  </div>
                  {cert.fee_uzs && (
                    <span className="text-sm font-semibold text-gray-700">
                      {Number(cert.fee_uzs).toLocaleString()} so'm
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">{cert.description}</p>

                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-gray-900">{cert.duration_minutes}</div>
                    <div className="text-xs text-gray-500">daqiqa</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-gray-900">{cert.total_questions}</div>
                    <div className="text-xs text-gray-500">savol</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-gray-900">{cert.passing_percentage}%</div>
                    <div className="text-xs text-gray-500">o'tish bali</div>
                  </div>
                </div>

                <Link to={`/courses?subject=${SUBJECTS.find(s => s.name === cert.subject_name)?.slug || ''}`}
                  className="text-sm text-purple-600 font-medium hover:underline">
                  Tayyorgarlikni boshlash →
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
