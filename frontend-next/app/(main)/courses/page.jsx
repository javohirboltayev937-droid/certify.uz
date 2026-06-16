'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { coursesAPI } from '@/lib/api'
import { MagnifyingGlassIcon, LockClosedIcon, PlayCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const LEVELS = [
  { value: '', label: 'Barcha darajalar' },
  { value: 'beginner', label: "Boshlang'ich" },
  { value: 'intermediate', label: "O'rta" },
  { value: 'advanced', label: 'Yuqori' },
]

const LEVEL_STYLES = {
  beginner:     { color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
  intermediate: { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
  advanced:     { color: '#f87171', bg: 'rgba(239,68,68,0.12)' },
}
const LEVEL_LABELS = { beginner: "Boshlang'ich", intermediate: "O'rta", advanced: 'Yuqori' }

function CoursesInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const subjectParam = searchParams.get('subject') || ''

  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')

  useEffect(() => {
    coursesAPI.getSubjects().then(r => setSubjects(r.data?.results || r.data || [])).catch(() => {})
  }, [])

  useEffect(() => { loadCourses() }, [subjectParam, level, search])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const params = {}
      if (subjectParam) params['subject__slug'] = subjectParam
      if (level) params.level = level
      if (search) params.search = search
      const r = await coursesAPI.getCourses(params)
      setCourses(r.data?.results || r.data || [])
    } catch { toast.error('Kurslarni yuklashda xatolik') }
    finally { setLoading(false) }
  }

  const handleSubjectFilter = (slug) => {
    const p = new URLSearchParams(searchParams)
    if (slug) p.set('subject', slug)
    else p.delete('subject')
    router.push(`/courses?${p.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative pt-28 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-15"
               style={{ background: 'radial-gradient(circle, #7c3aed 0%, #2563eb 60%, transparent 80%)' }} />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              <BookOpenIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Barcha Kurslar</h1>
              <p className="text-violet-400">Video darslar, materiallar va testlar bilan to'liq tayyorgarlik</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input type="text" placeholder="Kurs qidirish..." value={search}
              onChange={e => setSearch(e.target.value)} className="input pl-12" />
          </div>
          <select value={level} onChange={e => setLevel(e.target.value)} className="input md:w-48">
            {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        {/* Subject tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button onClick={() => handleSubjectFilter('')}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={!subjectParam
              ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: 'white' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
            Barchasi
          </button>
          {subjects.map(s => (
            <button key={s.slug} onClick={() => handleSubjectFilter(s.slug)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={subjectParam === s.slug
                ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: 'white' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
              {s.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse overflow-hidden">
                <div className="h-36 rounded-t-2xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="p-5 space-y-2">
                  <div className="h-4 rounded w-1/3" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-5 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="h-4 rounded" style={{ background: 'rgba(255,255,255,0.03)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpenIcon className="w-12 h-12 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400">Kurs topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link key={course.id} href={`/courses/${course.slug}`}
                className="glass-card-hover block overflow-hidden group">
                <div className="h-36 relative overflow-hidden"
                     style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(37,99,235,0.3))' }}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpenIcon className="w-14 h-14 text-slate-600" />
                    </div>
                  )}
                  {course.is_premium && (
                    <div className="absolute top-2 right-2 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-xs"
                         style={{ background: 'rgba(245,158,11,0.9)', color: '#1c1917' }}>
                      <LockClosedIcon className="w-3 h-3" /> Premium
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {course.subject_name && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
                        {course.subject_name}
                      </span>
                    )}
                    {course.level && (() => {
                      const ls = LEVEL_STYLES[course.level]
                      return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: ls?.bg, color: ls?.color }}>
                          {LEVEL_LABELS[course.level]}
                        </span>
                      )
                    })()}
                  </div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    {course.total_lessons && <span className="flex items-center gap-1"><PlayCircleIcon className="w-4 h-4" /> {course.total_lessons} dars</span>}
                    {course.total_duration && <span>{course.total_duration} daqiqa</span>}
                    {course.enrolled_count && <span>{course.enrolled_count} o'quvchi</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Courses() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
             style={{ borderColor: 'rgba(139,92,246,0.3)', borderTopColor: '#7c3aed' }} />
      </div>
    }>
      <CoursesInner />
    </Suspense>
  )
}
