import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authAPI } from '@/api/auth'
import { progressAPI } from '@/api/exams'
import { paymentsAPI } from '@/api/payments'
import { motion } from 'framer-motion'
import {
  TrophyIcon, FireIcon, BookOpenIcon, ChartBarIcon,
  ArrowRightIcon, StarIcon, ClockIcon, CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Spinner } from '@/components/common/Loading'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const EXAM_TYPE_LABELS = {
  dtm: 'DTM', ielts: 'IELTS', cefr: 'CEFR', national: 'Milliy', practice: 'Mashq'
}

export default function Dashboard() {
  const { user } = useSelector(s => s.auth)
  const [stats, setStats] = useState(null)
  const [progress, setProgress] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  const quickActions = [
    { label: 'DTM Test', icon: '🎓', path: '/dtm', color: 'bg-orange-500', desc: 'Yo\'nalish tanlang' },
    { label: 'IELTS', icon: '🏆', path: '/exams/ielts', color: 'bg-blue-500', desc: 'Tayyorgarlik' },
    { label: 'CEFR', icon: '🌍', path: '/exams/cefr', color: 'bg-green-500', desc: 'Daraja sinovi' },
    { label: 'Milliy Sert.', icon: '🇺🇿', path: '/exams/national', color: 'bg-purple-500', desc: 'Sertifikat' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Xush kelibsiz, {user?.first_name || user?.username}! 👋
          </h1>
          <p className="text-gray-500">Bugun qaysi imtihonga tayyorlanasiz?</p>
        </motion.div>

        {/* Premium banner */}
        {!user?.is_premium && (
          <div className="mb-6 bg-gradient-to-r from-primary-600 to-purple-700 rounded-2xl p-5 text-white flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">Premium oling — 37% chegirma!</p>
              <p className="text-primary-200 text-sm">Cheksiz testlar, barcha kurslar va ko'proq imkoniyatlar</p>
            </div>
            <Link to="/pricing" className="bg-yellow-400 text-gray-900 font-bold px-5 py-2 rounded-xl hover:bg-yellow-300 flex-shrink-0">
              Ko'rish
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Jami testlar', value: stats?.total_tests || 0, icon: BookOpenIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Yakunlangan', value: stats?.completed_tests || 0, icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'O\'rtacha ball', value: `${stats?.avg_score || 0}%`, icon: ChartBarIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Kunlik streak', value: progress?.streak?.current_streak || 0, icon: FireIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-5"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-1">
            <h2 className="font-bold text-gray-900 mb-4">Tezkor harakatlar</h2>
            <div className="space-y-3">
              {quickActions.map(({ label, icon, path, color, desc }) => (
                <Link key={path} to={path}
                  className="card p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform group">
                  <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                    {icon}
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
              <Link to="/progress" className="text-sm text-primary-600 hover:underline">Barchasi</Link>
            </div>

            {progress?.recent_tests?.length > 0 ? (
              <div className="space-y-3">
                {progress.recent_tests.map((test) => (
                  <div key={test.id} className="card p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
                      ${test.percentage >= 80 ? 'bg-green-100 text-green-700' :
                        test.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}`}>
                      {test.percentage}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{test.title}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="badge bg-gray-100 text-gray-600">{EXAM_TYPE_LABELS[test.exam_type]}</span>
                        <span>{test.correct_answers}/{test.total_questions} to'g'ri</span>
                      </div>
                    </div>
                    <Link to={`/progress/results/${test.id}`}
                      className="text-sm text-primary-600 hover:underline flex-shrink-0">
                      Ko'rish
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-10 text-center text-gray-400">
                <div className="text-4xl mb-3">📝</div>
                <p>Hali test ishlanmagan</p>
                <Link to="/dtm" className="btn-primary mt-4 text-sm py-2 px-5">Birinchi testni boshlash</Link>
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        {progress?.achievements?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold text-gray-900 mb-4">Yutuqlarim 🏆</h2>
            <div className="flex flex-wrap gap-3">
              {progress.achievements.map(({ id, achievement }) => (
                <div key={id} className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                  <span className="text-2xl">{achievement.icon}</span>
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
