'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { authAPI, progressAPI, paymentsAPI } from '@/lib/api'
import {
  TrophyIcon, FireIcon, BookOpenIcon, ChartBarIcon,
  ArrowRightIcon, ClockIcon, CheckCircleIcon, AcademicCapIcon,
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
    { label: 'DTM Test',     icon: AcademicCapIcon,   path: '/dtm',            color: 'bg-orange-500', desc: "Yo'nalish tanlang" },
    { label: 'IELTS',        icon: GlobeAltIcon,      path: '/exams/ielts',    color: 'bg-blue-500',   desc: 'Tayyorgarlik' },
    { label: 'CEFR',         icon: BookOpenIcon,      path: '/exams/cefr',     color: 'bg-green-500',  desc: 'Daraja sinovi' },
    { label: 'Milliy Sert.', icon: DocumentCheckIcon, path: '/exams/national', color: 'bg-purple-500', desc: 'Sertifikat' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Xush kelibsiz, {user?.first_name || user?.full_name?.split(' ')[0] || user?.username}!
          </h1>
          <p className="text-gray-500">Bugun qaysi imtihonga tayyorlanasiz?</p>
        </div>

        {/* Premium banner */}
        {!user?.is_premium && (
          <div className="mb-6 bg-gradient-to-r from-primary-600 to-purple-700 rounded-2xl p-5 text-white flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">Premium oling — 37% chegirma!</p>
              <p className="text-primary-200 text-sm">Cheksiz testlar, barcha kurslar va ko'proq imkoniyatlar</p>
            </div>
            <Link href="/pricing" className="bg-yellow-400 text-gray-900 font-bold px-5 py-2 rounded-xl hover:bg-yellow-300 flex-shrink-0">
              Ko'rish
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Jami testlar',  value: stats?.total_tests || 0,       icon: BookOpenIcon,    color: 'text-blue-600',   bg: 'bg-blue-50' },
            { label: 'Yakunlangan',   value: stats?.completed_tests || 0,   icon: CheckCircleIcon, color: 'text-green-600',  bg: 'bg-green-50' },
            { label: "O'rtacha ball", value: `${stats?.avg_score || 0}%`,   icon: ChartBarIcon,    color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Kunlik streak', value: progress?.streak?.current_streak || 0, icon: FireIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(({ label, value, icon: Icon, color, bg }, i) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-1">
            <h2 className="font-bold text-gray-900 mb-4">Tezkor harakatlar</h2>
            <div className="space-y-3">
              {quickActions.map(({ label, icon: Icon, path, color, desc }) => (
                <Link key={path} href={path}
                  className="card p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform group block">
                  <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{label}</div>
                    <div className="text-sm text-gray-500">{desc}</div>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent tests */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Oxirgi testlar</h2>
              <Link href="/progress" className="text-sm text-primary-600 hover:underline">Barchasi</Link>
            </div>

            {progress?.recent_tests?.length > 0 ? (
              <div className="space-y-3">
                {progress.recent_tests.map((test) => (
                  <div key={test.id} className="card p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0
                      ${test.percentage >= 80 ? 'bg-green-100 text-green-700' :
                        test.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}`}>
                      {test.percentage}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{test.title}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {EXAM_TYPE_LABELS[test.exam_type]}
                        </span>
                        <span>{test.correct_answers}/{test.total_questions} to'g'ri</span>
                      </div>
                    </div>
                    <Link href={`/progress/results/${test.id}`} className="text-sm text-primary-600 hover:underline flex-shrink-0">
                      Ko'rish
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-10 text-center text-gray-400">
                <BookOpenIcon className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p>Hali test ishlanmagan</p>
                <Link href="/dtm" className="btn-primary mt-4 inline-flex text-sm py-2 px-5">Birinchi testni boshlash</Link>
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        {progress?.achievements?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-amber-500" /> Yutuqlarim
            </h2>
            <div className="flex flex-wrap gap-3">
              {progress.achievements.map(({ id, achievement }) => (
                <div key={id} className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                  <TrophyIcon className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="text-sm font-semibold text-amber-800">{achievement.name}</div>
                    <div className="text-xs text-amber-600">+{achievement.xp_reward} XP</div>
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
