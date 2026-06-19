import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logoMonora from '../assets/logo-monora.png'

function LoadingScreen({ onFinish }) {
    const [progress, setProgress] = useState(0)
    const [phase, setPhase] = useState('loading') // loading | finishing | done

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                // Accelerate as we go
                const increment = prev < 30 ? 3 : prev < 60 ? 4 : prev < 85 ? 5 : 8
                return Math.min(prev + increment, 100)
            })
        }, 50)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (progress >= 100 && phase === 'loading') {
            setPhase('finishing')
            setTimeout(() => {
                setPhase('done')
                setTimeout(() => onFinish?.(), 600)
            }, 500)
        }
    }, [progress, phase, onFinish])

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#0B0D1A',
                        overflow: 'hidden',
                    }}
                >
                    {/* Animated background particles / orbs */}
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        {/* Floating orbs */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: `${15 + i * 15}%`,
                                    y: `${20 + (i % 3) * 25}%`,
                                    scale: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    x: [`${15 + i * 15}%`, `${20 + i * 12}%`, `${15 + i * 15}%`],
                                    y: [`${20 + (i % 3) * 25}%`, `${30 + (i % 3) * 20}%`, `${20 + (i % 3) * 25}%`],
                                    scale: [0, 1, 0.8, 1],
                                    opacity: [0, 0.15, 0.1, 0.15],
                                }}
                                transition={{
                                    duration: 4 + i * 0.5,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    delay: i * 0.3,
                                    ease: 'easeInOut',
                                }}
                                style={{
                                    position: 'absolute',
                                    width: 120 + i * 30,
                                    height: 120 + i * 30,
                                    borderRadius: '50%',
                                    background: i % 2 === 0
                                        ? 'radial-gradient(circle, rgba(249,115,22,0.3), transparent 70%)'
                                        : 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)',
                                    filter: 'blur(40px)',
                                }}
                            />
                        ))}

                        {/* Grid lines */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.03 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `
                  linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)
                `,
                                backgroundSize: '60px 60px',
                            }}
                        />
                    </div>

                    {/* Center content */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Logo glow ring */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [0, 1.2, 1],
                                opacity: [0, 1, 1],
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            style={{ position: 'relative', marginBottom: 40 }}
                        >
                            {/* Outer glow */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 40px rgba(249,115,22,0.2), 0 0 80px rgba(249,115,22,0.1)',
                                        '0 0 60px rgba(249,115,22,0.35), 0 0 120px rgba(249,115,22,0.15)',
                                        '0 0 40px rgba(249,115,22,0.2), 0 0 80px rgba(249,115,22,0.1)',
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(249,115,22,0.15)',
                                }}
                            >
                                {/* Spinning ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    style={{
                                        position: 'absolute',
                                        inset: -3,
                                        borderRadius: '50%',
                                        border: '2px solid transparent',
                                        borderTopColor: '#f97316',
                                        borderRightColor: 'rgba(249,115,22,0.3)',
                                    }}
                                />

                                {/* Second spinning ring (reverse) */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                    style={{
                                        position: 'absolute',
                                        inset: -10,
                                        borderRadius: '50%',
                                        border: '1px solid transparent',
                                        borderBottomColor: 'rgba(139,92,246,0.4)',
                                        borderLeftColor: 'rgba(139,92,246,0.15)',
                                    }}
                                />

                                {/* Logo */}
                                <motion.img
                                    src={logoMonora}
                                    alt="Monora"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.3))',
                                    }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Brand name */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            style={{ textAlign: 'center', marginBottom: 48 }}
                        >
                            <h1 style={{
                                fontSize: 36,
                                fontWeight: 800,
                                margin: 0,
                                letterSpacing: '-0.02em',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f97316 50%, #ea580c 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                MONORA
                            </h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                style={{
                                    margin: '8px 0 0',
                                    fontSize: 13,
                                    color: 'rgba(255,255,255,0.35)',
                                    letterSpacing: '0.3em',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                }}
                            >
                                Discover Amazing Events
                            </motion.p>
                        </motion.div>

                        {/* Progress bar */}
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 240 }}
                            transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            style={{ marginBottom: 16 }}
                        >
                            <div style={{
                                width: 240,
                                height: 3,
                                borderRadius: 999,
                                background: 'rgba(255,255,255,0.06)',
                                overflow: 'hidden',
                            }}>
                                <motion.div
                                    style={{
                                        height: '100%',
                                        borderRadius: 999,
                                        background: 'linear-gradient(90deg, #f97316, #ea580c, #f97316)',
                                        backgroundSize: '200% 100%',
                                        width: `${progress}%`,
                                        transition: 'width 0.15s ease-out',
                                    }}
                                    animate={{
                                        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />
                            </div>
                        </motion.div>

                        {/* Percentage text */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.25)',
                                fontFamily: 'monospace',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {progress}%
                        </motion.span>

                        {/* Animated dots */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            style={{
                                display: 'flex',
                                gap: 6,
                                marginTop: 24,
                            }}
                        >
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: 'easeInOut',
                                    }}
                                    style={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: '50%',
                                        background: '#f97316',
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom decorative line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                            background: 'linear-gradient(90deg, transparent, #f97316, transparent)',
                            transformOrigin: 'center',
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default LoadingScreen
