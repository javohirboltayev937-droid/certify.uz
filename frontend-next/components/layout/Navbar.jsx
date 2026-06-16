'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '@/lib/store/authSlice'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import {
  ShieldCheckIcon, Bars3Icon, XMarkIcon, ChevronDownIcon,
  ArrowRightStartOnRectangleIcon, ChartBarIcon, UserCircleIcon,
  ClipboardDocumentListIcon, SparklesIcon, CreditCardIcon,
  QrCodeIcon, BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import { Avatar } from '@/components/ui'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { href: '/#features',  label: 'Xususiyatlar', icon: SparklesIcon },
  { href: '/#services',  label: 'Yechimlar',     icon: BuildingOfficeIcon },
  { href: '/#pricing',   label: 'Narxlar',       icon: CreditCardIcon },
  { href: '/courses',    label: 'Kurslar',       icon: ClipboardDocumentListIcon },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Chiqildi')
    router.push('/')
    setUserMenuOpen(false)
  }

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'border-b backdrop-blur-2xl' : 'border-b border-transparent'
      )}
      style={scrolled ? {
        background: 'rgba(2,11,24,0.85)',
        borderColor: 'rgba(255,255,255,0.07)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
      } : {
        background: 'rgba(2,11,24,0.4)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
               style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#2563eb 100%)', boxShadow: '0 0 16px rgba(124,58,237,0.5)' }}>
            <ShieldCheckIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">
            Certify<span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#a78bfa,#60a5fa)' }}>.uz</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                pathname === href
                  ? 'text-violet-300 bg-violet-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard"
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <ChartBarIcon className="w-4 h-4" /> Boshqaruv
              </Link>
              <div className="relative">
                <button onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
                  <Avatar name={user?.full_name || user?.username} src={user?.avatar} size="sm" />
                  <span className="hidden md:block text-sm font-medium text-slate-300 max-w-[120px] truncate">
                    {user?.full_name || user?.username}
                  </span>
                  <ChevronDownIcon className={clsx('w-4 h-4 text-slate-500 transition-transform', userMenuOpen && 'rotate-180')} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl z-20 py-1.5 overflow-hidden"
                         style={{ background: 'rgba(13,21,48,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 64px rgba(0,0,0,0.7)' }}>
                      <div className="px-4 py-2.5 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <p className="font-semibold text-sm text-white truncate">{user?.full_name || user?.username}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      {[
                        { href: '/dashboard', label: 'Boshqaruv',   Icon: ChartBarIcon },
                        { href: '/profile',   label: 'Profil',       Icon: UserCircleIcon },
                        { href: '/progress',  label: 'Taraqqiyot',   Icon: ClipboardDocumentListIcon },
                      ].map(({ href, label, Icon }) => (
                        <Link key={href} href={href} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                          <Icon className="w-4 h-4 text-slate-500" /> {label}
                        </Link>
                      ))}
                      <div className="mt-1 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors">
                          <ArrowRightStartOnRectangleIcon className="w-4 h-4" /> Chiqish
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login"
                className="text-sm font-medium text-slate-400 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 transition-all">
                Kirish
              </Link>
              <Link href="/register"
                className="text-sm font-bold text-white px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                Boshlash
              </Link>
            </div>
          )}

          <Link href="/verify"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <QrCodeIcon className="w-4 h-4" />
          </Link>

          <button onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden py-3 px-4 space-y-1 border-t"
             style={{ background: 'rgba(2,11,24,0.98)', borderColor: 'rgba(255,255,255,0.07)' }}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
              <Icon className="w-5 h-5 text-slate-500" /> {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                <ChartBarIcon className="w-5 h-5 text-slate-500" /> Boshqaruv
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-colors">
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" /> Chiqish
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-3">
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 transition-colors">
                Kirish
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                Boshlash
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
