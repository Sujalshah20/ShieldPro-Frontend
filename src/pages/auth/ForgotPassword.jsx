import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { api } from "../../utils/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();

    const validateEmail = (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return "Please enter a valid email address.";
        if ((val.match(/@/g) || []).length > 1) return "Only one @ allowed.";
        if (/\s/.test(val)) return "No spaces allowed.";
        return "";
    };

    const handleKeyDown = (e) => {
        if (e.key === " ") {
            e.preventDefault();
            toast({ title: "Invalid Input", description: "Email cannot contain spaces", variant: "destructive" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateEmail(email.trim());
        if (err) {
            setErrors(err);
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: email.trim() });
            toast({
                title: "OTP Sent",
                description: "A 6-digit reset code has been sent to your email."
            });
            // Redirect to verify page with type reset
            navigate(`/verify-email?email=${encodeURIComponent(email.trim())}&type=reset`);
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
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 selection:bg-[#10b981] selection:text-white font-sans">
            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl w-full max-w-xl">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-[#134e8d] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Shield size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-extrabold text-white tracking-tight">Secure Shield</span>
                    </Link>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3">Forgot Password?</h2>
                    <p className="text-slate-500 font-medium">No worries, we'll send a 6-digit secure OTP to your email.</p>
                </div>

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
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors("");
                                }}
                                onKeyDown={handleKeyDown}
                                className={`w-full h-16 bg-slate-50 border-2 rounded-2xl pl-16 pr-6 text-white font-bold text-base outline-none focus:bg-white transition-all placeholder:text-slate-300 ${errors ? 'border-red-400 focus:border-red-500' : 'border-slate-50 focus:border-[#134e8d]/20'}`}
                                placeholder="yourname@example.com"
                                autoFocus
                            />
                        </div>
                        {errors && <p className="text-red-500 text-xs pl-2 font-bold">{errors}</p>}
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full h-16 bg-[#10b981] text-white rounded-2xl text-[18px] font-bold shadow-xl shadow-emerald-500/20 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <><Loader2 className="animate-spin" /> Processing...</>
                        ) : (
                            <>Send OTP <ArrowRight size={22} /></>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-[#134e8d] transition-colors text-sm uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
