import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0f172a] pt-36 pb-20 md:pt-44 md:pb-28 flex flex-col justify-center min-h-[90vh]">
      {/* Background soft ambient glows in Blue/Teal */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#2563eb]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#14b8a6]/10 blur-[130px] pointer-events-none" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Section */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#14b8a6] text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse" />
              Introducing Next-Gen Systems
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
              Architecting the <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Future of Software
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-slate-300 max-w-xl mb-10 leading-relaxed font-light">
              Glyptika Studios engineers high-performance web systems, custom SaaS applications, and enterprise AI portals. We build clean, secure codebases designed to scale with your business goals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/request-proposal"
                className="px-8 py-4 rounded-full text-center font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-450 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap flex-shrink-0"
              >
                Request Proposal
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 rounded-full text-center font-semibold text-slate-300 hover:text-white bg-slate-900/50 hover:bg-slate-800/85 border border-slate-800 hover:border-slate-700 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap flex-shrink-0"
              >
                Explore Products
              </Link>
            </div>
          </div>

          {/* Interactive Panel / Graphical Side Column */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="w-full h-[420px] rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 shadow-2xl relative group overflow-hidden backdrop-blur-md">
              {/* Inner ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />
              
              {/* Header panel */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                </div>
                <div className="text-xs font-mono text-slate-500">glyptika_core_v1.5.0</div>
              </div>

              {/* Mock code / visual lines */}
              <div className="space-y-4 font-mono text-xs text-slate-300">
                <div className="text-blue-400">const glyptika = new Ecosystem(&apos;production&apos;);</div>
                <div className="text-slate-500 pl-4">{"// Initializing secure database connection"}</div>
                <div>await glyptika.connectSupabase(&#123; <span className="text-teal-400">RLS: true</span> &#125;);</div>
                <div className="text-slate-500 pl-4">{"// Spinning up Next.js 15 Route Handlers"}</div>
                <div>await glyptika.initAPI(&#123; <span className="text-cyan-400">CORS: &apos;same-origin&apos;</span> &#125;);</div>
                
                {/* Floating metric panel inside dashboard */}
                <div className="mt-8 p-4 rounded-xl bg-slate-950/80 border border-slate-850 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-sans">Ecosystem Status</div>
                    <div className="text-sm font-semibold text-white mt-1 font-sans">Operational</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                    <span className="text-teal-400 text-xs font-sans">99.9% Uptime</span>
                  </div>
                </div>

                {/* Additional console lines */}
                <div className="text-slate-500 mt-6">{"// System deployment log:"}</div>
                <div className="text-teal-400 font-bold">&gt; DEPLOY_SUCCESS: Vercel edge node active.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}