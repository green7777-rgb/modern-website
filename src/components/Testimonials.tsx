const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    content: 'Nexus AI has completely transformed my workflow. It writes clean code, debugs issues instantly, and explains complex algorithms in simple terms. It is like having a senior developer available 24/7.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Graphic Designer',
    content: 'The image prompt generation is incredible. Nexus AI creates highly detailed prompts with perfect style, lighting, and composition. My creative output has tripled since I started using it.',
    avatar: 'MR',
  },
  {
    name: 'Emily Watson',
    role: 'Data Analyst',
    content: 'I use Nexus AI daily for data analysis and report writing. It spots patterns I miss and generates clear, actionable insights. The step-by-step reasoning is a game changer.',
    avatar: 'EW',
  },
  {
    name: 'James Park',
    role: 'University Student',
    content: 'Nexus AI adapts perfectly to my level. It explains concepts in ways I actually understand and helps me write essays and study materials. My grades have improved significantly.',
    avatar: 'JP',
  },
  {
    name: 'Olivia Thompson',
    role: 'Content Creator',
    content: 'From blog posts to social media content, Nexus AI helps me create everything faster. The creative writing capabilities are exceptional — it always matches my brand voice.',
    avatar: 'OT',
  },
  {
    name: 'David Kim',
    role: 'Product Manager',
    content: 'Nexus AI helps me draft product specs, analyze user feedback, and even generate mockup prompts. It has become an essential part of my product development toolkit.',
    avatar: 'DK',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-violet-600 mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Loved by{' '}
            <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            See how people are using Nexus AI to transform their work and creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative p-8 rounded-2xl border border-slate-100 bg-white hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="w-10 h-10 text-violet-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-slate-600 leading-relaxed mb-6 text-[15px]">{t.content}</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
