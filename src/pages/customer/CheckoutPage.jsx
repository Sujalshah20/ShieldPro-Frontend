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
    Terminal, Globe, Wallet, IndianRupee, Layers,
    Shield, SearchCheck, Award, Compass, Eye, EyeOff, Database, ShieldAlert
} from "lucide-react";
import Reveal from "../../components/common/Reveal";
import { motion, AnimatePresence } from "framer-motion";

const CheckoutPage = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showCVV, setShowCVV] = useState(false);

    const policy = state?.policy;
    const applicationId = state?.applicationId;

    if (!policy) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[85vh] space-y-16">
                <Reveal direction="down">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#007ea7] blur-[120px] opacity-30 animate-pulse rounded-full" />
                        <div className="w-56 h-56 bg-[#003249] rounded-[4rem] flex items-center justify-center text-[#007ea7] mb-12 shadow-4xl border-4 border-white relative z-10 group-hover:rotate-[360deg] transition-all duration-[3000ms]">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                            <ShieldAlert size={96} strokeWidth={2.5} className="animate-pulse" />
                        </div>
                    </div>
                </Reveal>
                <div className="text-center space-y-8">
                    <h3 className="text-6xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Node_Status: <span className="text-rose-500 underline decoration-8 underline-offset-8 decoration-rose-500/20">UNAUTHORIZED_ACCESS</span></h3>
                    <p className="max-w-2xl mx-auto text-[14px] font-black text-slate-400 uppercase tracking-[12px] italic opacity-60 leading-loose">No valid transaction parameters detected in current sector. Abort mission immediately. Biometric validation failed for the current uplink sequence.</p>
                </div>
                <button 
                    onClick={() => navigate("/customer")} 
                    className="h-28 px-20 bg-[#003249] text-[#80ced7] rounded-[3.5rem] font-black uppercase tracking-[15px] text-[18px] shadow-4xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 italic border-4 border-white/5 relative group overflow-hidden"
                >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                    <span className="relative z-10">Return_To_Command_Center</span>
                </button>
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
                    title: "FISCAL_UPLINK_COMMITTED",
                    description: `The coverage for node ${result.userPolicy?.policyNumber || ''} has been successfully initialized.`,
                });
                queryClient.invalidateQueries(["myPolicies"]);
                queryClient.invalidateQueries(["myApplications"]);
                
                setTimeout(() => {
                    toast({
                        title: "MANIFEST_SYNCHRONIZED",
                        description: "Your digital policy manifest has been synchronized with your registered email.",
                    });
                }, 2000);

                navigate("/customer");
            }
        } catch (error) {
            toast({
                title: "TRANSACTION_ANOMALY",
                description: error?.errors?.[0]?.message || error?.message || "Operational anomaly detected during transaction processing.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-16 pb-24">
            {/* Tactical Settlement Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-8">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-8 text-[13px] font-black uppercase tracking-[15px] text-rose-500 italic group bg-white/50 backdrop-blur-md px-10 py-5 rounded-[2.5rem] w-fit shadow-4xl border-2 border-slate-50 transition-all duration-500 hover:translate-x-[-15px]"
                        >
                            <div className="w-12 h-12 rounded-[1.2rem] bg-rose-500 text-white flex items-center justify-center group-hover:rotate-12 transition-all shadow-4xl shrink-0">
                                <ChevronLeft size={28} strokeWidth={4} /> 
                            </div>
                            <span>Abort_Transaction</span>
                        </button>
                        <div className="space-y-6">
                            <div className="flex items-center gap-8">
                                <div className="w-4 h-14 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-black uppercase tracking-[10px] text-[#003249] italic leading-none opacity-60">Strategic Settlement Node_v4.2</span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px] mt-2 italic">SECTOR: FISCAL_SYNC_CMD</span>
                                </div>
                            </div>
                            <h1 className="text-7xl md:text-9xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Fiscal_<span className="text-[#007ea7]">Uplink_</span></h1>
                            <p className="max-w-2xl text-slate-400 font-bold uppercase tracking-[6px] text-xs italic leading-relaxed">
                                Verify asset allocation & authorize encrypted fiscal transmission to grid MAINFRAME. 
                                Gateway Status: <span className="text-emerald-500 underline decoration-4 underline-offset-8 decoration-emerald-500/20 font-black">ACTIVE_SECURE</span>
                            </p>
                        </div>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-10 bg-[#003249] px-12 py-10 rounded-[4rem] border-4 border-white shadow-4xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                        <div className="relative z-10 flex items-center gap-8">
                             <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_25px_#10b981] animate-pulse" />
                             <div className="flex flex-col">
                                <span className="text-[13px] font-black text-[#80ced7] uppercase tracking-[8px] italic leading-none mb-1">X_AES_512_ENCRYPT</span>
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[6px] italic">REALTIME_QUANTUM_SAFE</span>
                             </div>
                        </div>
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-[360deg] transition-all duration-[2000ms]">
                            <Satellite size={32} className="text-[#007ea7]" strokeWidth={2.5} />
                        </div>
                    </div>
                </Reveal>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 pb-16">
                {/* Settlement Manifest */}
                <div className="xl:col-span-5 space-y-16">
                    <Reveal direction="up" delay={0.2}>
                        <div className="saas-card p-16 md:p-20 shadow-4xl relative overflow-hidden group border-4 border-white bg-white/50 backdrop-blur-md rounded-[6rem] transition-all duration-1000 hover:border-[#007ea7]/10">
                            <div className="absolute top-0 right-0 p-20 opacity-[0.03] group-hover:scale-150 transition-transform duration-[10000ms] pointer-events-none -rotate-12">
                                <Wallet size={500} className="text-[#003249]" strokeWidth={1} />
                            </div>
                            <div className="absolute inset-0 bg-mesh-gradient opacity-5" />
                            
                            <div className="flex items-center justify-between mb-20 relative z-10 border-b-4 border-slate-50 pb-16">
                                <h2 className="text-5xl font-black uppercase tracking-tighter text-[#003249] flex items-center gap-12 italic leading-none group-hover:text-[#007ea7] transition-all duration-700">
                                    <div className="w-28 h-28 bg-[#003249] rounded-[3rem] flex items-center justify-center text-[#007ea7] shadow-4xl group-hover:rotate-[360deg] transition-all duration-[2000ms] border-4 border-white relative overflow-hidden shrink-0">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent" />
                                        <Award size={48} strokeWidth={3} className="relative z-10" />
                                    </div> 
                                    Settlement_Manifest
                                </h2>
                                <div className="w-16 h-16 bg-white rounded-3xl border-4 border-slate-50 flex items-center justify-center shadow-3xl hover:bg-[#003249] transition-colors duration-700 group/spin cursor-crosshair">
                                    <Command size={28} className="text-[#007ea7] group-hover/spin:animate-spin-slow" strokeWidth={4} />
                                </div>
                            </div>

                            <div className="space-y-14 relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-end gap-10 pb-14 border-b-4 border-slate-50 group/item hover:bg-slate-50/50 p-8 rounded-[3.5rem] transition-all duration-700">
                                    <div className="space-y-6 flex-1 w-full">
                                        <div className="text-5xl font-black text-[#003249] uppercase tracking-tighter leading-none italic group-hover/item:text-[#007ea7] transition-all duration-700">{policy.policyName.toUpperCase()}</div>
                                        <div className="flex items-center gap-6">
                                            <div className="px-8 py-3 bg-[#003249] text-[#80ced7] rounded-2xl text-[11px] font-black uppercase tracking-[8px] italic border-4 border-white shadow-3xl">
                                                ID: {policy._id.slice(-6).toUpperCase()}
                                            </div>
                                            <div className="text-[12px] font-black text-slate-300 uppercase tracking-[10px] flex items-center gap-4 italic opacity-40 group-hover:opacity-100 transition-opacity">
                                                <div className="w-3 h-3 rounded-full bg-[#007ea7] animate-pulse" /> {policy.policyType}_DEPLOYMENT
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-6xl font-black text-[#003249] tracking-tighter leading-none italic flex items-center gap-1 group-hover/item:scale-110 transition-transform duration-1000">
                                        <IndianRupee size={44} className="text-[#007ea7]" strokeWidth={4} />
                                        {policy.premiumAmount.toLocaleString()}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-12">
                                    <div className="flex justify-between items-center p-10 bg-slate-50/50 backdrop-blur-sm border-4 border-slate-50 rounded-[4rem] shadow-inner hover:bg-white transition-all duration-700 group/sub">
                                        <div className="flex items-center gap-8">
                                            <div className="w-18 h-18 bg-white rounded-3xl flex items-center justify-center text-[#007ea7] shadow-4xl group-hover/sub:rotate-12 transition-transform duration-1000 border-2 border-slate-100/50 shrink-0">
                                                <Layers size={36} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-[14px] font-black text-slate-400 uppercase tracking-[10px] italic">Cycle_Architecture</span>
                                        </div>
                                        <span className="text-[15px] font-black text-[#003249] uppercase tracking-[6px] italic bg-[#003249]/5 px-8 py-3 rounded-2xl shadow-inner border border-[#003249]/10">{policy.durationYears} YEAR_SYNC</span>
                                    </div>
                                    <div className="flex justify-between items-center p-10 bg-slate-50/50 backdrop-blur-sm border-4 border-slate-50 rounded-[4rem] shadow-inner hover:bg-white transition-all duration-700 group/sub">
                                        <div className="flex items-center gap-8">
                                            <div className="w-18 h-18 bg-white rounded-3xl flex items-center justify-center text-emerald-500 shadow-4xl group-hover/sub:rotate-12 transition-transform duration-1000 border-2 border-slate-100/50 shrink-0">
                                                <Shield size={36} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-[14px] font-black text-slate-400 uppercase tracking-[10px] italic">Capacity_Reservoir</span>
                                        </div>
                                        <span className="text-[15px] font-black text-emerald-600 uppercase tracking-[6px] italic bg-emerald-500/5 px-8 py-3 rounded-2xl shadow-inner border border-emerald-500/10">₹{(policy.coverageAmount/100000).toFixed(1)}L_ACTIVE</span>
                                    </div>
                                </div>

                                <div className="pt-16 border-t-[12px] border-[#003249] flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden p-10 bg-[#003249]/5 rounded-b-[4.5rem]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#003249]/10 via-transparent to-transparent pointer-events-none" />
                                    <div className="flex flex-col gap-5 relative z-10 w-full md:w-auto">
                                        <span className="text-[18px] font-black text-[#003249] uppercase tracking-[15px] italic leading-none">Total_Commit_V4</span>
                                        <div className="flex items-center gap-6">
                                             <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
                                             <span className="text-[12px] font-black text-slate-300 uppercase tracking-[8px] italic opacity-60">AUTH_UPLINK_READY_FORCE_1.0x</span>
                                        </div>
                                    </div>
                                    <div className="relative group/price">
                                         <div className="absolute inset-[-60px] bg-[#007ea7] blur-[100px] opacity-0 group-hover/price:opacity-20 transition-all duration-1000" />
                                         <span className="text-8xl font-black text-[#007ea7] tracking-tighter leading-none italic group-hover:scale-110 transition-transform duration-[1500ms] relative z-10 drop-shadow-4xl">
                                             ₹{policy.premiumAmount.toLocaleString()}
                                         </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal direction="up" delay={0.4}>
                        <div className="p-20 bg-[#003249] text-white rounded-[6rem] border-4 border-white shadow-4xl relative overflow-hidden group hover:translate-y-[-10px] transition-all duration-1000">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 via-transparent to-transparent pointer-events-none" />
                             <div className="absolute top-0 right-0 p-20 opacity-[0.05] pointer-events-none group-hover:scale-150 transition-transform duration-[10000ms]">
                                <Database size={400} strokeWidth={1} className="text-[#80ced7] -rotate-12" />
                            </div>
                            <div className="flex items-center gap-14 relative z-10">
                                <div className="w-28 h-28 bg-white/5 border-4 border-white/10 rounded-[3.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl group-hover:rotate-[360deg] transition-all duration-[2000ms] shrink-0">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent animate-pulse" />
                                    <Lock size={48} strokeWidth={3} className="relative z-10" />
                                </div>
                                <div className="space-y-6 flex-1">
                                    <h4 className="text-4xl font-black uppercase tracking-tighter text-[#80ced7] leading-none italic group-hover:text-white transition-all duration-700">Encrypted_Gateway</h4>
                                    <p className="text-[13px] font-black text-white/30 uppercase tracking-[10px] leading-relaxed italic group-hover:text-white/50 transition-colors">Strategic financial manifest protected by RSA-4096 / AES-512 protocols. Zero local persistence. Critical uplink sync exclusively via SIGMA-SECURE command.</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Fiscal Authorizer */}
                <div className="xl:col-span-7">
                    <Reveal direction="up" delay={0.3}>
                        <div className="saas-card p-16 md:p-32 shadow-4xl relative overflow-hidden border-4 border-white group bg-white/50 backdrop-blur-md rounded-[7rem] transition-all duration-1000 hover:border-[#007ea7]/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent pointer-events-none" />
                            
                            <div className="flex flex-col md:flex-row items-center justify-between mb-28 border-b-8 border-slate-50 pb-20 relative z-10 gap-16">
                                <div className="flex items-center gap-16 group/header-ident w-full">
                                    <div className="w-32 h-32 bg-[#003249] rounded-[4rem] shadow-4xl flex items-center justify-center text-[#007ea7] relative overflow-hidden group-hover:rotate-[360deg] transition-all duration-[2500ms] border-8 border-white shrink-0">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent" />
                                        <CreditCard size={56} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <h2 className="text-5xl font-black uppercase tracking-tighter text-[#003249] leading-none italic group-hover:text-[#007ea7] transition-all duration-700">Fiscal_Manifest</h2>
                                        <p className="text-[14px] font-black text-slate-300 uppercase tracking-[12px] italic opacity-60 leading-none">Inject secure financial credentials for sector auth.</p>
                                    </div>
                                </div>
                                <div className="hidden lg:flex gap-14 text-[#007ea7]/10 group-hover:text-[#007ea7]/20 transition-all duration-1000">
                                    <Fingerprint size={120} strokeWidth={2} className="animate-pulse" />
                                    <Satellite size={120} strokeWidth={2} className="group-hover:rotate-[360deg] transition-transform duration-[8000ms]" />
                                </div>
                            </div>

                             <form onSubmit={handlePayment} className="space-y-20 relative z-10">
                                <Reveal direction="up" delay={0.4}>
                                    <div className="space-y-8">
                                        <label className="text-[14px] font-black uppercase tracking-[15px] text-[#007ea7] ml-12 flex items-center gap-10 italic leading-none">
                                            <Command size={28} strokeWidth={3} /> LEGAL_ENTITY_NAME
                                        </label>
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                placeholder="AUTHORIZED_IDENT_NAME"
                                                required
                                                className="w-full h-28 bg-slate-50/50 backdrop-blur-sm border-4 border-slate-50 rounded-[3.5rem] px-16 font-black text-xl uppercase tracking-[10px] outline-none focus:border-[#007ea7] focus:bg-white transition-all text-[#003249] shadow-inner italic"
                                            />
                                            <div className="absolute right-16 top-1/2 -translate-y-1/2 text-[#007ea7] opacity-0 group-focus-within/input:opacity-100 group-focus-within/input:rotate-[360deg] transition-all duration-1000"><SearchCheck size={36} strokeWidth={4} /></div>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal direction="up" delay={0.5}>
                                    <div className="space-y-8">
                                        <label className="text-[14px] font-black uppercase tracking-[15px] text-[#007ea7] ml-12 flex items-center gap-10 italic leading-none">
                                            <Lock size={28} strokeWidth={3} /> SECURE_CREDENTIAL_DNA
                                        </label>
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                required
                                                className="w-full h-32 bg-[#003249] border-8 border-white rounded-[4rem] pl-28 px-16 font-black text-4xl tracking-[15px] outline-none focus:border-[#007ea7] transition-all text-[#80ced7] shadow-4xl italic overflow-hidden"
                                            />
                                            <CreditCard size={48} className="absolute left-12 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-[#007ea7] group-focus-within/input:rotate-12 transition-all duration-1000" strokeWidth={3} />
                                            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-r from-transparent via-[#007ea7] to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-1000" />
                                        </div>
                                    </div>
                                </Reveal>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                                    <Reveal direction="up" delay={0.6}>
                                        <div className="space-y-8">
                                            <label className="text-[14px] font-black uppercase tracking-[15px] text-[#007ea7] ml-12 flex items-center gap-10 italic leading-none">
                                                <Activity size={28} strokeWidth={3} /> UPLINK_EXP
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="MM / YY"
                                                required
                                                className="w-full h-28 bg-slate-50 border-4 border-slate-50 rounded-[3.5rem] px-16 font-black text-2xl tracking-[12px] outline-none focus:border-[#007ea7] focus:bg-white transition-all text-center text-[#003249] shadow-inner italic"
                                            />
                                        </div>
                                    </Reveal>
                                    <Reveal direction="up" delay={0.7}>
                                        <div className="space-y-8">
                                            <label className="text-[14px] font-black uppercase tracking-[15px] text-[#007ea7] ml-12 flex items-center gap-10 italic leading-none">
                                                <ShieldCheck size={28} strokeWidth={3} /> SEC_SIG_CVV
                                            </label>
                                            <div className="relative group/cvv">
                                                <input
                                                    type={showCVV ? "text" : "password"}
                                                    placeholder="***"
                                                    required
                                                    className="w-full h-28 bg-slate-50 border-4 border-slate-50 rounded-[3.5rem] px-16 font-black text-4xl tracking-[35px] outline-none focus:border-[#007ea7] focus:bg-white transition-all text-center text-[#003249] shadow-inner italic pl-32"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowCVV(!showCVV)}
                                                    className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-200 hover:text-[#007ea7] scale-125 transition-all duration-700"
                                                >
                                                    {showCVV ? <EyeOff size={36} strokeWidth={4} /> : <Eye size={36} strokeWidth={4} />}
                                                </button>
                                            </div>
                                        </div>
                                    </Reveal>
                                </div>

                                <Reveal direction="up" delay={0.8}>
                                    <div className="pt-12">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-36 bg-[#003249] text-[#80ced7] rounded-[5rem] text-[22px] font-black uppercase tracking-[30px] shadow-4xl active:scale-95 group/btn italic relative overflow-hidden transition-all duration-1000 border-8 border-white hover:text-white hover:border-[#007ea7]/20 disabled:opacity-50"
                                        >
                                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                                            <span className="relative z-10 flex items-center justify-center gap-16">
                                                {loading ? (
                                                    <RefreshCcw className="animate-spin text-white" size={64} strokeWidth={5} />
                                                ) : (
                                                    <>Authorize_Full_Uplink <ArrowRight size={64} className="group-hover/btn:translate-x-12 transition-transform duration-1000" strokeWidth={5} /></>
                                                )}
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#007ea7]/20 to-transparent animate-shimmer pointer-events-none" />
                                        </button>
                                    </div>
                                </Reveal>

                                <div className="flex flex-col items-center gap-10 pt-12">
                                    <div className="flex items-center justify-center gap-12 opacity-30 w-full">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full shadow-inner" />
                                        <div className="flex items-center gap-6 group/terminal">
                                            <Terminal size={32} className="group-hover:text-[#007ea7] animate-pulse transition-colors" strokeWidth={4} />
                                            <p className="text-center text-[14px] font-black uppercase tracking-[10px] italic text-[#003249] group-hover:text-[#007ea7] transition-colors">
                                                Strategic_Uplink_Sync_Active_v4.2
                                            </p>
                                        </div>
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full shadow-inner" />
                                    </div>
                                    <div className="flex gap-20 opacity-10 hover:opacity-100 transition-all duration-[2000ms] grayscale hover:grayscale-0">
                                         <CreditCard size={48} strokeWidth={2} />
                                         <ShieldCheck size={48} strokeWidth={2} />
                                         <Globe size={48} strokeWidth={2} />
                                         <Lock size={48} strokeWidth={2} />
                                    </div>
                                </div>
                             </form>
                             
                             <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-r from-transparent via-[#007ea7]/10 to-transparent animate-shimmer pointer-events-none opacity-40" />
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Matrix Operational Log Footer */}
            <Reveal direction="up" delay={1.2}>
                <div className="flex flex-wrap justify-center gap-32 pt-28 border-t-8 border-slate-50 relative">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-72 h-3 bg-[#007ea7] rounded-full shadow-[0_0_30px_#007ea7]" />
                    
                    {[
                        { icon: Fingerprint, label: "IDENTITY_SECURE" },
                        { icon: Globe, label: "SECTOR_LATENCY_0.02ms" },
                        { icon: Zap, label: "RSA_4096_UPLINK" },
                        { icon: CreditCard, label: "COMM_TERMINAL_01" }
                    ].map((status, i) => (
                        <div key={i} className="flex items-center gap-10 group cursor-crosshair">
                            <status.icon size={36} strokeWidth={3} className="text-[#007ea7] opacity-20 group-hover:opacity-100 group-hover:rotate-[360deg] transition-all duration-[1500ms]" />
                            <span className="text-[15px] font-black text-slate-300 uppercase tracking-[15px] italic leading-none group-hover:text-[#003249] transition-all duration-700">{status.label}</span>
                        </div>
                    ))}
                </div>
            </Reveal>
        </div>
    );
};

export default CheckoutPage;
