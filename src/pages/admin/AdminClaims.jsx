import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    FileText, User, ShieldCheck, CheckCircle, XCircle, 
    Clock, AlertCircle, TrendingUp, IndianRupee, Mail,
    Briefcase, Fingerprint, Zap, Search, ShieldAlert,
    BarChart3, Target, Activity, Lock,
    CreditCard, Layout, Eye, ArrowUpRight,
    Command, Compass, PieChart, Award, Shield,
    Cpu, Layers, AlertTriangle, CheckCircle2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const AdminClaims = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: claims, isLoading } = useQuery({
        queryKey: ['adminClaims', user?.token],
        queryFn: () => api.get('/claims/all', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/claims/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['adminClaims']);
            toast({ title: "SETTLEMENT_SYNCHRONIZED", description: `Disbursement status successfully translated to: ${variables.status.toUpperCase()}` });
            setSelectedClaim(null);
        },
        onError: (err) => {
            toast({
                title: "SYNC_FAILED",
                description: err?.message || "Failed to update settlement protocol.",
                variant: "destructive"
            });
        }
    });

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
             <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}
            </div>
            <TableSkeleton rows={10} cols={6} />
        </div>
    );

    const stats = {
        pending: claims?.filter(c => c.status === 'Pending').length || 0,
        investigating: claims?.filter(c => c.status === 'Investigation').length || 0,
        authorized: claims?.filter(c => c.status === 'Approved').length || 0,
        totalVolume: claims?.reduce((acc, curr) => acc + curr.amount, 0) || 0
    };

    const filteredClaims = claims?.filter(claim => 
        claim.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.userPolicy?.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-claims p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Settlement Command</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Coordinate global disbursement protocols and audit claim vectors.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0082a1] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="IDENTIFY CLAIM SEQUENCE..." 
                            className="pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl outline-none w-full transition-all font-bold text-[10px] uppercase tracking-widest text-[#012b3f] shadow-sm focus:border-[#0082a1]" 
                            value={searchQuery} 
                            onChange={e=>setSearchQuery(e.target.value)} 
                        />
                    </div>
                </div>
            </div>

            {/* Tactical Metrics Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "Pending Vetting", value: stats.pending, icon: ShieldAlert, color: "text-[#0082a1]", bg: "bg-[#0082a1]/10" },
                    { label: "Active Investigations", value: stats.investigating, icon: Activity, color: "text-[#012b3f]", bg: "bg-slate-100" },
                    { label: "Authorized Payouts", value: stats.authorized, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Aggregate Volume", value: `₹${(stats.totalVolume / 100).toFixed(1)}k`, icon: IndianRupee, color: "text-[#0082a1]", bg: "bg-[#0082a1]/5" }
                ].map((card, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] shadow-xl border border-white hover:border-[#0082a1]/30 transition-all group overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{card.label}</span>
                            <div className={`p-2.5 rounded-xl ${card.bg} ${card.color} shadow-inner`}>
                                <card.icon size={20} strokeWidth={3} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-[#012b3f] tracking-tighter">{card.value}</h2>
                    </motion.div>
                ))}
            </div>

            {/* Settlement Registry */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#012b3f] uppercase tracking-tight">Claim Synchronization Ledger</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status of global disbursement streams</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 bg-[#012b3f] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0082a1] transition-all shadow-xl group">
                        <BarChart3 size={16} className="group-hover:rotate-90 transition-transform" /> GENERATE AUDIT REPORT
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr className="border-b border-slate-100 uppercase tracking-widest text-[9px] font-black text-slate-400">
                                <th className="px-10 py-6">Operative Entity</th>
                                <th className="px-10 py-6">Protocol context</th>
                                <th className="px-10 py-6">Value</th>
                                <th className="px-10 py-6 text-center">Audit Status</th>
                                <th className="px-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredClaims?.map((claim, idx) => (
                                <tr key={claim._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4 font-black">
                                            <div className="w-11 h-11 bg-[#012b3f]/5 rounded-xl flex items-center justify-center text-[#012b3f] border border-slate-100 text-xs">
                                                {claim.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm text-[#012b3f] leading-none mb-1">{claim.user?.name}</p>
                                                <div className="flex items-center gap-1.5 opacity-40">
                                                    <Fingerprint size={10} />
                                                    <span className="text-[9px] lowercase tracking-widest">{claim.user?.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-xs font-black text-[#012b3f] uppercase">{claim.userPolicy?.policy?.policyName}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-3 bg-[#0082a1] rounded-full" />
                                                <span className="text-[10px] text-slate-300 font-black tracking-widest leading-none">REF: {claim.userPolicy?.policyNumber}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-[#012b3f]">₹{claim.amount.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                            'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {claim.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button 
                                            onClick={() => setSelectedClaim(claim)}
                                            className="px-6 py-2 bg-white text-[#012b3f] border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-[#012b3f] hover:text-white transition-all flex items-center gap-3 float-right"
                                        >
                                            Audit <Eye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredClaims?.length === 0 && (
                     <div className="text-center py-40">
                         <Command size={48} className="mx-auto mb-6 opacity-5 text-[#012b3f]" />
                         <p className="text-[11px] font-black uppercase tracking-[5px] text-slate-300">No active signal identified in this sector</p>
                     </div>
                )}
            </div>

            {/* Tactical Review Console */}
            <AnimatePresence>
                {selectedClaim && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedClaim(null)} className="absolute inset-0 bg-[#012b3f]/90 backdrop-blur-md" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform duration-[5000ms]">
                                <ShieldAlert size={400} />
                            </div>

                            <div className="flex items-center justify-between mb-12 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-[#012b3f] text-[#0082a1] rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-black/20">
                                        <ShieldAlert size={32} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-[#012b3f] uppercase tracking-tighter">Settlement Vector Analysis</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[4px] mt-1">Sequence ID: {selectedClaim._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedClaim(null)} className="p-3 bg-slate-50 hover:bg-rose-50 rounded-2xl transition-all group">
                                    <X size={24} className="text-slate-300 group-hover:text-rose-500" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14 relative z-10">
                                <div className="space-y-8">
                                    <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-inner">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] mb-6">Insured Operator Node</p>
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-[#012b3f] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl">{selectedClaim.user?.name.charAt(0)}</div>
                                            <div>
                                                <p className="text-xl font-black text-[#012b3f] mb-0.5">{selectedClaim.user?.name}</p>
                                                <div className="flex items-center gap-2 text-[9px] text-[#0082a1] font-black uppercase tracking-widest">
                                                    <Lock size={10} /> {selectedClaim.user?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 bg-[#012b3f] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group/card transition-all">
                                        <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={48} className="group-hover/card:scale-125 transition-transform" /></div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[5px] mb-6 flex items-center gap-2"><CreditCard size={12} /> DISBURSEMENT_MAGNITUDE</p>
                                        <div className="flex items-end justify-between">
                                            <span className="text-6xl font-black tracking-tighter text-white">₹{selectedClaim.amount.toLocaleString()}</span>
                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/5`}>{selectedClaim.status}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex flex-col relative overflow-hidden shadow-inner">
                                    <div className="flex items-center gap-2 mb-6">
                                        <FileText size={14} className="text-[#0082a1]" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[5px]">INCIDENT_LOG_MANIFEST</p>
                                    </div>
                                    <div className="flex-1 text-xs font-bold text-[#012b3f] leading-relaxed overflow-y-auto no-scrollbar italic opacity-80 border-l-2 border-[#0082a1]/20 pl-6">
                                        "{selectedClaim.description || "MANIFEST_EMPTY — Standard vetting protocol suggested. Awaiting operative narrative input."}"
                                    </div>
                                    <div className="mt-8 flex items-center gap-4 opacity-20">
                                         <div className="h-px bg-slate-400 flex-1" />
                                         <Fingerprint size={16} />
                                         <div className="h-px bg-slate-400 flex-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-5 relative z-10">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Investigation' })}
                                    className="flex-[2] py-5 border-2 border-[#012b3f] text-[#012b3f] rounded-[1.5rem] font-black text-[11px] uppercase tracking-[4px] hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Activity size={18} /> INITIATE_PROBE
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Approved' })}
                                    className="flex-[3] py-5 bg-[#0082a1] text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[6px] shadow-2xl shadow-[#0082a1]/30 hover:bg-[#012b3f] transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <CheckCircle size={18} /> AUTHORIZE_CREDIT
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Rejected' })}
                                    className="flex-[1] py-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[4px] hover:bg-rose-600 hover:text-white transition-all active:scale-95 flex items-center justify-center"
                                >
                                    DENY
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminClaims;