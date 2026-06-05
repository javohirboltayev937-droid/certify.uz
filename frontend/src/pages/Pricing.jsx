import { useState, useEffect, useRef } from 'react'
import { paymentsAPI } from '@/api/payments'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, ShieldCheckIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { Spinner } from '@/components/common/Loading'

const PLAN_ICONS = { free: '🆓', monthly: '📅', quarterly: '🔥', annual: '⭐' }

const PAYMENT_METHODS = [
  { id: 'payme',  label: 'Payme',   logo: '/payme.svg',  emoji: '💳', color: 'bg-blue-600',   needsExpiry: true },
  { id: 'click',  label: 'Click',   logo: '/click.svg',  emoji: '🔵', color: 'bg-green-600',  needsExpiry: true },
  { id: 'uzcard', label: 'UzCard',  logo: '/uzcard.svg', emoji: '🟢', color: 'bg-emerald-600', needsExpiry: false },
  { id: 'humo',   label: 'Humo',    logo: '/humo.svg',   emoji: '🔴', color: 'bg-red-600',    needsExpiry: false },
]

// ─── Karta raqam formatlash ────────────────────────────────────────────────────
function formatCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}
function maskCard(num) {
  const digits = num.replace(/\s/g, '')
  return digits.slice(0, 4) + ' **** **** ' + digits.slice(-4)
}

