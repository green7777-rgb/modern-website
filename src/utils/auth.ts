export interface User {
  name: string
  email: string
  password: string
  isAdmin: boolean
  createdAt: number
}

const USERS_KEY = 'nexus_users'
const SESSION_KEY = 'nexus_session'
const ALL_CHATS_KEY = 'nexus_all_chats'

const HARDCODED_ADMIN_EMAILS = ['greem@admin.com', 'cyrenframe97@gmail.com']

function ensureHardcodedAdmins(users: User[]): User[] {
  for (const email of HARDCODED_ADMIN_EMAILS) {
    const existing = users.find(u => u.email === email)
    if (existing) {
      existing.isAdmin = true
    } else {
      users.push({ name: 'Greem', email, password: 'admin123', isAdmin: true, createdAt: Date.now() })
    }
  }
  return users
}

export function getUsers(): User[] {
  try {
    let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[]
    if (users.length === 0) {
      const admin: User = { name: 'Greem', email: 'greem@admin.com', password: 'admin123', isAdmin: true, createdAt: Date.now() }
      users.push(admin)
    }
    users = ensureHardcodedAdmins(users)
    saveUsers(users)
    return users
  } catch {
    const admin: User = { name: 'Greem', email: 'greem@admin.com', password: 'admin123', isAdmin: true, createdAt: Date.now() }
    localStorage.setItem(USERS_KEY, JSON.stringify([admin]))
    return [admin]
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
  const user: User = { name, email, password, isAdmin: false, createdAt: Date.now() }
  users.push(user)
  saveUsers(users)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name }))
  return { ok: true }
}

export function login(email: string, password: string): { ok: boolean; error?: string; name?: string; isAdmin?: boolean } {
  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
    return { ok: false, error: 'Invalid email or password.' }
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name, isAdmin: user.isAdmin }))
  return { ok: true, name: user.name, isAdmin: user.isAdmin }
}

export function getSession(): { name: string; email: string; isAdmin: boolean } | null {
  try {
    const data = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    if (data?.email && data?.name) return { ...data, isAdmin: data.isAdmin || false }
    return null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function toggleAdmin(email: string): boolean {
  const users = getUsers()
  const user = users.find(u => u.email === email)
  if (!user || HARDCODED_ADMIN_EMAILS.includes(user.email)) return false
  user.isAdmin = !user.isAdmin
  saveUsers(users)
  return user.isAdmin
}

export function deleteUser(email: string): boolean {
  const users = getUsers()
  if (HARDCODED_ADMIN_EMAILS.includes(email)) return false
  const filtered = users.filter(u => u.email !== email)
  if (filtered.length === users.length) return false
  saveUsers(filtered)
  return true
}

export interface SharedChat {
  userId: string
  userName: string
  chatId: string
  title: string
  messages: { role: string; content: string; timestamp: number }[]
  createdAt: number
}

export function getAllChats(): SharedChat[] {
  try {
    return JSON.parse(localStorage.getItem(ALL_CHATS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveSharedChat(chat: SharedChat) {
  const all = getAllChats()
  const idx = all.findIndex(c => c.userId === chat.userId && c.chatId === chat.chatId)
  if (idx >= 0) {
    all[idx] = chat
  } else {
    all.push(chat)
  }
  localStorage.setItem(ALL_CHATS_KEY, JSON.stringify(all))
}
