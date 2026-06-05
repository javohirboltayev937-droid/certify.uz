'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfile } from '@/lib/store/authSlice'
import { authAPI, paymentsAPI } from '@/lib/api'
import { ShieldCheckIcon, CheckCircleIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { PageLoader } from '@/components/ui'
import toast from 'react-hot-toast'

export default function Profile() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, initialized } = useSelector(s => s.auth)
  const [subscription, setSubscription] = useState(null)
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  // profile form state
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', bio: '', school: '', region: '' })
  // password form state
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm_new: '' })

  useEffect(() => {
    if (initialized && !isAuthenticated) { router.push('/login'); return }
    if (!initialized) return
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name:  user.last_name  || '',
        phone:      user.phone      || '',
        bio:        user.bio        || '',
        school:     user.school     || '',
        region:     user.region     || '',
      })
    }
    paymentsAPI.getMySubscription().then(r => setSubscription(r.data)).catch(() => {})
  }, [initialized, isAuthenticated, user])

  if (!initialized || !user) return <PageLoader />

  const onSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.updateProfile(form)
      await dispatch(fetchProfile())
      toast.success('Profil yangilandi!')
    } catch { toast.error('Xatolik yuz berdi') } finally { setLoading(false) }
  }

  const onChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.confirm_new) { toast.error('Parollar mos kelmadi'); return }
    setLoading(true)
    try {
      await authAPI.changePassword({ old_password: pwForm.old_password, new_password: pwForm.new_password })
      toast.success("Parol o'zgartirildi!")
      setPwForm({ old_password: '', new_password: '', confirm_new: '' })
    } catch (err) {
      toast.error(err.response?.data?.old_password?.[0] || 'Xatolik')
    } finally { setLoading(false) }
  }

  const REGIONS = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', "Farg'ona", 'Namangan',
    'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo', "Qoraqalpog'iston"]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShieldCheckIcon className="w-7 h-7 text-primary-600" /> Profil sozlamalari
        </h1>

        {/* Profile header */}
        <div className="card p-6 mb-6 flex items-center gap-5">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary-700 flex-shrink-0">
            {user?.first_name?.[0] || user?.full_name?.[0] || user?.username?.[0] || '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            {user?.is_premium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 mt-1">
                <TrophyIcon className="w-3.5 h-3.5" /> Premium · {new Date(user.premium_until).toLocaleDateString('uz-UZ')} gacha
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6">
          {[
            { id: 'profile',      label: 'Profil' },
            { id: 'password',     label: 'Parol' },
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

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="card p-6">
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Ism</label>
                  <input value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="label">Familiya</label>
                  <input value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} className="input" />
                </div>
              </div>
              <div>
                <label className="label">Telefon</label>
                <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+998 90 123 45 67" className="input" />
              </div>
              <div>
                <label className="label">Maktab/Universitet</label>
                <input value={form.school} onChange={e => setForm(p => ({ ...p, school: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label">Viloyat</label>
                <select value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))} className="input">
                  <option value="">Tanlang</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label">O'zingiz haqingizda</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className="input" rows={3} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saqlanmoqda...' : 'Saqlash'}</button>
            </form>
          </div>
        )}

        {/* Password tab */}
        {tab === 'password' && (
          <div className="card p-6">
            <form onSubmit={onChangePassword} className="space-y-4">
              {[
                { key: 'old_password',  label: 'Hozirgi parol' },
                { key: 'new_password',  label: 'Yangi parol' },
                { key: 'confirm_new',   label: 'Yangi parolni tasdiqlang' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input type="password" value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} className="input" />
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-primary">{loading ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}</button>
            </form>
          </div>
        )}

        {/* Subscription tab */}
        {tab === 'subscription' && (
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
                  {subscription.subscription.plan.features?.map((f, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrophyIcon className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Premium obuna yo'q</h3>
                <p className="text-gray-500 text-sm mb-4">Premium bilan barcha imkoniyatlardan foydalaning</p>
                <a href="/pricing" className="btn-primary inline-flex">Premium olish</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
