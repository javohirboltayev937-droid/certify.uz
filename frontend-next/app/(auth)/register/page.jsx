'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '@/lib/store/authSlice'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ first_name:'', last_name:'', phone:'', password:'', confirm_password:'' })
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, isAuthenticated } = useSelector(s => s.auth)

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated])

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.first_name) errs.first_name = 'Ism kiriting'
    if (!form.last_name) errs.last_name = 'Familiya kiriting'
    if (!form.phone || form.phone.replace(/\D/g, '').length < 7) errs.phone = "To'g'ri telefon raqam kiriting"
    if (!form.password || form.password.length < 8) errs.password = 'Kamida 8 ta belgi'
    if (form.confirm_password !== form.password) errs.confirm_password = 'Parollar mos kelmadi'
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      const { confirm_password, ...rest } = form
      try {
        await dispatch(registerUser({ ...rest, password2: confirm_password })).unwrap()
      } catch (err) {
        const msg = err?.phone?.[0] || err?.password?.[0] || err?.first_name?.[0] ||
                    err?.last_name?.[0] || err?.detail || "Ro'yxatdan o'tishda xatolik"
        toast.error(msg)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden" style={{ background: '#020B18' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20"
             style={{ background: 'radial-gradient(circle, #7c3aed 0%, #2563eb 50%, transparent 80%)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
              <ShieldCheckIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Certify<span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#a78bfa,#60a5fa)' }}>.uz</span></span>
          </Link>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Ro'yxatdan o'ting</h2>
          <p className="text-slate-400 mb-6">Bepul hisob oching va bugun boshlang!</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Ism</label>
                <input value={form.first_name} onChange={set('first_name')} className="input" placeholder="Ismingiz" />
                {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="label">Familiya</label>
                <input value={form.last_name} onChange={set('last_name')} className="input" placeholder="Familiyangiz" />
                {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label className="label">Telefon raqam</label>
              <input type="tel" value={form.phone} onChange={set('phone')} className="input" placeholder="+998 90 123 45 67" autoComplete="tel" />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="label">Parol</label>
              <input type="password" value={form.password} onChange={set('password')} className="input" placeholder="••••••••" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="label">Parolni tasdiqlang</label>
              <input type="password" value={form.confirm_password} onChange={set('confirm_password')} className="input" placeholder="••••••••" />
              {errors.confirm_password && <p className="text-red-400 text-xs mt-1">{errors.confirm_password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-gradient w-full justify-center py-3.5 disabled:opacity-60">
              {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-400">
            Hisobingiz bormi?{' '}
            <Link href="/login" className="text-violet-400 font-semibold hover:text-violet-300">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
