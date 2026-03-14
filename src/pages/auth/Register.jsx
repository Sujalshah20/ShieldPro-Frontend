import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, User, Mail, Lock, Phone, Calendar, 
    MapPin, Users, ArrowRight, ArrowLeft, CheckCircle2, 
    AlertCircle, Info, ShieldCheck, Zap, Fingerprint,
    Compass, Globe, ChevronDown
} from "lucide-react";
import { z } from "zod";
import Reveal from "../../components/common/Reveal";
import HeroScene from "../../components/3d/HeroScene";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Must contain an uppercase letter").regex(/[0-9]/, "Must contain a number"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    dob: z.string().min(1, "Date of Birth is required"),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z.string().min(5, "Address must be at least 5 characters"),
});

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
        gender: "Male",
        address: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passStrength, setPassStrength] = useState(0);

    const navigate = useNavigate();
    const { register } = useAuth();

    // Password strength logic
    useEffect(() => {
        let strength = 0;
        if (formData.password.length >= 8) strength += 25;
        if (/[A-Z]/.test(formData.password)) strength += 25;
        if (/[0-9]/.test(formData.password)) strength += 25;
        if (/[!@#$%^&*]/.test(formData.password)) strength += 25;
        setPassStrength(strength);
    }, [formData.password]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.email || formData.password.length < 8) {
                setError("Protocol Violation: Secure account details required.");
                return;
            }
        } else if (step === 2) {
            if (!formData.phone || !formData.dob) {
                setError("Protocol Violation: Contact & birth parameters required.");
                return;
            }
        }
        setStep(prev => prev + 1);
        setError("");
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            registerSchema.parse(formData);
            await register(formData);
            navigate("/login");
        } catch (err) {
            const zodMessage = err?.errors?.[0]?.message;
            const apiMessage = err?.message;
            setError(zodMessage || apiMessage || "Synchronization failed. Protocol interrupted.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[4px] italic ml-1">PHASE 01: OPERATOR IDENTITY</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="FULL LEGAL NAME"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-14 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-xs uppercase tracking-widest text-header-bg shadow-sm"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="AUTH EMAIL ADDRESS"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-14 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-xs uppercase tracking-widest text-header-bg shadow-sm"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="SECURE PASSWORD"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-14 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-xs uppercase tracking-widest text-header-bg shadow-sm"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="px-1 pt-2">
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1 shadow-inner">
                                    <div 
                                        className={`h-full transition-all duration-700 ${
                                            passStrength <= 25 ? 'bg-rose-500 w-1/4 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 
                                            passStrength <= 50 ? 'bg-amber-500 w-2/4 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 
                                            passStrength <= 75 ? 'bg-primary w-3/4 shadow-[0_0_10px_rgba(0,126,168,0.4)]' : 'bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                        }`}
                                        style={{ width: `${passStrength}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-400 flex items-center gap-2 italic">
                                        <ShieldCheck className="w-3 h-3 text-primary" strokeWidth={3} />
                                        SECURITY STRENGTH: {passStrength <= 25 ? 'VULNERABLE' : passStrength <= 50 ? 'MODERATE' : passStrength <= 75 ? 'ROBUST' : 'MAXIMUM'}
                                    </p>
                                    <span className="text-[9px] font-black text-primary opacity-60">{passStrength}%</span>
                                </div>
                            </div>
                        </div>
                        <button type="button" onClick={nextStep} className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[4px] shadow-2xl shadow-primary/20 hover:bg-header-bg transition-all flex items-center justify-center gap-4 active:scale-95">
                            NEXT PHASE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                        </button>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[4px] italic ml-1">PHASE 02: PERSONAL ATTRIBUTES</label>
                            <div className="relative group">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="CONTACT NUMBER"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-14 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-xs uppercase tracking-widest text-header-bg shadow-sm"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="dob"
                                    type="date"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-14 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-xs uppercase tracking-widest text-header-bg shadow-sm"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <select
                                    name="gender"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-14 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-xs uppercase tracking-widest text-header-bg appearance-none cursor-pointer shadow-sm"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="Male">MALE OPERATOR</option>
                                    <option value="Female">FEMALE OPERATOR</option>
                                    <option value="Other">OTHER CLASSIFICATION</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="button" onClick={prevStep} className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                                <ArrowLeft className="w-6 h-6 text-primary" strokeWidth={3} />
                            </button>
                            <button type="button" onClick={nextStep} className="flex-1 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[4px] shadow-2xl shadow-primary/20 hover:bg-header-bg transition-all flex items-center justify-center gap-4 active:scale-95">
                                CONTINUE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                            </button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[4px] italic ml-1">PHASE 03: DEPLOYMENT ZONE</label>
                            <div className="relative group">
                                <MapPin className="absolute left-6 top-6 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <textarea
                                    name="address"
                                    placeholder="RESIDENTIAL HEADQUARTERS ADDRESS"
                                    rows="4"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-14 py-6 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-xs uppercase tracking-widest text-header-bg resize-none no-scrollbar shadow-sm"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="button" onClick={prevStep} className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                                <ArrowLeft className="w-6 h-6 text-primary" strokeWidth={3} />
                            </button>
                            <button type="submit" disabled={isLoading} className="flex-1 py-5 bg-accent text-header-bg rounded-2xl font-black text-[10px] uppercase tracking-[4px] shadow-2xl shadow-accent/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4 active:scale-95">
                                {isLoading ? "ENCRYPTING..." : "INITIALIZE SHIELD"}
                                {!isLoading && <CheckCircle2 className="w-5 h-5" strokeWidth={3} />}
                            </button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-full bg-background-main flex items-center justify-center p-6 relative overflow-hidden font-display">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <HeroScene />
            </div>
            
            <div className="auth-container w-full max-w-5xl flex flex-col md:flex-row bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden relative z-10 transition-all duration-700">
                 {/* Left Panel: Brand Asset */}
                 <div className="hidden md:flex md:w-[45%] bg-header-bg p-16 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-[-10%] opacity-10 pointer-events-none scale-150">
                        <Compass size={300} className="text-primary animate-spin-slow" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-12 border border-white/10 shadow-xl shadow-primary/20">
                            <Shield size={40} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter text-white uppercase leading-none mb-6">
                            SECURE<br/><span className="text-primary">SHIELD</span>
                        </h2>
                        <div className="h-1.5 w-16 bg-accent rounded-full mb-10" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-[4px] leading-loose">
                            DEPLOYING NEXT-GENERATION PROTECTION PROTOCOLS FOR GLOBAL ASSET SECURITY.
                        </p>
                    </div>
                    
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-6 group">
                             <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/5 group-hover:bg-primary group-hover:border-primary/50 transition-all transform group-hover:rotate-12 shadow-sm">
                                <Fingerprint size={24} strokeWidth={2} />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">BIOMETRIC INTEGRITY</span>
                        </div>
                        <div className="flex items-center gap-6 group">
                             <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/5 group-hover:bg-primary group-hover:border-primary/50 transition-all transform group-hover:rotate-[-12deg] shadow-sm">
                                <Globe size={24} strokeWidth={2} />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">GLOBAL NETWORK REACH</span>
                        </div>
                    </div>
                 </div>

                 {/* Right Panel: Operator Registration */}
                 <div className="flex-1 p-12 md:p-20">
                    <Reveal width="100%" direction="down">
                        <div className="flex flex-col mb-16">
                            <h1 className="text-4xl font-black tracking-tighter text-header-bg uppercase leading-none">JOIN <span className="text-primary">SECURE SHIELD</span></h1>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[5px] mt-4">Initialize operator enlistment sequence</p>
                        </div>

                        {/* Progress Tracker */}
                        <div className="flex gap-4 mb-16">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden relative shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: step >= i ? '100%' : '0%' }}
                                        className={`h-full ${step > i ? 'bg-primary' : step === i ? 'bg-primary animate-pulse' : 'bg-transparent'}`}
                                        transition={{ duration: 0.8 }}
                                    />
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <form onSubmit={handleSubmit} className="relative">
                        <AnimatePresence mode="wait">
                            {renderStep()}
                        </AnimatePresence>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-6 text-rose-500 bg-rose-50 p-6 rounded-2xl border border-rose-100 text-[9px] font-black uppercase tracking-[3px] mt-12 shadow-xl"
                            >
                                <AlertCircle className="w-6 h-6 flex-shrink-0" strokeWidth={3} />
                                {error}
                            </motion.div>
                        )}
                    </form>

                    <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
                        <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">
                            Already enlisted? <Link to="/login" className="text-primary hover:text-header-bg transition-colors ml-3 underline decoration-primary/20 hover:decoration-header-bg/40 underline-offset-4">AUTHENTICATE HERE</Link>
                        </p>
                        <div className="flex items-center gap-6 opacity-20 transform hover:scale-110 transition-transform cursor-help">
                            <Zap size={20} className="text-primary" />
                            <div className="w-px h-8 bg-slate-300" />
                            <Fingerprint size={20} className="text-header-bg" />
                        </div>
                    </div>
                 </div>
            </div>
            
            {/* Ambient Glare */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow" />
        </div>
    );
};

export default Register;
