import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, User, Mail, Phone, Calendar, 
    MapPin, Globe, CheckCircle2, ChevronRight, ArrowRight, Loader2
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
                description: error.response?.data?.message || "Something went wrong.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-[#10b981] selection:text-white">
            {/* Main Outer Container */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-[2.5rem] overflow-hidden bg-white max-h-[95vh]">
                
                {/* Left Panel: Visual & Branding */}
                <div className="hidden lg:flex w-[35%] bg-white p-10 flex-col justify-center border-r border-slate-50">
                    <div className="space-y-8">
                        {/* Illustration Container */}
                        <div className="relative">
                            <div className="aspect-square bg-slate-50 rounded-[2rem] overflow-hidden flex items-center justify-center border border-slate-100">
                                <Reveal direction="up">
                                    <div className="text-[#002b45]/10">
                                        <Shield size={180} strokeWidth={1} />
                                    </div>
                                </Reveal>
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-white to-transparent">
                                    <h2 className="text-3xl font-black text-[#002b45] leading-tight">Join <br />Secure Shield</h2>
                                    <p className="text-slate-500 text-sm mt-2 font-medium">Comprehensive protection plans designed for your security.</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature List */}
                        <div className="space-y-4">
                            {[
                                "Instant Policy Issuance",
                                "24/7 Dedicated Support",
                                "Fast & Hassle-free Claims"
                            ].map((feature, i) => (
                                <Reveal key={i} direction="up" delay={0.2 + (i * 0.1)}>
                                    <div className="flex items-center gap-3 bg-[#f0fdf4] p-3 rounded-xl border border-emerald-50">
                                        <div className="w-6 h-6 bg-[#10b981] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-100">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-[#002b45] text-sm font-bold tracking-wide">{feature}</span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
                <div className="flex-1 p-6 md:p-12 bg-white relative overflow-y-auto no-scrollbar">
                    <div className="max-w-xl mx-auto space-y-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold text-[#002b45]">Create Your Account</h1>
                            <p className="text-slate-400 text-sm font-medium">Fill in your details to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Row 1: Full Name */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Full Name</label>
                                <input 
                                    name="name" value={formData.name} onChange={handleInputChange}
                                    className="w-full h-11 bg-slate-50/50 border border-slate-100 rounded-lg px-5 text-slate-700 font-semibold text-sm focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                    placeholder="John Doe" required
                                />
                            </div>

                            {/* Row 2: Email & Phone */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Email Address</label>
                                    <input 
                                        type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        className="w-full h-11 bg-slate-50/50 border border-slate-100 rounded-lg px-5 text-slate-700 font-semibold text-sm focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="john@example.com" required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Phone Number</label>
                                    <input 
                                        name="phone" value={formData.phone} onChange={handleInputChange}
                                        className="w-full h-11 bg-slate-50/50 border border-slate-100 rounded-lg px-5 text-slate-700 font-semibold text-sm focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="+91..." required
                                    />
                                </div>
                            </div>

                            {/* Row 3: DOB & Gender */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Date of Birth</label>
                                    <input 
                                        type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                                        className="w-full h-11 bg-slate-50/50 border border-slate-100 rounded-lg px-5 text-slate-700 font-semibold text-sm focus:bg-white focus:border-[#134e8d] transition-all outline-none md:appearance-none" required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Gender</label>
                                    <select 
                                        name="gender" value={formData.gender} onChange={handleInputChange}
                                        className="w-full h-11 bg-slate-50/50 border border-slate-100 rounded-lg px-5 text-slate-700 font-semibold text-sm focus:bg-white focus:border-[#134e8d] transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat"
                                    >
                                        <option value="Male">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 4: Aadhar & Address Combined visually if possible, or just tight */}
                             <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Aadhar Number</label>
                                    <input 
                                        name="aadhar" value={formData.aadhar} onChange={handleInputChange}
                                        className="w-full h-11 bg-slate-50/50 border border-slate-100 rounded-lg px-5 text-slate-700 font-semibold text-sm focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="0000 0000 0000"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Residential Address</label>
                                    <input 
                                        name="address" value={formData.address} onChange={handleInputChange}
                                        className="w-full h-11 bg-slate-50/50 border border-slate-100 rounded-lg px-5 text-slate-700 font-semibold text-sm focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="Enter address" required
                                    />
                                </div>
                            </div>

                            {/* Row 5: Passwords */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Password</label>
                                    <input 
                                        type="password" name="password" value={formData.password} onChange={handleInputChange}
                                        className="w-full h-11 bg-slate-50/50 border border-slate-100 rounded-lg px-5 text-slate-700 font-semibold text-sm focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="••••••••" required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Confirm</label>
                                    <input 
                                        type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                                        className="w-full h-11 bg-slate-50/50 border border-slate-100 rounded-lg px-5 text-slate-700 font-semibold text-sm focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="••••••••" required
                                    />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 py-1">
                                <input type="checkbox" id="terms" className="mt-0.5 w-4 h-4 rounded border-slate-200 text-[#10b981] transition-all" required />
                                <label htmlFor="terms" className="text-[11px] font-medium text-slate-400 leading-tight">
                                    I agree to the <a href="#" className="text-slate-600 underline font-bold">Terms</a> & <a href="#" className="text-slate-600 underline font-bold">Privacy Policy</a>.
                                </label>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-13 bg-[#10b981] text-white rounded-lg text-lg font-bold shadow-lg shadow-emerald-50 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                            >
                                {isLoading ? "Processing..." : "Register Now"}
                            </button>
                        </form>

                        <p className="text-center text-sm font-bold text-slate-400">
                            Already have an account? <Link to="/login" className="text-[#002b45] hover:underline">Login</Link>
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">© 2026 Secure Shield Insurance Services</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
