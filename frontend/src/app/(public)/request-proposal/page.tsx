"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

// Dummy data for selections
const DUMMY_SERVICES = [
  { id: "svc-1", label: "Custom 3D Asset Creation" },
  { id: "svc-2", label: "VR Environment Creation" },
  { id: "svc-3", label: "Digital Automation" },
  { id: "svc-4", label: "Inventory Management Solutions" },
];

const DUMMY_PRODUCTS = [
  { id: "prod-1", label: "XPLOR MVP" },
  { id: "prod-2", label: "HRV Simulator" },
  { id: "prod-3", label: "Custom WebGL Engine" },
];

export default function RequestProposal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    budget: "",
    timeline: "",
    description: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleSelection = (id: string, type: "services" | "products") => {
    if (type === "services") {
      setSelectedServices(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedProducts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      service_ids: selectedServices,
      product_ids: selectedProducts,
      project_ids: [], // Assuming none selected for now
    };

    console.log("Submitting Proposal Payload:", payload);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#000000] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24 flex flex-col lg:flex-row gap-16">
        
        {/* Left Side: Context & Info */}
        <div className="w-full lg:w-5/12 flex flex-col justify-start pt-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Start Your Project
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Let&apos;s architect <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">your future.</span>
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-md">
              Whether you need immersive VR environments, high-fidelity 3D assets, or automated workflows, our team is ready to deliver precision-engineered solutions tailored for your enterprise.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#0a1128] border border-blue-500/30 flex items-center justify-center shrink-0">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Tell us your vision</h4>
                  <p className="text-sm text-slate-500">Provide details about your project, goals, and technical requirements.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#0a1128] border border-blue-500/30 flex items-center justify-center shrink-0">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Receive a custom proposal</h4>
                  <p className="text-sm text-slate-500">Our team will architect a tailored solution including timelines and budget estimates.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#0a1128] border border-blue-500/30 flex items-center justify-center shrink-0">
                  <span className="text-blue-400 font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Kickoff & Execution</h4>
                  <p className="text-sm text-slate-500">We begin engineering your digital reality with full transparency and milestone updates.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-7/12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#050B14]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Proposal Requested!</h2>
                <p className="text-slate-400 mb-8 max-w-md">
                  Thank you for reaching out. Our team will review your requirements and get back to you within 24-48 business hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3 bg-[#0a1128] hover:bg-[#0f172a] text-blue-400 font-semibold rounded-lg border border-blue-500/30 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Personal Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">1. Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">First Name *</label>
                      <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Last Name *</label>
                      <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Email Address *</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="john@company.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Company Name</label>
                      <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="Acme Corp" />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">2. Project Requirements</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Project Description *</label>
                    <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none" placeholder="Tell us about the scope, objectives, and specific deliverables you need..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Estimated Budget</label>
                      <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none">
                        <option value="">Select a range</option>
                        <option value="under_10k">Under $10,000</option>
                        <option value="10k_50k">$10,000 - $50,000</option>
                        <option value="50k_100k">$50,000 - $100,000</option>
                        <option value="over_100k">$100,000+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Desired Timeline</label>
                      <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none">
                        <option value="">Select timeline</option>
                        <option value="asap">ASAP (within 1 month)</option>
                        <option value="1_3_months">1-3 Months</option>
                        <option value="3_6_months">3-6 Months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Services & Products Interested In */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">3. Areas of Interest</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400 mb-3 block">Services (Select multiple)</label>
                      <div className="flex flex-wrap gap-2">
                        {DUMMY_SERVICES.map(svc => {
                          const isSelected = selectedServices.includes(svc.id);
                          return (
                            <button
                              key={svc.id}
                              type="button"
                              onClick={() => toggleSelection(svc.id, "services")}
                              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                isSelected 
                                  ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                                  : 'bg-[#0a1128] border-white/10 text-slate-400 hover:border-blue-500/30 hover:text-blue-300'
                              }`}
                            >
                              {svc.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-400 mb-3 block">Products (Select multiple)</label>
                      <div className="flex flex-wrap gap-2">
                        {DUMMY_PRODUCTS.map(prod => {
                          const isSelected = selectedProducts.includes(prod.id);
                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => toggleSelection(prod.id, "products")}
                              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                isSelected 
                                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                                  : 'bg-[#0a1128] border-white/10 text-slate-400 hover:border-indigo-500/30 hover:text-indigo-300'
                              }`}
                            >
                              {prod.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Proposal Request
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4">
                    Your data is secure. We will never share your information with third parties.
                  </p>
                </div>

              </form>
            )}
          </motion.div>
        </div>

      </div>
    </main>
  );
}

