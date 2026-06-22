const stats = [
  { value: '8+', label: 'Years Experience' },
  { value: '200+', label: 'Projects Delivered' },
  { value: '25+', label: 'Team Members' },
  { value: '15+', label: 'Industry Awards' },
]

const values = [
  {
    title: 'Innovation First',
    description: 'We stay ahead of the curve, leveraging the latest technologies to deliver cutting-edge solutions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Client Partnership',
    description: 'Your success is our success. We build lasting partnerships through transparency and collaboration.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Quality Driven',
    description: 'Every pixel matters. We maintain rigorous standards to deliver products that exceed expectations.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Crafting Digital{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="mt-6 text-lg text-slate-500 leading-relaxed">
              Since 2018, we&apos;ve been helping businesses transform their digital presence.
              Our team of designers, developers, and strategists work together to create
              solutions that not only look stunning but deliver real results.
            </p>
            <p className="mt-4 text-slate-500 leading-relaxed">
              We believe in the power of clean code, thoughtful design, and strategic thinking.
              Every project is an opportunity to push boundaries and set new standards in digital excellence.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">
              {stats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-white border border-slate-100">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary shrink-0 transition-transform duration-300 group-hover:scale-110">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{value.title}</h3>
                    <p className="mt-1 text-slate-500 text-[15px] leading-relaxed">{value.description}</p>
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
