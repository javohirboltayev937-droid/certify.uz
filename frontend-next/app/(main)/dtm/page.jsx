'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { dtmAPI, progressAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  MagnifyingGlassIcon, ChevronRightIcon, ArrowLeftIcon,
  ClockIcon, CheckCircleIcon, XCircleIcon, LightBulbIcon,
  SparklesIcon, AcademicCapIcon, BookOpenIcon, GlobeAltIcon,
  ComputerDesktopIcon, BanknotesIcon, BeakerIcon,
  PaintBrushIcon, TrophyIcon, SunIcon, ChartBarIcon,
  HeartIcon, DocumentTextIcon, InformationCircleIcon,
  DocumentCheckIcon, HandThumbUpIcon, StarIcon, ScaleIcon,
  ArrowRightIcon, BoltIcon, UserGroupIcon,
} from '@heroicons/react/24/outline'

const CAREER_CATEGORIES = [
  { key: 'medical',      label: 'Tibbiyot',             Icon: HeartIcon,           color: 'from-rose-500 to-pink-600',     glow: 'shadow-rose-500/30',    bg: 'from-rose-50 to-pink-50',    text: 'text-rose-600',    desc: 'Shifokor, stomatolog, farmatsevt' },
  { key: 'technical',    label: 'IT va Texnologiya',     Icon: ComputerDesktopIcon, color: 'from-blue-500 to-indigo-600',   glow: 'shadow-blue-500/30',    bg: 'from-blue-50 to-indigo-50',  text: 'text-blue-600',    desc: 'Dasturchi, muhandis, IT mutaxassisi' },
  { key: 'economic',     label: 'Iqtisod va Moliya',     Icon: BanknotesIcon,       color: 'from-emerald-500 to-teal-600',  glow: 'shadow-emerald-500/30', bg: 'from-emerald-50 to-teal-50', text: 'text-emerald-600', desc: 'Iqtisodchi, moliyachi, buxgalter' },
  { key: 'law',          label: 'Huquq va Adliya',       Icon: ScaleIcon,           color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/30',  bg: 'from-violet-50 to-purple-50',text: 'text-violet-600',  desc: 'Yurist, notarius, advokat' },
  { key: 'pedagogical',  label: "Ta'lim va Pedagogika",  Icon: AcademicCapIcon,     color: 'from-amber-500 to-orange-500',  glow: 'shadow-amber-500/30',   bg: 'from-amber-50 to-orange-50', text: 'text-amber-600',   desc: "O'qituvchi, tarbiyachi, psixolog" },
  { key: 'natural',      label: 'Tabiiy Fanlar',         Icon: BeakerIcon,          color: 'from-teal-500 to-cyan-600',     glow: 'shadow-teal-500/30',    bg: 'from-teal-50 to-cyan-50',    text: 'text-teal-600',    desc: 'Kimyogar, biologiyachi, fizik' },
  { key: 'humanitarian', label: 'Gumanitar',             Icon: GlobeAltIcon,        color: 'from-fuchsia-500 to-pink-600',  glow: 'shadow-fuchsia-500/30', bg: 'from-fuchsia-50 to-pink-50', text: 'text-fuchsia-600', desc: 'Jurnalist, tarjimon, siyosatshunos' },
  { key: 'agriculture',  label: "Qishloq Xo'jaligi",    Icon: SunIcon,             color: 'from-lime-500 to-green-600',    glow: 'shadow-lime-500/30',    bg: 'from-lime-50 to-green-50',   text: 'text-lime-600',    desc: 'Agrotexnolog, veterinar, zootexnik' },
  { key: 'art',          label: "San'at va Dizayn",      Icon: PaintBrushIcon,      color: 'from-orange-500 to-red-500',    glow: 'shadow-orange-500/30',  bg: 'from-orange-50 to-red-50',   text: 'text-orange-600',  desc: "Dizayner, rassam, me'mor" },
  { key: 'sports',       label: 'Sport',                 Icon: TrophyIcon,          color: 'from-sky-500 to-blue-600',      glow: 'shadow-sky-500/30',     bg: 'from-sky-50 to-blue-50',     text: 'text-sky-600',     desc: 'Murabbiy, sport shifokor, trener' },
]
const CATEGORY_MAP = Object.fromEntries(CAREER_CATEGORIES.map(c => [c.key, c]))

/* ─── tiny helpers ─── */
function Orb({ className }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
}

function GlassCard({ children, className = '' }) {
  return (
    <div className={`relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl ${className}`}>
      {children}
    </div>
  )
}

function SpinnerRow() {
  return (
    <span className="flex items-center gap-1.5">
      {[0,1,2].map(i => (
        <span key={i} className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />
      ))}
    </span>
  )
}

/* ─── Timer ─── */
function Timer({ seconds, onTimeUp }) {
  const [remaining, setRemaining] = useState(seconds)
  const ref = useRef(null)
  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining(p => { if (p <= 1) { clearInterval(ref.current); onTimeUp(); return 0 } return p - 1 })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [])
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const isLow = remaining < 300
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-base transition-colors ${isLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'}`}>
      <ClockIcon className="w-5 h-5" />
      {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
    </div>
  )
}

/* ─── QuestionCard ─── */
function QuestionCard({ question, index, total, onAnswer, selectedAnswer, showResult }) {
  return (
    <motion.div key={question.id} initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{index + 1} / {total} savol</span>
        <div className="flex items-center gap-2">
          <span className={`badge text-xs ${question.difficulty==='easy'?'bg-green-100 text-green-700':question.difficulty==='hard'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>
            {question.difficulty==='easy'?'Oson':question.difficulty==='hard'?'Qiyin':"O'rta"}
          </span>
          {question.topic && <span className="badge bg-gray-100 text-gray-600 text-xs">{question.topic}</span>}
        </div>
      </div>
      <div className="progress-track mb-6"><div className="progress-bar" style={{ width:`${((index+1)/total)*100}%` }} /></div>
      <p className="text-lg font-medium text-gray-900 leading-relaxed mb-6">{question.question_text}</p>
      <div className="space-y-3">
        {question.answers.map(answer => {
          let cls = 'quiz-option'
          if (showResult) {
            if (answer.is_correct) cls += ' correct'
            else if (selectedAnswer === answer.id && !answer.is_correct) cls += ' wrong'
            else cls += ' opacity-60'
          } else if (selectedAnswer === answer.id) cls += ' selected'
          return (
            <button key={answer.id} disabled={showResult} onClick={() => onAnswer(answer.id)} className={cls}>
              <span className="font-bold text-gray-400 mr-3">{answer.order})</span>
              {answer.answer_text}
              {showResult && answer.is_correct && <CheckCircleIcon className="w-5 h-5 text-green-600 inline ml-2" />}
              {showResult && selectedAnswer===answer.id && !answer.is_correct && <XCircleIcon className="w-5 h-5 text-red-600 inline ml-2" />}
            </button>
          )
        })}
      </div>
      {showResult && question.explanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 font-medium mb-1"><LightBulbIcon className="w-5 h-5" /> Tushuntirish</div>
          <p className="text-blue-800 text-sm">{question.explanation}</p>
        </div>
      )}
    </motion.div>
  )
}

/* ─── TestResult ─── */
function TestResult({ result, directionName, onRetry }) {
  const pct = result.percentage
  const grade =
    pct>=90 ? { label:"A'lo",               color:'text-green-600',  bg:'bg-green-50',  Icon:TrophyIcon } :
    pct>=75 ? { label:'Yaxshi',              color:'text-blue-600',   bg:'bg-blue-50',   Icon:StarIcon } :
    pct>=60 ? { label:'Qoniqarli',           color:'text-yellow-600', bg:'bg-yellow-50', Icon:HandThumbUpIcon } :
              { label:"Qayta urinib ko'ring", color:'text-red-600',   bg:'bg-red-50',    Icon:BookOpenIcon }
  return (
    <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <div className={`w-20 h-20 ${grade.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <grade.Icon className={`w-10 h-10 ${grade.color}`} />
        </div>
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Test yakunlandi!</h2>
        <p className="text-gray-500 mb-6">{directionName}</p>
        <div className={`${grade.bg} rounded-2xl p-6 mb-6`}>
          <div className={`text-5xl font-extrabold mb-1 ${grade.color}`}>{pct}%</div>
          <div className={`font-semibold ${grade.color}`}>{grade.label}</div>
          <div className="text-gray-600 mt-2">{result.correct_answers} / {result.total_questions} to'g'ri javob</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[['To\'g\'ri', result.correct_answers],['Xato',result.total_questions-result.correct_answers],['Vaqt',`${Math.floor(result.time_taken/60)}:${String(result.time_taken%60).padStart(2,'0')}`]].map(([l,v]) => (
            <div key={l} className="bg-gray-50 rounded-xl p-4"><div className="text-2xl font-bold text-gray-900">{v}</div><div className="text-sm text-gray-500">{l}</div></div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onRetry} className="btn-secondary flex-1">Qayta urinish</button>
          <Link href="/dashboard" className="btn-primary flex-1 justify-center">Dashboardga</Link>
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════ MAIN ══ */
export default function DTMTest() {
  const [step, setStep] = useState('careers')
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [directions, setDirections] = useState([])
  const [filteredDirections, setFilteredDirections] = useState([])
  const [selectedDirection, setSelectedDirection] = useState(null)
  const [subjectInfo, setSubjectInfo] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [attemptId, setAttemptId] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const { isAuthenticated } = useSelector(s => s.auth)
  const router = useRouter()

  useEffect(() => { if (selectedCareer) loadDirections(selectedCareer.key) }, [selectedCareer])
  useEffect(() => {
    if (!searchQuery) setFilteredDirections(directions)
    else { const q = searchQuery.toLowerCase(); setFilteredDirections(directions.filter(d => d.name.toLowerCase().includes(q) || d.code?.includes(q))) }
  }, [directions, searchQuery])

  const loadDirections = async (category) => {
    try { setLoading(true); const { data } = await dtmAPI.getDirections({ category, page_size: 200 }); setDirections(data.results || data) }
    catch { toast.error("Yo'nalishlarni yuklashda xatolik") }
    finally { setLoading(false) }
  }

  const handleSelectCareer = (career) => { setSelectedCareer(career); setSearchQuery(''); setStep('directions') }

  const handleSelectDirection = async (direction) => {
    setSelectedDirection(direction)
    try { const { data } = await dtmAPI.getDirectionSubjects(direction.id); setSubjectInfo(data); setStep('preview') }
    catch { toast.error("Ma'lumotlarni yuklashda xatolik") }
  }

  const startTest = async () => {
    if (!isAuthenticated) { toast("Test uchun ro'yxatdan o'ting!", { icon: '🔐' }); router.push('/login'); return }
    try {
      setTestLoading(true)
      const subjectIds = subjectInfo.subjects.map(s => s.id)
      const { data: attempt } = await progressAPI.startTest({ exam_type:'dtm', title:`DTM - ${selectedDirection.name}`, direction_id:selectedDirection.id, subjects:subjectIds })
      setAttemptId(attempt.attempt_id)
      const { data: testData } = await progressAPI.aiGenerateTest({ subjects:subjectIds, direction_name:selectedDirection.name, count:20, exam_type:'dtm' })
      setQuestions(testData.questions); setStartTime(Date.now()); setStep('test')
    } catch { toast.error('Test yaratishda xatolik') }
    finally { setTestLoading(false) }
  }

  const handleAnswer = (answerId) => { if (!showResult) setAnswers(p => ({ ...p, [questions[currentQ].id]: answerId })) }
  const nextQuestion = () => { setShowResult(false); if (currentQ < questions.length-1) setCurrentQ(p=>p+1); else submitTest() }

  const submitTest = async () => {
    const timeTaken = Math.floor((Date.now()-startTime)/1000)
    try {
      const { data } = await progressAPI.submitTest({ attempt_id:attemptId, answers:questions.map(q=>({ question_id:q.id, answer_id:answers[q.id]||null, time_taken:0 })), time_taken:timeTaken })
      setTestResult({ ...data, time_taken:timeTaken }); setStep('result')
    } catch { toast.error('Natijalarni saqlashda xatolik') }
  }

  const handleTimeUp = () => { toast('Vaqt tugadi!', { icon:'⏰' }); submitTest() }
  const resetAll = () => { setStep('careers'); setSelectedCareer(null); setSelectedDirection(null); setSubjectInfo(null); setQuestions([]); setCurrentQ(0); setAnswers({}); setShowResult(false); setTestResult(null); setDirections([]) }

  /* ── Result ── */
  if (step === 'result') return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <TestResult result={testResult} directionName={selectedDirection?.name}
        onRetry={() => { setStep('preview'); setQuestions([]); setCurrentQ(0); setAnswers({}) }} />
    </div>
  )

  /* ── Test ── */
  if (step === 'test' && questions.length > 0) {
    const cat = CATEGORY_MAP[selectedCareer?.key]
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`sticky top-0 bg-gradient-to-r ${cat?.color||'from-blue-600 to-indigo-700'} z-10 px-4 py-3 shadow-lg`}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="text-white">
              <div className="flex items-center gap-2">{cat && <cat.Icon className="w-5 h-5" />}<span className="font-semibold text-sm">{selectedDirection?.name}</span></div>
              <div className="text-white/70 text-xs mt-0.5">{currentQ+1}/{questions.length} savol · {Object.keys(answers).length} javoblandi</div>
            </div>
            <Timer seconds={180*60} onTimeUp={handleTimeUp} />
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <QuestionCard key={questions[currentQ]?.id} question={questions[currentQ]} index={currentQ} total={questions.length} onAnswer={handleAnswer} selectedAnswer={answers[questions[currentQ]?.id]} showResult={showResult} />
          </AnimatePresence>
          <div className="mt-6 flex gap-3">
            {!showResult && answers[questions[currentQ]?.id] && <button onClick={() => setShowResult(true)} className="btn-secondary flex-1">Javobni tekshirish</button>}
            <button onClick={nextQuestion} disabled={!answers[questions[currentQ]?.id] && !showResult} className="btn-primary flex-1 justify-center disabled:opacity-50">
              {currentQ < questions.length-1 ? 'Keyingi' : 'Testni yakunlash'}<ChevronRightIcon className="w-5 h-5 ml-1" />
            </button>
          </div>
          <div className="mt-6 card p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Savollar navigatsiyasi</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q,i) => (
                <button key={q.id} onClick={() => { setCurrentQ(i); setShowResult(false) }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${i===currentQ?'bg-primary-600 text-white':answers[q.id]?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {i+1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Preview ── */
  if (step === 'preview' && subjectInfo) {
    const cat = CATEGORY_MAP[selectedCareer?.key]
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 40%, #2563eb 70%, #4f46e5 100%)' }}>
        <Orb className="w-96 h-96 bg-blue-400/20 -top-20 -left-20" />
        <Orb className="w-80 h-80 bg-indigo-400/20 top-40 right-10" />
        <Orb className="w-64 h-64 bg-purple-400/15 bottom-20 left-1/3" />

        {/* Header */}
        <div className="relative px-4 pt-8 pb-6">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setStep('directions')} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeftIcon className="w-4 h-4" /> Orqaga
            </button>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${cat?.color||'from-blue-500 to-indigo-600'} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  {cat && <cat.Icon className="w-7 h-7 text-white" />}
                </div>
                <div className="text-white">
                  <h1 className="text-xl font-extrabold leading-tight">{selectedDirection?.name}</h1>
                  <p className="text-white/60 text-sm mt-0.5">Kod: {selectedDirection?.code}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Body */}
        <div className="relative max-w-2xl mx-auto px-4 pb-10">
          {/* Note */}
          <GlassCard className="p-5 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-400/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <InformationCircleIcon className="w-4 h-4 text-blue-200" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Majburiy fanlar</p>
                <p className="text-white/60 text-xs mt-1">{subjectInfo.note}</p>
              </div>
            </div>
          </GlassCard>

          {/* Subjects */}
          <GlassCard className="p-5 mb-4">
            <h3 className="text-white font-semibold mb-4 text-sm">Imtihon fanlari</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <DocumentCheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">O'zbek tili + Matematika</div>
                    <div className="text-white/50 text-xs">Majburiy · 30 + 30 savol</div>
                  </div>
                </div>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">60 ball</span>
              </div>
              {subjectInfo.subjects.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{i+1}-fan: {s.name}</div>
                      <div className="text-white/50 text-xs">{s.total_questions} savol</div>
                    </div>
                  </div>
                  <span className="bg-blue-400/30 text-blue-200 text-xs font-bold px-3 py-1 rounded-full">{s.total_questions} ball</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Jami savol', value: subjectInfo.total_questions, Icon: DocumentTextIcon },
              { label: 'Daqiqa',     value: subjectInfo.total_time,      Icon: ClockIcon },
              { label: 'AI savollar',value: 'Yangi',                     Icon: SparklesIcon },
            ].map(({ label, value, Icon }) => (
              <GlassCard key={label} className="p-4 text-center">
                <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-4 h-4 text-white/80" />
                </div>
                <div className="text-white font-extrabold text-lg">{value}</div>
                <div className="text-white/50 text-xs mt-0.5">{label}</div>
              </GlassCard>
            ))}
          </div>

          {/* AI badge */}
          <GlassCard className="p-4 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">AI yordamida generatsiya</p>
              <p className="text-white/60 text-xs mt-0.5">Har safar yangi, noyob savollar yaratiladi</p>
            </div>
          </GlassCard>

          <button onClick={startTest} disabled={testLoading}
            className="w-full py-4 rounded-2xl font-bold text-base bg-white text-primary-700 hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-3 disabled:opacity-60">
            {testLoading ? <><SpinnerRow /><span>AI savollar tayyorlanmoqda...</span></> : <><SparklesIcon className="w-5 h-5" /><span>Testni boshlash</span><ArrowRightIcon className="w-5 h-5" /></>}
          </button>
        </div>
      </div>
    )
  }

  /* ── Directions ── */
  if (step === 'directions' && selectedCareer) {
    const cat = CATEGORY_MAP[selectedCareer.key]
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 40%, #2563eb 70%, #4f46e5 100%)' }}>
        <Orb className="w-96 h-96 bg-blue-300/15 -top-20 right-0" />
        <Orb className="w-72 h-72 bg-indigo-400/20 bottom-40 -left-10" />

        {/* Header */}
        <div className="relative px-4 pt-8 pb-4">
          <div className="max-w-4xl mx-auto">
            <button onClick={resetAll} className="flex items-center gap-2 text-white/60 hover:text-white mb-5 text-sm transition-colors">
              <ArrowLeftIcon className="w-4 h-4" /> Kasblar
            </button>

            <GlassCard className="p-5 mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <cat.Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-white flex-1">
                  <h1 className="text-2xl font-extrabold">{cat.label}</h1>
                  <p className="text-white/60 text-sm mt-0.5">{cat.desc}</p>
                </div>
                <div className="text-right text-white/60 text-xs hidden sm:block">
                  <div className="text-white font-bold text-lg">{filteredDirections.length}</div>
                  <div>yo'nalish</div>
                </div>
              </div>
            </GlassCard>

            {/* Info strip */}
            <div className="flex items-center gap-2 text-white/60 text-xs mb-4 px-1">
              <InformationCircleIcon className="w-4 h-4 flex-shrink-0" />
              Yo'nalishingizni tanlang. Tizim avtomatik ravishda qaysi fanlardan test kelishini aniqlaydi va 200+ O'zbekiston universitetlarining barcha yo'nalishlarini o'z ichiga oladi.
            </div>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input type="text" placeholder="Yo'nalish nomi yoki kodi bo'yicha qidirish..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all" />
            </div>
          </div>
        </div>

        {/* Directions list */}
        <div className="relative max-w-4xl mx-auto px-4 pb-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              <p className="text-white/60 text-sm">Yo'nalishlar yuklanmoqda...</p>
            </div>
          ) : filteredDirections.length === 0 ? (
            <div className="text-center py-20">
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 text-white/20" />
              <p className="text-white/60">Yo'nalish topilmadi</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDirections.map((direction, i) => (
                <motion.button key={direction.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: Math.min(i*0.02, 0.4) }}
                  onClick={() => handleSelectDirection(direction)}
                  className="group relative w-full text-left rounded-2xl overflow-hidden backdrop-blur-sm bg-white/8 border border-white/15 hover:bg-white/15 hover:border-white/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm leading-snug mb-2">{direction.name}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-white/10 text-white/70 px-2 py-0.5 rounded-full">Kod: {direction.code}</span>
                        {direction.grant_places > 0 && (
                          <span className="bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AcademicCapIcon className="w-3 h-3" /> {direction.grant_places} grant
                          </span>
                        )}
                        {direction.contract_places > 0 && (
                          <span className="bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <DocumentTextIcon className="w-3 h-3" /> {direction.contract_places} kontrakt
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-all">
                      <ChevronRightIcon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── Careers (Home) ── */
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #1e40af 65%, #2563eb 100%)' }}>
      <Orb className="w-[500px] h-[500px] bg-blue-500/15 -top-40 -right-40" />
      <Orb className="w-96 h-96 bg-indigo-500/20 top-1/2 -left-20" />
      <Orb className="w-72 h-72 bg-purple-500/15 bottom-20 right-1/4" />

      {/* Hero */}
      <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-10 text-center">
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm text-white/80 mb-6">
          <SparklesIcon className="w-4 h-4 text-yellow-300" /> AI yordamida har safar yangi savollar
        </motion.div>
        <motion.h1 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          className="text-5xl font-extrabold text-white mb-4 leading-tight">
          DTM Test <span className="text-blue-300">Tizimi</span>
        </motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
          Kasbingizni tanlang — 200+ universitetning barcha yo'nalishlari bo'yicha AI savollar bilan tayyorlaning
        </motion.p>

        {/* Stats strip */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="inline-flex items-center gap-6 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl px-8 py-4 mb-12">
          {[
            { Icon: UserGroupIcon,  value: '200+', label: 'Universitetlar' },
            { Icon: BookOpenIcon,   value: '1000+',label: "Yo'nalishlar" },
            { Icon: SparklesIcon,   value: 'AI',   label: 'Savollar' },
            { Icon: ChartBarIcon,   value: '∞',    label: 'Urinishlar' },
          ].map(({ Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="text-white font-extrabold text-xl">{value}</div>
              <div className="text-white/50 text-xs mt-0.5 flex items-center gap-1"><Icon className="w-3 h-3" /> {label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Category grid */}
      <div className="relative max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <BoltIcon className="w-5 h-5 text-yellow-300" /> Qaysi soha qiziqtiradi?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CAREER_CATEGORIES.map((career, i) => (
            <motion.button key={career.key} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
              onClick={() => handleSelectCareer(career)}
              className="group relative rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] hover:shadow-2xl text-left">
              {/* Glass backdrop */}
              <div className="absolute inset-0 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-200" />
              {/* Gradient top stripe */}
              <div className={`relative h-1.5 bg-gradient-to-r ${career.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="relative p-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${career.color} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <career.Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white font-bold text-sm leading-tight mb-1">{career.label}</p>
                <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{career.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-white/40 text-xs group-hover:text-white/70 transition-colors">
                  Tanlash <ArrowRightIcon className="w-3 h-3" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { Icon: SparklesIcon,    title: 'AI savollar',    desc: 'Har safar yangi, unikal savollar yaratiladi' },
            { Icon: AcademicCapIcon, title: '200+ Universitet',desc: "Barcha O'zbekiston universitetlari qamragan" },
            { Icon: ChartBarIcon,    title: 'Progress tahlil', desc: 'Har bir urinishdan keyin batafsil statistika' },
          ].map(({ Icon, title, desc }) => (
            <GlassCard key={title} className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{title}</div>
                <div className="text-white/50 text-xs mt-0.5">{desc}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}
