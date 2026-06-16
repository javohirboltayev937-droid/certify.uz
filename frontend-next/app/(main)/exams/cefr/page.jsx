'use client'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { MOCK_SECTIONS, calcLevel } from './mock-questions'
import {
  ClockIcon, CheckCircleIcon, XCircleIcon,
  ArrowRightIcon, TrophyIcon, AcademicCapIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

/* ── Timer ── */
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
  const low = rem < 60
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm ${low ? 'animate-pulse' : ''}`}
         style={low
           ? { background:'rgba(239,68,68,0.25)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.4)' }
           : { background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)' }}>
      <ClockIcon className="w-4 h-4" />
      {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
    </div>
  )
}

/* ── Intro Screen ── */
function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background:'#020B18' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20"
             style={{ background:'radial-gradient(circle, #7c3aed 0%, #2563eb 50%, transparent 80%)' }} />
      </div>

      <div className="relative max-w-xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
             style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', color:'#a78bfa' }}>
          <AcademicCapIcon className="w-3.5 h-3.5" />
          CEFR Sertifikatlash Testi
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
          CEFR Mock Test
        </h1>
        <p className="text-slate-400 text-base mb-10 max-w-md mx-auto">
          40 ta savol orqali ingliz tili darajangiz aniqlanadi. Test tugagach, darajangizga mos sertifikat olasiz.
        </p>

        {/* Sections */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {MOCK_SECTIONS.map(sec => (
            <div key={sec.id} className="rounded-2xl p-4 text-left"
                 style={{ background: sec.bg, border: `1px solid ${sec.border}` }}>
              <div className="text-2xl mb-2">{sec.icon}</div>
              <div className="font-bold text-white text-sm">{sec.name}</div>
              <div className="text-xs mt-0.5" style={{ color: sec.color }}>{sec.nameUz}</div>
              <div className="text-xs text-slate-500 mt-1">10 savol · 10 daqiqa</div>
            </div>
          ))}
        </div>

        {/* Info pills */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
          {[['40', 'Jami savol'], ['40 daqiqa', 'Vaqt'], ['A1–C2', 'Daraja'], ['100%', 'Bepul']].map(([v,l]) => (
            <div key={l} className="text-center">
              <div className="text-lg font-black text-white">{v}</div>
              <div className="text-xs text-slate-500">{l}</div>
            </div>
          ))}
        </div>

        <button onClick={onStart}
          className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow:'0 0 40px rgba(124,58,237,0.4)' }}>
          <SparklesIcon className="w-5 h-5" />
          Testni boshlash
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

/* ── Section Intro ── */
function SectionIntro({ section, sectionIdx, onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background:'#020B18' }}>
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">{section.icon}</div>
        <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: section.color }}>
          {sectionIdx + 1} / {MOCK_SECTIONS.length} bo'lim
        </div>
        <h2 className="text-3xl font-black text-white mb-2">{section.name}</h2>
        <p className="text-slate-400 mb-2">{section.nameUz}</p>
        <p className="text-slate-500 text-sm mb-8">{section.desc}</p>

        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-xl font-black text-white">10</div>
            <div className="text-xs text-slate-500">Savol</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-white">10:00</div>
            <div className="text-xs text-slate-500">Vaqt</div>
          </div>
        </div>

        <button onClick={onStart}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background:`linear-gradient(135deg, ${section.color}cc, ${section.color}88)`, boxShadow:`0 0 30px ${section.glow}` }}>
          Boshlash
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

/* ── Question Screen ── */
function QuestionScreen({ section, sectionIdx, questionIdx, answers, onAnswer, onNext, onTimeUp }) {
  const q = section.questions[questionIdx]
  const chosen = answers[q.id]
  const [revealed, setReveal] = useState(false)

  useEffect(() => { setReveal(false) }, [q.id])

  const handleOption = (idx) => {
    if (chosen !== undefined || revealed) return
    onAnswer(q.id, idx)
  }

  const handleNext = () => {
    if (chosen === undefined) { toast('Javob tanlang!', { icon:'⚠️' }); return }
    if (!revealed) { setReveal(true); return }
    onNext()
  }

  const total = section.questions.length
  const progress = ((questionIdx + 1) / total) * 100

  return (
    <div className="min-h-screen flex flex-col" style={{ background:'#020B18' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
           style={{ background:'rgba(2,11,24,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <div>
            <div className="text-white font-bold text-sm">{section.name}</div>
            <div className="text-slate-500 text-xs">{questionIdx + 1} / {total}</div>
          </div>
        </div>
        <Timer key={`${sectionIdx}-${questionIdx}`} totalSec={600} onTimeUp={onTimeUp} />
      </div>

      {/* Progress bar */}
      <div className="h-1" style={{ background:'rgba(255,255,255,0.06)' }}>
        <div className="h-full transition-all duration-300" style={{ width:`${progress}%`, background: section.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        {/* Context (audio transcript or passage) */}
        {q.audio && (
          <div className="rounded-2xl p-4 mb-5 text-sm text-slate-300 leading-relaxed"
               style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)' }}>
            <div className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">🎧 Audio matni</div>
            {q.audio}
          </div>
        )}
        {q.passage && (
          <div className="rounded-2xl p-4 mb-5 text-sm text-slate-300 leading-relaxed"
               style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)' }}>
            <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: section.color }}>📖 Matn</div>
            {q.passage}
          </div>
        )}

        {/* Question */}
        <p className="text-white font-semibold text-lg leading-relaxed mb-6">{q.q}</p>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {q.opts.map((opt, idx) => {
            const isChosen = chosen === idx
            const isCorrect = q.ans === idx
            let border = 'rgba(255,255,255,0.1)'
            let bg = 'rgba(255,255,255,0.04)'
            let textColor = '#cbd5e1'
            let icon = null

            if (revealed) {
              if (isCorrect) {
                bg = 'rgba(16,185,129,0.15)'; border = 'rgba(16,185,129,0.5)'; textColor = '#34d399'
                icon = <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              } else if (isChosen && !isCorrect) {
                bg = 'rgba(239,68,68,0.15)'; border = 'rgba(239,68,68,0.5)'; textColor = '#f87171'
                icon = <XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
              } else {
                textColor = '#475569'
              }
            } else if (isChosen) {
              bg = `${section.color}22`; border = section.color; textColor = 'white'
            }

            return (
              <button key={idx} onClick={() => handleOption(idx)} disabled={revealed}
                className="w-full text-left rounded-xl p-4 flex items-center gap-3 transition-all duration-200"
                style={{ background: bg, border: `1px solid ${border}`, color: textColor }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background:'rgba(255,255,255,0.08)' }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 text-sm">{opt}</span>
                {icon}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {revealed && q.exp && (
          <div className="rounded-xl p-4 mb-6 text-sm"
               style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.25)' }}>
            <div className="font-semibold text-blue-300 mb-1">💡 Tushuntirish</div>
            <div className="text-blue-200">{q.exp}</div>
          </div>
        )}

        {/* Next button */}
        <button onClick={handleNext} disabled={chosen === undefined}
          className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          style={{ background: chosen !== undefined ? `linear-gradient(135deg, ${section.color}cc, ${section.color}88)` : 'rgba(255,255,255,0.06)' }}>
          {!revealed && chosen !== undefined ? 'Javobni ko\'rish' : questionIdx < total - 1 ? 'Keyingi savol' : "Bo'limni yakunlash"}
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ── Section Done ── */
function SectionDone({ section, sectionAnswers, isLast, onNext }) {
  const correct = section.questions.filter(q => sectionAnswers[q.id] === q.ans).length
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background:'#020B18' }}>
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">{correct >= 7 ? '🎉' : correct >= 5 ? '👍' : '📚'}</div>
        <h2 className="text-2xl font-black text-white mb-2">{section.name} yakunlandi</h2>
        <div className="rounded-2xl p-6 mb-6 mt-4"
             style={{ background: section.bg, border: `1px solid ${section.border}` }}>
          <div className="text-4xl font-black mb-1" style={{ color: section.color }}>{correct} / 10</div>
          <div className="text-slate-400 text-sm">to'g'ri javob</div>
        </div>
        <button onClick={onNext}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
          {isLast ? 'Natijani ko\'rish' : 'Keyingi bo\'lim'}
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

/* ── Result Screen ── */
function ResultScreen({ answers, onRestart }) {
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const total = MOCK_SECTIONS.reduce((sum, sec) => sum + sec.questions.length, 0)
  const correct = MOCK_SECTIONS.reduce((sum, sec) =>
    sum + sec.questions.filter(q => answers[q.id] === q.ans).length, 0)
  const result = calcLevel(correct, total)
  const pct = Math.round((correct / total) * 100)

  const sendCertificate = async () => {
    if (!isAuthenticated) {
      toast("Sertifikat olish uchun tizimga kiring!", { icon:'🔐' })
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/telegram/send-certificate/', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('access')}` },
        body: JSON.stringify({ level: result.level, score: pct, correct, total }),
      })
      if (res.ok) {
        setSent(true)
        toast.success("Sertifikat Telegram'ga yuborildi! 🎉")
      } else {
        toast.error("Yuborishda xatolik. Telegramni ulang.")
      }
    } catch {
      toast.error("Tarmoq xatosi.")
    } finally {
      setSending(false)
    }
  }

  const sectionScores = MOCK_SECTIONS.map(sec => ({
    ...sec,
    correct: sec.questions.filter(q => answers[q.id] === q.ans).length,
  }))

  return (
    <div className="min-h-screen px-4 py-16" style={{ background:'#020B18' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-25"
             style={{ background:`radial-gradient(circle, ${result.color} 0%, transparent 70%)` }} />
      </div>

      <div className="relative max-w-xl mx-auto text-center">
        <TrophyIcon className="w-16 h-16 mx-auto mb-4" style={{ color: result.color }} />
        <h1 className="text-3xl font-black text-white mb-2">Test yakunlandi!</h1>
        <p className="text-slate-400 mb-8">Sizning CEFR darajangiz:</p>

        {/* Level badge */}
        <div className="rounded-3xl p-8 mb-8"
             style={{ background:`${result.color}15`, border:`2px solid ${result.color}40` }}>
          <div className="text-7xl font-black mb-2" style={{ color: result.color }}>{result.level}</div>
          <div className="text-xl font-bold text-white mb-2">{result.label}</div>
          <div className="text-slate-400 text-sm">{result.desc}</div>
          <div className="mt-4 text-3xl font-black text-white">{pct}%</div>
          <div className="text-slate-500 text-sm">{correct} / {total} to'g'ri javob</div>
        </div>

        {/* Section breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {sectionScores.map(sec => (
            <div key={sec.id} className="rounded-2xl p-4 text-left"
                 style={{ background: sec.bg, border:`1px solid ${sec.border}` }}>
              <div className="text-lg mb-1">{sec.icon}</div>
              <div className="text-xs font-semibold text-slate-400">{sec.name}</div>
              <div className="text-xl font-black mt-1" style={{ color: sec.color }}>{sec.correct}/10</div>
            </div>
          ))}
        </div>

        {/* Certificate button */}
        {sent ? (
          <div className="rounded-2xl p-4 mb-4 flex items-center justify-center gap-2 text-emerald-400 font-semibold"
               style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)' }}>
            <CheckCircleIcon className="w-5 h-5" />
            Sertifikat Telegram'ga yuborildi!
          </div>
        ) : (
          <button onClick={sendCertificate} disabled={sending}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 mb-4 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow:'0 0 30px rgba(124,58,237,0.35)' }}>
            {sending ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Yuborilmoqda...</span></>
            ) : (
              <><span>🏆</span><span>Sertifikat olish (Telegram)</span></>
            )}
          </button>
        )}

        <button onClick={onRestart}
          className="w-full py-3 rounded-xl font-semibold text-slate-400 transition-all hover:text-white"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
          Qayta ishlash
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════ MAIN ════ */
export default function CEFRMockPage() {
  const [phase, setPhase] = useState('intro') // intro | section-intro | test | section-done | result
  const [sectionIdx, setSectionIdx] = useState(0)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState({})

  const section = MOCK_SECTIONS[sectionIdx]

  const handleAnswer = (qId, idx) => setAnswers(p => ({ ...p, [qId]: idx }))

  const handleNextQuestion = () => {
    if (questionIdx < section.questions.length - 1) {
      setQuestionIdx(i => i + 1)
    } else {
      setPhase('section-done')
    }
  }

  const handleSectionDoneNext = () => {
    if (sectionIdx < MOCK_SECTIONS.length - 1) {
      setSectionIdx(i => i + 1)
      setQuestionIdx(0)
      setPhase('section-intro')
    } else {
      setPhase('result')
    }
  }

  const handleRestart = () => {
    setPhase('intro'); setSectionIdx(0); setQuestionIdx(0); setAnswers({})
  }

  if (phase === 'intro') return <IntroScreen onStart={() => setPhase('section-intro')} />

  if (phase === 'section-intro') return (
    <SectionIntro section={section} sectionIdx={sectionIdx} onStart={() => setPhase('test')} />
  )

  if (phase === 'test') return (
    <QuestionScreen
      section={section}
      sectionIdx={sectionIdx}
      questionIdx={questionIdx}
      answers={answers}
      onAnswer={handleAnswer}
      onNext={handleNextQuestion}
      onTimeUp={() => { toast('Vaqt tugadi!', { icon:'⏰' }); setPhase('section-done') }}
    />
  )

  if (phase === 'section-done') return (
    <SectionDone
      section={section}
      sectionAnswers={answers}
      isLast={sectionIdx === MOCK_SECTIONS.length - 1}
      onNext={handleSectionDoneNext}
    />
  )

  return <ResultScreen answers={answers} onRestart={handleRestart} />
}
