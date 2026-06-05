import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dtmAPI } from '@/api/dtm'
import { progressAPI } from '@/api/exams'
import { Spinner } from '@/components/common/Loading'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  MagnifyingGlassIcon, ChevronRightIcon, ArrowLeftIcon,
  ClockIcon, CheckCircleIcon, XCircleIcon, LightBulbIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

// Zamonaviy kasb kategoriyalari
const CAREER_CATEGORIES = [
  {
    key: 'medical',
    label: 'Tibbiyot',
    icon: '🏥',
    emoji: '👨‍⚕️',
    color: 'from-red-400 to-rose-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    desc: 'Shifokor, stomatolog, farmatsevt, hamshira',
    popular: ['Umumiy tibbiyot', 'Stomatologiya', 'Pediatriya', 'Farmatsiya'],
  },
  {
    key: 'technical',
    label: 'IT va Texnologiya',
    icon: '💻',
    emoji: '👨‍💻',
    color: 'from-blue-400 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    desc: 'Dasturchi, muhandis, IT mutaxassisi',
    popular: ['Kompyuter muhandisligi', 'Dasturiy ta\'minot', 'Axborot xavfsizligi'],
  },
  {
    key: 'economic',
    label: 'Iqtisod va Moliya',
    icon: '💰',
    emoji: '📊',
    color: 'from-emerald-400 to-green-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    desc: 'Iqtisodchi, moliyachi, buxgalter, bankir',
    popular: ['Iqtisodiyot', 'Moliya', 'Buxgalteriya', 'Bank ishi'],
  },
  {
    key: 'law',
    label: 'Huquq va Adliya',
    icon: '⚖️',
    emoji: '👨‍⚖️',
    color: 'from-violet-400 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    desc: 'Yurist, notarius, prokuror, advokat',
    popular: ['Huquqshunoslik', 'Xalqaro huquq', 'Jinoyat huquqi'],
  },
  {
    key: 'pedagogical',
    label: 'Ta\'lim va Pedagogika',
    icon: '📚',
    emoji: '👩‍🏫',
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    desc: 'O\'qituvchi, tarbiyachi, psixolog',
    popular: ['Matematika o\'qitish', 'Ingliz tili', 'Boshlang\'ich ta\'lim'],
  },
  {
    key: 'natural',
    label: 'Tabiiy Fanlar',
    icon: '🔬',
    emoji: '🧪',
    color: 'from-teal-400 to-cyan-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    desc: 'Kimyogar, biologiyachi, fizik, geolog',
    popular: ['Kimyo', 'Biologiya', 'Fizika', 'Geologiya'],
  },
  {
    key: 'humanitarian',
    label: 'Gumanitar',
    icon: '🌍',
    emoji: '📰',
    color: 'from-pink-400 to-fuchsia-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    desc: 'Jurnalist, tarjimon, siyosatshunos',
    popular: ['Jurnalistika', 'Xalqaro munosabatlar', 'Filologiya'],
  },
  {
    key: 'agriculture',
    label: 'Qishloq Xo\'jaligi',
    icon: '🌾',
    emoji: '👨‍🌾',
    color: 'from-lime-400 to-green-500',
    bg: 'bg-lime-50',
    border: 'border-lime-200',
    text: 'text-lime-700',
    desc: 'Agrotexnolog, veterinar, zootexnik',
    popular: ['Agrotexnologiya', 'Veterinariya', 'Zootexniya'],
  },
  {
    key: 'art',
    label: 'San\'at va Dizayn',
    icon: '🎨',
    emoji: '🎭',
    color: 'from-orange-400 to-red-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    desc: 'Dizayner, rassam, rejissyor, me\'mor',
    popular: ['Dizayn', 'Arxitektura', 'Musiqa', 'Rasm'],
  },
  {
    key: 'sports',
    label: 'Sport va Jismoniy Tarbiya',
    icon: '⚽',
    emoji: '🏆',
    color: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    desc: 'Murabbiy, sport shifokor, trener',
    popular: ['Jismoniy tarbiya', 'Sport menejmenti'],
  },
]

const CATEGORY_MAP = Object.fromEntries(CAREER_CATEGORIES.map(c => [c.key, c]))

