import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '@/store/authSlice'
import { AcademicCapIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated } = useSelector(s => s.auth)
  const password = watch('password')

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated])

  const onSubmit = (data) => {
    const { confirm_password, ...rest } = data
    dispatch(registerUser({ ...rest, password2: confirm_password }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-purple-900 flex items-center justify-center px-4 py-10">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Ro'yxatdan o'ting</h2>
          <p className="text-gray-500 mb-6">Bepul hisob oching va bugun boshlang!</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                <input
                  {...register('first_name', { required: 'Ism kiriting' })}
                  className="input-field"
                  placeholder="Ismingiz"
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
                <input
                  {...register('last_name', { required: 'Familiya kiriting' })}
                  className="input-field"
                  placeholder="Familiyangiz"
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                {...register('username', {
                  required: 'Username kiriting',
                  minLength: { value: 3, message: 'Kamida 3 ta belgi' }
                })}
                className="input-field"
                placeholder="username"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...register('email', {
                  required: 'Email kiriting',
                  pattern: { value: /^\S+@\S+$/i, message: "To'g'ri email kiriting" }
                })}
                type="email"
                className="input-field"
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                {...register('phone')}
                type="tel"
                className="input-field"
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
              <input
                {...register('password', {
                  required: 'Parol kiriting',
                  minLength: { value: 8, message: 'Kamida 8 ta belgi' }
                })}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlang</label>
              <input
                {...register('confirm_password', {
                  required: 'Parolni tasdiqlang',
                  validate: v => v === password || 'Parollar mos kelmadi'
                })}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
              {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Kirish</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
