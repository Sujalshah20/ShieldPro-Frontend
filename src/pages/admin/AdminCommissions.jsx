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
    Command, Compass, Award, Globe
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
            toast({ title: "DISBURSEMENT_SYNCHRONIZED", description: `Incentive status successfully updated to: ${variables.status.toUpperCase()}` });
        },
        onError: (err) => {
            toast({
                title: "SYNC_ERROR",
                description: err?.message || "Failed to update disburstment protocol.",
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
            a.download = `ShieldPro_Asset_Yield_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast({ title: "STATEMENT_DOWNLOADED", description: "Incentive ledger has been successfully exported to local storage." });
        } catch (error) {
            console.error("Export failed", error);
            toast({ title: "EXPORT_VULNERABILITY", description: "Failed to generate incentive statement.", variant: "destructive" });
        }
    };

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={10} cols={6} /></div>;

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
        <div className="admin-commissions p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Mission Atmosphere */}
            <div className="absolute top-0 left-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[4000ms]">
                <PieChart size={800} className="text-primary transform rotate-12" />
            </div>
            
            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                INCENTIVE<span className="text-primary tracking-normal ml-1">_LEDGER</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-7">
                            Agent performance rewards and platform disbursement management
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-10">
                         <div className="px-12 py-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col items-center group hover:border-amber-500/50 transition-all relative overflow-hidden">
                            <div className="absolute top-[-10%] right-[-10%] opacity-[0.05] pointer-events-none">
                                <Activity size={100} className="text-amber-600" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[5px] text-slate-400 mb-2 flex items-center gap-3">
                                <Zap size={14} className="text-amber-500" /> PENDING_DISBURSEMENT
                            </span>
                            <span className="text-4xl font-black text-header-bg tracking-tighter uppercase leading-none">₹{stats.totalOutstanding.toLocaleString()}</span>
                         </div>
                         <div className="px-12 py-8 bg-header-bg rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center group hover:bg-primary transition-all duration-700 relative overflow-hidden">
                            <div className="absolute top-[-10%] right-[-10%] opacity-10 pointer-events-none">
                                <Award size={100} className="text-white brightness-200" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[5px] text-white/40 mb-2 flex items-center gap-3 group-hover:text-white transition-colors">
                                <CheckCircle size={14} className="text-primary group-hover:text-white" /> MISSION_COMPLETED
                            </span>
                            <span className="text-4xl font-black text-white tracking-tighter uppercase leading-none">₹{stats.totalPaid.toLocaleString()}</span>
                         </div>
                    </div>
                </div>
            </Reveal>

            {/* COMMAND CONSOLE */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-10 mb-16">
                <div className="relative group w-full xl:w-[600px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="IDENTIFY_OPERATOR_REWARDS..." 
                        className="pl-16 pr-8 h-18 py-6 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full transition-all font-bold text-[10px] uppercase tracking-[4px] text-header-bg shadow-xl" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>

                <div className="flex items-center gap-8 w-full xl:w-auto">
                    <button 
                        onClick={handleExport}
                        className="flex-1 xl:flex-initial h-18 px-12 bg-header-bg text-white rounded-2xl font-black text-[10px] uppercase tracking-[5px] hover:bg-primary transition-all flex items-center justify-center gap-6 shadow-2xl shadow-header-bg/20 active:scale-95 border border-white/5 group"
                    >
                        <Download size={22} strokeWidth={4} className="text-primary group-hover:text-white transition-colors" /> EXPORT_LEDGER
                    </button>
                    <div className="hidden lg:flex items-center gap-6 bg-white px-10 py-5 rounded-2xl border border-slate-200 shadow-xl">
                        <BarChart3 className="text-primary w-6 h-6 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[5px]">SYNC_STATUS: ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* INCENTIVE REGISTRY */}
            <Reveal width="100%" direction="up" delay={0.4}>
                <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl mb-16">
                    <div className="px-12 py-12 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-12 bg-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <Layers size={200} className="text-header-bg rotate-12" />
                        </div>
                        <div className="flex items-center gap-10 relative z-10">
                            <div className="w-20 h-20 bg-header-bg rounded-2xl flex items-center justify-center text-white shadow-xl shadow-header-bg/20 border border-white/10">
                                <Briefcase size={36} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">INCENTIVE_REGISTRY</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-4 flex items-center gap-4">
                                    <Globe size={14} className="text-primary" /> Tracking global disbursement logs across the operative network
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 bg-primary text-white px-10 py-5 rounded-[2rem] border border-white/10 relative z-10 shadow-2xl shadow-primary/40 group hover:bg-header-bg transition-colors duration-500">
                            <Zap size={22} className="animate-pulse group-hover:scale-125 transition-transform" />
                            <span className="text-[11px] font-black uppercase tracking-[5px]">
                                {stats.pendingCount} PROTOCOLS_AWAITING_AUTHORIZATION
                            </span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left font-bold text-[10px] uppercase tracking-widest text-slate-500">
                            <thead>
                                <tr className="bg-slate-50/50 text-[9px] text-slate-400 border-b border-slate-100">
                                    <th className="px-12 py-10 tracking-[5px]">OPERATOR</th>
                                    <th className="px-12 py-10 tracking-[5px]">CLIENT_NODE</th>
                                    <th className="px-12 py-10 tracking-[5px]">ASSET_SCHEME</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">INCENTIVE_VALUE</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">SYNC_STATUS</th>
                                    <th className="px-12 py-10 text-right tracking-[5px]">UPLINK_ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredComms?.map((comm, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={comm._id} 
                                        className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                                    >
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-8">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700" />
                                                    <div className="relative w-20 h-20 bg-header-bg rounded-2xl flex items-center justify-center text-primary border border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-xl overflow-hidden">
                                                        <span className="text-2xl font-black italic text-white/50 group-hover:text-primary transition-colors">{comm.agent?.name?.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black tracking-tight text-header-bg group-hover:text-primary transition-colors leading-none mb-3 uppercase">{comm.agent?.name}</p>
                                                    <div className="flex items-center gap-4 px-4 py-1.5 bg-slate-100 text-slate-400 rounded-lg border border-slate-200/50 w-fit">
                                                        <Lock size={12} className="text-primary/60" strokeWidth={3} />
                                                        <p className="text-[9px] font-bold tracking-[2px] lowercase">{comm.agent?.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex flex-col gap-2.5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2.5 h-2.5 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                                                    <span className="font-black text-sm text-header-bg uppercase leading-none">{comm.customer?.name}</span>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[3px] ml-6">VERIFIED_CLEARANCE</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-6 bg-slate-50 py-4 px-8 rounded-2xl border border-slate-100 w-fit group-hover:bg-white transition-colors duration-500">
                                                <ShieldCheck size={20} className="text-primary/60" strokeWidth={3} />
                                                <span className="font-black text-[10px] text-header-bg uppercase tracking-[3px] leading-none">{comm.policy?.policyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10 text-center">
                                            <div className="flex items-center justify-center gap-4 px-10 py-5 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                                <IndianRupee size={22} className="text-primary" strokeWidth={3} />
                                                <span className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">₹{comm.amount.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex justify-center">
                                                <div className={`px-10 py-3 rounded-full text-[10px] font-black tracking-[4px] flex items-center gap-5 w-fit border shadow-sm ${
                                                    comm.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                                }`}>
                                                    <div className={`w-2.5 h-2.5 rounded-full ${comm.status === 'Paid' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-amber-500 shadow-lg shadow-amber-500/40'}`} />
                                                    {comm.status === 'Paid' ? 'PROCESS_OK' : 'VETTING'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            {comm.status === 'Pending' ? (
                                                <button 
                                                    onClick={() => statusMutation.mutate({ id: comm._id, status: 'Paid' })}
                                                    className="h-14 px-10 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[4px] shadow-2xl shadow-primary/30 hover:translate-y-[-8px] hover:bg-header-bg transition-all active:scale-95 flex items-center gap-5 float-right group/btn border border-white/10"
                                                >
                                                    AUTHORIZE_YIELD <ArrowUpRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-end gap-6 opacity-20 font-black text-[10px] uppercase tracking-[5px] group-hover:opacity-60 transition-opacity duration-700">
                                                    <ShieldCheck size={20} className="text-emerald-500" /> TRANSACTION_SYNCHRONIZED
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredComms?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-12 py-60 text-center">
                                            <div className="relative inline-block mb-12">
                                                <Command size={150} className="mx-auto text-header-bg opacity-5" />
                                                <div className="absolute inset-0 bg-primary/5 blur-[120px]" />
                                            </div>
                                            <h3 className="text-4xl font-black uppercase tracking-tighter text-header-bg opacity-10">NO_INCENTIVE_RECORDS_IDENTIFIED</h3>
                                            <p className="opacity-20 max-w-sm mx-auto mt-8 font-bold text-[10px] tracking-[6px] uppercase leading-loose">The requested incentive data is not present in the current quadrant.</p>
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

export default AdminCommissions;
