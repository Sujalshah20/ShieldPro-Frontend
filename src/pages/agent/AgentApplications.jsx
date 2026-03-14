import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    FileText, User, Shield, MessageSquare, 
    CheckCircle, Clock, AlertCircle, Search,
    Filter, Layout, Command, Target,
    Activity, ChevronRight, Fingerprint, 
    Terminal, Zap, Compass, Briefcase,
    ShieldCheck, Globe, Lock, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AgentApplications = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: applications, isLoading } = useQuery({
        queryKey: ['agentApps', user?.token],
        queryFn: () => api.get('/agent/applications', user.token),
        enabled: !!user?.token
    });

    const remarkMutation = useMutation({
        mutationFn: (data) => api.put(`/agent/applications/${data.id}/remarks`, { remarks: data.remarks }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['agentApps']);
            toast({ title: "MANIFEST_SYNCHRONIZED", description: "Internal intelligence logs have been committed to the mainframe." });
            setSelectedApp(null);
        },
        onError: (err) => toast({
            title: "SYNC_FAILURE",
            description: err?.errors?.[0]?.message || err?.message || "Operational anomaly during manifest commit.",
            variant: "destructive"
        })
    });

    const flagMutation = useMutation({
        mutationFn: (id) => api.put(`/agent/applications/${id}/flag`, {}, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['agentApps']);
            toast({ title: "PRIORITY_SHIFT", description: "Application escalation vector has been recalibrated." });
        },
        onError: (err) => toast({
            title: "ESCALATION_ERROR",
            description: err?.message || "Could not adjust priority vector.",
            variant: "destructive"
        })
    });

    const filteredApplications = applications?.filter(app => 
        app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
            <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <TableSkeleton rows={10} cols={6} />
        </div>
    );

    const flaggedCount = applications?.filter(a => a.isFlagged).length || 0;

    return (
        <div className="agent-applications p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Application Pipeline</h1>
                    <p className="text-sm text-slate-500 font-medium italic">High-priority request monitoring and field intelligence feed. Status: Operational.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-6">
                    {flaggedCount > 0 && (
                         <div className="px-6 py-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 shadow-sm">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                            <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">{flaggedCount} CRITICAL VECTORS</span>
                         </div>
                    )}
                    <div className="relative group w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0082a1] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="FILTER MANIFEST..." 
                            className="pl-12 pr-4 h-11 bg-white border border-slate-200 rounded-xl outline-none w-full transition-all font-bold text-[10px] uppercase tracking-widest text-[#012b3f] shadow-sm focus:border-[#0082a1]" 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Pipeline Table */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-[#012b3f] rounded-xl flex items-center justify-center text-[#0082a1] shadow-xl">
                            <Terminal size={24} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-[#012b3f]">Managed Requests</h3>
                    </div>
                    <div className="hidden md:flex items-center gap-4 px-6 py-2 bg-[#012b3f]/5 rounded-[2rem] border border-slate-100 shadow-inner">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[8px] font-black text-[#012b3f] uppercase tracking-[3px]">UPLINK_SYNCHRONIZED</span>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fafb]">
                            <tr className="border-b border-slate-100 uppercase tracking-widest text-[9px] font-black text-slate-400">
                                <th className="px-10 py-6">Citizen Identity</th>
                                <th className="px-10 py-6">Asset Class</th>
                                <th className="px-10 py-6 text-center">Lifecycle Status</th>
                                <th className="px-10 py-6 text-center">Escalation</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredApplications?.map((app, idx) => (
                                <tr key={app._id} className={`hover:bg-slate-50/50 transition-colors group ${app.isFlagged ? 'bg-rose-50/20' : ''}`}>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#012b3f] rounded-xl flex items-center justify-center text-[#0082a1] font-black text-base shadow-xl group-hover:rotate-12 transition-transform">
                                                {app.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-base text-[#012b3f] leading-none mb-1">{app.user?.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 lowercase italic">{app.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3 bg-[#012b3f]/5 px-4 py-2 rounded-xl border border-slate-100 w-fit">
                                            <Shield size={14} className="text-[#0082a1]" />
                                            <span className="text-[10px] font-black text-[#012b3f] uppercase tracking-widest">{app.policy?.policyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            app.status === 'Paid' ? 'bg-[#0082a1]/10 text-[#0082a1] border-[#0082a1]/20' :
                                            app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                            'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                app.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' :
                                                app.status === 'Paid' ? 'bg-[#0082a1] shadow-[0_0_5px_#0082a1]' :
                                                app.status === 'Rejected' ? 'bg-rose-500' :
                                                'bg-amber-500'
                                            }`} />
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <button 
                                            onClick={() => flagMutation.mutate(app._id)}
                                            className={`w-10 h-10 rounded-xl transition-all inline-flex items-center justify-center shadow-lg active:scale-95 ${app.isFlagged ? 'bg-rose-600 text-white shadow-rose-600/20' : 'bg-slate-50 text-slate-300 hover:bg-white hover:border-[#0082a1]/30 border border-slate-100'}`}
                                        >
                                            <AlertCircle size={20} strokeWidth={3} className={app.isFlagged ? 'animate-bounce' : ''} />
                                        </button>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button 
                                            onClick={() => {
                                                setSelectedApp(app);
                                                setRemarks(app.internalRemarks || "");
                                            }}
                                            className="h-10 px-6 bg-white border border-slate-200 text-[#012b3f] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#012b3f] hover:text-white transition-all shadow-xl active:scale-95 group/rev"
                                        >
                                            Review Manifest
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Field Intelligence Overlay */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-[#012b3f]/90 backdrop-blur-3xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white p-12 md:p-16 rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-[#0082a1]/10 rounded-full blur-[100px] pointer-events-none" />
                            
                            <div className="flex items-center gap-8 mb-12 relative z-10">
                                <div className="w-16 h-16 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl">
                                    <MessageSquare size={28} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#012b3f] leading-none mb-2">Intelligence Log</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Citizen: <span className="text-[#0082a1]">{selectedApp.user?.name}</span></p>
                                </div>
                            </div>

                            <div className="space-y-10 relative z-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] mb-4 block ml-1">Field Observations</label>
                                    <div className="relative group">
                                        <textarea 
                                            className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 font-bold text-[11px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white shadow-inner transition-all no-scrollbar text-[#012b3f]"
                                            placeholder="APPEND INTERNAL INTEL TO MISSION MANIFEST..."
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="p-6 bg-[#012b3f] text-white rounded-2xl border border-white/5 relative overflow-hidden group/warn">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#0082a1] mb-2 flex items-center gap-2">
                                        <Terminal size={12} /> CLEARANCE REQUIRED
                                    </p>
                                    <p className="text-[9px] leading-relaxed font-bold text-white/30 uppercase tracking-widest">Observations appended here are restricted to CLEARANCE_LEVEL_B operatives only. All logs are globally audited.</p>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setSelectedApp(null)}
                                        className="h-16 px-8 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#012b3f] hover:text-white transition-all flex items-center justify-center"
                                    >
                                        Abort Sync
                                    </button>
                                    <button 
                                        onClick={() => remarkMutation.mutate({ id: selectedApp._id, remarks })}
                                        disabled={remarkMutation.isLoading}
                                        className="flex-1 h-16 bg-[#0082a1] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-[#012b3f] transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                                    >
                                        {remarkMutation.isLoading ? "Commiting..." : "Sync Manifest"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentApplications;
