import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";
import { 
    CreditCard, ShieldCheck, Lock, ChevronLeft, 
    Zap, Target, Activity, Cpu, Satellite, 
    Command, Fingerprint, RefreshCcw, ArrowRight,
    Terminal, Globe, Wallet
} from "lucide-react";
import Reveal from "../../components/common/Reveal";
import { motion } from "framer-motion";

const CheckoutPage = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const policy = state?.policy;
    const applicationId = state?.applicationId;

    if (!policy) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#dae5e5] font-display">
                <div className="w-20 h-20 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] mb-8 shadow-2xl">
                    <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-[#012b3f]/50 italic">No_Payment_Data_Found</h3>
                <button onClick={() => navigate("/customer")} className="h-14 px-10 bg-[#012b3f] text-[#0082a1] rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-[#0082a1] hover:text-white transition-all">Return_To_Dashboard</button>
            </div>
        );
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await api.post("/transactions/process", {
                policyId: policy._id,
                applicationId: applicationId,
                amount: policy.premiumAmount,
                paymentMethod: "Credit Card"
            }, user.token);

            if (result.success) {
                toast({
                    title: "PAYMENT_SUCCESSFUL",
                    description: `The coverage for node ${result.userPolicy?.policyNumber || ''} has been successfully initialized.`,
                });
                queryClient.invalidateQueries(["myPolicies"]);
                queryClient.invalidateQueries(["myApplications"]);
                
                setTimeout(() => {
                    toast({
                        title: "DOCUMENT_UPLINK_READY",
                        description: "Your digital policy manifest has been synchronized with your registered email.",
                    });
                }, 2000);

                navigate("/customer");
            }
        } catch (error) {
            toast({
                title: "PAYMENT_FAILURE",
                description: error?.errors?.[0]?.message || error?.message || "Operational anomaly detected during transaction processing.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page p-4 md:p-8 bg-[#dae5e5] min-h-screen relative overflow-hidden font-display">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] opacity-[0.05] pointer-events-none">
                <ShieldCheck size={800} className="text-[#012b3f] rotate-45" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Reveal width="100%" direction="down">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div>
                            <button 
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] hover:translate-x-[-8px] transition-all mb-8 italic"
                            >
                                <ChevronLeft size={16} strokeWidth={4} /> Back_To_Arsenal
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-[#0082a1] rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Secure Settlement Gateway</span>
                            </div>
                            <h1 className="text-3xl font-black text-[#012b3f] uppercase tracking-tight">Secure_Payment</h1>
                        </div>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Left Column: Order Metadata */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] border border-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                                <Wallet size={200} className="text-[#012b3f]" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-[#012b3f] mb-10 flex items-center gap-4">
                                <CreditCard size={24} className="text-[#0082a1]" /> Order_Summary
                            </h2>
                            <div className="space-y-8 relative z-10">
                                <div className="flex justify-between items-center pb-8 border-b border-slate-50">
                                    <div>
                                        <div className="text-2xl font-black text-[#012b3f] uppercase tracking-tighter leading-none">{policy.policyName}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{policy.policyType} Deployment Plan</div>
                                    </div>
                                    <div className="text-2xl font-black text-[#012b3f] tracking-tighter leading-none italic">₹{policy.premiumAmount.toLocaleString()}</div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Protection_Duration</div>
                                        <div className="text-[10px] font-black text-[#012b3f] uppercase tracking-widest">{policy.durationYears} Year Lifecycle</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Liability_Cap</div>
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">₹{policy.coverageAmount.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-[11px] font-black text-[#012b3f] uppercase tracking-[4px] italic">Total_Premium</span>
                                    <span className="text-4xl font-black text-[#0082a1] tracking-tighter leading-none italic">₹{policy.premiumAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-[#012b3f] text-white rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0082a1]/10 to-transparent" />
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-14 h-14 bg-[#0082a1]/20 rounded-2xl flex items-center justify-center text-[#0082a1] border border-[#0082a1]/40 shadow-xl">
                                    <Lock size={28} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black uppercase tracking-tight text-[#0082a1] mb-2 leading-none mt-1">Encrypted_Gateway</h4>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">Your financial manifest is protected by state-of-the-art AES-256 encryption protocols.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Details */}
                    <div className="lg:col-span-3 bg-white p-12 md:p-16 rounded-[4rem] border border-white shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-16 pb-8 border-b border-slate-50">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-[#012b3f] mb-2">Card_Manifest</h2>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[4px]">Securely inject your financial credentials.</p>
                            </div>
                            <div className="flex gap-4 text-[#0082a1]/20">
                                <CreditCard size={32} strokeWidth={2.5} />
                                <Fingerprint size={32} strokeWidth={2.5} />
                            </div>
                        </div>

                         <form onSubmit={handlePayment} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Cardholder Legal Identity</label>
                                <input
                                    type="text"
                                    placeholder="ENTER_NAME"
                                    required
                                    className="w-full h-16 bg-slate-50 border border-slate-200 rounded-xl px-8 font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Secure Card Number</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        required
                                        className="w-full h-16 bg-slate-50 border border-slate-200 rounded-xl pl-16 px-8 font-black text-xs tracking-[4px] outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner font-mono"
                                    />
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0082a1]/40 group-focus-within:text-[#0082a1] transition-colors" size={20} strokeWidth={3} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Uplink Expiry</label>
                                    <input
                                        type="text"
                                        placeholder="MM / YY"
                                        required
                                        className="w-full h-16 bg-slate-50 border border-slate-200 rounded-xl px-8 font-black text-xs tracking-[4px] outline-none focus:border-[#0082a1] focus:bg-white transition-all text-center text-[#012b3f] shadow-inner"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Security CVV</label>
                                    <input
                                        type="password"
                                        placeholder="***"
                                        required
                                        className="w-full h-16 bg-slate-50 border border-slate-200 rounded-xl px-8 font-black text-xl tracking-[10px] outline-none focus:border-[#0082a1] focus:bg-white transition-all text-center text-[#012b3f] shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="pt-10">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-20 bg-[#012b3f] text-[#0082a1] rounded-[2rem] font-black uppercase tracking-[8px] shadow-2xl hover:bg-[#0082a1] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-6 disabled:opacity-50 border border-white/5 text-[11px]"
                                >
                                    {loading ? (
                                        <RefreshCcw className="animate-spin" size={24} />
                                    ) : (
                                        <>Complete_Transaction (₹{policy.premiumAmount}) <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" strokeWidth={4} /></>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4 opacity-30">
                                <Terminal size={14} className="animate-pulse" />
                                <p className="text-center text-[8px] font-black uppercase tracking-[3px] italic">
                                    Secure_Transaction_Sync_Active_v12.0
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
