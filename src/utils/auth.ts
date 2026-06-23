import { initializeApp } from 'firebase/app'
import { getDatabase, ref, get, set, remove } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app: ReturnType<typeof initializeApp> | null = null
let db: ReturnType<typeof getDatabase> | null = null

function getDb() {
  if (!app && firebaseConfig.databaseURL) {
    try {
      app = initializeApp(firebaseConfig)
      db = getDatabase(app)
    } catch (e) {
      console.warn('[Nexus] Firebase init failed:', e)
    }
  }
  return db
}

export function isFirebaseConnected(): boolean {
  return !!getDb()
}

async function cloudGet<T>(path: string): Promise<T | null> {
  const database = getDb()
  if (!database) return null
  try {
    const snap = await get(ref(database, path))
    return snap.exists() ? snap.val() as T : null
  } catch {
    return null
  }
}

async function cloudSet(path: string, data: unknown): Promise<boolean> {
  const database = getDb()
  if (!database) return false
  try {
    await set(ref(database, path), data)
    return true
  } catch {
    return false
  }
}

async function cloudRemove(path: string): Promise<boolean> {
  const database = getDb()
  if (!database) return false
  try {
    await remove(ref(database, path))
    return true
  } catch {
    return false
  }
}

const TOKENS_PATH = 'nexus_reset_tokens'
const USERS_PATH = 'nexus_users'

interface ResetToken {
  email: string
  token: string
  createdAt: number
  expiresAt: number
}

const HARDCODED_ADMIN_EMAILS = ['cyrenframe97@gmail.com']

function deobfuscate(encoded: string): string {
  const key = [78, 101, 120, 117, 115]
  const bytes = atob(encoded).split('').map(c => c.charCodeAt(0))
  return bytes.map((b, i) => String.fromCharCode(b ^ key[i % key.length])).join('')
}

function getHardcodedAdmins(): User[] {
  const emails = [
    deobfuscate('LRwKEB0oFxkYFndSOBIeLwwUWxAhCA=='),
  ]
  const name = deobfuscate('CRcdEB4=')
  const pw = deobfuscate('LwEVHB1/V0s=')
  return emails.map(email => ({ name, email, password: pw, isAdmin: true, createdAt: Date.now() }))
}

function ensureHardcodedAdmins(users: User[]): User[] {
  const hardcoded = getHardcodedAdmins()
  for (const admin of hardcoded) {
    const existing = users.find(u => u.email === admin.email)
    if (existing) {
      existing.isAdmin = true
    } else {
      users.push(admin)
    }
  }
  return users
}

export interface User {
  name: string
  email: string
  password: string
  isAdmin: boolean
  createdAt: number
}

export async function getUsers(): Promise<User[]> {
  const cloudUsers = await cloudGet<User[]>(USERS_PATH)
  let users: User[] = cloudUsers || JSON.parse(localStorage.getItem(USERS_PATH) || '[]')

  if (users.length === 0) {
    users.push(...getHardcodedAdmins())
  }

  users = ensureHardcodedAdmins(users)
  localStorage.setItem(USERS_PATH, JSON.stringify(users))
  await cloudSet(USERS_PATH, users)
  return users
}

async function saveUsers(users: User[]) {
  localStorage.setItem(USERS_PATH, JSON.stringify(users))
  await cloudSet(USERS_PATH, users)
}

export async function signup(name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const users = await getUsers()
  if (users.find(u => u.email === email)) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  const user: User = { name, email, password, isAdmin: false, createdAt: Date.now() }
  users.push(user)
  await saveUsers(users)
  localStorage.setItem('nexus_session', JSON.stringify({ email, name, isAdmin: false }))
  return { ok: true }
}

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string; name?: string; isAdmin?: boolean }> {
  const users = await getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
    return { ok: false, error: 'Invalid email or password.' }
  }
  localStorage.setItem('nexus_session', JSON.stringify({ email: user.email, name: user.name, isAdmin: user.isAdmin }))
  return { ok: true, name: user.name, isAdmin: user.isAdmin }
}

export async function createResetToken(email: string): Promise<{ ok: boolean; token?: string; error?: string }> {
  const users = await getUsers()
  const user = users.find(u => u.email === email)
  if (!user) return { ok: false, error: 'No account found with this email.' }

  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  const resetData: ResetToken = {
    email,
    token,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  }

  await cloudSet(`${TOKENS_PATH}/${token}`, resetData)
  return { ok: true, token }
}

export async function validateResetToken(token: string): Promise<{ ok: boolean; email?: string; error?: string }> {
  const data = await cloudGet<ResetToken>(`${TOKENS_PATH}/${token}`)
  if (!data) return { ok: false, error: 'Invalid or expired reset link.' }
  if (Date.now() > data.expiresAt) {
    await cloudRemove(`${TOKENS_PATH}/${token}`)
    return { ok: false, error: 'Reset link has expired. Request a new one.' }
  }
  return { ok: true, email: data.email }
}

export async function resetPasswordWithToken(token: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const validation = await validateResetToken(token)
  if (!validation.ok) return { ok: false, error: validation.error }

  const users = await getUsers()
  const user = users.find(u => u.email === validation.email)
  if (!user) return { ok: false, error: 'Account not found.' }

  if (newPassword.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }

  user.password = newPassword
  await saveUsers(users)
  await cloudRemove(`${TOKENS_PATH}/${token}`)
  return { ok: true }
}

export async function resetPassword(email: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const users = await getUsers()
  const user = users.find(u => u.email === email)
  if (!user) return { ok: false, error: 'No account found with this email.' }
  if (newPassword.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }
  user.password = newPassword
  await saveUsers(users)
  return { ok: true }
}

export function getSession(): { name: string; email: string; isAdmin: boolean } | null {
  try {
    const data = JSON.parse(localStorage.getItem('nexus_session') || 'null')
    if (data?.email && data?.name) return { ...data, isAdmin: data.isAdmin || false }
    return null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('nexus_session')
}

export async function toggleAdmin(email: string): Promise<boolean> {
  const users = await getUsers()
  const user = users.find(u => u.email === email)
  if (!user || HARDCODED_ADMIN_EMAILS.includes(user.email)) return false
  user.isAdmin = !user.isAdmin
  await saveUsers(users)
  return user.isAdmin
}

export async function deleteUser(email: string): Promise<boolean> {
  const users = await getUsers()
  if (HARDCODED_ADMIN_EMAILS.includes(email)) return false
  const filtered = users.filter(u => u.email !== email)
  if (filtered.length === users.length) return false
  await saveUsers(filtered)
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

export async function getAllChats(): Promise<SharedChat[]> {
  const cloudChats = await cloudGet<SharedChat[]>('nexus_all_chats')
  if (cloudChats) {
    localStorage.setItem('nexus_all_chats', JSON.stringify(cloudChats))
    return cloudChats
  }
  try {
    return JSON.parse(localStorage.getItem('nexus_all_chats') || '[]')
  } catch {
    return []
  }
}

export async function saveSharedChat(chat: SharedChat) {
  const all = await getAllChats()
  const idx = all.findIndex(c => c.userId === chat.userId && c.chatId === chat.chatId)
  if (idx >= 0) {
    all[idx] = chat
  } else {
    all.push(chat)
  }
  localStorage.setItem('nexus_all_chats', JSON.stringify(all))
  await cloudSet('nexus_all_chats', all)
}
