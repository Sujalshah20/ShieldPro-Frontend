import React from "react";
import { motion } from "framer-motion";
import { 
    Shield, ShieldCheck, FileText, 
    ArrowRight, Bell, Search, Plus,
    Home, Car, Heart, Plane,
    Clock, CheckCircle2, MoreHorizontal,
    MessageCircle, Activity, Layout
} from "lucide-react";
import Reveal from "../../components/common/Reveal";

const CustomerDashboard = () => {
    const policies = [
        { id: "SH-88291", title: "Home Insurance", status: "ACTIVE", type: "Home", date: "Dec 2024", icon: Home },
        { id: "SA-22184", title: "Auto Premium", status: "ACTIVE", type: "Auto", date: "June 2025", icon: Car },
    ];

    const claimProgress = [
        { label: "Received", completed: true, active: false, step: 1 },
        { label: "Under Review", completed: false, active: true, step: 2 },
        { label: "Evaluation", completed: false, active: false, step: 3 },
        { label: "Settlement", completed: false, active: false, step: 4 },
    ];

    return (
        <div className="min-h-screen bg-[#dae5e5] p-8 md:p-14 font-display">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#012b3f] mb-4 tracking-tight">Hello, Alex. We've got you covered.</h1>
                    <p className="text-[#012b3f]/60 font-medium text-lg">Your 2 active policies are protecting you today. We're also processing your pending claim as quickly as possible.</p>
                </div>
                <button className="bg-[#0082a1] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[2px] flex items-center gap-4 hover:bg-[#012b3f] transition-all shadow-xl shadow-[#0082a1]/20 group">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#012b3f]">
                         <Plus size={16} strokeWidth={4} />
                    </div>
                    Submit New Claim
                </button>
            </div>

            {/* My Active Policies Section */}
            <div className="mb-20">
                <div className="flex items-center gap-3 mb-10 text-[#012b3f]">
                    <FileText size={24} className="opacity-40" />
                    <h2 className="text-xl font-extrabold uppercase tracking-tight">My Active Policies</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {policies.map((p, i) => (
                        <Reveal key={i} delay={i * 0.1} direction="up">
                            <div className="bg-[#dae5e5] p-10 rounded-[2rem] border border-[#0082a1]/20 shadow-inner group hover:shadow-2xl hover:bg-white transition-all">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#012b3f] shadow-sm">
                                        <p.icon size={28} />
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        {p.status}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-[#012b3f] italic-none">{p.title}</h3>
                                    <p className="text-[11px] font-black text-[#012b3f]/40 uppercase tracking-widest italic-none">Policy #{p.id}</p>
                                </div>
                                <div className="mt-12 pt-8 border-t border-white/40 flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Expires {p.date}</span>
                                    <button className="text-[#0082a1] flex items-center gap-2 hover:gap-4 transition-all">
                                        View Details <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                    
                    <Reveal delay={0.3} direction="up">
                        <div className="bg-transparent border-4 border-dashed border-[#012b3f]/10 p-10 rounded-[2rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#0082a1]/40 transition-all">
                             <div className="w-14 h-14 bg-[#012b3f]/5 rounded-full flex items-center justify-center text-[#012b3f]/40 mb-6 group-hover:bg-[#0082a1]/10 group-hover:text-[#0082a1]">
                                 <Plus size={32} />
                             </div>
                             <p className="text-sm font-bold text-[#012b3f]/40 uppercase tracking-widest">Add New Coverage</p>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Current Claim Progress Section */}
            <div className="mb-20">
                <div className="flex items-center gap-3 mb-10 text-[#012b3f]">
                    <Clock size={24} className="opacity-40" />
                    <h2 className="text-xl font-extrabold uppercase tracking-tight">Current Claim Progress</h2>
                </div>
                <Reveal direction="up" delay={0.4}>
                    <div className="bg-white rounded-[2rem] p-12 border border-white shadow-sm overflow-hidden flex flex-col md:flex-row gap-16 relative">
                         <div className="md:w-1/3 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#0082a1]/10 rounded-2xl flex items-center justify-center text-[#0082a1]">
                                    <Car size={24} />
                                </div>
                                <div>
                                    <p className="font-extrabold text-[#012b3f] text-lg">Claim #CL-95021</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Filed on Oct 12, 2023</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-tight italic-none">
                                We've received your estimates for the front bumper collision. Our specialists are currently finalizing the review to get you back on the road.
                            </p>
                            <div className="pt-4 flex items-center justify-between text-[11px] font-black uppercase tracking-widest border-t border-slate-50">
                                <span className="text-slate-300">Estimated resolution: Oct 28, 2023</span>
                                <button className="text-[#0082a1] flex items-center gap-2 group">
                                    Message Agent <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                         </div>

                         {/* Stepper Logic */}
                         <div className="flex-1 flex flex-col justify-center">
                            <div className="relative flex justify-between">
                                {/* Connector Line */}
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 -z-0" />
                                <div className="absolute top-1/2 left-0 w-1/3 h-1 bg-[#0082a1] -translate-y-1/2 -z-0" />

                                {claimProgress.map((step, i) => (
                                    <div key={i} className="relative z-10 flex flex-col items-center gap-4 bg-white px-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-lg transition-all ${
                                            step.completed ? 'bg-[#0082a1] text-white' : 
                                            step.active ? 'bg-[#0082a1] text-white ring-8 ring-[#0082a1]/10 animate-pulse' : 
                                            'bg-white border-2 border-slate-100 text-slate-300'
                                        }`}>
                                            {step.completed ? <CheckCircle2 size={18} /> : step.step}
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-[10px] font-black uppercase tracking-widest font-display ${step.active ? 'text-[#012b3f]' : 'text-slate-300'}`}>{step.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                </Reveal>
            </div>

            {/* Recommended Coverage Section */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-10 text-[#012b3f]">
                    <Activity size={24} className="opacity-40" />
                    <h2 className="text-xl font-extrabold uppercase tracking-tight">Recommended Coverage</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { title: "Travel Protection", desc: "Planning a trip? Get comprehensive coverage for your next adventure.", icon: Plane, label: "Learn More" },
                        { title: "Pet Insurance", desc: "Protect your furry family members with our top-rated pet plans.", icon: Heart, label: "Explore" }
                    ].map((c, i) => (
                        <Reveal key={i} delay={i * 0.1} direction="up">
                            <div className="bg-white p-10 rounded-[2rem] border border-white shadow-sm flex items-center gap-10 group hover:shadow-2xl transition-all">
                                <div className="w-20 h-20 bg-[#dae5e5] rounded-3xl flex items-center justify-center text-[#0082a1] group-hover:bg-[#0082a1] group-hover:text-white transition-all shadow-inner">
                                    <c.icon size={32} />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-extrabold text-[#012b3f] italic-none">{c.title}</h3>
                                        <button className="text-[#0082a1] text-xs font-black uppercase tracking-widest hover:underline">{c.label}</button>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-tight italic-none max-w-sm">{c.desc}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="mt-32 pt-10 border-t border-[#012b3f]/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic-none">
                <div className="flex items-center gap-4">
                    <Shield size={16} className="text-[#012b3f]/20" />
                    <span>Secure Shield © 2023</span>
                </div>
                <div className="flex gap-10 mt-6 md:mt-0">
                    <a href="#" className="hover:text-[#012b3f]">Privacy Policy</a>
                    <a href="#" className="hover:text-[#012b3f]">Terms of Service</a>
                    <a href="#" className="hover:text-[#012b3f]">Help Center</a>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
