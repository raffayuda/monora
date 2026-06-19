import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoCallOutline, IoEyeOutline, IoEyeOffOutline, IoShieldCheckmarkOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'customer' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    if (!form.email.trim()) errs.email = 'Email wajib diisi'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email tidak valid'
    if (!form.password) errs.password = 'Kata sandi wajib diisi'
    if (form.password.length < 6) errs.password = 'Minimal 6 karakter'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Kata sandi tidak cocok'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = await register({ ...form, role: form.role })
    if (result.success) {
      navigate(form.role === 'event_admin' ? '/admin/dashboard' : '/')
    } else {
      setErrors({ email: result.message })
    }
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const inputClass = "w-full bg-transparent text-white text-sm py-3 px-4 pl-11 rounded-xl outline-none placeholder-white/30 transition-all"

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24 flex items-center justify-center px-6 py-10">
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
          <h1 className="text-2xl font-bold text-white mb-2">Buat Akun</h1>
          <p className="text-white/50 text-sm">Bergabung dengan Monora untuk mulai membeli tiket</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-6 md:p-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text" name="name" placeholder="Nama Lengkap"
                  value={form.name} onChange={handleChange}
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.06)', border: errors.name ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            <div>
              <div className="relative">
                <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email" name="email" placeholder="Alamat email"
                  value={form.email} onChange={handleChange}
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.06)', border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="tel" name="phone" placeholder="Nomor telepon (opsional)"
                  value={form.phone} onChange={handleChange}
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <IoShieldCheckmarkOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={inputClass}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="customer" style={{ background: '#1a1a2e' }}>Pelanggan</option>
                  <option value="event_admin" style={{ background: '#1a1a2e' }}>Penyelenggara Acara</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-xs">▼</div>
              </div>
              <p className="text-white/30 text-[11px] mt-1 ml-1">
                {form.role === 'event_admin' ? 'Anda dapat membuat dan mengelola acara' : 'Jelajahi dan beli tiket acara'}
              </p>
            </div>

            <div>
              <div className="relative">
                <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" placeholder="Kata sandi"
                  value={form.password} onChange={handleChange}
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.06)', border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div>
              <div className="relative">
                <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword" placeholder="Konfirmasi kata sandi"
                  value={form.confirmPassword} onChange={handleChange}
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.06)', border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
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
              Buat Akun
            </motion.button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6 mb-0">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 no-underline font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
