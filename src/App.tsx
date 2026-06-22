import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'
import { generateId, getSimulatedResponse } from './chatData'
import type { Chat, Message } from './chatData'

function App() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeChat = chats.find(c => c.id === activeChatId)
  const messages = activeChat?.messages ?? []

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
  }, [])

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id)
    setSidebarOpen(false)
  }, [])

  const handleDeleteChat = useCallback((id: string) => {
    setChats(prev => prev.filter(c => c.id !== id))
    if (activeChatId === id) {
      setActiveChatId(chats.length > 1 ? chats.find(c => c.id !== id)!.id : null)
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

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    setChats(prev => {
      const chat = prev.find(c => c.id === currentChatId)
      if (!chat) return prev
      const aiMsg: Message = { id: generateId(), role: 'assistant', content: getSimulatedResponse(chat.messages) }
      return prev.map(c => c.id === currentChatId ? { ...c, messages: [...c.messages, aiMsg] } : c)
    })

    setIsLoading(false)
  }, [activeChatId])

  return (
    <div className="h-screen flex bg-[#212121]">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 flex flex-col h-full ml-0 md:ml-0 transition-all">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-[#2f2f2f] shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#2f2f2f] transition-colors text-[#b4b4b4]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-base font-medium text-[#ececec]">
            {activeChat?.title ?? 'Nexus AI'}
          </span>
        </header>

        <MessageList messages={messages} isLoading={isLoading} />

        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </main>
    </div>
  )
}

export default App
