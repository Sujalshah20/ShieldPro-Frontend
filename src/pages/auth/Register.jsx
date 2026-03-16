import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Mail, Lock, User, Phone, 
    Calendar, MapPin, ArrowRight, ArrowLeft,
    Loader2, CheckCircle2, ShieldCheck,
    Globe, Activity, ChevronRight, Fingerprint, Terminal, Satellite, Layers, RefreshCcw, Database, Zap
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { z } from "zod";
import Reveal from "../../components/common/Reveal";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    dob: z.string().min(1, "Date of Birth is required"),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z.string().min(5, "Address must be at least 5 characters"),
});

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "", email: "", password: "",
        phone: "", dob: "", gender: "Male",
        address: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            registerSchema.parse(formData);
            await register(formData);
            toast({ 
                title: "REGISTRATION_SUCCESSFUL", 
                description: "Account nodes initialized successfully. Proceed to login for synchronization.", 
                variant: "default" 
            });
            navigate("/login");
        } catch (error) {
            toast({ 
                title: "REGISTRATION_FAILURE", 
                description: error.message || "Operational anomaly detected during node initialization.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 md:p-12 font-display relative overflow-hidden">
             {/* Dynamic Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
            <div className="absolute top-[-20%] left-[-15%] w-[900px] h-[900px] bg-[#007ea7]/10 blur-[200px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-15%] w-[800px] h-[800px] bg-[#003249]/5 blur-[180px] rounded-full pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white via-transparent to-transparent pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 40 }}
                className="w-full max-w-7xl bg-white/70 backdrop-blur-3xl rounded-[6rem] shadow-4xl flex flex-col lg:flex-row overflow-hidden border-8 border-white relative z-10 min-h-[950px]"
            >
                {/* Brand & Mission Sentinel - Sidebar */}
                <div className="hidden lg:flex w-[40%] bg-[#003249] p-24 flex-col justify-between relative overflow-hidden text-white border-r-8 border-white">
                    <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#007ea7_1px,transparent_0)] [background-size:45px_45px]" />
                    <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#007ea7]/20 blur-[100px] rounded-full animate-pulse" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-10 mb-32 group">
                             <div className="w-24 h-24 bg-[#007ea7] rounded-[2.5rem] flex items-center justify-center text-[#003249] shadow-4xl group-hover:rotate-[360deg] transition-all duration-[2000ms] border-4 border-white/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                                <Shield size={52} strokeWidth={3} className="relative z-10" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-black tracking-tighter italic leading-none">Shield<span className="text-[#80ced7]">Pro</span></span>
                                <span className="text-[10px] font-black uppercase tracking-[8px] text-white/30 mt-2 italic">SECTOR_CORE_INITIALIZER</span>
                            </div>
                        </Link>

                        <div className="space-y-20 mt-20">
                            <Reveal direction="left" delay={0.2}>
                                <h2 className="text-white text-7xl font-black leading-tight uppercase tracking-tighter italic">
                                    Initialize <br />
                                    Your <span className="text-[#80ced7] underline decoration-[12px] decoration-[#007ea7]/40 underline-offset-[25px]">Secure</span> <br />
                                    Profile_
                                </h2>
                            </Reveal>
                            <Reveal direction="left" delay={0.4}>
                                <p className="text-[#80ced7] font-black uppercase tracking-[8px] leading-loose text-[16px] italic opacity-40 max-w-sm">
                                    Establish your presence on the global tactical grid. Experience the next evolution of unified asset protection.
                                </p>
                            </Reveal>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-12">
                        <div className="grid grid-cols-1 gap-10">
                            {[
                                { icon: Globe, label: "GLOBAL_SECURITY_INFRA", sub: "V4.2_SIGMA_READY" },
                                { icon: Activity, label: "QUANTUM_RISK_SYNC", sub: "ACTIVE_MONITORING" },
                                { icon: Database, label: "ENC_ARCHIVAL_NODES", sub: "ZERO_KNOWLEDGE_AUTH" }
                            ].map((item, i) => (
                                <Reveal key={i} direction="up" delay={0.6 + (i * 0.1)}>
                                    <div className="flex items-center gap-8 group/stat cursor-help">
                                        <div className="w-16 h-16 bg-white/5 border-2 border-white/10 rounded-2xl flex items-center justify-center text-[#007ea7] shadow-xl group-hover/stat:rotate-12 group-hover/stat:bg-white/10 transition-all duration-700">
                                            <item.icon size={28} strokeWidth={3} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-black uppercase tracking-[6px] text-white/60 italic leading-none mb-1">{item.label}</span>
                                            <span className="text-[9px] font-black uppercase tracking-[4px] text-white/20 italic">{item.sub}</span>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                        <div className="pt-10 border-t-4 border-white/5 flex items-center justify-between opacity-30">
                            <Satellite size={32} className="animate-spin-slow" strokeWidth={2} />
                            <span className="text-[10px] font-black uppercase tracking-[10px] italic">NOMINAL_TX_GRID_STATE</span>
                        </div>
                    </div>
                </div>

                {/* Form Intake Protocol - Right Side */}
                <div className="w-full lg:w-[60%] p-14 md:p-32 flex flex-col justify-center bg-white relative overflow-y-auto no-scrollbar group">
                    <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-[12000ms] -rotate-12">
                        <Layers size={650} strokeWidth={1} className="text-[#003249]" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-r from-transparent via-[#007ea7]/20 to-transparent animate-shimmer pointer-events-none opacity-40" />

                    <div className="mb-24 relative z-10">
                        <Reveal direction="up">
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 border-b-8 border-slate-50 pb-16">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-10">
                                        <div className="w-4 h-14 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                                        <h3 className="text-[16px] font-black text-[#007ea7] uppercase tracking-[15px] italic leading-none">Register_Node_NODE://0{step}</h3>
                                    </div>
                                    <h1 className="text-7xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Request_Access<span className="text-[#007ea7]">_</span></h1>
                                </div>
                                <div className="flex gap-4">
                                     {[1, 2, 3].map(s => (
                                         <div key={s} className={`w-6 h-6 rounded-full transition-all duration-700 ${s === step ? 'bg-[#007ea7] scale-150 shadow-[0_0_15px_#007ea7]' : s < step ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                                     ))}
                                </div>
                            </div>
                        </Reveal>
                        <Reveal direction="up" delay={0.2} className="mt-8">
                            <p className="text-[15px] font-black text-slate-300 uppercase tracking-[10px] italic leading-relaxed opacity-60">
                                PHASE_0{step}_OF_03: {step === 1 ? 'Primary_ID_Mapping' : step === 2 ? 'Biological_Metadata' : 'Sector_Coordinates'}
                            </p>
                        </Reveal>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-14 relative z-10 max-w-3xl">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                                    transition={{ type: "spring", stiffness: 60 }}
                                    className="space-y-16"
                                >
                                    <div className="space-y-10 group/input">
                                        <label className="text-[14px] font-black text-[#007ea7] uppercase tracking-[15px] italic ml-12 leading-none flex items-center gap-10">
                                            <User size={24} strokeWidth={3} /> LEGAL_IDENTITY_NAME
                                        </label>
                                        <div className="relative">
                                            <input 
                                                name="name" value={formData.name} onChange={handleInputChange}
                                                className="w-full h-28 bg-slate-50 border-4 border-slate-50 rounded-[3.5rem] px-16 text-[18px] font-black text-[#003249] uppercase tracking-[8px] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic"
                                                placeholder="ENTER_IDENTITY_FULLNAME" required
                                            />
                                            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[#007ea7] opacity-0 group-focus-within/input:opacity-100 transition-opacity"><Fingerprint size={28} strokeWidth={3} /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-10 group/input">
                                        <label className="text-[14px] font-black text-[#007ea7] uppercase tracking-[15px] italic ml-12 leading-none flex items-center gap-10">
                                            <Mail size={24} strokeWidth={3} /> SECURITY_UPLINK_EMAIL
                                        </label>
                                        <input 
                                            name="email" value={formData.email} onChange={handleInputChange}
                                            className="w-full h-28 bg-slate-50 border-4 border-slate-50 rounded-[3.5rem] px-16 text-[18px] font-black text-[#003249] uppercase tracking-[6px] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic"
                                            placeholder="IDENTITY@COMPANY.GRID" required
                                        />
                                    </div>
                                    <div className="space-y-10 group/input">
                                        <label className="text-[14px] font-black text-[#007ea7] uppercase tracking-[15px] italic ml-12 leading-none flex items-center gap-10">
                                            <Lock size={24} strokeWidth={3} /> ACCESS_KEY_SIGMA
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="password" name="password" value={formData.password} onChange={handleInputChange}
                                                className="w-full h-28 bg-[#003249] border-8 border-white rounded-[3.5rem] px-16 text-[18px] font-black text-[#80ced7] uppercase tracking-[20px] outline-none focus:border-[#007ea7] transition-all shadow-4xl italic"
                                                placeholder="••••••••" required
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-r from-transparent via-[#007ea7] to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-1000" />
                                        </div>
                                    </div>
                                    <button type="button" onClick={nextStep} className="w-full h-32 bg-[#003249] text-[#80ced7] rounded-[4.5rem] text-[22px] font-black uppercase tracking-[30px] shadow-4xl active:scale-95 flex items-center justify-center gap-16 group/btn italic transition-all duration-1000 border-8 border-white hover:text-white hover:border-[#007ea7]/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                                        <span className="relative z-10 flex items-center gap-12">CONTINUE_MAPPING <ArrowRight size={56} className="group-hover/btn:translate-x-12 transition-transform duration-1000" strokeWidth={5} /></span>
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                                    transition={{ type: "spring", stiffness: 60 }}
                                    className="space-y-16"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                        <div className="space-y-10">
                                            <label className="text-[14px] font-black text-[#007ea7] uppercase tracking-[15px] italic ml-12 leading-none flex items-center gap-10">
                                                <Calendar size={24} strokeWidth={3} /> ORIGIN_DATE
                                            </label>
                                            <input 
                                                type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                                                className="w-full h-28 bg-slate-50 border-4 border-slate-50 rounded-[3.5rem] px-16 text-[18px] font-black text-[#003249] uppercase tracking-[6px] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic" required
                                            />
                                        </div>
                                        <div className="space-y-10 group/select">
                                            <label className="text-[14px] font-black text-[#007ea7] uppercase tracking-[15px] italic ml-12 leading-none flex items-center gap-10">
                                                <Layers size={24} strokeWidth={3} /> BIOMETRIC_ID
                                            </label>
                                            <div className="relative">
                                                <select 
                                                    name="gender" value={formData.gender} onChange={handleInputChange}
                                                    className="w-full h-28 bg-slate-50 border-4 border-slate-50 rounded-[3.5rem] px-16 text-[18px] font-black text-[#003249] uppercase tracking-[10px] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic appearance-none cursor-pointer"
                                                >
                                                    <option value="Male">MALE_NODE</option>
                                                    <option value="Female">FEMALE_NODE</option>
                                                    <option value="Other">EXT_NODE</option>
                                                </select>
                                                <ChevronRight className="absolute right-12 top-1/2 -translate-y-1/2 text-[#007ea7] rotate-90" size={32} strokeWidth={5} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-10">
                                        <label className="text-[14px] font-black text-[#007ea7] uppercase tracking-[15px] italic ml-12 leading-none flex items-center gap-10">
                                            <Phone size={24} strokeWidth={3} /> TACTICAL_COMM_LINK
                                        </label>
                                        <div className="relative group/input">
                                            <input 
                                                name="phone" value={formData.phone} onChange={handleInputChange}
                                                className="w-full h-28 bg-slate-50 border-4 border-slate-50 rounded-[3.5rem] px-16 text-[18px] font-black text-[#003249] uppercase tracking-[10px] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic"
                                                placeholder="+91 XXXXX XXXXX" required
                                            />
                                            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[#007ea7] opacity-0 group-focus-within/input:opacity-100 transition-opacity"><Zap size={28} strokeWidth={3} className="animate-pulse" /></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-12">
                                        <button type="button" onClick={prevStep} className="w-32 h-32 border-8 border-slate-50 rounded-[3.5rem] flex items-center justify-center text-[#003249] hover:bg-[#003249] hover:text-white transition-all duration-700 active:scale-95 shadow-4xl group">
                                            <ArrowLeft size={48} className="group-hover:-translate-x-4 transition-transform duration-700" strokeWidth={5} />
                                        </button>
                                        <button type="button" onClick={nextStep} className="flex-1 bg-[#003249] text-[#80ced7] h-32 rounded-[3.5rem] flex items-center justify-center gap-16 font-black text-[22px] uppercase tracking-[20px] shadow-4xl active:scale-95 group/btn transition-all duration-1000 border-8 border-white hover:text-white hover:border-[#007ea7]/20 italic relative overflow-hidden">
                                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                                            <span className="relative z-10 flex items-center gap-12">CONTINUE_SYNC <ArrowRight size={56} strokeWidth={5} /></span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                                    transition={{ type: "spring", stiffness: 60 }}
                                    className="space-y-16"
                                >
                                    <div className="space-y-10">
                                        <label className="text-[14px] font-black text-[#007ea7] uppercase tracking-[15px] italic ml-12 leading-none flex items-center gap-10">
                                            <MapPin size={24} strokeWidth={3} /> PERIMETER_GRID_COORDS
                                        </label>
                                        <div className="relative group/input">
                                            <textarea 
                                                name="address" value={formData.address} onChange={handleInputChange}
                                                className="w-full bg-slate-50 border-4 border-slate-50 rounded-[4rem] p-16 text-[18px] font-black text-[#003249] uppercase tracking-[6px] outline-none focus:border-[#007ea7] focus:bg-white h-64 resize-none shadow-inner italic no-scrollbar"
                                                placeholder="ENTER_GRID_POSITION_AND_SECTOR_IDENT..." required
                                            />
                                            <Globe className="absolute right-12 bottom-12 text-[#007ea7] opacity-20 group-focus-within/input:opacity-100 group-focus-within/input:rotate-[360deg] transition-all duration-[3000ms]" size={48} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <div className="flex gap-12">
                                        <button type="button" onClick={prevStep} className="w-32 h-32 border-8 border-slate-50 rounded-[3.5rem] flex items-center justify-center text-[#003249] hover:bg-[#003249] hover:text-white transition-all duration-700 active:scale-95 shadow-4xl group">
                                            <ArrowLeft size={48} className="group-hover:-translate-x-4 transition-transform duration-700" strokeWidth={5} />
                                        </button>
                                        <button type="submit" disabled={isLoading} className="flex-1 bg-[#007ea7] text-white h-32 rounded-[4rem] flex items-center justify-center gap-16 font-black text-[22px] uppercase tracking-[25px] hover:bg-[#003249] hover:text-[#80ced7] transition-all duration-1000 active:scale-95 shadow-4xl group/btn italic relative overflow-hidden border-8 border-white">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
                                            <span className="relative z-10 flex items-center gap-12">
                                                {isLoading ? <RefreshCcw className="animate-spin" size={56} strokeWidth={5} /> : <>DEPLY_NODE_SYNC <CheckCircle2 size={56} strokeWidth={5} /></>}
                                            </span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div className="mt-24 pt-16 border-t-8 border-slate-50 relative z-10 flex flex-col items-center gap-10">
                        <Reveal direction="up" delay={1}>
                            <p className="text-[15px] font-black text-slate-300 uppercase tracking-[8px] italic text-center leading-none group/loginlink">
                                Already Identified in the Grid? <Link to="/login" className="text-[#007ea7] hover:underline ml-6 decoration-8 decoration-[#007ea7]/10 underline-offset-8 transition-all">Authorize_Terminal_Access</Link>
                            </p>
                        </Reveal>
                        <div className="flex items-center gap-16 opacity-30 italic">
                             {[
                                { icon: Fingerprint, label: "VERIFIED" },
                                { icon: Activity, label: "STABLE" },
                                { icon: ShieldCheck, label: "SECURE" }
                             ].map((status, i) => (
                                <div key={i} className="flex items-center gap-6 group/badge">
                                    <status.icon size={24} strokeWidth={3} className="text-[#007ea7] group-hover/badge:rotate-[360deg] transition-all duration-[1500ms]" />
                                    <span className="text-[12px] font-black uppercase tracking-[6px] group-hover/badge:text-[#003249] transition-colors">{status.label}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
