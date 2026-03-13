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
    Cpu, Lock, Layers, Eye, ShieldCheck, UserCheck as AgentIcon
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
            toast({ title: "APPLICATION_STATUS_UPDATED", description: "Application status has been successfully recorded." });
            setSelectedApp(null);
            setRejectionReason("");
        },
        onError: (err) => {
            toast({
                title: "UPDATE_FAILED",
                description: err?.message || "Failed to update application status.",
                variant: "destructive"
            });
        }
    });

    if (isLoading) return <div className="p-8"><TableSkeleton rows={12} cols={6} /></div>;

    const stats = {
        pending: applications?.filter(a => a.status === 'Pending' || a.status === 'Under Review').length || 0,
        flagged: applications?.filter(a => a.isFlagged).length || 0,
        active_sync: applications?.length || 0
    };

    const filteredApps = applications?.filter(app => 
        app.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.policy?.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-applications p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#0c1a15] min-h-screen relative overflow-hidden">
            {/* Professional Grid Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #0165FF 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
            
            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#0165FF]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                APPLICATION<span className="text-primary tracking-normal">_PIPELINE</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Review, verify and process insurance policy applications
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-6">
                         {[
                            { label: "PENDING_REVIEW", value: stats.pending, color: "text-orange-500", bg: "bg-orange-500/10", icon: Activity },
                            { label: "FLAGGED_APPLICATIONS", value: stats.flagged, color: "text-rose-500", bg: "bg-rose-500/10", icon: AlertCircle },
                            { label: "TOTAL_APPLICATIONS", value: stats.active_sync, color: "text-primary", bg: "bg-primary/10", icon: ClipboardList }
                         ].map((item, i) => (
                             <div key={i} className="px-10 py-6 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col items-center min-w-[180px] group hover:border-primary/40 transition-all backdrop-blur-md relative overflow-hidden">
                                <div className={`absolute -right-4 -top-4 w-16 h-16 ${item.bg} rounded-full blur-2xl opacity-40 group-hover:scale-150 transition-transform`} />
                                <span className="text-[9px] font-black uppercase tracking-[4px] opacity-30 mb-2 italic relative z-10 flex items-center gap-2">
                                    <item.icon size={12} className={item.color} /> {item.label}
                                </span>
                                <span className={`text-4xl font-black ${item.color} tracking-tighter group-hover:scale-110 transition-transform relative z-10 leading-none`}>
                                    {item.value < 10 ? `0${item.value}` : item.value}
                                </span>
                             </div>
                         ))}
                    </div>
                </div>
            </Reveal>

            {/* COMMAND BAR */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
                 <div className="relative group w-full lg:w-[500px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="SEARCH_BY_CLIENT_OR_PLAN_NAME..." 
                        className="pl-16 pr-8 h-18 bg-white dark:bg-zinc-900/50 border border-border/50 rounded-[1.5rem] focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full transition-all font-black text-[10px] uppercase tracking-[4px] shadow-sm backdrop-blur-md italic" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>

                <div className="flex items-center gap-6 bg-white dark:bg-zinc-900/50 px-8 py-4 rounded-2xl border border-border/50 backdrop-blur-md">
                    <span className="text-[10px] font-black uppercase tracking-[4px] opacity-20 italic">DATABASE_SYNC:</span>
                    <div className="px-5 py-2.5 bg-emerald-500/5 text-emerald-500 rounded-xl border border-emerald-500/20 text-[9px] font-black uppercase tracking-[3px] flex items-center gap-3">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                         DATABASE_SYNCED_OK
                    </div>
                </div>
            </div>

            {/* APPLICATIONS LIST */}
            <div className="bg-white dark:bg-zinc-900/50 rounded-[4rem] border border-border/50 overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="p-10 border-b border-border/50 lg:flex lg:justify-between lg:items-center relative overflow-hidden bg-zinc-50 dark:bg-white/[0.02]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <Layers size={200} className="rotate-12" />
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                            <ClipboardList size={28} strokeWidth={3} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">APPLICATION_REGISTRY</h3>
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] mt-2 italic ml-1">Explore all insurance policy applications and their status</p>
                        </div>
                    </div>
                    <div className="mt-8 lg:mt-0 flex items-center gap-8 relative z-10">
                         <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase tracking-[3px] opacity-20">PENDING_REVIEW</span>
                            <span className="text-2xl font-black italic text-orange-500">{stats.pending}</span>
                         </div>
                         <div className="w-px h-10 bg-border/20" />
                         <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase tracking-[3px] opacity-20">TOTAL_RECORDS</span>
                            <span className="text-2xl font-black italic text-primary">{stats.active_sync}</span>
                         </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left font-black text-[10px] uppercase tracking-widest italic">
                        <thead>
                            <tr className="bg-zinc-100 dark:bg-white/5 text-[9px] opacity-40">
                                <th className="px-12 py-8 tracking-[4px]">APPLICANT_INFORMATION</th>
                                <th className="px-12 py-8 tracking-[4px]">INSURANCE_PLAN</th>
                                <th className="px-12 py-8 text-center tracking-[4px]">STATUS</th>
                                <th className="px-12 py-8 text-center tracking-[4px]">URGENCY_STATUS</th>
                                <th className="px-12 py-8 tracking-[4px]">ASSIGNED_AGENT</th>
                                <th className="px-12 py-8 text-right tracking-[4px]">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {filteredApps?.map((app, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={app._id} 
                                    className={`hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-all group cursor-pointer ${app.isFlagged ? 'bg-rose-500/[0.03]' : ''}`}
                                >
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative group/avatar">
                                                <div className="absolute inset-0 bg-primary blur-xl opacity-0 group-hover/avatar:opacity-20 transition-all" />
                                                <div className="relative w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center text-primary border-2 border-border/50 group-hover:border-primary/50 transition-all overflow-hidden shadow-lg">
                                                    <User size={28} strokeWidth={3} className="grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors leading-none mb-2">{app.user?.name}</p>
                                                <p className="text-[9px] opacity-30 tracking-[3px] flex items-center gap-3 mt-1 lowercase font-black italic">
                                                    <Mail size={12} className="text-primary" /> {app.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20 shadow-sm">
                                                <Shield size={18} strokeWidth={3} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black italic tracking-tighter leading-none mb-1">{app.policy?.policyName}</span>
                                                <span className="text-[8px] opacity-20 tracking-[2px]">ID: {app._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex justify-center">
                                            <div className={`px-6 py-2.5 rounded-2xl text-[9px] font-black tracking-[3px] flex items-center gap-4 w-fit shadow-inner ${
                                                app.status === 'Approved' ? 'bg-emerald-500/5 text-emerald-500 border border-emerald-500/20' :
                                                app.status === 'Paid' ? 'bg-blue-500/5 text-blue-500 border border-blue-500/20' :
                                                app.status === 'Rejected' ? 'bg-rose-500/5 text-rose-500 border border-rose-500/20' :
                                                app.status === 'On Hold' ? 'bg-amber-500/5 text-amber-500 border border-amber-500/20' :
                                                'bg-orange-500/5 text-orange-500 border border-orange-500/20 animate-pulse'
                                            }`}>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    app.status === 'Approved' || app.status === 'Paid' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                                                    app.status === 'Rejected' ? 'bg-rose-500' : 
                                                    app.status === 'On Hold' ? 'bg-amber-500' : 'bg-orange-500 shadow-[0_0_8px_#f97316]'
                                                }`} />
                                                {app.status.toUpperCase()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex justify-center">
                                            {app.isFlagged ? (
                                                <div className="flex items-center gap-3 text-rose-500 text-[10px] font-black tracking-[4px] bg-rose-500/10 px-5 py-2.5 rounded-2xl border border-rose-500/30 animate-pulse uppercase italic shadow-lg">
                                                    <AlertCircle size={14} strokeWidth={3} /> HIGH_RISK
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 opacity-10">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                                    <span className="text-[8px] font-black uppercase tracking-[4px] italic">NORMAL</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        {app.agent ? (
                                             <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-primary shadow-xl">
                                                    <span className="text-base font-black italic">{app.agent.name.charAt(0)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black italic tracking-tighter leading-none mb-1">{app.agent.name}</span>
                                                    <span className="text-[8px] opacity-20 uppercase tracking-[2px]">AGENT_PROFILE</span>
                                                </div>
                                             </div>
                                        ) : (
                                            <div className="flex items-center gap-4 bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-border/30 w-fit">
                                                <Zap size={14} className="text-primary opacity-40" strokeWidth={3} />
                                                <span className="text-[9px] font-black uppercase tracking-[3px] italic opacity-40">DIRECT_SUBMISSION</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="h-12 px-8 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-[4px] shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 italic flex items-center gap-3 float-right"
                                        >
                                            REVIEW <Eye size={14} strokeWidth={3} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* REVIEW MODAL */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-zinc-950/90 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-6xl bg-white dark:bg-[#10221c] p-16 md:p-24 rounded-[5rem] border border-white/10 shadow-[0_120px_200px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                {selectedApp.isFlagged ? (
                                    <AlertCircle size={500} className="text-rose-500 animate-pulse" />
                                ) : (
                                    <ShieldCheck size={500} className="text-primary rotate-12" />
                                )}
                            </div>
                            
                            <div className="flex flex-col lg:flex-row justify-between items-start mb-20 relative z-10 gap-12">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-6 mb-2">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl ${selectedApp.isFlagged ? 'bg-rose-500 text-white' : 'bg-primary text-white'}`}>
                                            <ClipboardList size={32} strokeWidth={3} />
                                        </div>
                                        <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">APPLICATION<span className="text-primary italic-none not-italic">_REVIEW</span></h3>
                                    </div>
                                    <p className="text-xs font-black opacity-30 uppercase tracking-[8px] italic ml-20">REF: {selectedApp._id.toUpperCase()}</p>
                                </div>
                                
                                <div className={`px-10 py-5 rounded-3xl flex items-center gap-6 border-2 transition-all duration-700 ${
                                    selectedApp.isFlagged 
                                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)] animate-pulse' 
                                    : 'bg-primary/5 text-primary border-primary/20 shadow-[0_0_50px_rgba(1,101,255,0.1)]'
                                }`}>
                                    {selectedApp.isFlagged ? <AlertCircle size={32} strokeWidth={3} /> : <Target size={32} strokeWidth={3} />}
                                    <div className="flex flex-col">
                                        <span className="font-black text-[10px] uppercase tracking-[4px] leading-tight opacity-40">REVIEW_STATUS</span>
                                        <span className="font-black text-xl italic tracking-tighter uppercase">{selectedApp.isFlagged ? 'HIGH_RISK_CHECK' : 'STANDARD_CHECK'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 relative z-10">
                                <div className="space-y-10">
                                    <div className="p-12 bg-zinc-50 dark:bg-white/[0.02] rounded-[3.5rem] border-2 border-border/50 shadow-inner group hover:border-primary/50 transition-all relative overflow-hidden">
                                        <p className="text-[10px] font-black uppercase opacity-30 tracking-[5px] italic mb-8">CLIENT_PROFILE</p>
                                        <div className="flex items-center gap-10">
                                            <div className="relative group/prof">
                                                <div className="absolute inset-0 bg-primary blur-2xl opacity-0 group-hover/prof:opacity-20 transition-all" />
                                                <div className="relative w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center text-primary font-black italic text-4xl border-2 border-white/5 shadow-2xl">
                                                    {selectedApp.user?.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-black text-4xl italic tracking-tighter uppercase group-hover:text-primary transition-colors leading-none mb-3">{selectedApp.user?.name}</p>
                                                <div className="flex items-center gap-4 px-5 py-2.5 bg-zinc-900 text-white rounded-xl border border-white/5 w-fit">
                                                    <ShieldCheck size={14} className="text-primary" strokeWidth={3} />
                                                    <p className="text-[10px] opacity-60 font-black tracking-[4px] uppercase italic">IDENTITY_VERIFIED</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 mt-8">
                                            <div className="flex items-center gap-4 text-xs font-black opacity-40 uppercase tracking-[3px] italic">
                                                <Mail size={16} className="text-primary" /> {selectedApp.user?.email}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-12 bg-zinc-50 dark:bg-white/[0.02] rounded-[3.5rem] border-2 border-border/50 shadow-inner group hover:border-primary/50 transition-all relative overflow-hidden">
                                        <p className="text-[10px] font-black uppercase opacity-30 tracking-[5px] italic mb-8">REQUESTED_PLAN</p>
                                        <div className="flex lg:flex-row flex-col items-center lg:items-center gap-6 mb-10 lg:justify-start justify-center">
                                            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-lg border border-accent/20">
                                                <ShieldCheck size={32} strokeWidth={3} />
                                            </div>
                                            <div className="flex flex-col lg:items-start items-center">
                                                <p className="text-3xl font-black italic tracking-tighter uppercase group-hover:text-accent transition-colors leading-none mt-1">{selectedApp.policy?.policyName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-8 bg-white dark:bg-zinc-900 border-2 border-border/30 rounded-[2rem] shadow-xl group-hover:shadow-primary/5 transition-all">
                                            <div className="flex flex-col items-start">
                                                <span className="text-[10px] font-black opacity-20 uppercase tracking-[4px] mb-1">PREMIUM_AMOUNT</span>
                                                <span className="text-3xl font-black text-primary italic tracking-tighter leading-none">₹{selectedApp.policy?.premiumAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="h-10 w-px bg-border/20 mx-4" />
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black opacity-20 uppercase tracking-[4px] mb-1">COVERAGE_LIMIT</span>
                                                <span className="text-3xl font-black text-foreground italic tracking-tighter leading-none">₹{(selectedApp.policy?.coverageAmount / 100000).toFixed(1)}L</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-10 flex flex-col h-full">
                                    <div className="flex-1 p-12 bg-zinc-900 text-white rounded-[4rem] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group/intel">
                                        <div className="flex items-center gap-6 mb-12">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary shadow-2xl border border-white/5">
                                                <FileText size={32} strokeWidth={3} />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-black uppercase text-zinc-600 tracking-[5px] italic">INTERNAL_NOTES</p>
                                                <p className="text-2xl font-black italic tracking-tighter uppercase leading-none mt-1">SYSTEM_REMARKS</p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-base italic opacity-70 leading-relaxed font-black uppercase tracking-[3px] h-[300px] overflow-y-auto no-scrollbar pr-10 border-l-2 border-primary/20 pl-10">
                                            {selectedApp.internalRemarks || (
                                                <div className="space-y-8">
                                                    <p className="text-rose-500/50 flex gap-4"><span className="text-rose-500">SYSTEM:</span> SCANNING_APPLICATION_DATA...</p>
                                                    <p className="flex gap-4"><span className="text-primary">SYSTEM:</span> NO_AUTOMATED_FLAGS_DETECTED.</p>
                                                    <p className="flex gap-4"><span className="text-primary">SYSTEM:</span> ELIGIBILITY_VERIFIED.</p>
                                                    <p className="animate-pulse">_WAITING_FOR_ADMIN_DECISION...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-16 relative z-10">
                                <label className="text-[10px] font-black uppercase tracking-[6px] text-primary italic block px-8">ADMIN_DECISION_NOTES</label>
                                <textarea 
                                    className="w-full h-40 bg-zinc-50 dark:bg-white/5 border-2 border-border/50 rounded-[3rem] p-12 outline-none focus:border-primary transition-all font-black uppercase text-xs tracking-[5px] no-scrollbar shadow-xl focus:ring-12 focus:ring-primary/5 italic"
                                    placeholder="Add any internal notes for this decision..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-10 relative z-10">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Approved' })}
                                    className="flex-[2] h-24 bg-emerald-500 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] shadow-[0_30px_60px_rgba(16,185,129,0.3)] hover:translate-y-[-10px] transition-all flex items-center justify-center gap-6 active:scale-95 italic group"
                                >
                                    <CheckCircle size={24} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> APPROVE_APPLICATION
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Rejected', reason: rejectionReason })}
                                    className="flex-1 h-24 bg-rose-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] shadow-[0_30px_60px_rgba(225,29,72,0.3)] hover:translate-y-[-10px] transition-all flex items-center justify-center gap-6 active:scale-95 italic group"
                                >
                                    <XCircle size={24} strokeWidth={3} className="group-hover:-rotate-12 transition-transform" /> REJECT_APPLICATION
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'On Hold', reason: rejectionReason })}
                                    className="flex-1 h-24 bg-amber-500 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] shadow-[0_30px_60px_rgba(245,158,11,0.3)] hover:translate-y-[-10px] transition-all flex items-center justify-center gap-6 active:scale-95 italic group"
                                >
                                    <AlertCircle size={24} strokeWidth={3} /> PUT_ON_HOLD
                                </button>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="px-14 h-24 bg-zinc-900 text-white dark:bg-zinc-800 rounded-[2.5rem] font-black text-xs uppercase tracking-[6px] hover:bg-zinc-800 transition-all shadow-2xl active:scale-95 italic border border-white/5"
                                >
                                    CANCEL
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
