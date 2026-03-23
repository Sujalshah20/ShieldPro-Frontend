import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, Lock, ArrowRight, Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { api } from "../../utils/api";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email") || "";
    const otp = queryParams.get("otp") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passwordRules = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Matches current requirement", met: password.length > 0 && password.length <= 20 },
        { label: "Uppercase & Lowercase", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Special character (@$!%*?&)", met: /[@$!%*?&]/.test(password) }
    ];

    const isMatch = confirmPassword.length > 0 && password === confirmPassword;
    const isValid = passwordRules.every(r => r.met) && isMatch;

    const handleKeyDown = (e) => {
        if (password.length >= 20 && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toast({ title: "Limit Exceeded", description: "Password cannot exceed 20 characters", variant: "destructive" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid || isLoading) return;

        setIsLoading(true);
        try {
            await api.post(`/auth/reset-password`, { email, otp, password });
            toast({
                title: "Password Updated",
                description: "Your password has been reset. You can now login with your new credentials."
            });
            navigate("/login");
        } catch (error) {
            toast({
                title: "Reset Failed",
                description: error.response?.data?.message || "Something went wrong. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl w-full max-w-xl">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-[#134e8d] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Shield size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-extrabold text-[#002b45] tracking-tight">Secure Shield</span>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-[#002b45] mb-3">Set New Password</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Secure your account with a strong password. <br />
                        Resetting for <span className="font-bold text-[#134e8d]">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-8 p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                         {/* Passwords Checks */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {passwordRules.map((rule, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${rule.met ? 'bg-emerald-500' : 'bg-slate-200'} transition-all`}>
                                        {rule.met && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className={`text-[11px] font-bold ${rule.met ? 'text-emerald-600' : 'text-slate-400'}`}>{rule.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">New Password</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={20} strokeWidth={2.5} />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl pl-16 pr-16 text-[#002b45] font-bold text-base outline-none focus:border-[#134e8d]/20 transition-all placeholder:text-slate-300"
                                        placeholder="8-20 characters"
                                        autoFocus
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={20} strokeWidth={2.5} />
                                    </div>
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full h-14 bg-white border-2 rounded-2xl pl-16 pr-6 text-[#002b45] font-bold text-base outline-none transition-all placeholder:text-slate-300 ${isMatch ? 'border-emerald-500' : confirmPassword.length > 0 ? 'border-red-400' : 'border-slate-200 focus:border-[#134e8d]/20'}`}
                                        placeholder="Repeat your password"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading || !isValid}
                        className="w-full h-16 bg-[#134e8d] text-white rounded-2xl text-[18px] font-bold shadow-xl shadow-[#134e8d]/20 hover:bg-[#0f3d6d] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <><Loader2 className="animate-spin" /> Updating...</>
                        ) : (
                            <>Update Password <ArrowRight size={22} /></>
                        )}
                    </button>
                </form>

                {confirmPassword.length > 0 && !isMatch && (
                    <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 text-[13px] font-bold animate-in fade-in slide-in-from-top-2">
                        <ShieldAlert size={18} />
                        <span>Passwords do not match. Please verify.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
