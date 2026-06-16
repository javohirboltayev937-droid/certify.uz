'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { examsAPI } from '@/lib/api'
import { ArrowRightIcon, ClockIcon, DocumentTextIcon, TrophyIcon, BookOpenIcon, GlobeAltIcon, DocumentCheckIcon, AcademicCapIcon, ChartBarIcon, SparklesIcon, BoltIcon } from '@heroicons/react/24/outline'

const EXAM_CONFIG = {
  ielts: {
    path: '/exams/ielts', gradient: 'from-blue-500 to-blue-700', icon: GlobeAltIcon,
    features: ['Listening', 'Reading', 'Writing', 'Speaking'], label: 'Band 4.0 - 9.0',
    color: '#60a5fa', glow: 'rgba(59,130,246,0.3)',
  },
  ielts_academic: {
    path: '/exams/ielts', gradient: 'from-blue-500 to-indigo-700', icon: GlobeAltIcon,
    features: ['Academic Reading', 'Academic Writing', 'Listening', 'Speaking'], label: 'Academic',
    color: '#818cf8', glow: 'rgba(99,102,241,0.3)',
  },
  ielts_general: {
    path: '/exams/ielts', gradient: 'from-sky-500 to-blue-700', icon: GlobeAltIcon,
    features: ['General Reading', 'Letter Writing', 'Listening', 'Speaking'], label: 'General Training',
    color: '#38bdf8', glow: 'rgba(14,165,233,0.3)',
  },
  cefr: {
    path: '/exams/cefr', gradient: 'from-emerald-500 to-green-700', icon: BookOpenIcon,
    features: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], label: 'A1 - C2',
    color: '#34d399', glow: 'rgba(16,185,129,0.3)',
  },
  national: {
    path: '/exams/national', gradient: 'from-violet-500 to-purple-700', icon: DocumentCheckIcon,
    features: ['Ingliz tili', 'Matematika', 'Biologiya', 'Fizika'], label: 'Milliy sertifikat',
    color: '#a78bfa', glow: 'rgba(139,92,246,0.3)',
  },
  dtm: {
    path: '/dtm', gradient: 'from-orange-500 to-orange-700', icon: AcademicCapIcon,
    features: ['Matematika', 'Fizika', 'Biologiya', 'Kimyo'], label: '82+ yo\'nalish',
    color: '#fb923c', glow: 'rgba(249,115,22,0.3)',
  },
}

const INFO_CARDS = [
  { icon: ChartBarIcon,  title: 'Real imtihon formati',   desc: 'Barcha testlar haqiqiy imtihon shaklida tayyorlangan', color: '#a78bfa' },
  { icon: SparklesIcon,  title: 'Cheksiz urinishlar',     desc: 'Premium bilan bir testni xohlagancha qayta ishlash',   color: '#60a5fa' },
  { icon: TrophyIcon,    title: 'Progress kuzatuvi',      desc: "Har bir urinishda o'sishingizni ko'ring",              color: '#34d399' },
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-20"
               style={{ background: 'radial-gradient(circle, #7c3aed 0%, #2563eb 60%, transparent 80%)' }} />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="section-tag mx-auto mb-5 w-fit">
            <BoltIcon className="w-3.5 h-3.5" /> Imtihon platformasi
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            <span className="gradient-text">Imtihon Turlari</span>
          </h1>
          <p className="text-slate-400 text-lg">IELTS, CEFR, Milliy sertifikat — barchasi bir joyda</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse overflow-hidden">
                <div className="h-28" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="p-5 space-y-2">
                  <div className="h-4 rounded w-2/3" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-4 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : examTypes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(EXAM_CONFIG).slice(0, 4).map(([key, config]) => (
              <Link key={key} href={config.path}
                className="glass-card-hover block overflow-hidden group">
                <div className={`bg-gradient-to-br ${config.gradient} p-6 text-white`}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                       style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <config.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-extrabold mb-1 capitalize">{key.replace('_', ' ').toUpperCase()}</h2>
                  <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>{config.label}</span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {config.features.map(f => (
                      <span key={f} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>{f}</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold flex items-center gap-1 transition-colors" style={{ color: config.color }}>
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
                  className="glass-card-hover block overflow-hidden group">
                  <div className={`bg-gradient-to-br ${config.gradient || 'from-slate-700 to-slate-800'} p-6 text-white`}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                         style={{ background: 'rgba(255,255,255,0.2)' }}>
                      <IconC className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-extrabold mb-1">{exam.name}</h2>
                    <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>{config.label}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-400 text-sm mb-4">{exam.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {config.features?.map(f => (
                        <span key={f} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>{f}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        {exam.duration_minutes > 0 && (
                          <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {exam.duration_minutes} daqiqa</span>
                        )}
                        <span className="flex items-center gap-1"><DocumentTextIcon className="w-4 h-4" /> {exam.mock_exam_count} mock test</span>
                      </div>
                      {exam.is_premium && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>Premium</span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: config.color || '#a78bfa' }}>
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
          {INFO_CARDS.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card p-5 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                   style={{ background: `${color}20` }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
