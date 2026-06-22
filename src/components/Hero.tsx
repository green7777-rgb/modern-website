export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up opacity-0">
          <span className="inline-block px-4 py-2 mb-6 text-xs font-semibold tracking-widest uppercase text-primary-light bg-primary/10 border border-primary/20 rounded-full">
            Digital Agency
          </span>
        </div>

        <h1 className="animate-fade-in-up opacity-0 delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
          We Build{' '}
          <span className="bg-gradient-to-r from-primary-light via-accent to-primary-light bg-clip-text text-transparent">
            Digital
          </span>
          <br />
          Experiences
        </h1>

        <p className="animate-fade-in-up opacity-0 delay-200 mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Transform your vision into reality with cutting-edge web solutions.
          We design and develop products that drive growth and inspire audiences.
        </p>

        <div className="animate-fade-in-up opacity-0 delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 text-base"
          >
            Start Your Project
          </a>
          <a
            href="#services"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 text-base"
          >
            Explore Services
          </a>
        </div>

        <div className="animate-fade-in-up opacity-0 delay-400 mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '200+', label: 'Projects' },
            { value: '50+', label: 'Clients' },
            { value: '98%', label: 'Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#services" className="text-white/40 hover:text-white/70 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  )
}
