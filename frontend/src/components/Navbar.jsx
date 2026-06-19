import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMenu, IoClose, IoCartOutline, IoPersonOutline, IoLogOutOutline, IoReceiptOutline, IoGridOutline } from 'react-icons/io5'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo-monora.png'

const navLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Tentang', path: '/about' },
  { name: 'Acara', path: '/events' },
  { name: 'Lokasi', path: '/location' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Kontak', path: '/contact' },
]

/* ── inline style objects ────────────────────────────── */

const glassBase = {
  background: 'rgba(255, 255, 255, 0.06)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.25)',
}

const glassScrolled = {
  background: 'rgba(10, 10, 30, 0.65)',
  backdropFilter: 'blur(28px) saturate(200%)',
  WebkitBackdropFilter: 'blur(28px) saturate(200%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
}

const activePillStyle = {
  background: 'rgba(255, 255, 255, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(8px)',
}

const profileDropdownStyle = {
  background: 'rgba(15, 15, 35, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
}

const mobileMenuStyle = {
  background: 'rgba(10, 10, 30, 0.82)',
  backdropFilter: 'blur(28px) saturate(180%)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
}

const cartBadgeStyle = {
  background: 'linear-gradient(135deg, #f97316, #ea580c)',
  boxShadow: '0 2px 8px rgba(249,115,22,0.5)',
}

const loginBtnStyle = {
  background: 'linear-gradient(135deg, #f97316, #ea580c)',
  boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
}

const logoBgStyle = {
  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  boxShadow: '0 0 16px rgba(6, 182, 212, 0.35)',
}

/* ── component ───────────────────────────────────────── */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[9999]"
      style={{
        ...(scrolled ? glassScrolled : glassBase),
        transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-6 md:px-10"
        style={{
          paddingTop: scrolled ? '12px' : '18px',
          paddingBottom: scrolled ? '12px' : '18px',
          transition: 'padding 0.4s ease',
        }}
      >
        {/* ── Logo ───────────────────────── */}
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer no-underline">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
          >
            <img src={logo} alt="" className='w-full h-full object-cover' />
          </motion.div>
          <span className="text-white font-extrabold text-xl tracking-tight" style={{ letterSpacing: '-0.02em', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
            Monora
          </span>
        </Link>

        {/* ── Nav Links (glass pill container) ── */}
        <div
          className="hidden md:block rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '4px 6px',
          }}
        >
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <motion.li key={item.name} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={item.path}
                    className="no-underline block"
                    style={{
                      padding: '7px 16px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                      transition: 'all 0.25s ease',
                      ...(isActive ? activePillStyle : {}),
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#ffffff'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </div>

        {/* ── Right Actions ──────────────── */}
        <div className="hidden md:flex items-center gap-2">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative no-underline flex items-center justify-center"
            style={{
              color: 'rgba(255,255,255,0.75)',
              width: 38,
              height: 38,
              borderRadius: '50%',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <IoCartOutline style={{ fontSize: 20 }} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute flex items-center justify-center text-white"
                style={{
                  top: 0,
                  right: 0,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  fontSize: 10,
                  fontWeight: 700,
                  ...cartBadgeStyle,
                }}
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  color: 'rgba(255,255,255,0.85)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
              >
                <IoPersonOutline style={{ fontSize: 16 }} />
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 z-50"
                    style={{
                      top: 48,
                      width: 210,
                      borderRadius: 16,
                      overflow: 'hidden',
                      ...profileDropdownStyle,
                    }}
                  >
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="m-0 truncate" style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user?.name}</p>
                      <p className="m-0 truncate" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>{user?.email}</p>
                    </div>
                    <Link
                      to="/my-orders"
                      onClick={() => setProfileOpen(false)}
                      className="no-underline"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 16px',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 13,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <IoReceiptOutline />
                      Pesanan Saya
                    </Link>
                    {(user?.role === 'event_admin' || user?.role === 'app_admin') && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="no-underline"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 16px',
                          color: '#f97316',
                          fontSize: 13,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#fb923c'
                          e.currentTarget.style.background = 'rgba(249,115,22,0.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#f97316'
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <IoGridOutline />
                        Panel Acara
                      </Link>
                    )}
                    {user?.role === 'app_admin' && (
                      <Link
                        to="/app-admin/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="no-underline"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 16px',
                          color: '#a855f7',
                          fontSize: 13,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#c084fc'
                          e.currentTarget.style.background = 'rgba(168,85,247,0.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#a855f7'
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <IoGridOutline />
                        App Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        padding: '10px 16px',
                        color: '#f87171',
                        fontSize: 13,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fca5a5'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#f87171'
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <IoLogOutOutline />
                      Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="no-underline">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(249,115,22,0.45)' }}
                whileTap={{ scale: 0.96 }}
                style={{
                  color: '#fff',
                  padding: '9px 22px',
                  borderRadius: '9999px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  ...loginBtnStyle,
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                Masuk / Daftar
              </motion.button>
            </Link>
          )}
        </div>

        {/* ── Mobile Right ───────────────── */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/cart"
            className="relative no-underline"
            style={{ color: 'rgba(255,255,255,0.8)', padding: 4 }}
          >
            <IoCartOutline style={{ fontSize: 22 }} />
            {itemCount > 0 && (
              <span
                className="absolute flex items-center justify-center text-white"
                style={{
                  top: -2,
                  right: -2,
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  fontSize: 9,
                  fontWeight: 700,
                  ...cartBadgeStyle,
                }}
              >
                {itemCount}
              </span>
            )}
          </Link>
          <motion.button
            whileTap={{ scale: 0.9 }}
            style={{
              color: '#fff',
              fontSize: 24,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <IoClose /> : <IoMenu />}
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Menu (Glass) ──────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden"
            style={mobileMenuStyle}
          >
            <div style={{ padding: '12px 20px 16px' }}>
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="no-underline block"
                    style={{
                      padding: '12px 14px',
                      margin: '2px 0',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                      background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.name}
                  </Link>
                )
              })}

              {/* divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileOpen(false)}
                    className="no-underline block"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.7)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Pesanan Saya
                  </Link>
                  {(user?.role === 'event_admin' || user?.role === 'app_admin') && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="no-underline block"
                      style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        fontSize: 14,
                        color: '#f97316',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Panel Acara
                    </Link>
                  )}
                  {user?.role === 'app_admin' && (
                    <Link
                      to="/app-admin/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="no-underline block"
                      style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        fontSize: 14,
                        color: '#a855f7',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      App Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false) }}
                    style={{
                      width: '100%',
                      marginTop: 8,
                      padding: '11px 14px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#f87171',
                      background: 'rgba(248, 113, 113, 0.08)',
                      border: '1px solid rgba(248, 113, 113, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="no-underline block">
                  <button
                    style={{
                      width: '100%',
                      marginTop: 8,
                      padding: '12px',
                      borderRadius: '9999px',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      ...loginBtnStyle,
                    }}
                  >
                    Masuk / Daftar
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
