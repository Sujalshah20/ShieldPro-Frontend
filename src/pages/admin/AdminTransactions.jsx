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
    Layout, Briefcase, Lock, Layers, Eye, ShieldCheck
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
            a.download = `ShieldPro_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast({ title: "TRANSACTION_REPORT_DOWNLOADED", description: "Financial statement has been successfully exported." });
        } catch (error) {
            console.error("Export failed", error);
            toast({ title: "EXPORT_FAILED", description: "Financial report extraction failed.", variant: "destructive" });
        }
    };

    if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={6} /></div>;

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
        <div className="admin-transactions p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#0c1a15] min-h-screen relative overflow-hidden">
            {/* Professional Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #0165FF 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
            
            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#0165FF]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                FINANCIAL<span className="text-primary tracking-normal">_ANALYTICS</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Monitor real-time transactions and platform revenue reconciliation
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-6">
                        <button 
                            onClick={handleExport}
                            className="h-20 px-12 bg-zinc-950 text-white dark:bg-zinc-900/80 rounded-[2rem] font-black text-[10px] uppercase tracking-[5px] hover:bg-primary hover:scale-105 transition-all flex items-center justify-center gap-5 shadow-2xl active:scale-95 italic border border-white/5"
                        >
                            <Download size={20} strokeWidth={4} className="text-primary" /> EXPORT_ALL_TRANSACTIONS
                        </button>
                    </div>
                </div>
            </Reveal>

            {/* FINANCIAL METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                {[
                    { label: "TOTAL_REVENUE", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, trend: "+14.8%", up: true, color: "text-primary", bg: "bg-primary/10" },
                    { label: "TODAY_SALES", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: Activity, trend: "+6.2%", up: true, color: "text-accent", bg: "bg-accent/10" },
                    { label: "SUCCESS_RATE", value: `${((stats.successCount / (transactions?.length || 1)) * 100).toFixed(1)}%`, icon: CheckCircle, trend: "STABLE", up: true, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "AVERAGE_TICKET_SIZE", value: `₹${Number(stats.avgTicket).toLocaleString()}`, icon: TrendingUp, trend: "-1.4%", up: false, color: "text-indigo-500", bg: "bg-indigo-500/10" }
                ].map((s, i) => (
                    <Reveal key={i} width="100%" delay={i * 0.1} direction="up">
                        <div className="bg-white dark:bg-zinc-900/50 p-10 rounded-[3.5rem] border border-border/50 group hover:border-primary/40 transition-all shadow-xl hover:translate-y-[-8px] relative overflow-hidden backdrop-blur-md">
                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className={`p-5 ${s.bg} ${s.color} rounded-[1.5rem] group-hover:rotate-12 transition-all shadow-lg border border-white/10`}>
                                    <s.icon size={26} strokeWidth={3} />
                                </div>
                                <div className={`flex items-center gap-2 text-[9px] font-black px-4 py-2 rounded-xl border ${
                                    s.up ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_#10b98110]' : 'bg-rose-500/5 text-rose-500 border-rose-500/20'
                                } italic`}>
                                    {s.up ? <ArrowUpRight size={12} strokeWidth={4} /> : <ArrowDownRight size={12} strokeWidth={4} />}
                                    {s.trend}
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[5px] opacity-20 mb-3 italic">{s.label}</p>
                                <h4 className="text-3xl xl:text-4xl font-black tracking-tighter italic uppercase leading-none">{s.value}</h4>
                            </div>
                            <div className={`absolute -right-10 -bottom-10 w-40 h-40 ${s.bg} rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-all`} />
                        </div>
                    </Reveal>
                ))}
            </div>

            <div className="bg-white dark:bg-zinc-900/50 rounded-[4rem] border border-border/50 overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="p-12 border-b border-border/50 flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative overflow-hidden bg-zinc-50 dark:bg-white/[0.02]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <Activity size={200} className="rotate-12" />
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-xl">
                            <FileText size={32} strokeWidth={3} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">TRANSACTION_HISTORY</h3>
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] mt-2 italic ml-1">Comprehensive financial audit for all insurance transactions</p>
                        </div>
                    </div>
                    <div className="relative group w-full xl:w-[500px] relative z-10">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="SEARCH_BY_TRANSACTION_ID_OR_CLIENT..." 
                            className="w-full h-18 pl-18 pr-8 bg-white dark:bg-zinc-900/30 border border-border/50 rounded-[1.5rem] focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all font-black text-[10px] uppercase tracking-[4px] shadow-sm italic"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left font-black text-[10px] uppercase tracking-widest italic">
                        <thead>
                            <tr className="bg-zinc-100 dark:bg-white/5 text-[9px] opacity-40">
                                <th className="px-12 py-8 tracking-[4px]">TRANSACTION_ID</th>
                                <th className="px-12 py-8 tracking-[4px]">CLIENT_NAME</th>
                                <th className="px-12 py-8 tracking-[4px]">POLICY_PLAN</th>
                                <th className="px-12 py-8 text-center tracking-[4px]">PAYMENT_METHOD</th>
                                <th className="px-12 py-8 text-center tracking-[4px]">AMOUNT</th>
                                <th className="px-12 py-8 text-right tracking-[4px]">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {filteredTxns?.map((txn, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={txn._id} 
                                    className="hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-all group cursor-pointer"
                                >
                                    <td className="px-12 py-8">
                                        <div className="flex flex-col gap-2">
                                            <span className="font-black text-xl italic tracking-tighter text-primary group-hover:translate-x-3 transition-transform duration-500 leading-none">{txn.transactionId.toUpperCase()}</span>
                                            <div className="flex items-center gap-3 opacity-30 text-[8px] font-black tracking-[2px]">
                                                <Calendar size={12} className="text-primary" /> {new Date(txn.paymentDate).toLocaleString().toUpperCase()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-primary font-black italic text-xl shadow-xl group-hover:scale-110 transition-transform">
                                                {txn.user?.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black italic tracking-tighter leading-none mb-1">{txn.user?.name}</span>
                                                <span className="text-[8px] opacity-20 lowercase tracking-[2px] font-black"><Lock size={10} className="inline mr-1" /> {txn.user?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-4 bg-zinc-100 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-border/30 w-fit">
                                            <Shield size={16} className="text-primary opacity-60" strokeWidth={3} />
                                            <span className="text-[10px] font-black italic tracking-tighter opacity-80 uppercase leading-none">{txn.policy?.policyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8 text-center">
                                        <span className="text-[9px] font-black uppercase tracking-[4px] px-5 py-2.5 bg-zinc-950 text-white rounded-xl border border-white/10 shadow-lg italic">
                                            {txn.paymentMethod || 'SECURE_GATEWAY'}
                                        </span>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex items-center justify-center gap-4 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/20 w-fit mx-auto">
                                            <IndianRupee size={18} className="text-primary" strokeWidth={3} />
                                            <span className="text-3xl font-black italic tracking-tighter uppercase leading-none">₹{txn.amount.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                        <div className={`px-6 py-2.5 rounded-2xl text-[9px] font-black tracking-[4px] inline-flex items-center gap-4 border shadow-inner ${
                                            txn.status === 'Success' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/5 text-rose-500 border-rose-500/20'
                                        }`}>
                                            <div className={`w-2.5 h-2.5 rounded-full ${txn.status === 'Success' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#ef4444]'}`} />
                                            {txn.status === 'Success' ? 'SUCCESS' : 'FAILED'}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredTxns?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-12 py-40 text-center">
                                        <div className="relative inline-block">
                                            <Zap size={120} className="mx-auto mb-8 opacity-5" />
                                            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
                                        </div>
                                        <h3 className="text-4xl font-black uppercase italic tracking-tighter opacity-10">NO_TRANSACTIONS_FOUND</h3>
                                        <p className="opacity-10 max-w-sm mx-auto mt-6 font-black uppercase text-[10px] tracking-[6px] italic leading-loose">No transactions found matching your search.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;
