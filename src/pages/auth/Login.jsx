import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, Mail, Lock, Eye, EyeOff, 
    CheckCircle2, Chrome, ChevronRight, Activity, Zap, ShieldCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { motion } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Customer");
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            toast({ 
                title: "AUTHENTICATION_SUCCESS", 
                description: "Secure baseline established. Uplink stable.",
                variant: "default"
            });
            
            setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'agent') navigate('/agent');
                else navigate('/customer');
            }, 500);
        } catch (error) {
            toast({ 
                title: "ACCESS_DENIED", 
                description: "Vetting sequence failed. Invalid credentials detected.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans selection:bg-[#10b981] selection:text-white">
            {/* Left Panel: Branding & Features */}
            <div className="hidden lg:flex w-[40%] bg-[#003249] p-16 flex-col justify-between text-white relative overflow-hidden border-r border-white/5">
                {/* Visual Grid Background */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#007ea7 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#007ea7]/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10">
                    <Link to="/" className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center border border-white/10 mb-16 hover:bg-white/10 transition-all group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Shield size={32} className="text-[#007ea7] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                    </Link>
                    
                    <div className="space-y-10">
                        <Reveal direction="left">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-8 bg-[#007ea7] rounded-full" />
                                    <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Access_Gateway_v4.2</span>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">Secure <br /><span className="text-[#007ea7]">Baseline_</span></h1>
                            </div>
                        </Reveal>
                        <Reveal direction="left" delay={0.2}>
                            <p className="text-white/40 text-xs font-black uppercase tracking-[4px] leading-relaxed max-w-sm italic">
                                Securing your future, one shield at a time. Access your personal tactical asset monitoring system.
                            </p>
                        </Reveal>
                        
                        <div className="space-y-6 pt-10 border-t border-white/5">
                            {[
                                { icon: ShieldCheck, label: "Advanced Data Protection" },
                                { icon: Activity, label: "24/7 Agent Support Access" },
                                { icon: Zap, label: "Real-time Policy Updates" }
                            ].map((item, i) => (
                                <Reveal key={i} direction="up" delay={0.4 + (i * 0.1)}>
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-[#10b981] shrink-0 border border-white/10 group-hover:rotate-12 transition-transform shadow-lg">
                                            <item.icon size={18} strokeWidth={3} />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-[3px] italic text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/5 flex justify-between items-center text-white/20 text-[9px] font-black uppercase tracking-[5px] italic">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#007ea7] rounded-full animate-pulse shadow-[0_0_10px_#007ea7]" />
                        <span>GRID_SYNC_ACTIVE</span>
                    </div>
                    <span>© 2026 SHIELD_PRO</span>
                </div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center py-10 px-6 md:px-16 lg:px-24 relative bg-white overflow-y-auto no-scrollbar">
                <div className="w-full max-w-md space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-[#003249] uppercase tracking-tighter italic">Vetting_Terminal</h2>
                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[4px] italic opacity-60">Authorize credentials to establish synchronization_</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex bg-slate-50 p-1.5 rounded-[1.8rem] border-2 border-slate-50 shadow-inner">
                        {["Customer", "Agent", "Admin"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-[10px] font-black tracking-[4px] uppercase transition-all duration-500 relative italic rounded-[1.4rem] ${
                                    activeTab === tab ? "bg-[#003249] text-[#80ced7] shadow-2xl scale-[1.05] z-10" : "text-slate-300 hover:text-slate-500"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 pt-4">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-[#003249] uppercase tracking-[5px] italic">Identity_Identifier</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#007ea7] transition-colors">
                                    <Mail size={18} strokeWidth={3} />
                                </div>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl pl-16 pr-8 text-[#003249] font-black text-[11px] uppercase tracking-[3px] outline-none focus:bg-white focus:border-[#007ea7]/20 focus:ring-8 focus:ring-[#007ea7]/5 shadow-inner transition-all italic placeholder:text-slate-200"
                                    placeholder="OPERATIVE@SHIELD_GRID.COM"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-black text-[#003249] uppercase tracking-[5px] italic">Security_Keyphrase</label>
                                <button type="button" className="text-[9px] font-black text-[#007ea7] hover:underline uppercase tracking-[3px] italic opacity-60 hover:opacity-100 transition-opacity">RECALIBRATE_ACCESS?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#007ea7] transition-colors">
                                    <Lock size={18} strokeWidth={3} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl pl-16 pr-16 text-[#003249] font-black text-[11px] uppercase tracking-[3px] outline-none focus:bg-white focus:border-[#007ea7]/20 focus:ring-8 focus:ring-[#007ea7]/5 shadow-inner transition-all italic placeholder:text-slate-200"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 hover:text-[#007ea7] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-slate-100 text-[#007ea7] transition-all focus:ring-0" />
                            <label htmlFor="remember" className="text-[10px] font-black text-slate-300 cursor-pointer uppercase tracking-[4px] italic">PERSIST_SESSION</label>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 bg-[#10b981] text-white rounded-[1.5rem] text-[13px] font-black uppercase tracking-[8px] shadow-2xl shadow-emerald-500/10 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 italic group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {isLoading ? "VETTING_IN_PROGRESS..." : "INITIALIZE_SYNC"}
                        </button>
                    </form>

                    <div className="relative py-4 flex items-center gap-8">
                        <div className="h-0.5 flex-1 bg-slate-50" />
                        <div className="text-[9px] font-black text-slate-200 uppercase tracking-[6px] italic leading-none">SECURE_BRIDGE</div>
                        <div className="h-0.5 flex-1 bg-slate-50" />
                    </div>

                    <div className="space-y-6">
                        <button type="button" className="w-full h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center gap-5 text-[#003249] font-black text-[11px] uppercase tracking-[6px] hover:bg-slate-50 hover:border-[#007ea7]/20 transition-all italic group">
                            <Chrome size={20} className="text-slate-300 group-hover:text-[#007ea7] transition-colors" strokeWidth={3} />
                            CLOUD_SYNC_VIA_GOOGLE
                        </button>

                        <p className="text-center text-[11px] font-black text-slate-300 uppercase tracking-[4px] italic">
                            NEW_IDENTITY_REQUIRED? <Link to="/register" className="text-[#007ea7] hover:underline underline-offset-4 decoration-2">ENLIST_HERE</Link>
                        </p>
                    </div>

                    <div className="pt-8 flex flex-wrap justify-center gap-8 text-[9px] font-black text-slate-200 uppercase tracking-[4px] italic opacity-40 hover:opacity-100 transition-opacity">
                        <a href="#" className="hover:text-[#007ea7]">PRIVACY_PROTOCOL</a>
                        <a href="#" className="hover:text-[#007ea7]">SERVICE_TIERS</a>
                        <a href="#" className="hover:text-[#007ea7]">MAIN_CONSOLE</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
