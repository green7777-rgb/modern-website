export interface User {
  name: string
  email: string
  password: string
  createdAt: number
}

const USERS_KEY = 'nexus_users'
const SESSION_KEY = 'nexus_session'

export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signup(name: string, email: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers()
  if (users.find(u => u.email === email)) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  const user: User = { name, email, password, createdAt: Date.now() }
  users.push(user)
  saveUsers(users)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name }))
  return { ok: true }
}

export function login(email: string, password: string): { ok: boolean; error?: string; name?: string } {
  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
    return { ok: false, error: 'Invalid email or password.' }
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name }))
  return { ok: true, name: user.name }
}

export function getSession(): { name: string; email: string } | null {
  try {
    const data = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    if (data?.email && data?.name) return data
    return null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}
