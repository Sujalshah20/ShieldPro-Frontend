import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import { 
    DollarSign, User, ShieldCheck, CheckCircle, Clock, 
    Search, Filter, TrendingUp, IndianRupee,
    Briefcase, Fingerprint, Zap, BarChart3,
    ArrowUpRight, Download, Activity, Lock, 
    Layers, CreditCard, ArrowDownRight, Box, PieChart,
    Command, Compass, Award, Globe, Shield, Cpu,
    ChevronRight, Wallet, UserCheck, Target,
    Satellite, RefreshCcw, SearchCheck, Terminal,
    MoreHorizontal, CheckCircle2, ShieldAlert
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
            toast({ title: `Commission marked as ${variables.status}` });
        },
        onError: (err) => {
            toast({ title: "Failed to update status", variant: "destructive" });
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
            toast({ title: "Export successful" });
        } catch (error) {
            toast({ title: "Export failed", variant: "destructive" });
        }
    };

    const stats = {
        totalOutstanding: commissions?.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0) || 0,
        totalPaid: commissions?.filter(c => c.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0) || 0,
    };

    const filteredComms = commissions?.filter(comm => 
        comm.agent?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Yield & Commissions</h1>
                        <p className="text-slate-500 font-medium">Coordinate agent performance rewards and incentive payouts.</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <button 
                        onClick={handleExport}
                        className="h-11 px-6 bg-blue-600 text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                    >
                        <Download size={18} /> Export Earnings
                    </button>
                </Reveal>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Reveal direction="up" delay={0.1}>
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-8 group hover:border-blue-100 transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-100 transition-colors shadow-sm border border-amber-100/50">
                            <Clock size={32} />
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Pending Allocation</p>
                            <h3 className="text-4xl font-bold text-slate-800 tracking-tight italic">₹{stats.totalOutstanding.toLocaleString()}</h3>
                        </div>
                    </div>
                </Reveal>
                <Reveal direction="up" delay={0.2}>
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-8 group overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                             <CheckCircle2 size={100} className="text-emerald-500" />
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-xl border border-white/5 relative z-10">
                            <Wallet size={32} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Total Disbursed</p>
                            <h3 className="text-4xl font-bold text-white tracking-tight italic">₹{stats.totalPaid.toLocaleString()}</h3>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative group w-full md:w-[500px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Agent, Customer or Policy..." 
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
                    <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold shadow-sm">All Records</button>
                    <button className="px-4 py-2 text-slate-500 hover:text-slate-700 rounded-lg text-xs font-bold">In Review</button>
                    <button className="px-4 py-2 text-slate-500 hover:text-slate-700 rounded-lg text-xs font-bold">Approved</button>
                </div>
            </div>

            {/* Commissions Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto text-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-5">Agent Hub</th>
                                <th className="px-6 py-5">Context (Customer/Policy)</th>
                                <th className="px-6 py-5 text-center">Incentive</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-right">Command</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic font-medium">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredComms?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400 uppercase tracking-widest font-bold">NO REWARD NODES IDENTIFIED</td>
                                </tr>
                            ) : (
                                filteredComms.map((comm) => (
                                    <tr key={comm._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                    {comm.agent?.name?.charAt(0)}
                                                </div>
                                                <div className="flex flex-col not-italic">
                                                    <span className="text-sm font-bold text-slate-700">{comm.agent?.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{comm.agent?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1 not-italic">
                                                <div className="flex items-center gap-2">
                                                    <User size={12} className="text-blue-500" />
                                                    <span className="text-xs font-bold text-slate-700">{comm.customer?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Shield size={12} className="text-slate-300" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{comm.policy?.policyName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-xl font-bold text-slate-800 italic group-hover:text-blue-600 transition-colors tracking-tighter">₹{comm.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                                                    comm.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${comm.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                                    {comm.status === 'Paid' ? 'Synchronized' : 'In Vetting'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {comm.status === 'Pending' ? (
                                                <button 
                                                    onClick={() => statusMutation.mutate({ id: comm._id, status: 'Paid' })}
                                                    className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                                                >
                                                    Authorize Yield
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest opacity-60">
                                                    <CheckCircle2 size={14} /> Clear
                                                </div>
                                            )}
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

export default AdminCommissions;
