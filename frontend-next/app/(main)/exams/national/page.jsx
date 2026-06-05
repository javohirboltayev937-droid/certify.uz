'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { examsAPI } from '@/lib/api'
import { DocumentCheckIcon, BookOpenIcon, GlobeAltIcon, AcademicCapIcon, SparklesIcon, CalculatorIcon } from '@heroicons/react/24/outline'

const SUBJECTS = [
  { icon: GlobeAltIcon,       name: 'Ingliz tili',  slug: 'english' },
  { icon: GlobeAltIcon,       name: 'Rus tili',     slug: 'russian' },
  { icon: DocumentCheckIcon,  name: "O'zbek tili",  slug: 'uzbek' },
  { icon: GlobeAltIcon,       name: 'Nemis tili',   slug: 'german' },
  { icon: GlobeAltIcon,       name: 'Fransuz tili', slug: 'french' },
  { icon: SparklesIcon,       name: 'Matematika',   slug: 'mathematics' },
  { icon: SparklesIcon,       name: 'Fizika',       slug: 'physics' },
  { icon: SparklesIcon,       name: 'Kimyo',        slug: 'chemistry' },
  { icon: SparklesIcon,       name: 'Biologiya',    slug: 'biology' },
  { icon: BookOpenIcon,       name: 'Tarix',        slug: 'history' },
]

const LEVEL_COLORS = {
  A1: 'bg-gray-100 text-gray-700',  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-green-100 text-green-700', B2: 'bg-yellow-100 text-yellow-700',
  C1: 'bg-orange-100 text-orange-700', C2: 'bg-purple-100 text-purple-700',
}

export default function NationalPage() {
  const [certs, setCerts] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = selectedSubject ? { 'subject__slug': selectedSubject } : {}
    setLoading(true)
    examsAPI.getNationalCerts(params)
      .then(r => setCerts(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedSubject])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
            <DocumentCheckIcon className="w-10 h-10" /> Milliy Sertifikat
          </h1>
          <p className="text-purple-200 text-lg">
            O'zbekiston Milliy sertifikat tizimi — barcha fanlardan A1 dan C2 gacha
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* About */}
        <div className="card p-6 bg-purple-50 border border-purple-200 mb-8">
          <h2 className="font-bold text-purple-900 mb-2">Milliy sertifikat nima?</h2>
          <p className="text-purple-800 text-sm leading-relaxed">
            Milliy sertifikat — O'zbekiston hukumati tomonidan tasdiqlangan til va fan sertifikatlash tizimi.
            Davlat xizmatlari, universitetga kirish, ish joyi uchun zarur bo'lgan rasmiy hujjat.
            CEFR darajalari asosida (A1-C2) beriladi.
          </p>
        </div>

        {/* Subject filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setSelectedSubject('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              !selectedSubject ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
            }`}>
            Barchasi
          </button>
          {SUBJECTS.map(s => (
            <button key={s.slug} onClick={() => setSelectedSubject(s.slug === selectedSubject ? '' : s.slug)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedSubject === s.slug ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}>
              <s.icon className="w-4 h-4" /> {s.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : certs.length === 0 ? (
          <div className="card p-10 text-center text-gray-400">
            <DocumentCheckIcon className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p>Bu fan uchun sertifikat topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((cert, i) => {
              const subj = SUBJECTS.find(s => s.name === cert.subject_name)
              const SubIcon = subj?.icon || BookOpenIcon
              return (
                <div key={cert.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <SubIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{cert.subject_name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${LEVEL_COLORS[cert.level] || 'bg-gray-100 text-gray-700'}`}>
                          {cert.level} daraja
                        </span>
                      </div>
                    </div>
                    {cert.fee_uzs && (
                      <span className="text-sm font-semibold text-gray-700">
                        {Number(cert.fee_uzs).toLocaleString()} so'm
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{cert.description}</p>

                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    {cert.duration_minutes && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-sm font-bold text-gray-900">{cert.duration_minutes}</div>
                        <div className="text-xs text-gray-500">daqiqa</div>
                      </div>
                    )}
                    {cert.total_questions && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-sm font-bold text-gray-900">{cert.total_questions}</div>
                        <div className="text-xs text-gray-500">savol</div>
                      </div>
                    )}
                    {cert.passing_percentage && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-sm font-bold text-gray-900">{cert.passing_percentage}%</div>
                        <div className="text-xs text-gray-500">o'tish bali</div>
                      </div>
                    )}
                  </div>

                  <Link href={`/courses?subject=${subj?.slug || ''}`} className="text-sm text-purple-600 font-medium hover:underline">
                    Tayyorgarlikni boshlash →
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
