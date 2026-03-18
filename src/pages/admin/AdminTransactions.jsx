import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import { 
    CreditCard, ArrowUpRight, ArrowDownRight, 
    Calendar, User, Shield, Search, 
    Download, FileText, CheckCircle, XCircle,
    Activity, Fingerprint, Zap, BarChart3,
    IndianRupee, TrendingUp, Filter, 
    Layout, Briefcase, Lock, Layers, Eye, ShieldCheck,
    Globe, Compass, Terminal, Award, ChevronRight,
    SearchCheck, Satellite, RefreshCcw, Cpu,
    MoreHorizontal, CheckCircle2, Clock, AlertCircle
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
            toast({ title: "Export successful" });
        } catch (error) {
            toast({ title: "Export failed", variant: "destructive" });
        }
    };

    const stats = {
        totalRevenue: transactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
        todayRevenue: transactions?.filter(t => new Date(t.paymentDate).toDateString() === new Date().toDateString())
                                 .reduce((acc, curr) => acc + curr.amount, 0) || 0,
        successCount: transactions?.filter(t => t.status === 'Success').length || 0,
    };

    const filteredTxns = transactions?.filter(t => 
        t.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const metrics = [
        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, trend: "+12.5%" },
        { label: "Daily Volume", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: Activity, trend: "+5.2%" },
        { label: "Success Rate", value: `${((stats.successCount / (transactions?.length || 1)) * 100).toFixed(1)}%`, icon: CheckCircle2, trend: "Stable" },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Transactions</h1>
                        <p className="text-slate-500 font-medium">Monitor and manage all platform financial activities.</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <button 
                        onClick={handleExport}
                        className="h-11 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <Download size={18} /> Export CSV
                    </button>
                </Reveal>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((m, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <m.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">{m.trend}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{m.value}</h3>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Transaction ID or Customer Name..." 
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="h-11 px-4 flex items-center justify-center gap-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all w-full md:w-auto">
                    <Filter size={18} /> Filter Status
                </button>
            </div>

            {/* Transaction Ledger */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto text-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-5">TXN ID</th>
                                <th className="px-6 py-5">Customer</th>
                                <th className="px-6 py-5">Policy Context</th>
                                <th className="px-6 py-5 text-right">Magnitude</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5">Timestamp</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic font-medium">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredTxns?.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-slate-400">NO FINANCIAL SIGNALS IDENTIFIED</td>
                                </tr>
                            ) : (
                                filteredTxns.map((txn) => (
                                    <tr key={txn._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">#{txn.transactionId.toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                    {txn.user?.name?.charAt(0)}
                                                </div>
                                                <div className="flex flex-col not-italic">
                                                    <span className="text-sm font-bold text-slate-700">{txn.user?.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{txn.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 not-italic">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{txn.policy?.policyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-base font-bold text-slate-800">₹{txn.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                                                    txn.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${txn.status === 'Success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    {txn.status === 'Success' ? 'Verified' : 'Failed'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col not-italic">
                                                <span className="text-xs font-bold text-slate-700">{new Date(txn.paymentDate).toLocaleDateString()}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(txn.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;
