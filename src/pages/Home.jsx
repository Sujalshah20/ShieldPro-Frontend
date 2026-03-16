import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Check, Menu, X, ArrowRight, Activity, 
    Heart, Car, Home as HomeIcon, Plane, Briefcase, 
    Lock, Zap, Clock, Star, MapPin, Phone, Mail, 
    Facebook, Twitter, Instagram, Linkedin, 
    Search, UserPlus, MousePointer2, FileCheck, HelpCircle, ChevronRight, Globe, TrendingUp,
    Fingerprint, Cpu, Satellite, Target, Database, Layers, Radio, Workflow, Quote
} from "lucide-react";
import Reveal from "../components/common/Reveal";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
            scrolled ? 'h-20 bg-white shadow-2xl border-b border-slate-50' : 'h-28 bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-8 lg:px-12">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] shadow-[0_10px_30px_-5px_#003249] group-hover:rotate-12 transition-transform duration-500 border border-white/10 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <Shield size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Secure <span className="text-[#007ea7]">Shield_</span></span>
                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-[4px] mt-1 italic">Tactical_Assurance</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-12">
                    {["Mainframe", "The Grid", "Protocols", "Uplink"].map((item) => (
                        <a key={item} href="#" className={`text-[11px] font-black uppercase tracking-[4px] transition-all italic relative group ${scrolled ? 'text-[#003249]' : 'text-white'}`}>
                            {item}
                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#10b981] group-hover:w-full transition-all duration-500" />
                        </a>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden lg:flex items-center gap-6">
                    <Link to="/login" className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[4px] italic transition-all ${scrolled ? 'text-[#003249] hover:text-[#007ea7]' : 'text-white/60 hover:text-white'}`}>
                        <Fingerprint size={18} strokeWidth={3} /> Vetting_Login
                    </Link>
                    <Link to="/register" className="h-14 px-8 bg-[#10b981] text-white font-black rounded-2xl flex items-center gap-4 hover:bg-[#0da371] hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] text-[10px] uppercase tracking-[4px] italic group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        Enlist_Now <ArrowRight size={16} strokeWidth={4} />
                    </Link>
                </div>

                {/* Mobile Menu Trigger */}
                <button className={`${scrolled ? 'text-[#003249]' : 'text-white'} lg:hidden p-2`} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={32} strokeWidth={3} /> : <Menu size={32} strokeWidth={3} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[2000] bg-[#003249] p-12 flex flex-col justify-center items-center text-center gap-12 lg:hidden"
                    >
                        <button className="absolute top-8 right-8 text-white/40 hover:text-white" onClick={() => setIsOpen(false)}><X size={40} strokeWidth={3} /></button>
                        
                        {["Mainframe", "The Grid", "Protocols", "Uplink"].map((item) => (
                            <a key={item} href="#" className="text-4xl font-black text-white uppercase tracking-tighter italic hover:text-[#007ea7] transition-colors">{item}</a>
                        ))}
                        
                        <div className="flex flex-col gap-6 w-full pt-12 border-t border-white/5 mt-12">
                            <Link to="/login" className="h-20 border-2 border-white/10 text-white font-black rounded-3xl flex items-center justify-center gap-5 text-lg uppercase tracking-[6px] italic hover:bg-white/5">Vetting_Login</Link>
                            <Link to="/register" className="h-20 bg-[#10b981] text-white font-black rounded-3xl flex items-center justify-center gap-5 text-lg uppercase tracking-[6px] italic shadow-2xl">Enlist_Now</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const HeroSection = () => (
    <section className="relative min-h-screen flex items-center bg-[#003249] overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#007ea7 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[#007ea7]/10 to-transparent pointer-events-none" />
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#007ea7]/5 blur-[200px] rounded-full pointer-events-none animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-12 w-full grid lg:grid-cols-2 gap-24 items-center relative z-10 py-32">
            <Reveal direction="left">
                <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                        <span className="text-[11px] font-black uppercase tracking-[8px] text-[#007ea7] italic leading-none">Global_Grid_Management_v4.2</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter italic leading-[0.85]">
                            Elite <br />
                            <span className="text-[#10b981]">Defense_</span>
                        </h1>
                        <p className="max-w-md text-white/40 text-[13px] font-black uppercase tracking-[5px] leading-relaxed italic border-l-4 border-white/5 pl-8 mt-10">
                            Securing digital and physical legacies across 44 sectors. Real-time assurance synchronization.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-8 pt-10">
                        <Link to="/register" className="h-18 px-12 bg-[#10b981] text-white font-black rounded-[2rem] flex items-center gap-6 hover:bg-[#0da371] hover:scale-105 transition-all shadow-[0_30px_60px_-15px_rgba(16,185,129,0.4)] text-[12px] uppercase tracking-[6px] italic group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            Initialize_Defense <ArrowRight size={22} strokeWidth={4} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <button className="h-18 px-12 border-2 border-white/10 text-white font-black rounded-[2rem] hover:bg-white/5 hover:border-white/20 transition-all text-[12px] uppercase tracking-[6px] italic flex items-center gap-6 group">
                            <Cpu size={22} strokeWidth={3} className="text-[#007ea7] group-hover:rotate-12 transition-transform" /> Sync_Registry
                        </button>
                    </div>

                    <div className="flex items-center gap-12 pt-12 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-white tracking-tighter italic leading-none mb-1 uppercase">12.4k_</span>
                            <span className="text-[8px] font-black tracking-[4px] text-white/20 uppercase italic">Nodes_Encrypted</span>
                        </div>
                        <div className="w-px h-10 bg-white/5" />
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-[#10b981] tracking-tighter italic leading-none mb-1 uppercase">99.9%_</span>
                            <span className="text-[8px] font-black tracking-[4px] text-white/20 uppercase italic">Uptime_Stability</span>
                        </div>
                    </div>
                </div>
            </Reveal>

            <Reveal direction="right">
                <div className="relative group">
                    <div className="absolute -inset-10 bg-[#007ea7]/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="bg-white/5 backdrop-blur-2xl rounded-[4rem] p-16 border border-white/10 shadow-4xl relative overflow-hidden flex items-center justify-center min-h-[500px]">
                         {/* Tactical Elements inside the visual */}
                        <div className="absolute top-0 right-0 p-12 text-white/20">
                            <Satellite size={60} strokeWidth={1} />
                        </div>
                        <div className="absolute bottom-12 left-12 flex flex-col items-start gap-4 uppercase tracking-[5px] text-[8px] font-black text-white/30 italic leading-none">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                                CONNECTION: STABLE
                            </div>
                            <div className="flex items-center gap-3 opacity-50">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                NODE_ID: Sigma-24
                            </div>
                        </div>

                         <div className="relative z-10 scale-150 text-[#007ea7]/30 group-hover:text-[#007ea7] group-hover:scale-[1.65] transition-all duration-1000">
                            <Shield size={160} strokeWidth={1.5} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity size={50} className="text-[#10b981] animate-pulse" strokeWidth={3} />
                            </div>
                        </div>
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/5 rounded-full animate-ping opacity-10 pointer-events-none" />
                    </div>
                </div>
            </Reveal>
        </div>
        
        {/* Bottom Metadata Bar */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#003249] to-transparent border-t border-white/5 flex items-center justify-center gap-16 overflow-hidden">
             {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-6 opacity-30 whitespace-nowrap animate-pulse" style={{ animationDelay: `${i * 0.5}s` }}>
                    <Zap size={14} className="text-[#007ea7]" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-[6px] text-white italic">SYST_LOG:// SECURE_OVERRIDE_ENABLED_STATUS:NOMINAL</span>
                </div>
             ))}
        </div>
    </section>
);

const StatsSection = () => (
    <section className="py-24 relative bg-white overflow-hidden border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
                {[
                    { val: "50+", label: "ACTIVE_POLICIES", icon: Shield, color: "text-[#007ea7]" },
                    { val: "10k+", label: "VETTED_NODES", icon: UserPlus, color: "text-[#10b981]" },
                    { val: "99%", label: "SYNC_STABILITY", icon: Check, color: "text-[#003249]" },
                    { val: "1M+", label: "DATA_POINTS", icon: Database, color: "text-[#007ea7]" }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="flex flex-col items-center xl:items-start space-y-4 group">
                            <div className={`${s.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500 group-hover:rotate-12`}>
                                <s.icon size={28} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1 text-center xl:text-left">
                                <h3 className="text-4xl lg:text-5xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">{s.val}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full group-hover:animate-ping" />
                                    <p className="text-slate-300 text-[9px] font-black tracking-[4px] uppercase italic">{s.label}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const PolicySection = () => (
    <section className="py-32 bg-white relative overflow-hidden">
        {/* Subtle Side Grid */}
        <div className="absolute top-0 right-0 w-1/4 h-full opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-7xl mx-auto px-12">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-24">
                <Reveal direction="left">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Defense_Manifest_v3.0</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Security <br /><span className="text-[#007ea7]">Protocols_</span></h2>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <p className="max-w-md text-slate-400 font-extrabold uppercase tracking-widest text-xs italic leading-relaxed border-l-4 border-slate-50 pl-10 mb-2">
                        Comprehensive assurance modules encrypted with quantum-grade parameters. Tailored for operative lifestyles and corporate nodes.
                    </p>
                </Reveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                    { title: "Bio_Assurance", icon: Activity, color: "text-emerald-500 bg-emerald-50 border-emerald-100", tag: "CELL_SHIELD", desc: "Comprehensive health coverage for you and your family node. Immediate synchronization." },
                    { title: "Legacy_Vault", icon: Heart, color: "text-rose-500 bg-rose-50 border-rose-100", tag: "VITAL_SYNC", desc: "Secure your legacy node's financial trajectory. Persistent assurance across generations." },
                    { title: "Transit_Defense", icon: Car, color: "text-[#007ea7] bg-slate-50 border-slate-100", tag: "VECTOR_PROT", desc: "Kinetic protection for your car and transport assets. Collision protocol vetting included." },
                    { title: "Sanctum_Grid", icon: HomeIcon, color: "text-[#003249] bg-slate-50 border-slate-100", tag: "GRID_STATIC", desc: "Shield your primary residence node from thermal, kinetic, and unexpected anomalies." },
                    { title: "Expedition_Prot", icon: Plane, color: "text-amber-500 bg-amber-50 border-amber-100", tag: "ORBIT_SYNC", desc: "Global sector transit protection. Infinite uptime during international node migrations." },
                    { title: "Yield_Defense", icon: Briefcase, color: "text-[#10b981] bg-emerald-50/20 border-emerald-100/50", tag: "ASSET_VOL", desc: "Customized module for enterprise operations. operational risk migration protocols." }
                ].map((p, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="saas-card group relative p-12 border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[440px] flex flex-col justify-between overflow-hidden shadow-3xl bg-white">
                             {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <p.icon size={150} className="text-[#003249]" />
                            </div>

                            <div className="relative z-10 flex justify-between items-start">
                                <div className={`w-18 h-18 ${p.color} border-2 rounded-[1.8rem] flex items-center justify-center scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-inner`}>
                                    <p.icon size={36} strokeWidth={2.5} />
                                </div>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[5px] italic border-l-2 border-slate-50 pl-5">{p.tag}</span>
                            </div>

                            <div className="relative z-10 space-y-6 pt-12">
                                <h3 className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic leading-none group-hover:text-[#007ea7] transition-colors">{p.title}</h3>
                                <p className="text-slate-400 font-extrabold uppercase tracking-widest text-[11px] leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity">
                                    {p.desc}
                                </p>
                                <div className="pt-8 border-t border-slate-50">
                                    <button className="flex items-center gap-5 text-[#003249] font-black uppercase tracking-[5px] text-[10px] italic hover:text-[#007ea7] transition-all group/btn">
                                        ANALYZE_MODULE <ChevronRight size={18} strokeWidth={4} className="group-hover/btn:translate-x-3 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section className="py-32 bg-[#003249] relative overflow-hidden">
        {/* Tactical Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-12 relative z-10 text-white">
            <div className="flex flex-col items-center mb-28 text-center space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-[#10b981] rounded-full" />
                    <span className="text-[11px] font-black uppercase tracking-[8px] text-[#10b981] italic leading-none">Initialization_Sequence</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">Deployment <br /><span className="text-[#007ea7]">Protocol_</span></h2>
                <div className="w-32 h-1 bg-white/5 relative overflow-hidden">
                    <motion.div 
                        animate={{ x: ['-100%', '100%'] }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 bg-[#007ea7]" 
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                    { icon: Fingerprint, title: "Auth_Vetting", desc: "Initialize account node with secure identification." },
                    { icon: Search, title: "Grid_Scan", desc: "Analyze and filter available defense modules." },
                    { icon: Zap, title: "Sync_Commence", desc: "Purchase and synchronize assets instantly." },
                    { icon: Radio, title: "Uplink_Active", desc: "Hassle-free 24/7 assistance on secure channels." }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="group relative">
                             <div className="relative z-10 flex flex-col items-center text-center space-y-10 group-hover:-translate-y-4 transition-transform duration-500">
                                <div className="w-28 h-28 bg-white/5 rounded-[2.5rem] border-2 border-white/5 flex items-center justify-center shadow-inner relative group-hover:border-[#007ea7]/40 group-hover:bg-white/10 transition-all duration-500">
                                    <s.icon size={44} className="text-white/20 group-hover:text-[#10b981] transition-colors duration-500" strokeWidth={1.5} />
                                    {/* Small Index Number */}
                                    <span className="absolute -top-3 -right-3 w-8 h-8 bg-[#007ea7] rounded-lg text-[10px] font-black flex items-center justify-center italic">0{i+1}</span>
                                </div>
                                <div className="space-y-4">
                                     <h4 className="text-2xl font-black uppercase tracking-tighter italic group-hover:text-[#007ea7] transition-colors">{s.title}</h4>
                                     <p className="text-white/30 text-[10px] font-black uppercase tracking-[5px] leading-relaxed italic">{s.desc}</p>
                                </div>
                             </div>
                             {/* Connector arrows for non-last items */}
                             {i < 3 && (
                                <div className="hidden lg:block absolute top-14 left-[calc(100%-10px)] w-20 h-[2px] bg-gradient-to-r from-[#007ea7]/40 to-transparent pointer-events-none" />
                             )}
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const WhyChooseUs = () => (
    <section className="py-32 bg-[#f8fafc] border-y border-slate-100 relative overflow-hidden">
         {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #003249 25%, transparent 25%, transparent 50%, #003249 50%, #003249 75%, transparent 75%, transparent)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-12 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-28 space-y-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-2 bg-[#007ea7] rounded-full" />
                    <span className="text-[11px] font-black uppercase tracking-[8px] text-[#007ea7] italic leading-none">System_Reliability_Score:99%</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Superior <br /><span className="text-[#007ea7]">Calibration_</span></h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {[
                    { icon: Lock, title: "Encrypted_Core", desc: "AES-512 military-grade security encryption levels." },
                    { icon: Zap, title: "Instant_Uplink", desc: "Immediate document delivery via encrypted email synchronization." },
                    { icon: Clock, title: "Infinite_Access", desc: "Manage protocols and fetch registries 24/7 across all sectors." },
                    { icon: Target, title: "Precision_Pricing", desc: "Algorithmic premium optimization for maximum operative utility." },
                    { icon: Workflow, title: "Expert_Vetting", desc: "Dedicated advisors specialized in unconventional coverage." },
                    { icon: Activity, title: "Fast_Resonance", desc: "Digital-first claim resonance for lightning-fast node recovery." }
                ].map((f, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-12 rounded-[3.5rem] border-2 border-transparent hover:border-[#007ea7]/20 flex flex-col gap-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] transition-all duration-700 h-full group">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#007ea7] shrink-0 border border-slate-100 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-sm">
                                <f.icon size={32} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-2xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">{f.title}</h4>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[4px] leading-relaxed italic">{f.desc}</p>
                            </div>
                             {/* Bottom Metadata */}
                             <div className="pt-8 border-t border-slate-50 flex justify-between items-center opacity-30 mt-auto">
                                <span className="text-[10px] font-serif font-bold">NODE_REF: {1000 + i * 12}</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                </div>
                             </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const Testimonials = () => (
    <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-12">
            <div className="flex flex-col xl:flex-row items-center justify-between mb-28 text-center xl:text-left">
                <div className="space-y-8 max-w-2xl">
                    <div className="flex items-center gap-4 justify-center xl:justify-start">
                        <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                        <span className="text-[11px] font-black uppercase tracking-[8px] text-[#007ea7] italic leading-none">External_Vetting_Logs</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Operative <br /><span className="text-[#007ea7]">Debriefing_</span></h2>
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[
                    { name: "Sahil Sharma", role: "CORPORATE_NODE", text: "Secure Shield made clinical synchronization so efficient. The resonance process during my medical event was completely seamless and zero-latency." },
                    { name: "Priya Patel", role: "SOFTWARE_ARCHITECT", text: "Tactical transit premiums here are the most precise I've seen. Instant module delivery to my secure inbox was primary objective achieved." },
                    { name: "Anil Mehta", role: "RETIRED_OPERATIVE", text: "Trusted service and peak advisor support. They calibrated every step of choosing the right legacy vault for my family node." }
                ].map((t, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-slate-50 p-14 rounded-[4rem] text-left space-y-10 relative flex flex-col h-full border-2 border-transparent hover:border-[#007ea7]/10 hover:bg-white hover:shadow-4xl transition-all duration-700 group">
                            <div className="flex text-amber-500 gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" strokeWidth={0} />)}
                            </div>
                            <p className="text-[#003249] font-black uppercase tracking-[3px] text-[12px] italic leading-relaxed flex-1 opacity-60 group-hover:opacity-100 italic">
                                "{t.text}"
                            </p>
                            <div className="flex items-center gap-6 pt-10 mt-auto border-t border-slate-200/50">
                                <div className="w-14 h-14 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] font-black italic shadow-lg">
                                    {t.name.split(' ')[0].charAt(0)}{t.name.split(' ')[1].charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-black text-[#003249] uppercase tracking-tighter italic leading-none mb-1">{t.name}</h4>
                                    <p className="text-[8px] text-slate-400 font-black tracking-[4px] uppercase italic">{t.role}</p>
                                </div>
                                <Quote size={20} className="absolute top-12 right-12 text-[#007ea7]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const CTABanner = () => (
    <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-12">
            <div className="bg-[#003249] rounded-[4rem] p-20 md:p-32 text-center space-y-16 relative overflow-hidden shadow-4xl border-4 border-slate-50">
                {/* Tactical Visuals */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-0 p-24 opacity-10 text-white animate-pulse">
                    <Shield size={400} strokeWidth={0.5} />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-[#007ea7]/20 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-10">
                    <div className="flex justify-center flex-wrap gap-8 opacity-40 mb-4">
                        <div className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-[6px] italic leading-none">
                            <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> AUTH_SECURE
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-[6px] italic leading-none">
                            <Globe size={20} strokeWidth={3} className="text-[#007ea7]" /> GLOBAL_SYNC
                        </div>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">Initialize <br /><span className="text-[#10b981]">Defense_Now_</span></h2>
                    <p className="text-[#80ced7] text-[13px] font-black uppercase tracking-[6px] max-w-2xl mx-auto italic opacity-60">Join the elite network of 10k+ protected operatives. Synchronize your assets today.</p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-8 pt-10">
                    <Link to="/register" className="h-20 px-16 bg-[#10b981] text-white font-black rounded-3xl text-[14px] uppercase tracking-[8px] shadow-[0_20px_50px_-5px_#10b981] hover:bg-[#0da371] hover:scale-105 active:scale-95 transition-all italic group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        COMMENCE_VETTING <ArrowRight size={24} strokeWidth={4} className="ml-4 inline group-hover:translate-x-3 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="pt-32 pb-16 bg-[#003249] text-white relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-x-0 bottom-0 h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-12 relative z-10">
            <div className="grid lg:grid-cols-4 gap-20 mb-32">
                <div className="space-y-12">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#007ea7] border border-white/10 overflow-hidden relative shadow-2xl">
                            <Shield size={24} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Secure <span className="text-[#007ea7]">Shield_</span></span>
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-[4px] mt-1 italic">Tactical_Assurance</span>
                        </div>
                    </Link>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[5px] leading-[1.8] italic">
                        The definitive insurance nexus for the modern operative. Orchestrating node-level security across all sectors in India since 20XX.
                    </p>
                    <div className="flex gap-6">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#10b981] transition-all border border-white/5 hover:border-[#10b981]/40 hover:scale-110 active:scale-90">
                                <Icon size={20} strokeWidth={2} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[12px] font-black uppercase tracking-[8px] text-[#007ea7] italic mb-12">Mainframe_Map</h4>
                    <ul className="space-y-6">
                        {["Mission_Statement", "The_Grid", "Security_Protocols", "Deployment_Flow", "Uplink_Support"].map(l => (
                            <li key={l}><a href="#" className="text-white/40 hover:text-[#10b981] text-[9px] font-black uppercase tracking-[4px] italic transition-all">{l}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-[12px] font-black uppercase tracking-[8px] text-[#007ea7] italic mb-12">Assurance_Modules</h4>
                    <ul className="space-y-6">
                        {["Bio_Assurance", "Legacy_Vault", "Transit_Defense", "Sanctum_Grid", "Expedition_Prot"].map(l => (
                            <li key={l}><a href="#" className="text-white/40 hover:text-[#10b981] text-[9px] font-black uppercase tracking-[4px] italic transition-all">{l}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-[12px] font-black uppercase tracking-[8px] text-[#007ea7] italic mb-12">Secure_Uplink</h4>
                    <ul className="space-y-8">
                        <li className="flex gap-6 text-white/40 group">
                            <MapPin size={24} className="text-[#10b981] shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] font-black uppercase tracking-[4px] italic leading-relaxed transition-all group-hover:text-white/60">123_FINANCE_TOWER, BKC_MUMBAI, MH_400051</span>
                        </li>
                        <li className="flex gap-6 text-white/40 group">
                            <Phone size={24} className="text-[#10b981] shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] font-black uppercase tracking-[4px] italic transition-all group-hover:text-white/60">1800_SECURE_SHIELD</span>
                        </li>
                        <li className="flex gap-6 text-white/40 group">
                            <Mail size={24} className="text-[#10b981] shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] font-black uppercase tracking-[4px] italic transition-all group-hover:text-white/60">UPLINK@SECURESHIELD.IN</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                <p className="text-white/10 text-[8px] font-black uppercase tracking-[6px] italic">© 2026_SECURE_SHIELD_INSURANCE_BROKING_LTD_SYSTEM_ACTIVE</p>
                <div className="flex gap-12 text-white/20 text-[8px] font-black uppercase tracking-[6px] italic">
                    <a href="#" className="hover:text-[#10b981] transition-colors">PRIVACY_PROTOCOL</a>
                    <a href="#" className="hover:text-[#10b981] transition-colors">CORE_TERMS</a>
                    <a href="#" className="hover:text-[#10b981] transition-colors">COOKIE_LOGS</a>
                </div>
            </div>
        </div>
    </footer>
);

const Home = () => {
    return (
        <div className="relative min-h-screen bg-white font-sans overflow-x-hidden selection:bg-[#10b981] selection:text-white">
            <Navbar />
            <HeroSection />
            <StatsSection />
            <PolicySection />
            <HowItWorks />
            <WhyChooseUs />
            <Testimonials />
            <CTABanner />
            <Footer />
        </div>
    );
};

export default Home;
