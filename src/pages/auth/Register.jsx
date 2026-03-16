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
                address: formData.address
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
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 md:p-12 font-sans selection:bg-[#10b981] selection:text-white">
            {/* Main Outer Container */}
            <div className="w-full max-w-7xl flex flex-col md:flex-row shadow-2xl rounded-[3rem] overflow-hidden bg-white">
                
                {/* Left Panel: Visual & Branding */}
                <div className="hidden lg:flex w-[40%] bg-white p-16 flex-col justify-center">
                    <div className="space-y-12">
                        {/* Illustration Container */}
                        <div className="relative">
                            <div className="aspect-square bg-slate-50 rounded-[3rem] overflow-hidden flex items-center justify-center border border-slate-100">
                                <Reveal direction="up">
                                    <div className="text-[#002b45]/10">
                                        <Shield size={280} strokeWidth={1} />
                                    </div>
                                </Reveal>
                                <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-white to-transparent">
                                    <h2 className="text-5xl font-black text-[#002b45] leading-tight">Join <br />Secure Shield</h2>
                                    <p className="text-slate-500 text-lg mt-4 font-medium">Experience peace of mind with our comprehensive protection plans designed for your security.</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature List */}
                        <div className="space-y-6 pt-4">
                            {[
                                "Instant Policy Issuance",
                                "24/7 Dedicated Support",
                                "Fast and Hassle-free Claims"
                            ].map((feature, i) => (
                                <Reveal key={i} direction="up" delay={0.2 + (i * 0.1)}>
                                    <div className="flex items-center gap-4 bg-[#f0fdf4] p-5 rounded-2xl border border-emerald-50">
                                        <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <span className="text-[#002b45] font-bold tracking-wide">{feature}</span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
                <div className="flex-1 p-8 md:p-20 bg-white relative">
                    <div className="max-w-xl mx-auto space-y-10">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-extrabold text-[#002b45]">Create Your Account</h1>
                            <p className="text-slate-400 font-medium">Fill in your details to start your journey with us.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Row 1: Full Name */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Full Name</label>
                                <input 
                                    name="name" value={formData.name} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50/50 border-2 border-slate-50 rounded-xl px-6 text-slate-700 font-semibold focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                    placeholder="John Doe" required
                                />
                            </div>

                            {/* Row 2: Email & Phone */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Email Address</label>
                                    <input 
                                        type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        className="w-full h-14 bg-slate-50/50 border-2 border-slate-50 rounded-xl px-6 text-slate-700 font-semibold focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="john@example.com" required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Phone Number</label>
                                    <input 
                                        name="phone" value={formData.phone} onChange={handleInputChange}
                                        className="w-full h-14 bg-slate-50/50 border-2 border-slate-50 rounded-xl px-6 text-slate-700 font-semibold focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="+1 (555) 000-0000" required
                                    />
                                </div>
                            </div>

                            {/* Row 3: DOB & Gender */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Date of Birth</label>
                                    <input 
                                        type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                                        className="w-full h-14 bg-slate-50/50 border-2 border-slate-50 rounded-xl px-6 text-slate-700 font-semibold focus:bg-white focus:border-[#134e8d] transition-all outline-none" required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Gender</label>
                                    <select 
                                        name="gender" value={formData.gender} onChange={handleInputChange}
                                        className="w-full h-14 bg-slate-50/50 border-2 border-slate-50 rounded-xl px-6 text-slate-700 font-semibold focus:bg-white focus:border-[#134e8d] transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1.5rem_center] bg-no-repeat"
                                    >
                                        <option value="Male">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 4: Address */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Residential Address</label>
                                <textarea 
                                    name="address" value={formData.address} onChange={handleInputChange}
                                    className="w-full h-32 bg-slate-50/50 border-2 border-slate-50 rounded-xl p-6 text-slate-700 font-semibold focus:bg-white focus:border-[#134e8d] transition-all outline-none resize-none"
                                    placeholder="Enter your full address" required
                                />
                            </div>

                            {/* Row 5: Aadhar ID */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Aadhar / Government ID Number</label>
                                <input 
                                    name="aadhar" value={formData.aadhar} onChange={handleInputChange}
                                    className="w-full h-14 bg-slate-50/50 border-2 border-slate-50 rounded-xl px-6 text-slate-700 font-semibold focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                    placeholder="0000 0000 0000"
                                />
                            </div>

                            {/* Row 6: Passwords */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Password</label>
                                    <input 
                                        type="password" name="password" value={formData.password} onChange={handleInputChange}
                                        className="w-full h-14 bg-slate-50/50 border-2 border-slate-50 rounded-xl px-6 text-slate-700 font-semibold focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="••••••••" required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Confirm Password</label>
                                    <input 
                                        type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                                        className="w-full h-14 bg-slate-50/50 border-2 border-slate-50 rounded-xl px-6 text-slate-700 font-semibold focus:bg-white focus:border-[#134e8d] transition-all outline-none"
                                        placeholder="••••••••" required
                                    />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-4">
                                <input type="checkbox" id="terms" className="mt-1 w-5 h-5 rounded border-slate-100 text-[#10b981] transition-all" required />
                                <label htmlFor="terms" className="text-sm font-medium text-slate-400">
                                    I agree to the Secure Shield <a href="#" className="text-slate-600 underline font-bold">Terms & Conditions</a> and <a href="#" className="text-slate-600 underline font-bold">Privacy Policy</a>.
                                </label>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 bg-[#10b981] text-white rounded-xl text-xl font-bold shadow-xl shadow-emerald-100 hover:bg-[#0da371] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
                            >
                                {isLoading ? "Processing..." : "Register Now"}
                            </button>
                        </form>

                        <p className="text-center font-bold text-slate-400">
                            Already have an account? <Link to="/login" className="text-[#002b45] hover:underline">Login</Link>
                        </p>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 py-8 flex justify-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 Secure Shield Insurance Services. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