// ─── Timer ────────────────────────────────────────────────────────────────────
function Timer({ seconds, onTimeUp }) {
  const [remaining, setRemaining] = useState(seconds)
  const ref = useRef(null)

  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(ref.current); onTimeUp(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const isLow = remaining < 300

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg transition-colors ${isLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
      <ClockIcon className="w-5 h-5" />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  )
}

// ─── Question Card ─────────────────────────────────────────────────────────────
function QuestionCard({ question, index, total, onAnswer, selectedAnswer, showResult }) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{index + 1} / {total} savol</span>
        <div className="flex items-center gap-2">
          <span className={`badge text-xs ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            question.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {question.difficulty === 'easy' ? 'Oson' : question.difficulty === 'hard' ? 'Qiyin' : "O'rta"}
          </span>
          {question.topic && <span className="badge bg-gray-100 text-gray-600 text-xs">{question.topic}</span>}
        </div>
      </div>

      <div className="progress-bar mb-6">
        <div className="progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <p className="text-lg font-medium text-gray-900 leading-relaxed mb-6">{question.question_text}</p>

      <div className="space-y-3">
        {question.answers.map((answer) => {
          let cls = 'quiz-option'
          if (showResult) {
            if (answer.is_correct) cls += ' correct'
            else if (selectedAnswer === answer.id && !answer.is_correct) cls += ' wrong'
            else cls += ' opacity-60'
          } else if (selectedAnswer === answer.id) {
            cls += ' selected'
          }
          return (
            <button key={answer.id} disabled={showResult} onClick={() => onAnswer(answer.id)} className={cls}>
              <span className="font-bold text-gray-400 mr-3">{answer.order})</span>
              {answer.answer_text}
              {showResult && answer.is_correct && <CheckCircleIcon className="w-5 h-5 text-green-600 inline ml-2" />}
              {showResult && selectedAnswer === answer.id && !answer.is_correct && <XCircleIcon className="w-5 h-5 text-red-600 inline ml-2" />}
            </button>
          )
        })}
      </div>

      {showResult && question.explanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
            <LightBulbIcon className="w-5 h-5" /> Tushuntirish
          </div>
          <p className="text-blue-800 text-sm">{question.explanation}</p>
        </div>
      )}
    </motion.div>
  )
}

// ─── Test Result ───────────────────────────────────────────────────────────────
function TestResult({ result, directionName, onRetry, category }) {
  const pct = result.percentage
  const grade =
    pct >= 90 ? { label: "A'lo", color: 'text-green-600', bg: 'bg-green-50', emoji: '🏆' } :
    pct >= 75 ? { label: 'Yaxshi', color: 'text-blue-600', bg: 'bg-blue-50', emoji: '🌟' } :
    pct >= 60 ? { label: 'Qoniqarli', color: 'text-yellow-600', bg: 'bg-yellow-50', emoji: '👍' } :
    { label: 'Qayta urinib ko\'ring', color: 'text-red-600', bg: 'bg-red-50', emoji: '📚' }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <div className="text-6xl mb-4">{grade.emoji}</div>
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Test yakunlandi!</h2>
        <p className="text-gray-500 mb-6">{directionName}</p>
        <div className={`${grade.bg} rounded-2xl p-6 mb-6`}>
          <div className={`text-5xl font-extrabold mb-1 ${grade.color}`}>{pct}%</div>
          <div className={`font-semibold ${grade.color}`}>{grade.label}</div>
          <div className="text-gray-600 mt-2">{result.correct_answers} / {result.total_questions} to'g'ri javob</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-900">{result.correct_answers}</div>
            <div className="text-sm text-gray-500">To'g'ri</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-900">{result.total_questions - result.correct_answers}</div>
            <div className="text-sm text-gray-500">Xato</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-900">
              {Math.floor(result.time_taken / 60)}:{String(result.time_taken % 60).padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500">Vaqt</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onRetry} className="btn-secondary flex-1">Qayta urinish</button>
          <Link to="/dashboard" className="btn-primary flex-1">Dashboardga</Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DTMTest() {
  const [step, setStep] = useState('careers')   // careers | directions | preview | test | result
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
  const navigate = useNavigate()

  // Yo'nalishlar yuklanishi
  useEffect(() => {
    if (selectedCareer) loadDirections(selectedCareer.key)
  }, [selectedCareer])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredDirections(directions)
    } else {
      const q = searchQuery.toLowerCase()
      setFilteredDirections(directions.filter(d =>
        d.name.toLowerCase().includes(q) || d.code?.includes(q)
      ))
    }
  }, [directions, searchQuery])

  const loadDirections = async (category) => {
    try {
      setLoading(true)
      const { data } = await dtmAPI.getDirections({ category, page_size: 200 })
      setDirections(data.results || data)
    } catch {
      toast.error('Yo\'nalishlarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCareer = (career) => {
    setSelectedCareer(career)
    setSearchQuery('')
    setStep('directions')
  }

  const handleSelectDirection = async (direction) => {
    setSelectedDirection(direction)
    try {
      const { data } = await dtmAPI.getDirectionSubjects(direction.id)
      setSubjectInfo(data)
      setStep('preview')
    } catch {
      toast.error('Ma\'lumotlarni yuklashda xatolik')
    }
  }

  const startTest = async () => {
    if (!isAuthenticated) {
      toast('Test uchun ro\'yxatdan o\'ting!', { icon: '🔐' })
      navigate('/login')
      return
    }
    try {
      setTestLoading(true)
      const subjectIds = subjectInfo.subjects.map(s => s.id)

      const { data: attempt } = await progressAPI.startTest({
        exam_type: 'dtm',
        title: `DTM - ${selectedDirection.name}`,
        direction_id: selectedDirection.id,
        subjects: subjectIds,
      })
      setAttemptId(attempt.attempt_id)

      // AI generatsiya — har xil bo'ladi
      const { data: testData } = await progressAPI.aiGenerateTest({
        subjects: subjectIds,
        direction_name: selectedDirection.name,
        count: 20,
        exam_type: 'dtm',
      })
      setQuestions(testData.questions)
      setStartTime(Date.now())
      setStep('test')
    } catch (err) {
      toast.error('Test yaratishda xatolik')
    } finally {
      setTestLoading(false)
    }
  }

  const handleAnswer = (answerId) => {
    if (showResult) return
    setAnswers(prev => ({ ...prev, [questions[currentQ].id]: answerId }))
  }

  const nextQuestion = () => {
    setShowResult(false)
    if (currentQ < questions.length - 1) setCurrentQ(prev => prev + 1)
    else submitTest()
  }

  const submitTest = async () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const answersArray = questions.map(q => ({
      question_id: q.id,
      answer_id: answers[q.id] || null,
      time_taken: 0,
    }))
    try {
      const { data } = await progressAPI.submitTest({
        attempt_id: attemptId,
        answers: answersArray,
        time_taken: timeTaken,
      })
      setTestResult({ ...data, time_taken: timeTaken })
      setStep('result')
    } catch {
      toast.error('Natijalarni saqlashda xatolik')
    }
  }

  const handleTimeUp = () => { toast('Vaqt tugadi!', { icon: '⏰' }); submitTest() }

  const resetAll = () => {
    setStep('careers')
    setSelectedCareer(null)
    setSelectedDirection(null)
    setSubjectInfo(null)
    setQuestions([])
    setCurrentQ(0)
    setAnswers({})
    setShowResult(false)
    setTestResult(null)
    setDirections([])
  }

  // ── Result ──────────────────────────────────────────────────────────────────
  if (step === 'result') {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <TestResult
          result={testResult}
          directionName={selectedDirection?.name}
          onRetry={() => { setStep('preview'); setQuestions([]); setCurrentQ(0); setAnswers({}) }}
          category={selectedCareer}
        />
      </div>
    )
  }

  // ── Test ────────────────────────────────────────────────────────────────────
  if (step === 'test' && questions.length > 0) {
    const cat = CATEGORY_MAP[selectedCareer?.key]
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b z-10 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{cat?.icon}</span>
                <span className="font-semibold text-gray-900 text-sm">{selectedDirection?.name}</span>
              </div>
              <div className="text-xs text-gray-500">
                {currentQ + 1}/{questions.length} savol · {Object.keys(answers).length} javoblandi
              </div>
            </div>
            <Timer seconds={180 * 60} onTimeUp={handleTimeUp} />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={questions[currentQ]?.id}
              question={questions[currentQ]}
              index={currentQ}
              total={questions.length}
              onAnswer={handleAnswer}
              selectedAnswer={answers[questions[currentQ]?.id]}
              showResult={showResult}
            />
          </AnimatePresence>

          <div className="mt-6 flex gap-3">
            {!showResult && answers[questions[currentQ]?.id] && (
              <button onClick={() => setShowResult(true)} className="btn-secondary flex-1">
                Javobni tekshirish
              </button>
            )}
            <button
              onClick={nextQuestion}
              disabled={!answers[questions[currentQ]?.id] && !showResult}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {currentQ < questions.length - 1 ? 'Keyingi' : 'Testni yakunlash'}
              <ChevronRightIcon className="w-5 h-5 ml-1" />
            </button>
          </div>

          <div className="mt-6 card p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Savollar navigatsiyasi</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => { setCurrentQ(i); setShowResult(false) }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    i === currentQ ? 'bg-primary-600 text-white' :
                    answers[q.id] ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Preview ─────────────────────────────────────────────────────────────────
  if (step === 'preview' && subjectInfo) {
    const cat = CATEGORY_MAP[selectedCareer?.key]
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`bg-gradient-to-br ${cat?.color || 'from-orange-500 to-red-600'} text-white py-10 px-4`}>
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setStep('directions')} className="flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm">
              <ArrowLeftIcon className="w-4 h-4" /> Orqaga
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{cat?.icon}</span>
              <div>
                <h1 className="text-2xl font-extrabold">{selectedDirection?.name}</h1>
                <p className="text-white/70 text-sm">Kod: {selectedDirection?.code}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card p-6 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
              <p className="text-sm text-blue-700 font-medium">ℹ️ Majburiy fanlar</p>
              <p className="text-sm text-blue-600 mt-1">{subjectInfo.note}</p>
            </div>

            <h3 className="font-semibold text-gray-900 mb-3">Imtihon fanlari:</h3>
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇺🇿</span>
                  <div>
                    <div className="font-medium text-sm">O'zbek tili + Matematika (majburiy)</div>
                    <div className="text-xs text-gray-500">30 + 30 savol</div>
                  </div>
                </div>
                <span className="badge bg-gray-200 text-gray-700 text-xs">60 ball</span>
              </div>
              {subjectInfo.subjects.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.icon || '📖'}</span>
                    <div>
                      <div className="font-medium text-sm">{i + 1}-fan: {s.name}</div>
                      <div className="text-xs text-gray-500">{s.total_questions} savol</div>
                    </div>
                  </div>
                  <span className="badge bg-primary-100 text-primary-700 text-xs">{s.total_questions} ball</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 bg-orange-50 rounded-xl p-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-700">{subjectInfo.total_questions}</div>
                <div className="text-xs text-orange-600">Jami savol</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-700">{subjectInfo.total_time}</div>
                <div className="text-xs text-orange-600">Daqiqa</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-700 flex items-center justify-center gap-1">
                  <SparklesIcon className="w-4 h-4" /> AI
                </div>
                <div className="text-xs text-orange-600">Savollar</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 text-purple-700 font-medium text-sm mb-1">
                <SparklesIcon className="w-4 h-4" /> AI yordamida generatsiya
              </div>
              <p className="text-purple-600 text-xs">Har safar yangi, noyob savollar yaratiladi. Hamma uchun har xil!</p>
            </div>

            <button
              onClick={startTest}
              disabled={testLoading}
              className="btn-primary w-full text-base py-4"
            >
              {testLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" /> AI savollar tayyorlanmoqda...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <SparklesIcon className="w-5 h-5" /> Testni boshlash
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Directions ───────────────────────────────────────────────────────────────
  if (step === 'directions' && selectedCareer) {
    const cat = CATEGORY_MAP[selectedCareer.key]
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`bg-gradient-to-br ${cat.color} text-white py-10 px-4`}>
          <div className="max-w-4xl mx-auto">
            <button onClick={resetAll} className="flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm">
              <ArrowLeftIcon className="w-4 h-4" /> Kasblar
            </button>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{cat.icon}</span>
              <div>
                <h1 className="text-2xl font-extrabold">{cat.label}</h1>
                <p className="text-white/80 text-sm">{cat.desc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="relative mb-5">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Yo'nalish nomi bo'yicha qidirish..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : filteredDirections.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>Yo'nalish topilmadi</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{filteredDirections.length} ta yo'nalish</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDirections.map((direction, i) => (
                  <motion.button
                    key={direction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    onClick={() => handleSelectDirection(direction)}
                    className="card p-4 text-left hover:scale-[1.02] active:scale-[0.99] transition-transform group w-full"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm leading-snug mb-1">{direction.name}</p>
                        <div className="flex gap-3 text-xs text-gray-400">
                          <span>Kod: {direction.code}</span>
                          {direction.grant_places > 0 && <span>🎓 Grant: {direction.grant_places}</span>}
                          {direction.contract_places > 0 && <span>📝 Kontrakt: {direction.contract_places}</span>}
                        </div>
                      </div>
                      <ChevronRightIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors text-gray-300 group-hover:${cat.text.replace('text-', 'text-')}`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ── Careers (Bosh sahifa) ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-4">
            <SparklesIcon className="w-4 h-4 text-yellow-400" />
            AI yordamida har xil savollar
          </div>
          <h1 className="text-4xl font-extrabold mb-3">🎓 DTM Test Tizimi</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Kasbingizni tanlang — har safar yangi AI savollar bilan tayyorlaning
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Qaysi soha qiziqtiradi?</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CAREER_CATEGORIES.map((career, i) => (
            <motion.button
              key={career.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelectCareer(career)}
              className="group relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-current transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] text-left"
            >
              <div className={`bg-gradient-to-br ${career.color} p-5 text-white`}>
                <div className="text-3xl mb-2">{career.icon}</div>
                <div className="font-bold text-sm leading-tight">{career.label}</div>
              </div>
              <div className={`${career.bg} p-3`}>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{career.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-medium ${career.text}`}>Yo'nalishlar →</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🤖', title: 'AI savollar', desc: 'Claude AI har safar yangi savollar yaratadi' },
            { icon: '🎯', title: 'Har xil test', desc: 'Hech qachon bir xil savol takrorlanmaydi' },
            { icon: '📊', title: 'Natijalar', desc: 'Progress va statistikani kuzatib boring' },
          ].map(item => (
            <div key={item.title} className="card p-5 flex items-start gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
