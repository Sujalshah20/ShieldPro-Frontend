import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
    Shield, Check, Menu, X, ArrowRight, Activity,
    Heart, Car, Home as HomeIcon, Plane, Briefcase,
    Lock, Zap, Clock, Star, MapPin, Phone, Mail,
    Facebook, Twitter, Instagram, Linkedin,
    Search, UserPlus, MousePointer2, FileCheck, HelpCircle, ChevronRight, Globe, TrendingUp,
    Fingerprint, Cpu, Satellite, Target, Database, Layers, Radio, Workflow, Quote, ShieldCheck
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
        <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'h-20 bg-white shadow-xl' : 'h-24 bg-white/80 backdrop-blur-xl'
            }`}>
            <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-6 lg:px-8">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#134e8d] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-all border border-white/10">
                        <Shield size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-[#134e8d] tracking-tight">Secure <span className="text-[#002b45]">Shield</span></span>
                </Link>

                {/* Nav Links Removed as per request */}

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <Link to="/login" className="h-10 px-6 border border-slate-200 text-[#002b45] rounded-lg text-[11px] font-bold flex items-center justify-center hover:bg-slate-50 transition-all uppercase tracking-wider">
                        Login
                    </Link>
                    <Link to="/register" className="h-10 px-6 bg-[#002b45] text-white rounded-lg text-[11px] font-bold flex items-center justify-center hover:bg-[#003b5c] transition-all shadow-md active:scale-95 uppercase tracking-wider">
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const PremiumHeroIllustration = () => (
    <div className="relative w-full aspect-[16/10] flex items-center justify-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 blur-3xl rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-emerald-400/10 blur-2xl rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* Floating Data Nodes */}
        {[
            { top: '15%', left: '10%' }, { top: '25%', right: '15%' },
            { bottom: '20%', left: '20%' }, { bottom: '30%', right: '25%' }
        ].map((pos, i) => (
            <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                animate={{
                    y: [0, -15, 0],
                    opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={pos}
            />
        ))}

        {/* Connection Lines (Represented by subtle gradients) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 400 250">
                <motion.path
                    d="M 50 50 Q 150 20 250 80 T 350 50"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [0, 100] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                    d="M 20 200 Q 120 180 220 220 T 380 200"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
            </svg>
        </div>

        {/* Main Glass Dashboard Card */}
        <motion.div
            className="relative z-10 w-[85%] h-[85%] bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-4xl overflow-hidden group"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Dashboard Header UI */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400/50" />
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Network Secure</span>
                </div>
            </div>

            {/* Central Content */}
            <div className="p-8 flex flex-col items-center justify-center h-full -mt-4 gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-32 h-32 bg-gradient-to-br from-[#134e8d] to-[#10b981] rounded-3xl flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <ShieldCheck size={64} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-white text-xl font-bold tracking-tight">Active Protection</h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[3px]">ShieldPro Core v4.2</p>
                </div>

                {/* Mini Stats Bar */}
                <div className="w-full grid grid-cols-3 gap-4 mt-4">
                    {[
                        { label: 'Uptime', val: '99.9%' },
                        { label: 'Latency', val: '12ms' },
                        { label: 'Threats', val: '0' }
                    ].map((m, i) => (
                        <div key={i} className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                            <p className="text-white font-bold text-xs">{m.val}</p>
                            <p className="text-white/30 text-[8px] font-bold uppercase tracking-wider mt-1">{m.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>

        {/* Floating Mini Cards */}
        <motion.div
            className="absolute top-[10%] -right-8 z-20 p-4 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-2xl flex items-center gap-4"
            animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
            <div className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Zap size={20} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-white font-bold text-xs">Insta-Claim</p>
                <p className="text-white/60 text-[10px] font-medium">Verified Active</p>
            </div>
        </motion.div>

        <motion.div
            className="absolute bottom-[20%] -left-12 z-20 p-4 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-2xl flex items-center gap-4"
            animate={{ y: [0, -12, 0], x: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Lock size={20} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-white font-bold text-xs">Secure Vault</p>
                <p className="text-white/60 text-[10px] font-medium">Military Grade</p>
            </div>
        </motion.div>
    </div>
);

const HeroSection = () => (
    <section className="relative min-h-[85vh] flex items-center bg-[#134e8d] overflow-hidden pt-20">
        {/* Background Gradient & Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#134e8d] via-[#134e8d] to-[#002b45] opacity-95" />
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-blue-400/20 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 py-16 md:py-24">
            <Reveal direction="left">
                <div className="space-y-8">
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                        <span className="text-[11px] font-bold text-white tracking-[2px] uppercase">India's Trusted Insurance Platform</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                            Protect What <br />
                            Matters Most
                        </h1>
                        <p className="max-w-lg text-white/80 text-base md:text-lg font-medium leading-relaxed">
                            Comprehensive insurance solutions tailored for your lifestyle. Join over 10,000+ families securing their future with us today.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="/register" className="h-14 px-8 bg-[#10b981] text-white font-bold rounded-lg flex items-center justify-center gap-3 hover:bg-[#0da371] hover:translate-y-[-2px] transition-all shadow-lg group uppercase tracking-wider text-sm">
                            Explore Policies <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </Reveal>

            <Reveal direction="right" overflow="visible">
                <div className="relative group mt-8 lg:mt-0 px-8">
                    <PremiumHeroIllustration />
                </div>
            </Reveal>
        </div>
    </section>
);

const ManagementSection = () => {
    const features = [
        {
            title: "Policy Management",
            desc: "Easily manage, update, and track all your insurance policies in one place.",
            icon: ShieldCheck,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Claim Tracking",
            desc: "Real-time claim status tracking with simplified documentation process.",
            icon: Activity,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Renewal Reminders",
            desc: "Automated alerts to avoid policy expiration and late penalties.",
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            title: "Secure Data Protection",
            desc: "End-to-end encrypted and secure data handling system.",
            icon: Lock,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        }
    ];

    return (
        <section className="py-24 relative bg-white border-b border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <Reveal direction="up">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] tracking-tight uppercase">Smart Insurance Management Solutions</h2>
                        <p className="text-slate-500 text-base font-medium leading-relaxed">
                            Our unified platform empowers you to effortlessly manage your policies, track claims in real-time, handle renewals without missing a beat, and monitor your comprehensive coverage with complete peace of mind.
                        </p>
                    </Reveal>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <Reveal key={i} direction="up" delay={i * 0.1}>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:bg-white transition-all duration-300 h-full group">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${f.bg} ${f.color} shadow-sm`}>
                                    <f.icon size={28} strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-[#1e293b] mb-3">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PolicySection = () => (
    <section className="py-24 bg-slate-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                <Reveal direction="up">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] tracking-tight uppercase">Our Policies</h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Choose from a wide range of insurance products designed to provide you with maximum coverage and peace of mind.
                    </p>
                </Reveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: "Health Insurance", icon: Activity, color: "text-blue-600 bg-blue-50", desc: "Comprehensive health coverage for you and your family, including pre and post-hospitalization." },
                    { title: "Life Insurance", icon: Heart, color: "text-red-600 bg-red-50", desc: "Secure your family's financial future and ensure their dreams are fulfilled even in your absence." },
                    { title: "Vehicle Insurance", icon: Car, color: "text-orange-600 bg-orange-50", desc: "Protection for your cars and bikes against accidents, theft, and natural calamities." },
                    { title: "Home Insurance", icon: HomeIcon, color: "text-indigo-600 bg-indigo-50", desc: "Shield your home and its valuable contents from fire, theft, and other unforeseen risks." },
                    { title: "Travel Insurance", icon: Plane, color: "text-teal-600 bg-teal-50", desc: "Travel the world with complete peace of mind with coverage for medical and travel delays." },
                    { title: "Business Insurance", icon: Briefcase, color: "text-[#134e8d] bg-blue-50", desc: "Customized insurance solutions for your enterprise to mitigate operational and liability risks." }
                ].map((p, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                            <div className={`w-12 h-12 ${p.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <p.icon size={24} strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold text-[#1e293b] mb-4">{p.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                                {p.desc}
                            </p>
                            <button className="flex items-center gap-2 text-[#134e8d] font-bold text-xs uppercase tracking-wider hover:gap-3 transition-all">
                                Learn More <ArrowRight size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                <Reveal direction="up">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] tracking-tight uppercase">How It Works</h2>
                    <p className="text-slate-500 text-sm font-medium">Get started in just 4 simple steps.</p>
                </Reveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-[48px] left-[15%] right-[15%] h-[2px] bg-slate-100 -z-0" />

                {[
                    { icon: UserPlus, title: "Register", desc: "Create your account with basic details." },
                    { icon: Search, title: "Browse", desc: "Compare plans from top providers." },
                    { icon: Zap, title: "Buy", desc: "Securely purchase your chosen plan." },
                    { icon: Shield, title: "Claim", desc: "Hassle-free 24/7 assistance for claims." }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="relative z-10 space-y-6 group">
                            <div className="mx-auto w-24 h-24 bg-[#002b45] rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-white">
                                <s.icon size={32} strokeWidth={2} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-[#1e293b]">{s.title}</h4>
                                <p className="text-slate-400 text-xs leading-relaxed max-w-[180px] mx-auto">{s.desc}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const WhyChooseUs = () => (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                <Reveal direction="up">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] tracking-tight uppercase">Why Choose Us</h2>
                    <p className="text-slate-500 text-sm font-medium">The most reliable choice for insurance in India.</p>
                </Reveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { icon: Lock, title: "100% Secure", desc: "Your data and payments are encrypted with military-grade security." },
                    { icon: Zap, title: "Instant Insurance", desc: "Get your policy documents instantly in your inbox after purchase." },
                    { icon: Clock, title: "24/7 Access", desc: "Manage your policies, download certificates anytime, anywhere." },
                    { icon: Star, title: "Best Rates", desc: "We guarantee competitive premiums and exclusive partner discounts." },
                    { icon: Workflow, title: "Expert Support", desc: "Dedicated expert advisors to help you choose the right coverage." },
                    { icon: ShieldCheck, title: "Fast Claim", desc: "Digital-first claim processing for lightning-fast settlements." }
                ].map((f, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex items-start gap-6 hover:shadow-lg transition-all duration-300 h-full group shadow-sm">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#134e8d] shrink-0 group-hover:bg-[#134e8d] group-hover:text-white transition-all">
                                <f.icon size={24} strokeWidth={2} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-[#1e293b]">{f.title}</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const Testimonials = () => (
    <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                <Reveal direction="up">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] tracking-tight uppercase">What Our Customers Say</h2>
                    <p className="text-slate-500 text-sm font-medium">Trusted service with excellent customer support.</p>
                </Reveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { name: "Sahat Sharma", role: "Business Owner", text: "Secure Shield made finding health insurance so easy. The claim process when my son was hospitalized was completely cashless and smooth." },
                    { name: "Priya Patel", role: "Software Engineer", text: "The vehicle insurance premiums here are the most competitive I've found. Instant policy delivery to my email was the best part." },
                    { name: "Anil Mehta", role: "Retired Teacher", text: "Trusted service and excellent customer support. They guided me through every step of choosing the right life insurance for my family." }
                ].map((t, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full group relative">
                            <Quote className="absolute top-8 right-8 text-slate-200" size={40} />

                            <div className="flex text-yellow-500 gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" strokeWidth={0} />)}
                            </div>

                            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1 italic">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                                <div className="w-12 h-12 bg-[#134e8d] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {t.name.split(' ')[0].charAt(0)}{t.name.split(' ')[1].charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1e293b] text-sm">{t.name}</h4>
                                    <p className="text-xs text-slate-400 font-medium">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const CTABanner = () => (
    <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#002b45] via-[#134e8d] to-[#002b45] rounded-[3rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,43,69,0.3)] border border-white/10 flex flex-col items-center">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 blur-[100px] rounded-full -mr-32 -mt-32 animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full -ml-32 -mb-32 animate-pulse-slow" style={{ animationDelay: '2s' }} />
                
                <Reveal direction="up">
                    <div className="space-y-6 relative z-10 flex flex-col items-center">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
                            Ready to Protect <br className="hidden md:block" /> Your Future?
                        </h2>
                        <p className="text-white/80 text-base md:text-xl font-medium max-w-2xl leading-relaxed">
                            Join over 10,000+ Indians who have already secured their family's health, life, and assets with Secure Shield's military-grade protection.
                        </p>
                    </div>
                </Reveal>

                <Reveal direction="up" delay={0.2}>
                    <div className="relative z-10 pt-8 w-full flex flex-col sm:flex-row justify-center items-center gap-6">
                        <Link to="/register" className="h-16 px-12 bg-white text-[#002b45] font-bold rounded-2xl items-center flex justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-[2px] text-xs w-full sm:w-auto min-w-[240px]">
                            Start Application Now
                        </Link>
                        <Link to="/policies" className="h-16 px-12 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl items-center flex justify-center hover:bg-white/20 transition-all border border-white/20 uppercase tracking-[2px] text-xs w-full sm:w-auto min-w-[240px]">
                            Browse All Plans
                        </Link>
                    </div>
                </Reveal>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="pt-24 pb-12 bg-[#002b45] text-white relative overflow-hidden border-t border-white/5">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-4 gap-16 mb-20">
                <div className="space-y-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#002b45] shadow-xl group-hover:rotate-6 transition-transform">
                            <Shield size={26} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tighter uppercase tracking-[3px]">Secure <span className="text-blue-400">Shield</span></span>
                    </Link>
                    <p className="text-white text-sm leading-relaxed font-medium">
                        India's premier digital insurance ecosystem. We leverage state-of-the-art security and innovative technology to protect what matters most to you.
                    </p>
                    <div className="flex gap-4">
                        {/* Placeholder for social if needed in future */}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-[4px] mb-10 opacity-70">Discovery</h4>
                    <ul className="space-y-5">
                        {["Home", "About Us", "Our Policies", "Careers", "Contact Support"].map(l => (
                            <li key={l}><a href="#" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all text-sm font-medium">{l}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-[4px] mb-10 opacity-70">Solutions</h4>
                    <ul className="space-y-5">
                        {["Health Insurance", "Life Insurance", "Vehicle Insurance", "Home Insurance", "Travel Insurance"].map(l => (
                            <li key={l}><a href="#" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all text-sm font-medium">{l}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-[4px] mb-10 opacity-70">Connect</h4>
                    <ul className="space-y-6">
                        <li className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-400 group-hover:bg-[#134e8d] group-hover:text-white transition-all">
                                <MapPin size={18} strokeWidth={2} />
                            </div>
                            <span className="text-white/90 text-sm font-semibold tracking-tight">India</span>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-400 group-hover:bg-[#134e8d] group-hover:text-white transition-all">
                                <Phone size={18} strokeWidth={2} />
                            </div>
                            <span className="text-white/90 text-sm font-semibold tracking-tight uppercase">1800-SECURE-SHIELD</span>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-400 group-hover:bg-[#134e8d] group-hover:text-white transition-all">
                                <Mail size={18} strokeWidth={2} />
                            </div>
                            <span className="text-white/90 text-sm font-semibold tracking-tight">Shahsujal14@gmail.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-[2px] text-center md:text-left">
                    © 2026 Secure Shield Insurance Brokers // Excellence in Protection
                </div>
                <div className="flex gap-10 text-white/40 text-[10px] font-bold uppercase tracking-[2px]">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Refunds</a>
                </div>
            </div>
        </div>
    </footer>
);

const Home = () => {
    return (
        <div className="relative min-h-screen bg-white font-sans selection:bg-[#10b981] selection:text-white">
            <Navbar />
            <HeroSection />
            <ManagementSection />
            <PolicySection />
            <HowItWorks />
            <WhyChooseUs />
            <Testimonials />
            <CTABanner />
            <Footer />
        </div>
    );
};
;

export default Home;
