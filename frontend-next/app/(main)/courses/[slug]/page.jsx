'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { coursesAPI } from '@/lib/api'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { PlayCircleIcon, LockClosedIcon, DocumentTextIcon, ClockIcon, UserGroupIcon, BookOpenIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { PageLoader } from '@/components/ui'

const LEVEL_LABELS = { beginner: "Boshlang'ich", intermediate: "O'rta", advanced: 'Yuqori' }
const LEVEL_COLORS = {
  beginner:     { color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
  intermediate: { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
  advanced:     { color: '#f87171', bg: 'rgba(239,68,68,0.12)' },
}

export default function CourseDetail() {
  const { slug } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const { isAuthenticated, user } = useSelector(s => s.auth)

  useEffect(() => {
    coursesAPI.getCourse(slug)
      .then(r => setCourse(r.data))
      .catch(() => router.push('/courses'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleEnroll = async () => {
    if (!isAuthenticated) { router.push('/login'); return }
    try {
      setEnrolling(true)
      await coursesAPI.enroll(course.id)
      toast.success('Kursga yozildingiz!')
      setCourse(prev => ({ ...prev, is_enrolled: true }))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Xatolik')
    } finally { setEnrolling(false) }
  }

  if (loading) return <PageLoader />
  if (!course) return null

  const lessonTypeIcons = { video: PlayCircleIcon, text: DocumentTextIcon, quiz: BookOpenIcon, audio: PlayCircleIcon }
  const lvl = LEVEL_COLORS[course.level]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative pt-20 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-15"
               style={{ background: 'radial-gradient(circle, #7c3aed 0%, #2563eb 60%, transparent 80%)' }} />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
            <Link href="/courses" className="hover:text-violet-400 transition-colors">Kurslar</Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            {course.subject?.name && <span className="text-violet-400">{course.subject.name}</span>}
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">{course.title}</h1>
          <p className="text-slate-400 mb-5 max-w-2xl">{course.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            {course.total_lessons && (
              <span className="flex items-center gap-1.5"><PlayCircleIcon className="w-4 h-4" /> {course.total_lessons} dars</span>
            )}
            {course.total_duration && (
              <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4" /> {course.total_duration} daqiqa</span>
            )}
            {course.enrolled_count && (
              <span className="flex items-center gap-1.5"><UserGroupIcon className="w-4 h-4" /> {course.enrolled_count} o'quvchi</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Darslar ro'yxati</h2>
            <div className="space-y-2">
              {(course.lessons || []).map((lesson, i) => {
                const locked = !lesson.is_free && course.is_premium && !user?.is_premium
                const LIcon = lessonTypeIcons[lesson.lesson_type] || BookOpenIcon
                return (
                  <div key={lesson.id} className={`card p-4 flex items-center gap-4 ${locked ? 'opacity-50' : ''}`}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(139,92,246,0.15)' }}>
                      <LIcon className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-white">{i + 1}. {lesson.title}</div>
                      {lesson.duration && <div className="text-xs text-slate-500">{lesson.duration} daqiqa</div>}
                    </div>
                    {locked ? (
                      <LockClosedIcon className="w-4 h-4 text-slate-600" />
                    ) : lesson.is_free ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>Bepul</span>
                    ) : null}
                  </div>
                )
              })}
              {(!course.lessons || course.lessons.length === 0) && (
                <div className="card p-8 text-center text-slate-500">Darslar hali qo'shilmagan</div>
              )}
            </div>

            {/* Materials */}
            {course.materials?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">O'quv materiallari</h2>
                <div className="space-y-2">
                  {course.materials.map(m => (
                    <div key={m.id} className="card p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                           style={{ background: 'rgba(37,99,235,0.15)' }}>
                        <DocumentTextIcon className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm text-white flex-1">{m.title}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}>
                        {m.material_type?.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card p-6 sticky top-20">
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded-xl mb-4" />
              )}

              <div className="text-3xl font-extrabold text-white mb-1">
                {course.is_premium ? 'Premium' : 'Bepul'}
              </div>
              <p className="text-sm text-slate-400 mb-5">
                {course.is_premium ? 'Premium obuna talab qilinadi' : 'Barcha uchun ochiq'}
              </p>

              {course.is_enrolled ? (
                <div className="w-full py-3 rounded-xl font-semibold text-center mb-3 text-slate-400"
                     style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
                  Yozilgansiz ✓
                </div>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling}
                  className="btn-gradient w-full justify-center py-3 mb-3 disabled:opacity-50">
                  {enrolling ? 'Yuklanmoqda...' : 'Kursga yozilish'}
                </button>
              )}

              {course.is_premium && !user?.is_premium && (
                <Link href="/pricing"
                  className="w-full py-2.5 rounded-xl text-center block text-sm font-semibold text-white transition-all"
                  style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
                  Premium oling →
                </Link>
              )}

              <div className="mt-5 space-y-2.5 text-sm">
                {course.level && lvl && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Daraja:</span>
                    <span className="font-medium px-2.5 py-0.5 rounded-full text-xs"
                          style={{ background: lvl.bg, color: lvl.color }}>
                      {LEVEL_LABELS[course.level]}
                    </span>
                  </div>
                )}
                {course.subject?.name && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Fan:</span>
                    <span className="font-medium text-violet-400">{course.subject.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
