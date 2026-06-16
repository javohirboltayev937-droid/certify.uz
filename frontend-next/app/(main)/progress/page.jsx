'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { progressAPI } from '@/lib/api'
import { TrophyIcon, ChartBarIcon, FireIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { PageLoader } from '@/components/ui'

const EXAM_LABELS = { dtm: 'DTM', ielts: 'IELTS', cefr: 'CEFR', national: 'Milliy', practice: 'Mashq' }

export default function Progress() {
  const router = useRouter()
  const { isAuthenticated, initialized } = useSelector(s => s.auth)
  const [data, setData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (initialized && !isAuthenticated) { router.push('/login'); return }
    if (!initialized) return
    Promise.all([progressAPI.getMyProgress(), progressAPI.getHistory()])
      .then(([prog, hist]) => {
        setData(prog.data)
        setHistory(hist.data?.results || hist.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [initialized, isAuthenticated])

  if (!initialized || loading) return <PageLoader />

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <ChartBarIcon className="w-7 h-7 text-violet-400" /> Mening Progressim
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Jami testlar',   value: data?.stats?.total || 0,                        icon: BookOpenIcon,  bg: 'rgba(59,130,246,0.15)',  text: 'text-blue-400' },
            { label: "O'rtacha ball",  value: `${Math.round(data?.stats?.avg_score || 0)}%`,  icon: ChartBarIcon,  bg: 'rgba(139,92,246,0.15)', text: 'text-violet-400' },
            { label: 'Eng yuqori',     value: `${Math.round(data?.stats?.best_score || 0)}%`, icon: TrophyIcon,    bg: 'rgba(245,158,11,0.15)', text: 'text-amber-400' },
            { label: 'Streak',         value: `${data?.streak?.current_streak || 0} kun`,     icon: FireIcon,      bg: 'rgba(249,115,22,0.15)', text: 'text-orange-400' },
          ].map(({ label, value, icon: Icon, bg, text }) => (
            <div key={label} className="card p-5 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
                <Icon className={`w-5 h-5 ${text}`} />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {/* By exam type */}
        {data?.by_type?.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="font-bold mb-4 text-white">Imtihon turlari bo'yicha</h2>
            <div className="space-y-3">
              {data.by_type.map(({ exam_type, count, avg }) => (
                <div key={exam_type} className="flex items-center gap-4">
                  <span className="w-20 text-sm font-medium text-slate-300">{EXAM_LABELS[exam_type]}</span>
                  <div className="flex-1 progress-track">
                    <div className="progress-bar" style={{ width: `${avg || 0}%` }} />
                  </div>
                  <span className="text-sm text-slate-400">{Math.round(avg || 0)}% · {count} test</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data?.achievements?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-white">
              <TrophyIcon className="w-5 h-5 text-amber-400" /> Yutuqlar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.achievements.map(({ id, achievement, earned_at }) => (
                <div key={id} className="card p-4 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                       style={{ background: 'rgba(245,158,11,0.15)' }}>
                    <TrophyIcon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="font-semibold text-sm text-white">{achievement.name}</div>
                  <div className="text-xs text-amber-400">+{achievement.xp_reward} XP</div>
                  <div className="text-xs text-slate-500 mt-1">{new Date(earned_at).toLocaleDateString('uz-UZ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="font-bold mb-4 text-white">Test tarixi</h2>
          {history.length === 0 ? (
            <div className="card p-10 text-center">
              <BookOpenIcon className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p className="text-slate-400">Hali test ishlanmagan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((test) => (
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
                    <div className="font-medium text-sm text-white truncate">{test.title}</div>
                    <div className="text-xs text-slate-500">
                      {EXAM_LABELS[test.exam_type]} · {test.correct_answers}/{test.total_questions} · {new Date(test.completed_at).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>
                  <Link href={`/progress/results/${test.id}`} className="text-sm text-violet-400 hover:text-violet-300 flex-shrink-0">
                    Ko'rish
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
