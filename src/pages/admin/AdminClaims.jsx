import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    FileText, User, ShieldCheck, CheckCircle, XCircle, 
    Clock, AlertCircle, TrendingUp, IndianRupee, Mail,
    Briefcase, Fingerprint, Zap, Search, ShieldAlert,
    BarChart3, Target, Activity, Lock,
    CreditCard, Layout, Eye, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminClaims = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: claims, isLoading } = useQuery({
        queryKey: ['adminClaims', user?.token],
        queryFn: () => api.get('/claims/all', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/claims/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['adminClaims']);
            toast({ title: "CLAIM_STATUS_UPDATED", description: `Claim status changed to: ${variables.status.toUpperCase()}` });
            setSelectedClaim(null);
        },
        onError: (err) => {
            toast({
                title: "UPDATE_FAILED",
                description: err?.message || "Failed to update claim status.",
                variant: "destructive"
            });
        }
    });

    if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={6} /></div>;

    const stats = {
        pending: claims?.filter(c => c.status === 'Pending').length || 0,
        investigating: claims?.filter(c => c.status === 'Investigation').length || 0,
        authorized: claims?.filter(c => c.status === 'Approved').length || 0,
        totalVolume: claims?.reduce((acc, curr) => acc + curr.amount, 0) || 0
    };

    const filteredClaims = claims?.filter(claim => 
        claim.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.userPolicy?.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-claims p-6 md:p-10 bg-[#F4F7FB] min-h-screen relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                <Activity size={700} className="text-primary rotate-45" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#0165FF]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                CLAIMS<span className="text-primary tracking-normal">_MANAGEMENT</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Review and process insurance claims for settlement authorization
                        </p>
                    </div>
                    
                    <div className="px-12 py-8 bg-white rounded-[3rem] border-2 border-primary/10 shadow-3xl flex flex-col items-center group hover:border-primary/40 transition-all backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[10px] font-black uppercase tracking-[5px] opacity-20 mb-2 italic relative z-10 flex items-center gap-3">
                            <CreditCard size={14} className="text-primary" /> TOTAL_CLAIM_PAYOUTS
                        </span>
                        <span className="text-5xl font-black text-primary tracking-tighter group-hover:scale-110 transition-transform relative z-10 italic leading-none">
                            ₹{(stats.totalVolume / 100000).toFixed(1)}L
                        </span>
                    </div>
                </div>
            </Reveal>

            {/* CLAIMS METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                 {[
                    { label: "PENDING_CLAIMS", value: stats.pending, color: "text-orange-500", bg: "bg-orange-500/10", icon: ShieldAlert, tag: "URGENT" },
                    { label: "UNDER_INVESTIGATION", value: stats.investigating, color: "text-accent", bg: "bg-accent/10", icon: Clock, tag: "ACTIVE" },
                    { label: "APPROVED_CLAIMS", value: stats.authorized, color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle, tag: "FINISHED" }
                 ].map((stat, i) => (
                    <Reveal key={i} width="100%" delay={i * 0.1} direction="up">
                        <div className="bg-white p-10 rounded-[3.5rem] border border-border/50 flex flex-col justify-between group hover:border-primary/40 transition-all shadow-xl hover:translate-y-[-8px] relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className={`p-5 ${stat.bg} ${stat.color} rounded-[1.5rem] group-hover:rotate-12 transition-all shadow-lg border border-white/10`}>
                                    <stat.icon size={28} strokeWidth={3} />
                                </div>
                                <span className="text-[9px] font-black opacity-40 uppercase tracking-[3px] px-3 py-1 bg-zinc-100 rounded-md italic">{stat.tag}</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[5px] opacity-20 mb-2 italic">{stat.label}</p>
                                <h4 className="text-5xl font-black italic tracking-tighter uppercase leading-none">{stat.value < 10 ? `0${stat.value}` : stat.value}</h4>
                            </div>
                            <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${stat.bg} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-all`} />
                        </div>
                    </Reveal>
                 ))}
            </div>

            {/* COMMAND BAR */}
            <div className="mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="relative group w-full lg:w-[500px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="SEARCH_BY_CLIENT_OR_DASHBOARD_ID..." 
                        className="pl-16 pr-8 h-18 bg-white border border-border/50 rounded-[1.5rem] focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full transition-all font-black text-[10px] uppercase tracking-[4px] shadow-sm backdrop-blur-md italic" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>
                <div className="flex items-center gap-6 bg-white px-8 py-5 rounded-[1.5rem] border border-border/50 backdrop-blur-md">
                    <BarChart3 className="text-primary w-5 h-5 shadow-[0_0_10px_#0165FF]" />
                    <span className="text-[10px] font-black uppercase tracking-[5px] opacity-30 italic">LIVE_CLAIMS_LEDGER_SYNC</span>
                </div>
            </div>

            {/* CLAIMS QUEUE */}
            <div className="bg-white rounded-[4rem] border border-border/50 overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="p-10 border-b border-border/50 flex items-center justify-between bg-zinc-50 relative">
                    <div className="absolute inset-0 bg-primary/5 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-lg border border-primary/20">
                            <FileText size={28} strokeWidth={3} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">CLAIMS_PROCESSING_QUEUE</h3>
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[4px] mt-2 italic ml-1">Validate and authorize insurance claim requests</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[3px] opacity-20">CLAIMS_COUNT</span>
                        <span className="text-2xl font-black italic text-primary">{filteredClaims?.length || 0}</span>
                    </div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left font-black text-[10px] uppercase tracking-widest italic">
                        <thead>
                            <tr className="bg-zinc-100 text-[9px] opacity-40">
                                <th className="px-12 py-8 tracking-[4px]">CLIENT_INFORMATION</th>
                                <th className="px-12 py-8 tracking-[4px]">INSURANCE_POLICY</th>
                                <th className="px-12 py-8 tracking-[4px]">CLAIM_AMOUNT</th>
                                <th className="px-12 py-8 text-center tracking-[4px]">STATUS</th>
                                <th className="px-12 py-8 text-right tracking-[4px]">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {filteredClaims?.map((claim, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={claim._id} 
                                    className="hover:bg-zinc-50 transition-all group cursor-pointer"
                                >
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative group/avatar">
                                                <div className="absolute inset-0 bg-primary blur-xl opacity-0 group-hover/avatar:opacity-20 transition-all" />
                                                <div className="relative w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center text-primary border-2 border-border/50 group-hover:border-primary/50 transition-all overflow-hidden shadow-lg">
                                                    <User size={28} strokeWidth={3} className="grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors leading-none mb-2">{claim.user?.name}</p>
                                                <p className="text-[9px] opacity-30 tracking-[3px] flex items-center gap-3 mt-1 lowercase font-black italic">
                                                    <Mail size={12} className="text-primary" /> {claim.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <Layout size={14} className="text-primary opacity-40" strokeWidth={3} />
                                                <span className="font-black text-xs italic tracking-tighter leading-none">{claim.userPolicy?.policy?.policyName}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_#0165FF]" />
                                                <span className="text-[9px] opacity-30 tracking-[3px] lowercase">POL: #{claim.userPolicy?.policyNumber}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-4 bg-zinc-100 py-3 px-6 rounded-[1.25rem] border border-border/30 w-fit">
                                            <IndianRupee size={16} className="text-primary opacity-60" strokeWidth={3} />
                                            <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">₹{claim.amount.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex justify-center">
                                            <div className={`px-6 py-2.5 rounded-2xl text-[9px] font-black tracking-[3px] flex items-center gap-4 w-fit shadow-inner ${
                                                claim.status === 'Approved' ? 'bg-emerald-500/5 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_#10b98110]' :
                                                claim.status === 'Rejected' ? 'bg-rose-500/5 text-rose-500 border border-rose-500/20' :
                                                claim.status === 'Investigation' ? 'bg-indigo-500/5 text-indigo-500 border border-indigo-500/20' :
                                                'bg-orange-500/5 text-orange-500 border border-orange-500/20 animate-pulse'
                                            }`}>
                                                <div className={`w-2.5 h-2.5 rounded-full ${
                                                    claim.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                                                    claim.status === 'Rejected' ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : 
                                                    claim.status === 'Investigation' ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-orange-500 shadow-[0_0_8px_#f97316]'
                                                }`} />
                                                {claim.status.toUpperCase()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                        <button 
                                            onClick={() => setSelectedClaim(claim)}
                                            className="h-12 px-8 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[3px] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 italic flex items-center gap-4 float-right group/btn"
                                        >
                                            VIEW_CLAIM_DETAILS <Eye size={16} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CLAIM REVIEW MODAL */}
            <AnimatePresence>
                {selectedClaim && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedClaim(null)} className="absolute inset-0 bg-zinc-950/90 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-6xl bg-white p-16 md:p-24 rounded-[5rem] border border-white/10 shadow-[0_120px_200px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <ShieldAlert size={500} className="text-orange-500 animate-pulse-slow" />
                            </div>
                            
                            <div className="flex flex-col lg:flex-row justify-between items-start mb-20 relative z-10 gap-12">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-6 mb-2">
                                        <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
                                            <Target size={32} strokeWidth={3} />
                                        </div>
                                        <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">CLAIM<span className="text-orange-500 italic-none not-italic">_REVIEW</span></h3>
                                    </div>
                                    <p className="text-xs font-black opacity-30 uppercase tracking-[8px] italic ml-20">REF: {selectedClaim._id.toUpperCase()}</p>
                                </div>
                                
                                <div className="px-10 py-5 rounded-3xl bg-orange-500/10 text-orange-500 border-2 border-orange-500/30 flex items-center gap-6 shadow-[0_0_50px_rgba(249,115,22,0.15)] animate-pulse">
                                    <Clock size={32} strokeWidth={3} />
                                    <div className="flex flex-col">
                                        <span className="font-black text-[10px] uppercase tracking-[4px] leading-tight opacity-40">WAITING_FOR_REVIEW</span>
                                        <span className="font-black text-xl italic tracking-tighter uppercase">ADMIN_DECISION_REQUIRED</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 relative z-10">
                                <div className="space-y-12">
                                    <div className="p-12 bg-zinc-50 rounded-[3.5rem] border-2 border-border/50 shadow-inner group hover:border-primary/50 transition-all">
                                        <p className="text-[10px] font-black uppercase opacity-20 tracking-[6px] mb-8 italic">CLIENT_INFORMATION</p>
                                        <div className="flex items-center gap-10">
                                            <div className="relative group/prof">
                                                <div className="absolute inset-0 bg-primary blur-2xl opacity-0 group-hover/prof:opacity-20 transition-all" />
                                                <div className="relative w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center text-primary font-black italic text-4xl border-2 border-white/5 shadow-2xl">
                                                    {selectedClaim.user?.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-black text-4xl italic tracking-tighter uppercase group-hover:text-primary transition-colors leading-none mb-3">{selectedClaim.user?.name}</p>
                                                <div className="flex items-center gap-4 px-5 py-2.5 bg-zinc-900 text-white rounded-xl border border-white/5 w-fit">
                                                    <ShieldCheck size={14} className="text-primary" strokeWidth={3} />
                                                    <p className="text-[10px] opacity-60 font-black tracking-[4px] uppercase italic">STATUS: PREMIUM_CLIENT</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-12 bg-primary/5 rounded-[4rem] border-2 border-primary/20 shadow-[0_40px_80px_-20px_rgba(1,101,255,0.1)] relative overflow-hidden group/liquidity">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/liquidity:opacity-100 transition-opacity" />
                                        <div className="flex items-center gap-6 mb-10 relative z-10">
                                            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl">
                                                <IndianRupee size={28} strokeWidth={3} />
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-primary tracking-[6px] italic">REQUESTED_CLAIM_PAYOUT</p>
                                        </div>
                                        <div className="flex items-end gap-6 relative z-10">
                                            <span className="text-7xl font-black italic tracking-tighter uppercase text-primary leading-none">₹{selectedClaim.amount.toLocaleString()}</span>
                                            <div className="flex flex-col mb-2">
                                                <div className="flex gap-1 mb-2">
                                                    {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1 bg-primary rounded-full" />)}
                                                </div>
                                                <span className="text-[9px] font-black opacity-30 uppercase tracking-[4px] italic">SETTLEMENT_RESERVE_CAP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-16 bg-zinc-900 text-white rounded-[5rem] border border-white/10 shadow-[0_60px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group/intel flex flex-col h-full">
                                    <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] opacity-0 group-hover/intel:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 shadow-2xl border border-white/5">
                                            <FileText size={32} strokeWidth={3} />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-black uppercase text-zinc-600 tracking-[5px] italic leading-tight">OFFICIAL_CLAIM_DESCRIPTION</p>
                                            <p className="text-2xl font-black italic tracking-tighter uppercase mt-1">CLIENT_REPORT_DATA</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-base italic opacity-80 leading-relaxed font-black uppercase tracking-[4px] h-[300px] overflow-y-auto no-scrollbar pr-10 border-l-2 border-orange-500/20 pl-12 text-zinc-400">
                                        "{selectedClaim.description || "NO DESCRIPTION PROVIDED BY THE CLIENT. MANUAL INVESTIGATION IS RECOMMENDED BEFORE APPROVAL."}"
                                    </div>
                                    <div className="mt-10 pt-10 border-t border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md">
                                        <div className="flex gap-4">
                                             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                             <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                        </div>
                                        <span className="text-[9px] font-black opacity-20 uppercase tracking-[4px]">SYSTEM_STABLE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Investigation' })}
                                    className="h-24 bg-indigo-500/5 text-indigo-500 border-2 border-indigo-500/20 rounded-[2.5rem] font-black text-xs uppercase tracking-[5px] hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl italic flex items-center justify-center gap-6 group"
                                >
                                    <Activity size={20} strokeWidth={3} className="group-hover:rotate-45 transition-transform" /> START_INVESTIGATION
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Approved' })}
                                    className="h-24 bg-emerald-500 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] shadow-[0_30px_60px_rgba(16,185,129,0.3)] hover:translate-y-[-10px] transition-all flex items-center justify-center gap-6 active:scale-95 italic group"
                                >
                                    <CheckCircle size={24} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> APPROVE_CLAIM
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Rejected' })}
                                    className="h-24 bg-rose-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] shadow-[0_30px_60px_rgba(225,29,72,0.3)] hover:translate-y-[-10px] transition-all flex items-center justify-center gap-6 active:scale-95 italic group"
                                >
                                    <XCircle size={24} strokeWidth={3} className="group-hover:-rotate-12 transition-transform" /> REJECT_CLAIM
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedClaim(null)}
                                className="w-full mt-12 py-5 text-[10px] font-black uppercase tracking-[8px] text-zinc-400 hover:text-foreground transition-colors italic relative z-10"
                            >
                                CANCEL_REVIEW [ESC]
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminClaims;