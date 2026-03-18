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
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Reports & Analytics</h1>
                        <p className="text-sm font-medium text-slate-400">Track incentive distributions and operational performance</p>
                    </div>
                </Reveal>
                
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Yield</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter">₹{totalYield.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                        <TrendingUp size={24} />
                    </div>
                </div>
            </div>

            {/* Tactical Search Module */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Agent or Policy..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all shadow-sm"
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
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">Yield ID</th>
                                <th className="px-8 py-6">Agent Origin</th>
                                <th className="px-8 py-6">Policy Derivative</th>
                                <th className="px-8 py-6">Incentive</th>
                                <th className="px-8 py-6 text-center">Clearance</th>
                                <th className="px-8 py-6"></th>
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
                                    <td className="px-8 py-7 text-xs font-bold text-slate-400 uppercase tracking-tight">
                                        #YD-{c._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase">
                                                {c.agent?.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-slate-700 leading-none">{c.agent?.name}</span>
                                                <span className="text-[10px] font-medium text-slate-400">Sector Agent</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <Shield size={14} className="text-blue-500" />
                                            {c.policy?.policyName}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="text-sm font-black text-slate-800 tracking-tight">
                                            ₹{c.amount?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-7 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase">Authorized</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                        Showing 1 to {commissions?.length || 0} of {commissions?.length || 0} records
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-[#1a2332] text-white text-xs font-bold flex items-center justify-center shadow-lg transition-all">1</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all disabled:opacity-50" disabled>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCommissions;
