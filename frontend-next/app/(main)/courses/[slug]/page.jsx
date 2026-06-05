'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { coursesAPI } from '@/lib/api'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { PlayCircleIcon, LockClosedIcon, DocumentTextIcon, ClockIcon, UserGroupIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { PageLoader } from '@/components/ui'

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <a href="/courses" className="hover:text-white">Kurslar</a>
            <span>/</span>
            <span className="text-primary-400">{course.subject?.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-3">{course.title}</h1>
          <p className="text-gray-300 mb-6">{course.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {course.total_lessons && <span className="flex items-center gap-1"><PlayCircleIcon className="w-4 h-4" /> {course.total_lessons} dars</span>}
            {course.total_duration && <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {course.total_duration} daqiqa</span>}
            {course.enrolled_count && <span className="flex items-center gap-1"><UserGroupIcon className="w-4 h-4" /> {course.enrolled_count} o'quvchi</span>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Darslar ro'yxati</h2>
            <div className="space-y-2">
              {(course.lessons || []).map((lesson, i) => {
                const locked = !lesson.is_free && course.is_premium && !user?.is_premium
                const LIcon = lessonTypeIcons[lesson.lesson_type] || BookOpenIcon
                return (
                  <div key={lesson.id} className={`card p-4 flex items-center gap-4 ${locked ? 'opacity-60' : ''}`}>
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <LIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900">{i + 1}. {lesson.title}</div>
                      <div className="text-xs text-gray-500">{lesson.duration} daqiqa</div>
                    </div>
                    {locked ? (
                      <LockClosedIcon className="w-4 h-4 text-gray-400" />
                    ) : lesson.is_free ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Bepul</span>
                    ) : null}
                  </div>
                )
              })}
              {(!course.lessons || course.lessons.length === 0) && (
                <div className="card p-8 text-center text-gray-400">Darslar hali qo'shilmagan</div>
              )}
            </div>

            {/* Materials */}
            {course.materials?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">O'quv materiallari</h2>
                <div className="space-y-2">
                  {course.materials.map(m => (
                    <div key={m.id} className="card p-3 flex items-center gap-3">
                      <DocumentTextIcon className="w-5 h-5 text-primary-600" />
                      <span className="text-sm">{m.title}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ml-auto">{m.material_type?.toUpperCase()}</span>
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
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                {course.is_premium ? 'Premium' : 'Bepul'}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {course.is_premium ? 'Premium obuna talab qilinadi' : 'Barcha uchun ochiq'}
              </p>

              {course.is_enrolled ? (
                <button className="btn-primary w-full mb-3 opacity-80 cursor-not-allowed justify-center">
                  Yozilgansiz
                </button>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full mb-3 justify-center">
                  {enrolling ? 'Yuklanmoqda...' : 'Kursga yozilish'}
                </button>
              )}

              {course.is_premium && !user?.is_premium && (
                <a href="/pricing" className="btn-secondary w-full text-center block text-sm">
                  Premium oling
                </a>
              )}

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {course.level && (
                  <div className="flex justify-between">
                    <span>Daraja:</span>
                    <span className="font-medium">
                      {course.level === 'beginner' ? "Boshlang'ich" : course.level === 'intermediate' ? "O'rta" : 'Yuqori'}
                    </span>
                  </div>
                )}
                {course.subject?.name && (
                  <div className="flex justify-between">
                    <span>Fan:</span>
                    <span className="font-medium text-primary-600">{course.subject.name}</span>
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
