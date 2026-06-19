import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Mohon isi semua kolom')
      return
    }
    const result = await login(form.email, form.password)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.message)
    }
  }

  const inputClass = "w-full bg-transparent text-white text-sm py-3 px-4 pl-11 rounded-xl outline-none placeholder-white/30 transition-all"

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24 flex items-center justify-center px-6">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" fill="white" />
              </svg>
            </div>
            <span className="text-white font-extrabold text-2xl">Monora</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Selamat Datang Kembali</h1>
          <p className="text-white/50 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-6 md:p-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-3 text-sm text-red-300"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </motion.div>
            )}

            <div className="relative">
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                placeholder="Alamat email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className={inputClass}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata sandi"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className={inputClass}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 bg-transparent border-none cursor-pointer"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full text-white py-3.5 rounded-xl text-sm font-semibold cursor-pointer border-none"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
              }}
            >
              Masuk
            </motion.button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6 mb-0">
            Belum punya akun?{' '}
            <Link to="/register" className="text-orange-400 hover:text-orange-300 no-underline font-medium">
              Daftar
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
