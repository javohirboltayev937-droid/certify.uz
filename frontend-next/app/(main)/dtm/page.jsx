'use client'
import { useState, useEffect, useRef } from 'react'
import {
  CATEGORIES, CATEGORY_MAP, UZBEK_TILI_POOL, pick30, shuffle,
} from './dtm-data'
import {
  MagnifyingGlassIcon, ArrowLeftIcon, ClockIcon,
  CheckCircleIcon, XCircleIcon, AcademicCapIcon,
  TrophyIcon, ArrowRightIcon, BoltIcon, ChevronRightIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

/* ── Tiny helpers ── */
function Orb({ className }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
}

function Timer({ totalSec, onTimeUp }) {
  const [rem, setRem] = useState(totalSec)
  const ref = useRef()
  useEffect(() => {
    ref.current = setInterval(() => {
      setRem(p => { if (p <= 1) { clearInterval(ref.current); onTimeUp(); return 0 } return p - 1 })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [])
  const m = Math.floor(rem / 60), s = rem % 60
  const low = rem < 300
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm ${low ? 'animate-pulse' : ''}`}
         style={low
           ? { background:'rgba(239,68,68,0.25)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.4)' }
           : { background:'rgba(255,255,255,0.12)', color:'white', border:'1px solid rgba(255,255,255,0.2)' }}>
      <ClockIcon className="w-4 h-4" />
      {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
    </div>
  )
}

/* ── RESULT ── */
function ResultScreen({ direction, questions, answers, onRetry, onHome }) {
  const correct = questions.filter(q => answers[q.id] === q.ans).length
  const total = questions.length
  const pct = Math.round((correct / total) * 100)
  const grade =
    pct >= 90 ? { label:"A'lo", color:'#34d399', icon:'🏆' } :
    pct >= 75 ? { label:'Yaxshi', color:'#60a5fa', icon:'⭐' } :
    pct >= 60 ? { label:'Qoniqarli', color:'#fbbf24', icon:'👍' } :
               { label:"Qoniqarsiz", color:'#f87171', icon:'📚' }

  const uzQs  = questions.filter(q => q.id.startsWith('uz'))
  const sub1Qs = questions.filter(q => !q.id.startsWith('uz') && q._sub === 'sub1')
  const sub2Qs = questions.filter(q => !q.id.startsWith('uz') && q._sub === 'sub2')
  const correctUz   = uzQs.filter(q => answers[q.id] === q.ans).length
  const correctSub1 = sub1Qs.filter(q => answers[q.id] === q.ans).length
  const correctSub2 = sub2Qs.filter(q => answers[q.id] === q.ans).length

  const catInfo = CATEGORY_MAP[direction.category] || { color:'from-blue-500 to-indigo-600' }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background:'#020B18' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header card */}
        <div className="rounded-3xl p-8 text-center mb-6"
             style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-5xl mb-3">{grade.icon}</div>
          <h2 className="text-3xl font-extrabold text-white mb-1">Test yakunlandi!</h2>
          <p className="text-slate-400 mb-6">{direction.name}</p>
          <div className="rounded-2xl p-6" style={{ background:`rgba(${grade.color.replace('#','')}11)`, border:`1px solid ${grade.color}40` }}>
            <div className="text-5xl font-black mb-1" style={{ color: grade.color }}>{pct}%</div>
            <div className="font-bold text-lg mb-2" style={{ color: grade.color }}>{grade.label}</div>
            <div className="text-slate-300">{correct} / {total} to'g'ri javob</div>
          </div>
        </div>

        {/* Fan bo'yicha */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            ["O'zbek tili", correctUz, uzQs.length, '#a78bfa'],
            [direction.sub1, correctSub1, sub1Qs.length, '#60a5fa'],
            [direction.sub2, correctSub2, sub2Qs.length, '#34d399'],
          ].map(([name, cor, tot, color]) => (
            <div key={name} className="rounded-2xl p-4 text-center"
                 style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-lg font-black mb-1" style={{ color }}>{cor}/{tot}</div>
              <div className="text-xs text-slate-400 leading-tight">{name}</div>
            </div>
          ))}
        </div>

        {/* Savol ko'rish */}
        <details className="mb-6">
          <summary className="cursor-pointer py-3 px-4 rounded-xl font-semibold text-slate-300 text-sm"
                   style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            Savollar va javoblarni ko'rish
          </summary>
          <div className="mt-3 space-y-3">
            {questions.map((q, i) => {
              const isCorrect = answers[q.id] === q.ans
              return (
                <div key={q.id} className="rounded-xl p-4"
                     style={{ background: isCorrect ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)', border:`1px solid ${isCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? <CheckCircleIcon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> : <XCircleIcon className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                    <p className="text-sm text-white">{i+1}. {q.q}</p>
                  </div>
                  <div className="ml-6 text-xs text-slate-400">
                    <span className="text-emerald-400">✓ {q.opts[q.ans]}</span>
                    {answers[q.id] !== undefined && answers[q.id] !== q.ans && (
                      <span className="text-red-400 ml-3">✗ {q.opts[answers[q.id]]}</span>
                    )}
                  </div>
                  {q.exp && <div className="ml-6 mt-1 text-xs text-slate-500">{q.exp}</div>}
                </div>
              )
            })}
          </div>
        </details>

        <div className="flex gap-3">
          <button onClick={onRetry}
            className="flex-1 py-3 rounded-xl font-semibold text-white"
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}>
            Qayta urinish
          </button>
          <button onClick={onHome}
            className="flex-1 py-3 rounded-xl font-semibold text-white"
            style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
            Bosh sahifa
          </button>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════ MAIN ════ */
export default function DTMPage() {
  const [step, setStep] = useState('categories')  // categories | directions | preview | test | result
  const [selectedCat, setSelectedCat] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedDir, setSelectedDir] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExp, setShowExp] = useState(false)

  const catInfo = selectedCat ? CATEGORY_MAP[selectedCat.key] : null
  const filteredDirs = selectedCat
    ? selectedCat.directions.filter(d =>
        !search || d.name.toLowerCase().includes(search.toLowerCase()))
    : []

  const buildQuestions = (dir) => {
    const uzQs   = pick30(UZBEK_TILI_POOL).map(q => ({ ...q, _sub:'uz' }))
    const sub1Qs = pick30(dir.sub1Pool).map(q => ({ ...q, _sub:'sub1' }))
    const sub2Qs = pick30(dir.sub2Pool).map(q => ({ ...q, _sub:'sub2' }))
    return [...uzQs, ...sub1Qs, ...sub2Qs]
  }

  const startTest = () => {
    const qs = buildQuestions(selectedDir)
    setQuestions(qs)
    setCurrentQ(0)
    setAnswers({})
    setShowExp(false)
    setStep('test')
  }

  const handleAnswer = (idx) => {
    if (answers[questions[currentQ].id] !== undefined) return
    setAnswers(p => ({ ...p, [questions[currentQ].id]: idx }))
  }

  const next = () => {
    if (currentQ < questions.length - 1) { setCurrentQ(i => i + 1); setShowExp(false) }
    else setStep('result')
  }

  const reset = () => { setStep('categories'); setSelectedCat(null); setSelectedDir(null); setSearch('') }

  /* ── RESULT ── */
  if (step === 'result') return (
    <ResultScreen
      direction={selectedDir}
      questions={questions}
      answers={answers}
      onRetry={startTest}
      onHome={reset}
    />
  )

  /* ── TEST ── */
  if (step === 'test' && questions.length > 0) {
    const q = questions[currentQ]
    const chosen = answers[q.id]
    const total = questions.length
    const progress = ((currentQ + 1) / total) * 100

    const sectionLabel =
      q._sub === 'uz' ? "O'zbek tili" :
      q._sub === 'sub1' ? selectedDir.sub1 : selectedDir.sub2

    const handleNext = () => {
      if (chosen === undefined) { toast('Javob tanlang!', { icon:'⚠️' }); return }
      if (!showExp) { setShowExp(true); return }
      next()
    }

    return (
      <div className="min-h-screen flex flex-col" style={{ background:'#020B18' }}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
             style={{ background:'rgba(2,11,24,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div className="text-white font-bold text-sm">{selectedDir.name}</div>
            <div className="text-slate-500 text-xs">{sectionLabel} · {currentQ+1}/{total}</div>
          </div>
          <Timer totalSec={180*60} onTimeUp={() => { toast('Vaqt tugadi!', { icon:'⏰' }); setStep('result') }} />
        </div>

        {/* Progress */}
        <div className="h-1" style={{ background:'rgba(255,255,255,0.06)' }}>
          <div className="h-full transition-all duration-300"
               style={{ width:`${progress}%`, background: q._sub==='uz' ? '#a78bfa' : q._sub==='sub1' ? '#60a5fa' : '#34d399' }} />
        </div>

        <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
          <p className="text-white font-semibold text-lg leading-relaxed mb-6">{q.q}</p>

          <div className="space-y-3 mb-6">
            {q.opts.map((opt, idx) => {
              const isChosen = chosen === idx
              const isCorrect = q.ans === idx
              let bg = 'rgba(255,255,255,0.04)'
              let border = 'rgba(255,255,255,0.1)'
              let textColor = '#cbd5e1'
              let icon = null

              if (showExp) {
                if (isCorrect) { bg='rgba(16,185,129,0.15)'; border='rgba(16,185,129,0.5)'; textColor='#34d399'; icon=<CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" /> }
                else if (isChosen) { bg='rgba(239,68,68,0.15)'; border='rgba(239,68,68,0.5)'; textColor='#f87171'; icon=<XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" /> }
                else textColor='#475569'
              } else if (isChosen) {
                bg='rgba(139,92,246,0.15)'; border='#a78bfa'; textColor='white'
              }

              return (
                <button key={idx} onClick={() => handleAnswer(idx)} disabled={chosen !== undefined}
                  className="w-full text-left rounded-xl p-4 flex items-center gap-3 transition-all duration-200"
                  style={{ background:bg, border:`1px solid ${border}`, color:textColor }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background:'rgba(255,255,255,0.08)' }}>
                    {String.fromCharCode(65+idx)}
                  </span>
                  <span className="flex-1 text-sm">{opt}</span>
                  {icon}
                </button>
              )
            })}
          </div>

          {showExp && q.exp && (
            <div className="rounded-xl p-4 mb-6" style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.25)' }}>
              <div className="font-semibold text-blue-300 mb-1 text-sm">💡 Tushuntirish</div>
              <div className="text-blue-200 text-sm">{q.exp}</div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleNext} disabled={chosen === undefined}
              className="flex-1 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              style={{ background: chosen !== undefined ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)' }}>
              {!showExp && chosen !== undefined ? "Javobni ko'rish" : currentQ < total-1 ? 'Keyingi' : "Testni yakunlash"}
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Question grid */}
          <div className="rounded-2xl p-4" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-slate-500 mb-3">Savol navigatsiyasi</p>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((qs, i) => (
                <button key={qs.id} onClick={() => { setCurrentQ(i); setShowExp(false) }}
                  className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                  style={i === currentQ
                    ? { background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'white' }
                    : answers[qs.id] !== undefined
                    ? { background:'rgba(16,185,129,0.15)', color:'#34d399', border:'1px solid rgba(16,185,129,0.3)' }
                    : { background:'rgba(255,255,255,0.05)', color:'#64748b', border:'1px solid rgba(255,255,255,0.08)' }}>
                  {i+1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── PREVIEW ── */
  if (step === 'preview' && selectedDir) {
    const cat = CATEGORY_MAP[selectedDir.category]
    return (
      <div className="min-h-screen px-4 py-10" style={{ background:'linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)' }}>
        <Orb className="w-96 h-96 bg-blue-400/20 -top-20 -left-20" />
        <div className="max-w-lg mx-auto relative">
          <button onClick={() => setStep('directions')} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm">
            <ArrowLeftIcon className="w-4 h-4" /> Orqaga
          </button>

          <div className="rounded-2xl p-5 mb-4 backdrop-blur-xl" style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)' }}>
            <h1 className="text-xl font-extrabold text-white mb-1">{selectedDir.name}</h1>
            <p className="text-white/60 text-sm">{selectedDir.desc}</p>
          </div>

          {/* Subjects */}
          <div className="rounded-2xl p-5 mb-4 backdrop-blur-xl" style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)' }}>
            <h3 className="text-white font-semibold text-sm mb-3">Imtihon fanlari (90 savol)</h3>
            {[
              { name:"O'zbek tili", n:30, color:'#a78bfa' },
              { name:selectedDir.sub1, n:30, color:'#60a5fa' },
              { name:selectedDir.sub2, n:30, color:'#34d399' },
            ].map(({ name, n, color }) => (
              <div key={name} className="flex items-center justify-between py-2.5 border-b last:border-0"
                   style={{ borderColor:'rgba(255,255,255,0.08)' }}>
                <span className="text-white text-sm">{name}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:`${color}22`, color }}>{n} savol</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[['90', 'Jami savol'], ['3 soat', 'Vaqt'], ['Yangi', 'Har safar']].map(([v,l]) => (
              <div key={l} className="rounded-2xl p-4 text-center backdrop-blur-sm" style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)' }}>
                <div className="text-white font-extrabold text-lg">{v}</div>
                <div className="text-white/50 text-xs">{l}</div>
              </div>
            ))}
          </div>

          <button onClick={startTest}
            className="w-full py-4 rounded-2xl font-bold text-base bg-white text-blue-700 flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-xl">
            <BoltIcon className="w-5 h-5" />
            Testni boshlash
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  /* ── DIRECTIONS ── */
  if (step === 'directions' && selectedCat) {
    const cat = CATEGORY_MAP[selectedCat.key]
    return (
      <div className="min-h-screen px-4 py-10" style={{ background:'linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)' }}>
        <Orb className="w-96 h-96 bg-blue-300/15 -top-20 right-0" />
        <div className="max-w-3xl mx-auto relative">
          <button onClick={reset} className="flex items-center gap-2 text-white/60 hover:text-white mb-5 text-sm">
            <ArrowLeftIcon className="w-4 h-4" /> Kasblar
          </button>
          <h1 className="text-2xl font-extrabold text-white mb-1">{cat.label}</h1>
          <p className="text-white/60 text-sm mb-4">{filteredDirs.length} ta yo'nalish</p>

          <div className="relative mb-5">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input type="text" placeholder="Yo'nalish qidirish..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl text-sm text-white placeholder:text-white/40 focus:outline-none"
              style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDirs.map(dir => (
              <button key={dir.id} onClick={() => { setSelectedDir(dir); setStep('preview') }}
                className="group w-full text-left rounded-2xl p-4 flex items-start justify-between gap-3 transition-all hover:scale-[1.01]"
                style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)' }}>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm mb-1">{dir.name}</p>
                  <p className="text-white/50 text-xs">{dir.sub1} · {dir.sub2}</p>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-white/40 mt-1 group-hover:text-white flex-shrink-0" />
              </button>
            ))}
          </div>
          {filteredDirs.length === 0 && (
            <div className="text-center py-20 text-white/40">
              <MagnifyingGlassIcon className="w-10 h-10 mx-auto mb-3" />
              <p>Yo'nalish topilmadi</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── CATEGORIES (Home) ── */
  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ background:'linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)' }}>
      <Orb className="w-[500px] h-[500px] bg-blue-500/15 -top-40 -right-40" />
      <Orb className="w-96 h-96 bg-indigo-500/20 top-1/2 -left-20" />

      <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm text-white/80 mb-6">
          <AcademicCapIcon className="w-4 h-4" /> DTM Test Tizimi
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
          DTM Test <span className="text-blue-300">Tayyorgarlik</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
          Kasbingizni tanlang — O'zbek tili + 2 ta mutaxassislik fani bo'yicha 90 ta savol, har safar yangi tartibda.
        </p>

        <div className="inline-flex items-center gap-6 bg-white/8 border border-white/15 rounded-2xl px-8 py-4 mb-12">
          {[['90', 'Savol'], ['3 soat', 'Vaqt'], ['∞', 'Urinish'], ['100%', 'Bepul']].map(([v,l]) => (
            <div key={l} className="text-center">
              <div className="text-white font-extrabold text-xl">{v}</div>
              <div className="text-white/50 text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <BoltIcon className="w-5 h-5 text-yellow-300" /> Qaysi soha?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => { setSelectedCat(cat); setSearch(''); setStep('directions') }}
              className="group relative rounded-2xl overflow-hidden text-left transition-all hover:scale-[1.04]"
              style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)' }}>
              <div className={`h-1.5 bg-gradient-to-r ${cat.color}`} />
              <div className="p-4">
                <p className="text-white font-bold text-sm mb-1">{cat.label}</p>
                <p className="text-white/50 text-xs">{cat.directions.length} yo'nalish</p>
                <div className="mt-3 flex items-center gap-1 text-white/40 text-xs group-hover:text-white/70">
                  Tanlash <ArrowRightIcon className="w-3 h-3" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
