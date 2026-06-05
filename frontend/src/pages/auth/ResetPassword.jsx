import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { authAPI } from '@/api/payments'
import { AcademicCapIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Parollar mos kelmadi')
      return
    }
    if (password.length < 8) {
      toast.error('Parol kamida 8 ta belgi bo\'lishi kerak')
      return
    }
    try {
      setLoading(true)
      await authAPI.resetPassword(token, password)
      toast.success('Parol muvaffaqiyatli tiklandi!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Xatolik. Token eskirgan bo\'lishi mumkin.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">❌</div>
        <p className="text-gray-600">Noto'g'ri havola</p>
        <Link to="/forgot-password" className="btn-primary mt-4 inline-block">Qayta so'rash</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-purple-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <AcademicCapIcon className="w-7 h-7 text-primary-700" />
            </div>
            <span className="text-2xl font-bold text-white">Certify.uz</span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Yangi parol o'rnating</h2>
          <p className="text-gray-500 mb-6 text-sm">Kamida 8 ta belgidan iborat parol kiriting</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parol</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input-field" placeholder="••••••••" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlang</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Saqlanmoqda...' : 'Parolni saqlash'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
