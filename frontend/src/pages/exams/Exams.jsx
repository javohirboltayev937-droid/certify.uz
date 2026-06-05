import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { examsAPI } from '@/api/exams'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { Spinner } from '@/components/common/Loading'

const EXAM_CONFIG = {
  ielts: {
    path: '/exams/ielts',
    gradient: 'from-blue-600 to-blue-800',
    icon: '🏆',
    features: ['Listening', 'Reading', 'Writing', 'Speaking'],
    label: 'Band 4.0 - 9.0',
  },
  ielts_academic: {
    path: '/exams/ielts',
    gradient: 'from-blue-500 to-indigo-700',
    icon: '📐',
    features: ['Academic Reading', 'Academic Writing', 'Listening', 'Speaking'],
    label: 'Academic',
  },
  ielts_general: {
    path: '/exams/ielts',
    gradient: 'from-sky-500 to-blue-700',
    icon: '📋',
    features: ['General Reading', 'Letter Writing', 'Listening', 'Speaking'],
    label: 'General Training',
  },
  cefr: {
    path: '/exams/cefr',
    gradient: 'from-green-600 to-emerald-800',
    icon: '🌍',
    features: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    label: 'A1 - C2',
  },
  national: {
    path: '/exams/national',
    gradient: 'from-purple-600 to-purple-900',
    icon: '🇺🇿',
    features: ['Ingliz tili', 'Matematika', 'Biologiya', 'Fizika'],
    label: 'Milliy sertifikat',
  },
}

export default function Exams() {
  const [examTypes, setExamTypes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    examsAPI.getExamTypes()
      .then(({ data }) => setExamTypes(data.results || data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-3">🎯 Imtihon Turlari</h1>
          <p className="text-gray-300 text-lg">IELTS, CEFR, Milliy sertifikat — barchasi bir joyda</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examTypes.map((exam, i) => {
              const config = EXAM_CONFIG[exam.exam_type] || {}
              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={config.path || `/exams/${exam.slug}`}
                    className="card block group overflow-hidden hover:scale-[1.02] transition-transform"
                  >
                    <div className={`bg-gradient-to-br ${config.gradient || 'from-gray-700 to-gray-900'} p-6 text-white`}>
                      <div className="text-4xl mb-3">{config.icon || '📝'}</div>
                      <h2 className="text-2xl font-extrabold mb-1">{exam.name}</h2>
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{config.label}</span>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 text-sm mb-4">{exam.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {config.features?.map(f => (
                          <span key={f} className="badge bg-gray-100 text-gray-600 text-xs">{f}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          {exam.duration_minutes > 0 && (
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" /> {exam.duration_minutes} daqiqa
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <DocumentTextIcon className="w-4 h-4" /> {exam.mock_exam_count} mock test
                          </span>
                        </div>
                        {exam.is_premium && (
                          <span className="badge bg-amber-100 text-amber-700 text-xs">Premium</span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary-600 group-hover:underline">
                          Tayyorgarlikni boshlash →
                        </span>
                        {exam.passing_score && (
                          <span className="text-xs text-gray-400">O'tish bali: {exam.passing_score}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Info cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '📊', title: 'Real imtihon formati', desc: 'Barcha testlar haqiqiy imtihon shaklida tayyorlangan' },
            { icon: '🔄', title: 'Cheksiz urinishlar', desc: 'Premium bilan bir testni xohlagancha qayta ishlash' },
            { icon: '📈', title: 'Progress kuzatuvi', desc: 'Har bir urinishda o\'sishingizni ko\'ring' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card p-5 text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
