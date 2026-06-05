import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { progressAPI } from '@/api/exams'
import { motion } from 'framer-motion'
import { Spinner } from '@/components/common/Loading'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const EXAM_LABELS = { dtm: 'DTM', ielts: 'IELTS', cefr: 'CEFR', national: 'Milliy', practice: 'Mashq' }

export default function Progress() {
  const [data, setData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([progressAPI.getMyProgress(), progressAPI.getHistory()])
      .then(([prog, hist]) => {
        setData(prog.data)
        setHistory(hist.data.results || hist.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const chartData = history.slice(0, 10).reverse().map((t, i) => ({
    name: `Test ${i + 1}`,
    ball: t.percentage,
    type: EXAM_LABELS[t.exam_type],
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📊 Mening Progressim</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Jami testlar', value: data?.stats?.total || 0, emoji: '📝' },
            { label: 'O\'rtacha ball', value: `${Math.round(data?.stats?.avg_score || 0)}%`, emoji: '📊' },
            { label: 'Eng yuqori', value: `${Math.round(data?.stats?.best_score || 0)}%`, emoji: '🏆' },
            { label: 'Streak', value: `${data?.streak?.current_streak || 0} kun`, emoji: '🔥' },
          ].map(({ label, value, emoji }) => (
            <div key={label} className="card p-5 text-center">
              <div className="text-3xl mb-1">{emoji}</div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="font-bold mb-4">Natijalar dinamikasi</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(val, name) => [`${val}%`, 'Ball']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="ball" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* By exam type */}
        {data?.by_type?.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="font-bold mb-4">Imtihon turlari bo'yicha</h2>
            <div className="space-y-3">
              {data.by_type.map(({ exam_type, count, avg }) => (
                <div key={exam_type} className="flex items-center gap-4">
                  <span className="w-20 text-sm font-medium text-gray-700">{EXAM_LABELS[exam_type]}</span>
                  <div className="flex-1">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${avg || 0}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{Math.round(avg || 0)}% · {count} test</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data?.achievements?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold mb-4">Yutuqlar 🏆</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.achievements.map(({ id, achievement, earned_at }) => (
                <div key={id} className="card p-4 text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <div className="font-semibold text-sm text-gray-900">{achievement.name}</div>
                  <div className="text-xs text-amber-600">+{achievement.xp_reward} XP</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(earned_at).toLocaleDateString('uz-UZ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="font-bold mb-4">Test tarixi</h2>
          {history.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p>Hali test ishlanmagan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((test) => (
                <div key={test.id} className="card p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${test.percentage >= 80 ? 'bg-green-100 text-green-700' :
                      test.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'}`}>
                    {test.percentage}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{test.title}</div>
                    <div className="text-xs text-gray-500">
                      {EXAM_LABELS[test.exam_type]} · {test.correct_answers}/{test.total_questions} · {new Date(test.completed_at).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>
                  <Link to={`/progress/results/${test.id}`} className="text-sm text-primary-600 hover:underline flex-shrink-0">
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
