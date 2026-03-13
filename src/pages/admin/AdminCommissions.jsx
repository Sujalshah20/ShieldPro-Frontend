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
    Layers, CreditCard, ArrowDownRight, Box, PieChart
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
            toast({ title: "COMMISSION_STATUS_UPDATED", description: `Commission has been marked as ${variables.status.toUpperCase()}.` });
        },
        onError: (err) => {
            toast({
                title: "PAYMENT_UPDATE_FAILED",
                description: err?.message || "Error updating commission status.",
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
            a.download = `ShieldPro_Commissions_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast({ title: "COMMISSION_REPORT_DOWNLOADED", description: "Commission statement has been successfully exported." });
        } catch (error) {
            console.error("Export failed", error);
            toast({ title: "EXPORT_ERROR", description: "Failed to generate commission report.", variant: "destructive" });
        }
    };

    if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={6} /></div>;

    const stats = {
        totalOutstanding: commissions?.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0) || 0,
        totalPaid: commissions?.filter(c => c.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0) || 0,
        pendingCount: commissions?.filter(c => c.status === 'Pending').length || 0
    };

    const filteredComms = commissions?.filter(comm => 
        comm.agent?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.policy?.policyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-commissions p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#0c1a15] min-h-screen relative overflow-hidden">
            {/* Background UI Accents */}
            <div className="absolute top-[-10%] left-[-10%] opacity-[0.03] pointer-events-none">
                <PieChart size={800} className="animate-spin-slow text-primary rotate-45" />
            </div>
            
            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#0165FF]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                AGENT<span className="text-primary tracking-normal">_COMMISSIONS</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Manage agent incentive structures and platform profitability metrics
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-8">
                         <div className="px-10 py-8 bg-white dark:bg-zinc-900/50 rounded-[3rem] border-2 border-orange-500/10 shadow-3xl flex flex-col items-center group hover:border-orange-500/40 transition-all backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[10px] font-black uppercase tracking-[5px] opacity-30 mb-2 italic text-orange-500 flex items-center gap-3">
                                <Activity size={14} /> PENDING_PAYOUTS
                            </span>
                            <span className="text-4xl font-black text-orange-500 tracking-tighter group-hover:scale-110 transition-transform uppercase italic leading-none">₹{stats.totalOutstanding.toLocaleString()}</span>
                         </div>
                         <div className="px-10 py-8 bg-white dark:bg-zinc-900/50 rounded-[3rem] border-2 border-emerald-500/10 shadow-3xl flex flex-col items-center group hover:border-emerald-500/40 transition-all backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[10px] font-black uppercase tracking-[5px] opacity-30 mb-2 italic text-emerald-500 flex items-center gap-3">
                                <CheckCircle size={14} /> TOTAL_DISBURSEMENTS
                            </span>
                            <span className="text-4xl font-black text-emerald-500 tracking-tighter group-hover:scale-110 transition-transform uppercase italic leading-none">₹{stats.totalPaid.toLocaleString()}</span>
                         </div>
                    </div>
                </div>
            </Reveal>

            {/* COMMAND CENTER */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-10 mb-16">
                <div className="relative group w-full xl:w-[600px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="SEARCH_BY_AGENT_OR_PLAN_NAME..." 
                        className="pl-16 pr-8 h-18 bg-white dark:bg-zinc-900/50 border border-border/50 rounded-[1.5rem] focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full transition-all font-black text-[10px] uppercase tracking-[5px] shadow-sm backdrop-blur-md italic" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>

                <div className="flex items-center gap-8 w-full xl:w-auto">
                    <button 
                        onClick={handleExport}
                        className="flex-1 xl:flex-initial h-18 px-10 bg-zinc-950 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[5px] hover:bg-primary transition-all flex items-center justify-center gap-5 shadow-2xl active:scale-95 italic border border-white/5 group"
                    >
                        <Download size={20} strokeWidth={4} className="text-primary group-hover:translate-y-1 transition-transform" /> EXPORT_REPORT
                    </button>
                    <div className="hidden lg:flex items-center gap-6 bg-white dark:bg-zinc-900/50 px-8 py-4 rounded-3xl border border-border/50 backdrop-blur-md">
                        <BarChart3 className="text-primary w-6 h-6 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[5px] opacity-30 italic">REAL_TIME_TRACKING: ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* COMMISSIONS REGISTRY */}
            <div className="bg-white dark:bg-zinc-900/50 rounded-[4rem] border border-border/50 overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="p-12 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-50 dark:bg-white/[0.02] relative">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <DollarSign size={200} className="rotate-12" />
                    </div>
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-xl">
                            <Briefcase size={32} strokeWidth={3} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">COMMISSIONS_REGISTRY</h3>
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] mt-3 italic ml-1 flex items-center gap-3">
                                <Activity size={12} className="text-primary" /> Track and process commissions across all agents
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-primary/5 text-primary px-8 py-4 rounded-[1.5rem] border border-primary/20 relative z-10 shadow-lg group">
                        <Zap size={20} className="animate-pulse group-hover:scale-125 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[4px] italic">
                            {stats.pendingCount} PAYMENTS_AWAITING_APPROVAL
                        </span>
                    </div>
                </div>
                
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left font-black text-[10px] uppercase tracking-widest italic">
                        <thead>
                            <tr className="bg-zinc-100 dark:bg-white/5 text-[9px] opacity-40">
                                <th className="px-12 py-8 tracking-[4px]">AGENT_NAME</th>
                                <th className="px-12 py-8 tracking-[4px]">CUSTOMER_NAME</th>
                                <th className="px-12 py-8 tracking-[4px]">POLICY_PLAN</th>
                                <th className="px-12 py-8 text-center tracking-[4px]">COMMISSION_AMOUNT</th>
                                <th className="px-12 py-8 text-center tracking-[4px]">STATUS</th>
                                <th className="px-12 py-8 text-right tracking-[4px]">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {filteredComms?.map((comm, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={comm._id} 
                                    className="hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-all group cursor-pointer"
                                >
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative group/avatar">
                                                <div className="absolute inset-0 bg-primary blur-xl opacity-0 group-hover/avatar:opacity-20 transition-all" />
                                                <div className="relative w-22 h-22 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center text-primary border-2 border-border/50 group-hover:border-primary/50 transition-all overflow-hidden shadow-2xl">
                                                    <span className="text-3xl font-black italic">{comm.agent?.name?.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors leading-none mb-3">{comm.agent?.name}</p>
                                                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 text-white rounded-xl border border-white/5 w-fit">
                                                    <Lock size={12} className="text-primary" strokeWidth={3} />
                                                    <p className="text-[8px] opacity-60 tracking-[3px] font-black italic lowercase">{comm.agent?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_#0165FF]" />
                                                <span className="text-xs font-black italic tracking-tighter leading-none group-hover:text-foreground transition-colors">{comm.customer?.name}</span>
                                            </div>
                                            <span className="text-[8px] opacity-20 tracking-[3px] uppercase ml-4">VERIFIED_CLIENT</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-4 bg-zinc-100 dark:bg-white/5 px-5 py-3 rounded-2xl border border-border/30 w-fit group-hover:border-primary/30 transition-colors">
                                            <ShieldCheck size={18} className="text-primary opacity-60" strokeWidth={3} />
                                            <span className="text-[10px] font-black italic tracking-tighter uppercase leading-none opacity-80">{comm.policy?.policyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8 text-center">
                                        <div className="flex items-center justify-center gap-3 px-8 py-4 bg-primary/5 rounded-[1.5rem] border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                                            <IndianRupee size={22} className="text-primary" strokeWidth={3} />
                                            <span className="text-3xl font-black italic tracking-tighter uppercase leading-none text-primary">₹{comm.amount.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex justify-center">
                                            <div className={`px-8 py-3 rounded-2xl text-[9px] font-black tracking-[4px] flex items-center gap-4 w-fit shadow-xl italic ${
                                                comm.status === 'Paid' ? 'bg-emerald-500/5 text-emerald-500 border border-emerald-500/20' : 'bg-orange-500/5 text-orange-500 border border-orange-500/20 animate-pulse'
                                            }`}>
                                                <div className={`w-2.5 h-2.5 rounded-full ${comm.status === 'Paid' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-orange-500 shadow-[0_0_10px_#f97316]'}`} />
                                                {comm.status === 'Paid' ? 'PAID' : 'PENDING'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                        {comm.status === 'Pending' ? (
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: comm._id, status: 'Paid' })}
                                                className="h-14 px-10 bg-primary text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[4px] shadow-2xl shadow-primary/30 hover:translate-y-[-6px] transition-all active:scale-95 italic flex items-center gap-5 float-right group/btn"
                                            >
                                                APPROVE_PAYMENT <ArrowUpRight size={18} strokeWidth={4} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-end gap-5 opacity-20 font-black italic text-[10px] uppercase tracking-[5px] group-hover:opacity-40 transition-opacity">
                                                <Zap size={18} /> TRANSACTION_COMPLETE
                                            </div>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredComms?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-12 py-40 text-center">
                                        <div className="relative inline-block mb-10">
                                            <BarChart3 size={150} className="mx-auto opacity-5" />
                                            <div className="absolute inset-0 bg-primary/5 blur-[100px]" />
                                        </div>
                                        <h3 className="text-4xl font-black uppercase italic tracking-tighter opacity-10">NO_COMMISSIONS_FOUND</h3>
                                        <p className="opacity-10 max-w-sm mx-auto mt-6 font-black uppercase text-[10px] tracking-[6px] italic leading-loose">No commission records identified in current search.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCommissions;
