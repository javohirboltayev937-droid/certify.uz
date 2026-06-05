'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '@/lib/store/authSlice'
import { AcademicCapIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, isAuthenticated } = useSelector(s => s.auth)

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated])

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!username) errs.username = 'Login kiriting'
    if (!password) errs.password = 'Parol kiriting'
    setErrors(errs)
    if (Object.keys(errs).length === 0) dispatch(loginUser({ username, password }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-purple-900 flex items-center justify-center px-4">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <AcademicCapIcon className="w-7 h-7 text-primary-700" />
            </div>
            <span className="text-2xl font-bold text-white">Certify.uz</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Xush kelibsiz!</h2>
          <p className="text-gray-500 mb-6">Hisobingizga kiring</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login yoki Email</label>
              <input value={username} onChange={e => setUsername(e.target.value)}
                className="input" placeholder="username yoki email@example.com" autoComplete="username" />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Parol</label>
                <Link href="/forgot-password" className="text-xs text-primary-600 hover:underline">
                  Parolni unutdingizmi?
                </Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input" placeholder="••••••••" autoComplete="current-password" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60">
              {loading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Hisob yo'qmi?{' '}
            <Link href="/register" className="text-primary-600 font-semibold hover:underline">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
