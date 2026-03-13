import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";
import { 
    CreditCard, ShieldCheck, Lock, ChevronLeft, 
    Zap, Target, Activity, Cpu, Satellite, 
    Command, Fingerprint, RefreshCcw, ArrowRight
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F7FB] dark:bg-[#0c1a15]">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-accent mb-8">
                    <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-foreground/50">NO_PAYMENT_DATA_FOUND</h3>
                <button onClick={() => navigate("/customer")} className="h-16 px-10 bg-accent text-white rounded-2xl font-black uppercase tracking-[4px] text-[10px] shadow-2xl shadow-accent/40 italic">RETURN_TO_DASHBOARD</button>
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
                    description: `Policy ${result.userPolicy?.policyNumber || ''} is now active and coverage has started.`,
                });
                queryClient.invalidateQueries(["myPolicies"]);
                queryClient.invalidateQueries(["myApplications"]);
                
                setTimeout(() => {
                    toast({
                        title: "DOCUMENT_READY",
                        description: "Your policy PDF has been generated and sent to your email.",
                    });
                }, 2000);

                navigate("/customer");
            }
        } catch (error) {
            toast({
                title: "PAYMENT_FAILURE",
                description: error?.errors?.[0]?.message || error?.message || "There was an issue processing your payment.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#0c1a15] min-h-screen relative overflow-hidden">
            {/* Professional Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #FF5A00 1px, transparent 0)`, backgroundSize: '50px 50px' }} />
            
            <div className="absolute top-[-10%] left-[-10%] opacity-[0.05] pointer-events-none animate-spin-slow">
                <ShieldCheck size={800} className="text-accent rotate-45" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Reveal width="100%" direction="down">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div>
                            <button 
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[5px] text-accent hover:translate-x-[-10px] transition-all mb-8 italic"
                            >
                                <ChevronLeft size={16} strokeWidth={4} /> BACK_TO_POLICIES
                            </button>
                            <div className="flex items-center gap-4 mb-3">
                                 <div className="w-2.5 h-10 bg-accent rounded-full shadow-[0_0_20px_#FF5A00]" />
                                 <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                    SECURE<span className="text-accent tracking-normal">_PAYMENT</span>
                                 </h1>
                            </div>
                            <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                                Finalizing your insurance coverage & document generation
                            </p>
                        </div>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Left Column: Order Metadata */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-border/50 shadow-2xl relative overflow-hidden group backdrop-blur-md">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <ShieldCheck size={200} className="text-accent" />
                            </div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-4">
                                <CreditCard size={22} className="text-accent" /> ORDER_SUMMARY
                            </h2>
                            <div className="space-y-8 relative z-10">
                                <div className="flex justify-between items-center pb-8 border-b border-border/50">
                                    <div>
                                        <div className="text-2xl font-black italic uppercase tracking-tighter text-accent">{policy.policyName}</div>
                                        <div className="text-[10px] font-black opacity-30 uppercase tracking-[4px] mt-2 italic">{policy.policyType} PLAN</div>
                                    </div>
                                    <div className="text-2xl font-black italic tracking-tighter leading-none">₹{policy.premiumAmount.toLocaleString()}</div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic">POLICY_DURATION</div>
                                        <div className="text-xs font-black italic uppercase tracking-widest">{policy.durationYears} YEAR(S)</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic">COVERAGE_AMOUNT</div>
                                        <div className="text-sm font-black italic uppercase tracking-tighter text-emerald-500">₹{policy.coverageAmount.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-border/50 flex justify-between items-center">
                                    <span className="text-[11px] font-black uppercase tracking-[6px] italic">TOTAL_PREMIUM</span>
                                    <span className="text-4xl font-black text-accent italic tracking-tighter leading-none">₹{policy.premiumAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-zinc-950 text-white rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent border border-accent/20 shadow-xl">
                                    <ShieldCheck size={28} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic uppercase tracking-tighter mb-2 leading-none mt-1">SECURE_PAYMENT_GATEWAY</h4>
                                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[3px] italic leading-relaxed">Your payment information is protected by industry-standard encryption protocols.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Details */}
                    <div className="lg:col-span-3 bg-white dark:bg-zinc-900/50 p-12 md:p-16 rounded-[4rem] border border-border/50 shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="flex items-center justify-between mb-16 pb-8 border-b border-border/30">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">CARD_DETAILS</h2>
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] italic ml-1">Securely enter your card information.</p>
                            </div>
                            <div className="flex gap-6 text-accent/30 group-hover:text-accent transition-colors">
                                <CreditCard size={32} strokeWidth={2.5} />
                                <Lock size={32} strokeWidth={2.5} />
                            </div>
                        </div>

                         <form onSubmit={handlePayment} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-4">CARDHOLDER_NAME</label>
                                <input
                                    type="text"
                                    placeholder="ENTER_NAME"
                                    required
                                    className="w-full h-20 bg-zinc-50 dark:bg-white/10 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-4">SECURE_CARD_NUMBER</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        required
                                        className="w-full h-20 bg-zinc-50 dark:bg-white/10 border border-border/50 rounded-2xl pl-16 px-8 font-black text-xs uppercase tracking-[6px] outline-none focus:border-accent transition-all shadow-sm focus:ring-8 focus:ring-accent/5"
                                    />
                                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-accent/30 group-focus-within:text-accent transition-colors" size={20} strokeWidth={3} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-4">EXPIRY_DATE</label>
                                    <input
                                        type="text"
                                        placeholder="MM / YY"
                                        required
                                        className="w-full h-20 bg-zinc-50 dark:bg-white/10 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[6px] outline-none focus:border-accent transition-all text-center italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-4">CVV_CODE</label>
                                    <input
                                        type="password"
                                        placeholder="***"
                                        required
                                        className="w-full h-20 bg-zinc-50 dark:bg-white/10 border border-border/50 rounded-2xl px-8 font-black text-xl tracking-[10px] outline-none focus:border-accent transition-all text-center shadow-sm focus:ring-8 focus:ring-accent/5"
                                    />
                                </div>
                            </div>

                            <div className="pt-10">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-24 bg-accent text-white rounded-[2.5rem] font-black uppercase tracking-[8px] text-sm shadow-[0_30px_70px_rgba(255,90,0,0.4)] transform transition-all active:scale-95 flex items-center justify-center gap-6 disabled:opacity-50 disabled:grayscale italic group"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-white" />
                                    ) : (
                                        <>COMPLETE_PAYMENT (₹{policy.premiumAmount}) <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" strokeWidth={4} /></>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4 opacity-[0.15]">
                                <RefreshCcw size={14} className="animate-spin-slow" />
                                <p className="text-center text-[8px] font-black uppercase tracking-[2px] italic">
                                    SECURE_PAYMENT_PROCESSING_VIA_SHIELDPRO_AUTH
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
