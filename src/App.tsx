import { useState, useCallback, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'
import AuthScreen from './components/AuthScreen'
import SettingsPanel from './components/SettingsPanel'
import AdminPanel from './components/AdminPanel'
import { fetchAIResponse } from './chatData'
import { getSession, logout, saveSharedChat } from './utils/auth'
import { getSettings, applySettings } from './utils/settings'
import type { Chat, Message } from './chatData'
import type { ThemeSettings } from './utils/settings'

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function App() {
  const [user, setUser] = useState(getSession())
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [settings, setSettings] = useState<ThemeSettings>(getSettings)

  useEffect(() => {
    applySettings(settings)
  }, [])

  const activeChat = chats.find(c => c.id === activeChatId)
  const messages = activeChat?.messages ?? []

  const handleAuth = () => {
    setUser(getSession())
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    setChats([])
    setActiveChatId(null)
  }

  const handleNewChat = useCallback(() => {
    const newChat: Chat = {
      id: generateId(),
      title: 'New chat',
      messages: [],
      createdAt: new Date(),
    }
    setChats(prev => [newChat, ...prev])
    setActiveChatId(newChat.id)
    setSidebarOpen(false)
    setError(null)
  }, [])

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id)
    setSidebarOpen(false)
    setError(null)
  }, [])

  const handleDeleteChat = useCallback((id: string) => {
    setChats(prev => prev.filter(c => c.id !== id))
    if (activeChatId === id) {
      const remaining = chats.filter(c => c.id !== id)
      setActiveChatId(remaining.length > 0 ? remaining[0].id : null)
    }
  }, [activeChatId, chats])

  const handleSend = useCallback(async (content: string) => {
    let currentChatId = activeChatId

    if (!currentChatId) {
      const newChat: Chat = {
        id: generateId(),
        title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
      }
      setChats(prev => [newChat, ...prev])
      currentChatId = newChat.id
      setActiveChatId(currentChatId)
    }

    const userMsg: Message = { id: generateId(), role: 'user', content }

    setChats(prev => prev.map(chat => {
      if (chat.id !== currentChatId) return chat
      const title = chat.messages.length === 0
        ? content.slice(0, 40) + (content.length > 40 ? '...' : '')
        : chat.title
      return { ...chat, title, messages: [...chat.messages, userMsg] }
    }))

    setIsLoading(true)
    setError(null)

    try {
      const currentMessages = chats.find(c => c.id === currentChatId)?.messages ?? []
      const allMessages = [...currentMessages, userMsg]
      const reply = await fetchAIResponse(allMessages)
      const aiMsg: Message = { id: generateId(), role: 'assistant', content: reply }

      setChats(prev => {
        const updated = prev.map(c =>
          c.id === currentChatId ? { ...c, messages: [...c.messages, userMsg, aiMsg] } : c
        )

        if (user) {
          const chat = updated.find(c => c.id === currentChatId)
          if (chat) {
            saveSharedChat({
              userId: user.email,
              userName: user.name,
              chatId: chat.id,
              title: chat.title,
              messages: chat.messages.map(m => ({ role: m.role, content: m.content, timestamp: Date.now() })),
              createdAt: chat.createdAt.getTime(),
            }).catch(() => {})
          }
        }

        return updated
      })
    } catch {
      setError('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [activeChatId, chats, user])

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />
  }

  return (
    <div className="h-screen flex bg-[#171717]">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onOpenSettings={() => setSettingsOpen(true)}
        onLogout={handleLogout}
        userName={user.name}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSettingsChange={(s) => { setSettings(s); applySettings(s) }}
      />

      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full transition-all">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2a2a] shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-[#2a2a2a] transition-colors text-[#888]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-base font-medium text-white">
            {activeChat?.title ?? 'Nexus AI'}
          </span>
          {isLoading && (
            <span className="text-xs ml-2 animate-pulse" style={{ color: 'var(--primary)' }}>Thinking...</span>
          )}
          {user.isAdmin && (
            <button
              onClick={() => setAdminOpen(true)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin
            </button>
          )}
        </header>

        {error && (
          <div className="mx-4 mt-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
            {error}
          </div>
        )}

        <MessageList messages={messages} isLoading={isLoading} />

        <ChatInput onSend={handleSend} isLoading={isLoading} settings={settings} />
      </main>
    </div>
  )
}

export default App
