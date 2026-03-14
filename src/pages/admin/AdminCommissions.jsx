import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    DollarSign, User, ShieldCheck, CheckCircle, Clock, 
    Search, Filter, TrendingUp, IndianRupee,
    Briefcase, Fingerprint, Zap, BarChart3,
    ArrowUpRight, Download, Activity, Lock, 
    Layers, CreditCard, ArrowDownRight, Box, PieChart,
    Command, Compass, Award, Globe, Shield, Cpu,
    ChevronRight, Wallet, UserCheck, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const AdminCommissions = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: commissions, isLoading } = useQuery({
        queryKey: ['adminCommissions', user?.token],
        queryFn: () => api.get('/commissions', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/commissions/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['adminCommissions']);
            toast({ title: "YIELD_SYNCHRONIZED", description: `Incentive protocol successfully updated to: ${variables.status.toUpperCase()}` });
        },
        onError: (err) => {
            toast({
                title: "SYNC_ERROR",
                description: err?.message || "Failed to update yield protocol.",
                variant: "destructive"
            });
        }
    });

    const handleExport = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/export/commissions`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ShieldPro_Yield_Log_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast({ title: "LEDGER_EXPORTED", description: "Global incentive statement successfully synchronized to local storage." });
        } catch (error) {
            console.error("Export failed", error);
            toast({ title: "SECURE_EXPORT_FAILED", description: "Incentive report extraction failed.", variant: "destructive" });
        }
    };

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
             <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {[1,2].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse" />)}
            </div>
            <TableSkeleton rows={10} cols={6} />
        </div>
    );

    const stats = {
        totalOutstanding: commissions?.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0) || 0,
        totalPaid: commissions?.filter(c => c.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0) || 0,
        pendingCount: commissions?.filter(c => c.status === 'Pending').length || 0
    };

    const filteredComms = commissions?.filter(comm => 
        comm.agent?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-commissions p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Yield Central</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Agent performance rewards and global platform disbursement matrix.</p>
                </div>
                
                <div className="flex flex-wrap gap-6 xl:gap-10">
                    <div className="px-10 py-6 bg-white rounded-[2rem] border border-white shadow-xl flex flex-col items-center group hover:border-[#0082a1]/40 transition-all relative overflow-hidden min-w-[240px]">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none transform rotate-12 group-hover:scale-125 transition-transform duration-1000">
                            <Activity size={80} className="text-[#012b3f]" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 mb-2 flex items-center gap-2">
                            <Zap size={12} className="text-amber-500 animate-pulse" /> Pending Allocation
                        </span>
                        <span className="text-3xl font-black text-[#012b3f] tracking-tighter">₹{stats.totalOutstanding.toLocaleString()}</span>
                    </div>
                    <div className="px-10 py-6 bg-[#012b3f] rounded-[2rem] border border-white/5 shadow-2xl flex flex-col items-center group hover:bg-[#0082a1] transition-all duration-700 relative overflow-hidden min-w-[240px]">
                        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none transform -rotate-12 group-hover:scale-125 transition-transform duration-1000">
                            <Award size={80} className="text-white" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[4px] text-[#0082a1] mb-2 flex items-center gap-2 group-hover:text-white/80 transition-colors">
                            <CheckCircle size={12} className="text-emerald-500" /> Total Disbursed
                        </span>
                        <span className="text-3xl font-black text-white tracking-tighter">₹{stats.totalPaid.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Tactical Toolkit */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-8 mb-10">
                <div className="relative group w-full xl:w-[500px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0082a1] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="IDENTIFY OPERATOR REWARDS..." 
                        className="pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl outline-none w-full transition-all font-bold text-[10px] uppercase tracking-widest text-[#012b3f] shadow-sm focus:border-[#0082a1]" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <button 
                        onClick={handleExport}
                        className="flex-1 xl:flex-initial h-12 px-8 bg-white border border-slate-200 text-[#012b3f] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#012b3f] hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm group"
                    >
                        <Download size={18} className="text-[#0082a1] group-hover:text-white transition-colors" /> EXPORT_LEDGER
                    </button>
                    <div className="hidden lg:flex items-center gap-4 bg-white/50 px-8 py-3 rounded-full border border-slate-200">
                        <div className="w-2 h-2 bg-[#0082a1] rounded-full animate-pulse shadow-[0_0_8px_#0082a1]" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Uplink Active: {stats.pendingCount} Protocols</span>
                    </div>
                </div>
            </div>

            {/* yield Registry Matrix */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl">
                             <Briefcase size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#012b3f] uppercase tracking-tight">Yield Registry</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Operator rewards and incentive synchronization</p>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fafb]">
                            <tr className="border-b border-slate-100 uppercase tracking-widest text-[9px] font-black text-slate-400">
                                <th className="px-10 py-6">Operative Hub</th>
                                <th className="px-10 py-6">Client Node</th>
                                <th className="px-10 py-6 text-center">Incentive Value</th>
                                <th className="px-10 py-6 text-center">Sync Status</th>
                                <th className="px-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredComms?.map((comm, idx) => (
                                <tr key={comm._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] font-black text-xl shadow-xl transition-transform group-hover:scale-110">
                                                {comm.agent?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-[#012b3f] leading-none mb-1 group-hover:text-[#0082a1] transition-colors">{comm.agent?.name}</p>
                                                <div className="flex items-center gap-2 opacity-40">
                                                    <Lock size={10} />
                                                    <span className="text-[9px] lowercase tracking-widest font-bold">{comm.agent?.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-xs font-black text-[#012b3f] uppercase tracking-tight">
                                                <User size={12} className="text-[#0082a1]" /> {comm.customer?.name}
                                            </div>
                                            <div className="flex items-center gap-2 opacity-50">
                                                <Shield size={10} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{comm.policy?.policyName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0082a1]/5 rounded-2xl border border-[#0082a1]/10 group-hover:bg-[#0082a1]/10 transition-all">
                                            <IndianRupee size={16} className="text-[#0082a1]" strokeWidth={3} />
                                            <span className="text-2xl font-black text-[#012b3f] tracking-tighter uppercase leading-none">₹{comm.amount.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            comm.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                        }`}>
                                            {comm.status === 'Paid' ? 'Synchronized' : 'In Vetting'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        {comm.status === 'Pending' ? (
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: comm._id, status: 'Paid' })}
                                                className="px-6 py-2.5 bg-[#012b3f] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0082a1] transition-all shadow-xl flex items-center gap-2 float-right group-hover:scale-[1.05]"
                                            >
                                                Authorize Yield <ArrowUpRight size={14} strokeWidth={3} />
                                            </button>
                                        ) : (
                                            <div className="inline-flex items-center gap-3 opacity-20 font-black text-[9px] uppercase tracking-[4px] px-6 py-2">
                                                <ShieldCheck size={16} className="text-emerald-500" /> SECURE_CLEARANCE
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredComms?.length === 0 && (
                     <div className="text-center py-40 border-t border-slate-50">
                         <Target size={48} className="mx-auto mb-6 opacity-5 text-[#012b3f]" />
                         <p className="text-[11px] font-black uppercase tracking-[5px] text-slate-300">No active signal in current financial quadrant</p>
                     </div>
                )}
            </div>
        </div>
    );
};

export default AdminCommissions;
