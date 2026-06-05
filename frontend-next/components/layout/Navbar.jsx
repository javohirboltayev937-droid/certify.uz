'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '@/lib/store/authSlice'
import { useState } from 'react'
import { clsx } from 'clsx'
import {
  AcademicCapIcon, BookOpenIcon, ClipboardDocumentListIcon,
  UserCircleIcon, Bars3Icon, XMarkIcon, ChevronDownIcon,
  ArrowRightStartOnRectangleIcon, ChartBarIcon, CreditCardIcon,
} from '@heroicons/react/24/outline'
import { Avatar } from '@/components/ui'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { href: '/courses',  label: 'Kurslar',  icon: BookOpenIcon },
  { href: '/exams',    label: 'Imtihonlar', icon: ClipboardDocumentListIcon },
  { href: '/dtm',      label: 'DTM Test', icon: AcademicCapIcon },
  { href: '/pricing',  label: 'Narxlar',  icon: CreditCardIcon },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Chiqildi')
    router.push('/')
    setUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <span>Certify<span className="text-primary-600">.uz</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={clsx('hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors',
                pathname === '/dashboard' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50')}>
                <ChartBarIcon className="w-4 h-4" /> Dashboard
              </Link>
              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Avatar name={user?.full_name || user?.username} src={user?.avatar} size="sm" />
                  <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.full_name || user?.username}
                  </span>
                  <ChevronDownIcon className={clsx('w-4 h-4 text-slate-400 transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-lg z-20 py-1.5 overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                        <p className="font-semibold text-sm text-slate-900 truncate">{user?.full_name || user?.username}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      {[
                        { href: '/dashboard', label: 'Dashboard', Icon: ChartBarIcon },
                        { href: '/profile',   label: 'Profil',    Icon: UserCircleIcon },
                        { href: '/progress',  label: 'Progress',  Icon: ClipboardDocumentListIcon },
                      ].map(({ href, label, Icon }) => (
                        <Link key={href} href={href} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                          <Icon className="w-4 h-4 text-slate-400" /> {label}
                        </Link>
                      ))}
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">
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
              <Link href="/login" className="btn-ghost btn-sm">Kirish</Link>
              <Link href="/register" className="btn-primary btn-sm">Ro'yxatdan o'tish</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100">
            {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-3 px-4 space-y-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                pathname === href ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50')}>
              <Icon className="w-5 h-5" /> {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                <ChartBarIcon className="w-5 h-5" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full">
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" /> Chiqish
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-center">Kirish</Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center">Ro'yxatdan o'tish</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
