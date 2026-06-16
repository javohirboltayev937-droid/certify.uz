'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ClockIcon, ChevronLeftIcon, ChevronRightIcon,
  CheckCircleIcon, XCircleIcon, TrophyIcon,
  ArrowLeftIcon, FireIcon, AcademicCapIcon,
  BookOpenIcon, LanguageIcon,
} from '@heroicons/react/24/outline'
import { CEFR_QUESTIONS, LEVEL_INFO } from '../questions'

// ── Section icons ──────────────────────────────────────────────────────────────
const SECTION_ICONS = { Grammar: LanguageIcon, Vocabulary: BookOpenIcon, Reading: AcademicCapIcon }

// ── Utility ───────────────────────────────────────────────────────────────────
function fmt(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function pct(n, total) { return total ? Math.round((n / total) * 100) : 0 }

// ── Intro Screen ──────────────────────────────────────────────────────────────
function IntroScreen({ level, info, questions, onStart }) {
  const sections = [...new Set(questions.map(q => q.section))]
  const sectionCounts = sections.reduce((acc, s) => {
    acc[s] = questions.filter(q => q.section === s).length
    return acc
  }, {})

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: '#020B18' }}>
      {/* bg glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] opacity-15"
             style={{ background: `radial-gradient(circle, ${info.color} 0%, transparent 70%)` }} />
      </div>

      <div className="max-w-xl w-full relative">
        {/* Back */}
        <Link href="/exams/cefr" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8">
          <ArrowLeftIcon className="w-4 h-4" /> Darajalar ro&apos;yxatiga qaytish
        </Link>

        {/* Card */}
        <div className="rounded-3xl overflow-hidden"
             style={{ background: 'rgba(13,21,48,0.9)', border: `1px solid ${info.border}`, boxShadow: `0 0 60px ${info.glow}` }}>

          {/* Top banner */}
          <div className="px-8 pt-8 pb-6 text-center"
               style={{ borderBottom: `1px solid ${info.border}` }}>
            <div className="text-6xl font-black mb-2" style={{ color: info.color }}>{level.toUpperCase()}</div>
            <div className="text-xl font-bold text-white">{info.name}</div>
            <div className="text-slate-400 text-sm mt-1">CEFR Test</div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 divide-x px-0"
               style={{ borderBottom: `1px solid ${info.border}`, divideColor: info.border }}>
            {[
              { label: 'Savollar', value: questions.length },
              { label: 'Vaqt', value: `${info.time} daq` },
              { label: "O'tish ball", value: `${info.pass}%` },
            ].map(({ label, value }) => (
              <div key={label} className="py-5 text-center" style={{ borderColor: info.border }}>
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="p-8">
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{info.desc}</p>

            {/* Section breakdown */}
            <div className="space-y-3 mb-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Bo&apos;limlar</div>
              {sections.map(sec => {
                const Icon = SECTION_ICONS[sec] || BookOpenIcon
                return (
                  <div key={sec} className="flex items-center justify-between p-3 rounded-xl"
                       style={{ background: info.bg, border: `1px solid ${info.border}` }}>
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" style={{ color: info.color }} />
                      <span className="text-sm text-slate-300 font-medium">
                        {sec === 'Grammar' ? 'Grammatika' : sec === 'Vocabulary' ? "Lug'at" : "O'qish"}
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: info.color }}>
                      {sectionCounts[sec]} savol
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Rules */}
            <div className="p-4 rounded-xl mb-6 text-sm text-slate-400 space-y-1.5"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                'Har bir savol uchun 4 ta variant beriladi',
                "Vaqt tugaganidan so'ng test avtomatik yakunlanadi",
                "Istalgan savolga qaytib o'tish mumkin",
                "Yakunlashda to'g'ri javoblarni ko'rasiz",
              ].map(r => (
                <div key={r} className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: info.color }} />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            {/* Start button */}
            <button onClick={onStart}
              className="w-full py-4 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${info.color}dd, ${info.color}88)`,
                boxShadow: `0 0 32px ${info.glow}`,
              }}>
              <FireIcon className="w-5 h-5" />
              Testni Boshlash
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Test Screen ───────────────────────────────────────────────────────────────
function TestScreen({ level, info, questions, onFinish }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({}) // { [qId]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(info.time * 60)
  const [flagged, setFlagged] = useState(new Set())
  const timerRef = useRef(null)

  // Countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); onFinish(answers); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, []) // eslint-disable-line

  const q = questions[current]
  const totalAnswered = Object.keys(answers).length
  const progress = pct(totalAnswered, questions.length)
  const isLastQ = current === questions.length - 1
  const urgency = timeLeft < 120

  const handleAnswer = (idx) => setAnswers(prev => ({ ...prev, [q.id]: idx }))
  const toggleFlag = () => setFlagged(prev => {
    const n = new Set(prev)
    n.has(q.id) ? n.delete(q.id) : n.add(q.id)
    return n
  })

  const handleSubmit = () => {
    clearInterval(timerRef.current)
    onFinish(answers)
  }

  // Section label
  const sectionLabel = q.section === 'Grammar' ? 'Grammatika' : q.section === 'Vocabulary' ? "Lug'at" : "O'qish"
  const SectionIcon = SECTION_ICONS[q.section] || BookOpenIcon

  return (
    <div className="min-h-screen" style={{ background: '#020B18' }}>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 px-4 py-3"
           style={{ background: 'rgba(2,11,24,0.95)', borderBottom: `1px solid ${info.border}`, backdropFilter: 'blur(16px)' }}>
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          {/* Level badge */}
          <div className="shrink-0 text-sm font-black px-3 py-1 rounded-lg" style={{ background: info.bg, color: info.color, border: `1px solid ${info.border}` }}>
            {level.toUpperCase()}
          </div>

          {/* Progress bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{current + 1} / {questions.length} savol</span>
              <span className="font-medium text-slate-300">{progress}% bajarildi</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                   style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${info.color}, ${info.color}88)` }} />
            </div>
          </div>

          {/* Timer */}
          <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${urgency ? 'animate-pulse' : ''}`}
               style={{
                 background: urgency ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
                 color: urgency ? '#f87171' : '#94a3b8',
                 border: `1px solid ${urgency ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
               }}>
            <ClockIcon className="w-4 h-4" />
            {fmt(timeLeft)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pt-24 pb-32 px-4">
        <div className="max-w-5xl mx-auto flex gap-6">

          {/* Question nav sidebar (desktop) */}
          <div className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24 rounded-2xl p-4"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Savollar</div>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((qItem, i) => {
                  const answered = answers[qItem.id] !== undefined
                  const isCur = i === current
                  const isFlag = flagged.has(qItem.id)
                  return (
                    <button key={qItem.id} onClick={() => setCurrent(i)}
                      className="w-full aspect-square rounded-lg text-xs font-bold transition-all duration-150"
                      style={{
                        background: isCur
                          ? info.color
                          : answered
                          ? `${info.color}33`
                          : isFlag
                          ? 'rgba(245,158,11,0.2)'
                          : 'rgba(255,255,255,0.05)',
                        color: isCur ? '#fff' : answered ? info.color : isFlag ? '#f59e0b' : '#64748b',
                        border: isCur ? `1px solid ${info.color}` : answered ? `1px solid ${info.color}55` : '1px solid rgba(255,255,255,0.07)',
                        transform: isCur ? 'scale(1.1)' : 'scale(1)',
                      }}>
                      {i + 1}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ background: info.color }} /> Joriy
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ background: `${info.color}33`, border: `1px solid ${info.color}55` }} /> Javob berilgan
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)' }} /> Belgilangan
                </div>
              </div>
            </div>
          </div>

          {/* Main question area */}
          <div className="flex-1 min-w-0">
            {/* Section tag */}
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest"
                    style={{ background: info.bg, color: info.color, border: `1px solid ${info.border}` }}>
                <SectionIcon className="w-3.5 h-3.5" />
                {sectionLabel}
              </span>
              <span className="text-xs text-slate-600">Savol {current + 1}</span>
            </div>

            {/* Question card */}
            <div className="rounded-2xl p-7 mb-6"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed">{q.q}</p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {q.opts.map((opt, idx) => {
                const selected = answers[q.id] === idx
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)}
                    className="w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all duration-150 group"
                    style={{
                      background: selected ? info.bg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selected ? info.border : 'rgba(255,255,255,0.07)'}`,
                      boxShadow: selected ? `0 0 20px ${info.glow}` : 'none',
                      transform: selected ? 'scale(1.01)' : 'scale(1)',
                    }}>
                    {/* Letter bubble */}
                    <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black transition-all"
                         style={{
                           background: selected ? info.color : 'rgba(255,255,255,0.06)',
                           color: selected ? '#fff' : '#64748b',
                           border: selected ? 'none' : '1px solid rgba(255,255,255,0.1)',
                         }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm sm:text-base font-medium transition-colors"
                          style={{ color: selected ? '#fff' : '#94a3b8' }}>
                      {opt}
                    </span>
                    {selected && (
                      <CheckCircleIcon className="w-5 h-5 ml-auto shrink-0" style={{ color: info.color }} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Mobile question nav */}
            <div className="lg:hidden mb-6 flex flex-wrap gap-1.5">
              {questions.map((qItem, i) => {
                const answered = answers[qItem.id] !== undefined
                const isCur = i === current
                return (
                  <button key={qItem.id} onClick={() => setCurrent(i)}
                    className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: isCur ? info.color : answered ? `${info.color}33` : 'rgba(255,255,255,0.05)',
                      color: isCur ? '#fff' : answered ? info.color : '#64748b',
                      border: isCur ? `1px solid ${info.color}` : '1px solid rgba(255,255,255,0.07)',
                    }}>
                    {i + 1}
                  </button>
                )
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <ChevronLeftIcon className="w-4 h-4" /> Oldingi
              </button>

              <button onClick={toggleFlag}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: flagged.has(q.id) ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                  color: flagged.has(q.id) ? '#f59e0b' : '#64748b',
                  border: `1px solid ${flagged.has(q.id) ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                {flagged.has(q.id) ? '🔖 Belgilangan' : '🔖 Belgilash'}
              </button>

              <div className="ml-auto flex items-center gap-3">
                {!isLastQ ? (
                  <button onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                    style={{ background: info.bg, color: info.color, border: `1px solid ${info.border}` }}>
                    Keyingi <ChevronRightIcon className="w-4 h-4" />
                  </button>
                ) : null}

                <button onClick={handleSubmit}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${info.color}dd, ${info.color}88)`,
                    boxShadow: `0 0 20px ${info.glow}`,
                  }}>
                  <CheckCircleIcon className="w-4 h-4" />
                  Yakunlash ({totalAnswered}/{questions.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Results Screen ─────────────────────────────────────────────────────────────
function ResultsScreen({ level, info, questions, answers }) {
  const router = useRouter()
  const [showReview, setShowReview] = useState(false)
  const [filterSection, setFilterSection] = useState('all')

  const correct = questions.filter(q => answers[q.id] === q.ans).length
  const wrong = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.ans).length
  const skipped = questions.filter(q => answers[q.id] === undefined).length
  const score = pct(correct, questions.length)
  const passed = score >= info.pass

  // Next level suggestion
  const LEVEL_ORDER = ['a1','a2','b1','b2','c1','c2']
  const curIdx = LEVEL_ORDER.indexOf(level)
  const nextLevel = passed && curIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[curIdx + 1] : null
  const nextInfo = nextLevel ? LEVEL_INFO[nextLevel.toUpperCase()] : null

  const sections = [...new Set(questions.map(q => q.section))]
  const sectionScores = sections.reduce((acc, s) => {
    const qs = questions.filter(q => q.section === s)
    const c = qs.filter(q => answers[q.id] === q.ans).length
    acc[s] = { correct: c, total: qs.length, pct: pct(c, qs.length) }
    return acc
  }, {})

  const filtered = filterSection === 'all' ? questions
    : questions.filter(q => q.section === filterSection)

  return (
    <div className="min-h-screen px-4 py-24" style={{ background: '#020B18' }}>
      {/* glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] opacity-10"
             style={{ background: `radial-gradient(circle, ${info.color} 0%, transparent 70%)` }} />
      </div>

      <div className="max-w-3xl mx-auto relative">

        {/* Score card */}
        <div className="rounded-3xl overflow-hidden mb-6"
             style={{ background: 'rgba(13,21,48,0.9)', border: `2px solid ${passed ? info.border : 'rgba(239,68,68,0.3)'}`, boxShadow: `0 0 60px ${passed ? info.glow : 'rgba(239,68,68,0.2)'}` }}>

          {/* Top */}
          <div className="px-8 py-10 text-center"
               style={{ borderBottom: `1px solid ${info.border}`, background: `linear-gradient(180deg, ${info.bg} 0%, transparent 100%)` }}>
            <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>

            {/* Score ring (CSS) */}
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={info.color} strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1.2s ease-out', filter: `drop-shadow(0 0 8px ${info.color})` }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-black" style={{ color: info.color }}>{score}%</div>
                <div className="text-xs text-slate-500">Ball</div>
              </div>
            </div>

            <h1 className="text-2xl font-black text-white mb-1">
              {passed ? 'Tabriklaymiz!' : "Ko'proq mashq kerak!"}
            </h1>
            <p className="text-slate-400 text-sm">
              {passed
                ? `Siz ${level.toUpperCase()} darajasini muvaffaqiyatli topshirdingiz!`
                : `${level.toUpperCase()} darajasidan o'tish uchun ${info.pass}% kerak. Siz ${score}% to'pladingiz.`}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x"
               style={{ borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
            {[
              { label: "To'g'ri",   value: correct,  color: '#22c55e', icon: '✓' },
              { label: 'Noto\'g\'ri', value: wrong,    color: '#ef4444', icon: '✗' },
              { label: 'O\'tkazib',  value: skipped,  color: '#64748b', icon: '−' },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className="py-5 text-center" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="text-2xl font-black" style={{ color }}>{icon} {value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Section breakdown */}
          <div className="p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Bo&apos;limlar bo&apos;yicha</div>
            <div className="space-y-3">
              {sections.map(sec => {
                const s = sectionScores[sec]
                const Icon = SECTION_ICONS[sec] || BookOpenIcon
                const label = sec === 'Grammar' ? 'Grammatika' : sec === 'Vocabulary' ? "Lug'at" : "O'qish"
                return (
                  <div key={sec}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Icon className="w-4 h-4 text-slate-500" /> {label}
                      </div>
                      <span className="text-sm font-bold" style={{ color: s.pct >= 60 ? '#22c55e' : '#ef4444' }}>
                        {s.correct}/{s.total} ({s.pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                           style={{ width: `${s.pct}%`, background: s.pct >= 60 ? '#22c55e' : '#ef4444' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
            <button onClick={() => setShowReview(v => !v)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {showReview ? "Yashirish" : "Javoblarni Ko'rish"}
            </button>

            {nextLevel && (
              <Link href={`/exams/cefr/${nextLevel}`}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white text-center transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${nextInfo?.color}dd, ${nextInfo?.color}88)`, boxShadow: `0 0 20px ${nextInfo?.glow}` }}>
                {nextLevel.toUpperCase()} Darajasiga O&apos;tish →
              </Link>
            )}

            <Link href="/exams/cefr"
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white text-center transition-colors hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Darajalar Ro&apos;yxati
            </Link>
          </div>
        </div>

        {/* Review section */}
        {showReview && (
          <div className="rounded-2xl overflow-hidden"
               style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Filter tabs */}
            <div className="flex border-b p-4 gap-2 flex-wrap" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              {['all', ...sections].map(sec => (
                <button key={sec} onClick={() => setFilterSection(sec)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: filterSection === sec ? info.bg : 'rgba(255,255,255,0.04)',
                    color: filterSection === sec ? info.color : '#64748b',
                    border: `1px solid ${filterSection === sec ? info.border : 'rgba(255,255,255,0.07)'}`,
                  }}>
                  {sec === 'all' ? "Barchasi" : sec === 'Grammar' ? 'Grammatika' : sec === 'Vocabulary' ? "Lug'at" : "O'qish"}
                </button>
              ))}
            </div>

            {/* Questions review */}
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {filtered.map((q, i) => {
                const userAns = answers[q.id]
                const isCorrect = userAns === q.ans
                const isSkipped = userAns === undefined

                return (
                  <div key={q.id} className="rounded-xl overflow-hidden"
                       style={{
                         border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.25)' : isSkipped ? 'rgba(100,116,139,0.2)' : 'rgba(239,68,68,0.25)'}`,
                         background: isCorrect ? 'rgba(34,197,94,0.04)' : isSkipped ? 'rgba(255,255,255,0.02)' : 'rgba(239,68,68,0.04)',
                       }}>

                    {/* Q header */}
                    <div className="flex items-start gap-3 p-4 pb-3">
                      <div className="shrink-0 mt-0.5">
                        {isCorrect ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        ) : isSkipped ? (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-slate-500 mb-1">
                          #{questions.indexOf(q) + 1} · {q.section === 'Grammar' ? 'Grammatika' : q.section === 'Vocabulary' ? "Lug'at" : "O'qish"}
                        </div>
                        <p className="text-sm font-medium text-slate-200">{q.q}</p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="px-4 pb-3 space-y-1.5">
                      {q.opts.map((opt, idx) => {
                        const isAnswer = idx === q.ans
                        const isUser = idx === userAns
                        return (
                          <div key={idx}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium"
                            style={{
                              background: isAnswer
                                ? 'rgba(34,197,94,0.12)'
                                : (isUser && !isCorrect)
                                ? 'rgba(239,68,68,0.12)'
                                : 'rgba(255,255,255,0.03)',
                              color: isAnswer ? '#86efac' : (isUser && !isCorrect) ? '#fca5a5' : '#64748b',
                              border: `1px solid ${isAnswer ? 'rgba(34,197,94,0.25)' : (isUser && !isCorrect) ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}`,
                            }}>
                            <span className="font-black">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                            {isAnswer && <span className="ml-auto text-green-400">✓ To&apos;g&apos;ri</span>}
                            {isUser && !isCorrect && <span className="ml-auto text-red-400">✗ Siz</span>}
                          </div>
                        )
                      })}
                    </div>

                    {/* Explanation */}
                    {q.exp && (
                      <div className="mx-4 mb-4 px-3 py-2 rounded-lg text-xs text-slate-400"
                           style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <span className="font-semibold text-slate-300">Izoh: </span>{q.exp}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CEFRTestPage() {
  const { level } = useParams()
  const router = useRouter()
  const [phase, setPhase] = useState('intro') // intro | test | results
  const [finalAnswers, setFinalAnswers] = useState({})

  const levelKey = level?.toUpperCase()
  const info = LEVEL_INFO[levelKey]
  const questions = CEFR_QUESTIONS[levelKey]

  if (!info || !questions) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020B18' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white mb-2">Daraja topilmadi</h2>
          <p className="text-slate-500 mb-6">"{level}" noto&apos;g&apos;ri daraja identifikatori.</p>
          <Link href="/exams/cefr"
            className="px-6 py-3 rounded-xl font-semibold text-white inline-block"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
            CEFR Sahifasiga Qaytish
          </Link>
        </div>
      </div>
    )
  }

  if (phase === 'intro') return <IntroScreen level={level} info={info} questions={questions} onStart={() => setPhase('test')} />
  if (phase === 'test') return (
    <TestScreen
      level={level}
      info={info}
      questions={questions}
      onFinish={(ans) => { setFinalAnswers(ans); setPhase('results') }}
    />
  )
  return <ResultsScreen level={level} info={info} questions={questions} answers={finalAnswers} />
}
