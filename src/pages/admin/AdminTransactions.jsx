import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Filter, Download, MoreHorizontal,
    Globe, CreditCard, DollarSign, 
    ChevronLeft, ChevronRight,
    RefreshCcw, Clock, CheckCircle2, XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { TableSkeleton } from "../../components/common/Skeleton";

const AdminTransactions = () => {
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['adminTransactions', user?.token],
        queryFn: () => api.get('/admin/transactions', user.token),
        enabled: !!user?.token
    });

    const getStatusStyle = (status) => {
        switch(status?.toLowerCase()) {
            case 'finalized': case 'completed': case 'success': 
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'pending': case 'processing': 
                return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'failed': case 'rejected': 
                return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Transactions</h1>
                        <p className="text-xs font-medium text-slate-400">Monitor all financial activities and payment streams</p>
                    </div>
                </Reveal>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="h-12 px-5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} /> Export CSV
                    </button>
                    <button className="h-12 px-6 bg-[#1a2332] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                        <RefreshCcw size={18} /> Refresh Stream
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by ID or Entity Name..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="h-12 px-5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-4 hover:bg-slate-50 transition-all shadow-sm">
                   <Filter size={18} className="text-slate-400" /> Filter Options
                </button>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="overflow-x-auto flex-1 text-wrap">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Entity Origin</th>
                                <th className="px-6 py-4">Channel</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-center">Lifecycle</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-8 py-20 text-center"><TableSkeleton /></td></tr>
                            ) : transactions?.filter(t => t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((t, i) => (
                                <tr key={t._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-tight">
                                        #TX-{t._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shadow-sm bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px]">
                                                {t.user?.name?.charAt(0) || <Globe size={14} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{t.user?.name || "System Entry"}</span>
                                                <span className="text-[9px] font-medium text-slate-400">Regular Member</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                                            <CreditCard size={12} className="text-blue-500" />
                                            {t.paymentMethod || 'Card Payment'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-black text-slate-800 tracking-tight">
                                            ₹{t.amount?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(t.status)}`}>
                                            {t.status || 'Finalized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 underline decoration-slate-200">
                        Audit Trail Log active for Session #592
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-[#1a2332] text-white text-xs font-bold flex items-center justify-center shadow-lg transition-all">1</button>
                        <button className="w-8 h-8 rounded-lg text-xs font-bold text-slate-500 hover:bg-white flex items-center justify-center transition-all border border-transparent hover:border-slate-100">2</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;
