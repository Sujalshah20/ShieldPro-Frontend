import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Mail, Lock, AlertCircle, Info, 
    ArrowRight, Github, Facebook, Chrome, 
    Fingerprint, CheckCircle2
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
        setError("Please verify you are not a bot.");
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
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || "An error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login coming soon! Connect your account for 1-click access.`);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotModal(true);
  };

  return (
    <div className="min-h-screen w-full premium-gradient flex items-center justify-center p-4 relative overflow-hidden bg-transparent-overlay">
      <HeroScene />
      
      <div className="auth-container w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass-premium gradient-border-animate p-8 sm:p-10 rounded-[32px] relative overflow-visible shadow-2xl"
        >
          <div className="relative z-10 text-center">
            <Reveal width="100%" direction="down">
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className="flex justify-center mb-6"
              >
                <div className="p-4 bg-gold rounded-3xl shadow-[0_0_40px_rgba(255,184,0,0.3)] border border-gold/50 flex items-center justify-center group">
                  <Shield className="w-10 h-10 text-gold-foreground transition-transform group-hover:scale-110" />
                </div>
              </motion.div>

              <h1 className="text-3xl font-extrabold mb-1 tracking-tight text-foreground">Welcome Back</h1>
              <p className="opacity-60 mb-8 font-medium text-sm">Access your secure ShieldPro portal</p>
            </Reveal>

            {/* Social Logins */}
            <div className="flex gap-4 mb-8">
                <button onClick={() => handleSocialLogin('Google')} className="flex-1 h-12 glass-premium border border-border rounded-2xl flex items-center justify-center hover:bg-white/5 transition-colors group">
                    <Chrome className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                </button>
                <button onClick={() => handleSocialLogin('Facebook')} className="flex-1 h-12 glass-premium border border-border rounded-2xl flex items-center justify-center hover:bg-white/5 transition-colors group">
                    <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                </button>
                <button onClick={() => handleSocialLogin('Github')} className="flex-1 h-12 glass-premium border border-border rounded-2xl flex items-center justify-center hover:bg-white/5 transition-colors group">
                    <Github className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
                </button>
            </div>

            <div className="relative flex items-center gap-4 mb-8 opacity-40">
                <div className="flex-1 h-[1px] bg-foreground"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Or use email</span>
                <div className="flex-1 h-[1px] bg-foreground"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <Reveal width="100%" delay={0.2} direction="right">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-background/50 border border-border rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Reveal>

              <Reveal width="100%" delay={0.3} direction="right">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-background/50 border border-border rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Reveal>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 rounded border-border text-gold focus:ring-gold/20" 
                  />
                  <span className="text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity">Remember Me</span>
                </label>
                <button 
                  onClick={handleForgotPassword}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Mock Bot Protection */}
              <div 
                onClick={() => setIsCaptchaVerified(!isCaptchaVerified)}
                className={`h-12 border rounded-2xl flex items-center justify-between px-4 cursor-pointer transition-all ${isCaptchaVerified ? 'border-green-500/50 bg-green-500/5' : 'border-border bg-slate-50 dark:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                    {isCaptchaVerified ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 border-2 border-slate-300 rounded-lg" />}
                    <span className="text-xs font-medium opacity-70">I'm not a robot</span>
                </div>
                <div className="text-[10px] font-bold opacity-30 tracking-wider">RECAPTCHA</div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 text-xs font-bold"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <Reveal width="100%" delay={0.4} direction="up">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-gold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 group font-bold"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gold-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </Reveal>
            </form>

            <Reveal width="100%" delay={0.5} direction="up">
              <p className="mt-8 opacity-60 text-sm font-medium">
                New to the Shield?{" "}
                <Link to="/register" className="text-blue-600 font-bold hover:underline">
                  Join ShieldPro
                </Link>
              </p>
            </Reveal>

            {/* Demo Access Hints (Updated) */}
            <div className="mt-8 pt-8 border-t border-border/50">
               <div className="flex items-center justify-center gap-2 mb-4 opacity-40">
                  <Fingerprint className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[2px]">Super User Access</span>
               </div>
               <div className="grid grid-cols-3 gap-2">
                   {['Admin', 'Agent', 'Customer'].map(role => (
                       <div key={role} className="p-2 glass-premium border border-border rounded-xl text-[10px] font-bold opacity-60">
                           {role}
                       </div>
                   ))}
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal Placeholder */}
      <AnimatePresence>
        {showForgotModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setShowForgotModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm glass-premium p-8 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <Lock className="w-32 h-32" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                    <p className="text-xs opacity-60 mb-6">Enter your email and we'll send you a recovery link.</p>
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="w-full bg-background/50 border border-border rounded-2xl px-4 py-3.5 mb-4 outline-none focus:border-gold transition-colors"
                    />
                    <button 
                         onClick={() => {
                             alert("Recovery link sent! Please check your inbox.");
                             setShowForgotModal(false);
                         }}
                         className="w-full btn-gold py-3.5 rounded-2xl font-bold"
                    >
                        Send Reset Link
                    </button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
