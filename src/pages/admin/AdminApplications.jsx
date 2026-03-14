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

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={12} cols={6} /></div>;

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

    return (
        <div className="admin-applications p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Mission Atmosphere */}
            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]">
                <Compass size={600} className="animate-spin-slow text-primary" />
            </div>
            
            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                APPLICATION<span className="text-primary tracking-normal ml-1">_PIPELINE</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-7">
                            Global security procurement and applicant vetting interface
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-8">
                         {[
                            { label: "PENDING_AUTH", value: stats.pending, color: "text-amber-500", bg: "bg-amber-50", icon: Activity, tag: "AWAITING" },
                            { label: "FLAGGED_NODES", value: stats.flagged, color: "text-rose-500", bg: "bg-rose-50", icon: AlertCircle, tag: "CRITICAL" },
                            { label: "TOTAL_FLUX", value: stats.active_sync, color: "text-primary", bg: "bg-primary/5", icon: Globe, tag: "ALL" }
                         ].map((item, i) => (
                             <div key={i} className="px-10 py-8 bg-white rounded-[2rem] border border-slate-200 shadow-xl flex flex-col items-center min-w-[200px] group hover:border-primary/50 transition-all relative overflow-hidden">
                                <div className={`absolute -right-6 -top-6 w-24 h-24 ${item.bg} rounded-full blur-2xl opacity-40 group-hover:scale-150 transition-transform duration-700`} />
                                <div className="flex justify-between items-center w-full mb-6 relative z-10">
                                    <item.icon size={20} className={item.color} strokeWidth={2.5} />
                                    <span className="text-[8px] font-black uppercase tracking-[2px] px-2 py-0.5 rounded bg-slate-100 text-slate-400">{item.tag}</span>
                                </div>
                                <span className={`text-4xl font-black ${item.color} tracking-tighter uppercase relative z-10 leading-none mb-3`}>
                                    {item.value < 10 ? `0${item.value}` : item.value}
                                </span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] relative z-10">
                                    {item.label}
                                </span>
                             </div>
                         ))}
                    </div>
                </div>
            </Reveal>

            {/* COMMAND CONSOLE */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16">
                 <div className="relative group w-full lg:w-[600px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="IDENTIFY_AGENT_OR_CLIENT_RECORDS..." 
                        className="pl-16 pr-8 h-18 py-6 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full transition-all font-bold text-[10px] uppercase tracking-[4px] text-header-bg shadow-xl" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>

                <div className="flex items-center gap-6 bg-white px-10 py-5 rounded-2xl border border-slate-200 shadow-xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">UPLINK_STATUS:</span>
                    <div className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[9px] font-black uppercase tracking-[3px] flex items-center gap-4">
                         <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" />
                         SYNCHRONIZED_OK
                    </div>
                </div>
            </div>

            {/* PIPELINE REGISTRY */}
            <Reveal width="100%" direction="up" delay={0.4}>
                <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl mb-16">
                    <div className="px-12 py-10 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-12 bg-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 right-[-10%] opacity-[0.03] pointer-events-none">
                            <Layers size={180} className="text-header-bg rotate-12" />
                        </div>
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-16 h-16 bg-header-bg rounded-2xl flex items-center justify-center text-white shadow-xl shadow-header-bg/20 border border-white/10">
                                <ClipboardList size={32} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">APPLICATION_REGISTRY</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-3">Live feed of global insurance procurement requests</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-12 relative z-10">
                             <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">PENDING_CLEARANCE</span>
                                <span className="text-3xl font-black text-amber-500 uppercase tracking-tight leading-none mt-1">{stats.pending}</span>
                             </div>
                             <div className="w-px h-12 bg-slate-200" />
                             <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">TOTAL_RECORDS</span>
                                <span className="text-3xl font-black text-primary uppercase tracking-tight leading-none mt-1">{stats.active_sync}</span>
                             </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left font-bold text-[10px] uppercase tracking-widest text-slate-500">
                            <thead>
                                <tr className="bg-slate-50/50 text-[9px] text-slate-400 border-b border-slate-100">
                                    <th className="px-12 py-10 tracking-[5px]">CLIENT_IDENTITY</th>
                                    <th className="px-12 py-10 tracking-[5px]">SECURITY_PROTOCOL</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">SYNC_STATUS</th>
                                    <th className="px-12 py-10 text-center tracking-[5px]">THREAT_LEVEL</th>
                                    <th className="px-12 py-10 tracking-[5px]">ASSIGNED_OPERATOR</th>
                                    <th className="px-12 py-10 text-right tracking-[5px]">PROTOCOL_ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredApps?.map((app, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, x: -15 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        transition={{ delay: idx * 0.05 }}
                                        key={app._id} 
                                        className={`hover:bg-slate-50/50 transition-all group cursor-pointer ${app.isFlagged ? 'bg-rose-50/20' : ''}`}
                                    >
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-8">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500" />
                                                    <div className="relative w-20 h-20 bg-header-bg rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all overflow-hidden shadow-lg">
                                                        <User size={28} strokeWidth={3} className="text-white brightness-75 group-hover:brightness-100 transition-all" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black tracking-tight text-header-bg group-hover:text-primary transition-colors leading-none mb-3 uppercase">{app.user?.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 tracking-[3px] flex items-center gap-3 lowercase">
                                                        <Mail size={12} className="text-primary/60" /> {app.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-primary border border-slate-100 shadow-sm transition-transform group-hover:rotate-12">
                                                    <Shield size={22} strokeWidth={3} />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-black text-sm text-header-bg leading-none uppercase">{app.policy?.policyName}</span>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">ID: {app._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex justify-center">
                                                <div className={`px-6 py-2.5 rounded-full text-[9px] font-black tracking-[4px] flex items-center gap-4 border shadow-sm ${
                                                    app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    app.status === 'Paid' ? 'bg-primary/5 text-primary border-primary/20' :
                                                    app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    app.status === 'On Hold' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                                }`}>
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        app.status === 'Approved' || app.status === 'Paid' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 
                                                        app.status === 'Rejected' ? 'bg-rose-500 shadow-lg shadow-rose-500/40' : 
                                                        app.status === 'On Hold' ? 'bg-amber-500' : 'bg-amber-500 shadow-lg shadow-amber-500/40'
                                                    }`} />
                                                    {app.status.toUpperCase()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex justify-center">
                                                {app.isFlagged ? (
                                                    <div className="flex items-center gap-4 text-rose-600 text-[10px] font-black tracking-[4px] bg-rose-50 px-6 py-2.5 rounded-full border border-rose-100 animate-pulse uppercase">
                                                        <AlertCircle size={16} strokeWidth={3} /> CRITICAL
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3 opacity-20">
                                                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                        <span className="text-[9px] font-black uppercase tracking-[4px]">SECURE</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            {app.agent ? (
                                                 <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-header-bg rounded-xl border border-white/5 flex items-center justify-center text-primary shadow-xl">
                                                        <span className="text-xl font-black italic">{app.agent.name.charAt(0)}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="text-sm font-black text-header-bg leading-none uppercase">{app.agent.name}</span>
                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">VERIFIED_NODE</span>
                                                    </div>
                                                 </div>
                                            ) : (
                                                <div className="flex items-center gap-5 bg-slate-50 px-6 py-2.5 rounded-2xl border border-slate-100 w-fit">
                                                    <Zap size={14} className="text-primary/40" strokeWidth={3} />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[3px]">DIRECT_NODE</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            <button 
                                                onClick={() => setSelectedApp(app)}
                                                className="h-12 px-8 bg-white border border-slate-200 text-header-bg rounded-xl text-[10px] font-black uppercase tracking-[4px] shadow-sm hover:bg-header-bg hover:text-white hover:border-header-bg transition-all active:scale-95 flex items-center gap-4 float-right group/eye"
                                            >
                                                REVIEW_ASSET <Eye size={18} strokeWidth={3} className="group-hover/eye:scale-125 transition-transform" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>

            {/* REVIEW MODAL CONSOLE */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-header-bg/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-6xl bg-white p-16 md:p-24 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]">
                                {selectedApp.isFlagged ? (
                                    <AlertCircle size={500} className="text-rose-600 animate-pulse" />
                                ) : (
                                    <ShieldCheck size={500} className="text-primary rotate-12" />
                                )}
                            </div>
                            
                            <div className="flex flex-col lg:flex-row justify-between items-start mb-20 relative z-10 gap-12">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-8 mb-2">
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl shadow-header-bg/20 border border-white/10 ${selectedApp.isFlagged ? 'bg-rose-600 text-white' : 'bg-primary text-white'}`}>
                                            <ClipboardList size={36} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h3 className="text-5xl font-black uppercase tracking-tighter text-header-bg leading-none">PROTOCOL<span className="text-primary tracking-normal ml-3">_ANALYSIS</span></h3>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[8px] mt-4 ml-1">REF: {selectedApp._id.toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`px-12 py-6 rounded-[2rem] flex items-center gap-8 border-2 transition-all duration-[1000ms] ${
                                    selectedApp.isFlagged 
                                    ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-2xl shadow-rose-500/10' 
                                    : 'bg-primary/5 text-primary border-primary/10 shadow-2xl shadow-primary/10'
                                }`}>
                                    {selectedApp.isFlagged ? <AlertCircle size={36} strokeWidth={3} className="animate-pulse" /> : <ShieldCheck size={36} strokeWidth={3} />}
                                    <div className="flex flex-col gap-1">
                                        <span className="font-black text-[10px] uppercase tracking-[4px] leading-tight opacity-40">THREAT_LEVEL</span>
                                        <span className="font-black text-2xl uppercase tracking-tighter leading-none">{selectedApp.isFlagged ? 'CRITICAL_VETTING' : 'STANDARD_CLEARANCE'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20 relative z-10">
                                <div className="space-y-12">
                                    <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner group hover:border-primary/40 transition-all relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <User size={80} className="text-header-bg" />
                                        </div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[6px] mb-10">ENTITY_PROFILE</p>
                                        <div className="flex items-center gap-10">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-primary/30 blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-700" />
                                                <div className="relative w-28 h-28 bg-header-bg rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl border border-white/10 shadow-2xl shadow-header-bg/30">
                                                    {selectedApp.user?.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p className="font-black text-4xl uppercase tracking-tighter text-header-bg leading-none mb-1">{selectedApp.user?.name}</p>
                                                <div className="flex items-center gap-5 px-6 py-2.5 bg-header-bg text-white rounded-full border border-white/10 w-fit">
                                                    <Fingerprint size={16} className="text-primary" strokeWidth={3} />
                                                    <p className="text-[10px] font-black text-white/60 tracking-[4px] uppercase">IDENTITY_LOCKED</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-10 pt-8 border-t border-slate-200 flex items-center gap-5 text-sm font-bold text-slate-400 uppercase tracking-[4px]">
                                            <Mail size={18} className="text-primary" /> {selectedApp.user?.email}
                                        </div>
                                    </div>
                                    
                                    <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner group hover:border-primary/40 transition-all relative overflow-hidden">
                                        <div className="absolute top-0 right-[-10%] opacity-5">
                                            <Command size={100} className="text-header-bg" />
                                        </div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[6px] mb-10">SYSTEM_PRODUCT</p>
                                        <div className="flex items-center gap-8 mb-12">
                                            <div className="w-20 h-20 bg-header-bg rounded-2xl flex items-center justify-center text-primary shadow-xl border border-white/10">
                                                <ShieldCheck size={36} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <p className="text-4xl font-black uppercase tracking-tighter text-header-bg leading-none mb-2">{selectedApp.policy?.policyName}</p>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[4px]">PROTECTION_SCHEME</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl relative z-10">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">PREMIUM_COST</span>
                                                <span className="text-4xl font-black text-primary uppercase tracking-tight leading-none">₹{selectedApp.policy?.premiumAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="h-16 w-px bg-slate-100" />
                                            <div className="flex flex-col gap-2 items-end">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">COVERAGE_CAP</span>
                                                <span className="text-4xl font-black text-header-bg uppercase tracking-tight leading-none">₹{(selectedApp.policy?.coverageAmount / 100000).toFixed(1)}L</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-12">
                                    <div className="h-full p-12 bg-header-bg text-white rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden group/intel">
                                        <div className="absolute top-[-20%] right-[-20%] opacity-10 blur-[80px]">
                                            <div className="w-[400px] h-[400px] bg-primary rounded-full animate-pulse-slow" />
                                        </div>
                                        <div className="flex items-center gap-8 mb-16 relative z-10">
                                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-primary shadow-2xl border border-white/10">
                                                <Cpu size={36} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[6px]">SYSTEM_INTELLIGENCE</p>
                                                <p className="text-3xl font-black uppercase tracking-tighter leading-none mt-2">PROCESS_LOGS</p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-sm font-bold text-white/50 tracking-[4px] uppercase h-[340px] overflow-y-auto no-scrollbar border-l-4 border-primary/30 pl-12 space-y-10 relative z-10">
                                            {selectedApp.internalRemarks ? (
                                                <p className="leading-relaxed whitespace-pre-line">{selectedApp.internalRemarks}</p>
                                            ) : (
                                                <div className="space-y-10">
                                                    <div className="flex gap-6 items-start">
                                                        <span className="text-primary font-black">[01]</span>
                                                        <p>ANALYKE_CORE_DATA: IDENTIFIED CUSTOMER NODE "{selectedApp.user?.name}"</p>
                                                    </div>
                                                    <div className="flex gap-6 items-start">
                                                        <span className="text-primary font-black">[02]</span>
                                                        <p>CHECK_ELIGIBILITY: VERIFIED {selectedApp.policy?.policyType} COMPLIANCE.</p>
                                                    </div>
                                                    <div className="flex gap-6 items-start">
                                                        <span className="text-primary font-black">[03]</span>
                                                        <p>THREAT_SCAN: ZERO VULNERABILITIES DETECTED IN HISTORICAL LOGS.</p>
                                                    </div>
                                                    <div className="flex gap-6 items-start animate-pulse">
                                                        <span className="text-primary font-black">[>>]</span>
                                                        <p>AWAITING_ADMINISTRATOR_PROTOCOL_CLEARANCE...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-20 relative z-10">
                                <div className="flex items-center justify-between px-10 mb-4">
                                    <label className="text-[10px] font-black uppercase tracking-[8px] text-primary">DECISION_LOG_REMARKS</label>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[4px]">INTERNAL_ONLY_DOCS</span>
                                </div>
                                <textarea 
                                    className="w-full h-44 bg-slate-50 border border-slate-200 rounded-[3rem] p-12 outline-none focus:border-primary focus:bg-white transition-all font-bold uppercase text-xs tracking-[5px] no-scrollbar shadow-xl focus:ring-12 focus:ring-primary/5 text-header-bg leading-relaxed"
                                    placeholder="Enter authorization justification or rejection parameters..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-10 relative z-10">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Approved' })}
                                    className="flex-[2] h-28 bg-emerald-500 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[8px] shadow-2xl shadow-emerald-500/30 hover:translate-y-[-12px] hover:bg-emerald-600 transition-all flex items-center justify-center gap-10 active:scale-95 group"
                                >
                                    <CheckCircle size={28} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> AUTHORIZE_APPLICATION
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Rejected', reason: rejectionReason })}
                                    className="flex-1 h-28 bg-header-bg text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[8px] shadow-2xl shadow-header-bg/20 hover:translate-y-[-12px] hover:bg-rose-600 transition-all flex items-center justify-center gap-10 active:scale-95 group border border-white/5"
                                >
                                    <XCircle size={28} strokeWidth={3} className="group-hover:-rotate-12 transition-transform" /> DENY_PROTOCOL
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'On Hold', reason: rejectionReason })}
                                    className="flex-1 h-28 bg-white border-2 border-slate-200 text-amber-600 rounded-[2.5rem] font-black text-xs uppercase tracking-[8px] shadow-xl hover:translate-y-[-10px] transition-all flex items-center justify-center gap-10 active:scale-95 group"
                                >
                                    <Clock size={28} strokeWidth={3} /> SUSPEND
                                </button>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="px-16 h-28 bg-slate-100 text-slate-400 rounded-[2.5rem] font-black text-xs uppercase tracking-[8px] hover:text-header-bg transition-all active:scale-95"
                                >
                                    ABORT
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
