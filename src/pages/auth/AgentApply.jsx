import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
    Shield, Briefcase, Mail, Phone, MapPin, Award, Command, Loader2, ArrowRight, ShieldCheck, Activity, Zap
} from "lucide-react";
import Reveal from "../../components/common/Reveal";
import { api } from "../../utils/api";

const AgentApply = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        experienceYears: "",
        message: ""
    });
    
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState("");
    const [referenceId, setReferenceId] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await api.post("/public-forms/agent-application", {
                ...formData,
                experienceYears: Number(formData.experienceYears)
            });
            setReferenceId(res.referenceId);
            setStatus("success");
        } catch (err) {
            setErrorMsg(err.response?.data?.message || err.message || "Failed to submit application");
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 md:p-10 selection:bg-[#134e8d] selection:text-white font-sans">
            <div className="w-full max-w-7xl flex flex-col lg:grid lg:grid-cols-12 shadow-2xl rounded-[3.5rem] overflow-hidden bg-white min-h-[90vh]">
                
                {/* ── LEFT PANEL (Branding) ── */}
                <div className="hidden lg:flex lg:col-span-4 bg-[#124C89] p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -ml-20 -mb-20" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center border border-white/10 mb-12 hover:bg-white/10 transition-all group overflow-hidden">
                            <Shield size={32} className="text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        </Link>
                        
                        <div className="space-y-12">
                            <Reveal direction="down">
                                <div className="relative group p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-4xl overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-3xl rounded-full" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full" />
                                    
                                    <div className="relative z-10 space-y-8 text-center lg:text-left">
                                        <div className="inline-flex items-center px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                            Partner with ShieldPro
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                                            Empower Your <br />
                                            <span className="text-emerald-400">Career.</span>
                                        </h2>
                                        <p className="text-white/70 text-base font-medium leading-relaxed">
                                            Join India's fastest-growing digital insurance network. Provide top-tier coverage to your clients and earn high commissions.
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                            
                            <div className="space-y-6 pt-10 border-t border-white/10">
                                {[
                                    { icon: ShieldCheck, label: "Top-Tier Insurance Plans" },
                                    { icon: Activity, label: "High Commission Structures" },
                                    { icon: Zap, label: "Fast Claim Approvals" }
                                ].map((item, i) => (
                                    <Reveal key={i} direction="up" delay={0.4 + (i * 0.1)}>
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 border border-white/10 group-hover:rotate-6 transition-transform">
                                                <item.icon size={22} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-[15px] font-bold text-white/90 group-hover:text-white transition-colors">{item.label}</span>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/10 text-white/30 text-[12px] font-bold uppercase tracking-widest">
                        © 2026 ShieldPro
                    </div>
                </div>

                {/* ── RIGHT PANEL (Form) ── */}
                <div className="flex-1 lg:col-span-8 flex flex-col justify-center items-center py-12 px-6 md:px-16 lg:px-24 relative bg-white overflow-y-auto">
                    <div className="w-full max-w-[500px]">
                        
                        <div className="lg:hidden mb-8 text-center">
                            <Link to="/" className="inline-flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#134e8d] rounded-lg flex items-center justify-center text-white">
                                    <Shield size={24} strokeWidth={2.5} />
                                </div>
                                <span className="text-2xl font-bold text-black">ShieldPro</span>
                            </Link>
                        </div>

                        {status === "success" ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 border-4 border-white shadow-xl">
                                    <ShieldCheck size={40} className="ml-1" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Received!</h2>
                                <p className="text-slate-600 text-base font-medium leading-relaxed">
                                    Thank you for your interest in joining ShieldPro. Your reference ID is 
                                    <span className="font-bold text-slate-900 mx-1 px-2 py-1 bg-slate-100 rounded">
                                        {referenceId}
                                    </span>.
                                </p>
                                <p className="text-slate-600 text-base font-medium leading-relaxed">
                                    Our onboarding team will review your details and contact you within 24-48 business hours.
                                </p>
                                <Link 
                                    to="/login"
                                    className="inline-flex items-center justify-center gap-2 mt-8 px-6 h-12 rounded-xl bg-[#134e8d] text-white font-bold hover:bg-[#0f3d70] transition-colors"
                                >
                                    Return to Login <ArrowRight size={18} />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-[#134e8d]">
                                        <Briefcase size={28} strokeWidth={2.5} />
                                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Partner with Us</h2>
                                    </div>
                                    <p className="text-slate-500 font-medium text-[15px]">
                                        Submit your application to become an authorised ShieldPro agent.
                                    </p>
                                </div>

                                {status === "error" && (
                                    <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-200">
                                        {errorMsg}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Full Name</label>
                                            <div className="relative flex items-center border-[2px] rounded-2xl bg-slate-50 border-slate-200 focus-within:border-[#134e8d] focus-within:bg-white transition-all">
                                                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full h-12 bg-transparent px-4 text-slate-900 font-semibold text-[14px] outline-none placeholder:text-slate-400" placeholder="John Doe" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Email Address</label>
                                            <div className="relative flex items-center border-[2px] rounded-2xl bg-slate-50 border-slate-200 focus-within:border-[#134e8d] focus-within:bg-white transition-all">
                                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full h-12 bg-transparent px-4 text-slate-900 font-semibold text-[14px] outline-none placeholder:text-slate-400" placeholder="john@example.com" />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Phone Number</label>
                                            <div className="relative flex items-center border-[2px] rounded-2xl bg-slate-50 border-slate-200 focus-within:border-[#134e8d] focus-within:bg-white transition-all">
                                                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full h-12 bg-transparent px-4 text-slate-900 font-semibold text-[14px] outline-none placeholder:text-slate-400" placeholder="+91 90000 00000" />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">City / Region</label>
                                            <div className="relative flex items-center border-[2px] rounded-2xl bg-slate-50 border-slate-200 focus-within:border-[#134e8d] focus-within:bg-white transition-all">
                                                <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full h-12 bg-transparent px-4 text-slate-900 font-semibold text-[14px] outline-none placeholder:text-slate-400" placeholder="Mumbai" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Years of Insurance Experience</label>
                                        <div className="relative flex items-center border-[2px] rounded-2xl bg-slate-50 border-slate-200 focus-within:border-[#134e8d] focus-within:bg-white transition-all">
                                            <input type="number" min="0" required name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="w-full h-12 bg-transparent px-4 text-slate-900 font-semibold text-[14px] outline-none placeholder:text-slate-400" placeholder="e.g. 3" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Brief Message (Optional)</label>
                                        <div className="relative flex border-[2px] rounded-2xl bg-slate-50 border-slate-200 focus-within:border-[#134e8d] focus-within:bg-white transition-all overflow-hidden p-1">
                                            <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full bg-transparent px-3 py-2 text-slate-900 font-semibold text-[14px] outline-none placeholder:text-slate-400 resize-none" placeholder="Tell us why you'd be a great fit..."></textarea>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={status === "loading"}
                                        className="w-full h-[54px] rounded-2xl bg-[#134e8d] text-white text-[15px] font-bold shadow-xl shadow-blue-700/20 hover:bg-[#0f3d70] transition-colors flex justify-center items-center gap-2 disabled:opacity-50 mt-4"
                                    >
                                        {status === "loading" ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : "Submit Application"}
                                    </button>
                                </form>

                                <div className="text-center">
                                    <Link to="/login" className="text-slate-500 font-bold hover:text-slate-800 transition-colors text-sm">
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentApply;
