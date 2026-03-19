import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { Shield, CheckCircle2, XCircle, ArrowRight, Loader2, Mail, ArrowLeft } from "lucide-react";
import { api } from "../../utils/api";

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryParams = new URLSearchParams(location.search);
    const initialEmail = queryParams.get("email") || "";
    const type = queryParams.get("type") || "verification"; // verification or reset

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length < 6) return;

        setIsLoading(true);
        try {
            const res = await api.post("/auth/verify-otp", { email, otp: otpString, type });
            
            toast({
                title: "Successfully Verified",
                description: res.message || "Credential verified successfully."
            });

            if (type === "verification") {
                navigate("/login");
            } else {
                // If reset, go to ResetPassword with the OTP and email
                navigate(`/reset-password?email=${email}&otp=${otpString}`);
            }
        } catch (error) {
            toast({
                title: "Verification Failed",
                description: error.response?.data?.message || "Invalid or expired OTP.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setResendLoading(true);
        try {
            await api.post(type === "verification" ? "/auth/register" : "/auth/forgot-password", { email }); // This is a bit hacky for register resend, usually need a dedicated resend endpoint
            setCountdown(60);
            toast({ title: "OTP Sent", description: "A new 6-digit code has been sent to your email." });
        } catch (error) {
            toast({ title: "Resend Failed", description: "Could not send new OTP. Please try again later.", variant: "destructive" });
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4 font-sans">
            <Link to="/" className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-[#134e8d] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Shield size={28} strokeWidth={2.5} />
                </div>
                <span className="text-3xl font-extrabold text-[#002b45] tracking-tight">Secure Shield</span>
            </Link>

            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl w-full max-w-lg">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail size={32} className="text-amber-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#002b45] mb-3">Check Your Email</h2>
                    <p className="text-slate-500 font-medium">
                        We've sent a 6-digit verification code to <br />
                        <strong className="text-[#134e8d]">{email || "your email"}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="flex justify-between gap-2 md:gap-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-full h-14 md:h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-[#134e8d]/20 outline-none transition-all text-[#002b45]"
                                maxLength={1}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || otp.join("").length < 6}
                        className="w-full h-14 bg-[#10b981] text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:bg-[#0da371] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
                    >
                        {isLoading ? (
                            <><Loader2 size={24} className="animate-spin" /> Verifying...</>
                        ) : (
                            <>Verify Code <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center space-y-4">
                    <p className="text-slate-500 text-sm font-medium">
                        Didn't receive the code?{" "}
                        {countdown > 0 ? (
                            <span className="text-slate-400 font-bold ml-1">Resend in {countdown}s</span>
                        ) : (
                            <button 
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="text-[#134e8d] font-bold hover:underline ml-1"
                            >
                                {resendLoading ? "Sending..." : "Resend OTP"}
                            </button>
                        )}
                    </p>
                    <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-[#002b45] transition-colors text-sm uppercase tracking-widest mt-4">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
