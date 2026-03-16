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
                title: "Login Successful", 
                description: "Welcome back to Secure Shield." 
            });
            
            setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'agent') navigate('/agent');
                else navigate('/customer');
            }, 500);
        } catch (error) {
            toast({ 
                title: "Login Failed", 
                description: error.response?.data?.message || "Invalid credentials. Please try again.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans selection:bg-[#10b981] selection:text-white">
            {/* Left Panel: Branding & Features */}
            <div className="hidden lg:flex w-[40%] bg-gradient-to-br from-[#134e8d] to-[#002b45] p-12 flex-col justify-between text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                
                <div className="relative z-10">
                    <Link to="/" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 mb-12 hover:bg-white/20 transition-all">
                        <Shield size={24} />
                    </Link>
                    
                    <div className="space-y-8">
                        <Reveal direction="left">
                            <h1 className="text-5xl font-bold leading-tight">Welcome <br /> Back!</h1>
                        </Reveal>
                        <Reveal direction="left" delay={0.2}>
                            <p className="text-white/60 text-base leading-relaxed max-w-sm font-medium">
                                Securing your future, one shield at a time. Access your personalized insurance dashboard.
                            </p>
                        </Reveal>
                        
                        <div className="space-y-4 pt-6">
                            {[
                                { icon: ShieldCheck, label: "Advanced Data Protection" },
                                { icon: Activity, label: "24/7 Agent Support Access" },
                                { icon: Zap, label: "Real-time Policy Updates" }
                            ].map((item, i) => (
                                <Reveal key={i} direction="up" delay={0.4 + (i * 0.1)}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 bg-[#10b981] rounded-full flex items-center justify-center text-white shrink-0">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-base font-semibold tracking-wide">{item.label}</span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/10 flex justify-between text-white/40 text-[10px] font-bold tracking-widest uppercase">
                    <span>© 2026 Secure Shield</span>
                    <span>v4.2 PRO</span>
                </div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center py-10 px-6 md:px-16 lg:px-24 relative bg-white overflow-y-auto no-scrollbar">
                <div className="w-full max-w-sm space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold text-[#002b45]">Login to Your Account</h2>
                        <p className="text-slate-400 text-sm font-medium">Please enter your credentials to access the portal</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex border-b border-slate-100">
                        {["Customer", "Agent", "Admin"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-[11px] font-bold tracking-wider uppercase transition-all relative ${
                                    activeTab === tab ? "text-[#002b45]" : "text-slate-300 hover:text-slate-500"
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 w-full h-0.5 bg-[#134e8d]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#134e8d] transition-colors">
                                    <Mail size={16} />
                                </div>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-12 bg-white border border-slate-200 rounded-lg px-12 text-slate-700 font-semibold text-sm outline-none focus:border-[#134e8d] transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-bold text-[#002b45] uppercase tracking-wider">Password</label>
                                <button type="button" className="text-[10px] font-bold text-[#134e8d] hover:underline uppercase tracking-wide">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#134e8d] transition-colors">
                                    <Lock size={16} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full h-12 bg-white border border-slate-200 rounded-lg px-12 text-slate-700 font-semibold text-sm outline-none focus:border-[#134e8d] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-200 text-[#134e8d] transition-all" />
                            <label htmlFor="remember" className="text-xs font-bold text-slate-400 cursor-pointer">Remember me</label>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-13 bg-[#002b45] text-white rounded-lg text-base font-bold shadow-lg hover:bg-[#003a5c] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Login"}
                        </button>
                    </form>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-white px-3">OR</div>
                    </div>

                    <button type="button" className="w-full h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-3 text-[#002b45] font-bold text-sm hover:bg-slate-50 transition-all">
                        <Chrome size={18} className="text-slate-700" />
                        Login with Google
                    </button>

                    <p className="text-center text-sm font-bold text-slate-400">
                        Don't have an account? <Link to="/register" className="text-[#134e8d] hover:underline">Register</Link>
                    </p>

                    <div className="pt-4 flex justify-center gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        <a href="#" className="hover:text-slate-500">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-500">Terms of Service</a>
                        <a href="#" className="hover:text-slate-500">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
