import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, ChevronRight, Star, CheckCircle2, Clock, 
    ShieldCheck, ArrowRight, User, Activity, Key, 
    Lock, Zap, Globe, Scale, Fingerprint, Headphones,
    LayoutDashboard, LineChart, ShieldPlus, Target,
    Compass, Satellite, Cpu, IndianRupee, Menu
} from "lucide-react";
import Reveal from "../components/common/Reveal";
import AnimatedBackground from "../components/common/AnimatedBackground";
import HeroScene from "../components/3d/HeroScene";

const Home = () => {
    const [activeRole, setActiveRole] = useState("Admins");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const roleContent = {
        Admins: {
            title: "Command & Control Architecture",
            description: "Elite oversight for high-stake insurance operations. Deploy decentralized management protocols across global verticals with total visibility.",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
            features: [
                { icon: LayoutDashboard, title: "Mission Control HUD", desc: "Manage entities, sub-agencies, and multi-tenant assets from a unified cockpit." },
                { icon: Satellite, title: "Orbital Surveillance", desc: "Real-time risk telemetry and predictive modeling for preemptive mitigation." },
                { icon: Cpu, title: "Autonomous Compliance", desc: "Self-healing regulatory logic ensuring 100% adherence to global standards." }
            ]
        },
        Agents: {
            title: "Strategic Asset Deployment",
            description: "Empower your field operators with high-fidelity tools. Rapid policy initialization and decentralized client management for elite hunters.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072",
            features: [
                { icon: Target, title: "Client Acquisition Matrix", desc: "Deep analytics on prospect behavior and automated conversion pipelines." },
                { icon: Zap, title: "Zero-Latency Quoting", desc: "Initialize complex policy configurations and delivery in milliseconds." },
                { icon: Activity, title: "Yield Performance", desc: "Precision tracking of commission algorithms and vector-based growth." }
            ]
        },
        Customers: {
            title: "The Secure Safehouse",
            description: "Unrivaled transparency for the modern asset owner. Manage your protection portfolio via encrypted channels with prioritized support.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2026",
            features: [
                { icon: ShieldPlus, title: "Asset Documentation", desc: "Encrypted access to all safeguard protocols and manuscript policies." },
                { icon: Clock, title: "Rapid Incident Response", desc: "Submit and synchronize claims with priority settlement windows." },
                { icon: Headphones, title: "Elite Comms Relay", desc: "Direct uplink to specialist responding officers for 24/7 tactical support." }
            ]
        }
    };

    return (
        <div className="relative min-h-screen bg-white dark:bg-[#10221c] text-foreground overflow-x-hidden selection:bg-primary/30">
            <AnimatedBackground>
            {/* Nav Protocol */}
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${mobileMenuOpen ? 'bg-white dark:bg-[#10221c]' : 'bg-transparent backdrop-blur-xl border-b border-border/10 h-24 flex items-center shadow-lg'}`}>
                <div className="max-w-[1400px] mx-auto w-full px-8 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-5 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-60 transition-all duration-500 scale-150" />
                            <div className="relative bg-zinc-900 dark:bg-zinc-800 p-2.5 rounded-2xl shadow-xl border border-white/10 group-hover:rotate-[360deg] transition-all duration-1000">
                                <Shield className="w-6 h-6 text-primary" strokeWidth={3} />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none">SECURE<span className="text-primary italic-none not-italic">SHIELD</span></h2>
                            <span className="text-[9px] font-black uppercase tracking-[3px] opacity-20 mt-1 italic">Orbital Protection</span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-14 text-[11px] font-black uppercase tracking-[4px] opacity-40 italic">
                        <a href="#solutions" className="hover:text-primary hover:opacity-100 transition-all">PROTOCOLS</a>
                        <a href="#roles" className="hover:text-primary hover:opacity-100 transition-all">SECTORS</a>
                        <a href="#features" className="hover:text-primary hover:opacity-100 transition-all">BLUEPRINTS</a>
                        <a href="#networks" className="hover:text-primary hover:opacity-100 transition-all">NETWORK</a>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-[4px] opacity-40 hover:opacity-100 hover:text-primary transition-all italic">AUTHENTICATE</Link>
                        <Link to="/register" className="h-14 px-10 bg-primary hover:bg-zinc-900 dark:hover:bg-zinc-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-[4px] transition-all shadow-[0_20px_40px_-5px_rgba(255,184,0,0.3)] flex items-center justify-center active:scale-95 italic">
                            ENLIST NOW
                        </Link>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 bg-zinc-100 dark:bg-white/5 rounded-2xl border border-border">
                            <Menu size={24} className="text-primary" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Alpha Section */}
            <section className="relative pt-48 pb-40 px-8 overflow-hidden min-h-screen flex items-center justify-center">
                {/* Orbital Atmosphere */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
                    <HeroScene />
                </div>
                
                <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10 w-full">
                    <div className="text-left flex flex-col items-start">
                        <Reveal direction="down">
                            <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-zinc-900 dark:bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[5px] text-white italic mb-10 shadow-2xl">
                                <Activity className="w-4 h-4 text-primary animate-pulse" strokeWidth={3} />
                                LINK_ESTABLISHED // GLOBAL_HUB_v4.2
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.2}>
                            <h1 className="text-6xl md:text-[90px] font-black mb-12 leading-[0.95] tracking-[-0.05em] uppercase italic">
                                UNCOMPROMISED <br />
                                <span className="text-primary not-italic tracking-normal">PROTECTION</span> <br />
                                <span className="text-foreground opacity-20">PROTOCOLS_</span>
                            </h1>
                        </Reveal>

                        <Reveal direction="left" delay={0.3}>
                            <p className="text-lg opacity-40 mb-16 max-w-[550px] font-black uppercase tracking-widest leading-relaxed italic ml-1">
                                [MANIFEST]: EXPERIENCING THE HIGHEST FIDELITY INSURANCE INFRASTRUCTURE. SECURE. EFFICIENT. ARCHITECTED FOR THE GLOBAL ELITE.
                            </p>
                        </Reveal>

                        <Reveal direction="up" delay={0.4}>
                            <div className="flex flex-wrap gap-8">
                                <Link to="/register" className="h-20 px-14 bg-accent text-white rounded-[2rem] shadow-2xl shadow-accent/40 hover:translate-y-[-5px] transition-all font-black text-xs uppercase tracking-[5px] flex items-center justify-center gap-6 group italic">
                                    ENLIST OPERATOR
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" strokeWidth={3} />
                                </Link>
                                <button className="h-20 px-10 bg-white dark:bg-zinc-800 border border-border hover:border-primary/50 text-foreground font-black text-xs uppercase tracking-[5px] rounded-[2rem] hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all active:scale-95 italic">
                                    COMMS RELAY
                                </button>
                            </div>
                        </Reveal>

                        <div className="mt-20 flex items-center gap-12 opacity-10">
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[4px]">Verified</span>
                                <ShieldCheck size={32} />
                             </div>
                             <div className="w-px h-12 bg-foreground" />
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[4px]">Encrypted</span>
                                <Fingerprint size={32} />
                             </div>
                             <div className="w-px h-12 bg-foreground" />
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[4px]">Global Reach</span>
                                <Globe size={32} />
                             </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <Reveal direction="right" delay={0.5}>
                             <div className="relative w-full aspect-square max-w-[650px] mx-auto">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[150px] opacity-40 animate-pulse-slow shadow-[0_0_200px_#0165FF]" />
                                <div className="absolute inset-0 bg-accent/10 rounded-full blur-[100px] opacity-20 bottom-[-20%] right-[-20%] animate-pulse" />
                                
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                    className="relative w-full h-full rounded-full border border-primary/20 p-20 flex items-center justify-center backdrop-blur-3xl z-10"
                                >
                                    <div className="absolute inset-0 border-[2px] border-dashed border-primary/10 rounded-full animate-[spin_40s_linear_infinite]" />
                                    <div className="absolute inset-10 border border-primary/30 rounded-full opacity-20 border-t-transparent border-l-transparent animate-[spin_20s_linear_infinite_reverse]" />
                                    
                                    <div className="relative w-full h-full rounded-full bg-zinc-900 shadow-[0_0_100px_rgba(1,101,255,0.2)] flex items-center justify-center overflow-hidden border border-white/5">
                                         <div className="absolute inset-0 opacity-10">
                                            <Compass className="w-full h-full p-20 animate-spin-slow" />
                                         </div>
                                         <ShieldCheck className="w-40 h-40 text-primary drop-shadow-[0_0_50px_rgba(1,101,255,0.6)]" strokeWidth={1} />
                                    </div>

                                    {/* HUD Nodes */}
                                    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-10 left-1/4 p-6 bg-white dark:bg-zinc-800 border-2 border-primary/40 rounded-3xl shadow-2xl flex flex-col items-center">
                                         <Zap size={24} className="text-primary mb-2" strokeWidth={3} />
                                         <span className="text-[8px] font-black uppercase tracking-[2px]">Core Integrity</span>
                                    </motion.div>
                                    <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-10 right-1/4 p-6 bg-white dark:bg-zinc-800 border-2 border-accent/40 rounded-3xl shadow-2xl flex flex-col items-center">
                                         <LineChart size={24} className="text-accent mb-2" strokeWidth={3} />
                                         <span className="text-[8px] font-black uppercase tracking-[2px]">Yield Vector</span>
                                    </motion.div>
                                </motion.div>
                             </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Sector Blueprints Section */}
            <section id="roles" className="py-40 bg-zinc-50 dark:bg-transparent border-y border-border/5 px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                    <Compass size={400} className="animate-spin-slow" />
                </div>
                
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <Reveal direction="down">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[8px] italic mb-6 block">DEPLOYMENT_MAP</span>
                            <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter uppercase italic">CUSTOM SECTOR <span className="text-primary">SOLUTIONS</span></h2>
                            <p className="opacity-40 max-w-2xl mx-auto font-black uppercase tracking-[3px] italic leading-relaxed text-xs">A unified ecosystem architected for localized operational dominance across all stakeholders.</p>
                        </Reveal>
                    </div>

                    <div className="flex justify-center mb-24">
                        <div className="inline-flex p-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-border shadow-xl">
                            {Object.keys(roleContent).map((role) => (
                                <button 
                                    key={role}
                                    onClick={() => setActiveRole(role)}
                                    className={`px-12 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[4px] transition-all duration-500 italic ${activeRole === role ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-105" : "text-zinc-400 hover:text-primary"}`}
                                >
                                    {role.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeRole}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="grid lg:grid-cols-2 gap-20 items-center p-12 bg-white dark:bg-zinc-900 border border-border rounded-[4rem] shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 p-12 opacity-5 pointer-events-none">
                                <Cpu size={200} />
                            </div>
                            
                            <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl border-4 border-white/10">
                                <div className="absolute inset-0 bg-primary/30 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
                                <img 
                                    src={roleContent[activeRole].image} 
                                    alt={activeRole} 
                                    className="w-full aspect-[4/3] object-cover hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10 flex items-center gap-4">
                                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#FF5A00]" />
                                     <span className="text-[9px] font-black text-white uppercase tracking-[3px] italic">Operation: {activeRole.toUpperCase()}_SECTOR</span>
                                </div>
                            </div>

                            <div className="space-y-12 pr-10">
                                <div className="flex items-center gap-4 opacity-30 mb-2">
                                    <div className="w-12 h-[2px] bg-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-[5px] italic">Blueprint v4.0.1</span>
                                </div>
                                <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">{roleContent[activeRole].title}</h3>
                                <p className="text-sm opacity-40 leading-relaxed font-black uppercase tracking-[3px] italic">{roleContent[activeRole].description}</p>
                                
                                <div className="space-y-10">
                                    {roleContent[activeRole].features.map((feat, idx) => (
                                        <div key={idx} className="flex gap-8 group">
                                            <div className="flex-shrink-0 w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/20">
                                                <feat.icon size={28} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xl mb-2 uppercase italic tracking-tighter group-hover:text-primary transition-colors">{feat.title}</h4>
                                                <p className="opacity-40 font-bold text-xs uppercase tracking-widest">{feat.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Tactical Parameter Grid */}
            <section id="features" className="py-40 px-8 relative overflow-hidden bg-white dark:bg-[#0c1a15]">
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-32">
                        <div className="max-w-3xl">
                            <Reveal direction="left">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[8px] italic mb-6 block">SYSTEM_PARAMETERS</span>
                                <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter uppercase italic">RESILIENCE <span className="text-primary italic-none not-italic px-4">BY_DESIGN_</span></h2>
                                <p className="opacity-40 text-sm font-black uppercase tracking-[3px] italic leading-relaxed">Every operational vector is built with a security-first mindset, Ensuring data integrity and institutional trust is unbreakable across the universal fabric.</p>
                            </Reveal>
                        </div>
                        <Reveal direction="right">
                             <div className="flex flex-col items-center gap-6">
                                <div className="flex -space-x-4">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-[#0c1a15] bg-zinc-100 dark:bg-zinc-800" />
                                    ))}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[3px] opacity-30 italic">Trusted by 25k+ Elite Operators</span>
                             </div>
                        </Reveal>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            { icon: Lock, title: "AES_ENCRYPTION_v2", desc: "Top-tier manuscript encryption protocols for all high-value data at rest and in orbital transit." },
                            { icon: Fingerprint, title: "BIOMETRIC_VALUATION", desc: "Adaptive identity safeguards that secure access without compromising operator deployment velocity." },
                            { icon: Activity, title: "LIVE_AUDIT_SURVEILLANCE", desc: "Immutable mission logs of every operational vector for complete institutional transparency." },
                            { icon: Zap, title: "ULTRA_LOW_LATENCY", desc: "Orbital performance optimization for global units, ensuring platforms outpace market vectors." },
                            { icon: Globe, title: "GRID_INTEGRATION", desc: "Seamlessly uplink with legacy CRM, ERP, and payment gates through decentralized API nodes." },
                            { icon: Satellite, title: "CONCIERGE_TACTICAL", desc: "Priority technical support and dedicated station commanders for premium enterprise partners." }
                        ].map((feat, idx) => (
                            <Reveal key={idx} delay={idx * 0.1} direction="up">
                                <div className="p-12 rounded-[3.5rem] bg-zinc-50 dark:bg-white/[0.02] border border-border/50 hover:border-primary/50 transition-all group hover:bg-white dark:hover:bg-zinc-900 shadow-sm hover:shadow-2xl">
                                    <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                        <feat.icon size={28} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter italic">{feat.title}</h3>
                                    <p className="opacity-40 font-bold text-xs uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Yield Section */}
            <section className="py-40 bg-white dark:bg-[#10221c] px-8 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-[500px] bg-primary/5 blur-[150px] pointer-events-none" />
                
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-32 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="aspect-square bg-zinc-900 dark:bg-white/5 rounded-[4rem] flex flex-col items-center justify-center overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative group">
                                <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <Globe className="w-full h-full p-20 animate-spin-slow" />
                                </div>
                                <div className="relative z-10 text-center space-y-12">
                                     <Satellite size={100} className="mx-auto text-primary animate-pulse" />
                                     <div>
                                        <p className="text-[11px] font-black text-white/40 uppercase tracking-[10px] mb-4">Establishing Uplink</p>
                                        <div className="flex gap-2 justify-center">
                                            {[1,2,3,4,5,6].map(i => (
                                                <div key={i} className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                            ))}
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <Reveal direction="right">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[8px] italic mb-6 block">GLOBAL_STRENGTH</span>
                                <h2 className="text-5xl lg:text-7xl font-black mb-16 text-foreground tracking-tighter uppercase italic leading-[0.9]">ELITE_FORCE <br/><span className="text-primary italic-none not-italic">COMMAND_LEVEL</span></h2>
                                <div className="grid grid-cols-2 gap-16">
                                    {[
                                        { val: "99.9%", label: "SYNC_UPTIME" },
                                        { val: "20B+", label: "PROTECTED_YIELD" },
                                        { val: "50+", label: "ACTIVE_SECTORS" },
                                        { val: "24/7", label: "SURVEILLANCE" }
                                    ].map((stat, i) => (
                                        <div key={i} className="group hover:translate-x-3 transition-transform">
                                            <p className="text-5xl md:text-6xl font-black text-foreground mb-4 italic tracking-tighter group-hover:text-primary transition-colors leading-none">{stat.val}</p>
                                            <div className="flex items-center gap-3">
                                                 <div className="w-8 h-[2px] bg-primary group-hover:w-12 transition-all" />
                                                 <p className="opacity-40 font-black uppercase tracking-[3px] text-[10px]">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic Initialization Footer */}
            <section className="py-40 px-8">
                <div className="max-w-[1200px] mx-auto bg-zinc-900 dark:bg-zinc-800 text-white p-20 md:p-32 rounded-[5rem] text-center relative overflow-hidden border border-white/10 shadow-[0_100px_100px_-50px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 bg-primary/10 animate-pulse-slow pointer-events-none backdrop-blur-3xl" />
                    <div className="absolute top-0 left-0 p-16 opacity-5 pointer-events-none">
                        <Lock size={300} className="rotate-12" />
                    </div>
                    
                    <Reveal direction="down">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[15px] mb-8 block ml-3 italic">FINAL_CLEARANCE_REQUIRED</span>
                        <h2 className="text-5xl md:text-8xl font-black mb-16 leading-[0.9] tracking-tighter uppercase italic">READY_TO_JOIN <br /><span className="text-primary italic-none not-italic">THE_ELITE?</span></h2>
                    </Reveal>
                    
                    <Reveal direction="up" delay={0.2}>
                        <Link to="/register" className="h-24 px-20 bg-primary text-white rounded-[2.5rem] text-xl font-black inline-flex items-center gap-6 transition-all transform hover:scale-110 active:scale-95 shadow-2xl shadow-primary/40 italic tracking-[5px] group">
                            INITIALIZE ENLISTMENT 
                            <Target className="w-8 h-8 group-hover:rotate-180 transition-transform duration-1000" strokeWidth={3} />
                        </Link>
                    </Reveal>
                    
                    <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 italic">
                        {["SECURE_TUNNEL", "FAST_SYNC", "ELITE_STATUS"].map(w => (
                            <div key={w} className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-white rounded-full" />
                                <span className="text-[11px] font-black uppercase tracking-[5px]">{w}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Terminal Footer */}
            <footer className="pt-40 pb-20 border-t border-border/10 bg-white dark:bg-[#0c1a15] px-8 relative overflow-hidden">
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-20 mb-32">
                        <div className="col-span-1 lg:col-span-2">
                            <div className="flex items-center gap-5 mb-10 group">
                                <div className="bg-primary p-2 rounded-2xl shadow-xl shadow-primary/20 group-hover:rotate-[360deg] transition-all duration-1000">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">SECURE<span className="text-primary italic-none not-italic">SHIELD</span></h2>
                            </div>
                            <p className="opacity-40 max-w-sm mb-12 font-black uppercase tracking-[3px] italic leading-relaxed text-xs">The most trusted manuscript in high-end insurance infrastructure. Decentralized protection architected for the generational elite.</p>
                            <div className="flex gap-6">
                                {[Fingerprint, Globe, Satellite, Target].map((Icon, i) => (
                                    <div key={i} className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-border flex items-center justify-center hover:bg-primary transition-all cursor-pointer group shadow-sm">
                                        <Icon size={24} className="text-zinc-400 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {["PROTOCOLS", "SECTORS", "RESOURCES", "COMMAND"].map((col) => (
                            <div key={col}>
                                <h4 className="font-black mb-10 text-foreground uppercase tracking-[5px] text-[10px] flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full" /> {col}
                                </h4>
                                <ul className="space-y-6 opacity-40 text-[10px] font-black uppercase tracking-[3px] italic">
                                    <li><a href="#" className="hover:text-primary hover:opacity-100 transition-all">Satellite Link 01</a></li>
                                    <li><a href="#" className="hover:text-primary hover:opacity-100 transition-all">Central Hub v4</a></li>
                                    <li><a href="#" className="hover:text-primary hover:opacity-100 transition-all">Asset Manifest</a></li>
                                </ul>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-16 border-t border-border/10 opacity-30 text-[9px] font-black uppercase tracking-[5px] italic">
                        <p>© 2026 SECURE SHIELD TECHNOLOGIES INC. MANIFEST [44.1.9]</p>
                        <div className="flex gap-16">
                            <p className="flex items-center gap-4 text-emerald-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span> SYSTEMS_OPTIMAL [ACTIVE]</p>
                            <p>SECURE_STATION // SILICON_VALLEY_CA</p>
                        </div>
                    </div>
                </div>
            </footer>
        </AnimatedBackground>
    </div>
);
};

export default Home;
