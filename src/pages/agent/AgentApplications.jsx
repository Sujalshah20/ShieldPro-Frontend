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
    Terminal, Zap, Compass, Briefcase
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
            toast({ title: "MANIFEST_UPDATED", description: "Internal intelligence logs have been synchronized." });
            setSelectedApp(null);
        },
        onError: (err) => toast({
            title: "SYNC_FAILURE",
            description: err?.errors?.[0]?.message || err?.message || "Failed to commit internal remarks.",
            variant: "destructive"
        })
    });

    const flagMutation = useMutation({
        mutationFn: (id) => api.put(`/agent/applications/${id}/flag`, {}, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['agentApps']);
            toast({ title: "PRIORITY_SHIFT", description: "Application escalation level has been adjusted." });
        },
        onError: (err) => toast({
            title: "ESCALATION_ERROR",
            description: err?.message || "Could not update priority vector.",
            variant: "destructive"
        })
    });

    const filteredApplications = applications?.filter(app => 
        app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={10} cols={6} /></div>;

    return (
        <div className="agent-applications p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Global Perspective Mesh */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 2px, transparent 0)`, backgroundSize: '50px 50px' }} />

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                             <div className="w-2.5 h-12 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                APPLICATION<span className="text-primary tracking-normal ml-3">_PIPELINE</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-9">
                            High-priority request monitoring and field intelligence feed
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {applications?.filter(a => a.isFlagged).length > 0 && (
                             <div className="px-8 py-4 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-5 shadow-xl shadow-rose-500/5">
                                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-[4px]">{applications.filter(a => a.isFlagged).length} CRITICAL_VECTORS_DETECTED</span>
                             </div>
                        )}
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="FILTER_MANIFEST..." 
                                className="pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full lg:w-80 transition-all font-bold text-[10px] uppercase tracking-[4px] text-header-bg shadow-xl" 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Reveal>

            <Reveal width="100%" direction="up" delay={0.2}>
                <div className="bg-white rounded-[3.5rem] border border-slate-200 overflow-hidden shadow-2xl relative">
                    <div className="px-12 py-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="w-14 h-14 bg-header-bg rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-header-bg/20 border border-white/5">
                                <FileText size={28} strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight text-header-bg">MANAGED_REQUESTS</h3>
                        </div>
                        <div className="flex -space-x-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200" />
                            ))}
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left font-bold text-[10px] tracking-[4px] uppercase text-slate-500">
                            <thead>
                                <tr className="bg-slate-50/30 text-[9px] text-slate-400 border-b border-slate-100">
                                    <th className="px-12 py-10 tracking-[5px]">CITIZEN_IDENT</th>
                                    <th className="px-12 py-10 tracking-[5px]">ASSET_CLASS</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">LIFECYCLE_STATUS</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">PRIORITY</th>
                                    <th className="px-12 py-10 tracking-[5px]">DATETIME</th>
                                    <th className="px-12 py-10 text-right tracking-[5px]">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredApplications?.map((app, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={app._id} 
                                        className={`hover:bg-slate-50/80 transition-all group ${app.isFlagged ? 'bg-rose-50/40' : ''}`}
                                    >
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-header-bg rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-header-bg/20 group-hover:rotate-12 transition-transform">
                                                    {app.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-xl tracking-tighter text-header-bg group-hover:text-primary transition-colors leading-none mb-1">{app.user?.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 lowercase tracking-normal">{app.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                                    <Shield size={18} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm text-header-bg tracking-tight leading-none mb-1">{app.policy?.policyName}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 tracking-[2px]">{app.policy?.policyType?.toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[3px] flex items-center gap-3 border ${
                                                    app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' :
                                                    app.status === 'Paid' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        app.status === 'Approved' ? 'bg-emerald-500 animate-pulse' :
                                                        app.status === 'Paid' ? 'bg-indigo-500' :
                                                        app.status === 'Rejected' ? 'bg-rose-500' :
                                                        'bg-amber-500'
                                                    }`} />
                                                    {app.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8 text-center">
                                            <button 
                                                onClick={() => flagMutation.mutate(app._id)}
                                                className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center shadow-lg active:scale-90 ${app.isFlagged ? 'bg-rose-600 text-white shadow-rose-500/20' : 'bg-slate-50 text-slate-300 hover:bg-slate-100 border border-slate-100'}`}
                                            >
                                                <AlertCircle size={24} strokeWidth={3} className={app.isFlagged ? 'animate-bounce' : ''} />
                                            </button>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-4 text-slate-400">
                                                <Clock size={16} className="text-primary/40 truncate" />
                                                <span className="text-[10px] font-bold tracking-[2px] whitespace-nowrap">{new Date(app.appliedDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8 text-right">
                                            <button 
                                                onClick={() => {
                                                    setSelectedApp(app);
                                                    setRemarks(app.internalRemarks || "");
                                                }}
                                                className="h-14 px-10 bg-white border border-slate-200 text-header-bg rounded-2xl text-[10px] font-black uppercase tracking-[4px] hover:bg-header-bg hover:text-white hover:border-header-bg transition-all shadow-xl active:scale-95 flex items-center gap-6 justify-end float-right group/rev"
                                            >
                                                REVIEW_MANIFEST <Zap size={18} className="group-hover/rev:translate-x-2 transition-transform" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredApplications?.length === 0 && (
                            <div className="py-40 text-center">
                                <FileText size={80} className="mx-auto mb-8 text-slate-200" strokeWidth={1} />
                                <h3 className="text-2xl font-black uppercase text-slate-300 italic tracking-[10px]">EMPTY_PIPELINE</h3>
                            </div>
                        )}
                    </div>
                </div>
            </Reveal>

            {/* Field Intelligence Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedApp(null)}
                            className="absolute inset-0 bg-header-bg/95 backdrop-blur-3xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-2xl bg-white p-16 md:p-20 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
                            
                            <div className="flex justify-between items-start mb-16 relative z-10">
                                <div className="flex items-center gap-10">
                                    <div className="w-20 h-20 bg-header-bg rounded-[2rem] flex items-center justify-center text-primary shadow-2xl border border-white/10">
                                        <MessageSquare size={36} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black uppercase tracking-tighter text-header-bg leading-none">INTELLIGENCE_LOG</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-4 flex items-center gap-4">
                                            CITIZEN: <span className="text-primary">{selectedApp.user?.name.toUpperCase()}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12 relative z-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-5 block ml-2">FIELD_OBSERVATIONS</label>
                                    <div className="relative group">
                                        <div className="absolute left-8 top-10 text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Terminal size={20} />
                                        </div>
                                        <textarea 
                                            className="w-full h-56 bg-slate-50 border border-slate-200 rounded-[3rem] px-20 py-10 font-black text-xs uppercase tracking-[4px] outline-none focus:border-primary focus:bg-white shadow-xl transition-all no-scrollbar leading-relaxed text-header-bg"
                                            placeholder="APPEND INTERNAL INTEL TO MISSION MANIFEST..."
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center gap-6 group/info">
                                    <Compass size={24} className="text-primary group-hover:rotate-[360deg] transition-transform duration-1000" />
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] leading-relaxed italic">Intelligence appended here is restricted to CLEARANCE_LEVEL_B (Administrators and Coordinators) only.</p>
                                </div>

                                <div className="flex gap-8">
                                    <button 
                                        onClick={() => setSelectedApp(null)}
                                        className="h-20 px-10 bg-white border border-slate-200 text-slate-400 rounded-3xl text-[10px] font-black uppercase tracking-[6px] hover:bg-header-bg hover:text-white transition-all active:scale-95"
                                    >
                                        ABORT_SYNC
                                    </button>
                                    <button 
                                        onClick={() => remarkMutation.mutate({ id: selectedApp._id, remarks })}
                                        disabled={remarkMutation.isLoading}
                                        className="flex-1 h-20 bg-primary text-white rounded-3xl text-xs font-black uppercase tracking-[8px] shadow-2xl shadow-primary/40 hover:bg-header-bg hover:translate-y-[-10px] transition-all active:scale-95 flex items-center justify-center gap-6 disabled:opacity-50"
                                    >
                                        {remarkMutation.isLoading ? "COMMITING..." : "SYNC_MANIFEST"}
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
