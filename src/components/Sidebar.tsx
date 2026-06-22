import type { Chat } from '../chatData'

interface SidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, isOpen, onToggle }: SidebarProps) {
  const recentChats = [...chats].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-[#171717] z-50 flex flex-col transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 md:w-0'
        } overflow-hidden`}
      >
        <div className="flex items-center justify-between p-3 border-b border-[#2f2f2f]">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#424242] text-sm text-white hover:bg-[#2f2f2f] transition-colors w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-[#2f2f2f] transition-colors text-[#b4b4b4]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {recentChats.length === 0 ? (
            <p className="text-xs text-[#666] px-4 py-8 text-center">No conversations yet</p>
          ) : (
            recentChats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  chat.id === activeChatId
                    ? 'bg-[#2f2f2f]'
                    : 'hover:bg-[#2f2f2f]'
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <svg className="w-4 h-4 text-[#b4b4b4] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm text-[#ececec] truncate flex-1">{chat.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id) }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#424242] transition-all"
                >
                  <svg className="w-3.5 h-3.5 text-[#b4b4b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-[#2f2f2f]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2f2f2f] cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
              N
            </div>
            <span className="text-sm text-white">Nexus AI</span>
          </div>
        </div>
      </aside>
    </>
  )
}
