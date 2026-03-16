import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, Mail, Lock, Eye, EyeOff, 
    ArrowRight, Loader2, ShieldCheck, Chrome,
    Fingerprint, Terminal, Activity, Zap, Layers, RefreshCcw, ChevronRight, Satellite, Database, Command
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";

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
            toast({ 
                title: "AUTHENTICATION_SUCCESSFUL", 
                description: "Inbound synchronization active. Establishing session protocols..." 
            });
            
            setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'agent') navigate('/agent');
                else navigate('/customer');
            }, 1000);
        } catch (error) {
            toast({ 
                title: "ACCESS_DENIED", 
                description: error.response?.data?.message || "Operational anomaly detected. Verify credentials and retry transmission.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-12 font-display relative overflow-hidden">
             {/* Deep Space Background Effects */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
            <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[800px] bg-[#007ea7]/10 blur-[180px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] bg-[#003249]/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, type: "spring", stiffness: 50 }}
                className="w-full max-w-7xl bg-white/70 backdrop-blur-3xl rounded-[5rem] shadow-4xl flex flex-col lg:flex-row overflow-hidden border-4 border-white relative z-10 min-h-[850px]"
            >
                {/* Tactical Sidebar - Brand Panel */}
                <div className="hidden lg:flex w-[42%] bg-[#003249] p-24 flex-col justify-between relative overflow-hidden text-white border-r-8 border-white">
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#007ea7_1px,transparent_0)] [background-size:40px_40px]" />
                    <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-8 mb-32 group">
                            <div className="w-24 h-24 bg-[#007ea7] rounded-[2.5rem] flex items-center justify-center text-[#003249] shadow-4xl group-hover:rotate-[360deg] transition-all duration-[2000ms] border-4 border-white/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                                <Shield size={48} strokeWidth={3} className="relative z-10" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-black tracking-tighter italic leading-none">Shield<span className="text-[#80ced7]">Pro</span></span>
                                <span className="text-[10px] font-black uppercase tracking-[6px] text-white/30 mt-2 italic shadow-sm">GLOBAL_QUORUM_V4.2</span>
                            </div>
                        </Link>

                        <div className="space-y-16 mt-20">
                            <Reveal direction="left" delay={0.2}>
                                <h2 className="text-white text-7xl font-black leading-none uppercase tracking-tighter italic">
                                    Secure your <br /> <span className="text-[#80ced7] underline decoration-[12px] decoration-[#007ea7] underline-offset-[20px]">Infrastructure.</span>
                                </h2>
                            </Reveal>
                            <Reveal direction="left" delay={0.4}>
                                <p className="text-[#80ced7] font-black uppercase tracking-[8px] leading-relaxed text-[15px] italic opacity-40 max-w-md">
                                    The professional standard for managing complex policy lifecycles with enterprise-grade mission-critical encryption.
                                </p>
                            </Reveal>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-12">
                         <div className="p-10 bg-white/5 border-2 border-white/10 rounded-[3rem] backdrop-blur-xl group hover:bg-white/10 transition-all duration-700">
                            <div className="flex items-center gap-10">
                                <div className="w-20 h-20 bg-[#007ea7]/20 border-2 border-[#007ea7]/30 rounded-3xl flex items-center justify-center text-[#80ced7] shadow-4xl group-hover:rotate-12 transition-all duration-700">
                                    <Fingerprint size={36} className="animate-pulse" strokeWidth={3} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-black uppercase tracking-[8px] text-[#007ea7] italic leading-none mb-3">AUTH_SIGNAL_SYNC</span>
                                    <span className="text-[14px] font-black uppercase tracking-[4px] text-white/60 italic leading-none">Awaiting_Terminal_Authorization_</span>
                                </div>
                            </div>
                         </div>
                         <div className="flex items-center justify-between opacity-30 pt-8 border-t-4 border-white/5">
                            <div className="flex gap-10">
                                <Satellite size={24} strokeWidth={3} />
                                <Database size={24} strokeWidth={3} />
                                <Activity size={24} strokeWidth={3} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[8px] italic">NOMINAL_TX_GRID</span>
                         </div>
                    </div>
                </div>

                {/* Authentication Port - Form Side */}
                <div className="w-full lg:w-[58%] p-14 md:p-32 flex flex-col justify-center bg-white relative overflow-hidden group/form">
                    <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none group-hover/form:scale-150 transition-transform duration-[10000ms] -rotate-12">
                        <Terminal size={600} strokeWidth={1} className="text-[#003249]" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-32 opacity-[0.02] pointer-events-none group-hover/form:rotate-[360deg] transition-transform duration-[20000ms]">
                        <Zap size={400} strokeWidth={1} className="text-[#007ea7]" />
                    </div>

                    <div className="mb-24 relative z-10">
                        <Reveal direction="up">
                            <div className="flex items-center gap-8 mb-10">
                                <div className="w-4 h-14 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                                <h3 className="text-[15px] font-black text-[#007ea7] uppercase tracking-[15px] italic leading-none">Access_Terminal_v4.2</h3>
                            </div>
                        </Reveal>
                        <Reveal direction="up" delay={0.1}>
                            <h1 className="text-7xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none mb-10">Welcome Back <span className="text-[#007ea7]">_</span></h1>
                        </Reveal>
                        <Reveal direction="up" delay={0.2}>
                            <p className="text-[14px] font-black text-slate-300 uppercase tracking-[10px] italic leading-relaxed opacity-60">Inject your security credentials to synchronize with the unified tactical grid.</p>
                        </Reveal>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-16 max-w-2xl relative z-10">
                        <Reveal direction="up" delay={0.3}>
                            <div className="space-y-8">
                                <label className="text-[14px] font-black uppercase tracking-[15px] text-[#007ea7] ml-12 flex items-center gap-10 italic leading-none">
                                    <Mail size={24} strokeWidth={3} /> IDENTITY_MANIFEST_ALPHA
                                </label>
                                <div className="relative group/input">
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-28 bg-slate-50 border-4 border-slate-50 rounded-[3.5rem] px-16 text-[18px] font-black text-[#003249] uppercase tracking-[8px] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic"
                                        placeholder="SYNC@SHIELDPRO.GRID"
                                        required
                                    />
                                    <div className="absolute right-16 top-1/2 -translate-y-1/2 text-[#007ea7] opacity-0 group-focus-within/input:opacity-100 transition-opacity"><Layers size={28} strokeWidth={3} className="animate-pulse" /></div>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal direction="up" delay={0.4}>
                            <div className="space-y-8">
                                <div className="flex justify-between items-center px-12">
                                    <label className="text-[14px] font-black uppercase tracking-[15px] text-[#007ea7] italic leading-none flex items-center gap-10">
                                        <Lock size={24} strokeWidth={3} /> ACCESS_KEY_SIGMA
                                    </label>
                                    <button type="button" className="text-[12px] font-black text-slate-300 uppercase tracking-[6px] hover:text-[#003249] italic border-b-4 border-transparent hover:border-[#007ea7]/20 transition-all">RECOVERY_PROTOCOL?</button>
                                </div>
                                <div className="relative group/input">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full h-28 bg-[#003249] border-8 border-white rounded-[3.5rem] px-16 pr-32 text-[18px] font-black text-[#80ced7] uppercase tracking-[15px] outline-none focus:border-[#007ea7] transition-all shadow-4xl italic"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-12 top-1/2 -translate-y-1/2 text-[#80ced7]/40 hover:text-white transition-all scale-150 rotate-[-5deg] hover:rotate-0"
                                    >
                                        {showPassword ? <EyeOff size={28} strokeWidth={3} /> : <Eye size={28} strokeWidth={3} />}
                                    </button>
                                    <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-r from-transparent via-[#007ea7] to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-1000" />
                                </div>
                            </div>
                        </Reveal>

                        <Reveal direction="up" delay={0.5}>
                            <div className="flex items-center gap-8 px-12">
                                <div className="relative flex items-center group/check cursor-pointer">
                                    <input type="checkbox" className="w-10 h-10 rounded-[1rem] border-4 border-slate-100 text-[#007ea7] focus:ring-8 focus:ring-[#007ea7]/10 transition-all cursor-pointer" id="remember" />
                                </div>
                                <label htmlFor="remember" className="text-[13px] font-black text-slate-300 uppercase tracking-[6px] cursor-pointer italic group-hover:text-[#003249] transition-colors leading-none">Maintain Authorization Node for 30 Cycles</label>
                            </div>
                        </Reveal>

                        <Reveal direction="up" delay={0.6}>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-36 bg-[#003249] text-[#80ced7] rounded-[4.5rem] text-[22px] font-black uppercase tracking-[30px] shadow-4xl active:scale-95 group/btn disabled:opacity-50 italic relative overflow-hidden transition-all duration-1000 border-8 border-white hover:text-white hover:border-[#007ea7]/20"
                            >
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                                <span className="relative z-10 flex items-center justify-center gap-16">
                                    {isLoading ? (
                                        <RefreshCcw className="animate-spin text-white" size={56} strokeWidth={5} />
                                    ) : (
                                        <>AUTHORIZE_SYNC <ChevronRight size={56} className="group-hover/btn:translate-x-12 transition-transform duration-1000" strokeWidth={5} /></>
                                    )}
                                </span>
                            </button>
                        </Reveal>

                        <div className="relative flex items-center justify-center py-12 px-6">
                            <div className="absolute inset-x-0 h-1 bg-slate-50" />
                            <span className="relative px-12 bg-white text-[13px] font-black text-slate-200 uppercase tracking-[15px] italic">External_Uplinks</span>
                        </div>

                        <div className="grid grid-cols-2 gap-12">
                            <button type="button" className="h-24 bg-white border-4 border-slate-50 rounded-[2.5rem] flex items-center justify-center gap-8 text-[14px] font-black uppercase tracking-[8px] hover:border-[#007ea7] hover:bg-slate-50/50 transition-all duration-700 italic text-[#003249] shadow-inner group">
                                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors"><Chrome size={28} strokeWidth={3} className="text-[#007ea7]" /></div> GOOGLE_OAUTH
                            </button>
                            <button type="button" className="h-24 bg-white border-4 border-slate-50 rounded-[2.5rem] flex items-center justify-center gap-8 text-[14px] font-black uppercase tracking-[8px] hover:border-[#003249] hover:bg-slate-50/50 transition-all duration-700 italic text-[#003249] shadow-inner group">
                                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors"><ShieldCheck size={28} strokeWidth={3} className="text-[#003249]" /> ENT_LDAP_V2</div>
                            </button>
                        </div>

                        <Reveal direction="up" delay={0.8}>
                            <p className="text-center text-[15px] font-black text-slate-300 uppercase tracking-[8px] italic mt-20 leading-none group/reglink">
                                No Active Protocol Node? <Link to="/register" className="text-[#007ea7] hover:underline ml-6 decoration-8 decoration-[#007ea7]/10 underline-offset-8">Request_Access_Credentials</Link>
                            </p>
                        </Reveal>
                    </form>
                    
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-r from-transparent via-[#007ea7]/20 to-transparent animate-shimmer pointer-events-none opacity-40" />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
