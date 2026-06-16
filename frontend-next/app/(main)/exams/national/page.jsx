'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  DocumentCheckIcon, BookOpenIcon, GlobeAltIcon,
  AcademicCapIcon, SparklesIcon, ClockIcon,
  ChartBarIcon, TrophyIcon, BoltIcon,
  CheckCircleIcon, ArrowRightIcon,
} from '@heroicons/react/24/outline'

/* ── Statik ma'lumotlar ── */
const LEVEL_META = {
  A1: { color:'#22c55e',  bg:'rgba(34,197,94,0.12)',   border:'rgba(34,197,94,0.3)',  label:'A1 — Boshlang\'ich',    icon:'🌱' },
  A2: { color:'#3b82f6',  bg:'rgba(59,130,246,0.12)',  border:'rgba(59,130,246,0.3)', label:'A2 — Asosiy',           icon:'📗' },
  B1: { color:'#8b5cf6',  bg:'rgba(139,92,246,0.12)',  border:'rgba(139,92,246,0.3)', label:'B1 — O\'rta',           icon:'📘' },
  B2: { color:'#f59e0b',  bg:'rgba(245,158,11,0.12)',  border:'rgba(245,158,11,0.3)', label:'B2 — Yuqori O\'rta',    icon:'📙' },
  C1: { color:'#ef4444',  bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.3)',  label:'C1 — Ilg\'or',          icon:'📕' },
  C2: { color:'#a855f7',  bg:'rgba(168,85,247,0.12)',  border:'rgba(168,85,247,0.3)', label:'C2 — Mukammal',         icon:'👑' },
}

