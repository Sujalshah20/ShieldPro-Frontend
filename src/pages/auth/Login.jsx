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
    <div className="min-h-screen w-full bg-[#f0f4f5] flex items-center justify-center p-4 md:p-10 font-display">
      <div className="w-full max-w-6xl min-h-[700px] flex flex-col md:flex-row bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
          
          {/* Left Panel: Login Interface */}
          <div className="flex-1 p-12 md:p-24 flex flex-col justify-center">
              <div className="max-w-md w-full mx-auto">
                  <Reveal width="100%" direction="down">
                      <div className="mb-10">
                          <h1 className="text-4xl font-black text-[#012b3f] tracking-tight mb-3">Secure Vault Access</h1>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Please enter your credentials to access your secure policy vault.
                          </p>
                      </div>
                  </Reveal>

                  <form onSubmit={handleSubmit} className="space-y-6">
                      <Reveal width="100%" delay={0.1}>
                          <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest ml-1">Email Address</label>
                              <div className="relative group">
                                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0082a1] transition-colors">
                                      <Mail size={18} />
                                  </div>
                                  <input
                                      type="email"
                                      placeholder="name@company.com"
                                      className="w-full bg-[#f8fafb] border border-slate-200 rounded-xl pl-14 pr-6 py-4 focus:bg-white focus:ring-4 focus:ring-[#0082a1]/10 focus:border-[#0082a1] outline-none transition-all text-sm font-medium text-[#012b3f]"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      required
                                  />
                              </div>
                          </div>
                      </Reveal>

                      <Reveal width="100%" delay={0.2}>
                          <div className="space-y-2">
                              <div className="flex justify-between items-center px-1">
                                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Password</label>
                                  <button 
                                      type="button"
                                      onClick={() => setShowForgotModal(true)}
                                      className="text-[11px] font-bold text-[#0082a1] hover:underline"
                                  >
                                      Forgot password?
                                  </button>
                              </div>
                              <div className="relative group">
                                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0082a1] transition-colors">
                                      <Lock size={18} />
                                  </div>
                                  <input
                                      type="password"
                                      placeholder="••••••••"
                                      className="w-full bg-[#f8fafb] border border-slate-200 rounded-xl pl-14 pr-6 py-4 focus:bg-white focus:ring-4 focus:ring-[#0082a1]/10 focus:border-[#0082a1] outline-none transition-all text-sm font-medium text-[#012b3f]"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      required
                                  />
                              </div>
                          </div>
                      </Reveal>

                      <div className="flex items-center gap-3 px-1">
                          <input 
                            type="checkbox" 
                            id="remember"
                            className="w-4 h-4 rounded border-slate-300 text-[#0082a1] focus:ring-[#0082a1]"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                          />
                          <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer">Keep me logged in for 30 days</label>
                      </div>

                      <div className="flex items-center gap-3 px-1 text-[#10b981]">
                          <Lock size={12} className="fill-current" />
                          <span className="text-[10px] font-black uppercase tracking-[2px]">256-Bit Encryption Active</span>
                      </div>

                      {error && (
                        <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100 text-xs font-bold">
                          <AlertCircle size={16} />
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0082a1] hover:bg-[#012b3f] text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-all font-bold text-sm shadow-lg shadow-[#0082a1]/20 active:scale-[0.98]"
                      >
                        {isLoading ? (
                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Sign In <ArrowRight size={18} strokeWidth={3} />
                          </>
                        )}
                      </button>
                  </form>

                  <div className="mt-8 relative">
                      <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-100"></div>
                      </div>
                      <div className="relative flex justify-center">
                          <span className="px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-[4px]">OR CONTINUE WITH</span>
                      </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                      <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs uppercase text-slate-600">
                          <Chrome size={16} className="text-[#ea4335]" /> Google
                      </button>
                      <button onClick={() => handleSocialLogin('SSO')} className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs uppercase text-slate-600">
                          <Target size={16} className="text-[#012b3f]" /> SSO for Enterprise
                      </button>
                  </div>
              </div>
          </div>

          {/* Right Panel: Secure Shield Branding */}
          <div className="hidden md:flex md:w-[45%] bg-[#012b3f] p-16 md:p-24 flex-col justify-between relative overflow-hidden">
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10" 
                   style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
              
              <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-16">
                      <div className="w-12 h-12 bg-[#0082a1] rounded-xl flex items-center justify-center shadow-lg">
                          <Shield size={24} className="text-white" />
                      </div>
                      <span className="text-xl font-black text-white tracking-tight">Policyholder Portal</span>
                  </div>

                  <h2 className="text-5xl font-black text-white leading-[1.1] mb-8">
                    Enterprise-grade security for your insurance assets.
                  </h2>
                  <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-sm">
                    Join thousands of companies securing their infrastructure with our industry-leading zero-trust architecture.
                  </p>
              </div>
              
              <div className="relative z-10 w-full">
                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-10 mt-10">
                      <p className="text-white font-bold mb-6 text-center">Don't have an account yet?</p>
                      <Link 
                        to="/register"
                        className="w-full h-14 bg-white text-[#012b3f] rounded-xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center hover:bg-[#0082a1] hover:text-white transition-all shadow-xl"
                      >
                        Create your free account
                      </Link>
                      
                      <div className="mt-8 flex flex-col items-center gap-4">
                          <div className="flex -space-x-3">
                              {[1,2,3].map(i => (
                                  <div key={i} className="w-10 h-10 rounded-full border-4 border-[#012b3f] bg-slate-300 overflow-hidden shadow-xl">
                                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Expert" />
                                  </div>
                              ))}
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Trusted by 10k+ security experts</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );

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
