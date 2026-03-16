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
            <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-[#134e8d] to-[#002b45] p-24 flex-col justify-between text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                
                <div className="relative z-10">
                    <Link to="/" className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-20 hover:bg-white/20 transition-all">
                        <Shield size={32} />
                    </Link>
                    
                    <div className="space-y-12">
                        <Reveal direction="left">
                            <h1 className="text-7xl font-bold leading-tight">Welcome <br /> Back!</h1>
                        </Reveal>
                        <Reveal direction="left" delay={0.2}>
                            <p className="text-white/70 text-lg leading-relaxed max-w-md font-medium">
                                Securing your future, one shield at a time. Access your personalized insurance dashboard and manage your coverage with complete peace of mind.
                            </p>
                        </Reveal>
                        
                        <div className="space-y-8 pt-10">
                            {[
                                { icon: ShieldCheck, label: "Advanced Data Protection" },
                                { icon: Activity, label: "24/7 Agent Support Access" },
                                { icon: Zap, label: "Real-time Policy Updates" }
                            ].map((item, i) => (
                                <Reveal key={i} direction="up" delay={0.4 + (i * 0.1)}>
                                    <div className="flex items-center gap-5">
                                        <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white shrink-0">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <span className="text-lg font-semibold tracking-wide">{item.label}</span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-10 border-t border-white/10 md:flex hidden justify-between text-white/40 text-sm font-bold tracking-widest uppercase">
                    <span>© 2026 Secure Shield</span>
                    <span>v4.2 PRO</span>
                </div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-24 relative bg-white">
                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-3">
                        <h2 className="text-4xl font-extrabold text-[#002b45]">Login to Your Account</h2>
                        <p className="text-slate-400 font-medium">Please enter your credentials to access the portal</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex border-b border-slate-100">
                        {["Customer", "Agent", "Admin"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all relative ${
                                    activeTab === tab ? "text-[#002b45]" : "text-slate-300 hover:text-slate-500"
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 w-full h-1 bg-[#134e8d]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 pt-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#134e8d] transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-16 bg-white border-2 border-slate-100 rounded-xl px-16 text-slate-700 font-semibold outline-none focus:border-[#134e8d] transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-[#002b45] uppercase tracking-wider">Password</label>
                                <button type="button" className="text-xs font-bold text-[#134e8d] hover:underline uppercase tracking-wide">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#134e8d] transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full h-16 bg-white border-2 border-slate-100 rounded-xl px-16 text-slate-700 font-semibold outline-none focus:border-[#134e8d] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="remember" className="w-5 h-5 rounded border-slate-100 text-[#134e8d] transition-all" />
                            <label htmlFor="remember" className="text-sm font-bold text-slate-400 cursor-pointer">Remember me</label>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 bg-[#002b45] text-white rounded-xl text-lg font-bold shadow-xl hover:bg-[#003a5c] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Login"}
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-xs font-bold text-slate-300 uppercase tracking-widest bg-white px-4">OR</div>
                    </div>

                    <button type="button" className="w-full h-16 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center gap-4 text-[#002b45] font-bold hover:bg-slate-50 transition-all">
                        <Chrome size={20} className="text-slate-700" />
                        Login with Google
                    </button>

                    <p className="text-center font-bold text-slate-400">
                        Don't have an account? <Link to="/register" className="text-[#134e8d] hover:underline">Register</Link>
                    </p>

                    <div className="pt-8 flex justify-center gap-8 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
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
