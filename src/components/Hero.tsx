export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950/50 to-slate-950"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up opacity-0">
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-semibold tracking-widest uppercase text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Advanced Multimodal AI
          </span>
        </div>

        <h1 className="animate-fade-in-up opacity-0 delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
          Your Intelligent
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            AI Companion
          </span>
        </h1>

        <p className="animate-fade-in-up opacity-0 delay-200 mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Answer questions, write code, generate stunning images, and solve complex problems step-by-step.
          Nexus AI adapts to your skill level and delivers the best solution every time.
        </p>

        <div className="animate-fade-in-up opacity-0 delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300 text-base"
          >
            Start Using Nexus AI
          </a>
          <a
            href="#capabilities"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 text-base"
          >
            Explore Capabilities
          </a>
        </div>

        <div className="animate-fade-in-up opacity-0 delay-400 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {[
            { value: '10M+', label: 'Queries Answered' },
            { value: '500K+', label: 'Images Generated' },
            { value: '99.9%', label: 'Accuracy Rate' },
            { value: '24/7', label: 'Availability' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#capabilities" className="text-white/40 hover:text-white/70 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  )
}
