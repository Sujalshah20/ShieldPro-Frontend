import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, ChevronRight, Star, CheckCircle2, Clock, 
    ShieldCheck, ArrowRight, User, Activity, 
    Lock, Zap, Globe, Headphones,
    LayoutDashboard, ShieldPlus, Target,
    Cpu, Menu, Languages
} from "lucide-react";
import Reveal from "../components/common/Reveal";
import AnimatedBackground from "../components/common/AnimatedBackground";

const Home = () => {
    const [activeRole, setActiveRole] = useState("Admins");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const roleContent = {
        Admins: {
            title: "Admin Overview",
            description: "Full visibility and control over global insurance protocols. Manage policies, track claims, and oversee agent performance from a centralized hub.",
            image: "https://images.unsplash.com/photo-1551288049-06659f427f71?auto=format&fit=crop&q=80&w=2070",
            features: [
                { icon: LayoutDashboard, title: "Operations Dashboard", desc: "Real-time metrics on premiums, loss ratios, and system health." },
                { icon: ShieldPlus, title: "Policy Management", desc: "Digital registry for all active and pending insurance safeguards." },
                { icon: Cpu, title: "Workflow Automation", desc: "Automated underwriting and risk assessment engine." }
            ]
        },
        Agents: {
            title: "Agent Command",
            description: "Empowering brokers with precision tools. Manage client portfolios, track pending applications, and grow your revenue streams.",
            image: "https://images.unsplash.com/photo-1454165833767-02302347372d?auto=format&fit=crop&q=80&w=2070",
            features: [
                { icon: Target, title: "Revenue Metrics", desc: "Visual growth tracking and commission distribution analysis." },
                { icon: Zap, title: "Quick Application", desc: "Streamlined data entry for faster policy issuance." },
                { icon: Activity, title: "Active Pipeline", desc: "Live feed of client activities and policy status changes." }
            ]
        },
        Customers: {
            title: "Customer Portal",
            description: "Your safe haven for personal protection. Manage active policies, file claims with one click, and explore recommended coverage.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2070",
            features: [
                { icon: ShieldPlus, title: "My Inventory", desc: "Instant access to digital policy certificates and coverage terms." },
                { icon: Clock, title: "Claim Tracking", desc: "Horizontal progress monitoring for active settlement requests." },
                { icon: Headphones, title: "Support Uplink", desc: "Direct connection to specialized insurance agents." }
            ]
        }
    };

    return (
        <div className="relative min-h-screen bg-[#dae5e5] text-[#012b3f] selection:bg-[#0082a1]/20 font-display">
            <AnimatedBackground>
                {/* Header Navbar */}
                <nav className="fixed top-0 left-0 w-full z-[100] bg-[#012b3f] h-20 flex items-center shadow-lg">
                    <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center text-white">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="bg-[#0082a1] p-2 rounded-lg">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight uppercase">SECURE SHIELD</h2>
                        </Link>

                        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest opacity-80">
                            <a href="#features" className="hover:text-[#0082a1] transition-colors">Features</a>
                            <a href="#solutions" className="hover:text-[#0082a1] transition-colors">Solutions</a>
                            <a href="#pricing" className="hover:text-[#0082a1] transition-colors">Pricing</a>
                            <a href="#contact" className="hover:text-[#0082a1] transition-colors">Contact</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/login" className="hidden sm:block text-xs font-bold uppercase tracking-widest hover:text-[#0082a1] transition-colors">Login</Link>
                            <Link to="/register" className="bg-[#0082a1] hover:bg-white hover:text-[#012b3f] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <Reveal direction="down">
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-[#012b3f] tracking-tighter">
                                Uncompromising <br />
                                <span className="text-[#0082a1]">Protection</span> for <br />
                                Your Digital & <br />
                                Physical Assets
                            </h1>
                        </Reveal>
                        <Reveal direction="down" delay={0.2}>
                            <p className="text-lg text-[#012b3f]/70 mb-10 max-w-lg font-medium">
                                Experience bespoke insurance solutions designed for the modern world. Our comprehensive coverage ensures your most valuable assets remain protected against every eventuality.
                            </p>
                        </Reveal>
                        <Reveal direction="down" delay={0.3}>
                            <div className="flex gap-4">
                                <Link to="/register" className="bg-[#0082a1] text-white px-10 py-5 rounded-lg font-bold text-sm shadow-xl shadow-[#0082a1]/20 hover:-translate-y-1 transition-all">
                                    Start Free Trial
                                </Link>
                                <button className="bg-white text-[#012b3f] border border-slate-200 px-8 py-5 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all">
                                    View Demo
                                </button>
                            </div>
                        </Reveal>
                    </div>
                    <div className="relative">
                        <Reveal direction="right">
                             <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                                <img 
                                    src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=2070" 
                                    alt="Secure Shield" 
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-[#0082a1]/10 backdrop-blur-[2px]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-56 h-56 border-2 border-white/50 rounded-full flex items-center justify-center animate-pulse-slow">
                                        <ShieldCheck size={120} className="text-white drop-shadow-2xl" strokeWidth={1} />
                                    </div>
                                </div>
                             </div>
                        </Reveal>
                    </div>
                </section>

                {/* Risk Management Section */}
                <section className="py-24 bg-white/50 border-y border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <Reveal direction="up">
                            <h2 className="text-4xl font-extrabold text-[#012b3f] mb-6">Comprehensive Risk Management</h2>
                            <div className="w-16 h-1 bg-[#0082a1] mx-auto mb-10" />
                            <p className="text-lg text-[#012b3f]/70 leading-relaxed font-medium">
                                Our framework is built on decades of actuarial expertise to mitigate evolving risks and ensure financial stability for your estate. We don't just insure; we provide peace of mind.
                            </p>
                        </Reveal>
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="features" className="py-32 px-6 max-w-7xl mx-auto text-center">
                    <Reveal direction="down">
                         <span className="text-[#0082a1] font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">CAPABILITIES</span>
                         <h2 className="text-4xl font-extrabold text-[#012b3f] mb-20 uppercase">Premium Insurance Benefits</h2>
                    </Reveal>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Instant Quote Generation", desc: "Get tailored premium estimates in seconds using our AI-driven underwriting engine." },
                            { icon: Clock, title: "24/7 Concierge Claims", desc: "Experience white-glove service with dedicated claims specialists available around the clock." },
                            { icon: Globe, title: "Global Coverage Network", desc: "Unmatched protection that follows you anywhere in the world, backed by top-tier partners." }
                        ].map((b, i) => (
                            <Reveal key={i} delay={i * 0.1} direction="up">
                                <div className="bg-white p-12 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center group">
                                    <div className="w-16 h-16 bg-[#dae5e5] rounded-xl flex items-center justify-center text-[#0082a1] mb-8 group-hover:bg-[#0082a1] group-hover:text-white transition-colors shadow-inner">
                                        <b.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{b.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 bg-[#012b3f] text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <Shield size={600} className="absolute -top-40 -left-60 rotate-45" />
                    </div>
                    <div className="max-w-4xl mx-auto px-6 relative z-10">
                        <Reveal direction="down">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 uppercase tracking-tight">Ready to secure your future?</h2>
                            <p className="text-white/60 mb-12 text-lg font-medium">Join over 5,000 policyholders who trust Secure Shield for their insurance needs.</p>
                            <div className="flex justify-center gap-6">
                                <Link to="/register" className="bg-[#0082a1] text-white px-10 py-5 rounded-lg font-bold text-sm hover:scale-105 transition-all">
                                    Get Started Now
                                </Link>
                                <button className="border border-white/20 text-white px-10 py-5 rounded-lg font-bold text-sm hover:bg-white/5 transition-all">
                                    Speak to Sales
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-20 bg-[#012b3f] text-white border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-white/50">
                        <div className="col-span-1 md:col-span-1">
                             <div className="flex items-center gap-3 text-white mb-6">
                                <Shield className="w-6 h-6 text-[#0082a1]" />
                                <h2 className="text-lg font-bold uppercase">SECURE SHIELD</h2>
                            </div>
                            <p className="text-xs uppercase tracking-widest leading-loose mb-6">Uncompromising protection for high-value individuals and global enterprises.</p>
                            <div className="flex gap-4">
                                <Language size={18} />
                                <Globe size={18} />
                                <Activity size={18} />
                            </div>
                        </div>
                        {[
                            { title: "Product", links: ["Features", "Pricing", "Security"] },
                            { title: "Company", links: ["About", "Blog", "Careers"] },
                            { title: "Support", links: ["Docs", "Help Center", "API"] },
                            { title: "Legal", links: ["Privacy", "Terms"] }
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-8">{col.title}</h4>
                                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                                    {col.links.map((l, j) => (
                                        <li key={j} className="hover:text-[#0082a1] transition-colors"><a href="#">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </footer>
            </AnimatedBackground>
        </div>
    );
};

export default Home;
