'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ShieldCheckIcon, QrCodeIcon, DocumentCheckIcon, ChartBarIcon,
  BuildingOfficeIcon, GlobeAltIcon, BoltIcon, LockClosedIcon,
  CheckCircleIcon, ChevronDownIcon, ArrowRightIcon, SparklesIcon,
  ServerIcon, CpuChipIcon, KeyIcon, CloudArrowUpIcon, CodeBracketIcon,
  PhoneIcon, EnvelopeIcon, MapPinIcon, UserGroupIcon, AcademicCapIcon,
  BuildingLibraryIcon, MagnifyingGlassIcon, StarIcon, CheckIcon,
  XMarkIcon, ArrowPathIcon, FingerPrintIcon, CubeTransparentIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid'

/* ─── Telegram Icon ─── */
function TelegramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
    </svg>
  )
}

/* ─── QR Code SVG ─── */
function QRCode({ size = 80, color = '#a78bfa' }) {
  const grid = [
    [1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,1,0,1,0,1,1,0,0,1,1,0,1],
    [0,1,1,0,1,0,0,0,0,1,0,1,0,0,1,1,0,0,1,0],
    [1,0,0,1,0,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1],
    [0,1,0,1,1,0,0,1,0,1,0,0,1,1,0,1,0,1,0,0],
    [1,0,1,0,0,1,1,0,1,0,1,0,0,0,1,0,1,1,0,1],
    [0,0,0,1,0,0,0,0,0,1,0,1,1,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,0,1,0,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,1,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,1,1,0],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,1,1,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,1],
  ]
  const cs = size / grid.length
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ color }}>
      {grid.map((row, i) => row.map((cell, j) =>
        cell ? <rect key={`${i}-${j}`} x={j*cs} y={i*cs} width={cs-0.3} height={cs-0.3} fill="currentColor" rx="0.4" /> : null
      ))}
    </svg>
  )
}

/* ─── Animatsiyali sanagich ─── */
function Counter({ target, suffix = '', prefix = '', decimals = 0 }) {
  const [value, setValue] = useState(0)
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
    const duration = 2200
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setValue(+(ease * target).toFixed(decimals))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, target, decimals])

  return <span ref={ref}>{prefix}{decimals ? value.toFixed(decimals) : Math.floor(value).toLocaleString()}{suffix}</span>
}

/* ─── Sertifikat Maketi ─── */
function CertificateMockup() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto" style={{ animation: 'float 6s ease-in-out infinite' }}>
      <div className="absolute inset-x-8 inset-y-4 rounded-3xl blur-3xl -z-10 opacity-60"
           style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#2563eb 100%)' }} />
      <div className="rounded-3xl p-[1.5px]"
           style={{ background: 'linear-gradient(135deg,#fbbf24 0%,#d97706 30%,#92400e 55%,#d97706 80%,#fbbf24 100%)' }}>
        <div className="rounded-[22px] p-6 relative overflow-hidden"
             style={{ background: 'linear-gradient(145deg,#0d1a3a 0%,#120a3e 100%)' }}>
          <div className="absolute inset-0 pointer-events-none opacity-25 rounded-[22px]"
               style={{ background: 'linear-gradient(115deg,transparent 25%,rgba(167,139,250,0.6) 50%,transparent 75%)', backgroundSize: '300% 300%', animation: 'shimmer 4s linear infinite' }} />
          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
               style={{ background: 'radial-gradient(circle at top right,rgba(251,191,36,0.18),transparent)' }} />
          <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none"
               style={{ background: 'radial-gradient(circle at bottom left,rgba(124,58,237,0.2),transparent)' }} />

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 0 14px rgba(124,58,237,0.6)' }}>
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white text-xs font-bold tracking-widest">CERTIFY.UZ</div>
                <div className="text-[10px] tracking-wider" style={{ color: 'rgba(251,191,36,0.65)' }}>RAQAMLI DIPLOMLAR</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                 style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'ping 1.5s ease-in-out infinite' }} />
              <span className="text-emerald-400 text-xs font-bold tracking-wider">TASDIQLANDI</span>
            </div>
          </div>

          <div className="h-px mb-5" style={{ background: 'linear-gradient(90deg,transparent,rgba(251,191,36,0.5),transparent)' }} />

          <div className="mb-5">
            <p className="text-[10px] tracking-[3px] uppercase mb-1.5" style={{ color: 'rgba(251,191,36,0.55)' }}>Muvaffaqiyat sertifikati</p>
            <h3 className="text-white text-[17px] font-bold mb-3 leading-snug">Ilg'or Veb Dasturlash<br />&amp; Bulut Arxitekturasi</h3>
            <p className="text-slate-500 text-xs mb-1">Bu sertifikat berilgan</p>
            <p className="font-semibold text-base" style={{ color: '#c4b5fd' }}>Aziz Karimov</p>
            <p className="text-slate-600 text-[11px] mt-1">barcha talablarni muvaffaqiyatli bajargan</p>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-slate-600 text-[10px] mb-0.5 uppercase tracking-wider">Berilgan sana</div>
              <div className="text-slate-300 text-xs">15 yanvar, 2025</div>
              <div className="text-slate-600 text-[10px] mt-2 mb-0.5 uppercase tracking-wider">Sertifikat ID</div>
              <div className="font-mono text-xs" style={{ color: '#fbbf24' }}>CZ-2025-8472-XK</div>
            </div>
            <div className="bg-white p-2 rounded-xl">
              <QRCode size={56} color="#120a3e" />
            </div>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-[0.08]">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-400 flex items-center justify-center">
              <span className="text-emerald-400 text-[10px] font-black tracking-widest text-center">TАСДИҚ<br/>ЛАНДИ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Boshqaruv Paneli Ko'rinishi ─── */
