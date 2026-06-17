'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ShieldCheckIcon, QrCodeIcon, DocumentCheckIcon, ChartBarIcon,
  LockClosedIcon, GlobeAltIcon, BoltIcon, CodeBracketIcon,
  CheckCircleIcon, ArrowRightIcon, CpuChipIcon,
  BuildingLibraryIcon, MagnifyingGlassIcon, EnvelopeIcon,
  MapPinIcon, AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid'

/* ─── Loader ─── */
function Loader({ done }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500"
      style={{
        background: '#030410',
        opacity: done ? 0 : 1,
        visibility: done ? 'hidden' : 'visible',
      }}
    >
      <div
        className="w-16 h-16 rounded-full"
        style={{
          border: '3px solid rgba(255,255,255,0.07)',
          borderTopColor: '#7c3aed',
          borderRightColor: '#06b6d4',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p
        className="mt-5 text-xs tracking-[4px] uppercase"
        style={{ color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}
      >
        Yuklanmoqda...
      </p>
    </div>
  )
}

/* ─── Typed text ─── */
function TypedText({ words }) {
  const [display, setDisplay] = useState('')
  const [wIdx, setWIdx] = useState(0)
  const [cIdx, setCIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wIdx]
    const speed = deleting ? 50 : 90
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, cIdx + 1))
        if (cIdx + 1 === word.length) {
          setTimeout(() => setDeleting(true), 1400)
        } else {
          setCIdx(c => c + 1)
        }
      } else {
        setDisplay(word.slice(0, cIdx - 1))
        if (cIdx === 0) {
          setDeleting(false)
          setWIdx(i => (i + 1) % words.length)
        } else {
          setCIdx(c => c - 1)
        }
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [cIdx, deleting, wIdx, words])

  return (
    <span>
      {display}
      <span style={{ color: '#7c3aed', animation: 'blink-cursor 1s infinite' }}>|</span>
    </span>
  )
}

