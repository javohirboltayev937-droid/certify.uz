'use client'
import { useState, useEffect } from 'react'
import { paymentsAPI } from '@/lib/api'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckIcon, ShieldCheckIcon, LockClosedIcon, XMarkIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const PLAN_ICONS = {
  free:      { icon: BookIcon,     label: 'Bepul' },
  monthly:   { icon: CalIcon,      label: 'Oylik' },
  quarterly: { icon: FlameIcon,    label: '3 oylik' },
  annual:    { icon: StarIconC,    label: 'Yillik' },
}

function BookIcon(p) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> }
function CalIcon(p)  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> }
function FlameIcon(p){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/></svg> }
function StarIconC(p){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }

const PAYMENT_METHODS = [
  { id: 'payme',  label: 'Payme',  color: 'bg-blue-600',    needsExpiry: true },
  { id: 'click',  label: 'Click',  color: 'bg-green-600',   needsExpiry: true },
  { id: 'uzcard', label: 'UzCard', color: 'bg-emerald-600', needsExpiry: false },
  { id: 'humo',   label: 'Humo',   color: 'bg-red-600',     needsExpiry: false },
]

function formatCard(val)   { return val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim() }
function formatExpiry(val) { const d=val.replace(/\D/g,'').slice(0,4); return d.length>=3?d.slice(0,2)+'/'+d.slice(2):d }
function maskCard(num)     { const d=num.replace(/\s/g,''); return d.slice(0,4)+' **** **** '+d.slice(-4) }

