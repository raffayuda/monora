import { sendContactEmail } from '../services/contact.js'

export async function handleContact(req, res) {
    try {
        const { name, email, subject, message } = req.body

        // Validate
        if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
            return res.status(400).json({ message: 'Semua field harus diisi' })
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Format email tidak valid' })
        }

        await sendContactEmail({ name, email, subject, message })

        res.json({ message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.' })
    } catch (error) {
        console.error('Contact email error:', error)
        res.status(500).json({ message: 'Gagal mengirim pesan. Silakan coba lagi nanti.' })
    }
}
