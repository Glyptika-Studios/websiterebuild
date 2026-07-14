"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  // Form Selections
  const [servicesList, setServicesList] = useState<any[]>(DUMMY_SERVICES);
  const [productsList, setProductsList] = useState<any[]>(DUMMY_PRODUCTS);

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

  useEffect(() => {
    const loadSelections = async () => {
      try {
        const [servicesRes, productsRes] = await Promise.all([
          fetch("/api/v1/services"),
          fetch("/api/v1/products"),
        ]);

        if (servicesRes.ok) {
          const body = await servicesRes.json();
          if (body.success && Array.isArray(body.data) && body.data.length > 0) {
            setServicesList(body.data.map((s: any) => ({ id: s.id, label: s.title })));
          } else {
            setServicesList(DUMMY_SERVICES);
          }
        } else {
          setServicesList(DUMMY_SERVICES);
        }

        if (productsRes.ok) {
          const body = await productsRes.json();
          if (body.success && Array.isArray(body.data) && body.data.length > 0) {
            setProductsList(body.data.map((p: any) => ({ id: p.id, label: p.title })));
          } else {
            setProductsList(DUMMY_PRODUCTS);
          }
        } else {
          setProductsList(DUMMY_PRODUCTS);
        }
      } catch (err) {
        setServicesList(DUMMY_SERVICES);
        setProductsList(DUMMY_PRODUCTS);
      }
    };
    loadSelections();
  }, []);

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
    setError(null);
    setIsSubmitting(true);

    // Map budget fields
    let budget_type: "fixed" | "range" | "flexible" = "flexible";
    let budget_min = 0;
    let budget_max = 0;
    let budget_label = "Flexible";

    if (formData.budget === "under_10k") {
      budget_type = "range";
      budget_min = 0;
      budget_max = 10000;
      budget_label = "Under $10,000";
    } else if (formData.budget === "10k_50k") {
      budget_type = "range";
      budget_min = 10000;
      budget_max = 50000;
      budget_label = "$10,000 - $50,000";
    } else if (formData.budget === "50k_100k") {
      budget_type = "range";
      budget_min = 50000;
      budget_max = 100000;
      budget_label = "$50,000 - $100,000";
    } else if (formData.budget === "over_100k") {
      budget_type = "fixed";
      budget_min = 100000;
      budget_max = 100000;
      budget_label = "$100,000+";
    }

    const messageBody = `Timeline: ${
      formData.timeline ? formData.timeline.replace(/_/g, " ") : "Not specified"
    }\n\nDescription:\n${formData.description}`;

    // Build API payload
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      company: formData.company || undefined,
      message: messageBody,
      budget_type,
      budget_min,
      budget_max: budget_type === "range" ? budget_max : undefined,
      budget_label,
      source_channel: "website",
      service_ids: selectedServices.filter(id => !id.startsWith("svc-")),
      product_ids: selectedProducts.filter(id => !id.startsWith("prod-")),
      project_ids: [],
    };

    try {
      const response = await fetch("/api/v1/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json();

      if (body.success) {
        setIsSuccess(true);
      } else {
        setError(body.message || "Failed to submit proposal request. Please check inputs.");
      }
    } catch (err: any) {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Context & Info */}
        <div className="w-full lg:w-5/12 flex flex-col justify-start pt-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F7FF] border border-[#DCEBFF] text-[#2563EB] text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Start Your Project
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight mb-5 leading-tight">
              Let&apos;s architect <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-[#8B5CF6] to-[#EC4899] pb-0.5 inline-block">your future.</span>
            </h1>
            
            <p className="text-base text-[#6B7280] leading-relaxed mb-8 max-w-md">
              Whether you need immersive VR environments, high-fidelity 3D assets, or automated workflows, our team is ready to deliver precision-engineered solutions tailored for your enterprise.
            </p>

            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#F3F7FF] border border-[#DCEBFF] flex items-center justify-center shrink-0">
                  <span className="text-[#2563EB] font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="text-[#111827] font-semibold text-sm mb-0.5">Tell us your vision</h4>
                  <p className="text-xs text-[#6B7280]">Provide details about your project, goals, and technical requirements.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#F3F7FF] border border-[#DCEBFF] flex items-center justify-center shrink-0">
                  <span className="text-[#2563EB] font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="text-[#111827] font-semibold text-sm mb-0.5">Receive a custom proposal</h4>
                  <p className="text-xs text-[#6B7280]">Our team will architect a tailored solution including timelines and budget estimates.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#F3F7FF] border border-[#DCEBFF] flex items-center justify-center shrink-0">
                  <span className="text-[#2563EB] font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="text-[#111827] font-semibold text-sm mb-0.5">Kickoff & Execution</h4>
                  <p className="text-xs text-[#6B7280]">We begin engineering your digital reality with full transparency and milestone updates.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-7/12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden"
          >
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-[#E6F4EA] border border-[#CEEAD6] rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#0D652D]" />
                </div>
                <h2 className="text-2xl font-bold text-[#111827] mb-3">Proposal Requested!</h2>
                <p className="text-[#6B7280] mb-8 max-w-sm text-sm">
                  Thank you for reaching out. Our team will review your requirements and get back to you within 24-48 business hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-3 bg-white hover:bg-[#F3F7FF] text-[#2563EB] font-bold rounded-xl border border-[#2563EB] transition-all duration-200 text-sm hover:-translate-y-0.5"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Form error banner */}
                {error && (
                  <div className="w-full flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-[#111827] border-b border-[#E5E7EB] pb-2">1. Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6B7280]">First Name *</label>
                      <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-[#BDC1C6]" placeholder="John" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6B7280]">Last Name *</label>
                      <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-[#BDC1C6]" placeholder="Doe" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6B7280]">Email Address *</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-[#BDC1C6]" placeholder="john@company.com" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6B7280]">Company Name</label>
                      <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-[#BDC1C6]" placeholder="Acme Corp" />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-[#111827] border-b border-[#E5E7EB] pb-2">2. Project Requirements</h3>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6B7280]">Project Description *</label>
                    <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all resize-none placeholder:text-[#BDC1C6]" placeholder="Tell us about the scope, objectives, and specific deliverables you need..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6B7280]">Estimated Budget</label>
                      <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all">
                        <option value="">Select a range</option>
                        <option value="under_10k">Under $10,000</option>
                        <option value="10k_50k">$10,000 - $50,000</option>
                        <option value="50k_100k">$50,000 - $100,000</option>
                        <option value="over_100k">$100,000+</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6B7280]">Desired Timeline</label>
                      <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all">
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
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-[#111827] border-b border-[#E5E7EB] pb-2">3. Areas of Interest</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-[#6B7280] mb-2 block">Services (Select multiple)</label>
                      <div className="flex flex-wrap gap-2">
                        {servicesList.map(svc => {
                          const isSelected = selectedServices.includes(svc.id);
                          return (
                            <button
                              key={svc.id}
                              type="button"
                              onClick={() => toggleSelection(svc.id, "services")}
                              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm' 
                                  : 'bg-[#F3F7FF] border-[#DCEBFF] text-[#2563EB] hover:bg-[#E8F0FE]'
                              }`}
                            >
                              {svc.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#6B7280] mb-2 block">Products (Select multiple)</label>
                      <div className="flex flex-wrap gap-2">
                        {productsList.map(prod => {
                          const isSelected = selectedProducts.includes(prod.id);
                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => toggleSelection(prod.id, "products")}
                              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-[#A142F4] border-[#A142F4] text-white shadow-sm' 
                                  : 'bg-[#FAF5FF] border-[#F3E8FD] text-[#A142F4] hover:bg-[#F3E8FD]'
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
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1765CC] text-white rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group text-sm shadow-sm hover:shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Proposal Request
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-[#6B7280] mt-3">
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