/* ─── Counter ─── */
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const start = Date.now()
    const dur = 2000
    const tick = () => {
      const t = Math.min((Date.now() - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setVal(Math.floor(ease * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, target])

  return <span ref={ref}>{val}{suffix}</span>
}

/* ═══════ ASOSIY SAHIFA ═══════ */
export default function Landing() {
  const [loaded, setLoaded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [verifyId, setVerifyId] = useState('')
  const [verifyState, setVerifyState] = useState('idle')

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  const handleVerify = (e) => {
    e.preventDefault()
    if (!verifyId.trim()) return
    setVerifyState('loading')
    setTimeout(() => setVerifyState(verifyId.trim().toUpperCase().startsWith('CZ') ? 'success' : 'error'), 1600)
  }

  const features = [
    { icon: QrCodeIcon,       title: 'QR Tezkor Tekshiruv',        desc: 'Istalgan sertifikatni QR orqali soniyalarda tekshiring. Hech qanday ilova kerak emas.',         color: '#a78bfa' },
    { icon: LockClosedIcon,   title: 'Blokcheyn Xavfsizligi',       desc: 'Har bir diplom kriptografik imzo bilan himoyalanadi. Soxtalashtirish imkonsiz.',                  color: '#06b6d4' },
    { icon: CpuChipIcon,      title: 'AI Firibgarlik Aniqlash',     desc: 'Aqlli AI modellari real vaqtda soxta sertifikatlarni aniqlab chiqadi.',                           color: '#f472b6' },
    { icon: CodeBracketIcon,  title: 'REST API',                    desc: 'Korporativ darajadagi API bilan o\'z tizimingizga muammosiz integratsiya qiling.',                color: '#34d399' },
    { icon: ChartBarIcon,     title: 'Tahlil & Hisobotlar',         desc: 'Tekshiruv statistikasi, geografik ma\'lumotlar va diplom haqiqiyligi bo\'yicha boy dashboard.',   color: '#fbbf24' },
    { icon: GlobeAltIcon,     title: 'Ko\'p Tilli',                 desc: 'O\'zbek, Rus va Ingliz tillarida to\'liq qo\'llab-quvvatlash. ISO 21001 muvofiq.',               color: '#60a5fa' },
  ]

  const stats = [
    { value: 500, suffix: 'K+', label: 'Berilgan Sertifikatlar',    color: '#a78bfa' },
    { value: 200, suffix: '+',  label: 'Hamkor Tashkilotlar',        color: '#06b6d4' },
    { value: 50,  suffix: 'K+', label: 'Mamnun Talabalar',           color: '#34d399' },
    { value: 99,  suffix: '%',  label: 'Tekshiruv Aniqligi',         color: '#fbbf24' },
  ]

  const services = [
    {
      num: '01', icon: BuildingLibraryIcon, color: '#a78bfa',
      title: 'Sertifikat Berish',
      subtitle: 'Universitetlar & O\'quv Markazlari',
      desc: 'Bir bosishda bitiruvchilarga buzib bo\'lmaydigan raqamli diplomlar bering. Ommaviy berish, shablonlar va avtomatik yetkazish.',
    },
    {
      num: '02', icon: MagnifyingGlassIcon, color: '#06b6d4',
      title: 'Ommaviy Tekshiruv',
      subtitle: 'Ish Beruvchilar & Davlat Organlari',
      desc: 'Certify.uz tarmog\'ida berilgan istalgan sertifikatni darhol tekshiring. 200+ tashkilot ishonadi.',
    },
    {
      num: '03', icon: CodeBracketIcon, color: '#34d399',
      title: 'Korporativ API',
      subtitle: 'Dasturchilar & Korxonalar',
      desc: 'Webhook, OAuth 2.0 va SDK qo\'llab-quvvatlash bilan to\'liq funksiyali REST API. 99.99% SLA kafolati.',
    },
  ]

  const testimonials = [
    {
      name: 'Dr. Kamol Tursunov', role: 'Rektor, Toshkent Davlat Universiteti', init: 'K',
      text: 'Certify.uz diplom berish usulimizni butunlay o\'zgartirdi. Birinchi semestrda firibgarlik holatlari nolga tushdi.',
    },
    {
      name: 'Shahlo Nazarova', role: 'HR Direktori, Uzum Technologies', init: 'S',
      text: 'Nomzodlarning diplom ma\'lumotlarini tekshirish 3-5 kundan darhol bo\'ldi. Yuzlab soat tejadik.',
    },
    {
      name: 'Firdavs Mirzayev', role: 'Direktor, Raqamli Ko\'nikmalar Akademiyasi', init: 'F',
      text: 'Bitiruvchilarimiz blokcheyn sertifikatlarni yaxshi ko\'rishadi. Bu ularga ish bozorida ustunlik beradi.',
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        :root { --purple:#7c3aed; --purple-l:#a78bfa; --cyan:#06b6d4; --blue:#3b82f6; --muted:#94a3b8; --border:rgba(255,255,255,0.07); }
        body { font-family:'Sora',sans-serif !important; }
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes blink-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes drift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.1)} 66%{transform:translate(-30px,40px) scale(.9)} }
        @keyframes float-up { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .orb{position:fixed;border-radius:50%;filter:blur(100px);opacity:.15;animation:drift 20s ease-in-out infinite;pointer-events:none;z-index:0}
        .grid-bg{position:fixed;inset:0;z-index:0;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:50px 50px;pointer-events:none;mask-image:radial-gradient(ellipse at 50% 0%,#000 20%,transparent 70%)}
        .g-text{background:linear-gradient(135deg,var(--purple-l) 0%,var(--cyan) 60%,var(--blue) 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:20px;transition:.4s}
        .glass:hover{border-color:rgba(124,58,237,.3);transform:translateY(-6px);box-shadow:0 20px 60px rgba(124,58,237,.1)}
        .btn-glow{background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;font-weight:700;padding:14px 32px;border-radius:14px;font-size:1rem;border:none;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:.3s;box-shadow:0 0 25px rgba(124,58,237,.4)}
        .btn-glow:hover{transform:translateY(-3px);box-shadow:0 0 45px rgba(124,58,237,.6);color:#fff}
        .btn-outline{background:transparent;border:1px solid rgba(124,58,237,.5);color:#f1f5f9;font-weight:600;padding:13px 28px;border-radius:14px;font-size:1rem;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:.3s}
        .btn-outline:hover{border-color:var(--purple);background:rgba(124,58,237,.1);transform:translateY(-3px);color:#f1f5f9}
        .sec-tag{color:var(--cyan);font-size:.75rem;font-weight:600;letter-spacing:4px;text-transform:uppercase;font-family:'JetBrains Mono',monospace;display:inline-block;margin-bottom:12px}
        .sec-line{width:60px;height:3px;background:linear-gradient(90deg,var(--purple),var(--cyan));border-radius:2px;margin:16px auto 50px}
        .sec-line.left{margin:16px 0 50px}
        .social-icon{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);transition:.3s;text-decoration:none;font-size:1.1rem}
        .social-icon:hover{background:rgba(124,58,237,.15);border-color:rgba(124,58,237,.5);color:var(--purple-l);transform:translateY(-3px)}
        .divider{height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent)}
        .badge-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.3);padding:7px 18px;border-radius:100px;font-size:.8rem;color:var(--purple-l);font-family:'JetBrains Mono',monospace;margin-bottom:28px}
        .badge-pill .dot{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;animation:blink-cursor 2s infinite;opacity:1}
        .float-badge{position:absolute;background:rgba(7,9,26,.9);border:1px solid rgba(124,58,237,.4);backdrop-filter:blur(20px);border-radius:16px;padding:12px 18px;z-index:5;white-space:nowrap;display:flex;align-items:center;gap:10px}
        .tag{background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.25);color:var(--purple-l);padding:4px 12px;border-radius:100px;font-size:.72rem;font-weight:600;display:inline-block;margin:2px}
        ::selection{background:var(--purple);color:#fff}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#030410}
        ::-webkit-scrollbar-thumb{background:linear-gradient(var(--purple),var(--blue));border-radius:3px}
      `}</style>

      <Loader done={loaded} />

      {/* Background */}
      <div className="orb" style={{ width:600,height:600,background:'#7c3aed',top:-200,left:-150 }} />
      <div className="orb" style={{ width:500,height:500,background:'#3b82f6',bottom:-150,right:-100,animationDelay:'-7s',opacity:.12 }} />
      <div className="orb" style={{ width:400,height:400,background:'#06b6d4',top:'40%',left:'60%',animationDelay:'-14s',opacity:.09 }} />
      <div className="grid-bg" />

      {/* ───── NAVBAR ───── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(3,4,16,.95)' : 'rgba(3,4,16,.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(124,58,237,.25)' : '1px solid rgba(255,255,255,.07)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,.5)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow:'0 0 16px rgba(124,58,237,.5)' }}>
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl" style={{ fontFamily:'Sora,sans-serif', letterSpacing:'-0.5px' }}>
              <span className="text-white">Certify</span>
              <span className="g-text">.uz</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {[['#features','Xususiyatlar'],['#services','Yechimlar'],['#demo','Demo'],['#contact','Aloqa']].map(([href,label]) => (
              <a key={href} href={href}
                className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 no-underline"
                style={{ color:'#94a3b8' }}
                onMouseEnter={e => { e.target.style.color='#f1f5f9'; e.target.style.background='rgba(255,255,255,.05)' }}
                onMouseLeave={e => { e.target.style.color='#94a3b8'; e.target.style.background='transparent' }}>
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium no-underline px-3.5 py-2 rounded-xl transition-all" style={{ color:'#94a3b8' }}>
              Kirish
            </Link>
            <Link href="/demo" className="btn-glow text-sm px-5 py-2.5" style={{ borderRadius:'12px', padding:'10px 22px', fontSize:'.9rem' }}>
              Demo Ko'rish
            </Link>
          </div>

          <button className="md:hidden p-2 rounded-xl" style={{ color:'#94a3b8', background:'transparent', border:'none' }}
            onClick={() => setMobileOpen(v => !v)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 space-y-1" style={{ borderTop:'1px solid rgba(255,255,255,.07)', background:'rgba(3,4,16,.98)' }}>
            {[['#features','Xususiyatlar'],['#services','Yechimlar'],['#demo','Demo'],['#contact','Aloqa']].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium no-underline"
                style={{ color:'#94a3b8' }}>
                {label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium no-underline"
                style={{ color:'#f1f5f9', border:'1px solid rgba(255,255,255,.1)' }}>
                Kirish
              </Link>
              <Link href="/demo" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold no-underline text-white"
                style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                Demo
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div style={{ background:'#030410', position:'relative', zIndex:1 }}>

        {/* ───── HERO ───── */}
        <section className="relative min-h-screen flex items-center" style={{ paddingTop:120, paddingBottom:80 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left */}
              <div style={{ animation:'fadeInUp .8s ease-out' }}>
                <div className="badge-pill">
                  <span className="dot" />
                  O'zbekistondagi 200+ tashkilot ishonadi
                </div>

                <h1 style={{ fontSize:'clamp(2.8rem,7vw,5rem)', fontWeight:900, lineHeight:1.05, letterSpacing:'-2.5px', marginBottom:18 }}>
                  <span className="text-white">Raqamli</span><br />
                  <span className="g-text">Diplomlar</span><br />
                  <span className="text-white">Platformasi</span>
                </h1>

                <p style={{ fontSize:'1.05rem', color:'#a78bfa', fontFamily:"'JetBrains Mono',monospace", marginBottom:20, minHeight:'1.6em' }}>
                  <TypedText words={['Sertifikat bering.', 'QR orqali tekshiring.', 'Firibgarlikni bartaraf eting.', 'Blokcheyn bilan himoyalang.']} />
                </p>

                <p style={{ fontSize:'1.05rem', color:'#94a3b8', maxWidth:520, lineHeight:1.8, marginBottom:36 }}>
                  O'zbekistondagi eng xavfsiz raqamli diplom platformasi.{' '}
                  <strong style={{ color:'#f1f5f9' }}>Buzib bo'lmaydigan sertifikatlar</strong> bering,{' '}
                  <strong style={{ color:'#f1f5f9' }}>darhol tekshiring</strong> va diplom firibgarligini yo'q qiling.
                </p>

                {/* Verify input */}
                <form onSubmit={handleVerify} className="flex gap-2 mb-8 max-w-md">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#64748b' }} />
                    <input
                      type="text" placeholder="Sertifikat ID (masalan: CZ-2025-8472)"
                      value={verifyId}
                      onChange={e => { setVerifyId(e.target.value); setVerifyState('idle') }}
                      className="w-full text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all rounded-xl"
                      style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', padding:'14px 14px 14px 36px' }}
                      onFocus={e => { e.target.style.borderColor='rgba(124,58,237,.5)'; e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,.12)' }}
                      onBlur={e => { e.target.style.borderColor='rgba(255,255,255,.1)'; e.target.style.boxShadow='none' }}
                    />
                  </div>
                  <button type="submit" disabled={verifyState==='loading'}
                    className="btn-glow shrink-0 disabled:opacity-60"
                    style={{ padding:'0 20px', borderRadius:'12px', fontSize:'.9rem' }}>
                    {verifyState==='loading' ? '...' : 'Tekshir'}
                  </button>
                </form>

                {verifyState==='success' && (
                  <div className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl text-sm"
                    style={{ background:'rgba(16,185,129,.12)', border:'1px solid rgba(16,185,129,.3)', color:'#34d399' }}>
                    <CheckCircleSolid className="w-5 h-5 shrink-0" />
                    <span><strong>Sertifikat haqiqiy!</strong> Aziz Karimovga berilgan • 15 yanvar 2025</span>
                  </div>
                )}
                {verifyState==='error' && (
                  <div className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl text-sm"
                    style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', color:'#f87171' }}>
                    <span>Sertifikat ID topilmadi. Qayta urinib ko'ring.</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 mb-10">
                  <Link href="/demo" className="btn-glow">Demo Ko'rish <ArrowRightIcon className="w-5 h-5" /></Link>
                  <Link href="/register" className="btn-outline">Bepul Boshlash</Link>
                </div>

                <div className="flex flex-wrap gap-5">
                  {[
                    { icon:'🔒', text:'256-bit shifrlash' },
                    { icon:'⚡', text:'99.9% uptime' },
                    { icon:'🛡', text:'ISO 27001 muvofiq' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-sm" style={{ color:'#64748b' }}>
                      <span>{icon}</span> {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — certificate mockup */}
              <div className="relative flex justify-center" style={{ animation:'fadeInUp .8s ease-out .2s both' }}>
                <div className="relative" style={{ animation:'float-up 6s ease-in-out infinite' }}>
                  {/* Glow */}
                  <div className="absolute -inset-8 rounded-3xl blur-3xl -z-10" style={{ background:'linear-gradient(135deg,rgba(124,58,237,.35),rgba(37,99,235,.25))', opacity:.6 }} />

                  {/* Certificate card */}
                  <div className="rounded-3xl p-[2px]" style={{ background:'linear-gradient(135deg,#fbbf24 0%,#d97706 30%,#92400e 55%,#d97706 80%,#fbbf24 100%)', boxShadow:'0 30px 80px rgba(0,0,0,.7)' }}>
                    <div className="rounded-[22px] p-7 relative overflow-hidden" style={{ background:'linear-gradient(145deg,#0d1a3a,#120a3e)', minWidth:320 }}>
                      <div className="absolute inset-0 pointer-events-none opacity-20 rounded-[22px]"
                        style={{ background:'linear-gradient(115deg,transparent 25%,rgba(167,139,250,.6) 50%,transparent 75%)', backgroundSize:'300% 300%', animation:'shimmer 4s linear infinite' }} />

                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow:'0 0 14px rgba(124,58,237,.6)' }}>
                            <AcademicCapIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white text-xs font-bold tracking-widest">CERTIFY.UZ</div>
                            <div className="text-[10px] tracking-wider" style={{ color:'rgba(251,191,36,.65)' }}>RAQAMLI DIPLOMLAR</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background:'rgba(16,185,129,.15)', border:'1px solid rgba(16,185,129,.35)' }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation:'blink-cursor 1.5s infinite' }} />
                          <span className="text-emerald-400 text-xs font-bold tracking-wider">TASDIQLANDI</span>
                        </div>
                      </div>

                      <div className="h-px mb-5" style={{ background:'linear-gradient(90deg,transparent,rgba(251,191,36,.5),transparent)' }} />

                      <div className="mb-5">
                        <p className="text-[10px] tracking-[3px] uppercase mb-1.5" style={{ color:'rgba(251,191,36,.55)' }}>Muvaffaqiyat sertifikati</p>
                        <h3 className="text-white text-lg font-bold mb-3 leading-snug">Ilg'or Veb Dasturlash<br />&amp; Bulut Arxitekturasi</h3>
                        <p className="text-slate-500 text-xs mb-1">Bu sertifikat berilgan</p>
                        <p className="font-semibold text-base" style={{ color:'#c4b5fd' }}>Aziz Karimov</p>
                      </div>

                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <div className="text-slate-600 text-[10px] mb-0.5 uppercase tracking-wider">Berilgan sana</div>
                          <div className="text-slate-300 text-xs">15 yanvar, 2025</div>
                          <div className="text-slate-600 text-[10px] mt-2 mb-0.5 uppercase tracking-wider">Sertifikat ID</div>
                          <div className="font-mono text-xs" style={{ color:'#fbbf24' }}>CZ-2025-8472-XK</div>
                        </div>
                        <div className="bg-white p-2 rounded-xl">
                          <div className="w-12 h-12" style={{ background:'#120a3e' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Float badges */}
                  <div className="float-badge" style={{ bottom:-20, left:-30 }}>
                    <span style={{ fontSize:'1.4rem' }}>🚀</span>
                    <div>
                      <div style={{ fontSize:'.7rem', color:'#94a3b8', display:'block' }}>Berilgan sertifikatlar</div>
                      <strong style={{ fontSize:'.9rem', color:'#f1f5f9' }}>500K+</strong>
                    </div>
                  </div>
                  <div className="float-badge" style={{ top:30, right:-40 }}>
                    <span style={{ fontSize:'1.4rem' }}>🛡</span>
                    <div>
                      <div style={{ fontSize:'.7rem', color:'#94a3b8', display:'block' }}>Firibgarlik</div>
                      <strong style={{ fontSize:'.9rem', color:'#34d399' }}>Nol holat</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ───── STATS ───── */}
        <section style={{ padding:'80px 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map(({ value, suffix, label, color }) => (
                <div key={label} className="glass p-8 text-center group" style={{ cursor:'default' }}>
                  <div className="text-4xl lg:text-5xl font-black mb-2 tabular-nums" style={{ color, fontFamily:'Sora,sans-serif' }}>
                    <Counter target={value} suffix={suffix} />
                  </div>
                  <div className="text-sm font-medium" style={{ color:'#64748b' }}>{label}</div>
                  <div className="mt-3 h-0.5 rounded-full mx-auto w-10 group-hover:w-16 transition-all duration-300" style={{ background:`linear-gradient(90deg,transparent,${color},transparent)` }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ───── FEATURES ───── */}
        <section id="features" style={{ padding:'90px 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="sec-tag">Platforma Xususiyatlari</span>
              <h2 className="font-black text-white" style={{ fontSize:'clamp(2rem,5vw,3rem)', letterSpacing:'-1.5px', marginBottom:16 }}>
                Korporativ darajadagi <span className="g-text">xavfsizlik</span>
              </h2>
              <div className="sec-line" />
              <p style={{ color:'#94a3b8', fontSize:'1.05rem', maxWidth:520, margin:'0 auto' }}>
                Sertifikat yaxlitligini jiddiy qabul qiladigan muassasalar uchun qurilgan.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="glass p-7 group" style={{ cursor:'default' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background:`${color}22`, border:`1px solid ${color}44`, boxShadow:`0 0 20px ${color}33` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2.5">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:'#64748b' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ───── SERVICES ───── */}
        <section id="services" style={{ padding:'90px 0', background:'rgba(7,9,26,.5)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="sec-tag">Yechimlar</span>
              <h2 className="font-black text-white" style={{ fontSize:'clamp(2rem,5vw,3rem)', letterSpacing:'-1.5px', marginBottom:16 }}>
                Bir platforma, <span className="g-text">har qanday holat</span>
              </h2>
              <div className="sec-line" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {services.map(({ num, icon: Icon, color, title, subtitle, desc }) => (
                <div key={title} className="glass p-8 flex flex-col h-full" style={{ cursor:'default' }}>
                  <div className="text-xs font-bold tracking-[3px] mb-4" style={{ color, fontFamily:"'JetBrains Mono',monospace" }}>{num}</div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background:`${color}18`, border:`1px solid ${color}44`, boxShadow:`0 0 24px ${color}22` }}>
                    <Icon className="w-7 h-7" style={{ color }} />
                  </div>
                  <div className="text-[11px] font-bold tracking-wider uppercase mb-2" style={{ color }}>{subtitle}</div>
                  <h3 className="font-black text-white text-2xl mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:'#64748b' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ───── DEMO CTA ───── */}
        <section id="demo" style={{ padding:'90px 0' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[28px] text-center overflow-hidden"
              style={{ padding:'64px 48px', background:'linear-gradient(135deg,rgba(124,58,237,.15),rgba(59,130,246,.1))', border:'1px solid rgba(124,58,237,.25)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at 50% 0%,rgba(124,58,237,.2),transparent 70%)' }} />
              <div className="relative z-10">
                <span className="sec-tag">Jonli Demo</span>
                <h2 className="font-black text-white mb-4" style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', letterSpacing:'-1px' }}>
                  Platformani o'zingiz sinab ko'ring
                </h2>
                <p className="mb-8 max-w-xl mx-auto" style={{ color:'#94a3b8', fontSize:'1.05rem' }}>
                  Bir klik bilan demo akkauntga kiring va barcha imkoniyatlarni bepul ko'ring. Ro'yxatdan o'tish shart emas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/demo" className="btn-glow" style={{ fontSize:'1.05rem', padding:'15px 38px' }}>
                    Demo Ko'rish <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                  <Link href="/register" className="btn-outline" style={{ fontSize:'1.05rem', padding:'14px 34px' }}>
                    Bepul Boshlash
                  </Link>
                </div>
                <p className="mt-5 text-xs" style={{ color:'#475569' }}>Kredit karta talab qilinmaydi · 14 kunlik bepul sinov</p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ───── TESTIMONIALS ───── */}
        <section style={{ padding:'90px 0', background:'rgba(7,9,26,.5)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="sec-tag">Sharhlar</span>
              <h2 className="font-black text-white" style={{ fontSize:'clamp(2rem,5vw,3rem)', letterSpacing:'-1.5px', marginBottom:16 }}>
                O'zbekiston bo'ylab <span className="g-text">rahbarlar ishonadi</span>
              </h2>
              <div className="sec-line" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(({ name, role, init, text }, i) => (
                <div key={i} className="glass p-8 flex flex-col relative" style={{ cursor:'default' }}>
                  <div className="absolute text-[5rem] leading-none pointer-events-none" style={{ color:'rgba(124,58,237,.12)', fontFamily:'serif', top:20, left:28 }}>"</div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <StarSolid key={j} className="w-4 h-4" style={{ color:'#fbbf24' }} />)}
                  </div>
                  <p className="text-sm leading-relaxed flex-1 mb-6 italic" style={{ color:'#94a3b8' }}>"{text}"</p>
                  <div className="flex items-center gap-3 pt-5" style={{ borderTop:'1px solid rgba(255,255,255,.06)' }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                      style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                      {init}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{name}</div>
                      <div className="text-xs" style={{ color:'#64748b' }}>{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ───── CONTACT ───── */}
        <section id="contact" style={{ padding:'90px 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="sec-tag">Biz Bilan Bog'laning</span>
                <h2 className="font-black text-white mb-5" style={{ fontSize:'clamp(2rem,5vw,3rem)', letterSpacing:'-1.5px' }}>
                  Kelajakni birga <span className="g-text">quraylik</span>
                </h2>
                <div className="sec-line left" />
                <p className="mb-10 leading-relaxed" style={{ color:'#94a3b8', fontSize:'1.05rem' }}>
                  Tashkilotingizda diplom firibgarligini bartaraf etishga tayyormisiz? Jamoamiz yordam berishga tayyor.
                </p>
                <div className="space-y-5">
                  {[
                    { icon: EnvelopeIcon, label:'Email', value:'javohirboltayev937@gmail.com', color:'#a78bfa' },
                    { icon: ({ className }) => (
                      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
                      </svg>
                    ), label:'Telegram', value:'@javohir_boltayev', color:'#60a5fa' },
                    { icon: MapPinIcon, label:'Joylashuv', value:"Kitob, Qashqadaryo, O'zbekiston", color:'#34d399' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background:`${color}18`, border:`1px solid ${color}33` }}>
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color:'#64748b' }}>{label}</div>
                        <div className="font-medium text-white">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-8">
                <h3 className="font-black text-white text-xl mb-6">Xabar Yuborish</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[['Ism','Ismingiz'],['Email','email@manzil.uz']].map(([label,ph]) => (
                      <div key={label}>
                        <label className="block text-xs font-semibold mb-2" style={{ color:'#64748b' }}>{label}</label>
                        <input type="text" placeholder={ph}
                          className="w-full rounded-[14px] text-white focus:outline-none transition-all"
                          style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', padding:'13px 16px', fontSize:'.9rem', fontFamily:'Sora,sans-serif' }}
                          onFocus={e => { e.target.style.borderColor='rgba(124,58,237,.5)'; e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,.1)' }}
                          onBlur={e => { e.target.style.borderColor='rgba(255,255,255,.07)'; e.target.style.boxShadow='none' }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color:'#64748b' }}>Xabar</label>
                    <textarea rows={4} placeholder="Ehtiyojlaringiz haqida gapirib bering..."
                      className="w-full rounded-[14px] text-white focus:outline-none transition-all resize-none"
                      style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', padding:'13px 16px', fontSize:'.9rem', fontFamily:'Sora,sans-serif' }}
                      onFocus={e => { e.target.style.borderColor='rgba(124,58,237,.5)'; e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,.1)' }}
                      onBlur={e => { e.target.style.borderColor='rgba(255,255,255,.07)'; e.target.style.boxShadow='none' }}
                    />
                  </div>
                  <button className="btn-glow w-full justify-center" style={{ padding:'14px', borderRadius:'14px' }}>
                    Xabar Yuborish <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── FOOTER ───── */}
        <footer style={{ borderTop:'1px solid rgba(255,255,255,.07)', padding:'40px 0 30px', background:'rgba(7,9,26,.8)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                  <ShieldCheckIcon className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">
                  <span className="text-white">Certify</span><span className="g-text">.uz</span>
                </span>
              </div>
              <p className="text-sm" style={{ color:'#475569' }}>
                © 2025 Certify.uz — O'zbekiston raqamli diplom platformasi
              </p>
              <div className="flex gap-3">
                <Link href="/login" className="text-sm no-underline" style={{ color:'#64748b' }}>Kirish</Link>
                <Link href="/register" className="text-sm no-underline" style={{ color:'#64748b' }}>Ro'yxat</Link>
                <Link href="/demo" className="text-sm no-underline" style={{ color:'#a78bfa' }}>Demo</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
