'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { ShieldCheckIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { toast.error('Parollar mos kelmadi'); return }
    if (password.length < 8) { toast.error("Parol kamida 8 ta belgi bo'lishi kerak"); return }
    try {
      setLoading(true)
      await authAPI.resetPassword({ token, password })
      toast.success('Parol muvaffaqiyatli tiklandi!')
      router.push('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || "Xatolik. Token eskirgan bo'lishi mumkin.")
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
             style={{ background: 'rgba(239,68,68,0.15)' }}>
          <XCircleIcon className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-slate-400 mb-4">Noto'g'ri havola</p>
        <Link href="/forgot-password" className="btn-gradient inline-flex px-6 py-2.5">Qayta so'rash</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-15"
             style={{ background: 'radial-gradient(circle, #7c3aed 0%, #4f46e5 60%, transparent 80%)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              <ShieldCheckIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Certify.uz</span>
          </Link>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Yangi parol o'rnating</h2>
          <p className="text-slate-400 mb-6 text-sm">Kamida 8 ta belgidan iborat parol kiriting</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Yangi parol</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input" placeholder="••••••••" required />
            </div>
            <div>
              <label className="label">Parolni tasdiqlang</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                className="input" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-gradient w-full justify-center py-3 disabled:opacity-50">
              {loading ? 'Saqlanmoqda...' : 'Parolni saqlash'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  )
}
