import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import api from "../../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

        setIsLoading(true);
        try {
            // Adjust endpoint if needed
            await api.post('/auth/forgot-password', { email });
            setIsSent(true);
            toast({
                title: "Reset Link Sent",
                description: "If an account exists with this email, a reset link has been sent."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to process request.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 selection:bg-[#10b981] selection:text-white">
            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl w-full max-w-xl">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-[#134e8d] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Shield size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-extrabold text-[#002b45] tracking-tight">Secure Shield</span>
                    </Link>
                    <h2 className="text-4xl font-extrabold text-[#002b45] tracking-tight mb-3">Reset Password</h2>
                    <p className="text-slate-500 font-medium">Enter your registered email address to receive password reset instructions.</p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail size={20} strokeWidth={2.5} />
                                </div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl pl-16 pr-6 text-[#002b45] font-bold text-base outline-none focus:bg-white focus:border-[#134e8d]/20 transition-all placeholder:text-slate-300"
                                    placeholder="yourname@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full h-16 bg-[#10b981] text-white rounded-2xl text-[18px] font-bold shadow-xl shadow-emerald-500/20 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" /> Sending...</>
                            ) : (
                                <>Send Reset Link <ArrowRight size={22} /></>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center bg-slate-50 p-8 rounded-3xl border-2 border-slate-100">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail size={32} className="text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-[#002b45] mb-2">Check your inbox</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            We've sent password reset instructions to <strong>{email}</strong>.
                        </p>
                        <button 
                            onClick={() => setIsSent(false)}
                            className="text-[#134e8d] font-bold text-sm hover:underline"
                        >
                            Try another email address
                        </button>
                    </div>
                )}

                <div className="mt-10 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#134e8d] transition-colors">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
