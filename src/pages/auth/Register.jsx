import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Shield, User, Mail, Lock, UserCheck, AlertCircle } from "lucide-react";
import { z } from "zod";
import Reveal from "../../components/common/Reveal";
import HeroScene from "../../components/3d/HeroScene";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "agent", "customer"]),
});

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Zod Validation
            registerSchema.parse({ name, email, password, role });

            await register({ name, email, password, role });
            navigate("/login");
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            } else {
                setError(err.message || "An unexpected error occurred. Please try again.");
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
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                className="flex justify-center mb-6"
                            >
                                <div className="p-2 bg-white rounded-3xl shadow-lg border border-white/20">
                                    <img src="/shieldpro_logo.svg" alt="ShieldPro Logo" className="w-12 h-12 sm:w-16 sm:h-16" />
                                </div>
                            </motion.div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">ShieldPro</h1>
                            <p className="opacity-60 mb-6 sm:mb-10 font-medium text-sm sm:text-base">Create your secure account</p>
                        </Reveal>

                        <form onSubmit={handleSubmit} className="space-y-5 text-left">
                            <Reveal width="100%" delay={0.3} direction="right">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-400 ml-1 uppercase tracking-widest">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-12 py-3 sm:py-3.5 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal width="100%" delay={0.4} direction="right">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-400 ml-1 uppercase tracking-widest">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-12 py-3.5 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal width="100%" delay={0.5} direction="right">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-400 ml-1 uppercase tracking-widest">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-12 py-3.5 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal width="100%" delay={0.6} direction="right">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-widest">Role</label>
                                    <div className="relative group">
                                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="agent">Agent</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </Reveal>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-sm"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}

                            <Reveal width="100%" delay={0.7} direction="up">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-gradient btn-tactile text-white font-bold py-4 rounded-2xl shadow-lg transition-all disabled:opacity-50 mt-4 h-14"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Registering...
                                        </div>
                                    ) : "Create Account"}
                                </motion.button>
                            </Reveal>
                        </form>

                        <Reveal width="100%" delay={0.8} direction="up">
                            <p className="mt-8 opacity-60 text-sm font-medium">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 font-bold link-underline pb-0.5">
                                    Sign In
                                </Link>
                            </p>
                        </Reveal>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
