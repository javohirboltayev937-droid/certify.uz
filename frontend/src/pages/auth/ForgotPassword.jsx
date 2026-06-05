import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '@/api/payments'
import { AcademicCapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
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
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

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
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Xat yuborildi!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Agar <strong>{email}</strong> mavjud bo'lsa, parol tiklash ko'rsatmasi yuborildi.
                Spam papkasini ham tekshiring.
              </p>
              <Link to="/login" className="btn-primary w-full block text-center">
                Kirishga qaytish
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                <ArrowLeftIcon className="w-4 h-4" /> Kirishga qaytish
              </Link>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Parolni tiklash</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Email manzilingizni kiriting — ko'rsatma yuboramiz
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Yuborilmoqda...' : 'Ko\'rsatma yuborish'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
