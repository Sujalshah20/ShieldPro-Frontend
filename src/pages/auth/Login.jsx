import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, Mail, Lock, Eye, EyeOff, 
    ArrowRight, Loader2, ShieldCheck, Chrome
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            toast({ title: "Authentication Successful", description: "Inbound synchronization active." });
            
            setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'agent') navigate('/agent');
                else navigate('/customer');
            }, 800);
        } catch (error) {
            toast({ 
                title: "Access Denied", 
                description: error.response?.data?.message || "Verify your credentials and try again.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 lg:p-12 font-display">
            <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl flex overflow-hidden border border-[#ccdbdc]/50 min-h-[600px]">
                
                {/* Brand Side - Optimized Balance */}
                <div className="hidden lg:flex w-[45%] bg-[#003249] p-16 flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#80ced7_1px,transparent_0)] [background-size:20px_20px]" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2 mb-16 group">
                            <div className="bg-[#007ea7] p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight">ShieldPro</span>
                        </Link>

                        <h2 className="text-white text-3xl font-black leading-tight mb-6 mt-12">
                            Secure your insurance infrastructure.
                        </h2>
                        <p className="text-[#80ced7] font-medium leading-relaxed opacity-80">
                            The professional standard for managing complex policy lifecycles with enterprise-grade security.
                        </p>
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/10">
                         <div className="flex items-center gap-4">
                             <div className="flex -space-x-3">
                                 {[1,2,3].map(i => (
                                     <div key={i} className="w-9 h-9 rounded-full border-2 border-[#003249] bg-[#ccdbdc] overflow-hidden shadow-lg">
                                         <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Specialist" className="w-full h-full object-cover" />
                                     </div>
                                 ))}
                             </div>
                             <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Trusted by 10k+ security experts</p>
                         </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-[55%] p-10 md:p-16 flex flex-col justify-center bg-white relative">
                    <div className="mb-12">
                        <h1 className="text-2xl font-black text-[#003249] mb-2">Welcome back.</h1>
                        <p className="text-sm font-semibold text-[#003249]/40 tracking-tight">Enter your credentials to access your node.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#003249] uppercase tracking-widest pl-1">Security Identity</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#007ea7] transition-colors" />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#f8fafc] border border-[#ccdbdc] rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold text-[#003249] focus:outline-none focus:ring-2 focus:ring-[#007ea7]/10 focus:border-[#007ea7] transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center pl-1">
                                <label className="text-[11px] font-black text-[#003249] uppercase tracking-widest">Access Key</label>
                                <button type="button" className="text-[10px] font-bold text-[#007ea7] hover:underline">Reset terminal?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#007ea7] transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-[#f8fafc] border border-[#ccdbdc] rounded-xl py-3.5 pl-12 pr-12 text-sm font-semibold text-[#003249] focus:outline-none focus:ring-2 focus:ring-[#007ea7]/10 focus:border-[#007ea7] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#003249]"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 py-2">
                            <input type="checkbox" className="w-4 h-4 rounded border-[#ccdbdc] text-[#007ea7] focus:ring-[#007ea7]/20" id="remember" />
                            <label htmlFor="remember" className="text-[11px] font-bold text-[#003249]/60 cursor-pointer">Stay authorized for 30 cycles</label>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-4 text-sm uppercase tracking-widest mt-4"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                                <>Authorize Sync <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                        <div className="relative flex items-center justify-center py-6">
                            <div className="absolute inset-x-0 h-px bg-[#ccdbdc]/30" />
                            <span className="relative px-4 bg-white text-[10px] font-black text-[#003249]/30 uppercase tracking-[4px]">External Uplinks</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="btn btn-ghost py-3 text-[10px] uppercase tracking-widest border-[#ccdbdc]/50 bg-white">
                                <Chrome className="w-4 h-4 text-[#007ea7]" /> Google
                            </button>
                            <button type="button" className="btn btn-ghost py-3 text-[10px] uppercase tracking-widest border-[#ccdbdc]/50 bg-white">
                                <ShieldCheck className="w-4 h-4 text-[#003249]" /> Enterprise
                            </button>
                        </div>

                        <p className="text-center text-xs font-semibold text-[#003249]/40 mt-10">
                            New protocol? <Link to="/register" className="text-[#007ea7] font-black hover:underline ml-1">Request Node Access</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
