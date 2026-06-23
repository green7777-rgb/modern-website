import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

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
