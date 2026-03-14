import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Shield, User, CheckCircle, XCircle, Clock, 
    AlertCircle, FileText, ExternalLink, Zap,
    Fingerprint, Search, Filter, ArrowUpRight,
    Activity, ClipboardList, Target, Mail,
    Cpu, Lock, Layers, Eye, ShieldCheck, UserCheck as AgentIcon,
    Command, Globe, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminApplications = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: applications, isLoading } = useQuery({
        queryKey: ['adminApps', user?.token],
        queryFn: () => api.get('/applications', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/applications/${data.id}/status`, { status: data.status, rejectionReason: data.reason }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminApps']);
            toast({ title: "PROTOCOL_STATUS_UPDATED", description: "Application status has been successfully synchronized." });
            setSelectedApp(null);
            setRejectionReason("");
        },
        onError: (err) => {
            toast({
                title: "SYNC_FAILED",
                description: err?.message || "Failed to update protocol status.",
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
            <TableSkeleton rows={10} cols={6} />
        </div>
    );

    const stats = {
        pending: applications?.filter(a => a.status === 'Pending' || a.status === 'Under Review').length || 0,
        flagged: applications?.filter(a => a.isFlagged).length || 0,
        active_sync: applications?.length || 0
    };

    const filteredApps = applications?.filter(app => 
        app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statusBadge = (status) => {
        const styles = {
            'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'Paid': 'bg-[#0082a1]/10 text-[#0082a1] border-[#0082a1]/20',
            'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
            'On Hold': 'bg-amber-50 text-amber-600 border-amber-100',
            'Pending': 'bg-slate-50 text-slate-400 border-slate-200'
        };
        return (
            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles['Pending']}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="admin-applications p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Header */}
            <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1">Securitization Pipeline</h1>
                    <p className="text-sm text-slate-500 font-medium">Review and authorize global insurance procurement requests.</p>
                </div>
                
                <div className="flex gap-4">
                    {[
                        { label: "Pending Vetting", value: stats.pending, color: "text-amber-500", bg: "bg-amber-50", icon: Clock },
                        { label: "Critical Flags", value: stats.flagged, color: "text-rose-500", bg: "bg-rose-50", icon: AlertCircle },
                        { label: "Total Volume", value: stats.active_sync, color: "text-[#0082a1]", bg: "bg-[#0082a1]/5", icon: Layers }
                    ].map((item, i) => (
                        <div key={i} className="bg-white px-6 py-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                                <item.icon size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                <h4 className="text-lg font-black text-[#012b3f] leading-none">{item.value}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="relative group w-full max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="SEARCH APPLICATION RECORDS..." 
                        className="pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl outline-none w-full transition-all font-bold text-[10px] uppercase tracking-widest text-[#012b3f] shadow-sm focus:border-[#0082a1]" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>

                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/50 px-6 py-3 rounded-full border border-slate-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Uplink Synchronized
                </div>
            </div>

            {/* Registry */}
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#012b3f] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <ClipboardList size={20} />
                        </div>
                        <h3 className="text-xl font-black text-[#012b3f]">Application Registry</h3>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fafb]">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Client Identity</th>
                                <th className="px-8 py-5">Security Protocol</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-center">Flags</th>
                                <th className="px-8 py-5">Operator</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredApps?.map((app, idx) => (
                                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#012b3f]/5 rounded-xl flex items-center justify-center text-[#012b3f] border border-slate-100">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#012b3f] mb-0.5">{app.user?.name}</p>
                                                <p className="text-[10px] font-medium text-slate-400 lowercase">{app.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#012b3f]">{app.policy?.policyName}</span>
                                            <span className="text-[10px] text-slate-300 font-black uppercase">ID: {app._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {statusBadge(app.status)}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {app.isFlagged ? (
                                            <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-100">Critical</span>
                                        ) : (
                                            <span className="text-[9px] font-black text-slate-200 uppercase">Clear</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {app.agent ? (
                                             <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#012b3f] rounded-lg flex items-center justify-center text-[#0082a1] font-black text-xs">
                                                    {app.agent.name.charAt(0)}
                                                </div>
                                                <span className="text-xs font-bold text-[#012b3f]">{app.agent.name}</span>
                                             </div>
                                        ) : (
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-50">Direct Access</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="px-6 py-2 bg-white border border-slate-200 text-[#012b3f] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-[#012b3f] hover:text-white transition-all flex items-center gap-2 float-right"
                                        >
                                            Review <Eye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Console */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-[#012b3f]/90 backdrop-blur-md" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-5xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-[#012b3f] rounded-2xl flex items-center justify-center text-white shadow-xl">
                                        <ClipboardList size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-[#012b3f]">Protocol Analysis</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Ref: {selectedApp._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className={`px-6 py-3 rounded-2xl border flex items-center gap-4 ${selectedApp.isFlagged ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-[#0082a1]/5 text-[#0082a1] border-[#0082a1]/10'}`}>
                                    {selectedApp.isFlagged ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
                                    <span className="font-black text-xs uppercase tracking-widest">{selectedApp.isFlagged ? 'Critical Vetting Required' : 'Standard Clearance'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm transition-all">
                                        <p className="text-[10px] font-black text-[#0082a1] uppercase tracking-widest mb-6">Subject Identity</p>
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-[#012b3f] rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                                {selectedApp.user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black text-[#012b3f]">{selectedApp.user?.name}</p>
                                                <p className="text-xs font-bold text-slate-400 mt-1">{selectedApp.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-[#0082a1] uppercase tracking-widest mb-6">Asset Specifications</p>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#012b3f] shadow-sm border border-slate-100">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <p className="text-xl font-black text-[#012b3f]">{selectedApp.policy?.policyName}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                <span className="text-[9px] font-black text-slate-300 uppercase block mb-1">Premium</span>
                                                <span className="text-xl font-black text-[#0082a1]">₹{selectedApp.policy?.premiumAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                <span className="text-[9px] font-black text-slate-300 uppercase block mb-1">Coverage</span>
                                                <span className="text-xl font-black text-[#012b3f]">₹{(selectedApp.policy?.coverageAmount / 100000).toFixed(1)}L</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="h-full p-8 bg-[#012b3f] text-white rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#0082a1] shadow-lg border border-white/10">
                                            <Cpu size={24} />
                                        </div>
                                        <p className="text-lg font-black uppercase tracking-widest">Process Intelligence</p>
                                    </div>
                                    
                                    <div className="text-xs font-bold text-white/40 tracking-widest uppercase flex-1 space-y-6 overflow-y-auto no-scrollbar pr-4">
                                        {selectedApp.internalRemarks ? (
                                            <p className="normal-case leading-relaxed text-white/70 italic">"{selectedApp.internalRemarks}"</p>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className="flex gap-4"><span className="text-[#0082a1] font-black">01:</span> Node Identification Verified.</p>
                                                <p className="flex gap-4"><span className="text-[#0082a1] font-black">02:</span> Policy Compliance Check: Passed.</p>
                                                <p className="flex gap-4"><span className="text-[#0082a1] font-black">03:</span> Risk Matrix Scanned: Stable.</p>
                                                <p className="flex gap-4 animate-pulse"><span className="text-[#0082a1] font-black">>>:</span> Awaiting Administrator Clearance...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Decision Log Remarks</label>
                                <textarea 
                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-[2rem] p-6 outline-none focus:border-[#0082a1] focus:bg-white transition-all font-bold text-xs text-[#012b3f] shadow-sm"
                                    placeholder="Enter authorization justification or rejection parameters..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Approved' })}
                                    className="flex-1 h-16 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                >
                                    <CheckCircle size={20} /> Authorize Application
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Rejected', reason: rejectionReason })}
                                    className="flex-1 h-16 bg-[#012b3f] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg"
                                >
                                    Deny Protocol
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'On Hold', reason: rejectionReason })}
                                    className="h-16 px-8 bg-white border border-slate-200 text-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-50 transition-all shadow-sm"
                                >
                                    Suspend
                                </button>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="px-8 h-16 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-[#012b3f] transition-all"
                                >
                                    Abort
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminApplications;
