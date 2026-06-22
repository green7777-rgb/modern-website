export interface ThemeSettings {
  primaryColor: string
  accentColor: string
  fontSize: 'small' | 'medium' | 'large'
  sendOnEnter: boolean
}

const SETTINGS_KEY = 'nexus_settings'

const defaultSettings: ThemeSettings = {
  primaryColor: '#7c3aed',
  accentColor: '#06b6d4',
  fontSize: 'medium',
  sendOnEnter: true,
}

export function getSettings(): ThemeSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null')
    return { ...defaultSettings, ...saved }
  } catch {
    return { ...defaultSettings }
  }
}

export function saveSettings(settings: ThemeSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  applySettings(settings)
}

export function applySettings(settings: ThemeSettings) {
  const root = document.documentElement
  root.style.setProperty('--primary', settings.primaryColor)
  root.style.setProperty('--accent', settings.accentColor)
  const sizes = { small: '14px', medium: '16px', large: '18px' }
  root.style.setProperty('--chat-font-size', sizes[settings.fontSize])
}

export const COLOR_PRESETS = [
  { name: 'Violet', primary: '#7c3aed', accent: '#06b6d4' },
  { name: 'Blue', primary: '#2563eb', accent: '#0ea5e9' },
  { name: 'Green', primary: '#16a34a', accent: '#22d3ee' },
  { name: 'Orange', primary: '#ea580c', accent: '#f59e0b' },
  { name: 'Pink', primary: '#db2777', accent: '#f472b6' },
  { name: 'Red', primary: '#dc2626', accent: '#fb923c' },
  { name: 'Teal', primary: '#0d9488', accent: '#2dd4bf' },
  { name: 'Indigo', primary: '#4f46e5', accent: '#818cf8' },
  { name: 'Rose', primary: '#e11d48', accent: '#fb7185' },
  { name: 'Amber', primary: '#d97706', accent: '#fbbf24' },
]
