const stats = [
  { value: '10M+', label: 'Queries Answered' },
  { value: '500K+', label: 'Images Generated' },
  { value: '50+', label: 'Languages Supported' },
  { value: '99.9%', label: 'Uptime' },
]

const rules = [
  {
    title: 'Always Accurate',
    description: 'Never makes up facts when uncertain. Provides verified, reliable information you can trust.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Adapts to You',
    description: 'Adjusts responses to your skill level, whether you are a beginner or an expert in the field.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    title: 'Creative & Clear',
    description: 'Delivers the best possible solution to every request with creative thinking and clear explanations.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
]

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-violet-600 mb-3">
              About Nexus AI
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Built to{' '}
              <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                Empower
              </span>{' '}
              Everyone
            </h2>
            <p className="mt-6 text-lg text-slate-500 leading-relaxed">
              Nexus AI is an advanced multimodal assistant designed to help you accomplish
              anything from answering questions and writing code to generating stunning images
              and analyzing complex data.
            </p>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Built with transparency at its core, Nexus AI explains its reasoning clearly
              and adapts to your skill level. Whether you are a student, developer, artist,
              or business professional, Nexus AI is your trusted companion.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">
              {stats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-white border border-slate-100">
                  <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {rules.map((rule) => (
              <div
                key={rule.title}
                className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-50 flex items-center justify-center text-violet-600 shrink-0 transition-transform duration-300 group-hover:scale-110">
                    {rule.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{rule.title}</h3>
                    <p className="mt-1 text-slate-500 text-[15px] leading-relaxed">{rule.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
