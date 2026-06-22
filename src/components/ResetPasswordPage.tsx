import { useState, useEffect } from 'react'
import { validateResetToken, resetPasswordWithToken } from '../utils/auth'

interface ResetPasswordPageProps {
  token: string
  onDone: () => void
}

export default function ResetPasswordPage({ token, onDone }: ResetPasswordPageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    validateResetToken(token).then(result => {
      if (result.ok && result.email) {
        setEmail(result.email)
        setLoading(false)
      } else {
        setError(result.error || 'Invalid reset link.')
        setLoading(false)
      }
    })
  }, [token])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setResetting(true)
    const result = await resetPasswordWithToken(token, newPassword)
    setResetting(false)

    if (result.ok) {
      setSuccess(true)
      setTimeout(onDone, 2500)
    } else {
      setError(result.error || 'Failed to reset password.')
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#171717]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p className="text-[#888]">Validating reset link...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#171717]">
        <div className="text-center animate-slide-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
          <p className="text-[#888]">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#171717] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--primary,#7c3aed)]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--accent,#06b6d4)]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--primary,#7c3aed)] to-[var(--accent,#06b6d4)] flex items-center justify-center shadow-lg shadow-[var(--primary,#7c3aed)]/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-[#888] mt-2">for {email}</p>
        </div>

        <div className="bg-[#232323] rounded-2xl border border-[#333] p-8 shadow-xl">
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[var(--primary,#7c3aed)] focus:ring-1 focus:ring-[var(--primary,#7c3aed)]/30 transition-all text-sm"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[var(--primary,#7c3aed)] focus:ring-1 focus:ring-[var(--primary,#7c3aed)]/30 transition-all text-sm"
                placeholder="Repeat your password"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">{error}</div>
            )}

            <button
              type="submit"
              disabled={resetting}
              className="w-full py-3.5 bg-gradient-to-r from-[var(--primary,#7c3aed)] to-[var(--accent,#06b6d4)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm disabled:opacity-50"
            >
              {resetting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <button onClick={onDone} className="w-full mt-4 py-2.5 text-sm text-[#888] hover:text-white transition-colors">
            Back to login
          </button>
        </div>
      </div>
    </div>
  )
}
