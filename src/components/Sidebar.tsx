import type { Chat } from '../chatData'

interface SidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  isOpen: boolean
  onToggle: () => void
  onOpenSettings: () => void
  onLogout: () => void
  userName: string
}

export default function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, isOpen, onToggle, onOpenSettings, onLogout, userName }: SidebarProps) {
  const recentChats = [...chats].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onToggle} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-[#171717] z-50 flex flex-col transition-all duration-300 ${
          isOpen ? 'w-72' : 'w-0 md:w-0'
        } overflow-hidden border-r border-[#2a2a2a]`}
      >
        <div className="flex items-center justify-between p-3">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#333] text-sm text-white hover:bg-[#2a2a2a] transition-all w-full group"
          >
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
          <button
            onClick={onToggle}
            className="p-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors text-[#888]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-1 px-2">
          {recentChats.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#2a2a2a] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-xs text-[#666]">Start a conversation</p>
            </div>
          ) : (
            recentChats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 ${
                  chat.id === activeChatId
                    ? 'bg-[var(--primary)]/15 text-white'
                    : 'hover:bg-[#2a2a2a] text-[#ccc]'
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <svg className="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm truncate flex-1">{chat.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id) }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[#444] transition-all"
                >
                  <svg className="w-3.5 h-3.5 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-[#2a2a2a]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2a2a2a] cursor-pointer transition-colors group"
            onClick={onOpenSettings}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: `linear-gradient(135deg, var(--primary, #7c3aed), var(--accent, #06b6d4))` }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{userName}</p>
              <p className="text-[10px] text-[#666]">Settings & account</p>
            </div>
            <svg className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onLogout() }}
            className="px-3 py-2 rounded-xl text-xs text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}