const NATIONAL_CERTS = [
  /* ── TIL SERTIFIKATLARI ── */
  {
    id:1, subject:'Ingliz tili', slug:'english', category:'language',
    Icon: GlobeAltIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:100000,  desc:'Oddiy so\'z va iboralar, salomlashish, raqamlar.' },
      { level:'A2', questions:60,  time:80,  pass:60, fee:150000,  desc:'Kundalik muloqot, oddiy grammatika, qisqa matnlar.' },
      { level:'B1', questions:80,  time:100, pass:65, fee:200000,  desc:'Tanish mavzularda fikr bildirish, murakkablik o\'sadi.' },
      { level:'B2', questions:90,  time:120, pass:65, fee:250000,  desc:'Akademik va professional muloqot, murakkab matnlar.' },
      { level:'C1', questions:100, time:150, pass:70, fee:300000,  desc:'Ilg\'or daraja, akademik yozuv, nozik ma\'no.' },
      { level:'C2', questions:100, time:180, pass:75, fee:350000,  desc:'Mukammal daraja, ona tili darajasida muloqot.' },
    ],
  },
  {
    id:2, subject:'Rus tili', slug:'russian', category:'language',
    Icon: GlobeAltIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:100000,  desc:'Rus tilida asosiy salomlashish va kundalik iboralar.' },
      { level:'A2', questions:60,  time:80,  pass:60, fee:150000,  desc:'Oddiy dialoglар, do\'kon, transport, kundalik hayot.' },
      { level:'B1', questions:80,  time:100, pass:65, fee:200000,  desc:'Murakkab grammatika, hikoya va matn tushunish.' },
      { level:'B2', questions:90,  time:120, pass:65, fee:250000,  desc:'Professional darajada muloqot va akademik til.' },
    ],
  },
  {
    id:3, subject:"O'zbek tili", slug:'uzbek', category:'language',
    Icon: DocumentCheckIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:80000,   desc:"O'zbek tilida asosiy iboralar, raqamlar va salomlashish." },
      { level:'A2', questions:60,  time:80,  pass:60, fee:100000,  desc:"Qisqa matnlar, kundalik so'zlashuv, grammatika asoslari." },
      { level:'B1', questions:80,  time:100, pass:65, fee:150000,  desc:"O'zbek adabiy tili, grammatika, imlo va rasmiy yozuv." },
      { level:'B2', questions:90,  time:120, pass:65, fee:180000,  desc:"Murakkab grammatika, adabiy til va ilmiy uslub." },
      { level:'C1', questions:100, time:150, pass:70, fee:220000,  desc:"Yuqori darajali O'zbek tili bilimi, rasmiy nutq." },
      { level:'C2', questions:100, time:180, pass:75, fee:260000,  desc:"Ona tili darajasidagi mukammal O'zbek tili bilimi." },
    ],
  },
  {
    id:4, subject:'Nemis tili', slug:'german', category:'language',
    Icon: GlobeAltIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:120000,  desc:'Nemis tilida asosiy iboralar (Goethe-Institut standart).' },
      { level:'A2', questions:60,  time:80,  pass:60, fee:170000,  desc:'Kundalik muloqot, asosiy grammatika, qisqa matnlar.' },
      { level:'B1', questions:80,  time:100, pass:65, fee:220000,  desc:'Murakkab mavzular, Goethe B1 imtihon formati.' },
      { level:'B2', questions:90,  time:120, pass:65, fee:280000,  desc:'Akademik nemis tili, professional muloqot.' },
    ],
  },
  {
    id:5, subject:'Fransuz tili', slug:'french', category:'language',
    Icon: GlobeAltIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:120000,  desc:'Fransuz tilida asosiy so\'z va iboralar (DELF standart).' },
      { level:'A2', questions:60,  time:80,  pass:60, fee:170000,  desc:'Kundalik muloqot, grammatika asoslari.' },
      { level:'B1', questions:80,  time:100, pass:65, fee:220000,  desc:'Murakkab grammatika, DELF B1 formati.' },
      { level:'B2', questions:90,  time:120, pass:65, fee:280000,  desc:'Akademik fransuz tili, murakkab matnlar.' },
    ],
  },
  /* ── FAN SERTIFIKATLARI ── */
  {
    id:6, subject:'Matematika', slug:'mathematics', category:'science',
    Icon: SparklesIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:100000,  desc:'Asosiy arifmetika, natural sonlar, oddiy kasrlar.' },
      { level:'A2', questions:60,  time:80,  pass:60, fee:130000,  desc:'Algebra asoslari, tenglamalar, koordinata sistemasi.' },
      { level:'B1', questions:80,  time:100, pass:65, fee:170000,  desc:'Funksiyalar, trigonometriya, logaritmlar.' },
      { level:'B2', questions:90,  time:120, pass:65, fee:210000,  desc:'Integral va differensial hisob, vektorlar.' },
      { level:'C1', questions:100, time:150, pass:70, fee:260000,  desc:'Yuqori matematika, murakkab tenglamalar, ehtimollik.' },
    ],
  },
  {
    id:7, subject:'Fizika', slug:'physics', category:'science',
    Icon: SparklesIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:100000,  desc:'Mexanika asoslari, harakat, kuch va energiya.' },
      { level:'A2', questions:60,  time:80,  pass:60, fee:130000,  desc:'Elektr, issiqlik, to\'lqin fizikasi asoslari.' },
      { level:'B1', questions:80,  time:100, pass:65, fee:170000,  desc:'Optika, magnit, atom fizikasi asoslari.' },
      { level:'B2', questions:90,  time:120, pass:65, fee:210000,  desc:'Kvant fizikasi, relyativistik mexanika.' },
      { level:'C1', questions:100, time:150, pass:70, fee:260000,  desc:'Nazariy fizika, yadro fizikasi, murakkab masalalar.' },
    ],
  },
  {
    id:8, subject:'Kimyo', slug:'chemistry', category:'science',
    Icon: SparklesIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:100000,  desc:'Element, atom, molekula, oddiy reaksiyalar.' },
      { level:'A2', questions:60,  time:80,  pass:60, fee:130000,  desc:'Kislota, asos, tuz, oksidlanish-qaytarilish.' },
      { level:'B1', questions:80,  time:100, pass:65, fee:170000,  desc:'Organik kimyo asoslari, laboratoriya usullari.' },
      { level:'B2', questions:90,  time:120, pass:65, fee:210000,  desc:'Murakkab organik va anorganik birikмalar.' },
      { level:'C1', questions:100, time:150, pass:70, fee:260000,  desc:'Fizik kimyo, kataliz, murakkab reaksiya mexanizmlari.' },
    ],
  },
  {
    id:9, subject:'Biologiya', slug:'biology', category:'science',
    Icon: BookOpenIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:100000,  desc:'Hujayra, to\'qima, tirik organizmlar asosiy bilimi.' },
      { level:'A2', questions:60,  time:80,  pass:60, fee:130000,  desc:'O\'simlik, hayvon biologiyasi, ekologiya asoslari.' },
      { level:'B1', questions:80,  time:100, pass:65, fee:170000,  desc:'Genetika, evolyutsiya, fiziologiya.' },
      { level:'B2', questions:90,  time:120, pass:65, fee:210000,  desc:'Molekulyar biologiya, biotexnologiya asoslari.' },
      { level:'C1', questions:100, time:150, pass:70, fee:260000,  desc:'Ilmiy biologiya, murakkab genetika va ekologiya.' },
    ],
  },
  {
    id:10, subject:'Tarix', slug:'history', category:'humanities',
    Icon: BookOpenIcon,
    levels: [
      { level:'A1', questions:40,  time:60,  pass:60, fee:80000,   desc:"O'zbekiston tarixi asoslari, qadimgi sivilizatsiyalar." },
      { level:'A2', questions:60,  time:80,  pass:60, fee:100000,  desc:"O'rta asrlar tarixi, temuriylar, xonliklar davri." },
      { level:'B1', questions:80,  time:100, pass:65, fee:140000,  desc:"Yangi va zamonaviy tarix, jahon tarixi asoslari." },
      { level:'B2', questions:90,  time:120, pass:65, fee:170000,  desc:"Murakkab tarixiy tahlil, zamonaviy dunyo." },
      { level:'C1', questions:100, time:150, pass:70, fee:210000,  desc:"Akademik tarix, tarixiy tadqiqot metodologiyasi." },
    ],
  },
]

