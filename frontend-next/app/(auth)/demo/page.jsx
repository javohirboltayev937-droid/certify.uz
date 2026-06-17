'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '@/lib/store/authSlice'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function DemoLogin() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(s => s.auth)
  const [status, setStatus] = useState('Tayyorlanmoqda...')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
      return
    }

    const run = async () => {
      try {
        setStatus('Demo akkauntga kirilmoqda...')
        await dispatch(loginUser({ username: 'demo', password: 'Demo1234!' })).unwrap()
        setStatus('Muvaffaqiyatli! Yo\'naltirilmoqda...')
        router.replace('/dashboard')
      } catch {
        setError('Demo kirish xatoligi. Iltimos, qayta urinib ko\'ring.')
      }
    }

    run()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.22) 0%, transparent 70%), #020B18' }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
             style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}>
          <ShieldCheckIcon className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-white text-2xl font-black mb-2">Certify.uz</h1>

        {error ? (
          <>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => { setError(null); window.location.reload() }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              Qayta urinish
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
            <p className="text-slate-400 text-sm">{status}</p>
          </div>
        )}
      </div>
    </div>
  )
}
