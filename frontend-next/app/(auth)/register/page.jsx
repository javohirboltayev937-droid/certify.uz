'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '@/lib/store/authSlice'
import { AcademicCapIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function Register() {
  const [form, setForm] = useState({ first_name:'', last_name:'', username:'', email:'', phone:'', password:'', confirm_password:'' })
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, isAuthenticated } = useSelector(s => s.auth)

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated])

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.first_name) errs.first_name = 'Ism kiriting'
    if (!form.last_name) errs.last_name = 'Familiya kiriting'
    if (!form.username || form.username.length < 3) errs.username = 'Kamida 3 ta belgi'
    if (!form.email || !/^\S+@\S+$/.test(form.email)) errs.email = "To'g'ri email kiriting"
    if (!form.password || form.password.length < 8) errs.password = 'Kamida 8 ta belgi'
    if (form.confirm_password !== form.password) errs.confirm_password = 'Parollar mos kelmadi'
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      const { confirm_password, ...rest } = form
      dispatch(registerUser({ ...rest, password2: confirm_password }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-purple-900 flex items-center justify-center px-4 py-10">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Ro'yxatdan o'ting</h2>
          <p className="text-gray-500 mb-6">Bepul hisob oching va bugun boshlang!</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                <input value={form.first_name} onChange={set('first_name')} className="input" placeholder="Ismingiz" />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
                <input value={form.last_name} onChange={set('last_name')} className="input" placeholder="Familiyangiz" />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input value={form.username} onChange={set('username')} className="input" placeholder="username" />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={set('email')} className="input" placeholder="email@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input type="tel" value={form.phone} onChange={set('phone')} className="input" placeholder="+998 90 123 45 67" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
              <input type="password" value={form.password} onChange={set('password')} className="input" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlang</label>
              <input type="password" value={form.confirm_password} onChange={set('confirm_password')} className="input" placeholder="••••••••" />
              {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60">
              {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Hisobingiz bormi?{' '}
            <Link href="/login" className="text-primary-600 font-semibold hover:underline">Kirish</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
