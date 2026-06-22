import { useState } from 'react'
import { getUsers, toggleAdmin, deleteUser, getAllChats, type SharedChat } from '../utils/auth'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [users, setUsers] = useState(getUsers)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [allChats, setAllChats] = useState<SharedChat[]>(getAllChats)
  const [refreshKey, setRefreshKey] = useState(0)

  if (!isOpen) return null

  const refresh = () => {
    setUsers(getUsers())
    setAllChats(getAllChats())
    setRefreshKey(k => k + 1)
  }

  const handleToggleAdmin = (email: string) => {
    toggleAdmin(email)
    refresh()
  }

  const handleDelete = (email: string) => {
    if (confirm(`Delete user ${email}?`)) {
      deleteUser(email)
      refresh()
    }
  }

  const getUserChats = (userName: string) => {
    return allChats.filter(c => c.userName === userName)
  }

  const selectedUserData = selectedUser ? users.find(u => u.name === selectedUser) : null
  const selectedUserChats = selectedUser ? getUserChats(selectedUser) : []
  const totalChats = allChats.length
  const totalMessages = allChats.reduce((sum, c) => sum + c.messages.length, 0)

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-4 md:inset-8 bg-[#1e1e1e] rounded-2xl border border-[#333] z-50 flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
              <p className="text-xs text-[#888]">Manage users and view chats</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#333] text-[#888] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden" key={refreshKey}>
          {/* User List */}
          <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-[#333]`}>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 px-4 py-4 border-b border-[#2a2a2a]">
              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
                <p className="text-2xl font-bold text-white">{users.length}</p>
                <p className="text-[10px] text-[#666] uppercase tracking-wider">Users</p>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
                <p className="text-2xl font-bold text-white">{totalChats}</p>
                <p className="text-[10px] text-[#666] uppercase tracking-wider">Chats</p>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
                <p className="text-2xl font-bold text-white">{totalMessages}</p>
                <p className="text-[10px] text-[#666] uppercase tracking-wider">Messages</p>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
                <p className="text-2xl font-bold text-white">{users.filter(u => u.isAdmin).length}</p>
                <p className="text-[10px] text-[#666] uppercase tracking-wider">Admins</p>
              </div>
            </div>

            {/* Users */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
              <p className="px-3 py-2 text-xs font-semibold text-[#666] uppercase tracking-wider">All Users</p>
              {users.map((u) => (
                <div
                  key={u.email}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all mb-0.5 ${
                    selectedUser === u.name ? 'bg-[var(--primary)]/15' : 'hover:bg-[#2a2a2a]'
                  }`}
                  onClick={() => setSelectedUser(u.name)}
                >
                  <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: u.isAdmin ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'linear-gradient(135deg, var(--primary, #7c3aed), var(--accent, #06b6d4))' }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm text-white font-medium truncate">{u.name}</p>
                      {u.isAdmin && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">ADMIN</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#666] truncate">{getUserChats(u.name).length} chats</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Viewer / User Detail */}
          <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2a2a2a]">
                  <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 rounded-xl hover:bg-[#333] text-[#888]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: selectedUserData?.isAdmin ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'linear-gradient(135deg, var(--primary, #7c3aed), var(--accent, #06b6d4))' }}>
                    {selectedUser.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{selectedUser}</p>
                    <p className="text-xs text-[#666]">{selectedUserChats.length} conversations</p>
                  </div>
                  {selectedUserData?.email !== 'greem@admin.com' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAdmin(selectedUserData!.email)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          selectedUserData?.isAdmin
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                            : 'bg-[#2a2a2a] text-[#888] border border-[#333] hover:bg-[#333] hover:text-white'
                        }`}
                      >
                        {selectedUserData?.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => { handleDelete(selectedUserData!.email); setSelectedUser(null) }}
                        className="px-3 py-2 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                  {selectedUserChats.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#2a2a2a] flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-[#666]">No chats recorded yet</p>
                      <p className="text-xs text-[#555] mt-1">Chats will appear here after the user sends messages</p>
                    </div>
                  ) : (
                    selectedUserChats.map((chat) => (
                      <div key={chat.chatId} className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm text-white font-medium">{chat.title}</span>
                          <span className="text-[10px] text-[#555] ml-auto">{chat.messages.length} messages</span>
                        </div>
                        <div className="px-4 py-3 space-y-3 max-h-96 overflow-y-auto">
                          {chat.messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                              {msg.role !== 'user' && (
                                <div className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-white text-[9px] font-bold"
                                  style={{ background: 'linear-gradient(135deg, var(--primary, #7c3aed), var(--accent, #06b6d4))' }}>
                                  N
                                </div>
                              )}
                              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                                msg.role === 'user'
                                  ? 'text-white rounded-tr-sm'
                                  : 'bg-[#2a2a2a] text-[#ccc] rounded-tl-sm'
                              }`}
                                style={msg.role === 'user' ? { background: 'var(--primary, #7c3aed)' } : {}}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">Select a user</h3>
                <p className="text-sm text-[#666] text-center max-w-sm">Click on a user from the list to view their conversations and manage their account.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
