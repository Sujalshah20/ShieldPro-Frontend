import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, User, Mail, Phone, Calendar, 
    MapPin, Globe, CheckCircle2, ChevronRight, ArrowRight, Loader2, ChevronDown
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "", email: "", password: "",
        confirmPassword: "", phone: "", 
        dob: "", gender: "Male", address: "",
        aadhar: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return toast({ 
                title: "Error", 
                description: "Passwords do not match.", 
                variant: "destructive" 
            });
        }

        setIsLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                dob: formData.dob,
                gender: formData.gender,
                address: formData.address,
                nationalId: formData.aadhar
            });
            toast({ 
                title: "Registration Successful", 
                description: "Your account has been created. Please login." 
            });
            navigate("/login");
        } catch (error) {
            toast({ 
                title: "Registration Failed", 
                description: error.response?.data?.message || "There was an error creating your account.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 md:p-10 selection:bg-[#10b981] selection:text-white">
            <div className="w-full max-w-6xl flex flex-col lg:grid lg:grid-cols-12 shadow-2xl rounded-[3rem] overflow-hidden bg-white min-h-[85vh]">
                
                {/* Left Panel: Aesthetic Section */}
                <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#002b45] to-[#134e8d] p-16 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -ml-20 -mb-20" />
                    
                    <div className="relative z-10 space-y-8">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                                <Shield size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">Secure Shield</span>
                        </Link>
                        
                        <div className="pt-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                                Join India's Most Trusted Network
                            </h2>
                            <p className="text-white/70 text-lg font-medium">
                                Secure your future and protect your loved ones with our comprehensive insurance solutions.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-6">
                        {[
                            { title: "Quick & Easy Paperwork", desc: "100% digital process, no physical documents needed." },
                            { title: "Instant Policies", desc: "Receive your policy instantly in your email." },
                            { title: "Dedicated Support", desc: "Our experts are available 24/7 to assist you." }
                        ].map((item, i) => (
                            <Reveal key={i} direction="up" delay={0.1 * i}>
                                <div className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-default">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                                        <CheckCircle2 size={20} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                        <p className="text-white/50 text-[12px] font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <div className="relative z-10 pt-10">
                         <p className="text-white/30 text-[12px] font-bold uppercase tracking-widest">© 2024 Secure Shield Insurance</p>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
                <div className="flex-1 lg:col-span-7 p-8 md:p-16 bg-white overflow-y-auto no-scrollbar">
                    <div className="max-w-xl mx-auto space-y-8">
                        <div className="space-y-2">
                             <div className="lg:hidden mb-10">
                                <Link to="/" className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#134e8d] rounded-lg flex items-center justify-center text-white">
                                        <Shield size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-xl font-bold text-[#002b45]">Secure Shield</span>
                                </Link>
                             </div>
                            <h1 className="text-4xl font-extrabold text-[#002b45] tracking-tight">Create Account</h1>
                            <p className="text-slate-500 font-medium text-sm">Please fill in your details to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                                <input 
                                    name="name" value={formData.name} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white focus:border-[#134e8d]/20 transition-all outline-none"
                                    placeholder="Enter your full name" required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                <input 
                                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white focus:border-[#134e8d]/20 transition-all outline-none"
                                    placeholder="yourname@gmail.com" required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
                                <input 
                                    name="phone" value={formData.phone} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white focus:border-[#134e8d]/20 transition-all outline-none"
                                    placeholder="+91 OOOO OOOO OO" required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Date of Birth</label>
                                <input 
                                    type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white focus:border-[#134e8d]/20 transition-all outline-none" required
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Gender</label>
                                <select 
                                    name="gender" value={formData.gender} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white focus:border-[#134e8d]/20 transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-6 bottom-5 pointer-events-none text-slate-400">
                                    <ChevronDown size={18} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Aadhar Number</label>
                                <input 
                                    name="aadhar" value={formData.aadhar} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white focus:border-[#134e8d]/20 transition-all outline-none"
                                    placeholder="12 digit aadhar number"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Current Address</label>
                                <input 
                                    name="address" value={formData.address} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white focus:border-[#134e8d]/20 transition-all outline-none"
                                    placeholder="Enter your address" required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                                <input 
                                    type="password" name="password" value={formData.password} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white focus:border-[#134e8d]/20 transition-all outline-none"
                                    placeholder="••••••••" required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Confirm Password</label>
                                <input 
                                    type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white focus:border-[#134e8d]/20 transition-all outline-none"
                                    placeholder="••••••••" required
                                />
                            </div>

                            <div className="md:col-span-2 flex items-center gap-3 py-2">
                                <input type="checkbox" id="terms" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[#10b981] transition-all focus:ring-0 cursor-pointer" required />
                                <label htmlFor="terms" className="text-[13px] font-medium text-slate-500">
                                    By registering, I agree to the <a href="#" className="text-[#134e8d] font-bold">Terms & Conditions</a>.
                                </label>
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-16 bg-[#10b981] text-white rounded-2xl text-[16px] font-bold shadow-xl shadow-emerald-500/20 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <><Loader2 className="animate-spin" /> Creating Account...</>
                                    ) : (
                                        <>Create Account <ArrowRight size={20} /></>
                                    )}
                                </button>
                                
                                <p className="text-center text-slate-500 font-medium text-sm mt-10">
                                    Already have an account? <Link to="/login" className="text-[#134e8d] font-bold hover:underline">Log in</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
