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
    Command, Compass, PieChart, Award, Shield,
    Cpu, Layers, AlertTriangle, CheckCircle2, X, Terminal, Globe,
    Satellite, RefreshCcw, ChevronRight, SearchCheck
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
            toast({ 
                title: "SETTLEMENT_SYNCHRONIZED", 
                description: `Disbursement status updated to: ${variables.status.toUpperCase()}`,
                variant: "default"
            });
            setSelectedClaim(null);
        },
        onError: (err) => {
            toast({
                title: "SYNC_FAILED",
                description: err?.message || "Failed to update settlement protocol.",
                variant: "destructive"
            });
        }
    });

    if (isLoading) return (
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-50 rounded-[2.5rem] animate-pulse border-2 border-slate-100" />)}
             </div>
             <div className="h-[600px] bg-slate-50 rounded-[3rem] animate-pulse border-2 border-slate-100" />
        </div>
    );

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
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Global_Disbursement_Console</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Settlement <span className="text-[#007ea7]">Level_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Coordinate core disbursement protocols and audit claim vectors. Mainframe Status: <span className="text-emerald-500">NOMINAL</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                            <input 
                                type="text" 
                                placeholder="IDENTIFY_SEQUENCE_NODE..." 
                                className="pl-16 pr-8 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none w-full transition-all font-black text-[11px] uppercase tracking-[4px] text-[#003249] shadow-inner focus:border-[#007ea7] focus:ring-8 focus:ring-[#007ea7]/5 placeholder:text-slate-200 italic" 
                                value={searchQuery} 
                                onChange={e=>setSearchQuery(e.target.value)} 
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                                <Satellite size={16} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Tactical Metrics Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Pending_Vetting", value: stats.pending, icon: ShieldAlert, tag: "HIGH_ALERT" },
                    { label: "Investigations", value: stats.investigating, icon: Activity, tag: "NODE_PROBE" },
                    { label: "Authorized", value: stats.authorized, icon: CheckCircle2, tag: "SYSETM_CLEAR" },
                    { label: "Aggregate_Vol", value: `₹${(stats.totalVolume / 1000).toFixed(1)}k`, icon: IndianRupee, tag: "TOTAL_FLUX" }
                ].map((card, idx) => (
                    <Reveal key={idx} direction="up" delay={idx * 0.1}>
                        <div className="saas-card group relative p-10 border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[260px] flex flex-col justify-between overflow-hidden shadow-3xl">
                             {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <card.icon size={120} className="text-[#003249]" />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${idx === 0 ? 'bg-[#003249] text-rose-500 shadow-3xl border border-white/5 group-hover:rotate-12' : 'bg-slate-50 text-slate-300 border-2 border-slate-100 group-hover:bg-[#003249] group-hover:text-[#007ea7]'}`}>
                                    <card.icon size={28} strokeWidth={3} />
                                </div>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[5px] italic">{card.tag}</span>
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] mb-4 italic flex items-center gap-3">
                                    <Terminal size={12} className="text-[#007ea7]" /> {card.label}
                                </p>
                                <h2 className="text-5xl font-black text-[#003249] tracking-tighter italic uppercase group-hover:text-[#007ea7] transition-colors leading-none">{card.value}</h2>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Settlement Registry */}
            <Reveal direction="up">
                <div className="saas-card !p-0 overflow-hidden shadow-3xl border-2 border-slate-50">
                    <div className="p-12 border-b-2 border-slate-50 bg-slate-50/20 flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative">
                         {/* Tactical Background */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                <Layers size={36} strokeWidth={2.5} className="animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Synchronization Ledger</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Live status of global disbursement streams</p>
                            </div>
                        </div>
                        <button className="h-16 px-10 bg-[#003249] text-[#80ced7] rounded-[1.8rem] text-[11px] font-black uppercase tracking-[5px] hover:bg-[#007ea7] hover:text-white transition-all shadow-3xl active:scale-95 flex items-center gap-4 group relative overflow-hidden italic">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <Terminal size={22} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> GENERATE_AUDIT_LOG
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="bg-[#003249] text-white">
                                <tr className="text-[10px] font-black uppercase tracking-[5px] italic border-b border-white/5">
                                    <th className="px-12 py-10 border-r border-white/5">OPERATIVE_NODE</th>
                                    <th className="px-12 py-10 border-r border-white/5">PROTOCOL_CONTEXT</th>
                                    <th className="px-12 py-10 border-r border-white/5">MAGNITUDE</th>
                                    <th className="px-12 py-10 text-center border-r border-white/5">AUDIT_STATE</th>
                                    <th className="px-12 py-10 text-right">COMMAND</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 italic">
                                {filteredClaims?.map((claim, idx) => (
                                    <tr key={claim._id} className="hover:bg-slate-50/50 transition-all duration-500 group">
                                        <td className="px-12 py-12">
                                            <div className="flex items-center gap-8">
                                                <div className="w-20 h-20 bg-[#003249] rounded-[1.8rem] flex items-center justify-center text-white font-black text-3xl shadow-3xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 border-2 border-white relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                                    <span className="relative z-10">{claim.user?.name?.charAt(0)}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xl font-black text-[#003249] leading-none uppercase tracking-tighter group-hover:text-[#007ea7] transition-colors">{claim.user?.name}</p>
                                                    <div className="flex items-center gap-3 opacity-40">
                                                        <Fingerprint size={14} strokeWidth={3} className="text-[#007ea7]" />
                                                        <span className="text-[10px] font-black lowercase tracking-[3px] leading-none">{claim.user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12">
                                            <div className="flex flex-col gap-3">
                                                <span className="text-xl font-black text-[#003249] uppercase tracking-tighter italic group-hover:text-[#007ea7] transition-colors leading-none">{claim.userPolicy?.policy?.policyName}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-[#007ea7] rounded-full animate-pulse shadow-[0_0_8px_#007ea7]" />
                                                    <span className="text-[10px] text-slate-300 font-black tracking-[3px] leading-none uppercase">REF: {claim.userPolicy?.policyNumber}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12">
                                            <div className="flex items-center gap-3">
                                                <IndianRupee size={20} className="text-[#007ea7]" strokeWidth={4} />
                                                <span className="text-3xl font-black text-[#003249] tracking-tighter uppercase leading-none italic group-hover:text-[#007ea7] transition-colors">₹{claim.amount.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 text-center">
                                            <div className="flex justify-center">
                                                <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[4px] border-2 shadow-xl italic flex items-center gap-4 ${
                                                    claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-50 shadow-emerald-500/10' :
                                                    claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-50 shadow-rose-500/10' :
                                                    'bg-amber-50 text-amber-600 border-amber-50 shadow-amber-500/10'
                                                }`}>
                                                    <div className={`w-3 h-3 rounded-full ${claim.status === 'Approved' ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]' : claim.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-bounce'}`} />
                                                    {claim.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 text-right">
                                            <button 
                                                onClick={() => setSelectedClaim(claim)}
                                                className="h-16 px-10 bg-white border-2 border-slate-100 text-[#003249] text-[10px] font-black uppercase tracking-[5px] rounded-2xl shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center justify-center gap-5 active:scale-95 italic group/btn"
                                            >
                                                VIEW_MAP <Compass size={18} strokeWidth={3} className="group-hover/btn:rotate-180 transition-transform duration-1000" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>

            {/* Tactical Review Console */}
            <AnimatePresence>
                {selectedClaim && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedClaim(null)} className="absolute inset-0 bg-[#003249]/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-6xl bg-white p-16 md:p-24 rounded-[6rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
                        >
                            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#007ea7]/10 rounded-full blur-[150px] pointer-events-none" />

                            <div className="flex items-center justify-between mb-20 relative z-10 border-b-2 border-slate-50 pb-16">
                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-24 bg-[#003249] text-[#007ea7] rounded-[2.8rem] flex items-center justify-center shadow-3xl relative overflow-hidden group border-2 border-white/5">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                         <ShieldAlert size={48} strokeWidth={3} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-5xl font-black text-[#003249] uppercase tracking-tighter leading-none mb-1 italic">Vector Map Analysis</h3>
                                        <p className="text-[12px] text-slate-400 font-black uppercase tracking-[6px] italic leading-none">Sequence_ID: {selectedClaim._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedClaim(null)} className="p-8 bg-slate-50 hover:bg-rose-50 rounded-[3rem] transition-all group active:scale-95 border-2 border-transparent hover:border-rose-100">
                                    <X size={32} className="text-slate-300 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-500" strokeWidth={4} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20 relative z-10">
                                <div className="space-y-16">
                                    <div className="p-12 bg-slate-50/50 rounded-[4rem] border-2 border-slate-50 shadow-inner group/node hover:bg-white transition-all duration-700">
                                        <p className="text-[10px] font-black text-[#007ea7] uppercase tracking-[8px] mb-10 italic flex items-center gap-4">
                                            <div className="w-10 h-0.5 bg-[#007ea7]" /> SOURCE_OPERATIVE_NODE
                                        </p>
                                        <div className="flex items-center gap-10">
                                            <div className="w-24 h-24 bg-[#003249] rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl shadow-3xl transition-transform group-hover/node:rotate-6 border-4 border-white">{selectedClaim.user?.name.charAt(0)}</div>
                                            <div className="space-y-2">
                                                <p className="text-3xl font-black text-[#003249] mb-1 uppercase tracking-tighter italic leading-none group-hover:text-[#007ea7] transition-colors">{selectedClaim.user?.name}</p>
                                                <div className="flex items-center gap-3 text-[11px] text-[#007ea7] font-black uppercase tracking-[4px] italic opacity-60">
                                                    <Lock size={14} strokeWidth={3} /> {selectedClaim.user?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-12 bg-[#003249] text-white rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,50,73,0.4)] relative overflow-hidden group/magn transition-all border border-white/5">
                                        <div className="absolute top-0 right-0 p-12 opacity-10"><Zap size={140} className="group-hover/magn:scale-125 transition-transform duration-[3000ms]" /></div>
                                        <p className="text-[11px] font-black text-[#80ced7] uppercase tracking-[8px] mb-10 flex items-center gap-4 italic relative z-10">
                                            <div className="w-10 h-0.5 bg-[#80ced7]" /> DISBURSEMENT_MAGNITUDE
                                        </p>
                                        <div className="flex items-end justify-between relative z-10">
                                            <span className="text-7xl font-black tracking-tighter text-white uppercase italic leading-none group-hover:text-[#80ced7] transition-colors">₹{selectedClaim.amount.toLocaleString()}</span>
                                            <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[5px] border-2 border-white/10 bg-white/5 shadow-inner italic`}>{selectedClaim.status}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-16 bg-slate-50/50 rounded-[5rem] border-2 border-slate-50 flex flex-col relative overflow-hidden shadow-inner group/terminal">
                                    <div className="flex items-center gap-6 mb-12">
                                        <Terminal size={24} className="text-[#007ea7]" strokeWidth={3} />
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[8px] italic leading-none">INCIDENT_MANIFEST_AUDIT_V4</p>
                                    </div>
                                    <div className="flex-1 text-base font-black text-[#003249] leading-relaxed overflow-y-auto no-scrollbar italic border-l-4 border-[#007ea7]/20 pl-10 opacity-70 uppercase tracking-widest custom-scrollbar-v2">
                                        "{selectedClaim.description || "MANIFEST_EMPTY — Standard vetting protocol suggested. Awaiting operative narrative input from the field node. Security integrity scan required."}"
                                    </div>
                                    <div className="mt-12 flex items-center justify-between opacity-20">
                                         <span className="text-[9px] font-black uppercase tracking-[6px] italic">Verified_Sync_Sigma_4.2</span>
                                         <Globe size={18} strokeWidth={3} className="animate-spin-slow" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-10 relative z-10">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Investigation' })}
                                    className="h-28 flex-[2] border-4 border-[#003249] text-[#003249] rounded-[3.5rem] font-black text-[13px] uppercase tracking-[8px] hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-6 italic group/btn"
                                >
                                    <Activity size={28} strokeWidth={3} className="group-hover/btn:animate-ping" /> INITIATE_PROBE
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Approved' })}
                                    className="h-28 flex-[3] bg-[#003249] text-[#80ced7] rounded-[3.5rem] font-black text-[14px] uppercase tracking-[10px] shadow-3xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-8 italic group/btn"
                                >
                                    <CheckCircle size={32} strokeWidth={3} className="group-hover/btn:scale-125 transition-transform" /> AUTHORIZE_PAYOUT
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Rejected' })}
                                    className="h-28 flex-[1.5] bg-rose-50 text-rose-600 border-2 border-rose-100 rounded-[3.5rem] font-black text-[12px] uppercase tracking-[6px] hover:bg-rose-600 hover:text-white transition-all active:scale-95 italic group/btn"
                                >
                                    DENY_SYNC <X size={24} strokeWidth={4} className="group-hover/btn:rotate-90 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Audit_Registry_Synchronized
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Registry_Mapping_Steady
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Mainframe_Uplink: 100%
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminClaims;