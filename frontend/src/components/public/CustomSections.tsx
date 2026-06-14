"use client";

import { motion } from "framer-motion";
import { Move3d, HardHat, TrendingDown, Clock, Layers, Rocket } from "lucide-react";

// Real Data integrated from old website
const FEATURED_PROJECTS = [
  {
    id: "proj-1",
    title: "XPLOR MVP",
    subtitle: "2D Maps -> VR Environments",
    content: [
      "A revolutionary automation platform that transforms flat architectural drawings into fully interactive spatial environments in record time.",
      "By eliminating the manual modeling bottleneck, we drastically reduce production costs and time-to-market for real estate and architectural visualization."
    ],
    metrics: [
      { label: "Time Saved", value: "99%", icon: Clock },
      { label: "Cost Saved", value: "99.98%", icon: TrendingDown },
    ],
    mediaType: "image",
    imageIcon: Move3d,
    alignment: "left" as const,
    color: "blue"
  },
  {
    id: "proj-2",
    title: "HRV Simulator",
    subtitle: "Heavy Recovery Vehicle VR Training Module",
    content: [
      "A full-scale VR simulation environment engineered for high-stakes mechanical training and operational readiness without risking multi-million dollar equipment.",
      "Delivering uncompromised fidelity and physics accuracy to ensure personnel are mission-ready from day one."
    ],
    metrics: [
      { label: "3D Assets", value: "150+ Models", icon: Layers },
      { label: "Deployment", value: "Full VR", icon: Rocket },
    ],
    mediaType: "image",
    imageIcon: HardHat,
    alignment: "right" as const,
    color: "indigo"
  }
];

export default function CustomSections() {
  return (
    <section className="relative w-full py-32 bg-[#000000] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col gap-32 lg:gap-40">
          {FEATURED_PROJECTS.map((project) => {
            const isLeftText = project.alignment === "left";
            const Icon = project.imageIcon;
            
            const glowClass = project.color === 'blue' ? 'bg-blue-600/20' : 'bg-indigo-600/20';
            const textGradient = project.color === 'blue' ? 'from-blue-400 to-cyan-300' : 'from-indigo-400 to-blue-300';
            const iconColor = project.color === 'blue' ? 'text-blue-400' : 'text-indigo-400';

            return (
              <div 
                key={project.id} 
                className={`flex flex-col gap-12 lg:gap-20 items-center ${
                  isLeftText ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Text Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isLeftText ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-1/2 space-y-8 relative"
                >
                  {/* Subtle background glow behind text */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] ${glowClass} blur-[100px] -z-10 rounded-full opacity-30 pointer-events-none`} />

                  <div>
                    <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${iconColor}`}>
                      {project.subtitle}
                    </h4>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
                      {project.title.split(' ')[0]} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${textGradient}`}>{project.title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                  </div>

                  <div className="space-y-5">
                    {project.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-lg text-slate-400 font-light leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {/* Highlight Metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    {project.metrics.map((metric, mIdx) => {
                      const MetricIcon = metric.icon;
                      return (
                        <div key={mIdx} className="p-5 rounded-2xl bg-[#0a1128]/50 border border-slate-800/80 backdrop-blur-md flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full bg-[#000000] border border-slate-800 flex items-center justify-center`}>
                            <MetricIcon className={`w-5 h-5 ${iconColor}`} />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white tracking-tight">{metric.value}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{metric.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Media Placeholder (EQTY LAB style 3D/Glass container) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, rotateY: isLeftText ? 15 : -15 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-1/2 relative perspective-1000"
                >
                  <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[3rem] bg-[#050B14]/40 border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-2xl group flex items-center justify-center">
                    
                    {/* Inner abstract glow */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full ${glowClass} blur-[80px] group-hover:scale-110 transition-transform duration-1000 ease-out pointer-events-none`} />
                    
                    {/* The 3D Object / Icon inside */}
                    <motion.div 
                      animate={{ y: [0, -15, 0], rotateX: [0, 10, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10 w-48 h-48 rounded-[2.5rem] bg-gradient-to-tr from-white/5 to-white/10 border border-white/20 backdrop-blur-xl shadow-2xl flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 rounded-[2.5rem]" />
                      <Icon className={`w-20 h-20 ${iconColor} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`} strokeWidth={1.5} />
                    </motion.div>

                    {/* Glass reflections */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </div>
                  
                  {/* Backdrop decorative block */}
                  <div className={`absolute -z-10 w-[60%] h-[60%] rounded-full ${glowClass} blur-3xl ${isLeftText ? '-bottom-10 -right-10' : '-bottom-10 -left-10'} animate-pulse`} style={{ animationDuration: '4s' }} />
                </motion.div>

              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
