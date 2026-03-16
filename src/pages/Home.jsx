import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Check, Menu, X, ArrowRight, Activity, 
    Heart, Car, Home as HomeIcon, Plane, Briefcase, 
    Lock, Zap, Clock, Star, MapPin, Phone, Mail, 
    Facebook, Twitter, Instagram, Linkedin, 
    Search, UserPlus, FileCheck, HelpCircle, ChevronRight, Globe, TrendingUp
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
        <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
            scrolled ? 'h-20 bg-white shadow-md' : 'h-24 bg-white/10 backdrop-blur-sm shadow-none lg:bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-6">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#002b45] rounded-lg flex items-center justify-center text-white">
                        <Shield size={24} />
                    </div>
                    <span className="text-2xl font-bold text-[#002b45]">Secure Shield</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">
                    {["Home", "About Us", "Policies", "Contact Us"].map((item) => (
                        <a key={item} href="#" className="text-[15px] font-semibold text-[#002b45] hover:text-[#10b981] transition-colors">
                            {item.toUpperCase()}
                        </a>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link to="/login" className="px-6 py-2 border-2 border-[#002b45] text-[#002b45] font-bold rounded-lg hover:bg-slate-50 transition-all text-sm">
                        Login
                    </Link>
                    <Link to="/register" className="px-6 py-2 bg-[#002b45] text-white font-bold rounded-lg hover:bg-[#003a5c] transition-all shadow-lg text-sm">
                        Register
                    </Link>
                </div>

                {/* Mobile Menu Trigger */}
                <button className="lg:hidden text-[#002b45]" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-0 w-full bg-white shadow-xl p-8 flex flex-col gap-6 lg:hidden"
                    >
                        {["Home", "About Us", "Policies", "Contact Us"].map((item) => (
                            <a key={item} href="#" className="text-lg font-bold text-[#002b45]">{item}</a>
                        ))}
                        <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                            <Link to="/login" className="px-6 py-3 border-2 border-[#002b45] text-[#002b45] font-bold rounded-lg text-center">Login</Link>
                            <Link to="/register" className="px-6 py-3 bg-[#002b45] text-white font-bold rounded-lg text-center shadow-lg">Register</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const HeroSection = () => (
    <section className="relative min-h-[90vh] flex items-center pt-24 bg-gradient-to-br from-[#134e8d] to-[#002b45] overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <Reveal direction="left">
                <div className="space-y-8">
                    <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <span className="text-white text-xs font-bold tracking-widest uppercase">India's Trusted Insurance Platform</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                        Protect What <br />
                        <span className="text-[#10b981]">Matters Most</span>
                    </h1>
                    <p className="text-white/70 text-lg md:text-xl max-w-lg leading-relaxed">
                        Comprehensive insurance solutions tailored for your lifestyle. Join over 10,000+ families securing their future with us today.
                    </p>
                    <div className="flex flex-wrap gap-5">
                        <Link to="/register" className="px-8 py-4 bg-[#10b981] text-white font-bold rounded-xl flex items-center gap-3 hover:bg-[#0da371] hover:translate-y-[-2px] transition-all shadow-xl text-lg">
                            Explore Policies <ArrowRight size={20} />
                        </Link>
                        <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg">
                            Get a Quote
                        </button>
                    </div>
                </div>
            </Reveal>

            <Reveal direction="right">
                <div className="relative">
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/10 shadow-4xl relative overflow-hidden group">
                        <div className="aspect-video bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                            <Shield size={120} className="text-white/20" />
                        </div>
                        {/* Decorative Nodes */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#10b981]/10 blur-3xl rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#134e8d]/10 blur-3xl rounded-full" />
                    </div>
                </div>
            </Reveal>
        </div>
        
        {/* Bottom Curve/Transition */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
);

const StatsSection = () => (
    <section className="py-20 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                    { val: "50+", label: "POLICIES", icon: Shield },
                    { val: "10,000+", label: "CUSTOMERS", icon: UserPlus },
                    { val: "99%", label: "CLAIM SETTLEMENT", icon: Check },
                    { val: "100+", label: "PARTNER COMPANIES", icon: Globe }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="text-[#134e8d] mb-4">
                                <s.icon size={32} />
                            </div>
                            <h3 className="text-4xl font-extrabold text-[#002b45]">{s.val}</h3>
                            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">{s.label}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const PolicySection = () => (
    <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#002b45]">Our Policies</h2>
                <p className="text-slate-500 text-lg">Choose from a wide range of insurance products designed to provide you with maximum coverage and peace of mind.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: "Health Insurance", icon: Activity, color: "bg-blue-50 text-blue-500", desc: "Comprehensive health coverage for you and your family, including pre and post-hospitalization." },
                    { title: "Life Insurance", icon: Heart, color: "bg-red-50 text-red-500", desc: "Secure your family's financial future and ensure their dreams are fulfilled even in your absence." },
                    { title: "Vehicle Insurance", icon: Car, color: "bg-orange-50 text-orange-500", desc: "Protection for your cars and bikes against accidents, theft, and natural calamities." },
                    { title: "Home Insurance", icon: HomeIcon, color: "bg-indigo-50 text-indigo-500", desc: "Shield your home and its valuable contents from fire, theft, and other unforeseen risks." },
                    { title: "Travel Insurance", icon: Plane, color: "bg-teal-50 text-teal-500", desc: "Travel the world with complete peace of mind with coverage for medical and travel delays." },
                    { title: "Business Insurance", icon: Briefcase, color: "bg-slate-50 text-slate-500", desc: "Customized insurance solutions for your enterprise to mitigate operational and liability risks." }
                ].map((p, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                            <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center mb-8`}>
                                <p.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#002b45] mb-4">{p.title}</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">{p.desc}</p>
                            <button className="flex items-center gap-2 text-[#002b45] font-bold hover:text-[#10b981] transition-colors group">
                                Learn More <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section className="py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-20 space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#002b45]">How It Works</h2>
                <p className="text-slate-500 text-lg">Get covered in just 4 simple steps.</p>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between gap-12">
                {/* Connector Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-200 hidden md:block -translate-y-12" />
                
                {[
                    { icon: UserPlus, title: "Register", desc: "Create your account with basic details." },
                    { icon: Search, title: "Browse", desc: "Compare plans from top providers." },
                    { icon: MousePointer2, title: "Buy", desc: "Securely purchase your chosen plan." },
                    { icon: Check, title: "Claims", desc: "Hassle-free 24/7 assistance for claims." }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.2}>
                        <div className="relative z-10 flex flex-col items-center flex-1">
                            <div className="w-20 h-20 bg-[#002b45] text-white rounded-full flex items-center justify-center mb-8 shadow-xl">
                                <s.icon size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-[#002b45] mb-2">{s.title}</h4>
                            <p className="text-slate-400 text-sm max-w-[200px]">{s.desc}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const WhyChooseUs = () => (
    <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#002b45]">Why Choose Us</h2>
                <p className="text-slate-500 text-lg">The most reliable choice for insurance in India.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { icon: Lock, title: "100% Secure", desc: "Your data and payments are encrypted with military-grade security." },
                    { icon: Zap, title: "Instant Insurance", desc: "Get your policy documents instantly in your inbox after purchase." },
                    { icon: Clock, title: "24/7 Access", desc: "Manage your policies, download certificates anytime, anywhere." },
                    { icon: Star, title: "Best Rates", desc: "We guarantee competitive premiums and exclusive partner discounts." },
                    { icon: HelpCircle, title: "Expert Support", desc: "Dedicated insurance advisors to help you choose the right coverage." },
                    { icon: Activity, title: "Fast Claim", desc: "Digital-first claim processing for lightning-fast settlements." }
                ].map((f, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-start gap-6 hover:shadow-xl transition-all duration-500">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#134e8d] shrink-0">
                                <f.icon size={24} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-[#002b45]">{f.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const Testimonials = () => (
    <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#002b45] mb-20">What Our Customers Say</h2>
            
            <div className="grid md:grid-cols-4 lg:grid-cols-3 gap-12">
                {[
                    { name: "Sahil Sharma", role: "Business Owner", text: "Secure Shield made finding health insurance so easy. The claim process when my son was hospitalized was completely cashless and smooth." },
                    { name: "Priya Patel", role: "Software Engineer", text: "The vehicle insurance premiums here are the most competitive I've found. Instant policy delivery to my email was the best part." },
                    { name: "Anil Mehta", role: "School Teacher", text: "Trusted service and excellent customer support. They guided me through every step of choosing the right life insurance for my family." }
                ].map((t, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-slate-50 p-10 rounded-[3rem] text-left space-y-6 relative flex flex-col h-full">
                            <div className="flex text-amber-400 gap-1">
                                {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="currentColor" />)}
                            </div>
                            <p className="text-slate-600 italic leading-relaxed flex-1">"{t.text}"</p>
                            <div className="flex items-center gap-4 pt-6 mt-auto border-t border-slate-200">
                                <div className="w-12 h-12 bg-[#134e8d] rounded-full flex items-center justify-center text-white font-bold">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#002b45]">{t.name}</h4>
                                    <p className="text-xs text-slate-400 font-semibold">{t.role}</p>
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
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#134e8d] rounded-[3rem] p-16 md:p-24 text-center space-y-12 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-6">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white">Ready to Protect Your Future?</h2>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">Join thousands of Indians who have already secured their family's health and assets with Secure Shield.</p>
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-6">
                    <Link to="/register" className="px-12 py-5 bg-white text-[#134e8d] font-bold rounded-xl text-xl hover:bg-blue-50 transition-all shadow-xl">
                        Register Now
                    </Link>
                </div>
                <div className="absolute top-0 right-0 p-20 opacity-10">
                    <Shield size={400} />
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="pt-24 pb-12 bg-[#001b2b] text-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-16 mb-20">
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <Shield size={20} className="text-[#10b981]" />
                        </div>
                        <span className="text-xl font-bold">Secure Shield</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-loose">
                        Leading insurance platform in India providing innovative and customer-centric insurance solutions. Protecting your legacy with trust and transparency.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#10b981] transition-all">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-8">Quick Links</h4>
                    <ul className="space-y-4">
                        {["Home", "About Us", "How It Works", "Careers", "Contact Support"].map(l => (
                            <li key={l}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{l}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-8">Policies</h4>
                    <ul className="space-y-4">
                        {["Health Insurance", "Life Insurance", "Vehicle Insurance", "Home Insurance", "Travel Insurance"].map(l => (
                            <li key={l}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{l}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-8">Contact</h4>
                    <ul className="space-y-6">
                        <li className="flex gap-4 text-slate-400 text-sm">
                            <MapPin size={20} className="text-[#10b981] shrink-0" />
                            <span>123 Finance Tower, BKC, Mumbai, Maharashtra 400051</span>
                        </li>
                        <li className="flex gap-4 text-slate-400 text-sm">
                            <Phone size={20} className="text-[#10b981] shrink-0" />
                            <span>1800-SECURE-SHIELD</span>
                        </li>
                        <li className="flex gap-4 text-slate-400 text-sm">
                            <Mail size={20} className="text-[#10b981] shrink-0" />
                            <span>support@secureshield.in</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-500 text-xs">© 2026 Secure Shield Insurance Broking Ltd. All Rights Reserved.</p>
                <div className="flex gap-8 text-slate-500 text-xs uppercase tracking-widest">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookie Policy</a>
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
