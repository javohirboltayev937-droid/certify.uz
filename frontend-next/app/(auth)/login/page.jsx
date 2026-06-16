'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '@/lib/store/authSlice'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, isAuthenticated } = useSelector(s => s.auth)

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated])

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!phone) errs.phone = 'Telefon raqam kiriting'
    if (!password) errs.password = 'Parol kiriting'
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      try {
        await dispatch(loginUser({ phone, password })).unwrap()
      } catch (err) {
        setErrors({ password: err?.non_field_errors?.[0] || err?.detail || 'Telefon yoki parol noto\'g\'ri' })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: '#020B18' }}>
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
          <h2 className="text-2xl font-bold text-white mb-1">Xush kelibsiz!</h2>
          <p className="text-slate-400 mb-6">Hisobingizga kiring</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label">Telefon raqam</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="input" placeholder="+998 90 123 45 67" autoComplete="tel" />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Parol</label>
                <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300">
                  Parolni unutdingizmi?
                </Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input" placeholder="••••••••" autoComplete="current-password" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-gradient w-full justify-center py-3.5 disabled:opacity-60">
              {loading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-400">
            Hisob yo'qmi?{' '}
            <Link href="/register" className="text-violet-400 font-semibold hover:text-violet-300">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