const CATEGORIES = [
  { key:'all',       label:'Barchasi' },
  { key:'language',  label:'Til sertifikatlari' },
  { key:'science',   label:'Fan sertifikatlari' },
  { key:'humanities',label:'Gumanitar fanlar' },
]

const STATS = [
  { icon:DocumentCheckIcon, value:'10+',  label:'Fan yo\'nalishlari' },
  { icon:ChartBarIcon,      value:'A1–C2',label:'Darajalar' },
  { icon:TrophyIcon,        value:'100%', label:'Rasmiy tan olingan' },
  { icon:AcademicCapIcon,   value:'∞',    label:'Tayyorgarlik testlari' },
]

/* ════════════════════════════════════════════════════════ */
export default function NationalPage() {
  const [category, setCategory] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filtered = category === 'all'
    ? NATIONAL_CERTS
    : NATIONAL_CERTS.filter(c => c.category === category)

  return (
    <div className="min-h-screen" style={{ background:'#020B18' }}>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[110px] opacity-20"
               style={{ background:'radial-gradient(circle,#7c3aed 0%,#2563eb 50%,transparent 80%)' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
               style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', color:'#a78bfa' }}>
            <BoltIcon className="w-3.5 h-3.5" />
            O'zbekiston Milliy Sertifikat Tizimi
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-5 leading-tight">
            <span className="text-white">Milliy</span>{' '}
            <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage:'linear-gradient(135deg,#c4b5fd,#93c5fd)' }}>
              Sertifikat
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            O'zbekiston hukumati tomonidan tan olingan til va fan sertifikatlari.
            Davlat xizmatlari, universitetga kirish, ish joyi uchun rasmiy hujjat.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(({ icon:Icon, value, label }) => (
              <div key={label} className="rounded-2xl p-4 text-center"
                   style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <Icon className="w-5 h-5 mx-auto mb-2 text-violet-400" />
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info banner */}
      <section className="px-4 mb-8">
        <div className="max-w-5xl mx-auto rounded-2xl p-5"
             style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.2)' }}>
          <div className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
            <p className="text-violet-200/80 text-sm leading-relaxed">
              Milliy sertifikat — O'zbekiston hukumati tomonidan tasdiqlangan til va fan sertifikatlash tizimi.
              CEFR darajalari asosida (A1–C2) beriladi va davlat organlari, universitetlar hamda ish beruvchilar
              tomonidan rasmiy hujjat sifatida qabul qilinadi.
            </p>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="px-4 mb-8">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setCategory(cat.key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={category === cat.key
                ? { background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'white', boxShadow:'0 0 20px rgba(124,58,237,0.35)' }
                : { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8' }}>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto space-y-4">
          {filtered.map(cert => {
            const isOpen = expanded === cert.id
            return (
              <div key={cert.id} className="rounded-2xl overflow-hidden transition-all duration-200"
                   style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
                {/* Header */}
                <button className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                        onClick={() => setExpanded(isOpen ? null : cert.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                         style={{ background:'rgba(139,92,246,0.15)' }}>
                      <cert.Icon className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-lg">{cert.subject}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {cert.levels.map(l => {
                          const m = LEVEL_META[l.level]
                          return (
                            <span key={l.level} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background:m.bg, color:m.color, border:`1px solid ${m.border}` }}>
                              {l.level}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 hidden sm:block">{cert.levels.length} daraja</span>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                         style={{ background:'rgba(255,255,255,0.06)', transform: isOpen ? 'rotate(90deg)' : '' }}>
                      <ArrowRightIcon className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </button>

                {/* Levels detail */}
                {isOpen && (
                  <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t"
                       style={{ borderColor:'rgba(255,255,255,0.06)' }}>
                    {cert.levels.map(lv => {
                      const m = LEVEL_META[lv.level]
                      return (
                        <div key={lv.level} className="rounded-xl p-4 mt-4"
                             style={{ background:m.bg, border:`1px solid ${m.border}` }}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{m.icon}</span>
                            <div>
                              <div className="font-black text-sm" style={{ color:m.color }}>{m.label}</div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mb-3 leading-relaxed">{lv.desc}</p>
                          <div className="grid grid-cols-3 gap-2 text-center mb-3">
                            <div className="rounded-lg p-1.5" style={{ background:'rgba(0,0,0,0.2)' }}>
                              <div className="text-xs font-bold text-white">{lv.questions}</div>
                              <div className="text-[10px] text-slate-500">savol</div>
                            </div>
                            <div className="rounded-lg p-1.5" style={{ background:'rgba(0,0,0,0.2)' }}>
                              <div className="text-xs font-bold text-white">{lv.time}</div>
                              <div className="text-[10px] text-slate-500">daqiqa</div>
                            </div>
                            <div className="rounded-lg p-1.5" style={{ background:'rgba(0,0,0,0.2)' }}>
                              <div className="text-xs font-bold text-white">{lv.pass}%</div>
                              <div className="text-[10px] text-slate-500">o'tish</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold" style={{ color:m.color }}>
                              {Number(lv.fee).toLocaleString()} so'm
                            </span>
                            <Link href={`/exams/cefr`}
                              className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-all hover:opacity-80"
                              style={{ background:`${m.color}33`, border:`1px solid ${m.color}55` }}>
                              Tayyorgarlik →
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto rounded-2xl p-8 text-center"
             style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.2)' }}>
          <TrophyIcon className="w-10 h-10 mx-auto mb-4 text-violet-400" />
          <h3 className="text-xl font-bold text-white mb-2">Sertifikatga tayyorlanish</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
            Certify.uz da CEFR Mock Test va DTM testlarini ishlang, darajangizni aniqlang
            va milliy sertifikat imtihoniga tayyor bo'ling.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/exams/cefr"
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
              style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              CEFR Mock Test
            </Link>
            <Link href="/dtm"
              className="px-6 py-3 rounded-xl font-semibold text-slate-300 text-sm transition-all hover:text-white"
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}>
              DTM Test
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
