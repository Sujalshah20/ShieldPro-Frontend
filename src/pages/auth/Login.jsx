import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, Mail, Lock, Eye, EyeOff, 
    CheckCircle2, Chrome, ChevronRight, Activity, Zap, ShieldCheck, Loader2, ArrowRight
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
                title: "Login Successful", 
                description: "Welcome back to Secure Shield.",
                variant: "default"
            });
            
            setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'agent') navigate('/agent');
                else navigate('/customer');
            }, 500);
        } catch (error) {
            toast({ 
                title: "Login Failed", 
                description: "Invalid credentials. Please try again.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 md:p-10 selection:bg-[#10b981] selection:text-white font-sans">
             <div className="w-full max-w-6xl flex flex-col lg:grid lg:grid-cols-12 shadow-2xl rounded-[3rem] overflow-hidden bg-white min-h-[85vh]">
                
                {/* Left Panel: Branding & Features */}
                <div className="hidden lg:flex lg:col-span-4 bg-[#002b45] p-16 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -ml-20 -mb-20" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center border border-white/10 mb-16 hover:bg-white/10 transition-all group overflow-hidden">
                            <Shield size={32} className="text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        </Link>
                        
                        <div className="space-y-8">
                            <Reveal direction="left">
                                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white">
                                    Welcome <br />Back
                                </h1>
                            </Reveal>
                            <Reveal direction="left" delay={0.2}>
                                <p className="text-white/70 text-lg font-medium leading-relaxed max-w-xs">
                                    Access your dashboard to manage policies, file claims, and explore new coverage plans.
                                </p>
                            </Reveal>
                            
                            <div className="space-y-6 pt-10 border-t border-white/10">
                                {[
                                    { icon: ShieldCheck, label: "Secure Data Encryption" },
                                    { icon: Activity, label: "Instant Policy Updates" },
                                    { icon: Zap, label: "Fast Claim Statistics" }
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
                         © 2024 Secure Shield
                    </div>
                </div>

                {/* Right Panel: Login Form */}
                <div className="flex-1 lg:col-span-8 flex flex-col justify-center items-center py-12 px-8 md:px-20 lg:px-32 relative bg-white overflow-y-auto no-scrollbar">
                    <div className="w-full max-w-xl space-y-10">
                        <div className="space-y-4">
                             <div className="lg:hidden mb-10 text-center">
                                <Link to="/" className="inline-flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#134e8d] rounded-lg flex items-center justify-center text-white">
                                        <Shield size={24} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-2xl font-bold text-[#002b45]">Secure Shield</span>
                                </Link>
                             </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#002b45] tracking-tight">Login</h2>
                            <p className="text-slate-500 text-lg font-medium">Please enter your credentials to access your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors">
                                        <Mail size={20} strokeWidth={2.5} />
                                    </div>
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl pl-16 pr-6 text-[#002b45] font-bold text-base outline-none focus:bg-white focus:border-[#134e8d]/20 transition-all placeholder:text-slate-300"
                                        placeholder="yourname@gmail.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                                    <button type="button" className="text-[11px] font-bold text-[#134e8d] hover:underline uppercase tracking-wider">Forgot Password?</button>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors">
                                        <Lock size={20} strokeWidth={2.5} />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl pl-16 pr-16 text-[#002b45] font-bold text-base outline-none focus:bg-white focus:border-[#134e8d]/20 transition-all placeholder:text-slate-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[#10b981] transition-all focus:ring-0 cursor-pointer" />
                                <label htmlFor="remember" className="text-sm font-medium text-slate-500 cursor-pointer">Remember me for 30 days</label>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 bg-[#10b981] text-white rounded-2xl text-[18px] font-bold shadow-xl shadow-emerald-500/20 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <><Loader2 className="animate-spin" /> Logging you in...</>
                                ) : (
                                    <>Login <ArrowRight size={22} /></>
                                )}
                            </button>
                        </form>

                        <div className="space-y-10">
                            <div className="relative flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-slate-100" />
                                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-[4px]">Or login with</div>
                                <div className="h-[1px] flex-1 bg-slate-100" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button type="button" className="flex-1 h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-[#002b45] font-bold text-sm hover:bg-slate-50 hover:border-[#134e8d]/20 transition-all group">
                                    <Chrome size={20} className="text-slate-400 group-hover:text-[#134e8d] transition-colors" />
                                    Google
                                </button>
                                <button type="button" className="flex-1 h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-[#002b45] font-bold text-sm hover:bg-slate-50 hover:border-[#134e8d]/20 transition-all group">
                                    <Facebook size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    Facebook
                                </button>
                            </div>

                            <p className="text-center text-slate-500 font-medium text-sm pt-4">
                                Don't have an account? <Link to="/register" className="text-[#134e8d] font-bold hover:underline">Register Now</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
