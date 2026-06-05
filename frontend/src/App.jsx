import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import store from './store'
import { fetchProfile } from './store/authSlice'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Exams from './pages/exams/Exams'
import DTMTest from './pages/dtm/DTMTest'
import Pricing from './pages/Pricing'
import { PageLoader } from './components/common/Loading'
import { lazy, Suspense } from 'react'

const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Profile = lazy(() => import('./pages/Profile'))
const Progress = lazy(() => import('./pages/Progress'))
const IELTSPage = lazy(() => import('./pages/exams/IELTSPage'))
const CEFRPage = lazy(() => import('./pages/exams/CEFRPage'))
const NationalPage = lazy(() => import('./pages/exams/NationalPage'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))

function ProtectedRoute() {
  const { isAuthenticated } = useSelector(s => s.auth)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function AppInit() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(s => s.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile())
    }
  }, [])

  return null
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function AuthLayout() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInit />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px', fontFamily: 'Inter' },
          }}
        />
        <Routes>
          {/* Auth pages (no navbar) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Main layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/ielts" element={<IELTSPage />} />
            <Route path="/exams/cefr" element={<CEFRPage />} />
            <Route path="/exams/national" element={<NationalPage />} />
            <Route path="/dtm" element={<DTMTest />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/progress" element={<Progress />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
