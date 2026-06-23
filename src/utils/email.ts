import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_abc123'
const TEMPLATE_ID = 'template_23okefl'
const PUBLIC_KEY = 'Oi89iBntxJYCuRBmb'

emailjs.init({ publicKey: PUBLIC_KEY })

export async function sendResetEmail(toEmail: string, resetLink: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        email: toEmail,
        to_name: toEmail.split('@')[0],
        reset_link: resetLink,
        from_name: 'Nexus AI',
      }
    )
    console.log('Email sent:', result)
    return { ok: true }
  } catch (err: any) {
    console.error('EmailJS error:', err)
    const msg = err?.text || err?.message || JSON.stringify(err)
    return { ok: false, error: `Email failed: ${msg}` }
  }
}
