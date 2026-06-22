const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechFlow',
    content: 'Apex Digital transformed our entire online presence. The new platform increased our conversion rates by 150% in just three months. Their team is exceptional.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Founder, GreenLeaf',
    content: 'Working with Apex was a game-changer. They understood our vision from day one and delivered a product that exceeded all expectations. Highly recommend.',
    avatar: 'MR',
  },
  {
    name: 'Emily Watson',
    role: 'CTO, DataSphere',
    content: 'The level of technical expertise and creative thinking at Apex is unmatched. They built us a scalable architecture that handles millions of requests daily.',
    avatar: 'EW',
  },
  {
    name: 'James Park',
    role: 'Marketing Director, Vertex',
    content: 'Our SEO rankings skyrocketed after the redesign. Apex doesn\'t just build websites — they build growth engines. Outstanding partnership.',
    avatar: 'JP',
  },
  {
    name: 'Olivia Thompson',
    role: 'Product Lead, Nexus',
    content: 'From concept to launch, Apex was incredible. Their attention to detail in UI/UX design resulted in our best user engagement metrics ever.',
    avatar: 'OT',
  },
  {
    name: 'David Kim',
    role: 'COO, Pinnacle',
    content: 'The cloud infrastructure Apex set up for us reduced our hosting costs by 40% while improving performance. True engineering excellence.',
    avatar: 'DK',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Loved by{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            Don&apos;t just take our word for it — hear from the teams we&apos;ve helped succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative p-8 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="w-10 h-10 text-primary/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-slate-600 leading-relaxed mb-6 text-[15px]">{t.content}</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
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
