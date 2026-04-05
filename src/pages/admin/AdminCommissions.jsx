import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Filter, Download, MoreHorizontal,
    TrendingUp, BarChart3, PieChart, 
    ChevronLeft, ChevronRight,
    Briefcase, Shield, Calendar, RefreshCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { TableSkeleton } from "../../components/common/Skeleton";

const AdminCommissions = () => {
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: commissions, isLoading } = useQuery({
        queryKey: ['adminCommissions', user?.token],
        queryFn: () => api.get('/admin/commissions', user.token),
        enabled: !!user?.token
    });

    const totalYield = commissions?.reduce((acc, c) => acc + (c.amount || 0), 0) || 0;

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-black tracking-tight uppercase italic">Reports & Analytics</h1>
                        <p className="text-[10px] font-black text-black/40 uppercase tracking-[2px] italic">Track incentive distributions and operational performance</p>
                    </div>
                </Reveal>
                
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black text-black/20 uppercase tracking-[4px] leading-none italic">TOTAL_YIELD</p>
                        <p className="text-2xl font-black text-black tracking-tighter italic">₹{totalYield.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white shadow-3xl border border-white/5">
                        <TrendingUp size={24} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Tactical Search Module */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="IDENTIFY_AGENT_OR_SCHEME..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase tracking-[3px] focus:border-black/10 focus:ring-8 focus:ring-black/5 outline-none transition-all shadow-inner placeholder:text-black/10 italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-12 px-5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} /> Export Report
                    </button>
                    <button className="h-12 w-12 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-black/20 uppercase tracking-[4px] border-b border-slate-50 italic">
                                <th className="px-6 py-4">YIELD_TOKEN</th>
                                <th className="px-6 py-4">AGENT_ORIGIN</th>
                                <th className="px-6 py-4">SCHEME_DERIVATIVE</th>
                                <th className="px-6 py-4">INCENTIVE_FISC</th>
                                <th className="px-6 py-4 text-center">CLEARANCE</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-8 py-20 text-center"><TableSkeleton /></td></tr>
                            ) : commissions?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100">
                                            <BarChart3 size={32} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">No performance data identified for this period</p>
                                    </td>
                                </tr>
                            ) : commissions?.filter(c => c.agent?.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((c, i) => (
                                <tr key={c._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5 text-[10px] font-black text-black/20 uppercase tracking-widest italic leading-none">
                                        #YD-{c._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4 group/entity">
                                            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-3xl bg-slate-50 flex items-center justify-center font-black text-black/20 uppercase text-[12px] group-hover:rotate-6 transition-transform italic">
                                                {c.agent?.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-black text-black tracking-tighter uppercase italic">{c.agent?.name}</span>
                                                <span className="text-[9px] font-black text-black/30 uppercase tracking-widest italic leading-none mt-1">SECTOR_AGENT</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                            <Shield size={12} className="text-blue-500" />
                                            {c.policy?.policyName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-black text-slate-800 tracking-tight">
                                            ₹{c.amount?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${c.status === 'Paid' ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
                                            <div className={`w-1 h-1 rounded-full ${c.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <span className={`text-[9px] font-black uppercase ${c.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{c.status || 'Paid'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-1.5 text-black/10 hover:text-black transition-colors">
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
                    <span className="text-[10px] font-black text-black/20 uppercase tracking-[3px] italic">
                        SIGNAL_REPORT: Showing 1 to {commissions?.length || 0} of {commissions?.length || 0} records
                    </span>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-black/20 hover:text-black transition-all disabled:opacity-50" disabled>
                            <ChevronLeft size={20} strokeWidth={3} />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-black text-white text-[11px] font-black flex items-center justify-center shadow-3xl transition-all italic">1</button>
                        <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-black/20 hover:text-black transition-all disabled:opacity-50" disabled>
                            <ChevronRight size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCommissions;
