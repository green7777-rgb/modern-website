import { useEffect, useRef, useState } from 'react'
import type { Message } from '../chatData'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

function extractCodeBlocks(content: string): { type: string; code: string }[] {
  const blocks: { type: string; code: string }[] = []
  const regex = /```(\w*)\n([\s\S]*?)```/g
  let match
  while ((match = regex.exec(content)) !== null) {
    blocks.push({ type: match[1] || 'txt', code: match[2].trim() })
  }
  return blocks
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-[#2a2a2a]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <span className="text-xs text-[#666] font-mono">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:bg-[#333]"
          style={{ color: copied ? '#22c55e' : 'var(--primary)' }}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-[#111] p-4 overflow-x-auto">
        <code className="text-sm text-[#ccc] font-mono leading-relaxed">{code}</code>
      </pre>
    </div>
  )
}

function formatContent(content: string): string {
  let html = content

  const codeBlocks: string[] = []
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const idx = codeBlocks.length
    codeBlocks.push(`<div class="code-block-placeholder" data-lang="${lang}" data-code="${encodeURIComponent(code.trim())}"></div>`)
    return `__CODE_BLOCK_${idx}__`
  })

  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-sm" style="color:var(--primary,#7c3aed)">$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/^[-•] (.+)$/gm, '<li class="ml-4 list-disc mb-1">$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal mb-1">$2</li>')
  html = html.replace(/\n\n/g, '</p><p class="mb-3">')
  html = html.replace(/\n/g, '<br/>')

  codeBlocks.forEach((block, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, block)
  })

  return html
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const containerRef = useRef<HTMLDivElement>(null)
  const codeBlocks = !isUser ? extractCodeBlocks(message.content) : []

  useEffect(() => {
    if (!containerRef.current) return
    const placeholders = containerRef.current.querySelectorAll('.code-block-placeholder')
    placeholders.forEach((el) => {
      const lang = el.getAttribute('data-lang') || ''
      const code = decodeURIComponent(el.getAttribute('data-code') || '')
      const wrapper = document.createElement('div')
      wrapper.innerHTML = `<div class="code-block-mount"></div>`
      el.replaceWith(wrapper)
      const mount = wrapper.querySelector('.code-block-mount')!
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(mount)
        root.render(<CodeBlock language={lang} code={code} />)
      })
    })
  }, [message.content])

  return (
    <div className={`animate-slide-up ${isUser ? 'flex justify-end' : ''}`}>
      <div className={`max-w-3xl w-full ${isUser ? '' : 'mx-auto'}`}>
        <div className={`flex gap-4 py-4 ${isUser ? 'justify-end' : ''}`}>
          {!isUser && (
            <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
              style={{ background: 'linear-gradient(135deg, var(--primary, #7c3aed), var(--accent, #06b6d4))' }}>
              N
            </div>
          )}
          <div className={`${isUser ? 'text-white max-w-[75%]' : 'flex-1'}`}>
            {isUser ? (
              <div className="px-5 py-3 rounded-2xl rounded-tr-sm" style={{ background: 'var(--primary, #7c3aed)' }}>
                <p className="whitespace-pre-wrap" style={{ fontSize: 'var(--chat-font-size, 16px)' }}>{message.content}</p>
              </div>
            ) : (
              <div ref={containerRef}>
                <div
                  className="text-[#ececec] leading-relaxed [&_p]:mb-3 [&_strong]:text-white"
                  style={{ fontSize: 'var(--chat-font-size, 16px)' }}
                  dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
                />
                {codeBlocks.length > 1 && (
                  <DownloadAllButton codeBlocks={codeBlocks} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DownloadAllButton({ codeBlocks }: { codeBlocks: { type: string; code: string }[] }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    const zip = new JSZip()
    codeBlocks.forEach((block, i) => {
      const ext = block.type || 'txt'
      zip.file(`script_${i + 1}.${ext}`, block.code)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'nexus_ai_scripts.zip')
    setDownloading(false)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#333] text-sm font-medium text-[#ccc] hover:bg-[#2a2a2a] hover:border-[var(--primary)] hover:text-white transition-all"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {downloading ? 'Creating zip...' : `Download all ${codeBlocks.length} scripts as zip`}
    </button>
  )
}

function TypingIndicator() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex gap-4 py-4">
        <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, var(--primary, #7c3aed), var(--accent, #06b6d4))' }}>
          N
        </div>
        <div className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-3 rounded-2xl rounded-tl-sm">
          <div className="w-2 h-2 rounded-full typing-dot" style={{ background: 'var(--primary, #7c3aed)' }} />
          <div className="w-2 h-2 rounded-full typing-dot" style={{ background: 'var(--primary, #7c3aed)' }} />
          <div className="w-2 h-2 rounded-full typing-dot" style={{ background: 'var(--primary, #7c3aed)' }} />
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
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--primary, #7c3aed), var(--accent, #06b6d4))' }}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">What can I help with?</h2>
        <p className="text-[#666] text-center max-w-md">
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
