import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_abc123'
const TEMPLATE_ID = 'template_23okefl'
const PUBLIC_KEY = 'Oi89iBntxJYCuRBmb'

export async function sendResetEmail(toEmail: string, resetLink: string): Promise<{ ok: boolean; error?: string }> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return { ok: false, error: 'Email service not configured. Contact admin.' }
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: toEmail,
        to_name: toEmail.split('@')[0],
        reset_link: resetLink,
        from_name: 'Nexus AI',
        message: 'Click the link below to reset your password. This link expires in 1 hour.',
      },
      { publicKey: PUBLIC_KEY }
    )
    return { ok: true }
  } catch (err) {
    console.error('Email send failed:', err)
    return { ok: false, error: 'Failed to send email. Try again later.' }
  }
}
