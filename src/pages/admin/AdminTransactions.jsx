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
                return 'bg-black text-emerald-400 border-black/5 shadow-xl';
            case 'pending': case 'processing': 
                return 'bg-black text-amber-500 border-black/5 shadow-xl';
            case 'failed': case 'rejected': 
                return 'bg-black text-rose-500 border-black/5 shadow-xl';
            default: return 'bg-black text-white border-black/5 shadow-xl';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-black tracking-tighter italic uppercase">Transactions</h1>
                        <p className="text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">Monitor all financial activities and payment streams // LIVE_FEED</p>
                    </div>
                </Reveal>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="h-12 px-5 bg-white border border-slate-100 text-black rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm italic">
                        <Download size={18} strokeWidth={3} /> Export CSV
                    </button>
                    <button className="h-12 px-6 bg-[#1a2332] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                        <RefreshCcw size={18} /> Refresh Stream
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-all font-black" size={18} strokeWidth={3} />
                    <input 
                        type="text" 
                        placeholder="IDENTIFY_ENTITY_OR_TOKEN..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase tracking-[3px] focus:border-black/10 focus:ring-8 focus:ring-black/5 outline-none transition-all shadow-inner placeholder:text-black/10 italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="h-12 px-5 bg-white border border-slate-100 text-black rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-4 hover:bg-slate-50 transition-all shadow-sm italic">
                   <Filter size={18} className="text-black opacity-30" strokeWidth={3} /> Filter Options
                </button>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="overflow-x-auto flex-1 text-wrap">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-black/20 uppercase tracking-[4px] border-b border-slate-50 italic bg-slate-50/10">
                                <th className="px-6 py-4">TRANSACTION_ID</th>
                                <th className="px-6 py-4">ENTITY_ORIGIN</th>
                                <th className="px-6 py-4">NETWORK_CHANNEL</th>
                                <th className="px-6 py-4">FISC_AMOUNT</th>
                                <th className="px-6 py-4 text-center">LIFECYCLE_STATUS</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-8 py-20 text-center"><TableSkeleton /></td></tr>
                            ) : transactions?.filter(t => t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((t, i) => (
                                <tr key={t._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5 text-[10px] font-black text-black/20 uppercase tracking-widest italic">
                                        #TX-{t._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4 group/entity">
                                            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-3xl bg-slate-50 flex items-center justify-center font-black text-black/20 uppercase text-[12px] group-hover:rotate-6 transition-transform italic">
                                                {t.user?.name?.charAt(0) || <Globe size={14} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-black text-black tracking-tighter uppercase italic">{t.user?.name || "System Entry"}</span>
                                                <span className="text-[9px] font-black text-black/30 uppercase tracking-widest italic leading-none mt-1">ENTITY_MEMBER</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-40 uppercase tracking-widest italic">
                                            <CreditCard size={12} className="text-blue-500" />
                                            {t.paymentMethod || 'Card Payment'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-black text-black tracking-tighter italic">
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
                <div className="px-10 py-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-black/20 uppercase tracking-[3px] italic">
                        AUDIT_TRAIL: SESSION_#592 ACTIVE_FEED
                    </span>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-xl border-2 border-slate-100 flex items-center justify-center text-black/20 hover:text-black hover:border-black transition-all bg-white italic shadow-sm">
                            <ChevronLeft size={18} strokeWidth={3} />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-black text-white text-[11px] font-black flex items-center justify-center shadow-3xl transition-all italic tracking-tighter">1</button>
                        <button className="w-10 h-10 rounded-xl bg-white border-2 border-slate-50 text-black/20 hover:text-black hover:border-black/10 text-[11px] font-black flex items-center justify-center transition-all italic">2</button>
                        <button className="w-10 h-10 rounded-xl border-2 border-slate-100 flex items-center justify-center text-black/20 hover:text-black hover:border-black transition-all bg-white italic shadow-sm">
                            <ChevronRight size={18} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;
