import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Mail, Lock, Eye, EyeOff, 
    ArrowRight, Loader2, CheckCircle2, ChevronRight,
    Fingerprint, ShieldCheck, Github, Chrome
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            addToast("Authentication Successful. Redirecting...", "success");
            
            setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'agent') navigate('/agent');
                else navigate('/customer');
            }, 1000);
        } catch (error) {
            addToast(error.response?.data?.message || "Tactical Error: Access Denied", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#dae5e5] flex items-center justify-center p-6 md:p-12 font-display uppercase tracking-widest">
            <div className="w-full max-w-6xl h-[750px] bg-white rounded-[2rem] shadow-2xl flex overflow-hidden">
                {/* Left Side - Login Form */}
                <div className="w-full lg:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white">
                    <div className="mb-12">
                        <h1 className="text-3xl font-extrabold text-[#012b3f] mb-4">Secure Vault Access</h1>
                        <p className="text-sm text-slate-400 font-bold lowercase tracking-normal">
                            Please enter your credentials to access your secure policy vault.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 block uppercase tracking-[2px]">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#0082a1] transition-colors" />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-[#012b3f] focus:outline-none focus:ring-2 focus:ring-[#0082a1]/20 focus:border-[#0082a1] transition-all tracking-normal lowercase"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-slate-500 block uppercase tracking-[2px]">Password</label>
                                <button type="button" className="text-[10px] font-black text-[#0082a1] hover:underline uppercase tracking-[1px]">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#0082a1] transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-12 text-sm font-bold text-[#012b3f] focus:outline-none focus:ring-2 focus:ring-[#0082a1]/20 focus:border-[#0082a1] transition-all tracking-normal"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#012b3f]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-2">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0082a1] focus:ring-[#0082a1]" id="remember" />
                            <label htmlFor="remember" className="text-[10px] font-black text-slate-500 uppercase tracking-[1px] cursor-pointer">Keep me logged in for 30 days</label>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[2px] mb-4">
                            <ShieldCheck size={14} /> 256-bit encryption active
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0082a1] hover:bg-[#012b3f] text-white rounded-xl py-5 font-black text-sm uppercase tracking-[4px] shadow-xl shadow-[#0082a1]/20 transition-all flex items-center justify-center gap-4 group"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                                <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" strokeWidth={3} /></>
                            )}
                        </button>

                        <div className="relative flex items-center justify-center py-4">
                            <div className="absolute inset-x-0 h-px bg-slate-100" />
                            <span className="relative px-6 bg-white text-[9px] font-black text-slate-400 uppercase tracking-[4px]">Or continue with</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <button type="button" className="flex items-center justify-center gap-4 py-4 px-6 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                                <Chrome className="w-5 h-5 text-red-500" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[2px]">Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-4 py-4 px-6 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                                <Shield className="w-5 h-5 text-[#012b3f]" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[2px] leading-tight text-center">SSO for<br/>Enterprise</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side - Brand Panel */}
                <div className="hidden lg:flex w-1/2 bg-[#012b3f] p-24 flex-col justify-between relative overflow-hidden">
                    {/* Background Texture/Pattern like screenshot */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#0082a1_1px,transparent_0)] [background-size:24px_24px]" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-24">
                            <div className="w-12 h-12 bg-[#0082a1] rounded-lg flex items-center justify-center text-white shadow-xl">
                                <ShieldCheck size={28} />
                            </div>
                            <span className="text-xl font-bold text-white uppercase tracking-[2px]">Policyholder Portal</span>
                        </div>

                        <h2 className="text-[44px] leading-[1.1] font-extrabold text-white mb-8 tracking-tighter">
                            Enterprise-grade <br />
                            security for your <br />
                            insurance assets.
                        </h2>
                        <p className="text-lg text-white/50 font-bold lowercase tracking-normal leading-relaxed max-w-sm">
                            Join thousands of companies securing their infrastructure with our industry-leading zero-trust architecture.
                        </p>
                    </div>

                    <div className="relative z-10">
                         <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-10 border border-white/10 shadow-3xl">
                             <p className="text-xs font-bold text-white/70 uppercase tracking-[2px] mb-6">Don't have an account yet?</p>
                             <Link to="/register" className="w-full bg-white text-[#012b3f] py-4 rounded-xl flex items-center justify-center font-black text-xs uppercase tracking-[2px] hover:bg-[#0082a1] hover:text-white transition-all mb-8">
                                 Create your free account
                             </Link>
                             <div className="flex items-center gap-4">
                                 <div className="flex -space-x-3">
                                     {[1,2,3].map(i => (
                                         <div key={i} className="w-10 h-10 rounded-full border-4 border-[#012b3f] bg-slate-300 overflow-hidden shadow-xl">
                                             <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Expert" />
                                         </div>
                                     ))}
                                 </div>
                                 <p className="text-[10px] font-black uppercase tracking-[1px] text-white/40">Trusted by 10k+ security experts</p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
