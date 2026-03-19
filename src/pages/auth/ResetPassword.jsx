import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Shield, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import api from "../../services/api";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Basic password validation metric
    const isPasswordStrong = 
        password.length >= 8 && 
        /(?=.*[a-z])/.test(password) &&
        /(?=.*[A-Z])/.test(password) &&
        /(?=.*\d)/.test(password) &&
        /(?=.*[@$!%*?&])/.test(password);

    const isMatch = password === confirmPassword;
    const isValid = isPasswordStrong && isMatch && password.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isValid) return;

        setIsLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            toast({
                title: "Password Reset Successful",
                description: "You securely updated your password and can now login."
            });
            navigate("/login");
        } catch (error) {
            toast({
                title: "Reset Failed",
                description: error.response?.data?.message || "Invalid or expired token.",
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
                    <h2 className="text-4xl font-extrabold text-[#002b45] tracking-tight mb-3">New Password</h2>
                    <p className="text-slate-500 font-medium">Create a new secure password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">New Password</label>
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={20} strokeWidth={2.5} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full h-16 bg-slate-50 border-2 rounded-2xl pl-16 pr-16 text-[#002b45] font-bold text-base outline-none focus:bg-white transition-all placeholder:text-slate-300 ${!isPasswordStrong && password.length > 0 ? 'border-red-400 focus:border-red-500' : 'border-slate-50 focus:border-[#134e8d]/20'}`}
                                placeholder="Min 8 chars, 1 upper, 1 lower, 1 num, 1 special"
                                required
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

                    <div className="space-y-3">
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={20} strokeWidth={2.5} />
                            </div>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full h-16 bg-slate-50 border-2 rounded-2xl pl-16 pr-16 text-[#002b45] font-bold text-base outline-none focus:bg-white transition-all placeholder:text-slate-300 ${!isMatch && confirmPassword.length > 0 ? 'border-red-400 focus:border-red-500' : 'border-slate-50 focus:border-[#134e8d]/20'}`}
                                placeholder="Repeat new password"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading || !isValid}
                        className="w-full h-16 mt-2 bg-[#10b981] text-white rounded-2xl text-[18px] font-bold shadow-xl shadow-emerald-500/20 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <><Loader2 className="animate-spin" /> Updating...</>
                        ) : (
                            <>Reset Password <ArrowRight size={22} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