function PaymentModal({ plan, method, onClose, onSuccess }) {
  const [step, setStep] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [errors, setErrors] = useState({})
  const m = PAYMENT_METHODS.find(x => x.id === method)
  const cardDigits = cardNumber.replace(/\s/g,'')

  const validateCard = () => {
    const errs = {}
    if (cardDigits.length !== 16) errs.card = "Karta raqami 16 ta raqamdan iborat bo'lishi kerak"
    if (m.needsExpiry && expiry.length < 5) errs.expiry = "Muddatni to'liq kiriting (MM/YY)"
    setErrors(errs)
    return !Object.keys(errs).length
  }

  const handleCardSubmit = async () => {
    if (!validateCard()) return
    setLoading(true)
    if (!m.needsExpiry) {
      await new Promise(r => setTimeout(r, 800))
      setStep('otp'); setLoading(false)
    } else {
      setStep('processing'); setLoading(false)
      await new Promise(r => setTimeout(r, 2200))
      await completePayment()
    }
  }

  const handleOtpSubmit = async () => {
    if (otp.length < 6) { setErrors({ otp: "OTP kodni to'liq kiriting" }); return }
    setErrors({})
    setStep('processing')
    await new Promise(r => setTimeout(r, 1500))
    await completePayment()
  }

  const completePayment = async () => {
    try {
      await paymentsAPI.subscribe({ plan_id: plan.id, payment_method: method })
      setReceiptData({
        txId: 'TXN' + Date.now().toString().slice(-8).toUpperCase(),
        plan: plan.name,
        amount: Number(plan.price_uzs || plan.price || 0).toLocaleString('uz-UZ'),
        method: m.label,
        card: maskCard(cardNumber),
        date: new Date().toLocaleString('uz-UZ'),
      })
      setStep('receipt')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Xatolik yuz berdi')
      setStep('card')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={e => e.target === e.currentTarget && step !== 'processing' && onClose()}>
      <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:20 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">

        {step !== 'success' && step !== 'processing' && (
          <div className={`flex items-center justify-between px-6 py-4 ${m.color} text-white`}>
            <div className="flex items-center gap-3">
              <CreditCardIcon className="w-6 h-6" />
              <div>
                <div className="font-bold">{m.label} orqali to'lov</div>
                <div className="text-white/80 text-xs">{plan.name} · {Number(plan.price_uzs || plan.price || 0).toLocaleString('uz-UZ')} so'm</div>
              </div>
            </div>
            {step !== 'receipt' && <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><XMarkIcon className="w-5 h-5" /></button>}
          </div>
        )}

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Card step */}
            {step === 'card' && (
              <motion.div key="card" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <h3 className="font-bold text-gray-900 mb-5">{m.needsExpiry ? "Karta ma'lumotlarini kiriting" : 'Karta raqamini kiriting'}</h3>

                {/* Card preview */}
                <div className={`${m.color} rounded-2xl p-5 text-white mb-5 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                  <div className="text-xs text-white/70 mb-3">{m.label} Plastik karta</div>
                  <div className="font-mono text-lg font-bold tracking-widest mb-4">
                    {cardDigits.length > 0 ? formatCard(cardNumber) : '#### #### #### ####'}
                  </div>
                  <div className="flex items-center justify-between">
                    {m.needsExpiry && <div className="text-xs text-white/70">Amal qilish muddati<br /><span className="font-bold text-base">{expiry || 'MM/YY'}</span></div>}
                    <CreditCardIcon className="w-8 h-8 text-white/60 ml-auto" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="label">Karta raqami</label>
                  <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={cardNumber}
                    onChange={e => { setCardNumber(formatCard(e.target.value)); setErrors({}) }}
                    className={`input font-mono text-lg tracking-widest ${errors.card ? 'border-red-400' : ''}`} maxLength={19} />
                  {errors.card && <p className="text-red-500 text-xs mt-1">{errors.card}</p>}
                </div>

                {m.needsExpiry && (
                  <div className="mb-5">
                    <label className="label">Amal qilish muddati</label>
                    <input type="text" inputMode="numeric" placeholder="MM/YY" value={expiry}
                      onChange={e => { setExpiry(formatExpiry(e.target.value)); setErrors({}) }}
                      className={`input w-36 font-mono text-lg ${errors.expiry ? 'border-red-400' : ''}`} maxLength={5} />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
                  <LockClosedIcon className="w-4 h-4 text-green-500" /> 256-bit SSL shifrlash bilan himoyalangan
                </div>
                <button onClick={handleCardSubmit} disabled={loading || cardDigits.length < 16} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
                  {loading ? 'Yuklanmoqda...' : m.needsExpiry ? "To'lovni amalga oshirish →" : 'SMS kod olish →'}
                </button>
              </motion.div>
            )}

            {/* OTP step */}
            {step === 'otp' && (
              <motion.div key="otp" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">SMS kod tasdiqlash</h3>
                  <p className="text-gray-500 text-sm mt-1">Kartangizga bog'liq telefonga 6 xonali kod yuborildi</p>
                  <p className="text-gray-700 font-mono font-bold mt-2">{maskCard(cardNumber)}</p>
                </div>
                <div className="mb-5">
                  <label className="label text-center block">OTP kodni kiriting</label>
                  <input type="text" inputMode="numeric" placeholder="• • • • • •" maxLength={6} value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g,'').slice(0,6)); setErrors({}) }}
                    className={`input text-center font-mono text-2xl tracking-[0.5em] ${errors.otp ? 'border-red-400' : ''}`} autoFocus />
                  {errors.otp && <p className="text-red-500 text-xs mt-1 text-center">{errors.otp}</p>}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5 text-xs text-yellow-700 text-center">
                  Demo rejim: istalgan 6 ta raqam kiriting
                </div>
                <button onClick={handleOtpSubmit} disabled={otp.length < 6} className="btn-primary w-full justify-center py-3 disabled:opacity-50">Tasdiqlash</button>
                <button onClick={() => setStep('card')} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3">← Orqaga</button>
              </motion.div>
            )}

            {/* Processing */}
            {step === 'processing' && (
              <motion.div key="processing" initial={{opacity:0}} animate={{opacity:1}} className="py-10 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className={`w-20 h-20 rounded-full ${m.color} opacity-20 animate-ping absolute`} />
                  <div className={`w-20 h-20 rounded-full ${m.color} flex items-center justify-center relative`}>
                    <CreditCardIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">To'lov amalga oshirilmoqda...</h3>
                <p className="text-gray-500 text-sm">Iltimos, kuting. Sahifani yopmang.</p>
                <div className="mt-6 flex justify-center gap-1">
                  {[0,1,2].map(i => <div key={i} className={`w-2 h-2 rounded-full ${m.color} animate-bounce`} style={{ animationDelay: `${i*0.15}s` }} />)}
                </div>
              </motion.div>
            )}

            {/* Receipt */}
            {step === 'receipt' && receiptData && (
              <motion.div key="receipt" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
                <div className="text-center mb-5">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">To'lov cheki</h3>
                  <p className="text-gray-500 text-xs">Tekshirib tasdiqlang</p>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden mb-5">
                  <div className={`${m.color} text-white px-5 py-3 text-center`}>
                    <div className="font-bold text-lg">CERTIFY.UZ</div>
                    <div className="text-white/80 text-xs">To'lov cheki</div>
                  </div>
                  <div className="px-5 py-4 space-y-3 bg-white">
                    {[
                      { label: 'Tranzaksiya ID', value: receiptData.txId, mono: true },
                      { label: 'Sana va vaqt',  value: receiptData.date },
                      { label: "To'lov usuli",  value: receiptData.method },
                      { label: 'Karta',         value: receiptData.card, mono: true },
                      { label: 'Xizmat',        value: `Certify.uz — ${receiptData.plan}` },
                    ].map(row => (
                      <div key={row.label} className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-gray-500 flex-shrink-0">{row.label}</span>
                        <span className={`font-medium text-gray-900 text-right ${row.mono ? 'font-mono' : ''}`}>{row.value}</span>
                      </div>
                    ))}
                    <div className="border-t border-dashed border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">Jami to'lov</span>
                        <span className="font-extrabold text-xl text-gray-900">{receiptData.amount} <span className="text-base font-normal">so'm</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 px-5 py-3 flex items-center justify-center gap-2 border-t border-green-100">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold text-sm">To'lov tasdiqlandi</span>
                  </div>
                  <div className="flex justify-between px-4">
                    {Array.from({ length: 16 }).map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-gray-100 -mb-1.5" />)}
                  </div>
                </div>
                <button onClick={() => { setStep('success'); setTimeout(onSuccess, 2500) }} className="btn-primary w-full justify-center py-3 text-base">
                  Tasdiqlash va davom etish
                </button>
              </motion.div>
            )}

            {/* Success */}
            {step === 'success' && (
              <motion.div key="success" initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} className="py-8 text-center">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200,delay:0.1}}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckIcon className="w-14 h-14 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Muvaffaqiyatli!</h2>
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

export default function Pricing() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState('payme')
  const [paymentModal, setPaymentModal] = useState(null)
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const router = useRouter()

  useEffect(() => {
    paymentsAPI.getPlans()
      .then(r => setPlans(r.data?.results || r.data || []))
      .catch(() => toast.error('Rejalarni yuklashda xatolik'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubscribe = (plan) => {
    if (!isAuthenticated) { toast("Obuna uchun avval kiring!", { icon: '🔐' }); router.push('/login'); return }
    if (plan.plan_type === 'free') return
    setPaymentModal({ plan })
  }

  const handlePaymentSuccess = () => {
    setPaymentModal(null)
    toast.success("Obuna muvaffaqiyatli faollashtirildi!")
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {paymentModal && (
          <PaymentModal plan={paymentModal.plan} method={selectedMethod}
            onClose={() => setPaymentModal(null)} onSuccess={handlePaymentSuccess} />
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-br from-primary-900 to-purple-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-3 flex items-center justify-center gap-3">
            <ShieldCheckIcon className="w-10 h-10 text-yellow-400" /> Narxlar va Obuna
          </h1>
          <p className="text-primary-200 text-lg">Bepuldan boshlang. Tayyor bo'lganda Premium oling!</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Payment method selector */}
        <div className="mb-10">
          <h3 className="font-semibold text-gray-900 text-center mb-4">To'lov usulini tanlang</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  selectedMethod === m.id ? 'border-primary-600 bg-primary-50 shadow-md scale-105' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                <div className={`w-10 h-6 ${m.color} rounded flex items-center justify-center mx-auto mb-2`}>
                  <CreditCardIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold">{m.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.needsExpiry ? 'Karta + muddati' : 'Karta + OTP'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="card p-6 animate-pulse h-72"><div className="h-6 bg-gray-100 rounded mb-4 w-1/2" /><div className="h-10 bg-gray-100 rounded mb-3" /><div className="space-y-2">{[...Array(4)].map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded" />)}</div></div>)}
          </div>
        ) : plans.length === 0 ? (
          <FallbackPlans selectedMethod={selectedMethod} isAuthenticated={isAuthenticated} user={user} onSubscribe={handleSubscribe} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
                className={`card p-6 relative flex flex-col ${plan.is_popular ? 'border-2 border-primary-500 lg:scale-105' : ''}`}>
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Eng mashhur
                  </div>
                )}
                <div className="text-3xl font-bold text-primary-600 mb-3">
                  {plan.plan_type === 'free' ? 'F' : plan.plan_type === 'monthly' ? 'M' : plan.plan_type === 'quarterly' ? 'Q' : 'Y'}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="mb-4">
                  {plan.plan_type === 'free' ? (
                    <div className="text-3xl font-extrabold text-gray-900">Bepul</div>
                  ) : (
                    <>
                      <div className="text-3xl font-extrabold text-gray-900">
                        {Number(plan.price_uzs || plan.price || 0).toLocaleString()}
                        <span className="text-base font-normal text-gray-500"> so'm</span>
                      </div>
                      {plan.duration_days && <div className="text-sm text-gray-500">{plan.duration_days} kun</div>}
                      {plan.discount_percent > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">{plan.discount_percent}% tejash</span>
                      )}
                    </>
                  )}
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {(plan.features || []).map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleSubscribe(plan)} disabled={user?.is_premium && plan.plan_type !== 'free'}
                  className={`w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                    plan.plan_type === 'free' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' :
                    plan.is_popular ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg' : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}>
                  {plan.plan_type === 'free' ? (isAuthenticated ? 'Faol' : 'Bepul boshlash') : user?.is_premium ? 'Faol obuna' : 'Obuna bo\'lish'}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Security */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2"><LockClosedIcon className="w-5 h-5 text-green-500" /> SSL bilan himoyalangan</div>
          <div className="flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5 text-blue-500" /> Ma'lumotlaringiz xavfsiz</div>
          <div className="flex items-center gap-2"><CreditCardIcon className="w-5 h-5 text-gray-400" /> Payme · Click · UzCard · Humo</div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Ko'p beriladigan savollar</h2>
          {[
            { q: "To'lov qanday amalga oshiriladi?",                a: "Karta turini tanlab, \"Obuna bo'lish\" tugmasini bosing. Karta raqamingizni kiriting, SMS orqali tasdiqlang. To'lov cheki ko'rsatiladi." },
            { q: 'UzCard va Humo orqali to\'lov xavfsizmi?',        a: "Ha, barcha to'lovlar SSL shifrlash bilan himoyalangan. Karta ma'lumotlaringiz saqlanmaydi." },
            { q: 'Premium obunani bekor qila olamanmi?',            a: "Ha, istalgan vaqtda profilingiz orqali bekor qilishingiz mumkin." },
            { q: 'Pulim qaytarib beriladimi?',                      a: "7 kun ichida xizmat mos kelmasa, to'liq qaytariladi. support@certify.uz ga yozing." },
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

function FallbackPlans({ selectedMethod, isAuthenticated, user, onSubscribe }) {
  const PLANS = [
    { id: 1, name: "Boshlang'ich", plan_type: 'free',      price_uzs: 0,       is_popular: false, features: ['2 ta mock test', 'Asosiy materiallar', 'Progress grafigi'] },
    { id: 2, name: 'Pro',          plan_type: 'monthly',   price_uzs: 79000,   is_popular: true,  duration_days: 30,  features: ['Cheksiz testlar', 'AI savollar', 'Batafsil tahlil', 'Barcha imtihon turlari'] },
    { id: 3, name: 'Premium',      plan_type: 'quarterly', price_uzs: 199000,  is_popular: false, duration_days: 90,  features: ['Hamma Pro imkoniyatlar', 'Jonli darslar', 'Shaxsiy murabbiy'], discount_percent: 15 },
    { id: 4, name: 'Elite',        plan_type: 'annual',    price_uzs: 599000,  is_popular: false, duration_days: 365, features: ['Hammasi', 'Kafolatlangan natija', 'Maxsus sertifikat'], discount_percent: 37 },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {PLANS.map((plan, i) => (
        <motion.div key={plan.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
          className={`card p-6 relative flex flex-col ${plan.is_popular ? 'border-2 border-primary-500 lg:scale-105' : ''}`}>
          {plan.is_popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              Eng mashhur
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
          <div className="mb-4">
            {plan.plan_type === 'free' ? (
              <div className="text-3xl font-extrabold text-gray-900">Bepul</div>
            ) : (
              <>
                <div className="text-3xl font-extrabold text-gray-900">
                  {Number(plan.price_uzs).toLocaleString()}<span className="text-base font-normal text-gray-500"> so'm</span>
                </div>
                <div className="text-sm text-gray-500">{plan.duration_days} kun</div>
                {plan.discount_percent > 0 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">{plan.discount_percent}% tejash</span>}
              </>
            )}
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {plan.features.map((f, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
          <button onClick={() => onSubscribe(plan)}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              plan.plan_type === 'free' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' :
              plan.is_popular ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}>
            {plan.plan_type === 'free' ? (isAuthenticated ? 'Faol' : 'Bepul boshlash') : "Obuna bo'lish"}
          </button>
        </motion.div>
      ))}
    </div>
  )
}
