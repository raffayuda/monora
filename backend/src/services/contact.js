import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendContactEmail({ name, email, subject, message }) {
  const mailOptions = {
    from: `"Monora Contact" <${process.env.SMTP_EMAIL}>`,
    to: process.env.SMTP_EMAIL,
    replyTo: email,
    subject: `[Monora Contact] ${subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0D1A; border-radius: 16px; overflow: hidden; border: 1px solid #1e2035;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">📩 Pesan Baru dari Monora</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Ada pesan masuk melalui halaman kontak</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 32px 24px;">
          <!-- Sender Info -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 13px; width: 100px; vertical-align: top;">Nama</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Email</td>
                <td style="padding: 8px 0; color: #f97316; font-size: 14px;">
                  <a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Subjek</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px;">${subject}</td>
              </tr>
            </table>
          </div>
          
          <!-- Message -->
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px;">
            <p style="color: #888; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Pesan</p>
            <p style="color: #e0e0e0; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 16px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
          <p style="color: #555; font-size: 11px; margin: 0;">Email ini dikirim otomatis dari formulir kontak Monora</p>
        </div>
      </div>
    `,
  }

  // Also send confirmation email to the sender
  const confirmationOptions = {
    from: `"Monora" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `Terima kasih telah menghubungi Monora!`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0D1A; border-radius: 16px; overflow: hidden; border: 1px solid #1e2035;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">✅ Pesan Anda Telah Diterima</h1>
        </div>
        <div style="padding: 32px 24px;">
          <p style="color: #e0e0e0; font-size: 15px; line-height: 1.7;">Halo <strong>${name}</strong>,</p>
          <p style="color: #b0b0b0; font-size: 14px; line-height: 1.7;">Terima kasih telah menghubungi kami! Kami telah menerima pesan Anda mengenai "<strong style="color: #f97316;">${subject}</strong>" dan tim kami akan segera membalas dalam waktu 24 jam.</p>
          <p style="color: #b0b0b0; font-size: 14px; line-height: 1.7;">Salam hangat,<br><strong style="color: #f97316;">Tim Monora</strong></p>
        </div>
        <div style="padding: 16px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
          <p style="color: #555; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Monora. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
  await transporter.sendMail(confirmationOptions)
}
