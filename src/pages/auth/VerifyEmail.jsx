import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { Shield, CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import api from "../../services/api"; // Assuming there's an api instance or standard fetch

const VerifyEmail = () => {
    const { token } = useParams();
    const { toast } = useToast();
    const [status, setStatus] = useState("loading"); // loading, success, error

    useEffect(() => {
        const verifyToken = async () => {
            try {
                // Adjust this if your api is structured differently
                const res = await api.get(`/auth/verify/${token}`);
                setStatus("success");
                toast({
                    title: "Email Verified",
                    description: res.data?.message || "Your email has been successfully verified."
                });
            } catch (error) {
                setStatus("error");
                toast({
                    title: "Verification Failed",
                    description: error.response?.data?.message || "Invalid or expired token.",
                    variant: "destructive"
                });
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token, toast]);

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4">
            <Link to="/" className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-[#134e8d] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Shield size={28} strokeWidth={2.5} />
                </div>
                <span className="text-3xl font-extrabold text-[#002b45] tracking-tight">Secure Shield</span>
            </Link>

            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl w-full max-w-lg text-center">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 size={64} className="animate-spin text-[#10b981] mb-6" />
                        <h2 className="text-2xl font-bold text-[#002b45] mb-2">Verifying Email...</h2>
                        <p className="text-slate-500 font-medium">Please wait while we confirm your email address.</p>
                    </div>
                )}
                
                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={48} className="text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#002b45] mb-4">Email Verified!</h2>
                        <p className="text-slate-500 font-medium mb-8">
                            Your account has been successfully verified. You can now log in securely to access your dashboard.
                        </p>
                        <Link 
                            to="/login"
                            className="w-full h-14 bg-[#10b981] text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:bg-[#0da371] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
                        >
                            Proceed to Login <ArrowRight size={20} />
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <XCircle size={48} className="text-red-500" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#002b45] mb-4">Verification Failed</h2>
                        <p className="text-slate-500 font-medium mb-8">
                            This verification link is invalid or has expired. Please request a new link or try registering again.
                        </p>
                        <Link 
                            to="/register"
                            className="w-full h-14 bg-white border-2 border-[#134e8d] text-[#134e8d] rounded-2xl font-bold hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
                        >
                            Back to Registration
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