// ─── To'lov Modali ────────────────────────────────────────────────────────────
function PaymentModal({ plan, method, onClose, onSuccess }) {
  const [step, setStep] = useState('card')  // card | otp | processing | receipt | success
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [errors, setErrors] = useState({})
  const otpRefs = useRef([])
  const m = PAYMENT_METHODS.find(x => x.id === method)

  const cardDigits = cardNumber.replace(/\s/g, '')

  const validateCard = () => {
    const errs = {}
    if (cardDigits.length !== 16) errs.card = 'Karta raqami 16 ta raqamdan iborat bo\'lishi kerak'
    if (m.needsExpiry) {
      const parts = expiry.split('/')
      if (expiry.length < 5) errs.expiry = 'Muddatni to\'liq kiriting (MM/YY)'
      else {
        const mon = parseInt(parts[0])
        if (mon < 1 || mon > 12) errs.expiry = 'Oy 01–12 orasida bo\'lishi kerak'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // UzCard/Humo → karta → OTP
  // Payme/Click → karta + muddati → processing → chek
  const handleCardSubmit = async () => {
    if (!validateCard()) return
    setLoading(true)

    if (!m.needsExpiry) {
      // UzCard / Humo — OTP yuborish
      await new Promise(r => setTimeout(r, 800))
      setOtpSent(true)
      setStep('otp')
      setLoading(false)
    } else {
      // Payme / Click — processing
      setStep('processing')
      setLoading(false)
      await new Promise(r => setTimeout(r, 2200))
      await completePayment()
    }
  }

  const handleOtpSubmit = async () => {
    if (otp.length < 6) { setErrors({ otp: 'OTP kodni to\'liq kiriting' }); return }
    setErrors({})
    setStep('processing')
    await new Promise(r => setTimeout(r, 1500))
    await completePayment()
  }

  const completePayment = async () => {
    try {
      const { data } = await paymentsAPI.subscribe({ plan_id: plan.id, payment_method: method })
      const txId = 'TXN' + Date.now().toString().slice(-8).toUpperCase()
      setReceiptData({
        txId,
        plan: plan.name,
        amount: Number(plan.price_uzs).toLocaleString('uz-UZ'),
        method: m.label,
        card: maskCard(cardNumber),
        date: new Date().toLocaleString('uz-UZ'),
        subscription: data.subscription,
      })
      setStep('receipt')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Xatolik yuz berdi')
      setStep('card')
    }
  }

  const handleConfirmReceipt = () => {
    setStep('success')
    setTimeout(() => { onSuccess() }, 2500)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={e => e.target === e.currentTarget && step !== 'processing' && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        {/* Header */}
        {step !== 'success' && step !== 'processing' && (
          <div className={`flex items-center justify-between px-6 py-4 ${m.color} text-white`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{m.emoji}</span>
              <div>
                <div className="font-bold">{m.label} orqali to'lov</div>
                <div className="text-white/80 text-xs">{plan.name} · {Number(plan.price_uzs).toLocaleString('uz-UZ')} so'm</div>
              </div>
            </div>
            {step !== 'receipt' && (
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* ── Karta ma'lumotlari ── */}
            {step === 'card' && (
              <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-bold text-gray-900 mb-5">
                  {m.needsExpiry ? 'Karta ma\'lumotlarini kiriting' : 'Karta raqamini kiriting'}
                </h3>

                {/* Karta preview */}
                <div className={`${m.color} rounded-2xl p-5 text-white mb-5 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                  <div className="text-xs text-white/70 mb-3">{m.label} Plastik karta</div>
                  <div className="font-mono text-lg font-bold tracking-widest mb-4">
                    {cardDigits.length > 0 ? formatCard(cardNumber) || '#### #### #### ####' : '#### #### #### ####'}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {m.needsExpiry && (
                        <div className="text-xs text-white/70">Amal qilish muddati<br />
                          <span className="font-bold text-base">{expiry || 'MM/YY'}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-3xl">{m.emoji}</span>
                  </div>
                </div>

                {/* Card number input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Karta raqami</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={e => {
                      setCardNumber(formatCard(e.target.value))
                      setErrors({})
                    }}
                    className={`input-field font-mono text-lg tracking-widest ${errors.card ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                    maxLength={19}
                  />
                  {errors.card && <p className="text-red-500 text-xs mt-1">{errors.card}</p>}
                  {!m.needsExpiry && (
                    <p className="text-xs text-gray-400 mt-1">
                      {method === 'uzcard' ? 'UzCard: 8600 bilan boshlanadigan karta' : 'Humo: 9860 bilan boshlanadigan karta'}
                    </p>
                  )}
                </div>

                {/* Expiry (Payme/Click uchun) */}
                {m.needsExpiry && (
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amal qilish muddati</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={e => {
                        setExpiry(formatExpiry(e.target.value))
                        setErrors({})
                      }}
                      className={`input-field w-36 font-mono text-lg ${errors.expiry ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                      maxLength={5}
                    />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
                  <LockClosedIcon className="w-4 h-4 text-green-500" />
                  256-bit SSL shifrlash bilan himoyalangan
                </div>

                <button onClick={handleCardSubmit} disabled={loading || cardDigits.length < 16} className="btn-primary w-full py-3 disabled:opacity-50">
                  {loading ? <Spinner size="sm" className="mx-auto" /> : m.needsExpiry ? 'To\'lovni amalga oshirish →' : 'SMS kod olish →'}
                </button>
              </motion.div>
            )}

            {/* ── OTP (UzCard/Humo) ── */}
            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">📱</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">SMS kod tasdiqlash</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Kartangizga bog'liq telefonga 6 xonali kod yuborildi
                  </p>
                  <p className="text-gray-700 font-mono font-bold mt-2">{maskCard(cardNumber)}</p>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">OTP kodni kiriting</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="• • • • • •"
                    maxLength={6}
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}) }}
                    className={`input-field text-center font-mono text-2xl tracking-[0.5em] ${errors.otp ? 'border-red-400' : ''}`}
                    autoFocus
                  />
                  {errors.otp && <p className="text-red-500 text-xs mt-1 text-center">{errors.otp}</p>}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5 text-xs text-yellow-700 text-center">
                  Demo rejim: istalgan 6 ta raqam kiriting
                </div>

                <button onClick={handleOtpSubmit} disabled={otp.length < 6} className="btn-primary w-full py-3 disabled:opacity-50">
                  Tasdiqlash
                </button>
                <button onClick={() => setStep('card')} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3">
                  ← Orqaga
                </button>
              </motion.div>
            )}

            {/* ── Processing ── */}
            {step === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className={`w-20 h-20 rounded-full ${m.color} opacity-20 animate-ping absolute`} />
                  <div className={`w-20 h-20 rounded-full ${m.color} flex items-center justify-center relative text-white text-3xl`}>
                    {m.emoji}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">To'lov amalga oshirilmoqda...</h3>
                <p className="text-gray-500 text-sm">Iltimos, kuting. Sahifani yopmang.</p>
                <div className="mt-6 flex justify-center gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${m.color} animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Chek / Receipt ── */}
            {step === 'receipt' && receiptData && (
              <motion.div key="receipt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-5">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">To'lov cheki</h3>
                  <p className="text-gray-500 text-xs">Tekshirib tasdiqlang</p>
                </div>

                {/* Chek dizayni */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden mb-5">
                  {/* Chek header */}
                  <div className={`${m.color} text-white px-5 py-3 text-center`}>
                    <div className="font-bold text-lg">CERTIFY.UZ</div>
                    <div className="text-white/80 text-xs">To'lov cheki</div>
                  </div>

                  {/* Chek body */}
                  <div className="px-5 py-4 space-y-3 bg-white">
                    {[
                      { label: 'Tranzaksiya ID', value: receiptData.txId, mono: true },
                      { label: 'Sana va vaqt', value: receiptData.date },
                      { label: "To'lov usuli", value: `${m.emoji} ${receiptData.method}` },
                      { label: 'Karta', value: receiptData.card, mono: true },
                      { label: 'Xizmat', value: `Certify.uz — ${receiptData.plan}` },
                    ].map(row => (
                      <div key={row.label} className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-gray-500 flex-shrink-0">{row.label}</span>
                        <span className={`font-medium text-gray-900 text-right ${row.mono ? 'font-mono' : ''}`}>{row.value}</span>
                      </div>
                    ))}

                    <div className="border-t border-dashed border-gray-200 pt-3 mt-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">Jami to'lov</span>
                        <span className="font-extrabold text-xl text-gray-900">{receiptData.amount} <span className="text-base font-normal">so'm</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Chek footer */}
                  <div className="bg-green-50 px-5 py-3 flex items-center justify-center gap-2 border-t border-green-100">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold text-sm">To'lov tasdiqlandi ✓</span>
                  </div>

                  {/* Chek tishli chekkasi */}
                  <div className="flex justify-between px-4 -mt-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-gray-100 -mb-1.5" />
                    ))}
                  </div>
                </div>

                <button onClick={handleConfirmReceipt} className="btn-primary w-full py-3 text-base">
                  ✅ Tasdiqlash va davom etish
                </button>
              </motion.div>
            )}

            {/* ── Muvaffaqiyat ── */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
                >
                  <CheckIcon className="w-14 h-14 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Muvaffaqiyatli! 🎉</h2>
                <p className="text-gray-500 mb-2">Obunangiz faollashtirildi</p>
                <p className="text-primary-600 font-semibold">{plan.name} obunasi</p>
                <p className="text-xs text-gray-400 mt-4">Dashboard ga yo'naltirilmoqda...</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Asosiy sahifa ─────────────────────────────────────────────────────────────
export default function Pricing() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState('payme')
  const [paymentModal, setPaymentModal] = useState(null) // { plan }
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    paymentsAPI.getPlans()
      .then(({ data }) => setPlans(data.results || data))
      .catch(() => toast.error('Rejalarni yuklashda xatolik'))
      .finally(() => setLoading(false))

    if (searchParams.get('payment') === 'success') {
      toast.success('To\'lov muvaffaqiyatli amalga oshirildi! 🎉')
    }
  }, [])

  const handleSubscribe = (plan) => {
    if (!isAuthenticated) {
      toast('Obuna uchun avval kiring!', { icon: '🔐' })
      navigate('/login')
      return
    }
    if (plan.plan_type === 'free') return
    setPaymentModal({ plan })
  }

  const handlePaymentSuccess = () => {
    setPaymentModal(null)
    toast.success('Obuna muvaffaqiyatli faollashtirildi! 🎉')
    navigate('/dashboard')
  }

  const formatPrice = (price) => Number(price).toLocaleString('uz-UZ')

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {paymentModal && (
          <PaymentModal
            plan={paymentModal.plan}
            method={selectedMethod}
            onClose={() => setPaymentModal(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-purple-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-3">💎 Narxlar va Obuna</h1>
          <p className="text-primary-200 text-lg">Bepuldan boshlang. Tayyor bo'lganda Premium oling!</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* To'lov usuli */}
        <div className="mb-10">
          <h3 className="font-semibold text-gray-900 text-center mb-4">To'lov usulini tanlang</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  selectedMethod === m.id
                    ? 'border-primary-600 bg-primary-50 shadow-md scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className="text-sm font-bold">{m.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {m.needsExpiry ? 'Karta + muddati' : 'Karta + OTP'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Rejalar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card p-6 relative flex flex-col ${
                plan.is_popular ? 'border-2 border-primary-500 lg:scale-105' : ''
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  🔥 Eng mashhur
                </div>
              )}

              <div className="text-3xl mb-3">{PLAN_ICONS[plan.plan_type]}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

              <div className="mb-4">
                {plan.plan_type === 'free' ? (
                  <div className="text-3xl font-extrabold text-gray-900">Bepul</div>
                ) : (
                  <>
                    <div className="text-3xl font-extrabold text-gray-900">
                      {formatPrice(plan.price_uzs)}
                      <span className="text-base font-normal text-gray-500"> so'm</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {plan.duration_days} kun
                    </div>
                    {plan.discount_percent > 0 && (
                      <span className="inline-block badge bg-green-100 text-green-700 text-xs mt-1">
                        {plan.discount_percent}% tejash
                      </span>
                    )}
                  </>
                )}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={user?.is_premium && plan.plan_type !== 'free'}
                className={`w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                  plan.plan_type === 'free'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-default'
                    : plan.is_popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.plan_type === 'free'
                  ? isAuthenticated ? '✓ Faol' : 'Bepul boshlash'
                  : user?.is_premium
                  ? '✓ Faol obuna'
                  : `${PAYMENT_METHODS.find(m => m.id === selectedMethod)?.emoji} Obuna bo'lish`
                }
              </button>
            </motion.div>
          ))}
        </div>

        {/* To'lov xavfsizligi */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-green-500" />
            SSL bilan himoyalangan
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
            Ma'lumotlaringiz xavfsiz
          </div>
          <div className="flex items-center gap-2">
            <span>💳</span>
            Payme · Click · UzCard · Humo
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Ko'p beriladigan savollar</h2>
          {[
            { q: 'To\'lov qanday amalga oshiriladi?', a: 'Karta turini tanlab, "Obuna bo\'lish" tugmasini bosing. Karta raqamingizni kiriting, SMS orqali tasdiqlang. To\'lov cheki ko\'rsatiladi va siz tasdiqlaysiz.' },
            { q: 'UzCard va Humo orqali to\'lov xavfsizmi?', a: 'Ha, barcha to\'lovlar SSL shifrlash bilan himoyalangan. Karta ma\'lumotlaringiz saqlanmaydi.' },
            { q: 'Premium obunani bekor qila olamanmi?', a: 'Ha, istalgan vaqtda profilingiz orqali bekor qilishingiz mumkin. Muddati tugaguncha barcha imkoniyatlar saqlanadi.' },
            { q: 'Pulim qaytarib beriladimi?', a: '7 kun ichida xizmat mos kelmasa, to\'liq qaytariladi. support@certify.uz ga yozing.' },
          ].map(({ q, a }, i) => (
            <div key={i} className="card p-5 mb-3">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-gray-600 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
