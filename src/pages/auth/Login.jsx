import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Mail, Lock, AlertCircle, Info, 
    ArrowRight, Github, Facebook, Chrome, 
    Fingerprint, CheckCircle2, User, Zap,
    Compass, Globe, Satellite, Target
} from "lucide-react";
import { z } from "zod";
import Reveal from "../../components/common/Reveal";
import HeroScene from "../../components/3d/HeroScene";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
        setError("Identity Verification Required: Please complete the security check.");
        return;
    }
    setIsLoading(true);
    setError("");

    try {
      loginSchema.parse({ email, password });
      const user = await login(email, password);
      
      const roleRedirects = {
        admin: "/admin",
        agent: "/agent",
        customer: "/customer",
      };

      navigate(roleRedirects[user.role] || "/login");
    } catch (err) {
      const zodMessage = err?.errors?.[0]?.message;
      const apiMessage = err?.message;
      setError(zodMessage || apiMessage || "Authentication Failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login integrated. Redirecting to secure provider...`);
  };

  return (
    <div className="min-h-screen w-full bg-background-main flex items-center justify-center p-6 relative overflow-hidden font-display">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <HeroScene />
      </div>

      <div className="auth-container w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden relative z-10">
          
          {/* Left Panel: Secure Shield Branding */}
          <div className="hidden md:flex md:w-5/12 bg-header-bg p-16 flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                  <Shield size={320} className="text-white" />
              </div>
              
              <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                      <Shield size={32} className="text-white" strokeWidth={3} />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-white uppercase leading-none mb-4">
                      SECURE<br/><span className="text-primary tracking-normal">SHIELD</span>
                  </h2>
                  <div className="h-1.5 w-16 bg-primary rounded-full mb-10 shadow-lg shadow-primary/20" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[4px] leading-relaxed italic">
                      ESTABLISHING SECURE ACCESS TO YOUR PREMIUM INSURANCE PORTFOLIO.
                  </p>
              </div>
              
              <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-5 group">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-primary transition-all duration-500 shadow-lg">
                          <Lock size={20} strokeWidth={3} />
                       </div>
                       <div className="flex flex-col">
                             <span className="text-[10px] font-black uppercase tracking-[3px] text-white">Encrypted Tunnel</span>
                             <span className="text-[8px] font-black uppercase tracking-[2px] text-white/30">AES-256 Enabled</span>
                       </div>
                  </div>
                  <div className="flex items-center gap-5 group">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-primary transition-all duration-500 shadow-lg">
                          <Globe size={20} strokeWidth={3} />
                       </div>
                       <div className="flex flex-col">
                             <span className="text-[10px] font-black uppercase tracking-[3px] text-white">Global Network</span>
                             <span className="text-[8px] font-black uppercase tracking-[2px] text-white/30">International Nodes Active</span>
                       </div>
                  </div>
              </div>
          </div>

          {/* Right Panel: Login Interface */}
          <div className="flex-1 p-12 md:p-20 bg-white">
              <Reveal width="100%" direction="down">
                  <div className="flex flex-col mb-12">
                      <h1 className="text-4xl font-black tracking-tighter text-header-bg uppercase leading-none">WELCOME <span className="text-primary tracking-normal">BACK</span></h1>
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-[5px] mt-4">Authorized User Login</p>
                  </div>
              </Reveal>

              <form onSubmit={handleSubmit} className="space-y-8">
                  <Reveal width="100%" delay={0.2} direction="right">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[4px] text-primary italic ml-1">IDENTIFIER</label>
                          <div className="relative group">
                              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                              <input
                                  type="email"
                                  placeholder="EMAIL ADDRESS"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-16 py-5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-xs uppercase tracking-widest text-header-bg"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                              />
                          </div>
                      </div>
                  </Reveal>

                  <Reveal width="100%" delay={0.3} direction="right">
                      <div className="space-y-3">
                          <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-black uppercase tracking-[4px] text-primary italic">CREDENTIAL</label>
                              <button 
                                  type="button"
                                  onClick={() => setShowForgotModal(true)}
                                  className="text-[9px] font-black uppercase tracking-[3px] text-slate-400 hover:text-primary transition-colors"
                              >
                                  FORGOT KEY?
                              </button>
                          </div>
                          <div className="relative group">
                              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                              <input
                                  type="password"
                                  placeholder="PASSWORD"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-16 py-5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-xs uppercase tracking-widest text-header-bg"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                              />
                          </div>
                      </div>
                  </Reveal>

                  <div className="flex items-center justify-between px-2">
                       <label className="flex items-center gap-4 cursor-pointer group">
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-110' : 'border-slate-200 group-hover:border-primary/50'}`}>
                            {rememberMe && <CheckCircle2 className="w-4 h-4 text-white stroke-[4px]" />}
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={rememberMe}
                              onChange={() => setRememberMe(!rememberMe)}
                            />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-header-bg transition-all uppercase tracking-[3px] italic">Remember access</span>
                        </label>
                  </div>

                  {/* High-Tech Captcha */}
                  <div 
                    onClick={() => setIsCaptchaVerified(!isCaptchaVerified)}
                    className={`h-20 border-2 rounded-2xl flex items-center justify-between px-8 cursor-pointer transition-all duration-500 overflow-hidden relative group ${isCaptchaVerified ? 'border-emerald-500/50 bg-emerald-500/[0.03] shadow-lg shadow-emerald-500/5' : 'border-slate-200 bg-slate-50 hover:border-primary/30'}`}
                  >
                        {isCaptchaVerified && (
                            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute left-0 bottom-0 h-1 bg-emerald-500" />
                        )}
                        <div className="flex items-center gap-6 relative z-10">
                            <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-500 ${isCaptchaVerified ? 'bg-emerald-500 border-emerald-500 shadow-xl shadow-emerald-500/30 rotate-[360deg]' : 'border-slate-300 group-hover:border-primary'}`}>
                                {isCaptchaVerified && <CheckCircle2 className="w-5 h-5 text-white stroke-[4px]" />}
                            </div>
                            <div>
                                <span className={`text-[11px] font-black uppercase tracking-[3px] transition-colors ${isCaptchaVerified ? 'text-emerald-500' : 'text-slate-400'}`}>Identity Verification</span>
                                <p className="text-[8px] font-black uppercase tracking-[2px] opacity-20">Secure biometric check</p>
                            </div>
                        </div>
                        <Fingerprint size={20} className={`transition-all duration-500 ${isCaptchaVerified ? 'text-emerald-500 scale-125' : 'opacity-10'}`} />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-5 text-rose-500 bg-rose-500/10 p-6 rounded-2xl border border-rose-500/20 text-[10px] font-black uppercase tracking-[2px] shadow-sm italic"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={3} />
                      {error}
                    </motion.div>
                  )}

                  <Reveal width="100%" delay={0.4} direction="up">
                    <button
                      type="submit"
                      disabled={isLoading}
                       className="w-full bg-primary hover:bg-header-bg text-white py-6 rounded-2xl flex items-center justify-center gap-4 transition-all transform hover:translate-y-[-5px] active:scale-[0.98] disabled:opacity-50 group font-black uppercase tracking-[5px] shadow-2xl shadow-primary/30"
                    >
                      {isLoading ? (
                         <div className="w-6 h-6 border-[4px] border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          INITIALIZE LOGIN
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" strokeWidth={3} />
                        </>
                      )}
                    </button>
                  </Reveal>
              </form>

              <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-10">
                  <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                      No account? <Link to="/register" className="text-primary hover:text-header-bg ml-2 transition-colors">JOIN SECURE SHIELD</Link>
                  </p>
                  
                  <div className="flex gap-6">
                        {['GOOGLE', 'FACEBOOK'].map(id => (
                            <button key={id} onClick={() => handleSocialLogin(id)} className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center grayscale hover:grayscale-0 transition-all hover:scale-110 active:scale-90">
                                {id === 'GOOGLE' ? <Chrome size={18} className="text-rose-500" /> : <Facebook size={18} className="text-blue-600" />}
                            </button>
                        ))}
                  </div>
              </div>
          </div>
      </div>
      
      {/* Visual Ambiance */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-40 z-[1]">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setShowForgotModal(false)}
                    className="absolute inset-0 bg-header-bg/90 backdrop-blur-xl"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-lg bg-white p-16 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                        <Shield size={200} className="text-primary rotate-45" />
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-header-bg">ACCESS<span className="text-primary tracking-normal ml-2">RECOVERY</span></h2>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px] mb-12 italic">Initiate secure reset protocol.</p>
                        
                        <div className="space-y-6">
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="email" 
                                    placeholder="REGISTERED EMAIL" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-16 py-5 outline-none focus:border-primary transition-all font-black text-xs uppercase tracking-widest text-header-bg"
                                />
                            </div>
                            <button 
                                 onClick={() => {
                                     alert("Recovery instructions sent. Please check your inbox.");
                                     setShowForgotModal(false);
                                 }}
                                 className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[5px] shadow-2xl shadow-primary/30 hover:translate-y-[-5px] transition-all"
                            >
                                SEND RESET LINK
                            </button>
                        </div>
                        
                        <button 
                             onClick={() => setShowForgotModal(false)}
                             className="w-full mt-8 text-[9px] font-black uppercase tracking-[4px] text-slate-400 hover:text-header-bg transition-colors"
                        >
                            RETURN TO LOGIN
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
