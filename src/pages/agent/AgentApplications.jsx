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
    ShieldCheck, Globe, Lock, Award, X, Layers,
    Satellite, RefreshCcw, SearchCheck
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
            toast({ 
                title: "MANIFEST_SYNCHRONIZED", 
                description: "Internal intelligence logs have been committed to the mainframe.",
                variant: "default"
            });
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
            toast({ 
                title: "PRIORITY_SHIFT", 
                description: "Application escalation vector has been recalibrated.",
                variant: "default"
            });
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
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="h-[600px] bg-slate-50 rounded-[3rem] border-2 border-slate-100 animate-pulse" />
        </div>
    );

    const flaggedCount = applications?.filter(a => a.isFlagged).length || 0;

    return (
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Security_Vetting_Stream</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Application <span className="text-[#007ea7]">Pipeline_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">High-priority request monitoring and field intelligence feed. Status: <span className="text-[#007ea7]">OPERATIONAL</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-wrap items-center gap-8">
                        {flaggedCount > 0 && (
                            <div className="px-8 py-4 bg-rose-50 border-2 border-rose-50 rounded-2xl flex items-center gap-5 shadow-xl shadow-rose-500/10 animate-pulse">
                                <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_15px_#f43f5e]" />
                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-[5px] italic">{flaggedCount} CRITICAL_VECTORS</span>
                            </div>
                        )}
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                            <input 
                                type="text" 
                                placeholder="IDENTIFY_RECORD_NODE..." 
                                className="pl-16 pr-8 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none w-full transition-all font-black text-[11px] uppercase tracking-[4px] text-[#003249] shadow-inner focus:border-[#007ea7] focus:ring-8 focus:ring-[#007ea7]/5 placeholder:text-slate-200 italic" 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                                <Satellite size={16} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Pipeline Table */}
            <Reveal direction="up">
                <div className="saas-card !p-0 overflow-hidden shadow-3xl border-2 border-slate-50">
                    <div className="p-12 border-b-2 border-slate-50 bg-slate-50/20 flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative">
                         {/* Tactical Background */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                <Terminal size={36} strokeWidth={2.5} className="animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Managed Requests</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Field operative intelligence and vetting logs</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-6 bg-slate-50 px-10 py-4 rounded-xl border-2 border-slate-50 shadow-inner overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#007ea7]/5 to-transparent animate-shimmer" />
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
                            <span className="text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic relative z-10">UPLINK_SYNCHRONIZED_HW-0128</span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="bg-[#003249] text-white">
                                <tr className="text-[10px] font-black uppercase tracking-[5px] italic border-b border-white/5">
                                    <th className="px-12 py-10 border-r border-white/5">CITIZEN_IDENTITY</th>
                                    <th className="px-12 py-10 border-r border-white/5">ASSET_CLASS</th>
                                    <th className="px-12 py-10 text-center border-r border-white/5">LIFECYCLE_STATUS</th>
                                    <th className="px-12 py-10 text-center border-r border-white/5">PRIORITY_ESCALATION</th>
                                    <th className="px-12 py-10 text-right">COMMAND</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 italic">
                                {filteredApplications?.map((app, idx) => (
                                    <tr key={app._id} className={`hover:bg-slate-50/50 transition-all duration-500 group ${app.isFlagged ? 'bg-rose-50/10' : ''}`}>
                                        <td className="px-12 py-12">
                                            <div className="flex items-center gap-8">
                                                <div className="w-20 h-20 bg-[#003249] rounded-[1.8rem] flex items-center justify-center text-[#007ea7] font-black text-3xl shadow-3xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 border-2 border-white relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                                    {app.user?.name?.charAt(0)}
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xl font-black text-[#003249] leading-none uppercase tracking-tighter group-hover:text-[#007ea7] transition-colors">{app.user?.name}</p>
                                                    <div className="flex items-center gap-3 opacity-40">
                                                        <Fingerprint size={14} strokeWidth={3} className="text-[#007ea7]" />
                                                        <span className="text-[10px] font-black lowercase tracking-[3px] leading-none">{app.user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12">
                                            <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-50 w-fit group-hover:bg-white group-hover:border-[#007ea7]/30 transition-all shadow-sm">
                                                <Shield size={16} className="text-[#007ea7]" strokeWidth={3} />
                                                <span className="text-[11px] font-black text-[#003249] uppercase tracking-[5px] leading-none">{app.policy?.policyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 text-center">
                                            <div className="flex justify-center">
                                                <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[4px] border-2 shadow-xl italic flex items-center gap-4 ${
                                                    app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-50 shadow-emerald-500/10' :
                                                    app.status === 'Paid' ? 'bg-[#007ea7]/10 text-[#007ea7] border-[#007ea7]/20 shadow-[#007ea7]/10' :
                                                    app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-50 shadow-rose-500/10' :
                                                    'bg-amber-50 text-amber-600 border-amber-50 shadow-amber-500/10'
                                                }`}>
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        app.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' :
                                                        app.status === 'Paid' ? 'bg-[#007ea7]' :
                                                        app.status === 'Rejected' ? 'bg-rose-500' :
                                                        'bg-amber-500 animate-pulse'
                                                    }`} />
                                                    {app.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 text-center">
                                            <button 
                                                onClick={() => flagMutation.mutate(app._id)}
                                                className={`w-14 h-14 rounded-2xl transition-all inline-flex items-center justify-center shadow-2xl active:scale-95 border-2 group/flag ${app.isFlagged ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-300 hover:bg-[#003249] hover:text-[#007ea7] hover:border-[#003249]'}`}
                                            >
                                                <AlertCircle size={24} strokeWidth={3} className={app.isFlagged ? 'animate-bounce' : 'group-hover/flag:rotate-12 transition-transform'} />
                                            </button>
                                        </td>
                                        <td className="px-12 py-12 text-right">
                                            <button 
                                                onClick={() => {
                                                    setSelectedApp(app);
                                                    setRemarks(app.internalRemarks || "");
                                                }}
                                                className="h-16 px-10 bg-white border-2 border-slate-100 text-[#003249] text-[10px] font-black uppercase tracking-[5px] rounded-2xl shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center justify-center gap-5 active:scale-95 italic group/btn"
                                            >
                                                REVIEW_MANIFEST <ChevronRight size={18} strokeWidth={4} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>

            {/* Field Intelligence Overlay */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-[#003249]/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-2xl bg-white p-16 md:p-20 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden"
                        >
                            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#007ea7]/10 rounded-full blur-[120px] pointer-events-none" />
                            
                            <div className="flex items-center gap-10 mb-16 relative z-10 border-b-2 border-slate-50 pb-12">
                                <div className="w-20 h-20 bg-[#003249] rounded-[2rem] flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5 relative group overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                     <MessageSquare size={36} strokeWidth={3} className="relative z-10 group-hover:rotate-12 transition-transform" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] leading-none mb-1 italic">Intelligence Log</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] italic">Target_Node: <span className="text-[#007ea7]">{selectedApp.user?.name}</span></p>
                                </div>
                                <button onClick={() => setSelectedApp(null)} className="ml-auto p-6 bg-slate-50 hover:bg-rose-50 rounded-[2.5rem] transition-all group active:scale-95 border-2 border-transparent hover:border-rose-100">
                                    <X size={24} className="text-slate-300 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-500" strokeWidth={4} />
                                </button>
                            </div>

                            <div className="space-y-12 relative z-10">
                                <div className="space-y-6">
                                    <label className="text-[12px] font-black uppercase tracking-[10px] text-[#007ea7] ml-4 italic block leading-none">Field Observations</label>
                                    <div className="relative group">
                                        <textarea 
                                            className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-[3rem] px-10 py-10 font-black text-[12px] uppercase tracking-[4px] outline-none focus:border-[#007ea7] focus:bg-white shadow-inner transition-all no-scrollbar text-[#003249] italic placeholder:text-slate-200"
                                            placeholder="APPEND_INTERNAL_INTEL_TO_MISSION_MANIFEST..."
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="p-10 bg-[#003249] text-white rounded-[3.5rem] border border-white/5 relative overflow-hidden group/warn shadow-3xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                    <p className="text-[11px] font-black uppercase tracking-[8px] text-[#80ced7] mb-6 flex items-center gap-4 italic leading-none">
                                        <Terminal size={18} strokeWidth={3} className="text-[#007ea7]" /> CLEARANCE_REQUIRED
                                    </p>
                                    <p className="text-[10px] leading-relaxed font-black text-white/30 uppercase tracking-[5px] italic mb-2">Observations appended here are restricted to <span className="text-[#007ea7]">LEVEL_B_OPERATIVES</span> only.</p>
                                    <div className="flex items-center gap-4 opacity-10">
                                        <Fingerprint size={12} strokeWidth={3} />
                                        <span className="text-[8px] font-black tracking-[4px]">UPLINK_ENCRYPTED_SHA512</span>
                                    </div>
                                </div>

                                <div className="flex gap-8 pt-6">
                                    <button 
                                        onClick={() => setSelectedApp(null)}
                                        className="h-20 px-12 bg-white border-2 border-slate-100 text-[#003249] rounded-[2.5rem] text-[12px] font-black uppercase tracking-[8px] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center active:scale-95 italic flex-1"
                                    >
                                        ABORT_SYNC
                                    </button>
                                    <button 
                                        onClick={() => remarkMutation.mutate({ id: selectedApp._id, remarks })}
                                        disabled={remarkMutation.isLoading}
                                        className="flex-[2] h-20 bg-[#003249] text-[#80ced7] rounded-[2.5rem] text-[13px] font-black uppercase tracking-[10px] shadow-3xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-6 italic disabled:opacity-50 group/btn"
                                    >
                                        <RefreshCcw size={24} strokeWidth={3} className={`${remarkMutation.isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                                        {remarkMutation.isLoading ? "COMMITTING..." : "SYNC_MANIFEST"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Mission_Critical_Protocol
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Field_Intelligence_Feed
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Sector_Latency: 0.1ms
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentApplications;
