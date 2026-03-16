import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Mail, Lock, User, Phone, 
    Calendar, MapPin, ArrowRight, ArrowLeft,
    Loader2, CheckCircle2, ShieldCheck,
    Globe, Activity, ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { z } from "zod";

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
    const { addToast } = useToast();

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
            addToast("Account created successfully. Please login.", "success");
            navigate("/login");
        } catch (error) {
            addToast(error.message || "Registration failed. Please check your details.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#dae5e5] flex items-center justify-center p-6 md:p-12 font-display uppercase tracking-widest">
            <div className="w-full max-w-6xl h-[800px] bg-white rounded-[2rem] shadow-2xl flex overflow-hidden">
                {/* Left Side - Brand Panel */}
                <div className="hidden lg:flex w-1/2 bg-[#012b3f] p-20 flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#0082a1_1px,transparent_0)] [background-size:24px_24px]" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-20">
                            <div className="w-12 h-12 bg-[#0082a1] rounded-lg flex items-center justify-center text-white shadow-xl">
                                <ShieldCheck size={28} />
                            </div>
                            <span className="text-xl font-bold text-white uppercase tracking-[2px]">Secure Shield</span>
                        </div>

                        <h2 className="text-[44px] leading-[1.1] font-extrabold text-white mb-8 tracking-tighter">
                            Comprehensive <br />
                            protection for <br />
                            your future.
                        </h2>
                        <p className="text-lg text-white/50 font-bold lowercase tracking-normal leading-relaxed max-w-sm">
                            Experience the next generation of insurance management. Secure your assets with global reach and local precision.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4 text-white/40">
                            <Globe size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[3px]">Global Security Infrastructure</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/40">
                            <Activity size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[3px]">Real-time Risk Monitoring</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="w-full lg:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white overflow-y-auto no-scrollbar">
                    <div className="mb-12">
                        <h1 className="text-3xl font-extrabold text-[#012b3f] mb-4">Create Your Account</h1>
                        <p className="text-sm text-slate-400 font-bold lowercase tracking-normal">
                            Step {step} of 3: {step === 1 ? 'Account Details' : step === 2 ? 'Personal Info' : 'Contact Details'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 block uppercase tracking-[2px]">Full Name</label>
                                        <input 
                                            name="name" value={formData.name} onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-[#012b3f] focus:outline-none focus:ring-2 focus:ring-[#0082a1]/20 focus:border-[#0082a1] transition-all tracking-normal"
                                            placeholder="Jane Doe" required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 block uppercase tracking-[2px]">Email Address</label>
                                        <input 
                                            name="email" value={formData.email} onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-[#012b3f] focus:outline-none focus:ring-2 focus:ring-[#0082a1]/20 focus:border-[#0082a1] transition-all tracking-normal"
                                            placeholder="name@company.com" required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 block uppercase tracking-[2px]">Password</label>
                                        <input 
                                            type="password" name="password" value={formData.password} onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-[#012b3f] focus:outline-none focus:ring-2 focus:ring-[#0082a1]/20 focus:border-[#0082a1] transition-all tracking-normal"
                                            placeholder="••••••••" required
                                        />
                                    </div>
                                    <button type="button" onClick={nextStep} className="w-full bg-[#0082a1] text-white py-5 rounded-xl flex items-center justify-center gap-4 font-black text-xs hover:bg-[#012b3f] transition-all group">
                                        Continue <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 block uppercase tracking-[2px]">DOB</label>
                                            <input 
                                                type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-[#012b3f] focus:outline-none" required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 block uppercase tracking-[2px]">Gender</label>
                                            <select 
                                                name="gender" value={formData.gender} onChange={handleInputChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-[#012b3f] focus:outline-none"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 block uppercase tracking-[2px]">Phone</label>
                                        <input 
                                            name="phone" value={formData.phone} onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-[#012b3f] focus:outline-none"
                                            placeholder="+1 (555) 000-0000" required
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={prevStep} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50"><ArrowLeft size={24} /></button>
                                        <button type="button" onClick={nextStep} className="flex-1 bg-[#0082a1] text-white py-5 rounded-xl flex items-center justify-center gap-4 font-black text-xs hover:bg-[#012b3f] transition-all">
                                            Continue <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 block uppercase tracking-[2px]">Address</label>
                                        <textarea 
                                            name="address" value={formData.address} onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-[#012b3f] focus:outline-none h-32 resize-none"
                                            placeholder="123 Security St, Shield City" required
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={prevStep} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50"><ArrowLeft size={24} /></button>
                                        <button type="submit" disabled={isLoading} className="flex-1 bg-[#0082a1] text-white py-5 rounded-xl flex items-center justify-center gap-4 font-black text-xs hover:bg-[#012b3f] transition-all">
                                            {isLoading ? <Loader2 className="animate-spin" /> : <>Complete Setup <CheckCircle2 size={18} /></>}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-center">
                        Already have an account? <Link to="/login" className="text-[#0082a1] hover:underline">Sign In Instead</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
