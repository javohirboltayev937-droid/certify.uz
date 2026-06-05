import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { coursesAPI } from '@/api/courses'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, LockClosedIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import { CardSkeleton } from '@/components/common/Loading'
import toast from 'react-hot-toast'

const LEVELS = [
  { value: '', label: 'Barcha darajalar' },
  { value: 'beginner', label: "Boshlang'ich" },
  { value: 'intermediate', label: "O'rta" },
  { value: 'advanced', label: 'Yuqori' },
]

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const subjectParam = searchParams.get('subject') || ''

  useEffect(() => {
    coursesAPI.getSubjects().then(({ data }) => setSubjects(data.results || data)).catch(() => {})
  }, [])

  useEffect(() => {
    loadCourses()
  }, [subjectParam, level, search])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const params = {}
      if (subjectParam) params['subject__slug'] = subjectParam
      if (level) params.level = level
      if (search) params.search = search
      const { data } = await coursesAPI.getCourses(params)
      setCourses(data.results || data)
    } catch {
      toast.error('Kurslarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectFilter = (slug) => {
    if (slug) setSearchParams({ subject: slug })
    else setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-2">📚 Barcha Kurslar</h1>
          <p className="text-primary-200">Video darslar, materiallar va testlar bilan to'liq tayyorgarlik</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Kurs qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <select value={level} onChange={e => setLevel(e.target.value)} className="input-field md:w-48">
            {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        {/* Subject tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          <button
            onClick={() => handleSubjectFilter('')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              !subjectParam ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Barchasi
          </button>
          {subjects.map(s => (
            <button
              key={s.slug}
              onClick={() => handleSubjectFilter(s.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                subjectParam === s.slug ? 'text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              style={subjectParam === s.slug ? { backgroundColor: s.color } : {}}
            >
              {s.name}
            </button>
          ))}
        </div>

        {loading ? (
          <CardSkeleton count={6} />
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-gray-500">Kurs topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/courses/${course.slug}`} className="card block group overflow-hidden">
                  <div className="h-36 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {course.subject_icon || '📖'}
                      </div>
                    )}
                    {course.is_premium && (
                      <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <LockClosedIcon className="w-3 h-3" /> Premium
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge text-xs" style={{ backgroundColor: course.subject_color + '20', color: course.subject_color }}>
                        {course.subject_name}
                      </span>
                      <span className={`badge text-xs ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {course.level === 'beginner' ? "Boshlang'ich" : course.level === 'intermediate' ? "O'rta" : 'Yuqori'}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <PlayCircleIcon className="w-4 h-4" /> {course.total_lessons} dars
                      </span>
                      <span>{course.total_duration} daqiqa</span>
                      <span>{course.enrolled_count} o'quvchi</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
