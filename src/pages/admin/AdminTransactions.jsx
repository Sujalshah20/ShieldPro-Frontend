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
    Globe, Compass, Terminal, Award, ChevronRight
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
            toast({ title: "FISCAL_DATA_SYNCED", description: "Global fiscal statement successfully synchronized to local repository." });
        } catch (error) {
            console.error("Export failed", error);
            toast({ title: "SECURE_EXPORT_FAILED", description: "Financial report extraction protocol failed.", variant: "destructive" });
        }
    };

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
            <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}
            </div>
            <TableSkeleton rows={10} cols={6} />
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
        <div className="admin-transactions p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Fiscal Intelligence</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Global financial synchronization and platform asset reconciliation.</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={handleExport}
                        className="h-12 px-8 bg-[#012b3f] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0082a1] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group border border-white/5"
                    >
                        <Download size={18} className="text-[#0082a1] group-hover:text-white transition-colors" /> EXPORT_FISCAL_LOG
                    </button>
                    <div className="hidden lg:flex items-center gap-3 px-6 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#012b3f]">Uplink Synchronized</span>
                    </div>
                </div>
            </div>

            {/* Tactical Metrics Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "Aggregate Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, trend: "+14.8%", color: "text-[#0082a1]", bg: "bg-[#0082a1]/10" },
                    { label: "Daily Yield", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: Activity, trend: "+6.2%", color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Clearance Rate", value: `${((stats.successCount / (transactions?.length || 1)) * 100).toFixed(1)}%`, icon: ShieldCheck, trend: "STABLE", color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Mean Ticket", value: `₹${Number(stats.avgTicket).toLocaleString()}`, icon: TrendingUp, trend: "-1.4%", color: "text-blue-500", bg: "bg-blue-50" }
                ].map((s, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2rem] border border-white hover:border-[#0082a1]/30 transition-all shadow-xl group relative overflow-hidden"
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
                             Trend: <span className={s.trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}>{s.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Fiscal Ledger Registry */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-slate-50/30 relative">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl">
                             <Terminal size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#012b3f] uppercase tracking-tight">Mainframe Fiscal Ledger</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Auditing global movement of insurance assets</p>
                        </div>
                    </div>
                    <div className="relative group w-full xl:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0082a1] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="IDENTIFY TRANSACTION NODE..." 
                            className="pl-12 pr-4 h-11 bg-white border border-slate-200 rounded-xl outline-none w-full transition-all font-bold text-[10px] uppercase tracking-widest text-[#012b3f] shadow-sm focus:border-[#0082a1]" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fafb]">
                            <tr className="border-b border-slate-100 uppercase tracking-widest text-[9px] font-black text-slate-400">
                                <th className="px-10 py-6">Transaction Sequence</th>
                                <th className="px-10 py-6">Client Entity</th>
                                <th className="px-10 py-6">Protocol context</th>
                                <th className="px-10 py-6 text-center">Value</th>
                                <th className="px-10 py-6 text-right">Vault Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTxns?.map((txn, idx) => (
                                <tr key={txn._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-xl font-black text-[#0082a1] tracking-tighter group-hover:translate-x-2 transition-transform duration-500 leading-none">{txn.transactionId.toUpperCase()}</span>
                                            <div className="flex items-center gap-2 opacity-40">
                                                <Calendar size={12} />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">{new Date(txn.paymentDate).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 bg-[#012b3f] rounded-xl flex items-center justify-center text-[#0082a1] font-black text-sm shadow-xl transition-transform group-hover:scale-110">
                                                {txn.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-[#012b3f] mb-0.5">{txn.user?.name}</p>
                                                <div className="flex items-center gap-1.5 opacity-40">
                                                    <Lock size={10} />
                                                    <span className="text-[9px] lowercase tracking-widest font-bold">{txn.user?.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4 bg-[#012b3f]/5 px-4 py-2 rounded-xl border border-slate-100 w-fit">
                                            <Shield size={14} className="text-[#0082a1]" />
                                            <span className="text-[10px] font-black text-[#012b3f] uppercase tracking-widest underline decoration-[#0082a1]/30 underline-offset-4">{txn.policy?.policyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#012b3f] text-white rounded-2xl shadow-xl group-hover:bg-[#0082a1] transition-colors border border-white/10 shadow-black/20">
                                            <IndianRupee size={16} className="text-[#0082a1] group-hover:text-white transition-colors" />
                                            <span className="text-3xl font-black tracking-tighter uppercase leading-none">₹{txn.amount.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[4px] border ${
                                            txn.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full ${txn.status === 'Success' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-rose-500 shadow-lg shadow-rose-500/40'}`} />
                                            {txn.status === 'Success' ? 'VERIFIED' : 'DENIED'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredTxns?.length === 0 && (
                     <div className="text-center py-40 border-t border-slate-50">
                         <Compass size={48} className="mx-auto mb-6 opacity-5 text-[#012b3f]" />
                         <p className="text-[11px] font-black uppercase tracking-[5px] text-slate-300">No fiscal signal identified in current resolution</p>
                     </div>
                )}
            </div>
        </div>
    );
};

export default AdminTransactions;
