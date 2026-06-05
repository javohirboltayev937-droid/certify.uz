'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { examsAPI } from '@/lib/api'
import { ArrowRightIcon, ClockIcon, DocumentTextIcon, TrophyIcon, BookOpenIcon, GlobeAltIcon, DocumentCheckIcon, AcademicCapIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline'

const EXAM_CONFIG = {
  ielts: {
    path: '/exams/ielts', gradient: 'from-blue-600 to-blue-800', icon: GlobeAltIcon,
    features: ['Listening', 'Reading', 'Writing', 'Speaking'], label: 'Band 4.0 - 9.0',
  },
  ielts_academic: {
    path: '/exams/ielts', gradient: 'from-blue-500 to-indigo-700', icon: GlobeAltIcon,
    features: ['Academic Reading', 'Academic Writing', 'Listening', 'Speaking'], label: 'Academic',
  },
  ielts_general: {
    path: '/exams/ielts', gradient: 'from-sky-500 to-blue-700', icon: GlobeAltIcon,
    features: ['General Reading', 'Letter Writing', 'Listening', 'Speaking'], label: 'General Training',
  },
  cefr: {
    path: '/exams/cefr', gradient: 'from-green-600 to-emerald-800', icon: BookOpenIcon,
    features: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], label: 'A1 - C2',
  },
  national: {
    path: '/exams/national', gradient: 'from-purple-600 to-purple-900', icon: DocumentCheckIcon,
    features: ['Ingliz tili', 'Matematika', 'Biologiya', 'Fizika'], label: 'Milliy sertifikat',
  },
  dtm: {
    path: '/dtm', gradient: 'from-orange-500 to-orange-700', icon: AcademicCapIcon,
    features: ['Matematika', 'Fizika', 'Biologiya', 'Kimyo'], label: '82+ yo\'nalish',
  },
}

const INFO_CARDS = [
  { icon: ChartBarIcon,  title: 'Real imtihon formati',   desc: 'Barcha testlar haqiqiy imtihon shaklida tayyorlangan' },
  { icon: SparklesIcon,  title: 'Cheksiz urinishlar',     desc: 'Premium bilan bir testni xohlagancha qayta ishlash' },
  { icon: TrophyIcon,    title: 'Progress kuzatuvi',      desc: "Har bir urinishda o'sishingizni ko'ring" },
]

export default function Exams() {
  const [examTypes, setExamTypes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    examsAPI.getExamTypes()
      .then(r => setExamTypes(r.data?.results || r.data || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-3 flex items-center justify-center gap-3">
            <TrophyIcon className="w-10 h-10 text-yellow-400" /> Imtihon Turlari
          </h1>
          <p className="text-gray-300 text-lg">IELTS, CEFR, Milliy sertifikat — barchasi bir joyda</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse overflow-hidden">
                <div className="h-28 bg-gray-200" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : examTypes.length === 0 ? (
          /* Fallback: show static cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(EXAM_CONFIG).slice(0, 4).map(([key, config]) => (
              <Link key={key} href={config.path} className="card block group overflow-hidden hover:scale-[1.02] transition-transform">
                <div className={`bg-gradient-to-br ${config.gradient} p-6 text-white`}>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <config.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-extrabold mb-1 capitalize">{key.replace('_', ' ').toUpperCase()}</h2>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{config.label}</span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {config.features.map(f => <span key={f} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{f}</span>)}
                  </div>
                  <span className="text-sm font-semibold text-primary-600 group-hover:underline flex items-center gap-1">
                    Tayyorgarlikni boshlash <ArrowRightIcon className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examTypes.map(exam => {
              const config = EXAM_CONFIG[exam.exam_type] || {}
              const IconC = config.icon || TrophyIcon
              return (
                <Link key={exam.id} href={config.path || `/exams/${exam.slug}`}
                  className="card block group overflow-hidden hover:scale-[1.02] transition-transform">
                  <div className={`bg-gradient-to-br ${config.gradient || 'from-gray-700 to-gray-900'} p-6 text-white`}>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                      <IconC className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-extrabold mb-1">{exam.name}</h2>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{config.label}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {config.features?.map(f => <span key={f} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{f}</span>)}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        {exam.duration_minutes > 0 && (
                          <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {exam.duration_minutes} daqiqa</span>
                        )}
                        <span className="flex items-center gap-1"><DocumentTextIcon className="w-4 h-4" /> {exam.mock_exam_count} mock test</span>
                      </div>
                      {exam.is_premium && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Premium</span>}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:underline">
                      Tayyorgarlikni boshlash <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Info cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {INFO_CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 text-center">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
