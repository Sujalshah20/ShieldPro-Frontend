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

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
            <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />)}
            </div>
            <TableSkeleton rows={10} cols={5} />
        </div>
    );

    return (
        <div className="agent-commissions p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Fiscal Yield</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Performance-based incentive distribution and revenue tracking. Signal: Secured.</p>
                </div>
                
                <div className="hidden lg:flex items-center gap-3 px-6 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#012b3f]">Uplink Synchronized</span>
                </div>
            </div>

            {/* Fiscal Matrix Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                    { label: "Cumulative Earnings", value: `₹${totalEarned.toLocaleString()}`, icon: IndianRupee, color: "text-[#0082a1]", bg: "bg-[#0082a1]/10", trend: "Total Yield" },
                    { label: "Pending Distribution", value: `₹${pendingAmount.toLocaleString()}`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50", trend: "In Transit" },
                    { label: "Scheduled Payout", value: "31 MAR 2024", icon: Calendar, color: "text-[#012b3f]", bg: "bg-slate-100", trend: "Settlement" }
                ].map((s, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-white hover:border-[#0082a1]/30 transition-all shadow-xl group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.label}</span>
                            <div className={`p-2.5 rounded-xl ${s.bg} ${s.color} shadow-inner`}>
                                <s.icon size={20} strokeWidth={3} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-[#012b3f] tracking-tighter leading-none mb-4">{s.value}</h2>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-300">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                             Status: <span className="text-[#0082a1]">{s.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Ledger registry */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-[#012b3f] rounded-xl flex items-center justify-center text-[#0082a1] shadow-xl">
                            <BarChart3 size={24} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-[#012b3f]">Incentive Ledger</h3>
                    </div>
                    <button className="h-11 px-8 bg-[#012b3f] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0082a1] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group border border-white/5">
                        EXPORT_MANIFEST
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fafb]">
                            <tr className="border-b border-slate-100 uppercase tracking-widest text-[9px] font-black text-slate-400">
                                <th className="px-10 py-6">Operational Date</th>
                                <th className="px-10 py-6">Entity Ident</th>
                                <th className="px-10 py-6">Asset Scheme</th>
                                <th className="px-10 py-6">Yield</th>
                                <th className="px-10 py-6 text-right">Fisc Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {commissions?.map((comm, idx) => (
                                <tr key={comm._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3 text-slate-400">
                                             <div className="w-2 h-2 bg-[#0082a1]/40 rounded-full" />
                                             <span className="text-[10px] font-bold tracking-[2px]">{new Date(comm.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#012b3f] rounded-xl flex items-center justify-center text-[#0082a1] font-black text-[12px] shadow-lg group-hover:rotate-12 transition-transform">
                                                {comm.customer?.name?.charAt(0)}
                                            </div>
                                            <span className="text-sm font-black text-[#012b3f] uppercase tracking-tight">{comm.customer?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3 bg-[#012b3f]/5 px-4 py-2 rounded-xl border border-slate-100 w-fit">
                                            <ShieldCheck size={14} className="text-[#0082a1]" />
                                            <span className="text-[10px] font-black text-[#012b3f] uppercase tracking-widest underline decoration-[#0082a1]/20 underline-offset-4">{comm.policy?.policyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-xl font-black text-[#0082a1] tracking-tighter uppercase leading-none italic">₹{comm.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            comm.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${comm.status === 'Paid' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-amber-500 animate-pulse'}`} />
                                            {comm.status.toUpperCase()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgentCommissions;
