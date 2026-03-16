import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, CheckCircle2, Clock, 
    ShieldCheck, ArrowRight, Activity, 
    Lock, Zap, Globe, Headphones,
    LayoutDashboard, ShieldPlus, Target,
    Cpu, Menu, Languages
} from "lucide-react";
import Reveal from "../components/common/Reveal";

const Home = () => {
    return (
        <div className="relative min-h-screen bg-[#f8fafc] text-[#003249] selection:bg-[#007ea7]/20 font-display">
            {/* SaaS Header */}
            <nav className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-[#ccdbdc]/30 h-16 flex items-center shadow-sm">
                <div className="saas-container w-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-[#007ea7] p-2 rounded-lg transition-transform group-hover:scale-110">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-[#003249]">ShieldPro</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold tracking-tight text-[#003249]/70">
                        <a href="#features" className="hover:text-[#007ea7] transition-colors">Platform</a>
                        <a href="#solutions" className="hover:text-[#007ea7] transition-colors">Solutions</a>
                        <a href="#pricing" className="hover:text-[#007ea7] transition-colors">Resources</a>
                        <a href="#contact" className="hover:text-[#007ea7] transition-colors">Enterprise</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-[13px] font-semibold text-[#003249]/70 hover:text-[#007ea7] transition-colors">Sign in</Link>
                        <Link to="/register" className="btn btn-primary px-5 py-2">
                            Start for free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden">
                <div className="saas-container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <Reveal direction="down">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccdbdc]/30 border border-[#9ad1d4]/50 mb-6">
                                    <span className="w-2 h-2 rounded-full bg-[#007ea7] animate-pulse" />
                                    <span className="text-[11px] font-bold text-[#007ea7] uppercase tracking-widest">v2.0 Architecture Live</span>
                                </div>
                                <h1>Secure your insurance assets with confidence.</h1>
                                <p className="text-lg mb-8 max-w-lg">
                                    ShieldPro provides the infrastructure to manage global policy lifecycles with industry-leading zero-trust architecture. Built for resilience and speed.
                                </p>
                            </Reveal>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/register" className="btn btn-primary px-8 py-4 shadow-lg shadow-[#007ea7]/20">
                                    Create Free Account
                                </Link>
                                <button className="btn btn-ghost px-8 py-4 bg-white shadow-sm border border-[#ccdbdc]">
                                    Request Demo
                                </button>
                            </div>
                        </div>
                        
                        <div className="relative lg:ml-10">
                            <Reveal direction="right">
                                <div className="saas-image-container aspect-video shadow-2xl border border-white/50 bg-[#003249]/5 p-2">
                                    <img 
                                        src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=2070" 
                                        alt="Dashboard Analytics Preview" 
                                        className="rounded-lg shadow-inner"
                                    />
                                    <div className="absolute inset-0 bg-[#007ea7]/5 pointer-events-none" />
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-[#ccdbdc]/50 hidden md:block">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#ccdbdc] flex items-center justify-center text-[#007ea7]">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#003249] uppercase">SOC2 Compliance</p>
                                            <p className="text-[10px] text-emerald-500 font-bold">Verified Sector-7</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By (Mini) */}
            <section className="py-12 border-y border-[#ccdbdc]/30 bg-white/50">
                <div className="saas-container">
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#003249]/40 mb-8">Powering modern insurance platforms</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 grayscale opacity-40">
                         {/* Placeholder for logos */}
                         <div className="text-xl font-bold tracking-tighter">Vercel</div>
                         <div className="text-xl font-bold tracking-tighter">Stripe</div>
                         <div className="text-xl font-bold tracking-tighter">Notion</div>
                         <div className="text-xl font-bold tracking-tighter">Linear</div>
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section id="features" className="py-24 bg-white">
                <div className="saas-container">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <Reveal direction="up">
                            <h2 className="mb-4">Designed for high-performance teams.</h2>
                            <p>Everything you need to automate manual workflows and focus on what matters: protecting your customers.</p>
                        </Reveal>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Predictive Analytics", desc: "Our AI engine analyzes risk vectors in real-time, providing tailored premium insights in seconds.", bg: "bg-[#ccdbdc]/20" },
                            { icon: Clock, title: "Zero-Latency Settlements", desc: "Experience 24/7 automated claims processing with dedicated settlement specialists.", bg: "bg-[#9ad1d4]/20" },
                            { icon: Globe, title: "Global Nexus Search", desc: "Unified coverage monitoring across 120+ territories with real-time borderless sync.", bg: "bg-[#80ced7]/20" }
                        ].map((b, i) => (
                            <div key={i} className="saas-card overflow-hidden group">
                                <div className={`w-12 h-12 ${b.bg} rounded-xl flex items-center justify-center text-[#007ea7] mb-6 group-hover:scale-110 transition-transform`}>
                                    <b.icon size={22} />
                                </div>
                                <h3 className="text-xl mb-3 tracking-tight">{b.title}</h3>
                                <p className="text-sm leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 mb-20">
                <div className="saas-container">
                    <div className="bg-[#003249] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <Shield size={600} className="absolute -top-40 -left-60 rotate-45 text-white" />
                        </div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-white mb-6">Start building your secure future today.</h2>
                            <p className="text-[#80ced7] text-lg font-medium mb-12">Join over 10,000 global experts securing their infrastructure with ShieldPro.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/register" className="btn btn-primary px-10 py-5 text-sm uppercase tracking-widest">
                                    Deploy Free Node
                                </Link>
                                <button className="btn btn-ghost border-white/20 text-white hover:bg-white/10 px-10 py-5 text-sm uppercase tracking-widest">
                                    Contact Enterprise
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple SaaS Footer */}
            <footer className="py-16 border-t border-[#ccdbdc]/30 bg-white">
                <div className="saas-container">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <Shield className="w-6 h-6 text-[#007ea7]" />
                                <span className="text-xl font-black text-[#003249]">ShieldPro</span>
                            </div>
                            <p className="text-xs font-semibold leading-relaxed mb-6 opacity-60">
                                The industry standard for enterprise insurance infrastructure. Secured by design.
                            </p>
                        </div>
                        {[
                            { title: "Platform", links: ["Automations", "Risk Matrix", "Nexus Search"] },
                            { title: "Network", links: ["Docs", "API Status", "Uplink Nodes"] },
                            { title: "Foundation", links: ["About", "Careers", "Press"] }
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#003249] mb-6">{col.title}</h4>
                                <ul className="space-y-4">
                                    {col.links.map((l, j) => (
                                        <li key={j} className="text-[13px] font-semibold text-[#003249]/60 hover:text-[#007ea7] transition-colors"><a href="#">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 border-t border-[#ccdbdc]/20 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[11px] font-bold opacity-40 uppercase tracking-widest">© 2024 ShieldPro Systems Inc. All protocols reserved.</p>
                        <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-[#003249]/40">
                            <a href="#" className="hover:text-[#007ea7]">Security Policy</a>
                            <a href="#" className="hover:text-[#007ea7]">Terms of Sync</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
