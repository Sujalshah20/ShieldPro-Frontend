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
                title: "VERIFICATION_FAILURE", 
                description: "Node synchronization failed: Passwords do not match.", 
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
                title: "REGISTRATION_COMPLETE", 
                description: "Operative node successfully initialized. Proceed to login." 
            });
            navigate("/login");
        } catch (error) {
            toast({ 
                title: "UPLINK_ERROR", 
                description: error.response?.data?.message || "Critical system failure during deployment.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-[#10b981] selection:text-white">
            {/* Main Outer Container */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                
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
                                    <h2 className="text-3xl font-black text-[#002b45] uppercase tracking-tighter italic leading-none">Initialize <br /><span className="text-[#007ea7]">Defense_Node_</span></h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[4px] mt-4 italic leading-relaxed">Secure registration interface for elite asset protection.</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature List */}
                        <div className="space-y-4">
                            {[
                                "INSTANT_SYNC_ISSUANCE",
                                "24/7_DEDICATED_UPLINK",
                                "ZERO_LATENCY_CLAIMS"
                            ].map((feature, i) => (
                                <Reveal key={i} direction="up" delay={0.2 + (i * 0.1)}>
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-[#10b981]/30 transition-all">
                                        <div className="w-8 h-8 bg-[#003249] rounded-xl flex items-center justify-center text-[#10b981] shrink-0 shadow-lg">
                                            <CheckCircle2 size={16} strokeWidth={3} />
                                        </div>
                                        <span className="text-[#003249] text-[9px] font-black tracking-[4px] uppercase italic">{feature}</span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
                <div className="flex-1 p-6 md:p-12 md:pb-8 bg-white relative overflow-y-auto no-scrollbar">
                    <div className="max-w-xl mx-auto space-y-6 pb-4">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Vetting <span className="text-[#007ea7]">Protocol_</span></h1>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[5px] mt-2 italic">Fill in your operative details to initiate synchronization.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Row 1: Full Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">OPERATIVE_NAME</label>
                                <input 
                                    name="name" value={formData.name} onChange={handleInputChange}
                                    className="w-full h-12 bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-6 text-[#003249] font-bold text-sm focus:bg-white focus:border-[#007ea7]/30 transition-all outline-none"
                                    placeholder="Enter full legal name" required
                                />
                            </div>

                            {/* Row 2: Email & Phone */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">UPLINK_EMAIL</label>
                                    <input 
                                        type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-6 text-[#003249] font-bold text-sm focus:bg-white focus:border-[#007ea7]/30 transition-all outline-none"
                                        placeholder="admin@secureshield.in" required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">COMMS_PHONE</label>
                                    <input 
                                        name="phone" value={formData.phone} onChange={handleInputChange}
                                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-6 text-[#003249] font-bold text-sm focus:bg-white focus:border-[#007ea7]/30 transition-all outline-none"
                                        placeholder="+91 OOOO OOOO OO" required
                                    />
                                </div>
                            </div>

                            {/* Row 3: DOB & Gender */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">ORIGIN_DATE</label>
                                    <input 
                                        type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-6 text-[#003249] font-bold text-sm focus:bg-white focus:border-[#007ea7]/30 transition-all outline-none uppercase" required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">BIOMETRIC_SEX</label>
                                    <select 
                                        name="gender" value={formData.gender} onChange={handleInputChange}
                                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-6 text-[#003249] font-bold text-sm focus:bg-white focus:border-[#007ea7]/30 transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23003249%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.2rem] bg-[right_1.2rem_center] bg-no-repeat uppercase italic"
                                    >
                                        <option value="Male">Select_Status</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 4: Aadhar & Address */}
                             <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">NATIONAL_ID</label>
                                    <input 
                                        name="aadhar" value={formData.aadhar} onChange={handleInputChange}
                                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-6 text-[#003249] font-bold text-sm focus:bg-white focus:border-[#007ea7]/30 transition-all outline-none"
                                        placeholder="0000 0000 0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">SECTOR_ADDRESS</label>
                                    <input 
                                        name="address" value={formData.address} onChange={handleInputChange}
                                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-6 text-[#003249] font-bold text-sm focus:bg-white focus:border-[#007ea7]/30 transition-all outline-none"
                                        placeholder="Current residence grid" required
                                    />
                                </div>
                            </div>

                            {/* Row 5: Passwords */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">ACCESS_KEY</label>
                                    <input 
                                        type="password" name="password" value={formData.password} onChange={handleInputChange}
                                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-6 text-[#003249] font-bold text-sm focus:bg-white focus:border-[#007ea7]/30 transition-all outline-none"
                                        placeholder="••••••••" required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">CONFIRM_KEY</label>
                                    <input 
                                        type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-6 text-[#003249] font-bold text-sm focus:bg-white focus:border-[#007ea7]/30 transition-all outline-none"
                                        placeholder="••••••••" required
                                    />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-4 py-2">
                                <input type="checkbox" id="terms" className="mt-1 w-5 h-5 rounded-lg border-2 border-slate-100 text-[#10b981] transition-all focus:ring-0 cursor-pointer" required />
                                <label htmlFor="terms" className="text-[10px] font-black text-slate-400 leading-relaxed uppercase tracking-wider italic">
                                    I accept the <a href="#" className="text-[#007ea7] underline font-black">Security_Terms</a> & <a href="#" className="text-[#007ea7] underline font-black">Privacy_Protocol</a>.
                                </label>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-[#10b981] text-white rounded-[1.4rem] text-[12px] font-black uppercase tracking-[6px] shadow-2xl shadow-emerald-500/10 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 italic group"
                            >
                                {isLoading ? "SYNCHRONIZING..." : "COMMENCE_VETTING"}
                            </button>
                        </form>

                        <p className="text-center text-[10px] font-black text-slate-400 tracking-[3px] py-4 uppercase italic">
                            Already in the grid? <Link to="/login" className="text-[#003249] hover:text-[#007ea7] transition-colors underline decoration-2 underline-offset-4">Vetting_Login</Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center pb-6">
                        <p className="text-[9px] font-black text-slate-200 uppercase tracking-[6px] italic">© 2026_SECURE_SHIELD_INFRASTRUCTURE_V4.2</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
