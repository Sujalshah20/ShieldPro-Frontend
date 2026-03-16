import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    CreditCard, ArrowUpRight, ArrowDownRight, 
    Calendar, User, Shield, Search, 
    Download, FileText, CheckCircle, XCircle,
    Activity, Fingerprint, Zap, BarChart3,
    IndianRupee, TrendingUp, Filter, 
    Layout, Briefcase, Lock, Layers, Eye, ShieldCheck,
    Globe, Compass, Terminal, Award, ChevronRight,
    SearchCheck, Satellite, RefreshCcw, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { useToast } from "../../hooks/use-toast";

const AdminTransactions = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['adminTransactions', user?.token],
        queryFn: () => api.get('/transactions', user.token),
        enabled: !!user?.token
    });

    const handleExport = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/export/transactions`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ShieldPro_Fiscal_Log_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast({ 
                title: "FISCAL_DATA_SYNCED", 
                description: "Global fiscal statement successfully synchronized to local repository.",
                variant: "default"
            });
        } catch (error) {
            console.error("Export failed", error);
            toast({ 
                title: "SECURE_EXPORT_FAILED", 
                description: "Financial report extraction protocol failed.", 
                variant: "destructive" 
            });
        }
    };

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
        totalRevenue: transactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
        todayRevenue: transactions?.filter(t => new Date(t.paymentDate).toDateString() === new Date().toDateString())
                                 .reduce((acc, curr) => acc + curr.amount, 0) || 0,
        successCount: transactions?.filter(t => t.status === 'Success').length || 0,
        avgTicket: transactions?.length ? (transactions.reduce((acc, curr) => acc + curr.amount, 0) / transactions.length).toFixed(0) : 0
    };

    const filteredTxns = transactions?.filter(t => 
        t.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Fiscal_Intelligence_Unit</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Fiscal <span className="text-[#007ea7]">Ledger_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Global financial synchronization and platform asset reconciliation. Signal: <span className="text-[#007ea7]">SECURED</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-6 bg-slate-50 px-10 py-5 rounded-[2.5rem] border-2 border-slate-50 shadow-inner group hover:border-[#007ea7]/20 transition-all duration-700">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
                            <span className="text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic">UPLINK_SYNCHRONIZED_HW-882</span>
                        </div>
                        <button 
                            onClick={handleExport}
                            className="h-18 px-10 bg-[#003249] text-[#80ced7] rounded-[2rem] flex items-center gap-5 text-[11px] font-black uppercase tracking-[5px] hover:bg-[#007ea7] hover:text-white transition-all shadow-3xl active:scale-95 italic group border-2 border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <Download size={20} strokeWidth={3} className="text-[#007ea7] group-hover:text-white transition-colors" /> EXPORT_FISCAL_LOG
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* Tactical Metrics Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Aggregate Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, trend: "+14.8%", color: "text-[#007ea7]", bg: "bg-[#007ea7]/10", tag: "TOTAL_YIELD" },
                    { label: "Daily Yield", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: Activity, trend: "+6.2%", color: "text-amber-500", bg: "bg-amber-500/10", tag: "DIURNAL_FLOW" },
                    { label: "Clearance Rate", value: `${((stats.successCount / (transactions?.length || 1)) * 100).toFixed(1)}%`, icon: ShieldCheck, trend: "STABLE", color: "text-emerald-500", bg: "bg-emerald-500/10", tag: "VAULT_HEALTH" },
                    { label: "Mean Ticket", value: `₹${Number(stats.avgTicket).toLocaleString()}`, icon: TrendingUp, trend: "-1.4%", color: "text-[#80ced7]", bg: "bg-[#003249]/10", tag: "VALUE_PRECISION" }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="saas-card group relative p-10 border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[260px] flex flex-col justify-between overflow-hidden">
                             {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <s.icon size={120} className="text-[#003249]" />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${i === 0 ? 'bg-[#003249] text-[#007ea7] shadow-3xl border border-white/5 group-hover:rotate-12' : 'bg-slate-50 text-slate-300 border-2 border-slate-100 group-hover:bg-[#003249] group-hover:text-[#007ea7]'}`}>
                                    <s.icon size={28} strokeWidth={3} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-[#007ea7] uppercase tracking-[4px] italic leading-none group-hover:scale-110 transition-transform">{s.trend}</span>
                                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-[4px] mt-2 italic">{s.tag}</span>
                                </div>
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] mb-4 italic flex items-center gap-3 opacity-60">
                                    <Terminal size={12} className="text-[#007ea7]" /> {s.label}
                                </p>
                                <h2 className="text-4xl font-black text-[#003249] tracking-tighter italic uppercase group-hover:text-[#007ea7] transition-colors">{s.value}</h2>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Fiscal Ledger Registry */}
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
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Fiscal Ledger</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Mainframe record of global insurance asset synchronization</p>
                            </div>
                        </div>

                        <div className="relative group w-full xl:w-[450px] z-10">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                            <input 
                                type="text" 
                                placeholder="IDENTIFY_TRANSACTION_NODE..." 
                                className="pl-16 pr-8 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none w-full transition-all font-black text-[11px] uppercase tracking-[4px] text-[#003249] shadow-inner focus:border-[#007ea7] focus:ring-8 focus:ring-[#007ea7]/5 placeholder:text-slate-200 italic" 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="bg-[#003249] text-white">
                                <tr className="text-[10px] font-black uppercase tracking-[5px] italic border-b border-white/5">
                                    <th className="px-12 py-10 border-r border-white/5">TXN_SEQUENCE</th>
                                    <th className="px-12 py-10 border-r border-white/5">CLIENT_ENTITY</th>
                                    <th className="px-12 py-10 border-r border-white/5">PROTOCOL_CONTEXT</th>
                                    <th className="px-12 py-10 text-center border-r border-white/5">FISCAL_VAL</th>
                                    <th className="px-12 py-10 text-right">VAULT_STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 italic">
                                {filteredTxns?.map((txn, idx) => (
                                    <tr key={txn._id} className="hover:bg-slate-50/50 transition-all duration-500 group cursor-pointer">
                                        <td className="px-12 py-12">
                                            <div className="flex flex-col gap-3">
                                                <span className="text-xl font-black text-[#007ea7] tracking-tighter group-hover:translate-x-3 transition-transform duration-500 leading-none uppercase">#{txn.transactionId.toUpperCase()}</span>
                                                <div className="flex items-center gap-3 opacity-40">
                                                    <Calendar size={14} strokeWidth={3} className="text-[#003249]" />
                                                    <span className="text-[10px] font-black uppercase tracking-[3px] leading-none">{new Date(txn.paymentDate).toLocaleString().toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-[#003249] rounded-[1.5rem] flex items-center justify-center text-[#007ea7] font-black text-2xl shadow-xl group-hover:rotate-12 transition-transform border-2 border-white">
                                                    {txn.user?.name?.charAt(0)}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-black text-[#003249] uppercase tracking-tighter leading-none group-hover:text-[#007ea7] transition-colors">{txn.user?.name}</p>
                                                    <div className="flex items-center gap-3 opacity-40">
                                                        <Lock size={12} strokeWidth={3} className="text-[#007ea7]" />
                                                        <span className="text-[9px] font-black lowercase tracking-[3px] leading-none">{txn.user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12">
                                            <div className="flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-100 w-fit group-hover:bg-white group-hover:border-[#007ea7]/20 transition-all shadow-sm">
                                                <ShieldCheck size={18} className="text-[#007ea7]" strokeWidth={3} />
                                                <span className="text-[11px] font-black text-[#003249] uppercase tracking-[5px] decoration-2 decoration-[#007ea7]/20 underline-offset-[8px] underline leading-none">{txn.policy?.policyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 text-center">
                                            <div className="inline-flex items-center gap-4 bg-[#003249] text-white px-8 py-4 rounded-[1.8rem] shadow-3xl transition-transform group-hover:scale-110 border-2 border-white/5 skew-x-[-10deg]">
                                                <div className="skew-x-[10deg] flex items-center gap-4">
                                                    <IndianRupee size={22} className="text-[#007ea7]" strokeWidth={3} />
                                                    <span className="text-3xl font-black tracking-tighter uppercase leading-none italic">₹{txn.amount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 text-right">
                                            <div className="flex justify-end">
                                                <div className={`inline-flex items-center gap-4 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[5px] border-2 shadow-xl italic ${
                                                    txn.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-50 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 border-rose-50 shadow-rose-500/10'
                                                }`}>
                                                    <div className={`w-3 h-3 rounded-full ${txn.status === 'Success' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-rose-500 animate-pulse shadow-[0_0_15px_#f43f5e]'}`} />
                                                    {txn.status === 'Success' ? 'VERIFIED' : 'DENIED'}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {(!filteredTxns || filteredTxns.length === 0) && (
                         <div className="text-center py-40">
                             <Compass size={64} className="mx-auto mb-8 opacity-5 text-[#003249] animate-spin-slow" strokeWidth={1} />
                             <p className="text-[12px] font-black uppercase tracking-[8px] text-slate-300 italic">No fiscal signal identified in current resolution</p>
                         </div>
                    )}
                </div>
            </Reveal>

            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Fiscal_Integrity_Verified
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Asset_Mapping_Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Globe size={20} strokeWidth={3} className="text-[#007ea7]" /> Node: Global_Settlement
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Sync_Latency: 0.08ms
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminTransactions;

