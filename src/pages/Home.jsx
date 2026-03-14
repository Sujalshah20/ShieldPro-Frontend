import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, ChevronRight, Star, CheckCircle2, Clock, 
    ShieldCheck, ArrowRight, User, Activity, Key, 
    Lock, Zap, Globe, Scale, Fingerprint, Headphones,
    LayoutDashboard, LineChart, ShieldPlus, Target,
    Compass, Satellite, Cpu, IndianRupee, Menu, SupportAgent, Speed, Language
} from "lucide-react";
import Reveal from "../components/common/Reveal";
import AnimatedBackground from "../components/common/AnimatedBackground";
// Note: Keeping HeroScene as it adds to premium feel, but will theme it
import HeroScene from "../components/3d/HeroScene";

const Home = () => {
    const [activeRole, setActiveRole] = useState("Admins");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const roleContent = {
        Admins: {
            title: "Executive Governance Console",
            description: "High-tier oversight for comprehensive insurance oversight. Control platform parameters and global compliance protocols with absolute precision.",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
            features: [
                { icon: LayoutDashboard, title: "Risk Management Matrix", desc: "Orchestrate multi-tenant insurance assets and policy lifecycles from a unified command center." },
                { icon: ShieldPlus, title: "Compliance Oversight", desc: "Automated regulatory adherence and predictive risk modeling for enterprise-grade decisions." },
                { icon: Cpu, title: "Operational Intelligence", desc: "Harness AI-driven analytics to optimize loss ratios and premium growth across sectors." }
            ]
        },
        Agents: {
            title: "Professional Broker Suites",
            description: "Advanced instrumental tools for top-performing insurance professionals. Rapid client synchronization and policy calibration for high-stakes agents.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072",
            features: [
                { icon: Target, title: "Precision Client Routing", desc: "Intelligent lead prioritization and deep-tier risk profiling for discerning clients." },
                { icon: Zap, title: "Instant Underwriting", desc: "Generate complex coverage estimates and policy manifests in high-frequency windows." },
                { icon: Activity, title: "Yield Performance", desc: "Live tracking of commission vectors and agency growth metrics in real-time." }
            ]
        },
        Customers: {
            title: "Premium Protection Portal",
            description: "Transparent coverage management for the modern world. Manage your comprehensive insurance portfolio with absolute priority and security.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2026",
            features: [
                { icon: ShieldPlus, title: "Digital Asset Vault", desc: "Immediate access to all coverage certificates, policy terms, and regulatory documentation." },
                { icon: Clock, title: "Expedited Claims Concierge", desc: "Initiate and track settlements through a white-glove priority channel with 24/7 status." },
                { icon: Headphones, title: "Specialist Support", desc: "Direct uplink to dedicated insurance experts for immediate resolution of complex queries." }
            ]
        }
    };

    return (
        <div className="relative min-h-screen bg-background-main text-slate-900 overflow-x-hidden selection:bg-primary/30 font-display">
            <AnimatedBackground>
            {/* Global Header Protocol */}
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${mobileMenuOpen ? 'bg-header-bg' : 'bg-header-bg/95 backdrop-blur-xl border-b border-white/5 h-24 flex items-center shadow-2xl'}`}>
                <div className="max-w-[1440px] mx-auto w-full px-8 lg:px-12 flex justify-between items-center text-white">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary blur-xl opacity-40 group-hover:opacity-80 transition-all duration-500 scale-125" />
                            <div className="relative bg-primary p-2.5 rounded-xl shadow-xl group-hover:rotate-[360deg] transition-all duration-1000">
                                <Shield className="w-6 h-6 text-white" strokeWidth={3} />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black tracking-tight uppercase leading-none">SECURE<span className="text-primary italic-none ml-1">SHIELD</span></h2>
                            <span className="text-[9px] font-black uppercase tracking-[3px] opacity-40 mt-1 italic">Premium Insurance Hub</span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[4px] opacity-60">
                        <a href="#features" className="hover:text-primary transition-colors">CAPABILITIES</a>
                        <a href="#solutions" className="hover:text-primary transition-colors">SOLUTIONS</a>
                        <a href="#sectors" className="hover:text-primary transition-colors">SECTORS</a>
                        <a href="#pricing" className="hover:text-primary transition-colors">PRICING</a>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-[4px] opacity-60 hover:text-primary transition-all">LOGIN</Link>
                        <Link to="/register" className="h-14 px-10 bg-primary hover:bg-white hover:text-header-bg text-white rounded-xl text-[11px] font-black uppercase tracking-[4px] transition-all shadow-xl shadow-primary/20 flex items-center justify-center active:scale-95">
                            GET STARTED
                        </Link>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 bg-white/10 rounded-xl border border-white/10">
                            <Menu size={24} className="text-white" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section — Digital & Physical Assets */}
            <section className="relative pt-48 pb-40 px-8 overflow-hidden min-h-[90vh] flex items-center justify-center">
                {/* Orbital Atmosphere */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <HeroScene />
                </div>
                
                <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10 w-full">
                    <div className="text-left flex flex-col items-start px-2 lg:px-6">
                        <Reveal direction="down">
                            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-header-bg border border-white/10 text-[10px] font-black uppercase tracking-[6px] text-white italic mb-10 shadow-2xl">
                                <Activity className="w-4 h-4 text-primary animate-pulse" strokeWidth={3} />
                                DEPLOYED // PROTECTION_PROTOCOL_ACTIVE
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.2}>
                            <h1 className="text-6xl md:text-[88px] font-black mb-12 leading-[1.0] tracking-tighter uppercase text-slate-900">
                                UNCOMPROMISING <br />
                                <span className="text-primary tracking-normal">PROTECTION</span> <br />
                                <span className="text-slate-400 opacity-60">FOR_YOUR_ASSETS</span>
                            </h1>
                        </Reveal>

                        <Reveal direction="left" delay={0.3}>
                            <p className="text-lg text-slate-600 mb-16 max-w-[600px] font-semibold leading-relaxed">
                                Experience bespoke insurance solutions designed for the modern world. Our comprehensive coverage ensures your most valuable digital and physical assets remain protected.
                            </p>
                        </Reveal>

                        <Reveal direction="up" delay={0.4}>
                            <div className="flex flex-wrap gap-8">
                                <Link to="/register" className="h-20 px-14 bg-primary text-white rounded-xl shadow-2xl shadow-primary/30 hover:translate-y-[-5px] transition-all font-black text-xs uppercase tracking-[5px] flex items-center justify-center gap-6 group">
                                    START FREE TRIAL
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" strokeWidth={3} />
                                </Link>
                                <button className="h-20 px-10 bg-white border border-slate-200 hover:border-primary text-header-bg font-black text-xs uppercase tracking-[5px] rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-lg">
                                    VIEW DEMO
                                </button>
                            </div>
                        </Reveal>
                    </div>

                    <div className="relative hidden lg:block">
                        <Reveal direction="right" delay={0.5}>
                             <div className="relative w-full aspect-square max-w-[650px] mx-auto">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[150px] opacity-40 animate-pulse-slow" />
                                
                                <motion.div 
                                    className="relative w-full h-full rounded-[4rem] bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center p-12 backdrop-blur-3xl z-10"
                                >
                                    <div className="w-full h-full rounded-[3rem] bg-white shadow-2xl relative overflow-hidden group">
                                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000" />
                                         <div className="absolute inset-0 bg-header-bg/60 mix-blend-multiply transition-opacity group-hover:opacity-40" />
                                         <div className="relative h-full flex items-center justify-center p-20 border-[20px] border-white/20 rounded-[3rem]">
                                              <ShieldCheck className="w-48 h-48 text-white drop-shadow-2xl" strokeWidth={1} />
                                         </div>
                                    </div>

                                    {/* Orbital Nodes */}
                                    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 left-1/4 p-6 bg-white border border-slate-100 rounded-2xl shadow-3xl flex flex-col items-center">
                                         <Lock size={28} className="text-primary mb-2" strokeWidth={3} />
                                         <span className="text-[9px] font-black uppercase tracking-[3px] text-slate-400">ENCRYPTED</span>
                                    </motion.div>
                                    <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-6 right-1/4 p-6 bg-white border border-slate-100 rounded-2xl shadow-3xl flex flex-col items-center">
                                         <Activity size={28} className="text-primary mb-2" strokeWidth={3} />
                                         <span className="text-[9px] font-black uppercase tracking-[3px] text-slate-400">MONITORED</span>
                                    </motion.div>
                                </motion.div>
                             </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Risk Management Banner Section */}
            <section className="bg-white/80 py-32 border-y border-slate-100">
                <div className="max-w-[1440px] mx-auto px-8 lg:px-12 text-center">
                    <Reveal direction="down">
                        <h2 className="text-4xl lg:text-5xl font-black text-header-bg mb-6 tracking-tight">Comprehensive Risk Management</h2>
                        <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-10 shadow-lg shadow-primary/20"></div>
                        <p className="text-slate-600 text-xl max-w-4xl mx-auto font-medium leading-relaxed">
                            Our framework is built on decades of actuarial expertise to mitigate evolving risks and ensure financial stability for your estate. We don't just insure; we provide absolute peace of mind through bespoke intelligence.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Premium Benefits Grid Section */}
            <section id="features" className="py-40 px-8 relative overflow-hidden bg-background-main">
                <div className="max-w-[1440px] mx-auto relative z-10">
                    <div className="flex flex-col gap-6 mb-24">
                        <Reveal direction="left">
                            <h3 className="text-primary font-black tracking-[8px] uppercase text-xs mb-4">CAPABILITIES</h3>
                            <h2 className="text-5xl lg:text-7xl font-black text-header-bg tracking-tighter uppercase mb-6">PREMIUM_INSURANCE_BENEFITS</h2>
                            <p className="text-slate-600 text-lg font-semibold max-w-2xl">Bespoke coverage options tailored to safeguard your lifestyle and global interests.</p>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: Zap, title: "Instant Quote Generation", desc: "Get tailored premium estimates in seconds using our AI-driven underwriting engine.", highlight: "AI_POWERED" },
                            { icon: Headphones, title: "24/7 Concierge Claims", desc: "Experience white-glove service with dedicated claims specialists available around the clock.", highlight: "GLOBAL_SUPPORT" },
                            { icon: Globe, title: "Global Coverage Network", desc: "Unmatched protection that follows you anywhere in the world, backed by top-tier partners.", highlight: "UNIVERSAL" }
                        ].map((feat, idx) => (
                            <Reveal key={idx} delay={idx * 0.1} direction="up">
                                <div className="group bg-white p-12 rounded-3xl border border-slate-100 shadow-xl shadow-accent-shadow/20 hover:-translate-y-3 transition-all duration-500 hover:shadow-2xl">
                                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary transition-all shadow-sm">
                                        <feat.icon size={36} className="text-primary group-hover:text-white" strokeWidth={3} />
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-[4px]">{feat.highlight}</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-header-bg mb-6 tracking-tight uppercase leading-none">{feat.title}</h4>
                                    <p className="text-slate-500 font-semibold leading-relaxed">{feat.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advanced Solutions Architecture (Sectors) */}
            <section id="sectors" className="py-40 bg-zinc-950 px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none text-white">
                    <ShieldCheck size={400} />
                </div>
                
                <div className="max-w-[1440px] mx-auto relative z-10 w-full">
                    <div className="text-center mb-32">
                        <Reveal direction="down">
                            <span className="text-[11px] font-black text-primary uppercase tracking-[12px] mb-8 block">ARCHITECTURE_SOLUTIONS</span>
                            <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white uppercase leading-none">SECTOR_SPECIFIC <span className="text-primary tracking-normal">LOGIC</span></h2>
                            <p className="text-slate-400 max-w-3xl mx-auto font-semibold uppercase tracking-[2px] leading-relaxed text-sm">Professional frameworks tailored for total mission readiness across all user tiers.</p>
                        </Reveal>
                    </div>

                    <div className="flex justify-center mb-32">
                        <div className="inline-flex p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
                            {Object.keys(roleContent).map((role) => (
                                <button 
                                    key={role}
                                    onClick={() => setActiveRole(role)}
                                    className={`px-14 py-6 rounded-xl text-[11px] font-black uppercase tracking-[5px] transition-all duration-500 ${activeRole === role ? "bg-primary text-white shadow-2xl shadow-primary/40 scale-105" : "text-slate-500 hover:text-white"}`}
                                >
                                    {role.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeRole}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="grid lg:grid-cols-2 gap-24 items-center p-16 bg-white rounded-[4rem] shadow-2xl relative overflow-hidden"
                        >
                            <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl border-8 border-slate-50">
                                <img 
                                    src={roleContent[activeRole].image} 
                                    alt={roleContent[activeRole].title} 
                                    className="w-full aspect-[4/3] object-cover hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-header-bg/40 mix-blend-multiply group-hover:opacity-0 transition-opacity" />
                                <div className="absolute bottom-10 left-10 flex items-center gap-4 bg-header-bg/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                                     <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#007ea8]" />
                                     <span className="text-[10px] font-black text-white uppercase tracking-[4px]">SECTOR: {activeRole.toUpperCase()}_BLUEPRINT</span>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="flex items-center gap-6 opacity-20">
                                    <div className="w-16 h-[2px] bg-header-bg" />
                                    <span className="text-[11px] font-black uppercase tracking-[6px]">V_MODEL_8.1.4</span>
                                </div>
                                <h3 className="text-6xl font-black tracking-tighter uppercase text-header-bg leading-[0.9]">{roleContent[activeRole].title}</h3>
                                <p className="text-lg text-slate-500 font-bold leading-relaxed">{roleContent[activeRole].description}</p>
                                
                                <div className="space-y-12 pt-4">
                                    {roleContent[activeRole].features.map((feat, idx) => (
                                        <div key={idx} className="flex gap-10 group items-start">
                                            <div className="flex-shrink-0 w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-header-bg group-hover:text-white transition-all shadow-md">
                                                <feat.icon size={32} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-2xl mb-3 uppercase tracking-tight text-header-bg group-hover:text-primary transition-colors">{feat.title}</h4>
                                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Secure CTA Protocol */}
            <section className="py-48 px-8 bg-header-bg relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[200px] animate-pulse" />
                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <Reveal direction="down">
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tight uppercase leading-none">Ready to secure your future?</h2>
                        <p className="text-slate-300 text-xl font-medium mb-16 max-w-3xl mx-auto">
                            Join over 5,000 discerning policyholders who trust SECURE SHIELD for their personalized protection and global asset management needs.
                        </p>
                    </Reveal>
                    
                    <Reveal direction="up" delay={0.2}>
                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                            <Link to="/register" className="h-24 px-16 bg-primary text-white rounded-2xl text-xl font-black inline-flex items-center gap-6 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40 tracking-[5px]">
                                GET STARTED NOW 
                                <ArrowRight className="w-8 h-8" strokeWidth={3} />
                            </Link>
                            <button className="h-24 px-12 bg-transparent text-white border-2 border-white/20 rounded-2xl text-xl font-black hover:bg-white/5 transition-all tracking-[5px]">
                                SPEAK TO SALES
                            </button>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Professional Footer Matrix */}
            <footer className="bg-header-bg text-slate-400 py-32 border-t border-white/10 px-8">
                <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16 lg:gap-24 mb-32">
                    <div className="col-span-2 space-y-10">
                        <div className="flex items-center gap-4 text-white group">
                            <div className="bg-primary p-2 rounded-xl group-hover:rotate-[360deg] transition-all duration-1000">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight uppercase">SECURE<span className="text-primary ml-1">SHIELD</span></h2>
                        </div>
                        <p className="text-sm font-semibold leading-relaxed max-w-xs uppercase tracking-wider opacity-60">The world's premier insurance partner for high-net-worth individuals and global strategic enterprises.</p>
                        <div className="flex gap-6">
                            {[Language, Globe, Activity].map((Icon, i) => (
                                <div key={i} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all cursor-pointer group border border-white/5">
                                    <Icon size={24} className="text-white/40 group-hover:text-white" />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {[
                        { title: "Product", links: ["Features", "Pricing", "Security", "Roadmap"] },
                        { title: "Company", links: ["About Us", "Insights", "Operations", "Sectors"] },
                        { title: "Protocol", links: ["Documentation", "Help Hub", "API Terminal", "Network Log"] },
                        { title: "Legal", links: ["Privacy Grid", "Terms Vector", "Compliance", "Licensing"] }
                    ].map((col) => (
                        <div key={col.title}>
                            <h4 className="text-white font-black uppercase tracking-[5px] text-[10px] mb-10">{col.title}</h4>
                            <ul className="space-y-6 text-sm font-semibold">
                                {col.links.map(link => (
                                    <li key={link}><a className="hover:text-primary transition-all uppercase tracking-[2px] text-[11px]" href="#">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                <div className="max-w-[1440px] mx-auto pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 text-[10px] font-black uppercase tracking-[4px]">
                    <p>© 2026 SECURE SHIELD INC. VERSION_X.4.2</p>
                    <p className="italic">DESIGNED FOR ABSOLUTE RESILIENCE AND UNCOMPROMISING SAFETY.</p>
                </div>
            </footer>
            </AnimatedBackground>
        </div>
    );
};

export default Home;
