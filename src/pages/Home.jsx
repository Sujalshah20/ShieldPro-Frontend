import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import { 
    Shield, Check, Menu, X, ArrowRight, Activity, 
    Heart, Car, Home as HomeIcon, Plane, Briefcase, 
    Lock, Zap, Clock, Star, MapPin, Phone, Mail, 
    Facebook, Twitter, Instagram, Linkedin, 
    Search, UserPlus, MousePointer2, FileCheck, HelpCircle, ChevronRight, Globe, TrendingUp,
    Fingerprint, Cpu, Satellite, Target, Database, Layers, Radio, Workflow, Quote, ShieldCheck
} from "lucide-react";
import Reveal from "../components/common/Reveal";
import heroIllustration from "../assets/hero_illustration_v2.jpg";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
            scrolled ? 'h-20 bg-white shadow-xl' : 'h-24 bg-white/80 backdrop-blur-xl'
        }`}>
            <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-6 lg:px-8">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white shadow-3xl group-hover:rotate-6 transition-all border border-white/10">
                        <Shield size={22} strokeWidth={3} />
                    </div>
                    <span className="text-xl font-black text-black tracking-tight uppercase italic">Secure <span className="opacity-20 italic">Shield_</span></span>
                </Link>
 
                {/* Auth Buttons */}
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-[11px] font-black text-black uppercase tracking-[3px] hover:opacity-50 transition-all italic">
                        Login
                    </Link>
                    <Link to="/register" className="h-12 px-8 bg-black text-white rounded-xl text-[11px] font-black flex items-center justify-center hover:bg-black/90 transition-all shadow-3xl active:scale-95 italic tracking-[3px] border-b-4 border-white/10 uppercase">
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const HeroSection = () => (
    <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden pt-20">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-black/[0.02] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 py-16 md:py-24">
            <Reveal direction="left">
                <div className="space-y-8 md:space-y-12">
                    <div className="inline-flex items-center px-5 py-2.5 bg-slate-50 backdrop-blur-xl rounded-full border border-slate-100 shadow-inner">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-3" />
                        <span className="text-[11px] md:text-[12px] font-black text-black opacity-30 tracking-[4px] uppercase italic">India's Trusted Insurance Platform // 01</span>
                    </div>
 
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-black leading-[1] tracking-tighter uppercase italic">
                            Protect <br />
                            <span className="opacity-20">Your_</span> <br />
                            Legacy.
                        </h1>
                        <p className="max-w-lg text-black text-base md:text-lg font-black uppercase tracking-[2px] opacity-40 leading-relaxed italic">
                            Comprehensive, simplified, and reliable insurance solutions designed for the modern Indian family.
                        </p>
                    </div>
 
                    <div className="flex flex-col sm:flex-row gap-6 pt-4">
                        <Link to="/register" className="h-16 px-12 bg-black text-white font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-black/90 hover:translate-y-[-2px] transition-all shadow-3xl group italic uppercase tracking-widest border-b-4 border-white/10">
                            DEPLOY_SECURITY <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="h-16 px-10 border border-slate-100 text-black font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center italic uppercase tracking-widest shadow-inner">
                            VIEW_ARCHITECT
                        </button>
                    </div>
                </div>
            </Reveal>
 
            <Reveal direction="right">
                <div className="relative group mt-8 lg:mt-0">
                    {/* Outer ambient glow */}
                    <div className="absolute -inset-6 sm:-inset-8 bg-black/[0.05] blur-[80px] rounded-full opacity-60 transition-all duration-700 group-hover:opacity-90" />
 
                    {/* Premium border ring */}
                    <div className="relative z-10 p-[2px] rounded-3xl bg-slate-100 shadow-3xl group-hover:scale-[1.02] transition-all duration-700">
                        {/* Inner card */}
                        <div className="relative bg-white rounded-[calc(1.5rem-2px)] p-3 sm:p-4 overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] flex items-center justify-center border border-slate-50 shadow-inner">
                            <img
                                src={heroIllustration}
                                alt="Family Protection"
                                className="w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                        </div>
                    </div>
 
                    {/* Floating badge */}
                    <div className="absolute -bottom-5 -left-4 sm:-bottom-8 sm:-left-8 bg-black px-6 py-4 sm:p-6 rounded-[2rem] shadow-3xl border border-white/10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner">
                            <Shield size={24} strokeWidth={3} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-[4px] italic">Protocol</p>
                            <p className="text-sm font-black text-white uppercase italic tracking-widest">Enforced_</p>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    </section>
);

const StatsSection = () => {
    const { data: publicStats, isLoading } = useQuery({
        queryKey: ['publicStats'],
        queryFn: () => api.get('/stats/public'),
        staleTime: 600000 // 10 minutes
    });

    const stats = [
        { val: publicStats?.policies || "0+", label: "POLICIES", icon: Shield, color: "text-black" },
        { val: publicStats?.customers || "0+", label: "CUSTOMERS", icon: UserPlus, color: "text-black" },
        { val: publicStats?.settlementRate || "99%", label: "CLAIM SETTLEMENT", icon: FileCheck, color: "text-black" },
        { val: publicStats?.partners || "100+", label: "PARTNER COMPANIES", icon: Globe, color: "text-black" }
    ];
 
    return (
        <section className="py-32 relative bg-white border-b border-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {stats.map((s, i) => (
                        <Reveal key={i} direction="up" delay={i * 0.1}>
                            <div className="space-y-6 group">
                                <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-[2rem] bg-slate-50 text-black border border-slate-100 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all shadow-inner`}>
                                    <s.icon size={28} strokeWidth={3} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-5xl font-black text-black tracking-tighter italic">
                                        {isLoading ? "..." : s.val}
                                    </h3>
                                    <p className="text-black text-[10px] font-black uppercase tracking-[4px] opacity-20 italic">{s.label}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PolicySection = () => (
    <section className="py-32 bg-slate-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
                <Reveal direction="up">
                    <h2 className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase italic">Architecture_</h2>
                    <p className="text-black text-[11px] font-black uppercase tracking-[4px] opacity-30 italic">
                        Choose from a wide range of insurance products designed to provide you with maximum coverage and peace of mind.
                    </p>
                </Reveal>
            </div>
 
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                    { title: "Health Insurance", icon: Activity, color: "text-black bg-white", desc: "Comprehensive health coverage for you and your family, including pre and post-hospitalization." },
                    { title: "Life Insurance", icon: Heart, color: "text-black bg-white", desc: "Secure your family's financial future and ensure their dreams are fulfilled even in your absence." },
                    { title: "Vehicle Insurance", icon: Car, color: "text-black bg-white", desc: "Protection for your cars and bikes against accidents, theft, and natural calamities." },
                    { title: "Home Insurance", icon: HomeIcon, color: "text-black bg-white", desc: "Shield your home and its valuable contents from fire, theft, and other unforeseen risks." },
                    { title: "Travel Insurance", icon: Plane, color: "text-black bg-white", desc: "Travel the world with complete peace of mind with coverage for medical and travel delays." },
                    { title: "Business Insurance", icon: Briefcase, color: "text-black bg-white", desc: "Customized insurance solutions for your enterprise to mitigate operational and liability risks." }
                ].map((p, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-12 rounded-[2.5rem] border border-white shadow-xl hover:shadow-3xl transition-all duration-700 h-full flex flex-col group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-10 -mt-10 transition-all group-hover:scale-150 group-hover:bg-black group-hover:opacity-5" />
                            <div className={`w-16 h-16 ${p.color} rounded-2xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-all shadow-inner border border-slate-50`}>
                                <p.icon size={28} strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-black text-black mb-4 uppercase italic tracking-tight">{p.title}</h3>
                            <p className="text-black text-[13px] font-black opacity-30 uppercase tracking-widest leading-relaxed mb-10 flex-1 italic">
                                {p.desc}
                            </p>
                            <button className="flex items-center gap-3 text-black font-black text-[10px] uppercase tracking-[4px] hover:gap-5 transition-all italic">
                                DEPLOY_CORE <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-24 space-y-6">
                <Reveal direction="up">
                    <h2 className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase italic">The Protocol_</h2>
                    <p className="text-black text-[11px] font-black uppercase tracking-[4px] opacity-30 italic">Get started in just 4 simple steps.</p>
                </Reveal>
            </div>
 
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[4px] bg-slate-50 -z-0 rounded-full" />
                
                {[
                    { icon: UserPlus, title: "Register", desc: "Create your account with basic details." },
                    { icon: Search, title: "Browse", desc: "Compare plans from top providers." },
                    { icon: Zap, title: "Buy", desc: "Securely purchase your chosen plan." },
                    { icon: Shield, title: "Claim", desc: "Hassle-free 24/7 assistance for claims." }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="relative z-10 space-y-10 group">
                            <div className="mx-auto w-32 h-32 bg-black rounded-[2.5rem] flex items-center justify-center text-white shadow-3xl group-hover:scale-110 transition-all duration-700 border-4 border-white">
                                <s.icon size={40} strokeWidth={3} />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-black text-black uppercase italic tracking-tight">{s.title}</h4>
                                <p className="text-black text-[11px] font-black opacity-30 uppercase tracking-[2px] leading-relaxed max-w-[200px] mx-auto italic">{s.desc}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const WhyChooseUs = () => (
    <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-24 space-y-6">
                <Reveal direction="up">
                    <h2 className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase italic">Advantages_</h2>
                    <p className="text-black text-[11px] font-black uppercase tracking-[4px] opacity-30 italic">The most reliable choice for insurance in India.</p>
                </Reveal>
            </div>
 
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { icon: Lock, title: "100% Secure", desc: "Your data and payments are encrypted with military-grade security." },
                    { icon: Zap, title: "Instant Insurance", desc: "Get your policy documents instantly in your inbox after purchase." },
                    { icon: Clock, title: "24/7 Access", desc: "Manage your policies, download certificates anytime, anywhere." },
                    { icon: Star, title: "Best Rates", desc: "We guarantee competitive premiums and exclusive partner discounts." },
                    { icon: Workflow, title: "Expert Support", desc: "Dedicated expert advisors to help you choose the right coverage." },
                    { icon: ShieldCheck, title: "Fast Claim", desc: "Digital-first claim processing for lightning-fast settlements." }
                ].map((f, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-10 rounded-3xl border border-slate-50 flex items-start gap-8 hover:shadow-3xl transition-all duration-700 h-full group shadow-xl">
                            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-all shadow-3xl border border-white/10">
                                <f.icon size={28} strokeWidth={3} />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-black text-black uppercase italic tracking-tight">{f.title}</h4>
                                <p className="text-black text-[11px] font-black opacity-30 uppercase tracking-[2px] leading-relaxed italic">{f.desc}</p>
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-24 space-y-6">
                <Reveal direction="up">
                    <h2 className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase italic">Registry_</h2>
                    <p className="text-black text-[11px] font-black uppercase tracking-[4px] opacity-30 italic">Validated feedback from the network.</p>
                </Reveal>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                    { name: "Sahat Sharma", role: "Business Owner", text: "Secure Shield made finding health insurance so easy. The claim process when my son was hospitalized was completely cashless and smooth." },
                    { name: "Priya Patel", role: "Software Engineer", text: "The vehicle insurance premiums here are the most competitive I've found. Instant policy delivery to my email was the best part." },
                    { name: "Anil Mehta", role: "Retired Teacher", text: "Trusted service and excellent customer support. They guided me through every step of choosing the right life insurance for my family." }
                ].map((t, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-50 shadow-xl hover:shadow-3xl transition-all duration-700 h-full flex flex-col relative group">
                            <Quote className="absolute top-10 right-10 text-slate-100 group-hover:text-black transition-all group-hover:opacity-5 group-hover:scale-150" size={60} strokeWidth={3} />
                            
                            <div className="flex text-black gap-2 mb-8">
                                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" strokeWidth={0} />)}
                            </div>
                            
                            <p className="text-black text-[14px] font-black uppercase tracking-widest leading-relaxed italic mb-10 flex-1 opacity-40">
                                "{t.text}"
                            </p>
                            
                            <div className="flex items-center gap-5 pt-10 border-t border-slate-50">
                                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white font-black overflow-hidden shadow-3xl text-sm italic uppercase">
                                     {t.name.split(' ')[0].charAt(0)}{t.name.split(' ')[1].charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-black text-black leading-none mb-1 uppercase italic tracking-tight">{t.name}</h4>
                                    <p className="text-[10px] text-black font-black uppercase tracking-[3px] opacity-20 italic">{t.role}</p>
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
    <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-black rounded-[4rem] p-20 md:p-32 text-center space-y-12 relative overflow-hidden shadow-3xl border border-white/10">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.03] blur-[100px] rounded-full -ml-20 -mb-20" />
                
                <h2 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter relative z-10 uppercase italic">
                    Secure_Your <br /> <span className="opacity-20">Dynasty.</span>
                </h2>
                <p className="text-white/30 text-lg md:text-xl font-black max-w-2xl mx-auto relative z-10 uppercase tracking-[4px] italic">
                    Join thousands of Indians who have already secured their family's health and assets with Secure Shield.
                </p>
                <div className="relative z-10 pt-10">
                    <Link to="/register" className="inline-flex h-20 px-16 bg-white text-black font-black rounded-2xl items-center hover:bg-slate-50 hover:scale-105 transition-all shadow-3xl uppercase tracking-widest italic border-b-4 border-black/10">
                        INITIALIZE_REGISTRY
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="pt-32 pb-16 bg-black text-white overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-20 mb-20">
                <div className="space-y-10">
                    <Link to="/" className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-3xl group-hover:rotate-6 transition-all">
                            <Shield size={24} strokeWidth={3} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter uppercase italic">Secure <span className="opacity-20">Shield_</span></span>
                    </Link>
                    <p className="text-white/30 text-[11px] font-black uppercase tracking-[3px] leading-[2] italic">
                        Leading insurance platform in India providing innovative and customer-centric insurance solutions. Protecting your legacy with trust and transparency.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/5 hover:scale-110 shadow-inner">
                                <Icon size={20} strokeWidth={2.5} />
                            </a>
                        ))}
                    </div>
                </div>
 
                <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[5px] mb-12 opacity-20 italic">Navigation</h4>
                    <ul className="space-y-6">
                        {["Home", "About Us", "Our Policies", "Careers", "Contact Support"].map(l => (
                            <li key={l}><a href="#" className="text-white hover:opacity-30 text-[11px] font-black uppercase tracking-[3px] transition-all italic">{l}</a></li>
                        ))}
                    </ul>
                </div>
 
                <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[5px] mb-12 opacity-20 italic">Protocols</h4>
                    <ul className="space-y-6">
                        {["Health", "Life", "Vehicle", "Home", "Travel"].map(l => (
                            <li key={l}><a href="#" className="text-white hover:opacity-30 text-[11px] font-black uppercase tracking-[3px] transition-all italic">{l}</a></li>
                        ))}
                    </ul>
                </div>
 
                <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[5px] mb-12 opacity-20 italic">Node_Identity</h4>
                    <ul className="space-y-8">
                        <li className="flex gap-5">
                            <MapPin size={22} strokeWidth={3} className="text-white/20 shrink-0" />
                            <span className="text-[11px] font-black text-white uppercase tracking-[3px] italic leading-relaxed">BKC Tower, Mumbai // MH-400051</span>
                        </li>
                        <li className="flex gap-5">
                            <Phone size={22} strokeWidth={3} className="text-white/20 shrink-0" />
                            <span className="text-[11px] font-black text-white uppercase tracking-[3px] italic leading-relaxed">1800-SECURE-SHIELD</span>
                        </li>
                        <li className="flex gap-5">
                            <Mail size={22} strokeWidth={3} className="text-white/20 shrink-0" />
                            <span className="text-[11px] font-black text-white uppercase tracking-[3px] italic leading-relaxed">support@secureshield.in</span>
                        </li>
                    </ul>
                </div>
            </div>
 
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-white/20 text-[10px] font-black uppercase tracking-[4px] italic">© 2024 Secure Shield Core // System_v3.0</div>
                <div className="flex gap-10 text-white/20 text-[10px] font-black uppercase tracking-[4px] italic">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Help</a>
                </div>
            </div>
        </div>
    </footer>
);;

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
