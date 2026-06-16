'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { examsAPI } from '@/lib/api'
import { MicrophoneIcon, BookOpenIcon, PencilSquareIcon, SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

const SECTIONS = [
  { id: 'listening', label: 'Listening', icon: SpeakerWaveIcon,   desc: "40 savol · 30 daqiqa + 10 daqiqa ko'chirish vaqti", color: '#60a5fa',  bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)' },
  { id: 'reading',   label: 'Reading',   icon: BookOpenIcon,       desc: '40 savol · 60 daqiqa. Academic va General',         color: '#34d399',  bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)' },
  { id: 'writing',   label: 'Writing',   icon: PencilSquareIcon,   desc: '2 ta task · 60 daqiqa. Graph/Essay',               color: '#a78bfa',  bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.25)' },
  { id: 'speaking',  label: 'Speaking',  icon: MicrophoneIcon,     desc: '3 qism · 11-14 daqiqa. Ekzaminator bilan',         color: '#fb923c',  bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)' },
]

const BAND_SCORES = [
  { band: '9.0',     level: 'Expert',    color: '#a78bfa', usage: 'Magistratura (top universitetlar)' },
  { band: '8.0-8.5', level: 'Very Good', color: '#60a5fa', usage: 'Magistratura (xalqaro)' },
  { band: '7.0-7.5', level: 'Good',      color: '#34d399', usage: 'Bakalavr (xalqaro)' },
  { band: '6.0-6.5', level: 'Competent', color: '#fbbf24', usage: "Ish va ta'lim (Evropa/Avstraliya)" },
  { band: '5.0-5.5', level: 'Modest',    color: '#fb923c', usage: 'Asosiy kommunikatsiya' },
  { band: '4.0-4.5', level: 'Limited',   color: '#f87171', usage: 'Cheklangan foydalanish' },
]

export default function IELTSPage() {
  const [tips, setTips] = useState([])
  const [selectedSection, setSelectedSection] = useState('general')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    examsAPI.getIELTSTips(selectedSection === 'general' ? '' : selectedSection)
      .then(r => setTips(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedSection])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative pt-28 pb-14 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-15"
               style={{ background: 'radial-gradient(circle, #2563eb 0%, #0ea5e9 60%, transparent 80%)' }} />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)' }}>
              <GlobeAltIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">IELTS Tayyorgarlik</h1>
              <p className="text-blue-400">International English Language Testing System — Band 4.0 dan 9.0 gacha</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/dtm" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)' }}>
              Mock test ishlash →
            </Link>
            <Link href="/courses?subject=english" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}>
              Kurslar ko'rish
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* 4 sections */}
        <h2 className="text-2xl font-bold mb-4 text-white">IELTS 4 bo'limi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {SECTIONS.map(s => (
            <div key={s.id} className="card p-5" style={{ borderColor: s.border }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <h3 className="font-bold text-lg text-white mb-1">{s.label}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Band scores */}
        <h2 className="text-2xl font-bold mb-4 text-white">Band Score Jadvali</h2>
        <div className="card overflow-hidden mb-10">
          <table className="w-full">
            <thead style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)' }}>
              <tr>
                <th className="text-left px-4 py-3 text-sm text-white">Band</th>
                <th className="text-left px-4 py-3 text-sm text-white">Daraja</th>
                <th className="text-left px-4 py-3 text-sm text-white">Foydalanish</th>
              </tr>
            </thead>
            <tbody>
              {BAND_SCORES.map(({ band, level, color, usage }, i) => (
                <tr key={band} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)' }}>
                  <td className="px-4 py-3">
                    <span className="font-bold px-3 py-1 rounded-lg text-sm" style={{ color, background: `${color}20` }}>{band}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white text-sm">{level}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips */}
        <h2 className="text-2xl font-bold mb-4 text-white">Tayyorgarlik maslahatlari</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {['general', 'listening', 'reading', 'writing', 'speaking'].map(s => (
            <button key={s} onClick={() => setSelectedSection(s)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={selectedSection === s
                ? { background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: 'white' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
              {s === 'general' ? 'Umumiy' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(37,99,235,0.3)', borderTopColor: '#2563eb' }} />
          </div>
        ) : tips.length > 0 ? (
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <div key={tip.id} className="card p-5">
                <h3 className="font-bold text-white mb-2">{i + 1}. {tip.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{tip.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-slate-500">
            <p>Bu bo'lim uchun maslahatlar hali qo'shilmagan</p>
          </div>
        )}
      </div>
    </div>
  )
}
