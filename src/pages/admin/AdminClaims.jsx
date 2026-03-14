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
    CreditCard, Layout, Eye, ArrowUpRight,
    Command, Compass, PieChart, Award
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
            toast({ title: "PROTOCOL_SYNCHRONIZED", description: `Claim status successfully translated to: ${variables.status.toUpperCase()}` });
            setSelectedClaim(null);
        },
        onError: (err) => {
            toast({
                title: "SYNC_FAILED",
                description: err?.message || "Failed to update claim protocol.",
                variant: "destructive"
            });
        }
    });

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={10} cols={6} /></div>;

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
        <div className="admin-claims p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Mission Atmosphere */}
            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[4000ms]">
                <Activity size={800} className="text-primary transform rotate-45" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                SETTLEMENTS<span className="text-primary tracking-normal ml-1">_PROTOCOL</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-7">
                            Global claim authorization and liquidity distribution dashboard
                        </p>
                    </div>
                    
                    <div className="px-12 py-10 bg-header-bg rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-12 group hover:bg-primary transition-all duration-700 relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-10%] opacity-10 blur-2xl">
                            <IndianRupee size={120} className="text-white brightness-200" />
                        </div>
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary shadow-xl border border-white/10">
                            <CreditCard size={32} strokeWidth={3} className="group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[5px] mb-2 group-hover:text-white/60 transition-colors">TOTAL_LIQUIDITY_RELEASED</span>
                            <span className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                ₹{(stats.totalVolume / 100000).toFixed(1)}L
                            </span>
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* CLAIMS METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                 {[
                    { label: "PENDING_AUDIT", value: stats.pending, color: "text-amber-500", bg: "bg-amber-50", icon: ShieldAlert, tag: "AWAITING" },
                    { label: "ACTIVE_INVESTIGATION", value: stats.investigating, color: "text-primary", bg: "bg-primary/5", icon: Clock, tag: "VETTING" },
                    { label: "AUTHORIZED_SETTLEMENTS", value: stats.authorized, color: "text-emerald-500", bg: "bg-emerald-50", icon: CheckCircle, tag: "PROCESS" }
                 ].map((stat, i) => (
                    <Reveal key={i} width="100%" delay={i * 0.1} direction="up">
                        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 flex flex-col justify-between group hover:border-primary/50 transition-all shadow-xl relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className={`p-6 ${stat.bg} ${stat.color} rounded-2xl group-hover:rotate-12 transition-all shadow-lg border border-slate-100`}>
                                    <stat.icon size={28} strokeWidth={3} />
                                </div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[3px] px-3 py-1 bg-slate-50 rounded-md">{stat.tag}</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] mb-3">{stat.label}</p>
                                <h4 className="text-5xl font-black uppercase tracking-tighter text-header-bg leading-none">{stat.value < 10 ? `0${stat.value}` : stat.value}</h4>
                            </div>
                            <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${stat.bg} rounded-full blur-[60px] opacity-20 group-hover:opacity-60 transition-all duration-700`} />
                        </div>
                    </Reveal>
                 ))}
            </div>

            {/* COMMAND CONSOLE */}
            <div className="mb-16 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="relative group w-full lg:w-[600px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="IDENTIFY_SETTLEMENT_RECORD..." 
                        className="pl-16 pr-8 h-18 py-6 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full transition-all font-bold text-[10px] uppercase tracking-[4px] text-header-bg shadow-xl" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>
                <div className="flex items-center gap-8 bg-white px-10 py-5 rounded-2xl border border-slate-200 shadow-xl">
                    <BarChart3 className="text-primary w-6 h-6 shadow-lg shadow-primary/20" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[5px]">LEDGER_SYNCHRONIZATION_ACTIVE</span>
                </div>
            </div>

            {/* CLAIMS QUEUE */}
            <Reveal width="100%" direction="up" delay={0.4}>
                <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl mb-16">
                    <div className="px-12 py-10 border-b border-slate-100 flex items-center justify-between bg-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 right-[-10%] opacity-[0.03] pointer-events-none">
                            <Award size={200} className="text-header-bg rotate-12" />
                        </div>
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-16 h-16 bg-header-bg rounded-2xl flex items-center justify-center text-white shadow-xl border border-white/10">
                                <FileText size={32} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">SETTLEMENT_QUEUE</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-3">Priority sequence for global claim audit and authorization</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end relative z-10">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">INDEXED_RECORDS</span>
                            <span className="text-3xl font-black text-primary uppercase leading-none mt-2">{filteredClaims?.length || 0}</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left font-bold text-[10px] uppercase tracking-widest text-slate-500">
                            <thead>
                                <tr className="bg-slate-50/50 text-[9px] text-slate-400 border-b border-slate-100">
                                    <th className="px-12 py-10 tracking-[5px]">CLIENT_IDENTITY</th>
                                    <th className="px-12 py-10 tracking-[5px]">SECURITY_PROTOCOL</th>
                                    <th className="px-12 py-10 tracking-[5px]">REQUESTED_ASSET</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">SYNC_STATUS</th>
                                    <th className="px-12 py-10 text-right tracking-[5px]">AUDIT_ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredClaims?.map((claim, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={claim._id} 
                                        className="hover:bg-slate-50 transition-all group cursor-pointer"
                                    >
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-8">
                                                <div className="relative group/avatar">
                                                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover/avatar:opacity-40 transition-all duration-700" />
                                                    <div className="relative w-20 h-20 bg-header-bg rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:border-primary/50 transition-all overflow-hidden shadow-lg">
                                                        <User size={28} strokeWidth={3} className="text-white brightness-75 group-hover:brightness-100 transition-all duration-500" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black tracking-tight text-header-bg group-hover:text-primary transition-colors leading-none mb-3 uppercase">{claim.user?.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 tracking-[3px] flex items-center gap-3 lowercase">
                                                        <Mail size={12} className="text-primary/60" /> {claim.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-4">
                                                    <Layout size={16} className="text-primary/60" strokeWidth={3} />
                                                    <span className="font-black text-sm text-header-bg uppercase leading-none">{claim.userPolicy?.policy?.policyName}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2.5 h-1 bg-primary/40 rounded-full" />
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">ID: #{claim.userPolicy?.policyNumber}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-6 bg-slate-50 py-4 px-8 rounded-2xl border border-slate-100 w-fit group-hover:bg-white transition-colors duration-500">
                                                <IndianRupee size={18} className="text-primary shadow-sm" strokeWidth={3} />
                                                <span className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">₹{claim.amount.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex justify-center">
                                                <div className={`px-6 py-2.5 rounded-full text-[9px] font-black tracking-[4px] flex items-center gap-4 border shadow-sm ${
                                                    claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' :
                                                    claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/5' :
                                                    claim.status === 'Investigation' ? 'bg-primary/5 text-primary border-primary/10 shadow-primary/5' :
                                                    'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                                }`}>
                                                    <div className={`w-2.5 h-2.5 rounded-full ${
                                                        claim.status === 'Approved' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 
                                                        claim.status === 'Rejected' ? 'bg-rose-500 shadow-lg shadow-rose-500/40' : 
                                                        claim.status === 'Investigation' ? 'bg-primary shadow-lg shadow-primary/40' : 'bg-amber-500 shadow-lg shadow-amber-500/40'
                                                    }`} />
                                                    {claim.status.toUpperCase()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            <button 
                                                onClick={() => setSelectedClaim(claim)}
                                                className="h-12 px-8 bg-white border border-slate-200 text-header-bg rounded-xl text-[10px] font-black uppercase tracking-[4px] shadow-sm hover:bg-header-bg hover:text-white hover:border-header-bg transition-all active:scale-95 flex items-center gap-4 float-right group/eye"
                                            >
                                                AUDIT_RECORD <Eye size={18} strokeWidth={3} className="group-hover/eye:scale-125 transition-transform duration-500" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>

            {/* AUDIT MODAL CONSOLE */}
            <AnimatePresence>
                {selectedClaim && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedClaim(null)} className="absolute inset-0 bg-header-bg/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-6xl bg-white p-16 md:p-24 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]">
                                <ShieldAlert size={600} className="text-amber-600 animate-pulse-slow rotate-12" />
                            </div>
                            
                            <div className="flex flex-col lg:flex-row justify-between items-start mb-20 relative z-10 gap-12">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-8 mb-2">
                                        <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 border border-white/10">
                                            <Target size={40} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h3 className="text-5xl font-black uppercase tracking-tighter text-header-bg leading-none">PROTOCOL<span className="text-primary tracking-normal ml-3">_AUDIT</span></h3>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[8px] mt-4 ml-1">REF: {selectedClaim._id.toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-12 py-6 rounded-[2rem] bg-amber-50 text-amber-600 border-2 border-amber-100 flex items-center gap-8 shadow-2xl shadow-amber-500/10 animate-pulse duration-[2000ms]">
                                    <Clock size={36} strokeWidth={3} />
                                    <div className="flex flex-col gap-1">
                                        <span className="font-black text-[10px] uppercase tracking-[4px] leading-tight opacity-40">AUDIT_STATUS</span>
                                        <span className="font-black text-2xl uppercase tracking-tighter leading-none">VETTING_REQUIRED</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20 relative z-10">
                                <div className="space-y-12">
                                    <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner group hover:border-primary/40 transition-all relative overflow-hidden">
                                        <div className="absolute top-0 right-[-10%] opacity-5">
                                            <User size={100} className="text-header-bg" />
                                        </div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[6px] mb-10">ENTITY_IDENTITY</p>
                                        <div className="flex items-center gap-10">
                                            <div className="relative group/prof">
                                                <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-700" />
                                                <div className="relative w-28 h-28 bg-header-bg rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl border border-white/10 shadow-2xl shadow-header-bg/30">
                                                    {selectedClaim.user?.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p className="font-black text-4xl uppercase tracking-tighter text-header-bg leading-none mb-1">{selectedClaim.user?.name}</p>
                                                <div className="flex items-center gap-5 px-6 py-2.5 bg-header-bg text-white rounded-full border border-white/10 w-fit">
                                                    <Award size={16} className="text-primary" strokeWidth={3} />
                                                    <p className="text-[10px] font-black text-white/60 tracking-[4px] uppercase italic">SECURE_CLIENT_ID</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-12 bg-primary text-white rounded-[4rem] shadow-2xl shadow-primary/30 relative overflow-hidden group/liquidity">
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/liquidity:opacity-100 transition-opacity duration-700" />
                                        <div className="flex items-center gap-8 mb-10 relative z-10">
                                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/10 group-hover:bg-white group-hover:text-primary transition-all duration-500">
                                                <IndianRupee size={32} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[6px] leading-tight group-hover:text-white/70 transition-colors">SETTLEMENT_ASSET_VALUE</p>
                                                <p className="text-xl font-black text-white uppercase tracking-widest mt-2">AUTHORIZATION_REQUEST</p>
                                            </div>
                                        </div>
                                        <div className="flex items-end gap-10 relative z-10">
                                            <span className="text-8xl font-black uppercase tracking-tight text-white leading-none">₹{selectedClaim.amount.toLocaleString()}</span>
                                            <div className="flex flex-col mb-4">
                                                <div className="flex gap-2 mb-3">
                                                    {[1,2,3,4,5,6].map(i => <div key={i} className="w-3 h-1 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors" />)}
                                                </div>
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[4px]">LIQUIDITY_AUDIT_OK</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-16 bg-header-bg text-white rounded-[5rem] border border-white/5 shadow-2xl relative overflow-hidden group/intel flex flex-col h-full">
                                    <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-[1000ms] pointer-events-none" />
                                    <div className="flex items-center gap-8 mb-16 relative z-10">
                                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-primary shadow-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                            <FileText size={40} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[5px]">CLIENT_INCIDENT_LOG</p>
                                            <p className="text-3xl font-black uppercase tracking-tighter leading-none mt-3">REPORT_VERIFICATION</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-base font-bold text-white/50 leading-relaxed uppercase tracking-[5px] h-[340px] overflow-y-auto no-scrollbar pr-12 border-l-4 border-primary/30 pl-12 relative z-10">
                                        {selectedClaim.description ? (
                                            <p className="whitespace-pre-line group-hover:text-white/80 transition-colors duration-500">{selectedClaim.description}</p>
                                        ) : (
                                            <div className="space-y-12">
                                                <p className="text-rose-500 flex gap-6"><span className="font-black">[!]</span> CRITICAL: NO NARRATIVE DATA PROVIDED BY ORIGIN NODE.</p>
                                                <p className="flex gap-6"><span className="text-primary font-black">[i]</span> SCANNING_SATELLITE_RELIABILITY: VERIFIED.</p>
                                                <p className="flex gap-6"><span className="text-primary font-black">[i]</span> AUTOMATED_ELIGIBILITY_MATRIX: PASSED.</p>
                                                <p className="animate-pulse flex gap-6"><span className="text-primary font-black">[>]</span> AWAITING_ADMIN_OVERRIDE_AUTHORIZATION...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Investigation' })}
                                    className="h-28 bg-white border border-slate-200 text-header-bg rounded-[3rem] font-black text-xs uppercase tracking-[8px] hover:bg-header-bg hover:text-white transition-all active:scale-95 shadow-xl flex items-center justify-center gap-8 group"
                                >
                                    <Compass size={28} strokeWidth={3} className="group-hover:rotate-[360deg] transition-transform duration-[2000ms]" /> VET_PROTOCOL
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Approved' })}
                                    className="h-28 bg-primary text-white rounded-[3rem] font-black text-xs uppercase tracking-[8px] shadow-2xl shadow-primary/30 hover:translate-y-[-12px] hover:bg-header-bg transition-all flex items-center justify-center gap-10 active:scale-95 group"
                                >
                                    <CheckCircle size={32} strokeWidth={3} className="group-hover:rotate-12 transition-transform duration-500" /> AUTHORIZE_RELEASE
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Rejected' })}
                                    className="h-28 bg-header-bg text-white rounded-[3rem] font-black text-xs uppercase tracking-[8px] shadow-2xl shadow-header-bg/20 hover:translate-y-[-12px] hover:bg-rose-600 transition-all flex items-center justify-center gap-10 active:scale-95 group border border-white/5"
                                >
                                    <XCircle size={32} strokeWidth={3} className="group-hover:-rotate-12 transition-transform duration-500" /> DENY_PROTOCOL
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedClaim(null)}
                                className="w-full mt-16 py-6 text-[11px] font-black uppercase tracking-[10px] text-slate-300 hover:text-header-bg transition-all duration-700 relative z-10"
                            >
                                [ ABORT_AUDIT_SEQUENCE ]
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminClaims;