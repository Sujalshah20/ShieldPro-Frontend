import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ChevronRight, Star, CheckCircle2, Clock, ShieldCheck, ArrowRight, User } from "lucide-react";
import Reveal from "../components/common/Reveal";
import AnimatedBackground from "../components/common/AnimatedBackground";

const Home = () => {
    return (
        <div className="relative min-h-screen bg-background overflow-x-hidden">
            <AnimatedBackground>
                {/* Navbar */}
                <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-border/50 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gold rounded-xl shadow-lg shadow-gold/20">
                                <Shield className="w-6 h-6 text-gold-foreground" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Shield<span className="text-gold">Pro</span></span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-70">
                            <a href="#features" className="hover:text-gold transition-colors">Features</a>
                            <a href="#testimonials" className="hover:text-gold transition-colors">Testimonials</a>
                            <a href="#about" className="hover:text-gold transition-colors">About</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Login</Link>
                            <Link to="/register" className="btn-gold px-6 py-2.5 rounded-xl text-sm transition-all transform hover:scale-105">
                                Join Now
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative z-10 text-left">
                            <Reveal direction="down">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-6">
                                    <Star className="w-3 h-3 fill-gold" />
                                    Premium Insurance Solutions
                                </div>
                            </Reveal>

                            <Reveal direction="left" delay={0.2}>
                                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
                                    Your Future <br />
                                    <span className="text-gold">Fully Protected</span>
                                </h1>
                            </Reveal>

                            <Reveal direction="left" delay={0.3}>
                                <p className="text-lg opacity-60 mb-10 max-w-xl font-medium leading-relaxed">
                                    Experience the next generation of insurance management. Secure, transparent, and built for your peace of mind. ShieldPro provides elite protection for what matters most.
                                </p>
                            </Reveal>

                            <Reveal direction="up" delay={0.4}>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/register" className="btn-gold px-8 py-4 rounded-2xl flex items-center gap-2 group">
                                        Get Started Now
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <button className="px-8 py-4 rounded-2xl glass border-border/50 font-bold hover:bg-card/50 transition-colors flex items-center gap-2">
                                        View Policies
                                    </button>
                                </div>
                            </Reveal>

                            <Reveal direction="up" delay={0.5}>
                                <div className="mt-12 flex items-center gap-6 opacity-50 text-sm font-bold grayscale hover:grayscale-0 transition-all duration-500">
                                    <span>TRUSTED BY</span>
                                    <div className="h-px w-10 bg-current"></div>
                                    <div className="flex gap-4 uppercase tracking-tighter italic">
                                        <span>MetLife</span>
                                        <span>Allianz</span>
                                        <span>AXA</span>
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        <div className="relative">
                            <Reveal direction="right" delay={0.4}>
                                <div className="relative z-10 min-h-[400px] md:min-h-[500px] flex items-center justify-center">
                                    {/* Abstract Shield Illustration Placeholder / Lottie container could go here */}
                                    <div className="relative w-72 h-72 md:w-96 md:h-96">
                                        <div className="absolute inset-0 bg-gold/20 rounded-full blur-[80px] animate-pulse"></div>
                                        <div className="relative z-10 w-full h-full glass-premium rounded-[3rem] border-2 border-gold/30 flex items-center justify-center rotate-6 hover:rotate-0 transition-transform duration-700 overflow-hidden group">
                                            <Shield className="w-40 h-40 text-gold drop-shadow-[0_0_20px_rgba(255,184,0,0.4)] group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-4 right-4 p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                                <CheckCircle2 className="text-gold w-6 h-6" />
                                            </div>
                                            <div className="absolute bottom-10 left-6 text-left">
                                                <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1 text-white">Trust Score</p>
                                                <p className="text-3xl font-black text-white">99.9%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 px-6 relative overflow-hidden bg-card/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <Reveal direction="down">
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Advanced Protection Ecosystem</h2>
                                <div className="h-1.5 w-24 bg-gold mx-auto rounded-full mb-6"></div>
                                <p className="opacity-60 max-w-2xl mx-auto font-medium">We've combined cuting-edge technology with decades of insurance expertise.</p>
                            </Reveal>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: ShieldCheck, title: "Secure Blockchain Claims", desc: "Every claim is verified and stored on a private ledger for ultimate transparency." },
                                { icon: Clock, title: "Instant Approvals", desc: "Our AI-driven processing allows for rapid claim resolution in minutes, not weeks." },
                                { icon: Activity, title: "Real-time Analytics", desc: "Monitor your coverage and premium health with interactive performance dashboards." }
                            ].map((feat, idx) => (
                                <Reveal key={idx} delay={idx * 0.1} direction="up">
                                    <div className="p-8 glass-premium rounded-3xl border border-border/50 hover:border-gold/30 transition-all group">
                                        <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 text-gold group-hover:bg-gold group-hover:text-gold-foreground transition-all">
                                            <feat.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                                        <p className="opacity-60 text-sm leading-relaxed">{feat.desc}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                            <Reveal direction="left">
                                <div>
                                    <h2 className="text-5xl font-black tracking-tight mb-4">Trusted <span className="text-gold">Voices</span></h2>
                                    <p className="opacity-60 font-medium">See what our most protected customers have to say.</p>
                                </div>
                            </Reveal>
                            <Reveal direction="right">
                                <button className="flex items-center gap-2 font-bold text-gold hover:translate-x-2 transition-transform">
                                    Read All Stories <ArrowRight className="w-5 h-5" />
                                </button>
                            </Reveal>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { name: "Arjun Sharma", role: "Business Owner", quote: "ShieldPro's claim process is revolutionary. I filed my vehicle claim and had approval within 4 hours. No paperwork, no stress." },
                                { name: "Priya Patel", role: "Software Architect", quote: "The dashboard analytics helped me realize I was under-insured. The transparency here is unlike any other provider." },
                                { name: "Kunal Mehra", role: "Health Specialist", quote: "A truly premium experience. From the 3D-inspired UI to the lightning-fast support, ShieldPro is the future." }
                            ].map((t, idx) => (
                                <Reveal key={idx} delay={idx * 0.1} direction="up">
                                    <div className="p-10 glass-premium rounded-[2.5rem] border border-border/50 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Star className="w-20 h-20 fill-current" />
                                        </div>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg">{t.name}</h4>
                                                <p className="text-xs uppercase tracking-widest text-gold font-bold">{t.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-lg opacity-70 italic font-medium leading-relaxed">"{t.quote}"</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Footer Section */}
                <section className="py-20 px-6">
                    <div className="max-w-5xl mx-auto glass-premium p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden border-2 border-gold/20">
                        <div className="absolute inset-0 bg-gold/5 animate-pulse"></div>
                        <Reveal direction="down">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to join the <br /><span className="text-gold">Elite Protected?</span></h2>
                        </Reveal>
                        <Reveal direction="up" delay={0.2}>
                            <Link to="/register" className="btn-gold px-12 py-5 rounded-2xl text-xl inline-flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-gold/40">
                                Get Started <Shield className="w-6 h-6" />
                            </Link>
                        </Reveal>
                        <div className="mt-12 flex justify-center gap-8 opacity-40">
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Secure</span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Fast</span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Premium</span>
                        </div>
                    </div>
                </section>

                {/* Small Footer */}
                <footer className="py-12 border-t border-border/30 px-6 text-center opacity-40 text-[10px] font-bold uppercase tracking-widest">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <span>&copy; 2026 SHIELDPRO GLOBAL PROTECTION</span>
                        <div className="flex gap-6">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">Support</a>
                        </div>
                    </div>
                </footer>
            </AnimatedBackground>
        </div>
    );
};

export default Home;
