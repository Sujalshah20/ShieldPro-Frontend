import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    IndianRupee, TrendingUp, Calendar, ArrowRight, User, 
    ShieldCheck, Activity, Award, Target, Zap, Waves,
    Layers, Cpu, Command, Globe, Compass, Terminal,
    ArrowUpRight, BarChart3, Clock, Lock
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

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={10} cols={5} /></div>;

    return (
        <div className="agent-commissions p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Fiscal Grid Atmosphere */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 2px, transparent 0)`, backgroundSize: '60px 60px' }} />

            <Reveal width="100%" direction="down">
                <div className="mb-16">
                    <div className="flex items-center gap-6 mb-4">
                         <div className="w-2.5 h-12 bg-primary rounded-full shadow-lg shadow-primary/40" />
                         <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                            FISCAL<span className="text-primary tracking-normal ml-3">_YIELD</span>
                         </h1>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-9">
                        Performance-based incentive distribution and revenue tracking
                    </p>
                </div>
            </Reveal>

            {/* Fiscal Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                {[
                    { label: "CUMULATIVE_EARNINGS", value: `₹${totalEarned.toLocaleString()}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/5", tag: "TOTAL_YIELD" },
                    { label: "PENDING_DISTRIBUTION", value: `₹${pendingAmount.toLocaleString()}`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50", tag: "IN_TRANSIT" },
                    { label: "SCHEDULED_PAYOUT", value: "31 MAR 2024", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50", tag: "SETTLEMENT" }
                ].map((stat, i) => (
                    <Reveal key={i} width="100%" delay={i * 0.1} direction="up">
                        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
                            <div className={`absolute top-[-20%] right-[-10%] p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[3000ms] ${stat.color}`}>
                                <stat.icon size={250} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className={`w-18 h-18 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} border border-white shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                                        <stat.icon size={32} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[4px] text-slate-300 py-1 px-4 border border-slate-100 rounded-full group-hover:bg-header-bg group-hover:text-white transition-all">{stat.tag}</span>
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] mb-4">{stat.label}</h3>
                                <p className="text-4xl font-black tracking-tight text-header-bg uppercase leading-none">{stat.value}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Ledger Manifest */}
            <Reveal width="100%" direction="up" delay={0.4}>
                <div className="bg-white rounded-[4rem] overflow-hidden border border-slate-200 shadow-2xl relative">
                    <div className="absolute top-0 right-[-10%] opacity-[0.02] pointer-events-none">
                        <Command size={400} className="text-header-bg" />
                    </div>
                    
                    <div className="px-12 py-12 border-b border-slate-50 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-16 h-16 bg-header-bg rounded-2xl flex items-center justify-center text-primary shadow-2xl shadow-header-bg/20 border border-white/5">
                                <BarChart3 size={32} strokeWidth={3} />
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">INCENTIVE_LEDGER</h3>
                        </div>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 tracking-[3px]">
                                TOTAL_ENTRIES: {commissions?.length || 0}
                            </div>
                            <button className="h-14 px-10 bg-header-bg text-white rounded-2xl text-[10px] font-black uppercase tracking-[4px] hover:bg-primary transition-all shadow-xl active:scale-95">
                                EXPORT_MANIFEST
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left font-bold text-[10px] tracking-[4px] uppercase text-slate-500">
                            <thead>
                                <tr className="bg-slate-50/30 text-[9px] text-slate-400 border-b border-slate-100">
                                    <th className="px-12 py-10 tracking-[5px]">OPERATIONAL_DATE</th>
                                    <th className="px-12 py-10 tracking-[5px]">ENTITY_IDENT</th>
                                    <th className="px-12 py-10 tracking-[5px]">ASSET_PROTECTION_SCHEME</th>
                                    <th className="px-12 py-10 tracking-[5px]">YIELD_VAL</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">FISC_STATUS</th>
                                    <th className="px-12 py-10 text-right tracking-[5px]">PROTOCOLS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {commissions?.map((comm, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={comm._id} 
                                        className="hover:bg-slate-50/80 transition-all group"
                                    >
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-4 text-slate-400">
                                                <div className="w-2 h-2 bg-primary/40 rounded-full" />
                                                <span className="text-[10px] font-bold tracking-[2px]">{new Date(comm.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-primary font-black text-[12px] shadow-lg group-hover:rotate-12 transition-transform">
                                                    {comm.customer?.name?.charAt(0)}
                                                </div>
                                                <span className="text-sm font-black text-header-bg uppercase tracking-tight group-hover:text-primary transition-colors">{comm.customer?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                                    <ShieldCheck size={18} strokeWidth={2.5} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 tracking-[2px]">{comm.policy?.policyName?.toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8 font-black text-xl text-primary tracking-tighter italic">₹{comm.amount.toLocaleString()}</td>
                                        <td className="px-12 py-8 text-center">
                                            <span className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[3px] flex items-center gap-3 border mx-auto w-fit ${
                                                comm.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                <div className={`w-2 h-2 rounded-full ${comm.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                                {comm.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-12 py-8 text-right">
                                            <button className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:bg-header-bg hover:text-white hover:border-header-bg transition-all shadow-xl active:scale-95 group/btn">
                                                <ArrowUpRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                                {commissions?.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-12 py-40 text-center">
                                            <IndianRupee size={80} className="mx-auto mb-8 text-slate-200" strokeWidth={1} />
                                            <h3 className="text-2xl font-black uppercase text-slate-300 italic tracking-[10px]">EMPTY_LEDGER</h3>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Sync Status Footer */}
                    <div className="px-12 py-8 bg-header-bg text-white flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
                        <div className="flex items-center gap-6">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" />
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[6px]">Secure Shield Fiscal Node: Payout_v4.2</p>
                        </div>
                        <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[4px] text-white/30">
                            <span className="flex items-center gap-3">
                                <Lock size={16} className="text-primary" /> VALIDATED_TRANS
                            </span>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentCommissions;
