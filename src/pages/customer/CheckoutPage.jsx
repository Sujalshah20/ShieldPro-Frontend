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
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F7FB] dark:bg-[#10221c]">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-accent mb-8">
                    <Target size={40} />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-foreground/50">NULL_PAYLOAD_DETECTED</h3>
                <button onClick={() => navigate("/customer")} className="h-16 px-10 bg-accent text-white rounded-2xl font-black uppercase tracking-[4px] text-[10px] shadow-2xl shadow-accent/40 italic">RETURN_TO_BASE</button>
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
                    title: "UPLINK_STABILIZED",
                    description: `Safety protocol ${result.userPolicy?.policyNumber || ''} is now active in your sector.`,
                });
                queryClient.invalidateQueries(["myPolicies"]);
                queryClient.invalidateQueries(["myApplications"]);
                
                setTimeout(() => {
                    toast({
                        title: "ARTIFACT_DOWNLOADABLE",
                        description: "Safehouse policy PDF has been encrypted & transmitted to your comms.",
                    });
                }, 2000);

                navigate("/customer");
            }
        } catch (error) {
            toast({
                title: "UPLINK_FAILURE",
                description: error?.errors?.[0]?.message || error?.message || "Signal collapse during transaction handshake.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#10221c] min-h-screen relative overflow-hidden">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #FF5A00 1px, transparent 0)`, backgroundSize: '50px 50px' }} />
            
            <div className="absolute top-[-10%] left-[-10%] opacity-[0.05] pointer-events-none animate-spin-slow">
                <Cpu size={800} className="text-accent rotate-45" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Reveal width="100%" direction="down">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div>
                            <button 
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[5px] text-accent hover:translate-x-[-10px] transition-all mb-8 italic"
                            >
                                <ChevronLeft size={16} strokeWidth={4} /> RETURN_TO_SAFEGUARD
                            </button>
                            <div className="flex items-center gap-4 mb-3">
                                 <div className="w-2.5 h-10 bg-accent rounded-full shadow-[0_0_20px_#FF5A00]" />
                                 <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                    TRANSACTION<span className="text-accent tracking-normal">_UPLINK</span>
                                 </h1>
                            </div>
                            <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                                Securing financial handshake & artifact authorization v4.1
                            </p>
                        </div>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Left Column: Order Metadata */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-border/50 shadow-2xl relative overflow-hidden group backdrop-blur-md">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <Fingerprint size={200} className="text-accent" />
                            </div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-4">
                                <Command size={22} className="text-accent" /> ASSET_SUMMARY
                            </h2>
                            <div className="space-y-8 relative z-10">
                                <div className="flex justify-between items-center pb-8 border-b border-border/50">
                                    <div>
                                        <div className="text-2xl font-black italic uppercase tracking-tighter text-accent">{policy.policyName}</div>
                                        <div className="text-[10px] font-black opacity-30 uppercase tracking-[4px] mt-2 italic">{policy.policyType} SAFEGUARD</div>
                                    </div>
                                    <div className="text-2xl font-black italic tracking-tighter leading-none">₹{policy.premiumAmount.toLocaleString()}</div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic">DEPLOYMENT_CYCLE</div>
                                        <div className="text-xs font-black italic uppercase tracking-widest">{policy.durationYears} YEAR(S)</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic">SHIELD_CAPACITY</div>
                                        <div className="text-sm font-black italic uppercase tracking-tighter text-emerald-500">₹{policy.coverageAmount.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-border/50 flex justify-between items-center">
                                    <span className="text-[11px] font-black uppercase tracking-[6px] italic">TOTAL_UPLINK</span>
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
                                    <h4 className="text-xl font-black italic uppercase tracking-tighter mb-2 leading-none mt-1">SHIELDPRO_ENCRYPTION</h4>
                                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[3px] italic leading-relaxed">Financial handshake & biometric data are protected by industry-standard AES-256 protocols.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Chassis */}
                    <div className="lg:col-span-3 bg-white dark:bg-zinc-900/50 p-12 md:p-16 rounded-[4rem] border border-border/50 shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="flex items-center justify-between mb-16 pb-8 border-b border-border/30">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">CREDENTIAL_INPUT</h2>
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] italic ml-1">Connect financial node for authorization.</p>
                            </div>
                            <div className="flex gap-6 text-accent/30 group-hover:text-accent transition-colors">
                                <CreditCard size={32} strokeWidth={2.5} />
                                <Lock size={32} strokeWidth={2.5} />
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-4">CARDHOLDER_IDENTIFIER</label>
                                <input
                                    type="text"
                                    placeholder="OPERATOR_NAME"
                                    required
                                    className="w-full h-20 bg-zinc-50 dark:bg-white/10 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-4">ENCRYPTED_CARD_UPLINK</label>
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
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-4">EXPIRY_CYCLE</label>
                                    <input
                                        type="text"
                                        placeholder="MM / YY"
                                        required
                                        className="w-full h-20 bg-zinc-50 dark:bg-white/10 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[6px] outline-none focus:border-accent transition-all text-center italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-4">CONTROL_NODE (CVV)</label>
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
                                        <>AUTHORIZE_UPLINK (₹{policy.premiumAmount}) <Zap size={24} className="group-hover:scale-125 transition-transform" strokeWidth={4} /></>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4 opacity-[0.15]">
                                <RefreshCcw size={14} className="animate-spin-slow" />
                                <p className="text-center text-[8px] font-black uppercase tracking-[2px] italic">
                                    AUTHORIZING_TRANSACTION_VIA_SECURE_NODE_HUB_PROTOCOL_X
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
