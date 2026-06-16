'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { authAPI, progressAPI, paymentsAPI } from '@/lib/api'
import {
  TrophyIcon, FireIcon, BookOpenIcon, ChartBarIcon,
  ArrowRightIcon, CheckCircleIcon, AcademicCapIcon,
  GlobeAltIcon, DocumentCheckIcon,
} from '@heroicons/react/24/outline'
import { PageLoader } from '@/components/ui'

const EXAM_TYPE_LABELS = {
  dtm: 'DTM', ielts: 'IELTS', cefr: 'CEFR', national: 'Milliy', practice: 'Mashq'
}

export default function Dashboard() {
  const router = useRouter()
  const { user, isAuthenticated, initialized } = useSelector(s => s.auth)
  const [stats, setStats] = useState(null)
  const [progress, setProgress] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (initialized && !isAuthenticated) { router.push('/login'); return }
    if (!initialized) return
    loadData()
  }, [initialized, isAuthenticated])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsRes, progressRes, subRes] = await Promise.all([
        authAPI.getStats(),
        progressAPI.getMyProgress(),
        paymentsAPI.getMySubscription(),
      ])
      setStats(statsRes.data)
      setProgress(progressRes.data)
      setSubscription(subRes.data)
    } catch { } finally {
      setLoading(false)
    }
  }

  if (!initialized || loading) return <PageLoader />

  const quickActions = [
    { label: 'DTM Test',     icon: AcademicCapIcon,   path: '/dtm',            color: 'from-orange-500 to-orange-700', desc: "Yo'nalish tanlang" },
    { label: 'IELTS',        icon: GlobeAltIcon,      path: '/exams/ielts',    color: 'from-blue-500 to-blue-700',   desc: 'Tayyorgarlik' },
    { label: 'CEFR',         icon: BookOpenIcon,      path: '/exams/cefr',     color: 'from-green-500 to-emerald-700', desc: 'Daraja sinovi' },
    { label: 'Milliy Sert.', icon: DocumentCheckIcon, path: '/exams/national', color: 'from-purple-500 to-purple-700', desc: 'Sertifikat' },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Xush kelibsiz, {user?.first_name || user?.full_name?.split(' ')[0] || user?.username}!
          </h1>
          <p className="text-slate-400">Bugun qaysi imtihonga tayyorlanasiz?</p>
        </div>

        {/* Premium banner */}
        {!user?.is_premium && (
          <div className="mb-6 rounded-2xl p-5 text-white flex items-center justify-between"
               style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}>
            <div>
              <p className="font-bold text-lg">Premium oling — 37% chegirma!</p>
              <p className="text-violet-200 text-sm">Cheksiz testlar, barcha kurslar va ko'proq imkoniyatlar</p>
            </div>
            <Link href="/pricing" className="font-bold px-5 py-2 rounded-xl flex-shrink-0 transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
              Ko'rish
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Jami testlar',  value: stats?.total_tests || 0,       icon: BookOpenIcon,    color: 'text-blue-400',   bg: 'rgba(59,130,246,0.15)' },
            { label: 'Yakunlangan',   value: stats?.completed_tests || 0,   icon: CheckCircleIcon, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.15)' },
            { label: "O'rtacha ball", value: `${stats?.avg_score || 0}%`,   icon: ChartBarIcon,    color: 'text-violet-400',  bg: 'rgba(139,92,246,0.15)' },
            { label: 'Kunlik streak', value: progress?.streak?.current_streak || 0, icon: FireIcon, color: 'text-orange-400', bg: 'rgba(249,115,22,0.15)' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-1">
            <h2 className="font-bold text-white mb-4">Tezkor harakatlar</h2>
            <div className="space-y-3">
              {quickActions.map(({ label, icon: Icon, path, color, desc }) => (
                <Link key={path} href={path}
                  className="card p-4 flex items-center gap-4 hover:scale-[1.02] transition-all group block"
                  style={{ '--hover-border': 'rgba(139,92,246,0.4)' }}>
                  <div className={`bg-gradient-to-br ${color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{label}</div>
                    <div className="text-sm text-slate-400">{desc}</div>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent tests */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Oxirgi testlar</h2>
              <Link href="/progress" className="text-sm text-violet-400 hover:text-violet-300">Barchasi</Link>
            </div>

            {progress?.recent_tests?.length > 0 ? (
              <div className="space-y-3">
                {progress.recent_tests.map((test) => (
                  <div key={test.id} className="card p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      test.percentage >= 80 ? 'text-emerald-400' :
                      test.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`} style={{
                      background: test.percentage >= 80 ? 'rgba(16,185,129,0.15)' :
                                  test.percentage >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'
                    }}>
                      {test.percentage}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate">{test.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                          {EXAM_TYPE_LABELS[test.exam_type]}
                        </span>
                        <span>{test.correct_answers}/{test.total_questions} to'g'ri</span>
                      </div>
                    </div>
                    <Link href={`/progress/results/${test.id}`} className="text-sm text-violet-400 hover:text-violet-300 flex-shrink-0">
                      Ko'rish
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-10 text-center">
                <BookOpenIcon className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                <p className="text-slate-400">Hali test ishlanmagan</p>
                <Link href="/dtm" className="btn-gradient mt-4 inline-flex text-sm py-2 px-5">Birinchi testni boshlash</Link>
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        {progress?.achievements?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-amber-400" /> Yutuqlarim
            </h2>
            <div className="flex flex-wrap gap-3">
              {progress.achievements.map(({ id, achievement }) => (
                <div key={id} className="flex items-center gap-2 rounded-xl px-4 py-2"
                     style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <TrophyIcon className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-semibold text-amber-300">{achievement.name}</div>
                    <div className="text-xs text-amber-500">+{achievement.xp_reward} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
