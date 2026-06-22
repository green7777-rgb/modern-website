const capabilities = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Answer Questions',
    description: 'Get accurate, intelligent answers to any question. From simple facts to complex explanations, Nexus AI understands context and delivers clarity.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Write Code',
    description: 'Generate clean, efficient code in any programming language. Debug issues, optimize performance, and build entire applications from scratch.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: 'Write & Create',
    description: 'Craft stories, articles, reports, and creative content. Nexus AI adapts tone, style, and complexity to match your needs perfectly.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Image Generation',
    description: 'Create detailed image prompts with style, lighting, composition, and colors. Generate concepts for artwork, logos, illustrations, and more.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Analyze Data',
    description: 'Process and analyze text, numbers, and datasets. Extract insights, identify patterns, and generate visualizations from your data.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Step-by-Step Reasoning',
    description: 'Complex problems broken down into clear, logical steps. Understand the thinking behind every answer with transparent explanations.',
  },
]

export default function Services() {
  return (
    <section id="capabilities" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-violet-600 mb-3">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Everything You Need,{' '}
            <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
              One AI
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            From creative writing to technical problem-solving, Nexus AI handles it all with precision and intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group relative p-8 rounded-2xl border border-slate-100 bg-white hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-50 flex items-center justify-center text-violet-600 mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {cap.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{cap.title}</h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">{cap.description}</p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
