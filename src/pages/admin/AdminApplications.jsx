import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Shield, User, CheckCircle, Clock, 
    AlertCircle, FileText, Search, Filter,
    ClipboardList, Eye, ShieldCheck, 
    Cpu, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

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
            toast({ title: "PROTOCOL_STATUS_UPDATED", description: "Node authorization has been successfully synchronized." });
            setSelectedApp(null);
            setRejectionReason("");
        },
        onError: (err) => {
            toast({
                title: "SYNC_FAILED",
                description: err?.message || "Failed to finalize authorization.",
                variant: "destructive"
            });
        }
    });

    if (isLoading) return (
        <div className="saas-container py-12">
            <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-8" />
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
            'Paid': 'bg-[#007ea7]/10 text-[#007ea7] border-[#007ea7]/20',
            'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
            'On Hold': 'bg-amber-50 text-amber-600 border-amber-100',
            'Pending': 'bg-slate-50 text-slate-400 border-slate-200'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles['Pending']}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-display">
            {/* Header Area */}
            <div className="border-b border-[#ccdbdc]/30 bg-white sticky top-0 z-50">
                <div className="saas-container h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#003249] p-1.5 rounded-lg">
                            <Layers className="w-5 h-5 text-[#9ad1d4]" />
                        </div>
                        <span className="text-lg font-black text-[#003249]">Vetting Terminal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                            <input 
                                type="text" 
                                placeholder="Universal record search..." 
                                className="bg-slate-50 border border-[#ccdbdc]/50 rounded-lg py-1.5 pl-9 pr-4 text-[12px] font-semibold w-64 focus:outline-none focus:ring-2 focus:ring-[#007ea7]/10"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50/50 px-4 py-2 rounded-lg border border-emerald-100/50">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Sync Live
                        </div>
                    </div>
                </div>
            </div>

            <main className="py-12">
                <div className="saas-container">
                    {/* Page Actions */}
                    <div className="flex flex-wrap items-center justify-between mb-10 gap-6">
                        <div>
                            <h1>Securitization Pipeline</h1>
                            <p className="max-w-md">Authorize and validate cross-border insurance procurement requests.</p>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { label: "Pending Vetting", value: stats.pending, color: "text-amber-500", bg: "bg-amber-50", icon: Clock },
                                { label: "Total Volume", value: stats.active_sync, color: "text-[#007ea7]", bg: "bg-[#007ea7]/5", icon: Layers }
                            ].map((item, i) => (
                                <div key={i} className="bg-white px-5 py-3 rounded-xl border border-[#ccdbdc]/30 shadow-sm flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                                        <item.icon size={16} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                        <h4 className="text-base font-black text-[#003249] leading-none">{item.value}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Registry Table */}
                    <div className="saas-card !p-0 overflow-hidden shadow-xl mb-12">
                        <div className="p-8 border-b border-[#ccdbdc]/30 flex items-center gap-4 bg-slate-50/30">
                            <div className="w-8 h-8 bg-[#003249] rounded-lg flex items-center justify-center text-white">
                                <ClipboardList size={18} />
                            </div>
                            <h3 className="text-lg">Application Registry</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#ccdbdc]/20 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10">
                                        <th className="px-8 py-5">Subject Entity</th>
                                        <th className="px-8 py-5">Security Protocol</th>
                                        <th className="px-8 py-5 text-center">Lifecycle</th>
                                        <th className="px-8 py-5 text-center">Flags</th>
                                        <th className="px-8 py-5">Operator</th>
                                        <th className="px-8 py-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#ccdbdc]/10">
                                    {filteredApps?.map((app, idx) => (
                                        <tr key={app._id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer text-sm font-semibold">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[#003249] font-black text-[10px]">
                                                        {app.user?.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[#003249] whitespace-nowrap">{app.user?.name}</p>
                                                        <p className="text-[10px] font-bold opacity-30 lowercase">{app.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[#003249]">{app.policy?.policyName}</span>
                                                    <span className="text-[10px] font-black opacity-20 uppercase">#{app._id.slice(-6)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                {statusBadge(app.status)}
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                {app.isFlagged ? (
                                                    <span className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded text-[9px] font-black uppercase border border-rose-100">Critical</span>
                                                ) : (
                                                    <span className="text-[9px] font-black opacity-20 uppercase">Clear</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5">
                                                {app.agent ? (
                                                     <div className="flex items-center gap-2">
                                                        <span className="text-xs">{app.agent.name}</span>
                                                     </div>
                                                ) : (
                                                    <span className="text-[10px] font-black opacity-30 uppercase tracking-widest italic">Direct</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button 
                                                    onClick={() => setSelectedApp(app)}
                                                    className="btn btn-ghost px-4 py-1.5 text-[10px] uppercase tracking-widest bg-white"
                                                >
                                                    Analysis <Eye size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Application Detail Modal - Redesigned */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-[#003249]/80 backdrop-blur-md" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-[#ccdbdc]/30 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#003249] rounded-xl flex items-center justify-center text-white">
                                        <Cpu size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg">Protocol Verification Console</h3>
                                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Target: {selectedApp._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedApp(null)} className="text-[#003249]/40 hover:text-[#003249] text-sm font-black uppercase tracking-widest">Close terminal</button>
                            </div>

                            <div className="p-8 overflow-y-auto no-scrollbar grid lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-6 bg-[#f8fafc] rounded-2xl border border-[#ccdbdc]/30">
                                        <p className="text-[10px] font-black text-[#007ea7] uppercase tracking-widest mb-4">Identity Matrix</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-[#003249] rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                                                {selectedApp.user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-[#003249]">{selectedApp.user?.name}</p>
                                                <p className="text-[11px] font-bold opacity-40">{selectedApp.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-[#f8fafc] rounded-2xl border border-[#ccdbdc]/30">
                                        <p className="text-[10px] font-black text-[#007ea7] uppercase tracking-widest mb-4">Symmetry Specs</p>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-white border border-[#ccdbdc]/30 rounded-lg flex items-center justify-center text-[#003249]">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <p className="text-lg font-bold text-[#003249]">{app.policy?.policyName}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-white rounded-xl border border-[#ccdbdc]/20">
                                                <span className="text-[9px] font-black opacity-30 uppercase block mb-1">Settlement</span>
                                                <span className="text-lg font-black text-[#007ea7]">₹{selectedApp.policy?.premiumAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-[#ccdbdc]/20">
                                                <span className="text-[9px] font-black opacity-30 uppercase block mb-1">Safety Cap</span>
                                                <span className="text-lg font-black text-[#003249]">₹{(selectedApp.policy?.coverageAmount / 100000).toFixed(1)}L</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#003249] rounded-2xl p-8 text-white relative flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Activity size={18} className="text-[#80ced7]" />
                                        <h4 className="text-[11px] font-black uppercase tracking-widest">Logic Stream</h4>
                                    </div>
                                    <div className="text-[11px] font-bold opacity-60 space-y-4 font-mono">
                                        <p>{">"} Checksum verification active...</p>
                                        <p>{">"} Risk matrix: Nominal status.</p>
                                        <p>{">"} Policy compliance: Valid.</p>
                                        <p className="text-emerald-400">{">"} Integrity check: Passed.</p>
                                        <p className="animate-pulse">{">"} Awaiting manual override...</p>
                                    </div>
                                    <div className="mt-auto pt-8">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 block">Terminal Justification</label>
                                        <textarea 
                                            className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#80ced7] transition-all text-sm font-semibold text-[#80ced7]"
                                            placeholder="Enter authorization parameters..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-[#ccdbdc]/30 flex flex-wrap gap-4 bg-slate-50/50">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Approved' })}
                                    className="btn btn-primary flex-1 h-14 uppercase tracking-widest text-[11px]"
                                >
                                    Authorize Target
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Rejected', reason: rejectionReason })}
                                    className="btn btn-secondary flex-1 h-14 bg-rose-600 hover:bg-rose-700 uppercase tracking-widest text-[11px]"
                                >
                                    Deny Sync
                                </button>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="btn btn-ghost px-10 h-14 bg-white uppercase tracking-widest text-[11px]"
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
