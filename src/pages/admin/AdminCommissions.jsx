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
    ChevronRight, Wallet, UserCheck, Target,
    Satellite, RefreshCcw, SearchCheck, Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

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
            toast({ 
                title: "YIELD_SYNCHRONIZED", 
                description: `Incentive protocol successfully updated to: ${variables.status.toUpperCase()}`,
                variant: "default"
            });
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
            toast({ 
                title: "LEDGER_EXPORTED", 
                description: "Global incentive statement successfully synchronized to local storage." 
            });
        } catch (error) {
            console.error("Export failed", error);
            toast({ 
                title: "SECURE_EXPORT_FAILED", 
                description: "Incentive report extraction failed.", 
                variant: "destructive" 
            });
        }
    };

    if (isLoading) return (
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2].map(i => <div key={i} className="h-48 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 animate-pulse" />)}
             </div>
             <div className="h-[600px] bg-slate-50 rounded-[3rem] border-2 border-slate-100 animate-pulse" />
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
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Global_Performance_Vault</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Yield <span className="text-[#007ea7]">Central_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Agent performance rewards and global platform disbursement matrix. Uplink: <span className="text-emerald-500">OPTIMIZED</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-wrap gap-8 items-center">
                        <div className="relative p-10 bg-white rounded-[2.8rem] border-2 border-slate-50 shadow-3xl flex items-center gap-10 group hover:border-[#007ea7]/30 transition-all duration-700 min-w-[320px] overflow-hidden">
                            {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <Activity size={100} className="text-[#003249]" />
                            </div>
                            <div className="w-18 h-18 bg-[#003249] text-amber-500 rounded-2xl flex items-center justify-center shadow-3xl border border-white/5 group-hover:rotate-12 transition-transform">
                                <Zap size={32} strokeWidth={3} className="animate-pulse" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[5px] mb-2 italic">PENDING_ALLOCATION</p>
                                <h4 className="text-4xl font-black text-[#003249] tracking-tighter italic leading-none group-hover:text-[#007ea7] transition-colors">₹{stats.totalOutstanding.toLocaleString()}</h4>
                            </div>
                        </div>
                        <div className="relative p-10 bg-[#003249] rounded-[2.8rem] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,50,73,0.4)] flex items-center gap-10 group hover:bg-[#007ea7] transition-all duration-700 min-w-[320px] overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <Award size={100} className="text-white" />
                            </div>
                            <div className="w-18 h-18 bg-white/10 text-[#80ced7] rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                                <CheckCircle size={32} strokeWidth={3} className="text-emerald-400" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-[#80ced7] uppercase tracking-[5px] mb-2 italic group-hover:text-white transition-colors">TOTAL_DISBURSED</p>
                                <h4 className="text-4xl font-black text-white tracking-tighter italic leading-none">₹{stats.totalPaid.toLocaleString()}</h4>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Tactical Toolkit */}
            <Reveal direction="up">
                <div className="flex flex-col xl:flex-row items-center justify-between gap-12 border-b-2 border-slate-50 pb-12 relative z-10">
                    <div className="relative group w-full xl:w-[600px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                        <input 
                            type="text" 
                            placeholder="IDENTIFY_OPERATOR_REWARD_SEQUENCE..." 
                            className="pl-16 pr-8 h-18 bg-white border-2 border-slate-100 rounded-[1.8rem] outline-none w-full transition-all font-black text-[11px] uppercase tracking-[4px] text-[#003249] shadow-inner focus:border-[#007ea7] focus:ring-8 focus:ring-[#007ea7]/5 placeholder:text-slate-200 italic" 
                            value={searchQuery} 
                            onChange={e=>setSearchQuery(e.target.value)} 
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                            <Satellite size={18} strokeWidth={3} />
                        </div>
                    </div>

                    <div className="flex items-center gap-8 w-full xl:w-auto">
                        <button 
                            onClick={handleExport}
                            className="h-18 px-10 bg-white border-2 border-slate-100 text-[#003249] rounded-[1.8rem] text-[11px] font-black uppercase tracking-[5px] shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center justify-center gap-5 active:scale-95 italic group"
                        >
                            <Download size={22} className="text-[#007ea7] group-hover:scale-110 transition-transform" strokeWidth={3} /> EXPORT_LEDGER
                        </button>
                        <div className="hidden lg:flex items-center gap-6 bg-slate-50 px-10 py-5 rounded-[2rem] border-2 border-slate-50 shadow-inner">
                            <div className="w-3 h-3 bg-[#007ea7] rounded-full animate-pulse shadow-[0_0_15px_#007ea7]" />
                            <span className="text-[10px] font-black text-[#003249] uppercase tracking-[5px] leading-none italic">UPLINK_ACTIVE: <span className="text-[#007ea7]">{stats.pendingCount} QUEUED</span></span>
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* Yield Registry Matrix */}
            <Reveal direction="up">
                <div className="saas-card !p-0 overflow-hidden shadow-3xl border-2 border-slate-50">
                    <div className="p-12 border-b-2 border-slate-50 bg-slate-50/20 flex items-center justify-between relative">
                         {/* Decorative Grid */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                 <Briefcase size={36} strokeWidth={2.5} className="animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Yield Registry</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Operator rewards and incentive synchronization</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 relative z-10">
                            <span className="text-[11px] font-black text-white uppercase tracking-[5px] italic bg-[#003249] px-10 h-14 flex items-center rounded-2xl shadow-2xl skew-x-[-10deg]">
                                <span className="skew-x-[10deg]">{filteredComms?.length || 0} REWARD_NODES</span>
                            </span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="bg-[#003249] text-white">
                                <tr className="text-[10px] font-black uppercase tracking-[5px] italic border-b border-white/5">
                                    <th className="px-12 py-10 border-r border-white/5">OPERATIVE_HUB</th>
                                    <th className="px-12 py-10 border-r border-white/5">CLIENT_NODE</th>
                                    <th className="px-12 py-10 text-center border-r border-white/5">INCENTIVE_VALUE</th>
                                    <th className="px-12 py-10 text-center border-r border-white/5">SYNC_STATUS</th>
                                    <th className="px-12 py-10 text-right">COMMAND</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 italic">
                                {filteredComms?.map((comm, idx) => (
                                    <tr key={comm._id} className="hover:bg-slate-50/50 transition-all duration-500 group">
                                        <td className="px-12 py-12">
                                            <div className="flex items-center gap-8">
                                                <div className="w-20 h-20 bg-[#003249] rounded-[1.8rem] flex items-center justify-center text-[#007ea7] font-black text-3xl shadow-3xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 border-2 border-white relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                                    {comm.agent?.name?.charAt(0)}
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xl font-black text-[#003249] leading-none uppercase tracking-tighter group-hover:text-[#007ea7] transition-colors">{comm.agent?.name}</p>
                                                    <div className="flex items-center gap-3 opacity-40">
                                                        <Lock size={14} strokeWidth={3} className="text-[#007ea7]" />
                                                        <span className="text-[10px] font-black lowercase tracking-[3px] leading-none">{comm.agent?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-4 text-sm font-black text-[#003249] uppercase tracking-widest italic leading-none group-hover:translate-x-2 transition-transform">
                                                    <User size={16} className="text-[#007ea7]" strokeWidth={3} /> {comm.customer?.name}
                                                </div>
                                                <div className="flex items-center gap-4 opacity-40">
                                                    <Shield size={14} strokeWidth={3} />
                                                    <span className="text-[10px] font-black uppercase tracking-[4px] leading-none">{comm.policy?.policyName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 text-center">
                                            <div className="inline-flex items-center gap-3 px-8 py-4 bg-slate-50 border-2 border-slate-50 rounded-[2rem] group-hover:bg-[#003249] group-hover:text-[#80ced7] transition-all duration-500 shadow-inner group-hover:scale-110">
                                                <IndianRupee size={20} className="text-[#007ea7] group-hover:text-[#80ced7]" strokeWidth={4} />
                                                <span className="text-3xl font-black italic tracking-tighter uppercase leading-none">₹{comm.amount.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 text-center">
                                            <div className="flex justify-center">
                                                <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[4px] border-2 shadow-xl italic flex items-center gap-4 ${
                                                    comm.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-50 shadow-emerald-500/10' : 'bg-amber-50 text-amber-600 border-amber-50 shadow-amber-500/10 animate-pulse'
                                                }`}>
                                                    <div className={`w-3 h-3 rounded-full ${comm.status === 'Paid' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-amber-500'}`} />
                                                    {comm.status === 'Paid' ? 'SYNCHRONIZED' : 'IN_VETTING'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 text-right">
                                            {comm.status === 'Pending' ? (
                                                <button 
                                                    onClick={() => statusMutation.mutate({ id: comm._id, status: 'Paid' })}
                                                    className="h-16 px-10 bg-[#003249] text-[#80ced7] rounded-2xl text-[10px] font-black uppercase tracking-[5px] shadow-xl hover:bg-[#007ea7] hover:text-white transition-all flex items-center justify-center gap-5 active:scale-95 italic group/btn"
                                                >
                                                    AUTHORIZE_YIELD <ArrowUpRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                </button>
                                            ) : (
                                                <div className="inline-flex items-center gap-4 opacity-20 font-black text-[10px] uppercase tracking-[6px] px-8 py-4 italic">
                                                    <ShieldCheck size={20} className="text-emerald-500" strokeWidth={3} /> SECURE_CLEARANCE
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>

            {/* Zero State */}
            {filteredComms?.length === 0 && (
                 <Reveal direction="up" width="100%">
                    <div className="text-center py-40 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 shadow-3xl opacity-20">
                            <Target size={48} className="text-[#003249]" strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black text-[#003249] opacity-30 uppercase tracking-[10px] italic">No active signal in current financial quadrant</h3>
                    </div>
                </Reveal>
            )}

            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Yield_Audit_Verified
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <BarChart3 size={20} strokeWidth={3} className="text-[#007ea7]" /> Performance_Index_Nominal
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Cpu size={20} strokeWidth={3} className="text-[#007ea7]" /> Reward_Delta: 0.1s
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminCommissions;
