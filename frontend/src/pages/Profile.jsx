import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { authAPI } from '@/api/auth'
import { paymentsAPI } from '@/api/payments'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { UserCircleIcon, CameraIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

export default function Profile() {
  const { user } = useSelector(s => s.auth)
  const [subscription, setSubscription] = useState(null)
  const [tab, setTab] = useState('profile')
  const { register, handleSubmit, setValue } = useForm()
  const { register: regPwd, handleSubmit: handlePwd, watch } = useForm()

  useEffect(() => {
    setValue('first_name', user?.first_name || '')
    setValue('last_name', user?.last_name || '')
    setValue('phone', user?.phone || '')
    setValue('bio', user?.bio || '')
    setValue('school', user?.school || '')
    setValue('region', user?.region || '')

    paymentsAPI.getMySubscription().then(({ data }) => setSubscription(data)).catch(() => {})
  }, [user])

  const onSave = async (data) => {
    try {
      await authAPI.updateProfile(data)
      toast.success('Profil yangilandi!')
    } catch {
      toast.error('Xatolik yuz berdi')
    }
  }

  const onChangePassword = async (data) => {
    try {
      await authAPI.changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
        new_password2: data.confirm_new,
      })
      toast.success('Parol o\'zgartirildi!')
    } catch (err) {
      toast.error(err.response?.data?.old_password?.[0] || 'Xatolik')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">⚙️ Profil sozlamalari</h1>

        {/* Profile header */}
        <div className="card p-6 mb-6 flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary-700">
              {user?.first_name?.[0] || user?.username?.[0] || '?'}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            {user?.is_premium && (
              <span className="badge bg-amber-100 text-amber-700 mt-1">
                ⭐ Premium · {new Date(user.premium_until).toLocaleDateString('uz-UZ')} gacha
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6">
          {[
            { id: 'profile', label: 'Profil' },
            { id: 'password', label: 'Parol' },
            { id: 'subscription', label: 'Obuna' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card p-6">
              <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                    <input {...register('first_name')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
                    <input {...register('last_name')} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input {...register('phone')} className="input-field" placeholder="+998 90 123 45 67" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maktab/Universitet</label>
                  <input {...register('school')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Viloyat</label>
                  <select {...register('region')} className="input-field">
                    <option value="">Tanlang</option>
                    {['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Farg\'ona', 'Namangan',
                      'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo',
                      'Qoraqalpog\'iston'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">O'zingiz haqingizda</label>
                  <textarea {...register('bio')} className="input-field" rows={3} />
                </div>
                <button type="submit" className="btn-primary">Saqlash</button>
              </form>
            </div>
          </motion.div>
        )}

        {tab === 'password' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card p-6">
              <form onSubmit={handlePwd(onChangePassword)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hozirgi parol</label>
                  <input {...regPwd('old_password', { required: true })} type="password" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parol</label>
                  <input {...regPwd('new_password', { required: true, minLength: 8 })} type="password" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parolni tasdiqlang</label>
                  <input {...regPwd('confirm_new', { required: true, validate: v => v === watch('new_password') || 'Parollar mos kelmadi' })} type="password" className="input-field" />
                </div>
                <button type="submit" className="btn-primary">Parolni o'zgartirish</button>
              </form>
            </div>
          </motion.div>
        )}

        {tab === 'subscription' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card p-6">
              {subscription?.subscription ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">Faol obuna: {subscription.subscription.plan.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(subscription.subscription.end_date).toLocaleDateString('uz-UZ')} gacha
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {subscription.subscription.plan.features.map((f, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="text-green-500">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">💎</div>
                  <h3 className="font-bold text-gray-900 mb-2">Premium obuna yo'q</h3>
                  <p className="text-gray-500 text-sm mb-4">Premium bilan barcha imkoniyatlardan foydalaning</p>
                  <a href="/pricing" className="btn-primary">Premium olish</a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
