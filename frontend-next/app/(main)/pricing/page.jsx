'use client'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckIcon, XMarkIcon, ShieldCheckIcon, LockClosedIcon,
  CreditCardIcon, SparklesIcon, BoltIcon, TrophyIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

/* ─── Rejalar ───────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    badge: null,
    color: '#64748b',
    glow: 'rgba(100,116,139,0.25)',
    border: 'rgba(100,116,139,0.2)',
    bg: 'rgba(100,116,139,0.06)',
    icon: '🌱',
    desc: 'Boshlash uchun tekin',
    features: [
      { text: 'CEFR Mock Test (2 marta/oy)',      yes: true },
      { text: 'DTM Test (3 marta/oy)',             yes: true },
      { text: 'Milliy sertifikat ma\'lumotlari',   yes: true },
      { text: 'Asosiy progress grafigi',           yes: true },
      { text: 'Cheksiz testlar',                   yes: false },
      { text: 'Batafsil tahlil va statistika',     yes: false },
      { text: 'Telegram sertifikat',               yes: false },
      { text: 'AI savol generatsiyasi',            yes: false },
      { text: 'Shaxsiy murabbiy',                  yes: false },
    ],
    cta: 'Bepul boshlash',
    ctaActive: 'Faol tarif',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 7,
    badge: 'Eng mashhur',
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.4)',
    border: 'rgba(139,92,246,0.5)',
    bg: 'rgba(124,58,237,0.1)',
    icon: '⚡',
    desc: 'Jiddiy tayyorgarlik uchun',
    features: [
      { text: 'Cheksiz CEFR Mock Testlar',        yes: true },
      { text: 'Cheksiz DTM Testlar',              yes: true },
      { text: 'Milliy sertifikat ma\'lumotlari',  yes: true },
      { text: 'Batafsil progress va statistika',  yes: true },
      { text: 'Cheksiz testlar',                  yes: true },
      { text: 'Batafsil tahlil va statistika',    yes: true },
      { text: 'Telegram sertifikat (avtomatik)',  yes: true },
      { text: 'AI savol generatsiyasi',           yes: true },
      { text: 'Shaxsiy murabbiy',                 yes: false },
    ],
    cta: "Pro obunasi — $7/oy",
    ctaActive: 'Pro faol',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 15,
    badge: 'Premium',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    border: 'rgba(245,158,11,0.4)',
    bg: 'rgba(245,158,11,0.08)',
    icon: '👑',
    desc: "To'liq imkoniyatlar to'plami",
    features: [
      { text: 'Cheksiz CEFR Mock Testlar',        yes: true },
      { text: 'Cheksiz DTM Testlar',              yes: true },
      { text: 'Milliy sertifikat ma\'lumotlari',  yes: true },
      { text: 'Batafsil progress va statistika',  yes: true },
      { text: 'Cheksiz testlar',                  yes: true },
      { text: 'Batafsil tahlil va statistika',    yes: true },
      { text: 'Telegram sertifikat (avtomatik)',  yes: true },
      { text: 'AI savol generatsiyasi',           yes: true },
      { text: 'Shaxsiy murabbiy (1 sessiya/oy)', yes: true },
    ],
    cta: "Plus obunasi — $15/oy",
    ctaActive: 'Plus faol',
  },
]

const PAYMENT_METHODS = [
  { id:'payme',  label:'Payme',  color:'#2563eb', needsExpiry:true  },
  { id:'click',  label:'Click',  color:'#16a34a', needsExpiry:true  },
  { id:'uzcard', label:'UzCard', color:'#059669', needsExpiry:false },
  { id:'humo',   label:'Humo',   color:'#dc2626', needsExpiry:false },
]

function fmtCard(v)   { return v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim() }
function fmtExpiry(v) { const d=v.replace(/\D/g,'').slice(0,4); return d.length>=3?d.slice(0,2)+'/'+d.slice(2):d }
function maskCard(n)  { const d=n.replace(/\s/g,''); return d.slice(0,4)+' **** **** '+d.slice(-4) }

/* ─── Modal ─── */
function PaymentModal({ plan, method, onClose, onSuccess }) {
  const [step, setStep]   = useState('card')
  const [card, setCard]   = useState('')
  const [exp, setExp]     = useState('')
  const [otp, setOtp]     = useState('')
  const [loading, setLoad]= useState(false)
  const [receipt, setRcpt]= useState(null)
  const [errs, setErrs]   = useState({})
  const m = PAYMENT_METHODS.find(x => x.id === method)
  const digits = card.replace(/\s/g,'')

  const validateCard = () => {
    const e = {}
    if (digits.length !== 16) e.card = "16 ta raqam kiriting"
    if (m.needsExpiry && exp.length < 5) e.exp = "Muddatni kiriting (MM/YY)"
    setErrs(e); return !Object.keys(e).length
  }

  const submitCard = async () => {
    if (!validateCard()) return
    setLoad(true)
    if (!m.needsExpiry) {
      await new Promise(r => setTimeout(r, 700)); setStep('otp'); setLoad(false)
    } else {
      setStep('processing'); setLoad(false)
      await new Promise(r => setTimeout(r, 2000)); complete()
    }
  }

  const submitOtp = async () => {
    if (otp.length < 6) { setErrs({ otp:"6 ta raqam kiriting" }); return }
    setErrs({}); setStep('processing')
    await new Promise(r => setTimeout(r, 1500)); complete()
  }

  const complete = () => {
    setRcpt({
      txId: 'TXN'+Date.now().toString().slice(-8),
      plan: plan.name,
      amount: `$${plan.price}`,
      method: m.label,
      card: maskCard(card),
      date: new Date().toLocaleString('uz-UZ'),
    })
    setStep('receipt')
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
         style={{ background:'rgba(0,0,0,0.8)', backdropFilter:'blur(10px)' }}
         onClick={e => e.target===e.currentTarget && step!=='processing' && onClose()}>
      <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95 }} className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)' }}>

        {step !== 'processing' && step !== 'success' && (
          <div className="flex items-center justify-between px-6 py-4 text-white"
               style={{ background:`${m.color}dd`, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <CreditCardIcon className="w-5 h-5" />
              <div>
                <div className="font-bold text-sm">{m.label} orqali to'lov</div>
                <div className="text-white/70 text-xs">{plan.name} · ${plan.price}/oy</div>
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
            {step === 'card' && (
              <motion.div key="card" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <h3 className="font-bold text-white mb-5">Karta ma'lumotlarini kiriting</h3>
                {/* Virtual card */}
                <div className="rounded-2xl p-5 text-white mb-5 relative overflow-hidden"
                     style={{ background:`linear-gradient(135deg,${m.color},${m.color}88)` }}>
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full -translate-y-8 translate-x-8 bg-white/10" />
                  <div className="text-xs text-white/60 mb-3">{m.label}</div>
                  <div className="font-mono text-lg font-bold tracking-widest mb-4">
                    {digits.length>0 ? fmtCard(card) : '#### #### #### ####'}
                  </div>
                  <div className="flex items-center justify-between">
                    {m.needsExpiry && (
                      <div className="text-xs text-white/60">Muddat<br/>
                        <span className="font-bold text-base">{exp||'MM/YY'}</span>
                      </div>
                    )}
                    <CreditCardIcon className="w-7 h-7 text-white/50 ml-auto" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-slate-400 mb-1.5">Karta raqami</label>
                  <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={card}
                    onChange={e=>{setCard(fmtCard(e.target.value));setErrs({})}} maxLength={19}
                    className="w-full px-4 py-3 rounded-xl font-mono text-lg text-white tracking-widest focus:outline-none focus:ring-2"
                    style={{ background:'rgba(255,255,255,0.07)', border:`1px solid ${errs.card?'#ef4444':'rgba(255,255,255,0.12)'}`, focusRingColor:'#7c3aed' }} />
                  {errs.card && <p className="text-red-400 text-xs mt-1">{errs.card}</p>}
                </div>

                {m.needsExpiry && (
                  <div className="mb-5">
                    <label className="block text-xs text-slate-400 mb-1.5">Amal qilish muddati</label>
                    <input type="text" inputMode="numeric" placeholder="MM/YY" value={exp}
                      onChange={e=>{setExp(fmtExpiry(e.target.value));setErrs({})}} maxLength={5}
                      className="w-36 px-4 py-3 rounded-xl font-mono text-lg text-white focus:outline-none"
                      style={{ background:'rgba(255,255,255,0.07)', border:`1px solid ${errs.exp?'#ef4444':'rgba(255,255,255,0.12)'}` }} />
                    {errs.exp && <p className="text-red-400 text-xs mt-1">{errs.exp}</p>}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
                  <LockClosedIcon className="w-4 h-4 text-emerald-400" /> 256-bit SSL bilan himoyalangan
                </div>
                <button onClick={submitCard} disabled={loading||digits.length<16}
                  className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40"
                  style={{ background:`linear-gradient(135deg,${m.color},${m.color}88)` }}>
                  {loading ? 'Yuklanmoqda...' : m.needsExpiry ? "To'lovni amalga oshirish →" : 'SMS kod olish →'}
                </button>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                       style={{ background:'rgba(16,185,129,0.15)' }}>
                    <ShieldCheckIcon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white text-lg">SMS tasdiqlash</h3>
                  <p className="text-slate-400 text-sm mt-1">Kartangizga bog'liq telefonga kod yuborildi</p>
                  <p className="font-mono text-white font-bold mt-2">{maskCard(card)}</p>
                </div>
                <div className="mb-5">
                  <input type="text" inputMode="numeric" placeholder="• • • • • •" maxLength={6} value={otp}
                    onChange={e=>{setOtp(e.target.value.replace(/\D/g,'').slice(0,6));setErrs({})}} autoFocus
                    className="w-full px-4 py-4 rounded-xl font-mono text-2xl text-white text-center tracking-[0.5em] focus:outline-none"
                    style={{ background:'rgba(255,255,255,0.07)', border:`1px solid ${errs.otp?'#ef4444':'rgba(255,255,255,0.12)'}` }} />
                  {errs.otp && <p className="text-red-400 text-xs mt-1 text-center">{errs.otp}</p>}
                </div>
                <div className="rounded-xl p-3 mb-5 text-xs text-center"
                     style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)', color:'#fbbf24' }}>
                  Demo: istalgan 6 ta raqam kiriting
                </div>
                <button onClick={submitOtp} disabled={otp.length<6}
                  className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-40"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                  Tasdiqlash
                </button>
                <button onClick={()=>setStep('card')} className="w-full text-center text-sm text-slate-500 hover:text-slate-300 mt-3">
                  ← Orqaga
                </button>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div key="proc" initial={{opacity:0}} animate={{opacity:1}} className="py-12 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="w-20 h-20 rounded-full animate-ping absolute opacity-20" style={{ background:m.color }} />
                  <div className="w-20 h-20 rounded-full flex items-center justify-center relative" style={{ background:m.color }}>
                    <CreditCardIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">To'lov amalga oshirilmoqda...</h3>
                <p className="text-slate-400 text-sm">Iltimos, kuting. Sahifani yopmang.</p>
                <div className="mt-6 flex justify-center gap-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                         style={{ background:m.color, animationDelay:`${i*0.15}s` }} />
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'receipt' && receipt && (
              <motion.div key="rcpt" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
                <div className="text-center mb-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2"
                       style={{ background:'rgba(16,185,129,0.15)' }}>
                    <CheckIcon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white text-lg">To'lov cheki</h3>
                </div>
                <div className="rounded-2xl overflow-hidden mb-5"
                     style={{ border:'2px dashed rgba(255,255,255,0.12)' }}>
                  <div className="px-5 py-3 text-center text-white" style={{ background:m.color }}>
                    <div className="font-bold text-lg">CERTIFY.UZ</div>
                    <div className="text-white/70 text-xs">To'lov cheki</div>
                  </div>
                  <div className="px-5 py-4 space-y-3" style={{ background:'rgba(255,255,255,0.03)' }}>
                    {[
                      ['Tranzaksiya ID', receipt.txId, true],
                      ['Sana',           receipt.date, false],
                      ["To'lov usuli",   receipt.method, false],
                      ['Karta',          receipt.card, true],
                      ['Xizmat',         `Certify.uz ${receipt.plan}`, false],
                    ].map(([l,v,mono]) => (
                      <div key={l} className="flex justify-between gap-4 text-sm">
                        <span className="text-slate-500">{l}</span>
                        <span className={`font-medium text-white text-right ${mono?'font-mono':''}`}>{v}</span>
                      </div>
                    ))}
                    <div className="pt-3" style={{ borderTop:'1px dashed rgba(255,255,255,0.1)' }}>
                      <div className="flex justify-between">
                        <span className="font-bold text-white">Jami</span>
                        <span className="font-extrabold text-xl text-white">{receipt.amount}<span className="text-sm font-normal text-slate-400">/oy</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-3 flex items-center justify-center gap-2"
                       style={{ background:'rgba(16,185,129,0.1)', borderTop:'1px solid rgba(16,185,129,0.2)' }}>
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-sm">To'lov tasdiqlandi ✓</span>
                  </div>
                </div>
                <button onClick={()=>{ setStep('success'); setTimeout(onSuccess, 2000) }}
                  className="w-full py-3 rounded-xl font-bold text-white"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                  Davom etish
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="ok" initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} className="py-10 text-center">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200,delay:0.1}}
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background:'rgba(16,185,129,0.15)' }}>
                  <CheckIcon className="w-14 h-14 text-emerald-400" />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-white mb-2">Muvaffaqiyatli!</h2>
                <p className="text-slate-400 mb-2">Obunangiz faollashtirildi</p>
                <p className="font-semibold" style={{ color: plan.color }}>{plan.name} tarifi</p>
                <p className="text-xs text-slate-500 mt-4">Dashboard ga yo'naltirilmoqda...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

/* ════════════════ MAIN ════════════════ */
export default function PricingPage() {
  const [method, setMethod]   = useState('payme')
  const [modal, setModal]     = useState(null)
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const router = useRouter()

  const handleBuy = (plan) => {
    if (plan.id === 'free') return
    if (!isAuthenticated) {
      toast("Obuna uchun avval kiring!", { icon:'🔐' })
      router.push('/login')
      return
    }
    setModal(plan)
  }

  const handleSuccess = () => {
    setModal(null)
    toast.success("Obuna muvaffaqiyatli faollashtirildi!")
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen" style={{ background:'#020B18' }}>
      <AnimatePresence>
        {modal && (
          <PaymentModal plan={modal} method={method}
            onClose={() => setModal(null)} onSuccess={handleSuccess} />
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] opacity-20"
               style={{ background:'radial-gradient(circle,#7c3aed 0%,#2563eb 50%,transparent 80%)' }} />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
               style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', color:'#a78bfa' }}>
            <BoltIcon className="w-3.5 h-3.5" />
            Narxlar va Obuna
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            <span className="text-white">Bepuldan boshlang,</span>
            <br />
            <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage:'linear-gradient(135deg,#c4b5fd,#93c5fd)' }}>
              tayyor bo'lganda o'sib boring
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Har qanday maqsad uchun mos tarif. Istalgan vaqtda bekor qilish mumkin.
          </p>
        </div>
      </section>

      {/* Payment method */}
      <section className="px-4 mb-10">
        <div className="max-w-lg mx-auto">
          <p className="text-slate-500 text-sm text-center mb-3">To'lov usulini tanlang</p>
          <div className="grid grid-cols-4 gap-2">
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className="py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={method === m.id
                  ? { background:`${m.color}cc`, boxShadow:`0 0 20px ${m.color}55`, border:`1px solid ${m.color}` }
                  : { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#64748b' }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => {
            const isPopular = plan.id === 'pro'
            const isActive  = user?.is_premium && plan.id !== 'free'
            return (
              <motion.div key={plan.id}
                initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-3xl p-7 flex flex-col"
                style={{
                  background: isPopular ? plan.bg : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isPopular ? plan.border : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isPopular ? `0 0 60px ${plan.glow}` : '0 4px 24px rgba(0,0,0,0.3)',
                  transform: isPopular ? 'scale(1.04)' : 'scale(1)',
                }}>

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                       style={{ background: isPopular ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : `linear-gradient(135deg,${plan.color},${plan.color}99)` }}>
                    {isPopular && <span className="mr-1">⭐</span>}
                    {plan.badge}
                  </div>
                )}

                {/* Icon & name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                       style={{ background: `${plan.color}20`, border:`1px solid ${plan.color}35` }}>
                    {plan.icon}
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">{plan.name}</div>
                    <div className="text-xs text-slate-400">{plan.desc}</div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <div>
                      <span className="text-4xl font-black text-white">Bepul</span>
                      <div className="text-xs text-slate-500 mt-0.5">Hech qanday to'lovsiz</div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-black text-white">${plan.price}</span>
                        <span className="text-slate-400 mb-1">/oy</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Istalgan vaqtda bekor qilish mumkin</div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      {f.yes
                        ? <CheckIcon className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                        : <XMarkIcon className="w-4 h-4 flex-shrink-0 text-slate-700" />
                      }
                      <span className={f.yes ? 'text-slate-300' : 'text-slate-600 line-through'}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button onClick={() => handleBuy(plan)}
                  disabled={plan.price === 0 && isAuthenticated}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-default"
                  style={plan.id === 'free'
                    ? { background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color: isAuthenticated ? '#64748b' : 'white' }
                    : isPopular
                    ? { background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'white', boxShadow:'0 0 24px rgba(124,58,237,0.5)' }
                    : { background:`linear-gradient(135deg,${plan.color}cc,${plan.color}88)`, color:'white' }
                  }>
                  {plan.price === 0
                    ? (isAuthenticated ? '✓ Faol tarif' : plan.cta)
                    : (isActive ? plan.ctaActive : plan.cta)
                  }
                </button>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Tariflarni solishtirish</h2>
          <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
            {/* Header */}
            <div className="grid grid-cols-4 text-center text-sm font-bold"
                 style={{ background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="p-4 text-left text-slate-400">Xususiyat</div>
              {PLANS.map(p => (
                <div key={p.id} className="p-4" style={{ color: p.color }}>{p.name}</div>
              ))}
            </div>
            {/* Rows */}
            {[
              ["CEFR Mock Test",         "2/oy",    "Cheksiz",  "Cheksiz"],
              ["DTM Test",               "3/oy",    "Cheksiz",  "Cheksiz"],
              ["Milliy sertifikat",       "✓",       "✓",        "✓"],
              ["Batafsil statistika",     "—",       "✓",        "✓"],
              ["Telegram sertifikat",     "—",       "✓",        "✓"],
              ["AI savollar",             "—",       "✓",        "✓"],
              ["Shaxsiy murabbiy",        "—",       "—",        "1/oy"],
              ["Qo'llab-quvvatlash",      "Standart","Ustuvor",  "Premium"],
            ].map(([feature, f, p, pl]) => (
              <div key={feature} className="grid grid-cols-4 text-center text-sm border-t"
                   style={{ borderColor:'rgba(255,255,255,0.06)' }}>
                <div className="p-3.5 text-left text-slate-400">{feature}</div>
                {[f, p, pl].map((v, i) => (
                  <div key={i} className="p-3.5 font-medium"
                       style={{ color: v==='—' ? '#334155' : v==='✓' || v!=='—' ? PLANS[i+1]?.color || '#64748b' : '#334155' }}>
                    {v}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security strip */}
      <section className="pb-12 px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2"><LockClosedIcon className="w-4 h-4 text-emerald-400" /> SSL himoya</div>
          <div className="flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4 text-blue-400" /> Ma'lumotlar xavfsiz</div>
          <div className="flex items-center gap-2"><CreditCardIcon className="w-4 h-4 text-slate-600" /> Payme · Click · UzCard · Humo</div>
          <div className="flex items-center gap-2"><TrophyIcon className="w-4 h-4 text-amber-400" /> 7 kun qaytarish kafolati</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white text-center mb-6">Ko'p beriladigan savollar</h2>
          <div className="space-y-3">
            {[
              ["Narxlar qanday valyutada?",         "$7 va $15 USD hisobida. To'lov paytida so'm ekvivalentida qayta hisob qilinadi."],
              ["Obunani bekor qila olamanmi?",      "Ha, istalgan vaqtda profilingiz orqali bir bosish bilan bekor qilishingiz mumkin."],
              ["Pul qaytarib beriladimi?",           "Ha! Birinchi 7 kun ichida mos kelmasa, to'liq qaytariladi. support@certify.uz ga yozing."],
              ["Free tarif abadiy bepulmi?",         "Ha. Free tarif hech qachon to'lanmaydi — lekin foydalanish chegaralari qo'llaniladi."],
            ].map(([q, a]) => (
              <div key={q} className="rounded-xl p-5"
                   style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="font-semibold text-white text-sm mb-2">{q}</h3>
                <p className="text-slate-400 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