function DashboardPreview() {
  const bars = [45,72,58,89,63,94,77,81,55,96,70,88]
  const certs = [
    { id:'CZ-2025-8472', name:'Aziz Karimov',     course:'Veb Dasturlash',     date:'15 yan', status:'tasdiqlandi' },
    { id:'CZ-2025-8391', name:'Malika Yusupova',  course:'Ma\'lumotlar Ilmi',   date:'12 yan', status:'tasdiqlandi' },
    { id:'CZ-2025-8304', name:'Bobur Rashidov',   course:'Bulut Arxitekturasi', date:'8 yan',  status:'kutilmoqda'  },
    { id:'CZ-2025-8287', name:'Dilnoza Hasanova', course:'UI/UX Dizayn',        date:'5 yan',  status:'tasdiqlandi' },
  ]
  const statusStyle = (s) => s === 'tasdiqlandi'
    ? { color:'#34d399', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.25)' }
    : { color:'#fbbf24', background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)' }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.08)', background:'rgba(8,15,30,0.97)', boxShadow:'0 30px 80px rgba(0,0,0,0.7)' }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background:'#ef4444',opacity:0.7 }} />
          <div className="w-3 h-3 rounded-full" style={{ background:'#f59e0b',opacity:0.7 }} />
          <div className="w-3 h-3 rounded-full" style={{ background:'#10b981',opacity:0.7 }} />
        </div>
        <div className="flex-1 mx-4">
          <div className="rounded-md px-3 py-1 text-xs text-center" style={{ background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.25)' }}>
            dashboard.certify.uz
          </div>
        </div>
      </div>

      <div className="flex" style={{ height:'440px' }}>
        <div className="w-48 shrink-0 flex flex-col gap-1 p-3" style={{ borderRight:'1px solid rgba(255,255,255,0.05)',background:'rgba(255,255,255,0.01)' }}>
          <div className="flex items-center gap-2 px-3 py-2.5 mb-3">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              <ShieldCheckIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white text-xs font-bold">Certify.uz</span>
          </div>
          {[
            { icon:ChartBarIcon,       label:'Umumiy ko\'rinish', active:true },
            { icon:DocumentCheckIcon,  label:'Sertifikatlar' },
            { icon:QrCodeIcon,         label:'Tekshiruv' },
            { icon:UserGroupIcon,      label:'Talabalar' },
            { icon:CpuChipIcon,        label:'Tahlil' },
            { icon:ServerIcon,         label:'API Kalitlar' },
            { icon:AcademicCapIcon,    label:'Tashkilotlar' },
          ].map(({ icon:Icon, label, active }) => (
            <div key={label} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer"
                 style={active ? {background:'rgba(124,58,237,0.2)',color:'#c4b5fd'} : {color:'rgba(255,255,255,0.3)'}}>
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label:'Jami Sertifikat', value:'12,847', delta:'+12%',  color:'#a78bfa' },
              { label:'Tasdiqlangan',    value:'11,923', delta:'+8.3%', color:'#34d399' },
              { label:'Tashkilotlar',    value:'234',    delta:'+5',    color:'#60a5fa' },
              { label:'API So\'rovlar',  value:'98.7K',  delta:'+23%',  color:'#f59e0b' },
            ].map(({ label,value,delta,color }) => (
              <div key={label} className="rounded-xl p-3" style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-[10px] mb-1" style={{ color:'rgba(255,255,255,0.35)' }}>{label}</div>
                <div className="text-sm font-bold mb-0.5" style={{ color }}>{value}</div>
                <div className="text-[10px]" style={{ color:'#34d399' }}>{delta}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 flex-1 flex flex-col" style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white">Tekshiruv Faolligi</span>
              <span className="text-[10px]" style={{ color:'rgba(255,255,255,0.3)' }}>So'nggi 12 oy</span>
            </div>
            <div className="flex-1 flex items-end gap-1.5 pb-1">
              {bars.map((h,i) => (
                <div key={i} className="flex-1 rounded-t-sm relative overflow-hidden"
                     style={{ height:`${h}%`, background:`linear-gradient(180deg,rgba(139,92,246,${0.6+i*0.02}) 0%,rgba(59,130,246,0.4) 100%)` }}>
                  <div className="absolute inset-0 opacity-30" style={{ background:'linear-gradient(180deg,rgba(255,255,255,0.3),transparent)' }} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-xs font-semibold text-white">So'nggi Sertifikatlar</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:'rgba(139,92,246,0.15)',color:'#a78bfa' }}>
                {certs.length} yozuv
              </span>
            </div>
            {certs.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-2" style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                     style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-white truncate">{c.name}</div>
                  <div className="text-[10px] truncate" style={{ color:'rgba(255,255,255,0.3)' }}>{c.course}</div>
                </div>
                <div className="text-[10px] shrink-0" style={{ color:'rgba(255,255,255,0.25)' }}>{c.date}</div>
                <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium" style={statusStyle(c.status)}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── QR Tekshiruv Demosi ─── */
function QRVerifyDemo() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const restart = () => {
    setPhase(0)
    setTimeout(() => setPhase(1), 400)
    setTimeout(() => setPhase(2), 3000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-56 h-56 relative rounded-2xl overflow-hidden"
               style={{ background:'rgba(255,255,255,0.03)', border:'2px solid rgba(139,92,246,0.3)', boxShadow:'0 0 40px rgba(139,92,246,0.15),inset 0 0 40px rgba(0,0,0,0.5)' }}>
            {[['top-2 left-2','border-t-2 border-l-2'],['top-2 right-2','border-t-2 border-r-2'],
              ['bottom-2 left-2','border-b-2 border-l-2'],['bottom-2 right-2','border-b-2 border-r-2']].map(([pos,border],i) => (
              <div key={i} className={`absolute ${pos} w-6 h-6 ${border} border-violet-400`} style={{ borderRadius:'2px' }} />
            ))}

            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${phase>=1?'opacity-100':'opacity-40'}`}>
              <QRCode size={140} color={phase===2?'#34d399':'#a78bfa'} />
            </div>

            {phase===1 && (
              <div className="absolute left-0 right-0 h-0.5 pointer-events-none" style={{
                background:'linear-gradient(90deg,transparent,#a78bfa,#60a5fa,#a78bfa,transparent)',
                boxShadow:'0 0 12px rgba(139,92,246,0.8)',
                animation:'scan-line 1.8s ease-in-out infinite alternate',
              }} />
            )}

            {phase===2 && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl"
                   style={{ background:'rgba(16,185,129,0.08)', border:'2px solid rgba(16,185,129,0.4)' }}>
                <div className="text-center">
                  <CheckCircleSolid className="w-12 h-12 text-emerald-400 mx-auto mb-1" style={{ filter:'drop-shadow(0 0 12px rgba(16,185,129,0.7))' }} />
                  <p className="text-emerald-400 text-xs font-bold tracking-widest">TASDIQLANDI</p>
                </div>
              </div>
            )}
          </div>

          {phase===1 && (
            <>
              <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/20 animate-ping" style={{ animationDuration:'2s' }} />
              <div className="absolute -inset-2 rounded-2xl border border-violet-500/10 animate-ping" style={{ animationDuration:'2.5s' }} />
            </>
          )}

          <div className="mt-4 text-center">
            {phase===0 && <p className="text-slate-500 text-sm">QR kodni ramkaga joylashtiring</p>}
            {phase===1 && <p className="text-violet-400 text-sm font-medium" style={{ animation:'fadeIn 0.3s ease-out' }}>Skanerlanmoqda...</p>}
            {phase===2 && <p className="text-emerald-400 text-sm font-bold" style={{ animation:'fadeIn 0.3s ease-out' }}>Tekshiruv muvaffaqiyatli!</p>}
          </div>
          {phase===2 && (
            <button onClick={restart} className="mt-2 mx-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-400 transition-colors">
              <ArrowPathIcon className="w-3.5 h-3.5" /> Qayta ko'rish
            </button>
          )}
        </div>
      </div>

      <div className={`transition-all duration-700 ${phase===2?'opacity-100 translate-x-0':'opacity-0 translate-x-8'}`}>
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-bold text-lg">Sertifikat Tafsilotlari</h4>
            <span className="badge-verified px-3 py-1 rounded-full text-xs font-bold">✓ TASDIQLANDI</span>
          </div>
          <div className="divider-gradient" />
          {[
            { label:'Egasi',           value:'Aziz Karimov',                    color:'#c4b5fd' },
            { label:'Kurs',            value:'Ilg\'or Veb Dasturlash',          color:'white'   },
            { label:'Beruvchi',        value:'Toshkent Davlat Universiteti',    color:'white'   },
            { label:'Berilgan sana',   value:'15 yanvar, 2025',                 color:'white'   },
            { label:'Muddati tugashi', value:'15 yanvar, 2028',                 color:'white'   },
            { label:'Xesh',            value:'0x4f2a...b81c',                   color:'#60a5fa', mono:true },
          ].map(({ label,value,color,mono }) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="text-slate-500 text-sm shrink-0">{label}</span>
              <span className={`text-sm font-medium text-right ${mono?'font-mono':''}`} style={{ color }}>{value}</span>
            </div>
          ))}
          <div className="divider-gradient" />
          <div className="flex items-center gap-2 pt-1">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-slate-500">SHA-256 kriptografik imzo bilan himoyalangan. Certify.uz blokcheyn reyestrida buzib bo'lmaydigan yozuv.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Ko'p so'raladigan savol elementi ─── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-200"
         style={{ border:`1px solid ${open?'rgba(139,92,246,0.35)':'rgba(255,255,255,0.07)'}`, background:open?'rgba(124,58,237,0.06)':'rgba(255,255,255,0.02)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left group">
        <span className={`font-medium pr-4 transition-colors ${open?'text-white':'text-slate-300 group-hover:text-white'}`}>{q}</span>
        <ChevronDownIcon className={`w-5 h-5 shrink-0 transition-all duration-300 ${open?'text-violet-400 rotate-180':'text-slate-600'}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div className="pt-4">{a}</div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════ ASOSIY SAHIFA ═══════════════════════ */
export default function LandingPage() {
  const [verifyId, setVerifyId] = useState('')
  const [verifyState, setVerifyState] = useState('idle')
  const handleVerify = (e) => {
    e.preventDefault()
    if (!verifyId.trim()) return
    setVerifyState('loading')
    setTimeout(() => setVerifyState(verifyId.trim().toUpperCase().startsWith('CZ') ? 'success' : 'error'), 1800)
  }

  /* ── ma'lumotlar ── */
  const stats = [
    { value:500, suffix:'K+', label:'Berilgan Sertifikatlar',      color:'#a78bfa', glow:'rgba(139,92,246,0.3)' },
    { value:200, suffix:'+',  label:'Hamkor Tashkilotlar',         color:'#60a5fa', glow:'rgba(59,130,246,0.3)' },
    { value:50,  suffix:'K+', label:'Xizmat Ko\'rsatilgan Talabalar', color:'#34d399', glow:'rgba(16,185,129,0.3)' },
    { value:99,  suffix:'.9%',label:'Tekshiruv Aniqligi',          color:'#fbbf24', glow:'rgba(245,158,11,0.3)', decimals:1, target:99.9 },
  ]

  const features = [
    { icon:QrCodeIcon,      title:'QR Darhol Tekshiruvi',       desc:'Istalgan sertifikat QR kodini skanerlang va darhol kriptografik tekshiruvni oling. Barcha qurilmalarda ishlaydi, ilova talab qilmaydi.',                                                         color:'#a78bfa', glow:'rgba(139,92,246,0.3)' },
    { icon:LockClosedIcon,  title:'Blokcheyn Xavfsizligi',      desc:'Har bir diplom o\'zgarmas blokcheyn reyestriga bog\'langan. Dizayn bo\'yicha buzib bo\'lmas, standart bo\'yicha xavfsiz.',                                                                        color:'#60a5fa', glow:'rgba(59,130,246,0.3)' },
    { icon:CpuChipIcon,     title:'AI Firibgarlikni Aniqlash',  desc:'Real vaqtda AI modellari soxta sertifikatlarni ish beruvchilar yoki muassasalarga yetib bormasidan oldin aniqlab belgilaydi.',                                                                       color:'#f472b6', glow:'rgba(244,114,182,0.3)' },
    { icon:CodeBracketIcon, title:'REST API Integratsiyasi',    desc:'99.99% SLA bilan korporativ darajadagi API. Tekshiruvni HRMS, LMS yoki maxsus ish oqimingizga joylashtiring.',                                                                                      color:'#34d399', glow:'rgba(16,185,129,0.3)' },
    { icon:ChartBarIcon,    title:'Tahlil va Statistika',       desc:'Tekshiruv tendensiyalari, geografik ma\'lumotlar va diplom haqiqiyligi statistikasini ko\'rsatadigan boy dashboardlar.',                                                                            color:'#fbbf24', glow:'rgba(245,158,11,0.3)' },
    { icon:GlobeAltIcon,    title:'Ko\'p Tilli Qo\'llab-quvvatlash', desc:'O\'zbek, Rus va Ingliz tillarini to\'liq qo\'llab-quvvatlash. Xalqaro standartlarga muvofiqlik (ISO 21001, GDPR).',                                                                          color:'#22d3ee', glow:'rgba(34,211,238,0.3)' },
  ]

  const services = [
    {
      icon:BuildingLibraryIcon, color:'#a78bfa', bg:'rgba(139,92,246,0.1)', border:'rgba(139,92,246,0.3)',
      title:'Sertifikat Berish',
      subtitle:'Universitetlar va O\'quv Markazlari uchun',
      desc:'Bitta bosish bilan bitiruvchilar va talabalaringizga buzib bo\'lmaydigan raqamli diplomlar bering. Ommaviy operatsiyalar, maxsus shablonlar va avtomatik email yetkazib berish.',
      features:['Maxsus sertifikat shablonlari','Ommaviy berish (CSV yuklash)','Avtomatik yetkazish va bildirishnomalar','Raqamli imzo muvofiqlik'],
    },
    {
      icon:MagnifyingGlassIcon, color:'#60a5fa', bg:'rgba(59,130,246,0.1)', border:'rgba(59,130,246,0.3)',
      title:'Ommaviy Tekshiruv Portali',
      subtitle:'Ish Beruvchilar va Davlat Organlari uchun',
      desc:'Certify.uz tarmog\'ida berilgan istalgan sertifikatni darhol tekshiring. O\'zbekiston bo\'ylab 200+ tashkilot tomonidan ishonilgan.',
      features:['Darhol QR va ID tekshiruvi','Ommaviy tekshiruv API','Firibgarlikni aniqlash ogohlantirishlari','Audit yo\'li va hisobotlar'],
    },
    {
      icon:CodeBracketIcon, color:'#34d399', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.3)',
      title:'Korporativ API',
      subtitle:'Dasturchilar va Korxonalar uchun',
      desc:'Webhook, OAuth 2.0 va SDK qo\'llab-quvvatlash bilan to\'liq funksiyali REST API. Diplom boshqaruvini mavjud tizimlaringizga muammosiz joylashtiring.',
      features:['REST va GraphQL so\'nggi nuqtalari','Webhooklar va real vaqt hodisalari','SDKlar: Python, JS, PHP, Go','99.99% ishlash kafolati SLA'],
    },
  ]

  const pricingPlans = [
    {
      name:'Boshlang\'ich', price:'Bepul', period:'abadiy',
      desc:'Jismoniy shaxslar va kichik loyihalar uchun ideal',
      color:'#60a5fa',
      features:[
        { text:'Oyiga 50 ta tekshiruv',          ok:true  },
        { text:'3 ta sertifikat shabloni',        ok:true  },
        { text:'QR kod generatsiyasi',            ok:true  },
        { text:'Ommaviy tekshiruv sahifasi',      ok:true  },
        { text:'API kirish',                      ok:false },
        { text:'Maxsus brending',                 ok:false },
        { text:'Ustunlik qo\'llab-quvvatlash',   ok:false },
      ],
      cta:'Bepul Boshlash',
      ctaHref:'/register',
    },
    {
      name:'Professional', price:'99 000 so\'m', period:'/ oy',
      desc:'Kengayib borayotgan tashkilotlar uchun',
      color:'#a78bfa',
      featured:true,
      badge:'Eng Mashhur',
      features:[
        { text:'Oyiga 5,000 ta tekshiruv',       ok:true },
        { text:'Cheksiz shablonlar',             ok:true },
        { text:'QR + NFC tekshiruvi',            ok:true },
        { text:'White-label portal',             ok:true },
        { text:'To\'liq API kirish',             ok:true },
        { text:'Maxsus brending',                ok:true },
        { text:'Ustunlik qo\'llab-quvvatlash (24 soat)', ok:true },
      ],
      cta:'Bepul Sinov Boshlash',
      ctaHref:'/register?plan=pro',
    },
    {
      name:'Korporativ', price:'299 000 so\'m', period:'/ oy',
      desc:'Murakkab ehtiyojlari bo\'lgan yirik muassasalar uchun',
      color:'#34d399',
      features:[
        { text:'Cheksiz tekshiruvlar',           ok:true },
        { text:'Hamma narsa cheksiz',            ok:true },
        { text:'Maxsus infratuzilma',            ok:true },
        { text:'SSO / SAML integratsiyasi',      ok:true },
        { text:'Blokcheyn ankerlash',            ok:true },
        { text:'99.99% ishlash kafolati SLA',    ok:true },
        { text:'Maxsus CSM va qo\'llab-quvvatlash', ok:true },
      ],
      cta:'Bog\'lanish',
      ctaHref:'/register?plan=enterprise',
    },
  ]

  const testimonials = [
    {
      name:'Dr. Kamol Tursunov',   role:'Rektor, Toshkent Davlat Universiteti',
      avatar:'K', rating:5,
      text:'Certify.uz akademik diplomlarni berish va boshqarish usulimizni o\'zgartirdi. Birinchi semestrda firibgarlik holatlari nolga tushdi. Ish beruvchilar bizning sertifikatlarimizga ilgarigidan ko\'ra ko\'proq ishonadi.',
      badge:'12K+ sertifikat berildi',
    },
    {
      name:'Shahlo Nazarova',       role:'HR Direktori, Uzum Technologies',
      avatar:'S', rating:5,
      text:'Nomzodlarning diplom ma\'lumotlarini tekshirish 3-5 kun vaqt olardi. Certify.uz API bilan bu darhol bo\'ldi. Ishga qabul qilish jarayonida yuzlab soatni tejadik va soxta diplom topshirishlarni yo\'q qildik.',
      badge:'500+ darhol tasdiqlandi',
    },
    {
      name:'Firdavs Mirzayev',      role:'Direktor, Raqamli Ko\'nikmalar Akademiyasi',
      avatar:'F', rating:5,
      text:'Bizning bitiruvchilarimiz blokcheyn-asosidagi sertifikatlar olishni yaxshi ko\'rishadi. Bu ularga ish bozorida professional ustunlik beradi. White-label portal bizning jamoamiz uchun sozlashni juda oson qildi.',
      badge:'8K talabaga xizmat ko\'rsatildi',
    },
  ]

  const faqs = [
    {
      q:'Certify.uz sertifikatlarni soxtalashtirib bo\'lmasligini qanday ta\'minlaydi?',
      a:'Har bir sertifikat SHA-256 bilan kriptografik tarzda imzolanadi va blokcheyn reyestriga biriktiriladi. Har qanday o\'zgartirish imzoni bekor qiladi va QR yoki ID tekshiruvi paytida darhol aniqlanadi. AI firibgarlikni aniqlash qatlami qo\'shimcha real vaqt tekshiruvini amalga oshiradi.',
    },
    {
      q:'Tashkilotim uchun sertifikat berish tizimini sozlash qancha vaqt oladi?',
      a:'Ko\'pchilik tashkilotlar 24 soat ichida ishga tushadi. Onboarding jamoamiz maxsus shablon, API kalitlari va yo\'l-yo\'riq sessiyasini taqdim etadi. Maxsus integratsiyali korporativ o\'rnatish uchun odatda 3-5 ish kuni ketadi.',
    },
    {
      q:'Hisob yaratmasdan sertifikatni tekshirish mumkinmi?',
      a:'Ha. Istalgan kishi sertifikat ID yoki QR kodni skanerlash orqali certify.uz/verify saytidagi ommaviy portalimizda sertifikatni tekshira oladi. Tekshiruv uchun hisob yoki tizimga kirish talab qilinmaydi.',
    },
    {
      q:'Sertifikat shablonlari uchun qanday fayl formatlari qo\'llab-quvvatlanadi?',
      a:'Biz PDF, SVG va PNG shablonlarini qo\'llab-quvvatlaymiz. O\'z dizayningizni yuklashingiz yoki sudrab va tashlab shablon yaratuvchimizdan foydalanishingiz mumkin. Maxsus shriftlar, logotiplar, imzolar va QR kod joylashuvi to\'liq sozlanadi.',
    },
    {
      q:'Certify.uz-da saqlangan ma\'lumotlar GDPR / mahalliy qonunlarga muvofiqqmi?',
      a:'Ha. Barcha ma\'lumotlar sertifikatlangan infratuzilmada O\'zbekiston ichida saqlanadi. Biz O\'zbekistonning shaxsiy ma\'lumotlar qonunlariga (ZRU-547-son qonun) muvofiqmiz va xalqaro hamkorlar uchun GDPR tamoyillariga amal qilamiz.',
    },
    {
      q:'Talaba o\'z sertifikatini yo\'qotib qo\'ysa nima bo\'ladi?',
      a:'Sertifikatlar doimiy ravishda saqlanadi va istalgan vaqt talabalar portali orqali qayta yuklab olinishi mumkin. Tashkilotlar ham bitta bosish bilan sertifikatlarni qayta bera oladi. Asl blokcheyn yozuvi abadiy saqlanadi va tekshirilishi mumkin.',
    },
  ]

  return (
    <div className="overflow-x-hidden">

      {/* ═══ QAHRAMONLIK (HERO) ═══ */}
      <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 80% 60% at 50% -10%,rgba(124,58,237,0.22) 0%,transparent 70%),radial-gradient(ellipse 60% 50% at 80% 60%,rgba(37,99,235,0.15) 0%,transparent 60%),#020B18' }} />
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage:'radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'32px 32px' }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background:'rgba(124,58,237,0.12)', animation:'blob 9s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background:'rgba(37,99,235,0.1)', animation:'blob 12s ease-in-out infinite', animationDelay:'4s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Chap: Matn */}
            <div style={{ animation:'fadeInUp 0.8s ease-out' }}>
              <div className="section-tag mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                O'zbekistondagi 200+ tashkilot tomonidan ishonilgan
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
                <span className="gradient-text">Tasdiqlang. Ishoning.</span>
                <br />
                <span className="text-white">Sertifikat.</span>
              </h1>

              <p className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-8 max-w-xl">
                O'zbekistondagi eng xavfsiz raqamli diplom platformasi. Buzib bo'lmaydigan sertifikatlar bering, QR orqali darhol tekshiring va diplom firibgarligini bartaraf eting — hammasi bir platformada.
              </p>

              {/* Darhol tekshiruv */}
              <form onSubmit={handleVerify} className="flex gap-2 mb-8 max-w-md">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Sertifikat ID kiriting (masalan: CZ-2025-8472)"
                    value={verifyId}
                    onChange={e => { setVerifyId(e.target.value); setVerifyState('idle') }}
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => { e.target.style.borderColor='rgba(139,92,246,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(139,92,246,0.12)' }}
                    onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                  />
                </div>
                <button type="submit" disabled={verifyState==='loading'}
                  className="px-5 py-3.5 rounded-xl font-bold text-sm text-white shrink-0 transition-all disabled:opacity-60"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow:'0 0 20px rgba(124,58,237,0.4)' }}>
                  {verifyState==='loading' ? '...' : 'Tekshirish'}
                </button>
              </form>

              {verifyState==='success' && (
                <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-xl text-sm" style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', animation:'fadeIn 0.4s ease-out', color:'#34d399' }}>
                  <CheckCircleSolid className="w-5 h-5 shrink-0" />
                  <span><strong>Sertifikat haqiqiy!</strong> Aziz Karimovga berilgan • Toshkent Davlat Universiteti • 15 yanvar, 2025</span>
                </div>
              )}
              {verifyState==='error' && (
                <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-xl text-sm" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', animation:'fadeIn 0.4s ease-out', color:'#f87171' }}>
                  <XMarkIcon className="w-5 h-5 shrink-0" />
                  <span>Sertifikat ID topilmadi. Iltimos, IDni tekshiring va qaytadan urinib ko'ring.</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/register" className="btn-gradient inline-flex items-center gap-2 justify-center">
                  Sertifikat Berish <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <a href="#demo" className="btn-glass inline-flex items-center gap-2 justify-center">
                  <QrCodeIcon className="w-5 h-5" /> Demo Ko'rish
                </a>
              </div>

              <div className="flex flex-wrap gap-4">
                {[
                  { icon:LockClosedIcon,  label:'256-bit Shifrlash' },
                  { icon:ShieldCheckIcon, label:'ISO 27001 Muvofiq' },
                  { icon:BoltIcon,        label:'99.9% Ishlash Kafolati' },
                ].map(({ icon:Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Icon className="w-3.5 h-3.5 text-slate-600" /> {label}
                  </div>
                ))}
              </div>
            </div>

            {/* O'ng: Sertifikat maketi */}
            <div className="relative flex justify-center lg:justify-end" style={{ animation:'fadeInUp 0.8s ease-out 0.2s both' }}>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full" style={{ border:'1px solid rgba(139,92,246,0.12)', animation:'spinSlow 22s linear infinite' }} />
                <div className="absolute w-96 h-96 rounded-full" style={{ border:'1px solid rgba(59,130,246,0.08)', animation:'spinSlow 30s linear infinite reverse' }} />
              </div>

              <div className="absolute -top-4 -left-4 z-20 px-3 py-2 rounded-xl" style={{ background:'rgba(8,15,30,0.9)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(12px)', animation:'float-slow 8s ease-in-out infinite' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:'rgba(16,185,129,0.15)' }}>
                    <CheckCircleSolid className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">500K+</div>
                    <div className="text-slate-500 text-[10px]">Sertifikatlar tasdiqlandi</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 z-20 px-3 py-2 rounded-xl" style={{ background:'rgba(8,15,30,0.9)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(12px)', animation:'float 7s ease-in-out infinite', animationDelay:'3s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:'rgba(139,92,246,0.15)' }}>
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">Firibgarlik yo'q</div>
                    <div className="text-slate-500 text-[10px]">2024 yildan</div>
                  </div>
                </div>
              </div>

              <CertificateMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATISTIKA ═══ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background:'linear-gradient(180deg,transparent,rgba(124,58,237,0.05) 50%,transparent)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value,suffix,label,color,glow,decimals,target }) => (
              <div key={label} className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl lg:text-5xl font-black mb-2 tabular-nums" style={{ color, textShadow:`0 0 30px ${glow}` }}>
                  <Counter target={target??value} suffix={suffix} decimals={decimals??0} />
                </div>
                <div className="text-slate-500 text-sm font-medium">{label}</div>
                <div className="mt-3 h-0.5 rounded-full mx-auto w-12 transition-all duration-300 group-hover:w-20" style={{ background:`linear-gradient(90deg,transparent,${color},transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ XUSUSIYATLAR ═══ */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-5 w-fit">Platforma Xususiyatlari</div>
            <h2 className="text-4xl lg:text-5xl font-black mb-5">
              <span className="gradient-text">Korporativ darajadagi</span>
              <br />
              <span className="text-white">har qatlamda xavfsizlik</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Sertifikat yaxlitligini jiddiy qabul qiladigan muassasalar uchun qurilgan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon:Icon, title, desc, color, glow }) => (
              <div key={title} className="glass-card-hover p-7 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                     style={{ background:`rgba(${color==='#a78bfa'?'167,139,250':color==='#60a5fa'?'96,165,250':color==='#f472b6'?'244,114,182':color==='#34d399'?'52,211,153':color==='#fbbf24'?'251,191,36':'34,211,238'},0.15)`, boxShadow:`0 0 20px ${glow}` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2.5">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ YECHIMLAR ═══ */}
      <section id="services" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 70% 50% at 50% 50%,rgba(124,58,237,0.07) 0%,transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-5 w-fit">Yechimlar</div>
            <h2 className="text-4xl lg:text-5xl font-black mb-5 text-white">Bir platforma,<br /><span className="gradient-text">har qanday holat</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Sertifikat bering, tekshiring yoki integratsiya qiling — Certify.uz sizni qamrab oladi.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map(({ icon:Icon, color, bg, border, title, subtitle, desc, features:feats }) => (
              <div key={title} className="glass-card p-8 group hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                     style={{ background:bg, border:`1px solid ${border}`, boxShadow:`0 0 24px ${bg}` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <div className="text-[11px] font-bold tracking-wider uppercase mb-2" style={{ color }}>{subtitle}</div>
                <h3 className="text-white font-black text-2xl mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{desc}</p>
                <ul className="space-y-2.5 mt-auto">
                  {feats.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <CheckCircleSolid className="w-4 h-4 shrink-0" style={{ color }} />{f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <a href="/#pricing" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-3 transition-all duration-200" style={{ color }}>
                    Batafsil <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOSHQARUV PANELI KO'RINISHI ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(37,99,235,0.07) 0%,transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-5 w-fit">Boshqaruv Markazi</div>
            <h2 className="text-4xl lg:text-5xl font-black mb-5 text-white">
              Diplom ekotizimingizga<br /><span className="gradient-text">to'liq ko'rinish</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Har bir berilgan, tasdiqlangan va bekor qilingan sertifikatga real vaqtda tushuncha beradigan kuchli boshqaruv paneli.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl blur-2xl -z-10 opacity-30"
                 style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(37,99,235,0.4))' }} />
            <DashboardPreview />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {['Real vaqt tahlili','Firibgarlik ogohlantirishlari','Ommaviy operatsiyalar','PDF/CSV ga eksport','Rol asosidagi kirish','Audit jurnallari'].map(f => (
              <div key={f} className="px-4 py-2 rounded-full text-sm text-slate-400" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QR DEMO ═══ */}
      <section id="demo" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 70% 60% at 20% 50%,rgba(124,58,237,0.08) 0%,transparent 60%),radial-gradient(ellipse 70% 60% at 80% 50%,rgba(37,99,235,0.06) 0%,transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-5 w-fit">Jonli Demo</div>
            <h2 className="text-4xl lg:text-5xl font-black mb-5 text-white">
              2 soniyadan kamroqda<br /><span className="gradient-text">tekshiruv</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              AI-asosidagi tekshiruv mexanizmimizning haqiqiy sertifikatni real vaqtda tasdiqlaganini kuzating.
            </p>
          </div>
          <QRVerifyDemo />
        </div>
      </section>

      {/* ═══ NARXLAR ═══ */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize:'32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-5 w-fit">Narxlar</div>
            <h2 className="text-4xl lg:text-5xl font-black mb-5 text-white">
              Bepul boshlang,<br /><span className="gradient-text">ishonch bilan rivojlaning</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Ochilish narxlari — keyinchalik oshadi. Hozir arzon narxda boshlang va imkoniyatlardan to'liq foydalaning.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {pricingPlans.map(({ name,price,period,desc,color,featured,badge,features:feats,cta,ctaHref }) => (
              <div key={name} className={`relative ${featured?'glass-card-pricing-featured lg:-mt-4 lg:mb-4':'glass-card-pricing'} p-8 flex flex-col`}>
                {featured && badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black tracking-wider text-white"
                       style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow:'0 0 20px rgba(124,58,237,0.5)' }}>
                    {badge}
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-black text-xl mb-1">{name}</h3>
                  <p className="text-slate-500 text-sm">{desc}</p>
                </div>
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black" style={{ color }}>{price}</span>
                    {period && <span className="text-slate-500 text-sm mb-2">{period}</span>}
                  </div>
                  {price!=='Bepul' && price!=='Alohida' && (
                    <p className="text-slate-600 text-xs mt-1">Oylik to'lov. Yillik rejalarda 25% tejaladi.</p>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {feats.map(({ text,ok }) => (
                    <li key={text} className="flex items-start gap-2.5 text-sm">
                      {ok
                        ? <CheckCircleSolid className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
                        : <XMarkIcon className="w-4 h-4 shrink-0 mt-0.5 text-slate-700" />
                      }
                      <span className={ok?'text-slate-300':'text-slate-600'}>{text}</span>
                    </li>
                  ))}
                </ul>
                <Link href={ctaHref}
                  className="w-full py-3.5 rounded-xl text-sm font-black text-center transition-all duration-200 hover:-translate-y-1"
                  style={featured
                    ? { background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'white', boxShadow:'0 0 25px rgba(124,58,237,0.4)' }
                    : { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'white' }
                  }>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SHARHLAR ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 80% 50% at 50% 50%,rgba(124,58,237,0.06) 0%,transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-5 w-fit">Sharhlar</div>
            <h2 className="text-4xl lg:text-5xl font-black mb-5 text-white">
              O'zbekiston bo'ylab<br /><span className="gradient-text">rahbarlar ishonadi</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name,role,avatar,rating,text,badge },i) => (
              <div key={i} className="glass-card-hover p-7 flex flex-col">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(rating)].map((_,j) => <StarSolid key={j} className="w-4 h-4 text-amber-400" />)}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-3 pt-5" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                       style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                    {avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-bold text-sm truncate">{name}</div>
                    <div className="text-slate-600 text-xs truncate">{role}</div>
                  </div>
                  <div className="ml-auto shrink-0">
                    <span className="badge-glow text-[10px]">{badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 glass-card px-8 py-5 flex flex-wrap items-center justify-center gap-8">
            {['Toshkent Davlat Universiteti','Uzum Technologies','Raqamli Ko\'nikmalar Akademiyasi','Ta\'lim Vazirligi','EPAM O\'zbekiston','Kapital Bank'].map(org => (
              <span key={org} className="text-slate-600 text-sm font-medium hover:text-slate-400 transition-colors">{org}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KO'P SO'RALADIGAN SAVOLLAR ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-5 w-fit">Ko'p So'raladigan Savollar</div>
            <h2 className="text-4xl lg:text-5xl font-black mb-5 text-white">
              Keng tarqalgan <span className="gradient-text">savollar</span>
            </h2>
            <p className="text-slate-500 text-lg">Certify.uz haqida bilishingiz kerak bo'lgan hamma narsa</p>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q,a }) => <FAQItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>


      {/* ═══ CHAQIRUV BANNERI ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 100% 80% at 50% 50%,rgba(124,58,237,0.18) 0%,rgba(37,99,235,0.1) 40%,transparent 70%)' }} />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage:'radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'24px 24px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-tag mx-auto mb-8 w-fit">Bugun Boshlang</div>
          <h2 className="text-5xl lg:text-6xl font-black mb-6 gradient-text leading-tight">
            Qog'oz sertifikatlar davri tugadi.
          </h2>
          <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Allaqachon 200+ tashkilot ish beruvchilar ishona oladigan raqamli diplomlar bermoqda. Boshlash bepul. Kredit karta talab qilinmaydi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-gradient inline-flex items-center gap-2 justify-center text-lg px-10 py-4">
              Bepul Boshlash <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <a href="#demo" className="btn-glass inline-flex items-center gap-2 justify-center text-lg px-10 py-4">
              <QrCodeIcon className="w-5 h-5" /> Demo Ko'rish
            </a>
          </div>
          <p className="text-slate-600 text-sm mt-6">
            Kredit karta talab qilinmaydi · 14 kunlik bepul sinov · Istalgan vaqt bekor qiling
          </p>
        </div>
      </section>

    </div>
  )
}
