'use client'
import { useState } from 'react'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { ShieldCheckIcon, ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      setLoading(true)
      await authAPI.forgotPassword({ email })
      setSent(true)
    } catch {
      toast.error('Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

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
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ background: 'rgba(16,185,129,0.15)' }}>
                <EnvelopeIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Xat yuborildi!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Agar <strong className="text-white">{email}</strong> mavjud bo'lsa, parol tiklash
                ko'rsatmasi yuborildi. Spam papkasini ham tekshiring.
              </p>
              <Link href="/login" className="btn-gradient w-full justify-center block text-center py-3">
                Kirishga qaytish
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 mb-5 transition-colors">
                <ArrowLeftIcon className="w-4 h-4" /> Kirishga qaytish
              </Link>
              <h2 className="text-2xl font-bold text-white mb-1">Parolni tiklash</h2>
              <p className="text-slate-400 mb-6 text-sm">
                Email manzilingizni kiriting — ko'rsatma yuboramiz
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input" placeholder="email@example.com" required />
                </div>
                <button type="submit" disabled={loading} className="btn-gradient w-full justify-center py-3 disabled:opacity-50">
                  {loading ? 'Yuborilmoqda...' : "Ko'rsatma yuborish"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
