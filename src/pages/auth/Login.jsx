import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, AlertCircle, Info, ArrowRight } from "lucide-react";
import { z } from "zod";
import Reveal from "../../components/common/Reveal";
import HeroScene from "../../components/3d/HeroScene";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  // ... (lines 15-55)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Zod Validation
      loginSchema.parse({ email, password });

      const user = await login(email, password);
      if (!user) {
        setError("Invalid email or password");
        return;
      }

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
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full premium-gradient flex items-center justify-center p-4 relative overflow-hidden bg-transparent-overlay">
      <HeroScene />
      <div className="auth-container w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass-premium gradient-border-animate p-6 sm:p-10 rounded-3xl relative overflow-visible"
        >
          <div className="relative z-10 text-center">
            <Reveal width="100%" direction="down">
              <motion.div
                initial={{ scale: 0.5, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex justify-center mb-6"
              >
                <div className="p-2 bg-white rounded-3xl shadow-lg border border-white/20">
                  <img src="/shieldpro_logo.svg" alt="ShieldPro Logo" className="w-12 h-12 sm:w-16 sm:h-16" />
                </div>
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="opacity-60 mb-6 sm:mb-8 font-medium text-sm sm:text-base">Enter your credentials to access your account</p>
            </Reveal>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <Reveal width="100%" delay={0.3} direction="right">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-widest">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3 sm:py-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal width="100%" delay={0.4} direction="right">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Password</label>
                    <Link to="#" className="text-xs text-blue-600 font-semibold link-underline transition-colors pb-0.5">Forgot Password?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3 sm:py-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </Reveal>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <Reveal width="100%" delay={0.5} direction="up">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-gradient btn-tactile text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </Reveal>
            </form>

            <Reveal width="100%" delay={0.6} direction="up">
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                <p className="opacity-60 text-sm font-medium">
                  New to ShieldPro?{" "}
                  <Link to="/register" className="text-blue-600 font-bold link-underline pb-0.5">
                    Create Account
                  </Link>
                </p>
              </div>
            </Reveal>

            <Reveal width="100%" delay={0.7} direction="up">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-5 text-left"
              >
                <div className="flex items-center gap-2 mb-3 text-slate-600 dark:text-slate-400">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Demo Access</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-[12px]">
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/10 pb-1">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Admin:</span>
                    <span className="text-slate-800 dark:text-white font-bold">admin@shieldpro.com</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/10 pb-1">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Agent:</span>
                    <span className="text-slate-800 dark:text-white font-bold">agent@shieldpro.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Customer:</span>
                    <span className="text-slate-800 dark:text-white font-bold">customer@shieldpro.com</span>
                  </div>
                  <div className="mt-2 text-center font-bold text-blue-600 dark:text-blue-400 italic bg-blue-50 dark:bg-blue-900/20 py-1 rounded-lg">
                    Password: ...123
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
