'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfile } from '@/lib/store/authSlice'
import { authAPI, paymentsAPI } from '@/lib/api'
import { ShieldCheckIcon, CheckCircleIcon, TrophyIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { PageLoader } from '@/components/ui'
import toast from 'react-hot-toast'

export default function Profile() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, initialized } = useSelector(s => s.auth)
  const [subscription, setSubscription] = useState(null)
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [tgLoading, setTgLoading] = useState(false)
  const [tgPolling, setTgPolling] = useState(false)

  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', bio: '', school: '', region: '' })
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

  const onLinkTelegram = async () => {
    setTgLoading(true)
    try {
      const { data } = await authAPI.telegramLinkToken()
      if (data.already_linked) {
        await dispatch(fetchProfile())
        toast.success('Telegram allaqachon ulangan')
        return
      }
      if (!data.deep_link) {
        toast.error('Bot sozlanmagan (TELEGRAM_BOT_USERNAME)')
        return
      }
      window.open(data.deep_link, '_blank')
      toast('Telegram ochildi — botda "Start" ni bosing', { icon: '📨' })
      setTgPolling(true)
    } catch {
      toast.error('Xatolik yuz berdi')
    } finally { setTgLoading(false) }
  }

  const onUnlinkTelegram = async () => {
    setTgLoading(true)
    try {
      await authAPI.telegramUnlink()
      await dispatch(fetchProfile())
      toast.success('Telegram uzildi')
    } catch { toast.error('Xatolik') } finally { setTgLoading(false) }
  }

  useEffect(() => {
    if (!tgPolling) return
    if (user?.telegram_linked) { setTgPolling(false); toast.success('Telegram ulandi! ✅'); return }
    const iv = setInterval(() => dispatch(fetchProfile()), 3000)
    const stop = setTimeout(() => setTgPolling(false), 120000)
    return () => { clearInterval(iv); clearTimeout(stop) }
  }, [tgPolling, user?.telegram_linked])

  const REGIONS = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', "Farg'ona", 'Namangan',
    'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo', "Qoraqalpog'iston"]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <ShieldCheckIcon className="w-7 h-7 text-violet-400" /> Profil sozlamalari
        </h1>

        {/* Profile header */}
        <div className="card p-6 mb-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-violet-300 flex-shrink-0"
               style={{ background: 'rgba(139,92,246,0.2)' }}>
            {user?.first_name?.[0] || user?.full_name?.[0] || user?.username?.[0] || '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.first_name} {user?.last_name}</h2>
            <p className="text-slate-400">{user?.email}</p>
            {user?.is_premium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1"
                    style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
                <TrophyIcon className="w-3.5 h-3.5" /> Premium · {new Date(user.premium_until).toLocaleDateString('uz-UZ')} gacha
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { id: 'profile',      label: 'Profil' },
            { id: 'password',     label: 'Parol' },
            { id: 'subscription', label: 'Obuna' },
            { id: 'telegram',     label: 'Telegram' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={tab === t.id ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)' } : {}}>
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
              <button type="submit" disabled={loading} className="btn-gradient">{loading ? 'Saqlanmoqda...' : 'Saqlash'}</button>
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
              <button type="submit" disabled={loading} className="btn-gradient">{loading ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}</button>
            </form>
          </div>
        )}

        {/* Subscription tab */}
        {tab === 'subscription' && (
          <div className="card p-6">
            {subscription?.subscription ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-white">Faol obuna: {subscription.subscription.plan.name}</h3>
                    <p className="text-sm text-slate-400">
                      {new Date(subscription.subscription.end_date).toLocaleDateString('uz-UZ')} gacha
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {subscription.subscription.plan.features?.map((f, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrophyIcon className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Premium obuna yo'q</h3>
                <p className="text-slate-400 text-sm mb-4">Premium bilan barcha imkoniyatlardan foydalaning</p>
                <a href="/pricing" className="btn-gradient inline-flex">Premium olish</a>
              </div>
            )}
          </div>
        )}

        {/* Telegram tab */}
        {tab === 'telegram' && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                   style={{ background: 'rgba(14,165,233,0.15)' }}>
                <PaperAirplaneIcon className="w-6 h-6 text-sky-400 -rotate-45" />
              </div>
              <div>
                <h3 className="font-bold text-white">Telegram bot</h3>
                <p className="text-sm text-slate-400">Akkauntingizni botga ulang va to'lovlarni Telegram orqali amalga oshiring</p>
              </div>
            </div>

            {user?.telegram_linked ? (
              <div>
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-4"
                     style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                  <CheckCircleIcon className="w-5 h-5" />
                  Telegram ulangan{user?.telegram_username ? ` (@${user.telegram_username})` : ''}
                </div>
                <button onClick={onUnlinkTelegram} disabled={tgLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', background: 'rgba(239,68,68,0.08)' }}>
                  {tgLoading ? 'Uzilmoqda...' : 'Telegramni uzish'}
                </button>
              </div>
            ) : (
              <div>
                <ol className="text-sm text-slate-400 space-y-1.5 mb-5 list-decimal list-inside">
                  <li>"Telegramga ulash" tugmasini bosing</li>
                  <li>Ochilgan botda <b className="text-slate-200">Start</b> tugmasini bosing</li>
                  <li>Akkaunt avtomatik ulanadi va bu sahifa yangilanadi</li>
                </ol>
                <button onClick={onLinkTelegram} disabled={tgLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}>
                  <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
                  {tgLoading ? 'Ochilmoqda...' : 'Telegramga ulash'}
                </button>
                {tgPolling && (
                  <p className="text-sm text-sky-400 mt-3 animate-pulse">⏳ Telegramda Start bosilishini kutmoqdamiz...</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
