import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, CheckCircle2, Clock, 
    ShieldCheck, ArrowRight, Activity, 
    Lock, Zap, Globe, Headphones,
    LayoutDashboard, ShieldPlus, Target,
    Cpu, Menu, X, Heart, Car, Plane, Briefcase,
    Search, UserPlus, MousePointer2, FileCheck,
    Star, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin,
    SearchCheck,
    Check,
    ChevronRight,
    Fingerprint,
    Layers,
    Satellite,
    Terminal,
    Database,
    Command,
    Layout,
    Eye,
    MessageSquare,
    Wallet,
    Compass,
    CpuIcon,
    ArrowUpRight,
    RefreshCcw
} from "lucide-react";
import Reveal from "../components/common/Reveal";

/* --- Enhanced Sub-sections --- */

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-700 ${
            scrolled ? 'h-20 bg-white/70 backdrop-blur-3xl border-b-4 border-white shadow-4xl' : 'h-28 bg-transparent'
        } flex items-center`}>
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center px-8 md:px-16">
                <Link to="/" className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-[#003249] rounded-[1.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl group-hover:rotate-[360deg] transition-all duration-[2000ms] border-2 border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                        <Shield size={32} strokeWidth={3} className="relative z-10" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black tracking-tighter text-[#003249] italic leading-none">Shield<span className="text-[#007ea7]">Pro</span></span>
                        <span className="text-[8px] font-black uppercase tracking-[6px] text-slate-300 mt-2 italic shadow-sm">GLOBAL_QUORUM_V4.2</span>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-16 text-[12px] font-black text-[#003249] tracking-[6px] uppercase italic">
                    {["Resources", "Protocols", "Ecosystem", "Intelligence"].map((item, i) => (
                        <a key={i} href="#" className="hover:text-[#007ea7] transition-all duration-500 relative group/link flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#007ea7] scale-0 group-hover/link:scale-100 transition-transform shadow-[0_0_10px_#007ea7]" />
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#007ea7] to-transparent group-hover/link:w-full transition-all duration-700 rounded-full" />
                        </a>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-12">
                    <Link to="/login" className="text-[12px] font-black text-[#003249] uppercase tracking-[6px] italic hover:text-[#007ea7] transition-all flex items-center gap-4 group">
                        <Lock size={16} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> AUTHORIZE
                    </Link>
                    <Link to="/register" className="h-18 px-12 bg-[#003249] text-[#80ced7] rounded-[2rem] font-black uppercase tracking-[8px] text-[12px] shadow-4xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 italic flex items-center justify-center border-4 border-white group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent group-hover:animate-shimmer" />
                        <span className="relative z-10">ENLIST_NODE</span>
                    </Link>
                </div>

                <button className="lg:hidden text-[#003249] w-16 h-16 flex items-center justify-center bg-white border-4 border-slate-50 rounded-2xl shadow-xl" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={32} strokeWidth={4} /> : <Menu size={32} strokeWidth={4} />}
                </button>
            </div>
            
            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[2000] p-16 flex flex-col gap-16 lg:hidden"
                    >
                         <div className="flex justify-between items-center mb-10">
                            <span className="text-3xl font-black tracking-tighter text-[#003249] italic">Shield<span className="text-[#007ea7]">Pro</span></span>
                            <button onClick={() => setIsOpen(false)} className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center"><X size={32} strokeWidth={4} /></button>
                         </div>
                        {["HOME", "RESOURCES", "PROTOCOLS", "CONTACT"].map((l, i) => (
                             <a key={i} href="#" className="text-4xl font-black text-[#003249] uppercase tracking-[10px] italic border-b-4 border-slate-50 pb-8">{l}</a>
                        ))}
                        <div className="flex flex-col gap-10 mt-auto">
                            <Link to="/login" className="h-24 flex items-center justify-center font-black text-[#003249] text-xl uppercase tracking-[10px] italic border-4 border-[#003249] rounded-3xl">AUTHORIZE_SYNC</Link>
                            <Link to="/register" className="h-24 bg-[#003249] text-[#80ced7] rounded-3xl flex items-center justify-center font-black text-xl uppercase tracking-[10px] italic shadow-4xl border-4 border-white">ENLIST_NODE</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const HeroSection = () => (
    <section className="pt-72 pb-48 bg-slate-50 relative overflow-hidden min-h-screen flex items-center">
        {/* Advanced Tactical Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 2px, transparent 2px)', backgroundSize: '70px 70px' }} />
        <div className="absolute inset-0 bg-mesh-gradient opacity-10 pointer-events-none" />
        
        {/* Immersive Fluid Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[1200px] h-[1200px] bg-gradient-to-br from-[#007ea7]/20 to-[#80ced7]/10 blur-[200px] rounded-full pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-20%] left-[-15%] w-[1000px] h-[1000px] bg-[#003249]/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1800px] mx-auto px-8 md:px-20 relative z-10 w-full">
            <div className="grid lg:grid-cols-12 gap-24 items-center">
                <div className="lg:col-span-7">
                    <Reveal direction="left">
                        <div className="inline-flex items-center gap-6 px-10 py-4 rounded-[2rem] bg-white/70 backdrop-blur-xl border-4 border-white mb-14 shadow-4xl group cursor-help">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping shadow-[0_0_20px_#10b981]" />
                            <span className="text-[12px] font-black uppercase tracking-[8px] text-[#003249] italic">INDIA_SECTOR_CORE_UPLINK_STABLE</span>
                            <ChevronRight size={16} className="text-[#007ea7] group-hover:translate-x-2 transition-transform" strokeWidth={5} />
                        </div>
                        <h1 className="text-[#003249] text-7xl md:text-9xl font-black leading-[0.85] mb-14 uppercase tracking-tighter italic">
                            Universal <br /> <span className="text-[#007ea7] drop-shadow-[0_0_30px_rgba(0,126,167,0.3)]">Asset Shield<span className="text-[#80ced7]">_</span></span>
                        </h1>
                        <p className="text-slate-400 text-xl md:text-2xl font-black mb-20 max-w-3xl leading-relaxed italic uppercase tracking-[6px] opacity-40 group hover:opacity-100 transition-opacity duration-1000">
                            Deep-tech insurance protocols engineered for the next generation of global operatives. Secure your <span className="text-[#003249] underline decoration-4 underline-offset-8">workspace</span>, <span className="text-[#003249] underline decoration-4 underline-offset-8">mobility nodes</span>, and <span className="text-[#003249] underline decoration-4 underline-offset-8">biological integrity</span> on a unified mission-critical grid.
                        </p>
                        <div className="flex flex-wrap gap-12">
                            <Link to="/register" className="h-28 px-16 bg-[#003249] text-[#80ced7] rounded-[2.5rem] text-[16px] font-black uppercase tracking-[12px] shadow-4xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 italic flex items-center gap-10 group border-8 border-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent group-hover:animate-shimmer" />
                                <span className="relative z-10">INITIALIZE_SYNC</span> <ArrowRight size={36} className="group-hover:translate-x-6 transition-transform duration-700 relative z-10" strokeWidth={5} />
                            </Link>
                            <button className="h-28 px-16 bg-white/50 backdrop-blur-xl border-8 border-white text-[#003249] rounded-[2.5rem] text-[16px] font-black uppercase tracking-[8px] hover:border-[#007ea7] hover:bg-white transition-all italic flex items-center gap-8 shadow-inner group">
                                <Terminal size={28} strokeWidth={4} className="text-[#007ea7] group-hover:rotate-12 transition-transform" /> VIEW_PROTOCOLS
                            </button>
                        </div>
                        
                        <div className="mt-24 flex items-center gap-20 opacity-20 italic">
                             {[
                                { icon: Fingerprint, label: "BIOMETRIC_VETTING" },
                                { icon: Satellite, label: "GEOSYNC_CALIBRATION" },
                                { icon: Layers, label: "MULTI_LAYER_ENCRYPT" }
                             ].map((tech, i) => (
                                <div key={i} className="flex items-center gap-6 group cursor-crosshair">
                                    <tech.icon size={32} strokeWidth={3} className="text-[#007ea7] group-hover:rotate-[360deg] transition-all duration-[2000ms]" />
                                    <span className="text-[12px] font-black uppercase tracking-[6px] group-hover:text-[#003249] transition-colors">{tech.label}</span>
                                </div>
                             ))}
                        </div>
                    </Reveal>
                </div>

                <div className="lg:col-span-5 relative hidden lg:block">
                    <Reveal direction="right" delay={0.4}>
                        <div className="relative group/mock">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#003249] to-[#007ea7] rounded-[6rem] rotate-12 scale-105 opacity-5 blur-3xl group-hover/mock:rotate-[20deg] transition-all duration-[3000ms]" />
                            <div className="bg-white/80 backdrop-blur-3xl border-8 border-white rounded-[6rem] p-16 shadow-4xl relative overflow-hidden group">
                                 {/* Tactical Interface Mockup */}
                                 <div className="space-y-14">
                                    <div className="flex justify-between items-center pb-12 border-b-4 border-slate-50">
                                        <div className="flex gap-8">
                                            <div className="w-20 h-20 bg-[#003249] rounded-[2rem] flex items-center justify-center text-[#007ea7] shadow-4xl relative overflow-hidden group-hover:rotate-12 duration-700 transition-all border-4 border-white/10">
                                                <div className="absolute inset-0 bg-[#007ea7]/20 animate-pulse" />
                                                <Activity size={40} strokeWidth={3} className="relative z-10" />
                                            </div>
                                            <div className="flex flex-col justify-center gap-3">
                                                <div className="w-48 h-6 bg-slate-100 rounded-full mb-1 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#007ea7]/20 to-transparent animate-shimmer" />
                                                </div>
                                                <div className="w-32 h-3 bg-slate-50 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="w-24 h-24 bg-slate-50 rounded-full border-4 border-white shadow-inner flex items-center justify-center relative overflow-hidden group/avatar">
                                            <div className="absolute inset-0 bg-[#003249]/5" />
                                            <Compass size={44} className="text-slate-200 group-hover/avatar:rotate-180 transition-transform duration-[3000ms]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-12">
                                        {[
                                            { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50", label: "SYNC_NOMINAL" },
                                            { icon: Zap, color: "text-[#80ced7]", bg: "bg-[#003249]", label: "BURST_CALIB" }
                                        ].map((box, i) => (
                                            <div key={i} className={`h-48 ${box.bg} rounded-[3rem] border-4 border-white p-10 flex flex-col justify-between shadow-4xl group/box hover:translate-y-[-10px] transition-all duration-700`}>
                                                <div className={`w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center ${box.color} group-hover/box:rotate-12 transition-transform`}>
                                                    <box.icon size={28} strokeWidth={3} />
                                                </div>
                                                <div className="space-y-3">
                                                    <span className={`text-[10px] font-black uppercase tracking-[4px] italic ${box.bg === 'bg-[#003249]' ? 'text-white/40' : 'text-slate-300'}`}>{box.label}</span>
                                                    <div className={`w-full h-3 rounded-full overflow-hidden ${box.bg === 'bg-[#003249]' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                                         <motion.div initial={{ width: 0 }} animate={{ width: i === 0 ? '98%' : '72%' }} transition={{ duration: 3, delay: 1 }} className={`h-full ${box.bg === 'bg-[#003249]' ? 'bg-[#007ea7]' : 'bg-emerald-500'} shadow-[0_0_15px_currentColor]`} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-8 p-10 bg-slate-50/50 rounded-[3rem] border-4 border-white shadow-inner">
                                        <div className="flex justify-between items-center px-4">
                                            <span className="text-[11px] font-black text-[#003249] uppercase tracking-[8px] italic opacity-40 leading-none">Global_Grid_Calibration</span>
                                            <span className="text-[13px] font-black text-[#007ea7] italic leading-none">94.2%</span>
                                        </div>
                                        <div className="w-full h-6 bg-white rounded-full overflow-hidden relative border-2 border-slate-100 p-1">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '94%' }}
                                                transition={{ duration: 4, ease: [0.22, 1, 0.36, 1], delay: 1.5 }}
                                                className="h-full bg-gradient-to-r from-[#003249] via-[#007ea7] to-[#80ced7] rounded-full shadow-[0_0_20px_#007ea7]" 
                                            />
                                        </div>
                                    </div>
                                 </div>
                                 
                                 {/* Animated HUD Overlay */}
                                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-[360deg] transition-transform duration-[20000ms] pointer-events-none">
                                    <Globe size={400} strokeWidth={1} />
                                 </div>
                            </div>
                            
                            {/* Floating Metadata Node */}
                            <motion.div 
                                animate={{ y: [0, -25, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-16 -right-16 px-12 py-8 bg-[#003249] shadow-4xl rounded-[3rem] border-8 border-white z-20 group/meta"
                            >
                                <div className="flex items-center gap-10">
                                     <div className="w-16 h-16 bg-[#007ea7] rounded-[1.5rem] flex items-center justify-center text-[#003249] shadow-4xl group-hover/meta:rotate-[-45deg] transition-transform duration-1000">
                                        <CheckCircle2 size={36} strokeWidth={4} />
                                     </div>
                                     <div className="flex flex-col">
                                        <span className="text-[12px] font-black text-[#80ced7] uppercase tracking-[10px] italic leading-none mb-3">NODE_STATUS</span>
                                        <span className="text-[18px] font-black text-white uppercase tracking-[4px] italic leading-none">SECURED_VINTAGE_</span>
                                     </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                animate={{ x: [0, 15, 0], y: [0, 20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-12 -left-12 px-10 py-6 bg-white shadow-4xl rounded-[2.5rem] border-4 border-slate-50 z-20"
                            >
                                <div className="flex items-center gap-6">
                                    <RefreshCcw size={24} className="text-[#007ea7] animate-spin-slow" strokeWidth={4} />
                                    <span className="text-[11px] font-black text-[#003249] uppercase tracking-[6px] italic leading-none">Real_Time_Sync_Active</span>
                                </div>
                            </motion.div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    </section>
);

const StatsCounter = () => (
    <section className="py-32 bg-[#003249] relative overflow-hidden">
        {/* Immersive Deep Blue Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#007ea7_0%,transparent_70%)] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#007ea7] to-transparent shadow-[0_0_20px_#007ea7]" />
        
        <div className="max-w-[1800px] mx-auto px-8 md:px-20 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 relative z-10">
                {[
                    { label: "Active_Inventory", val: "50+", icon: ShieldCheck, suffix: "VAULTS_DEPLOYED", color: "text-emerald-500" },
                    { label: "Global_Operatives", val: "10K+", icon: UserPlus, suffix: "LIVES_SYNCHRONIZED", color: "text-[#80ced7]" },
                    { label: "Settlement_Sync", val: "99%", icon: SearchCheck, suffix: "SUCCESS_PROBABILITY", color: "text-[#007ea7]" },
                    { label: "Satellite_Grid", val: "100+", icon: Globe, suffix: "SECTOR_DOMINANCE", color: "text-amber-500" }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="relative group p-12 rounded-[4rem] hover:bg-white/5 transition-all duration-1000 border-4 border-transparent hover:border-white/10 flex flex-col items-center text-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[4rem]" />
                            
                            <div className="flex justify-center mb-10 relative">
                                <div className="w-24 h-24 bg-white/5 border-4 border-white/10 rounded-[2.5rem] flex items-center justify-center group-hover:bg-[#007ea7] group-hover:text-[#003249] group-hover:rotate-[360deg] transition-all duration-[1500ms] shadow-4xl backdrop-blur-md relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                                    <s.icon size={44} strokeWidth={3} className={`relative z-10 transition-colors duration-1000 ${s.color} group-hover:text-inherit`} />
                                </div>
                                <div className={`absolute -inset-4 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-1000 ${s.bg === 'text-emerald-500' ? 'bg-emerald-500' : 'bg-[#007ea7]'}`} />
                            </div>
                            
                            <h4 className="text-6xl md:text-7xl font-black text-white mb-4 italic tracking-tighter leading-none group-hover:scale-110 transition-transform duration-1000">{s.val}</h4>
                            <div className="flex flex-col gap-3">
                                <p className="text-[13px] font-black uppercase tracking-[8px] text-[#007ea7] italic leading-none">{s.label}</p>
                                <div className="w-12 h-1 bg-white/10 mx-auto rounded-full group-hover:w-24 transition-all duration-1000 group-hover:bg-[#007ea7]" />
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[6px] italic leading-none">{s.suffix}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#007ea7] to-transparent opacity-30" />
    </section>
);

const PolicyCards = () => (
    <section className="py-48 bg-white relative overflow-hidden">
        {/* Sophisticated Architectural Decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#003249_1px,transparent_0)] [background-size:60px_60px] opacity-[0.02] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#007ea7]/5 blur-[200px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1800px] mx-auto px-8 md:px-20 relative z-10">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-32 gap-16">
                <div className="max-w-4xl space-y-10">
                    <Reveal direction="left">
                        <div className="flex items-center gap-8 mb-4">
                            <div className="w-5 h-18 bg-[#007ea7] rounded-full shadow-[0_0_30px_#007ea7] animate-pulse" />
                            <div className="space-y-3">
                                <span className="text-[16px] font-black uppercase tracking-[20px] text-[#007ea7] italic block leading-none">Protection_Protocols</span>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <Satellite size={20} strokeWidth={3} className="animate-spin-slow" />
                                    <span className="text-[10px] font-black uppercase tracking-[6px] italic">GLOBAL_SYNC_AVAILABLE</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                    <Reveal direction="left" delay={0.2}>
                        <h2 className="text-7xl md:text-9xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Standardized <br /> <span className="text-[#007ea7]">Grid Solutions_</span></h2>
                    </Reveal>
                </div>
                <Reveal direction="right" delay={0.4}>
                    <p className="max-w-xl text-slate-400 font-black uppercase tracking-[10px] italic leading-loose text-right lg:text-left border-l-8 border-slate-50 pl-12 py-6 opacity-40 group hover:opacity-100 transition-all duration-1000">
                        Select the defensive node required for your deployment. Automated mission-critical synchronization is integrated into every transmission core.
                    </p>
                </Reveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                {[
                    { icon: Heart, title: "BioSync Pro", desc: "Full-spectrum biological coverage with real-time biometric synchronization across elite medical grids.", color: "text-[#007ea7]", label: "HEALTH_NODE_v4", gradient: "from-rose-500/10 to-transparent" },
                    { icon: Shield, title: "Legacy Shield", desc: "Enterprise-grade financial planning to secure your lineage. Maximum kinetic asset retention protocols.", color: "text-[#007ea7]", label: "LIFE_PROTOCOL_S1", gradient: "from-blue-500/10 to-transparent" },
                    { icon: Car, title: "Mobility Matrix", desc: "Defensive coverage for your transportation nodes. Collision and environmental anomaly protection.", color: "text-[#007ea7]", label: "VEHICLE_UNIT_AUTO", gradient: "from-emerald-500/10 to-transparent" },
                    { icon: Home, title: "Habitat Security", desc: "Structural fortification against intrusion and environmental failure. Dynamic inventory monitoring active.", color: "text-[#007ea7]", label: "HOME_CELL_SHELTER", gradient: "from-amber-500/10 to-transparent" },
                    { icon: Plane, title: "Nexus Travel", desc: "Borderless protection protocols for global deployment. Emergency extraction and delay mitigation modules.", color: "text-[#007ea7]", label: "TRAVEL_SYNC_GRID", gradient: "from-violet-500/10 to-transparent" },
                    { icon: Briefcase, title: "Sector Business", desc: "Operational liability and asset coverage for complex commercial deployments. High-yield security layer.", color: "text-[#007ea7]", label: "BIZ_SECTOR_PROTO", gradient: "from-slate-500/10 to-transparent" }
                ].map((p, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="saas-card group relative overflow-hidden flex flex-col min-h-[550px] shadow-4xl transition-all duration-1000 hover:border-[#007ea7]/40 border-4 border-slate-50 bg-white/50 backdrop-blur-md rounded-[5rem] p-16">
                            {/* Ambient Light Node */}
                            <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${p.gradient} blur-[120px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-[6000ms] opacity-60`} />
                            
                            <div className="flex justify-between items-start mb-16 relative z-10">
                                <div className="w-28 h-28 bg-[#003249] border-4 border-white shadow-4xl rounded-[3rem] flex items-center justify-center text-[#007ea7] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                    <p.icon size={48} strokeWidth={3} className="relative z-10" />
                                </div>
                                <div className="flex flex-col items-end gap-5">
                                    <div className="px-8 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-100 rounded-3xl text-[10px] font-black text-[#003249] uppercase tracking-[8px] shadow-inner italic group-hover:bg-[#003249] group-hover:text-[#80ced7] group-hover:border-[#003249] transition-all duration-500 leading-none">
                                        {p.label}
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/80 px-6 py-2 rounded-2xl border border-slate-100 shadow-sm opacity-30 group-hover:opacity-100 transition-opacity">
                                        <Fingerprint size={16} strokeWidth={3} className="text-[#007ea7]" />
                                        <span className="text-[9px] font-black uppercase tracking-[5px] italic text-[#003249]">BIO_LOCKED</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-8 mb-16 relative z-10">
                                <h3 className="text-5xl font-black text-[#003249] leading-tight uppercase tracking-tighter italic group-hover:text-[#007ea7] transition-all duration-500">
                                    {p.title}
                                </h3>
                                <div className="w-20 h-3 bg-[#007ea7] mb-8 rounded-full group-hover:w-40 transition-all duration-1000 shadow-[0_0_20px_#007ea7]" />
                                <p className="text-[14px] font-black text-slate-400 uppercase tracking-[6px] italic leading-relaxed opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                    {p.desc}
                                </p>
                            </div>

                            <div className="mt-auto pt-14 border-t-4 border-slate-50/50 flex justify-between items-center relative z-10">
                                <div className="flex flex-col gap-4">
                                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-[8px] italic leading-none opacity-40">MAINFRAME_SYNC</span>
                                     <div className="flex items-center gap-6">
                                        <Activity size={20} className="text-emerald-500 animate-pulse" strokeWidth={4} />
                                        <span className="text-2xl font-black text-[#003249] uppercase tracking-[4px] italic leading-none">ACTIVE_GRID</span>
                                     </div>
                                </div>
                                <button className="w-24 h-24 bg-[#003249] text-[#80ced7] rounded-[2.5rem] flex items-center justify-center shadow-4xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-90 group/btn border-4 border-white/5 relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent group-hover:animate-shimmer" />
                                    <ArrowRight size={48} className="group-hover:translate-x-4 transition-transform duration-1000 relative z-10" strokeWidth={5} />
                                </button>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
            
            <Reveal direction="up" delay={0.6}>
                <div className="mt-48 p-20 bg-[#003249] rounded-[6rem] border-8 border-white shadow-4xl relative overflow-hidden group">
                     <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#007ea7 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
                     <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#007ea7]/20 to-transparent pointer-events-none" />
                     
                     <div className="flex flex-col lg:flex-row items-center justify-between gap-24 relative z-10">
                        <div className="space-y-8 max-w-2xl">
                            <h3 className="text-white text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">Custom_Protocol <br /> <span className="text-[#80ced7]">Architecture_</span></h3>
                            <p className="text-[#80ced7] opacity-40 font-black uppercase tracking-[8px] italic leading-loose text-lg">Initialize a personalized defensive grid tailored to your specific operational sector and risk parameters.</p>
                        </div>
                        <Link to="/register" className="h-32 px-20 bg-white text-[#003249] rounded-[3rem] text-xl font-black uppercase tracking-[20px] shadow-4xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 italic flex items-center gap-12 group/btn border-8 border-white/10 shrink-0">
                            INITIALIZE_BUILD <Plus size={64} className="group-hover:rotate-[360deg] transition-all duration-[2000ms]" strokeWidth={5} />
                        </Link>
                     </div>
                </div>
            </Reveal>
        </div>
    </section>
);

const HowItWorks = () => (
    <section className="py-48 bg-slate-50 relative overflow-hidden">
        {/* Dynamic Data Flow Background */}
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-white via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-[1800px] mx-auto px-8 md:px-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-40 space-y-12">
                 <Reveal direction="up">
                    <div className="inline-block px-10 py-4 rounded-[3rem] border-4 border-white bg-white/70 backdrop-blur-xl mb-10 shadow-4xl group cursor-help">
                        <div className="flex items-center gap-6">
                            <div className="w-4 h-4 rounded-full bg-[#007ea7] shadow-[0_0_15px_#007ea7] animate-pulse" />
                            <span className="text-[13px] font-black uppercase tracking-[15px] text-[#007ea7] italic leading-none">Operational_Workflow_v4</span>
                        </div>
                    </div>
                 </Reveal>
                <Reveal direction="up" delay={0.2}>
                    <h2 className="text-7xl md:text-9xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">High-Fidelity <br /> <span className="text-[#007ea7]">Architecture_</span></h2>
                </Reveal>
                <Reveal direction="up" delay={0.3}>
                    <p className="text-slate-400 font-black uppercase tracking-[10px] italic leading-relaxed opacity-40 max-w-2xl mx-auto">Establishment of your security quadrant follows a precise mission-critical sequence.</p>
                </Reveal>
            </div>

            <div className="relative flex flex-col lg:flex-row justify-between gap-24 lg:gap-12">
                {/* Tactical Connecting Backbone (Desktop) */}
                <div className="absolute top-[80px] left-[10%] right-[10%] h-4 bg-white hidden lg:block rounded-full shadow-inner border-2 border-slate-100 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-gradient-to-r from-[#003249] via-[#007ea7] to-emerald-500 opacity-20" />
                </div>
                
                {[
                    { icon: UserPlus, title: "Grid_Entry", desc: "Register your biological identity to the ShieldPro network.", step: "STEP_01", status: "AUTH_INIT" },
                    { icon: SearchCheck, title: "Scan_Core", desc: "Algorithmically analyze defensive nodes for your perimeter.", step: "STEP_02", status: "SCAN_PARAM" },
                    { icon: MousePointer2, title: "Authorize", desc: "Securely authorize and deploy protection to your grid.", step: "STEP_03", status: "UPLINK_SYNC" },
                    { icon: FileCheck, title: "Sync_Ready", desc: "Maintain real-time synchronization and rapid response status.", step: "STEP_04", status: "GRID_ACTIVE" }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.2}>
                        <div className="relative z-10 flex flex-col items-center text-center flex-1 group/step">
                            <div className="w-40 h-40 bg-[#003249] text-[#80ced7] rounded-[4rem] flex items-center justify-center mb-14 shadow-4xl border-8 border-white group-hover/step:rotate-[-12deg] group-hover/step:scale-110 group-hover/step:bg-[#007ea7] group-hover/step:text-white transition-all duration-1000 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-40" />
                                <s.icon size={64} strokeWidth={3} className="relative z-10 group-hover/step:scale-110 transition-transform" />
                                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#003249] font-black italic border-4 border-[#003249] shadow-inner text-xl">{i+1}</div>
                            </div>
                            <div className="flex flex-col items-center gap-4 bg-white/50 backdrop-blur-xl p-10 rounded-[3.5rem] border-4 border-white shadow-4xl w-full group-hover/step:bg-white transition-all duration-700">
                                <span className="text-[12px] font-black text-[#007ea7] uppercase tracking-[10px] italic leading-none mb-3 underline decoration-4 decoration-[#007ea7]/10 underline-offset-8">{s.step}</span>
                                <h4 className="text-3xl font-black text-[#003249] mb-4 uppercase tracking-tighter italic leading-none">{s.title}</h4>
                                <p className="text-[13px] font-black text-slate-300 uppercase tracking-[5px] max-w-[250px] leading-loose italic opacity-60 group-hover/step:text-[#003249] transition-colors">{s.desc}</p>
                                <div className="mt-6 flex items-center gap-4 px-6 py-2 bg-slate-50 rounded-2xl border-2 border-slate-100 group-hover/step:bg-[#003249] group-hover/step:border-[#003249] transition-all">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                                    <span className="text-[9px] font-black text-slate-400 group-hover/step:text-[#80ced7] uppercase tracking-[4px] italic">{s.status}</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const WhyChooseUs = () => (
    <section className="py-48 bg-white relative overflow-hidden">
        {/* Elite Visual Context */}
        <div className="absolute right-0 top-0 p-48 opacity-[0.02] pointer-events-none">
            <Cpu size={800} strokeWidth={1} className="text-[#003249] rotate-[-15deg] group-hover:rotate-0 transition-all duration-[10000ms]" />
        </div>
        
        <div className="max-w-[1800px] mx-auto px-8 md:px-20">
            <div className="grid lg:grid-cols-12 gap-32 items-center mb-48">
                <div className="lg:col-span-12 text-center">
                    <Reveal direction="up">
                        <div className="inline-block px-10 py-4 rounded-[2.5rem] border-4 border-slate-50 bg-slate-50/50 mb-14 shadow-inner">
                            <span className="text-[14px] font-black uppercase tracking-[20px] text-[#003249] italic leading-none flex items-center gap-6">
                                <Command size={24} strokeWidth={3} className="text-[#007ea7]" /> GRID_PERFORMANCE_优势
                            </span>
                        </div>
                    </Reveal>
                    <Reveal direction="up" delay={0.2}>
                        <h2 className="text-7xl md:text-9xl font-black text-[#003249] uppercase tracking-tighter italic leading-none max-w-5xl mx-auto">Sovereign <span className="text-[#007ea7]">Security Control_</span></h2>
                    </Reveal>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-20">
                {[
                    { icon: Lock, title: "Quantum_Shield", desc: "Mission-critical X_AES_512 encryption ensuring your financial manifest remains absolutely private." },
                    { icon: Zap, title: "Tactical_Uplink", desc: "Policy documentation is synchronized to your terminal within milliseconds of final authorization." },
                    { icon: Clock, title: "Autonomous_Sync", desc: "24/7 perpetual monitoring of your protection status across all designated global sectors." },
                    { icon: Target, title: "Precision_Yield", desc: "Automated premium calibration engine ensuring you maintain maximum coverage at optimized rates." },
                    { icon: Headphones, title: "Field_Support", desc: "Direct encrypted uplink to expert tactical advisors for complex coverage configuration." },
                    { icon: Activity, title: "Velocity_Engine", desc: "Digital-first claim settlement engine optimized for zero-latency fiscal asset transmission." }
                ].map((f, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-slate-50/70 backdrop-blur-md p-14 rounded-[4rem] border-4 border-white flex flex-col items-center text-center gap-10 hover:bg-white hover:shadow-4xl transition-all duration-1000 group cursor-crosshair relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="w-28 h-28 bg-white shadow-4xl text-[#007ea7] rounded-[2.5rem] flex items-center justify-center flex-shrink-0 group-hover:bg-[#003249] group-hover:text-white transition-all duration-1000 group-hover:rotate-[360deg] border-4 border-slate-50 mt-[-20%] relative z-10">
                                <f.icon size={44} strokeWidth={3} />
                            </div>
                            <div className="space-y-6 relative z-10 w-full">
                                <h4 className="text-4xl font-black text-[#003249] uppercase tracking-tighter italic leading-none group-hover:text-[#007ea7] transition-colors">{f.title}</h4>
                                <div className="w-12 h-1 bg-[#007ea7] mx-auto rounded-full group-hover:w-24 transition-all duration-1000" />
                                <p className="text-[14px] text-slate-400 font-black uppercase tracking-[5px] leading-loose italic opacity-40 group-hover:opacity-100 transition-opacity duration-700">{f.desc}</p>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#007ea7] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const CTABanner = () => (
    <section className="py-48 bg-white relative overflow-hidden">
         {/* Deep Space Ambiance */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f8fafc_0%,white_100%)] pointer-events-none" />
        
        <div className="max-w-[1800px] mx-auto px-8 md:px-20 relative z-10">
            <Reveal direction="up">
                <div className="bg-[#003249] rounded-[6rem] p-24 md:p-48 text-center relative overflow-hidden shadow-4xl group border-8 border-white/5">
                     {/* Immersive Tactical Backdrop */}
                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                     <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] border-[80px] border-white/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-[12000ms] group-hover:rotate-12" />
                     <div className="absolute bottom-[-15%] left-[-10%] opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-[15000ms]">
                        <Satellite size={800} strokeWidth={1} className="text-[#007ea7]" />
                     </div>
                     <div className="absolute inset-0 bg-mesh-gradient opacity-10 pointer-events-none" />

                     <div className="relative z-10 max-w-5xl mx-auto space-y-16">
                        <div className="inline-block px-10 py-4 rounded-[3rem] border-4 border-white/10 bg-white/5 backdrop-blur-3xl animate-pulse">
                            <span className="text-[14px] font-black uppercase tracking-[20px] text-[#007ea7] italic leading-none">FINAL_AUTHORIZATION_REQUIRED</span>
                        </div>
                        <h2 className="text-white text-7xl md:text-[10rem] font-black leading-[0.85] uppercase tracking-tighter italic">Ready to <br /> <span className="text-[#80ced7] underline decoration-[20px] decoration-[#007ea7] underline-offset-[30px]">Enlist?</span></h2>
                        <p className="text-[#80ced7] opacity-40 text-2xl font-black italic max-w-3xl mx-auto uppercase tracking-[12px] leading-relaxed group-hover:opacity-100 transition-opacity duration-1000 mb-16">
                            Join the ShieldPro global collective and establish a permanent security quadrant for your mission future.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-16 pt-10">
                            <Link to="/register" className="h-32 px-24 bg-[#007ea7] hover:bg-white hover:text-[#003249] text-white rounded-[3.5rem] text-[20px] font-black uppercase tracking-[20px] shadow-4xl transition-all active:scale-95 italic flex items-center gap-12 group/btn border-8 border-white/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
                                <span className="relative z-10">INITIALIZE_NODE</span> <ChevronRight size={56} className="group-hover/btn:translate-x-6 transition-transform duration-1000 relative z-10" strokeWidth={5} />
                            </Link>
                            <Link to="/login" className="text-[16px] font-black text-white/30 uppercase tracking-[10px] hover:text-[#80ced7] transition-all italic border-b-4 border-transparent hover:border-[#80ced7]/20 pb-4">ACCESS_EXISTING_TERMINAL</Link>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    </section>
);

const Footer = () => (
    <footer className="pt-48 pb-20 bg-[#003249] text-white relative overflow-hidden border-t-8 border-white/5">
        <div className="absolute bottom-[-10%] right-[-5%] p-20 opacity-[0.03] pointer-events-none group">
            <Shield size={1000} strokeWidth={1} className="text-white rotate-[-15deg]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        
        <div className="max-w-[1800px] mx-auto px-8 md:px-20 relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-32 mb-48">
                <div className="lg:col-span-5 space-y-16">
                    <Link to="/" className="flex items-center gap-8 group">
                        <div className="w-20 h-20 bg-[#007ea7] rounded-[2rem] flex items-center justify-center text-[#003249] shadow-4xl border-4 border-white/10 group-hover:rotate-[360deg] transition-all duration-[2000ms] relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50 shadow-inner" />
                            <Shield size={44} strokeWidth={3} className="relative z-10" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-4xl font-black tracking-tighter text-white italic leading-none">Shield<span className="text-[#007ea7]">Pro</span></span>
                            <span className="text-[10px] font-black uppercase tracking-[8px] text-white/20 mt-2 italic">GLOBAL_INFRA_V4</span>
                        </div>
                    </Link>
                    <p className="text-lg font-black leading-loose text-slate-400 italic uppercase tracking-[5px] max-w-xl opacity-40 group hover:opacity-100 transition-all duration-1000">
                        The ultimate high-fidelity defensive grid for biological and digital assets. Engineered for high-velocity resolution and zero-latency protection synchronization in complex risk sectors.
                    </p>
                    <div className="flex gap-10">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-18 h-18 bg-white/5 border-2 border-white/5 rounded-[1.8rem] flex items-center justify-center hover:bg-[#007ea7] hover:text-[#003249] hover:rotate-12 transition-all duration-700 shadow-4xl group">
                                <Icon size={28} className="group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h4 className="text-[13px] font-black uppercase tracking-[10px] text-[#007ea7] mb-14 italic flex items-center gap-4 animate-pulse">
                        <div className="w-2 h-6 bg-[#007ea7] rounded-full" /> Quick_Links
                    </h4>
                    <ul className="space-y-10">
                        {["Home", "Strategic_Mission", "Workflows", "Ecosystem", "Intelligence"].map((l, i) => (
                            <li key={i} className="text-[12px] font-black text-slate-400 uppercase tracking-[6px] hover:text-[#007ea7] hover:translate-x-4 transition-all duration-500 italic cursor-crosshair flex items-center gap-4 group">
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-[#007ea7]" strokeWidth={5} /> {l}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-2">
                    <h4 className="text-[13px] font-black uppercase tracking-[10px] text-[#007ea7] mb-14 italic flex items-center gap-4">
                        <div className="w-2 h-6 bg-[#007ea7] rounded-full shadow-[0_0_10px_#007ea7]" /> Protocol_Nodes
                    </h4>
                    <ul className="space-y-10">
                        {["BioSync_Pro", "Legacy_Shield", "Mobility_Matrix", "Habitat_Cell", "Nexus_Travel"].map((l, i) => (
                            <li key={i} className="text-[12px] font-black text-slate-400 uppercase tracking-[6px] hover:text-[#007ea7] hover:translate-x-4 transition-all duration-500 italic cursor-crosshair flex items-center gap-4 group">
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-[#007ea7]" strokeWidth={5} /> {l}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-3 space-y-12">
                    <h4 className="text-[13px] font-black uppercase tracking-[10px] text-[#007ea7] mb-14 italic flex items-center gap-4">
                        <div className="w-2 h-6 bg-[#007ea7] rounded-full" /> Sector_Coordinates
                    </h4>
                    <ul className="space-y-12">
                        {[
                            { icon: MapPin, text: "Finance Hub, BKC, Mumbai, Maharashtra 400051" },
                            { icon: Phone, text: "1800-SHIELD-PRO-S1" },
                            { icon: Mail, text: "UPLINK@SHIELDPRO.GRID" }
                        ].map((item, i) => (
                             <li key={i} className="flex gap-10 text-[12px] font-black text-slate-400 uppercase tracking-[4px] italic leading-relaxed group hover:text-white transition-colors">
                                <div className="w-14 h-14 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center text-[#007ea7] group-hover:bg-[#007ea7] group-hover:text-[#003249] transition-all duration-700 shadow-xl shrink-0 group-hover:rotate-12">
                                    <item.icon size={26} strokeWidth={3} />
                                </div>
                                <span className="pt-2">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <div className="pt-20 border-t-8 border-white/5 flex flex-col xl:flex-row justify-between items-center gap-16 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[4px] w-48 h-2 bg-[#007ea7] rounded-full shadow-[0_0_15px_#007ea7]" />
                 <div className="flex flex-col items-center xl:items-start gap-4">
                    <p className="text-[12px] font-black text-white/20 uppercase tracking-[10px] italic leading-none">© 2026 ShieldPro Global Infrastructure Grid. All Rights Reserved.</p>
                    <div className="flex items-center gap-6 opacity-20">
                         <Activity size={16} strokeWidth={4} className="text-emerald-500" />
                         <span className="text-[9px] font-black uppercase tracking-[8px] italic">NOMINAL_TX_GRID_ACTIVE</span>
                    </div>
                 </div>
                <div className="flex flex-wrap justify-center gap-16 text-[12px] font-black uppercase tracking-[8px] text-white/20 italic">
                    {["Privacy_Protocol", "Terms_of_Service", "Cookie_Manifest", "Security_SLA"].map((l, i) => (
                        <a key={i} href="#" className="hover:text-[#007ea7] hover:tracking-[12px] transition-all duration-1000 border-b border-transparent hover:border-[#007ea7]/20 pb-2">{l}</a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

const Home = () => {
    return (
        <div className="relative min-h-screen bg-white font-display overflow-x-hidden selection:bg-[#007ea7] selection:text-white">
            <Navbar />
            <HeroSection />
            <StatsCounter />
            <PolicyCards />
            <HowItWorks />
            <WhyChooseUs />
            <CTABanner />
            <Footer />
        </div>
    );
};

export default Home;
