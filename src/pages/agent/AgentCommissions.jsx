import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    IndianRupee, TrendingUp, Calendar, ArrowRight, User, 
    ShieldCheck, Activity, Award, Target, Zap, Waves,
    Layers, Cpu, Command, Globe, Compass, Terminal,
    ArrowUpRight, BarChart3, Clock, Lock, Fingerprint,
    Satellite, RefreshCcw, Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const AgentCommissions = () => {
    const { user } = useContext(AuthContext);

    const { data: commissions, isLoading } = useQuery({
        queryKey: ['agentCommissions', user?.token],
        queryFn: () => api.get('/agent/commissions', user.token),
        enabled: !!user?.token
    });

    const totalEarned = commissions?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const pendingAmount = commissions?.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0) || 0;

    if (isLoading) return (
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 animate-pulse" />)}
             </div>
             <div className="h-[500px] bg-slate-50 rounded-[4rem] border-2 border-slate-100 animate-pulse" />
        </div>
    );

    return (
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Fiscal_Yield_Ledger</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Fiscal <span className="text-[#007ea7]">Yield_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Performance-based incentive distribution and revenue tracking. Signal: <span className="text-[#007ea7]">SECURED</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex items-center gap-6 bg-slate-50 px-10 py-5 rounded-[2.5rem] border-2 border-slate-50 shadow-inner group hover:border-[#007ea7]/20 transition-all duration-700 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#007ea7]/5 to-transparent animate-shimmer" />
                         <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
                         <span className="text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic relative z-10">UPLINK_SYNCHRONIZED_HW-0128</span>
                    </div>
                </Reveal>
            </div>

            {/* Fiscal Matrix Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { label: "Cumulative Earnings", value: `₹${totalEarned.toLocaleString()}`, icon: IndianRupee, color: "text-[#007ea7]", bg: "bg-[#007ea7]/10", tag: "TOTAL_YIELD" },
                    { label: "Pending Distribution", value: `₹${pendingAmount.toLocaleString()}`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", tag: "IN_TRANSIT" },
                    { label: "Scheduled Payout", value: "31 MAR 2026", icon: Calendar, color: "text-[#80ced7]", bg: "bg-[#003249]/10", tag: "SETTLEMENT" }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="saas-card group relative p-12 border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[300px] flex flex-col justify-between overflow-hidden shadow-3xl">
                             {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <Briefcase size={150} className="text-[#003249]" />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60 group-hover:opacity-100 transition-opacity leading-none">{s.label}</span>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${s.bg} ${s.color} shadow-2xl border-2 border-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                                    <s.icon size={28} strokeWidth={3} />
                                </div>
                            </div>

                            <div className="relative z-10 space-y-3">
                                <h2 className="text-4xl font-black text-[#003249] tracking-tighter leading-none uppercase italic group-hover:text-[#007ea7] transition-colors">{s.value}</h2>
                                <div className="flex items-center gap-4">
                                     <div className="h-px bg-slate-100 flex-1 group-hover:bg-[#007ea7]/20 transition-all" />
                                     <span className="text-[9px] font-black uppercase tracking-[5px] text-[#007ea7] italic leading-none">{s.tag}</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Ledger registry */}
            <Reveal direction="up" delay={0.4}>
                <div className="saas-card !p-0 overflow-hidden shadow-3xl border-2 border-slate-50">
                    <div className="p-12 border-b-2 border-slate-50 bg-slate-50/20 flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative">
                         {/* Tactical Background */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                <BarChart3 size={36} strokeWidth={2.5} className="animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Incentive Ledger</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Global rewards synchronization and protocol vetting</p>
                            </div>
                        </div>
                        <button className="h-16 px-10 bg-[#003249] text-[#80ced7] rounded-2xl text-[11px] font-black uppercase tracking-[6px] shadow-[0_20px_40px_-10px_rgba(0,50,73,0.4)] hover:bg-[#007ea7] hover:text-white transition-all flex items-center gap-5 active:scale-95 italic group relative z-10">
                            <Terminal size={22} className="text-[#007ea7] group-hover:rotate-12 transition-transform" strokeWidth={3} /> EXPORT_MANIFEST
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="bg-[#003249] text-white">
                                <tr className="text-[10px] font-black uppercase tracking-[5px] italic border-b border-white/5">
                                    <th className="px-12 py-10 border-r border-white/5">OPERATIONAL_DATE</th>
                                    <th className="px-12 py-10 border-r border-white/5">ENTITY_IDENTITY</th>
                                    <th className="px-12 py-10 border-r border-white/5">ASSET_SCHEME</th>
                                    <th className="px-12 py-10 border-r border-white/5">YIELD_DELTA</th>
                                    <th className="px-12 py-10 text-right">FISC_STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 italic">
                                {commissions?.map((comm, idx) => (
                                    <tr key={comm._id} className="hover:bg-slate-50/50 transition-all duration-500 group cursor-pointer">
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-5 group/date">
                                                 <div className="w-2.5 h-2.5 bg-[#007ea7] rounded-full shadow-[0_0_15px_#007ea7] group-hover:scale-150 transition-transform" />
                                                 <span className="text-[11px] font-black uppercase tracking-[4px] text-slate-400 group-hover:text-[#003249] transition-colors">{new Date(comm.createdAt).toLocaleDateString().toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-[#003249] rounded-[1.5rem] flex items-center justify-center text-[#007ea7] font-black text-2xl shadow-3xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 border-2 border-white relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                                    {comm.customer?.name?.charAt(0)}
                                                </div>
                                                <span className="text-xl font-black text-[#003249] uppercase tracking-tighter group-hover:text-[#007ea7] transition-colors">{comm.customer?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-50 w-fit group-hover:bg-white group-hover:border-[#007ea7]/30 transition-all shadow-sm">
                                                <ShieldCheck size={18} className="text-[#007ea7]" strokeWidth={3} />
                                                <span className="text-[11px] font-black text-[#003249] uppercase tracking-[5px] leading-none decoration-2 decoration-[#007ea7]/20 underline-offset-[10px] underline">{comm.policy?.policyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="inline-flex items-center gap-4 group-hover:scale-110 transition-transform bg-slate-50/50 px-6 py-3 rounded-2xl border-2 border-transparent group-hover:border-[#007ea7]/20">
                                                <IndianRupee size={20} className="text-[#007ea7]" strokeWidth={3} />
                                                <span className="text-3xl font-black text-[#003249] tracking-tighter uppercase leading-none group-hover:text-[#007ea7] transition-colors">₹{comm.amount.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            <div className="flex justify-end">
                                                <div className={`inline-flex items-center gap-4 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[5px] border-2 shadow-xl italic ${
                                                    comm.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-50 shadow-emerald-500/10' : 'bg-amber-50 text-amber-600 border-amber-50 shadow-amber-500/10'
                                                }`}>
                                                    <div className={`w-3 h-3 rounded-full ${comm.status === 'Paid' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-amber-500 animate-pulse shadow-[0_0_15px_#f59e0b]'}`} />
                                                    {comm.status.toUpperCase()}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {(!commissions || commissions.length === 0) && (
                         <div className="text-center py-40">
                             <Compass size={64} className="mx-auto mb-8 opacity-5 text-[#003249] animate-spin-slow" strokeWidth={1} />
                             <p className="text-[12px] font-black uppercase tracking-[8px] text-slate-300 italic">No active signal in financial quadrant</p>
                         </div>
                    )}
                </div>
            </Reveal>

            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Ledger_Integrity_Verified
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Incentive_Mapping_Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Globe size={20} strokeWidth={3} className="text-[#007ea7]" /> Regional_Nodes: Distributed
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Sync_Interval: 300s
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentCommissions;
