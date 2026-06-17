'use client'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProfile } from '@/lib/store/authSlice'

function AuthInit() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])
  return null
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInit />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontFamily: 'Inter', fontSize: '14px', boxShadow: '0 4px 12px rgb(0 0 0 / 0.15)' },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
      {children}
    </Provider>
  )
}
