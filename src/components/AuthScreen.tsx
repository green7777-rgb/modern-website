import { useState } from 'react'
import { signup, login } from '../utils/auth'

interface AuthScreenProps {
  onAuth: (name: string) => void
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 500))

    if (isLogin) {
      const result = login(email, password)
      if (result.ok && result.name) {
        onAuth(result.name)
      } else {
        setError(result.error || 'Login failed')
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name')
        setLoading(false)
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }
      const result = signup(name.trim(), email, password)
      if (result.ok) {
        onAuth(name.trim())
      } else {
        setError(result.error || 'Signup failed')
      }
    }
    setLoading(false)
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Nexus AI</h1>
          <p className="text-[#888] mt-2">Your intelligent AI companion</p>
        </div>

        <div className="bg-[#232323] rounded-2xl border border-[#333] p-8 shadow-xl">
          <div className="flex bg-[#1a1a1a] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-[#333] text-white shadow' : 'text-[#888] hover:text-white'}`}
            >
              Log in
            </button>
            <button
              onClick={() => { setIsLogin(false); setError('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-[#333] text-white shadow' : 'text-[#888] hover:text-white'}`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-[#ccc] mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[var(--primary,#7c3aed)] focus:ring-1 focus:ring-[var(--primary,#7c3aed)]/30 transition-all text-sm"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[var(--primary,#7c3aed)] focus:ring-1 focus:ring-[var(--primary,#7c3aed)]/30 transition-all text-sm"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[var(--primary,#7c3aed)] focus:ring-1 focus:ring-[var(--primary,#7c3aed)]/30 transition-all text-sm"
                placeholder={isLogin ? "Your password" : "At least 6 characters"}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[var(--primary,#7c3aed)] to-[var(--accent,#06b6d4)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Log in' : 'Create account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#666] mt-6">
          Your data is saved locally in your browser.
        </p>
      </div>
    </div>
  )
}
