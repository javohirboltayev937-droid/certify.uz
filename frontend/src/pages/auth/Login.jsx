import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '@/store/authSlice'
import { AcademicCapIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated } = useSelector(s => s.auth)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated])

  const onSubmit = (data) => dispatch(loginUser(data))

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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Xush kelibsiz!</h2>
          <p className="text-gray-500 mb-6">Hisobingizga kiring</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login yoki Email</label>
              <input
                {...register('username', { required: 'Login kiriting' })}
                className="input-field"
                placeholder="username yoki email@example.com"
                autoComplete="username"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Parol</label>
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">
                  Parolni unutdingizmi?
                </Link>
              </div>
              <input
                {...register('password', { required: 'Parol kiriting' })}
                type="password"
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
              {loading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Hisob yo'qmi?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
