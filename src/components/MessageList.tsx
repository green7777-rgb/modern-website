import { useEffect, useRef } from 'react'
import type { Message } from '../chatData'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

function formatContent(content: string): string {
  let html = content
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[#1a1a2e] rounded-xl p-4 my-3 overflow-x-auto text-sm"><code>$2</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#2a2a3e] px-1.5 py-0.5 rounded text-sm text-violet-300">$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
  html = html.replace(/\n\n/g, '</p><p class="mb-3">')
  html = html.replace(/\n/g, '<br/>')
  return html
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`animate-slide-up ${isUser ? 'flex justify-end' : ''}`}>
      <div className={`max-w-3xl w-full ${isUser ? '' : 'mx-auto'}`}>
        <div className={`flex gap-4 py-5 ${isUser ? 'justify-end' : ''}`}>
          {!isUser && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
              N
            </div>
          )}
          <div className={`${isUser ? 'bg-[#303030] text-white px-5 py-3.5 rounded-3xl max-w-[70%]' : 'flex-1'}`}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div
                className="text-[#ececec] leading-relaxed [&_p]:mb-3 [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
              />
            )}
          </div>
          {isUser && (
            <div className="w-8 h-8 rounded-full bg-[#303030] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
              U
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex gap-4 py-5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
          N
        </div>
        <div className="flex items-center gap-1.5 pt-2">
          <div className="w-2 h-2 bg-[#888] rounded-full typing-dot" />
          <div className="w-2 h-2 bg-[#888] rounded-full typing-dot" />
          <div className="w-2 h-2 bg-[#888] rounded-full typing-dot" />
        </div>
      </div>
    </div>
  )
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">What can I help with?</h2>
        <p className="text-[#888] text-center max-w-md">
          Ask me anything — code, writing, images, analysis, or just chat.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
