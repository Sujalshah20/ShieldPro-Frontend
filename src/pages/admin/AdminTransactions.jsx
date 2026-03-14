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
    Globe, Compass, Terminal, Award
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
            toast({ title: "FINANCIAL_DATA_SYNCED", description: "Global fiscal statement has been successfully exported to local storage." });
        } catch (error) {
            console.error("Export failed", error);
            toast({ title: "SECURE_EXPORT_FAILED", description: "Financial report extraction protocol failed.", variant: "destructive" });
        }
    };

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={10} cols={6} /></div>;

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
        <div className="admin-transactions p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Global Matrix Atmosphere */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 2px, transparent 0)`, backgroundSize: '80px 80px' }} />
            
            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                FISCAL<span className="text-primary tracking-normal ml-1">_INTELLIGENCE</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-7">
                            Global financial synchronization and platform asset reconciliation
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-10">
                        <button 
                            onClick={handleExport}
                            className="h-20 px-12 bg-header-bg text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[5px] hover:bg-primary transition-all flex items-center justify-center gap-6 shadow-2xl shadow-header-bg/20 active:scale-95 border border-white/5 group"
                        >
                            <Download size={24} strokeWidth={4} className="text-primary group-hover:text-white transition-colors" /> EXPORT_FISCAL_LOG
                        </button>
                    </div>
                </div>
            </Reveal>

            {/* FINANCIAL METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                {[
                    { label: "AGGR_REVENUE", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, trend: "+14.8%", up: true, color: "text-primary", bg: "bg-primary/5" },
                    { label: "DAILY_YIELD", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: Activity, trend: "+6.2%", up: true, color: "text-accent", bg: "bg-accent/5" },
                    { label: "PROTOCOL_SUCCESS", value: `${((stats.successCount / (transactions?.length || 1)) * 100).toFixed(1)}%`, icon: CheckCircle, trend: "STABLE", up: true, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "MEAN_CAP_TICKET", value: `₹${Number(stats.avgTicket).toLocaleString()}`, icon: TrendingUp, trend: "-1.4%", up: false, color: "text-amber-500", bg: "bg-amber-50" }
                ].map((s, i) => (
                    <Reveal key={i} width="100%" delay={i * 0.1} direction="up">
                        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 group hover:border-primary/50 transition-all shadow-xl relative overflow-hidden">
                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className={`p-6 ${s.bg} ${s.color} rounded-2xl group-hover:rotate-12 transition-all shadow-lg border border-slate-50`}>
                                    <s.icon size={28} strokeWidth={3} />
                                </div>
                                <div className={`flex items-center gap-2 text-[9px] font-black px-4 py-2 rounded-xl border ${
                                    s.up ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>
                                    {s.up ? <ArrowUpRight size={14} strokeWidth={4} /> : <ArrowDownRight size={14} strokeWidth={4} />}
                                    {s.trend}
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] mb-3">{s.label}</p>
                                <h4 className="text-4xl font-black tracking-tighter uppercase text-header-bg leading-none">{s.value}</h4>
                            </div>
                            <div className={`absolute -right-10 -bottom-10 w-40 h-40 ${s.bg} rounded-full blur-[70px] opacity-20 group-hover:opacity-60 transition-all duration-700`} />
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal width="100%" direction="up" delay={0.4}>
                <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl mb-16">
                    <div className="p-12 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-12 relative overflow-hidden bg-slate-50">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[4000ms]">
                            <Compass size={250} className="text-header-bg rotate-45" />
                        </div>
                        <div className="flex items-center gap-10 relative z-10">
                            <div className="w-20 h-20 bg-header-bg rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-header-bg/20 border border-white/10">
                                <Terminal size={36} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">FISCAL_LEDGER</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-4 flex items-center gap-4">
                                    <Globe size={14} className="text-primary" /> Auditing global insurance asset movements and premium flows
                                </p>
                            </div>
                        </div>
                        <div className="relative group w-full xl:w-[600px] z-10">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="IDENTIFY_TRANSACTION_NODE..." 
                                className="w-full h-18 pl-18 pr-8 py-6 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all font-bold text-[10px] uppercase tracking-[4px] text-header-bg shadow-xl"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left font-bold text-[10px] uppercase tracking-widest text-slate-500">
                            <thead>
                                <tr className="bg-slate-50/50 text-[9px] text-slate-400 border-b border-slate-100">
                                    <th className="px-12 py-10 tracking-[5px]">TRANSACTION_NODE</th>
                                    <th className="px-12 py-10 tracking-[5px]">CLIENT_ENTITY</th>
                                    <th className="px-12 py-10 tracking-[5px]">ASSET_PROTOCOL</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">GATEWAY</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">VALUE</th>
                                    <th className="px-12 py-10 text-right tracking-[5px]">SYNC_STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTxns?.map((txn, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={txn._id} 
                                        className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                                    >
                                        <td className="px-12 py-10">
                                            <div className="flex flex-col gap-3">
                                                <span className="font-black text-2xl tracking-tighter text-primary group-hover:translate-x-4 transition-transform duration-700 leading-none">{txn.transactionId.toUpperCase()}</span>
                                                <div className="flex items-center gap-4 text-[9px] font-bold text-slate-300 uppercase tracking-[2px]">
                                                    <Calendar size={12} className="text-primary/60" /> {new Date(txn.paymentDate).toLocaleString().toUpperCase()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-8">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700" />
                                                    <div className="relative w-16 h-16 bg-header-bg rounded-xl flex items-center justify-center text-white border border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-lg">
                                                        <span className="text-xl font-black text-white/50">{txn.user?.name?.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-xl font-black text-header-bg uppercase leading-none">{txn.user?.name}</span>
                                                    <span className="text-[9px] font-bold text-slate-300 lowercase flex items-center gap-3">
                                                        <Lock size={10} className="text-primary/60" /> {txn.user?.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-6 bg-slate-50 py-4 px-8 rounded-2xl border border-slate-100 w-fit group-hover:bg-white transition-colors duration-500">
                                                <Shield size={18} className="text-primary/60" strokeWidth={3} />
                                                <span className="font-black text-[10px] text-header-bg uppercase tracking-[3px] leading-none">{txn.policy?.policyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10 text-center">
                                            <span className="text-[9px] font-black uppercase tracking-[5px] px-6 py-3 bg-header-bg text-white rounded-xl border border-white/10 shadow-xl group-hover:bg-primary transition-colors duration-500">
                                                {txn.paymentMethod || 'SECURE_UPLINK'}
                                            </span>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center justify-center gap-5 px-8 py-5 bg-primary/5 rounded-[2rem] border border-primary/10 w-fit mx-auto shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                <IndianRupee size={20} className="text-primary" strokeWidth={3} />
                                                <span className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">₹{txn.amount.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            <div className={`px-8 py-3 rounded-full text-[10px] font-black tracking-[4px] inline-flex items-center gap-5 border shadow-sm ${
                                                txn.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' : 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/5'
                                            }`}>
                                                <div className={`w-2.5 h-2.5 rounded-full ${txn.status === 'Success' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-rose-500 shadow-lg shadow-rose-500/40'}`} />
                                                {txn.status === 'Success' ? 'PROCESS_OK' : 'DENIED'}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredTxns?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-12 py-60 text-center">
                                            <div className="relative inline-block mb-12">
                                                <Award size={150} className="mx-auto text-header-bg opacity-5" />
                                                <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />
                                            </div>
                                            <h3 className="text-4xl font-black uppercase tracking-tighter text-header-bg opacity-10">NO_FISCAL_RECORDS_IDENTIFIED</h3>
                                            <p className="opacity-20 max-w-sm mx-auto mt-8 font-bold text-[10px] tracking-[6px] uppercase leading-loose">The requested financial data stream is currently empty for this quadrant.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminTransactions;
