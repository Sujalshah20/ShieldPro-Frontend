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
            scrolled ? 'h-20 bg-white shadow-md' : 'h-24 bg-white/80 backdrop-blur-md'
        }`}>
            <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-6 lg:px-8">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#002b45] rounded-lg flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
                        <Shield size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-[#002b45] tracking-tight">Secure <span className="text-[#134e8d]">Shield</span></span>
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-6 py-2 text-[13px] font-bold text-[#64748b] border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                        Login
                    </Link>
                    <Link to="/register" className="px-6 py-2 text-[13px] font-bold text-white bg-[#002b45] rounded-lg hover:bg-[#003d63] transition-all shadow-md shadow-blue-900/10">
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const HeroSection = () => (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#002b45] to-[#134e8d] overflow-hidden pt-20">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 py-16 md:py-24">
            <Reveal direction="left">
                <div className="space-y-8 md:space-y-12">
                    <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-3" />
                        <span className="text-[11px] md:text-[13px] font-bold text-white/90 tracking-[2px] uppercase">India's Trusted Insurance Platform</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
                            Protect What <br />
                            <span className="text-emerald-400">Matters</span> Most
                        </h1>
                        <p className="max-w-lg text-white/70 text-base md:text-xl font-medium leading-relaxed">
                            Comprehensive, simplified, and reliable insurance solutions designed for the modern Indian family. Secure your legacy today.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 pt-4">
                        <Link to="/register" className="h-16 px-10 bg-[#10b981] text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#0da371] hover:translate-y-[-2px] transition-all shadow-xl shadow-emerald-500/20 group">
                            Explore Policies <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="h-16 px-10 border-2 border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center">
                            Get a Free Quote
                        </button>
                    </div>
                </div>
            </Reveal>

            <Reveal direction="right">
                <div className="relative group">
                    <div className="absolute -inset-10 bg-white/5 blur-[80px] rounded-full opacity-50 transition-all group-hover:opacity-80" />
                    <div className="relative z-10 bg-white/10 backdrop-blur-3xl rounded-[3rem] p-4 border border-white/20 shadow-2xl overflow-hidden aspect-[16/10] lg:aspect-[4/3] flex items-center justify-center group-hover:scale-[1.02] transition-all duration-700">
                        <img 
                            src={heroIllustration} 
                            alt="Family Protection"
                            className="w-full h-full object-cover rounded-[2.5rem] shadow-inner"
                        />
                        {/* Shimmer effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                    {/* Floating Tactical Element placeholder from image */}
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                             <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
                            <p className="text-sm font-bold text-[#002b45]">Highly Secured</p>
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
        { val: publicStats?.policies || "0+", label: "POLICIES", icon: Shield, color: "text-blue-600" },
        { val: publicStats?.customers || "0+", label: "CUSTOMERS", icon: UserPlus, color: "text-emerald-500" },
        { val: publicStats?.settlementRate || "99%", label: "CLAIM SETTLEMENT", icon: FileCheck, color: "text-blue-800" },
        { val: publicStats?.partners || "100+", label: "PARTNER COMPANIES", icon: Globe, color: "text-slate-600" }
    ];

    return (
        <section className="py-20 relative bg-white border-b border-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {stats.map((s, i) => (
                        <Reveal key={i} direction="up" delay={i * 0.1}>
                            <div className="space-y-4 group">
                                <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 ${s.color} group-hover:scale-110 transition-transform`}>
                                    <s.icon size={24} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl font-extrabold text-[#002b45] tracking-tight">
                                        {isLoading ? "..." : s.val}
                                    </h3>
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{s.label}</p>
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
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                <Reveal direction="up">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#002b45] tracking-tight">Our Policies</h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        Choose from a wide range of insurance products designed to provide you with maximum coverage and peace of mind.
                    </p>
                </Reveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: "Health Insurance", icon: Activity, color: "text-blue-600 bg-blue-50", desc: "Comprehensive health coverage for you and your family, including pre and post-hospitalization." },
                    { title: "Life Insurance", icon: Heart, color: "text-red-500 bg-red-50", desc: "Secure your family's financial future and ensure their dreams are fulfilled even in your absence." },
                    { title: "Vehicle Insurance", icon: Car, color: "text-orange-500 bg-orange-50", desc: "Protection for your cars and bikes against accidents, theft, and natural calamities." },
                    { title: "Home Insurance", icon: HomeIcon, color: "text-purple-500 bg-purple-50", desc: "Shield your home and its valuable contents from fire, theft, and other unforeseen risks." },
                    { title: "Travel Insurance", icon: Plane, color: "text-teal-500 bg-teal-50", desc: "Travel the world with complete peace of mind with coverage for medical and travel delays." },
                    { title: "Business Insurance", icon: Briefcase, color: "text-amber-700 bg-amber-50", desc: "Customized insurance solutions for your enterprise to mitigate operational and liability risks." }
                ].map((p, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-500 h-full flex flex-col group">
                            <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform`}>
                                <p.icon size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#002b45] mb-4">{p.title}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                                {p.desc}
                            </p>
                            <button className="flex items-center gap-2 text-[#134e8d] font-bold text-sm hover:gap-3 transition-all">
                                Learn More <ArrowRight size={16} strokeWidth={3} />
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
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#002b45] tracking-tight">How It Works</h2>
                    <p className="text-slate-500 text-lg font-medium">Get started in just 4 simple steps.</p>
                </Reveal>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-slate-100 -z-0" />
                
                {[
                    { icon: UserPlus, title: "Register", desc: "Create your account with basic details." },
                    { icon: Search, title: "Browse", desc: "Compare plans from top providers." },
                    { icon: Zap, title: "Buy", desc: "Securely purchase your chosen plan." },
                    { icon: Shield, title: "Claim", desc: "Hassle-free 24/7 assistance for claims." }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="relative z-10 space-y-8 group">
                            <div className="mx-auto w-28 h-28 bg-[#002b45] rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                                <s.icon size={36} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xl font-bold text-[#002b45]">{s.title}</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const WhyChooseUs = () => (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                <Reveal direction="up">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#002b45] tracking-tight">Why Choose Us</h2>
                    <p className="text-slate-500 text-lg font-medium">The most reliable choice for insurance in India.</p>
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
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex items-start gap-6 hover:shadow-lg transition-all duration-500 h-full group">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#134e8d] shrink-0 group-hover:scale-110 transition-transform">
                                <f.icon size={24} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-[#002b45]">{f.title}</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
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
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#002b45] tracking-tight">What Our Customers Say</h2>
                </Reveal>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { name: "Sahat Sharma", role: "Business Owner", text: "Secure Shield made finding health insurance so easy. The claim process when my son was hospitalized was completely cashless and smooth." },
                    { name: "Priya Patel", role: "Software Engineer", text: "The vehicle insurance premiums here are the most competitive I've found. Instant policy delivery to my email was the best part." },
                    { name: "Anil Mehta", role: "Retired Teacher", text: "Trusted service and excellent customer support. They guided me through every step of choosing the right life insurance for my family." }
                ].map((t, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 h-full flex flex-col relative group">
                            <Quote className="absolute top-8 right-8 text-slate-100 group-hover:text-blue-50 transition-colors" size={40} />
                            
                            <div className="flex text-amber-400 gap-1 mb-6">
                                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" strokeWidth={0} />)}
                            </div>
                            
                            <p className="text-slate-600 text-[15px] font-medium leading-relaxed italic mb-8 flex-1">
                                "{t.text}"
                            </p>
                            
                            <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[#134e8d] font-bold overflow-hidden">
                                     {/* Simplified avatar placeholder */}
                                     {t.name.split(' ')[0].charAt(0)}{t.name.split(' ')[1].charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#002b45] leading-none mb-1">{t.name}</h4>
                                    <p className="text-[12px] text-slate-400 font-medium">{t.role}</p>
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
    <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-[#134e8d] rounded-[3rem] p-16 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -ml-20 -mb-20" />
                
                <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight relative z-10">
                    Ready to Protect Your Future?
                </h2>
                <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto relative z-10">
                    Join thousands of Indians who have already secured their family's health and assets with Secure Shield.
                </p>
                <div className="relative z-10 pt-6">
                    <Link to="/register" className="inline-flex h-14 px-12 bg-white text-[#134e8d] font-bold rounded-xl items-center hover:bg-slate-50 hover:scale-105 transition-all shadow-xl">
                        Register Now
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="pt-24 pb-12 bg-[#002b45] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-16 mb-20">
                <div className="space-y-8">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white border border-white/20 overflow-hidden relative">
                            <Shield size={22} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">Secure <span className="text-sky-400">Shield</span></span>
                    </Link>
                    <div className="!text-white text-[14px] font-medium leading-[1.8]">
                        Leading insurance platform in India providing innovative and customer-centric insurance solutions. Protecting your legacy with trust and transparency.
                    </div>
                    <div className="flex gap-4">
                        {[Facebook, Twitter, Instagram].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#134e8d] transition-all border border-white/5 hover:scale-110">
                                <Icon size={18} strokeWidth={2} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[14px] font-bold text-white/90 uppercase tracking-widest mb-10">Quick Links</h4>
                    <ul className="space-y-4">
                        {["Home", "About Us", "Our Policies", "Careers", "Contact Support"].map(l => (
                            <li key={l}><a href="#" className="text-slate-300 hover:text-white text-[14px] font-semibold transition-all">{l}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-[14px] font-bold text-white/90 uppercase tracking-widest mb-10">Policies</h4>
                    <ul className="space-y-4">
                        {["Health Insurance", "Life Insurance", "Vehicle Insurance", "Home Insurance", "Travel Insurance"].map(l => (
                            <li key={l}><a href="#" className="text-slate-300 hover:text-white text-[14px] font-semibold transition-all">{l}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-[14px] font-bold text-white/90 uppercase tracking-widest mb-10">Contact</h4>
                    <ul className="space-y-6">
                        <li className="flex gap-4 text-slate-100">
                            <MapPin size={20} className="text-sky-400 shrink-0" />
                            <span className="text-[14px] font-semibold">123 Finance Tower, BKC, Mumbai, Maharashtra 400051</span>
                        </li>
                        <li className="flex gap-4 text-slate-100">
                            <Phone size={20} className="text-sky-400 shrink-0" />
                            <span className="text-[14px] font-semibold">1800-SECURE-SHIELD</span>
                        </li>
                        <li className="flex gap-4 text-slate-100">
                            <Mail size={20} className="text-sky-400 shrink-0" />
                            <span className="text-[14px] font-semibold">support@secureshield.in</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="!text-slate-400 text-[12px] font-semibold tracking-wide">© 2024 Secure Shield Insurance Services. All rights reserved.</div>
                <div className="flex gap-8 !text-slate-400 text-[12px] font-semibold tracking-wide">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Help Center</a>
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
