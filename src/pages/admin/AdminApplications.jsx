import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Clock, Search, 
    ClipboardList, Eye, ShieldCheck, 
    Cpu, Layers, Activity, Filter, Plus, Terminal, Fingerprint, X, Shield, Globe, Lock, AlertCircle,
    ChevronDown, RefreshCcw, ChevronRight, SearchCheck, Satellite, IndianRupee, Zap, BarChart3
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
            toast({ 
                title: "PROTOCOL_SYNCHRONIZED", 
                description: "Entity authorization state has been successfully updated.",
                variant: "default"
            });
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
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 animate-pulse" />)}
             </div>
             <div className="h-[600px] bg-slate-50 rounded-[3rem] border-2 border-slate-100 animate-pulse" />
        </div>
    );

    const stats = {
        pending: applications?.filter(a => a.status === 'Pending' || a.status === 'Under Review').length || 0,
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
            'Paid': 'bg-[#007ea7]/10 text-[#007ea7] border-[#007ea7]/20 shadow-[0_0_10px_rgba(0,126,167,0.1)]',
            'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
            'On Hold': 'bg-amber-50 text-amber-600 border-amber-100',
            'Pending': 'bg-slate-50 text-slate-400 border-slate-200'
        };
        return (
            <span className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-[4px] border shadow-xl italic ${styles[status] || styles['Pending']}`}>
                <span className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${status === 'Approved' || status === 'Paid' ? 'bg-emerald-500 animate-pulse' : status === 'Rejected' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                    {status}
                </span>
            </span>
        );
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-[#007ea7] rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-[#007ea7] italic leading-none">Authentication_Vetting_Stream</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Securitization <span className="text-[#007ea7]">Pipeline_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-[10px] italic leading-relaxed">Authorize and validate cross-border insurance procurement requests. Buffer Status: <span className="text-amber-500">{stats.pending} QUEUED</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-wrap items-center gap-6">
                        {[
                            { label: "Pending", value: stats.pending, color: "text-amber-500", bg: "bg-amber-50", icon: Clock },
                            { label: "Total_Vol", value: stats.active_sync, color: "text-[#007ea7]", bg: "bg-[#007ea7]/5", icon: Layers }
                        ].map((item, i) => (
                            <div key={i} className="bg-white px-8 py-5 rounded-2xl border-2 border-slate-50 shadow-3xl flex items-center gap-6 group hover:border-[#007ea7]/30 transition-all duration-700 min-w-[200px]">
                                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500 border border-white/5`}>
                                    <item.icon size={20} strokeWidth={3} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] mb-1 italic leading-none">{item.label}</p>
                                    <h4 className="text-3xl font-black text-[#003249] leading-none uppercase italic tracking-tighter">{item.value}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>

            {/* Registry Manifest */}
            <Reveal direction="up">
                <div className="saas-card !p-0 overflow-hidden shadow-3xl border-2 border-slate-50">
                    <div className="p-8 border-b-2 border-slate-50 bg-slate-50/20 flex flex-col xl:flex-row items-center justify-between gap-6 relative">
                         {/* Tactical Background Grid */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                        <div className="flex items-center gap-6 relative z-10 w-full xl:w-auto">
                            <div className="w-14 h-14 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                <ClipboardList size={28} strokeWidth={2.5} className="animate-pulse" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-2xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Application Registry</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] italic opacity-60">Universal node authorization log and status monitor</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto relative z-10">
                            <div className="relative group flex-1 xl:flex-none xl:min-w-[320px]">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                                <input 
                                    type="text" 
                                    placeholder="IDENTIFY_RECORD_NODE..." 
                                    className="bg-white border-2 border-slate-100 rounded-xl h-12 pl-12 pr-6 text-[10px] uppercase font-black tracking-[3px] w-full focus:outline-none focus:border-[#007ea7] focus:ring-4 focus:ring-[#007ea7]/5 shadow-inner text-[#003249] italic placeholder:text-slate-200"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20">
                                    <Satellite size={14} strokeWidth={3} />
                                </div>
                            </div>
                            <button className="h-12 px-8 bg-white border-2 border-slate-100 text-[#003249] rounded-xl text-[9px] font-black uppercase tracking-[4px] shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center gap-3 italic group">
                                <Filter size={18} className="text-[#007ea7] group-hover:rotate-180 transition-transform duration-700" strokeWidth={3} /> REFINE_FEED
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="bg-[#003249] text-white">
                                <tr className="text-[9px] font-black uppercase tracking-[4px] italic border-b border-white/5">
                                    <th className="px-8 py-5 border-r border-white/5">SUBJECT_ENTITY</th>
                                    <th className="px-8 py-5 border-r border-white/5">SECURITY_PROTOCOL</th>
                                    <th className="px-8 py-5 text-center border-r border-white/5">SYNC_LIFECYCLE</th>
                                    <th className="px-8 py-5 text-center border-r border-white/5">FLAGS</th>
                                    <th className="px-8 py-5 border-r border-white/5">OPERATOR</th>
                                    <th className="px-8 py-5 text-right">COMMAND</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 italic">
                                {filteredApps?.map((app, idx) => (
                                    <tr key={app._id} className="hover:bg-slate-50/50 transition-all duration-500 group cursor-pointer" onClick={() => setSelectedApp(app)}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] font-black text-xl shadow-3xl group-hover:rotate-6 transition-all duration-500 border-2 border-white relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                                    <span className="relative z-10">{app.user?.name.charAt(0)}</span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-base font-black text-[#003249] leading-none uppercase tracking-tighter group-hover:text-[#007ea7] transition-colors">{app.user?.name}</p>
                                                    <div className="flex items-center gap-2 opacity-40">
                                                        <Fingerprint size={12} strokeWidth={3} className="text-[#007ea7]" />
                                                        <span className="text-[9px] font-black lowercase tracking-[2px] leading-none">{app.user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-base font-black text-[#003249] uppercase tracking-tighter italic group-hover:text-[#007ea7] transition-colors leading-none">{app.policy?.policyName}</span>
                                                <span className="text-[9px] font-black opacity-20 uppercase tracking-[3px] leading-none">UPLINK://{app._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            {statusBadge(app.status)}
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex justify-center">
                                                {app.isFlagged ? (
                                                    <span className="px-5 py-2 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-[3px] border border-rose-100 shadow-xl shadow-rose-500/10 animate-pulse flex items-center gap-2">
                                                        <AlertCircle size={12} strokeWidth={4} /> CRITICAL_ESCALATION
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] opacity-30 italic flex items-center gap-2">
                                                        <ShieldCheck size={12} strokeWidth={3} /> PROTOCOL_CLEAR
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {app.agent ? (
                                                 <div className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-xl border-2 border-transparent group-hover:bg-white group-hover:border-[#007ea7]/20 transition-all shadow-sm">
                                                    <div className="w-1.5 h-8 bg-[#007ea7] rounded-full" />
                                                    <span className="text-[10px] font-black uppercase tracking-[4px] text-[#003249] italic">{app.agent.name}</span>
                                                 </div>
                                            ) : (
                                                <span className="text-[9px] font-black opacity-20 uppercase tracking-[4px] italic ml-6">DIRECT_UPLINK</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                className="h-10 px-6 bg-white border-2 border-slate-100 text-[#003249] text-[9px] font-black uppercase tracking-[4px] rounded-xl shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center justify-center gap-3 active:scale-95 italic group/btn"
                                            >
                                                ANALYSIS <Eye size={16} strokeWidth={3} className="group-hover/btn:scale-125 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {(!filteredApps || filteredApps.length === 0) && (
                         <div className="text-center py-40 flex flex-col items-center justify-center">
                             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 shadow-3xl opacity-20 hover:opacity-100 transition-opacity duration-700">
                                <Globe size={48} className="text-[#003249]" strokeWidth={3} />
                             </div>
                             <p className="text-[12px] font-black uppercase tracking-[8px] text-slate-300 italic">No records identified in current sector scan</p>
                         </div>
                    )}
                </div>
            </Reveal>

            {/* Application Detail Modal Overlay */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-[#003249]/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-6xl bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[92vh] border border-white/20"
                        >
                            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#007ea7]/10 rounded-full blur-[120px] pointer-events-none" />

                            <div className="p-10 md:p-12 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/20 relative z-10">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl relative overflow-hidden group border-2 border-white/5">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                         <Cpu size={32} strokeWidth={3} className="relative z-10 group-hover:rotate-180 transition-transform duration-1000" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] leading-none mb-1 italic">Verification Console</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic">Target_Manifest: #{selectedApp._id.slice(-12).toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedApp(null)} className="p-4 bg-slate-50 hover:bg-rose-50 rounded-2xl transition-all group active:scale-95 border-2 border-transparent hover:border-rose-100">
                                    <X size={24} className="text-slate-300 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-500" strokeWidth={4} />
                                </button>
                            </div>

                            <div className="p-10 md:p-16 overflow-y-auto no-scrollbar grid lg:grid-cols-2 gap-12 relative z-10 custom-scrollbar-v2">
                                <div className="space-y-10">
                                    <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-slate-50 shadow-inner group hover:bg-white transition-all duration-700">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-10 h-0.5 bg-[#007ea7]" />
                                            <p className="text-[10px] font-black text-[#007ea7] uppercase tracking-[6px] italic flex items-center gap-4">
                                                <Fingerprint size={16} strokeWidth={3} /> IDENTITY_MATRIX
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl group-hover:rotate-12 transition-all duration-700 border-2 border-white">
                                                <span className="text-3xl font-black uppercase italic tracking-tighter">{selectedApp.user?.name.charAt(0)}</span>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-2xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">{selectedApp.user?.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">{selectedApp.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-3xl group hover:border-[#007ea7]/30 transition-all duration-700">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-10 h-0.5 bg-[#007ea7]" />
                                            <p className="text-[10px] font-black text-[#007ea7] uppercase tracking-[6px] italic flex items-center gap-4">
                                                <Shield size={16} strokeWidth={3} /> PROTOCOL_SPECS
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-14 h-14 bg-slate-50 border-2 border-slate-100 rounded-xl flex items-center justify-center text-[#003249] shadow-inner group-hover:rotate-12 transition-all duration-700">
                                                <ShieldCheck size={24} strokeWidth={3} />
                                            </div>
                                            <p className="text-2xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">{selectedApp.policy?.policyName}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-6 bg-slate-50/50 rounded-2xl border-2 border-slate-50 shadow-inner">
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] block mb-3 italic">SETTLEMENT_CORE</span>
                                                <div className="flex items-center gap-2">
                                                    <IndianRupee size={18} className="text-[#007ea7]" strokeWidth={4} />
                                                    <span className="text-2xl font-black text-[#003249] tracking-tighter italic leading-none uppercase">₹{selectedApp.policy?.premiumAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-[#003249] rounded-2xl border border-white/5 shadow-3xl relative overflow-hidden group/cap">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none transition-transform duration-1000" />
                                                <span className="text-[9px] font-black text-[#80ced7] uppercase tracking-[4px] block mb-3 italic relative z-10">MAX_CAPACITY</span>
                                                <div className="flex items-center gap-2 relative z-10">
                                                    <Zap size={18} className="text-[#80ced7]" strokeWidth={4} />
                                                    <span className="text-2xl font-black text-white tracking-tighter italic leading-none uppercase">₹{(selectedApp.policy?.coverageAmount / 100000).toFixed(1)}L</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#003249] rounded-[3.5rem] p-10 text-white relative flex flex-col min-h-[480px] shadow-[0_50px_100px_-20px_rgba(0,50,73,0.4)] border border-white/5 overflow-hidden group/terminal">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                                    <div className="flex items-center justify-between mb-10 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <Activity size={18} className="text-[#007ea7] animate-pulse" strokeWidth={3} />
                                            <h4 className="text-[10px] font-black uppercase tracking-[6px] italic leading-none text-[#80ced7]">LOGIC_STREAM_V4.2</h4>
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-[3px] text-white/40">SECURE_SYNC</div>
                                    </div>
                                    <div className="text-[11px] font-black space-y-6 font-mono relative z-10 italic uppercase tracking-[2px] border-l-2 border-[#007ea7]/20 pl-6 ml-2">
                                        <p className="text-white/30">{">"} Checksum verification initializing...</p>
                                        <p className="text-white/30">{">"} Risk matrix scan: nominal state detected.</p>
                                        <p className="text-emerald-400 font-bold drop-shadow-[0_0_10px_#10b98150]">{">"} Integrity check: status_passed.</p>
                                        <p className="animate-pulse text-[#007ea7] font-black">{">"} Awaiting operative override_</p>
                                    </div>
                                    <div className="mt-auto pt-10 relative z-10">
                                        <label className="text-[9px] font-black uppercase tracking-[6px] text-[#007ea7] mb-4 block italic leading-none ml-2">AUTHORIZATION_PARAMETERS</label>
                                        <textarea 
                                            className="w-full h-32 bg-white/5 border-2 border-white/10 rounded-2xl p-6 outline-none focus:border-[#007ea7] focus:bg-white/10 transition-all text-sm font-black text-[#80ced7] uppercase tracking-[2px] italic shadow-inner placeholder:text-white/10"
                                            placeholder="APPEND_JUSTIFICATION..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 border-t-2 border-slate-50 flex flex-wrap gap-8 bg-slate-50/30 relative z-10">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Approved' })}
                                    className="h-20 px-10 bg-[#003249] text-[#80ced7] rounded-3xl text-[12px] font-black uppercase tracking-[8px] shadow-3xl hover:bg-[#007ea7] hover:text-white transition-all flex-[2.5] active:scale-95 flex items-center justify-center gap-6 group/btn italic"
                                >
                                    <ShieldCheck size={24} strokeWidth={3} className="group-hover/btn:rotate-12 transition-transform" /> AUTHORIZE
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Rejected', reason: rejectionReason })}
                                    className="h-20 px-10 bg-rose-600 text-white rounded-3xl text-[12px] font-black uppercase tracking-[8px] shadow-3xl hover:bg-rose-700 transition-all flex-[1.5] active:scale-95 flex items-center justify-center gap-6 group/rej italic"
                                >
                                    <AlertCircle size={24} strokeWidth={3} className="group-hover/rej:scale-110 transition-transform" /> DENY
                                </button>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="h-20 px-8 bg-white border-2 border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-[6px] text-[#003249] hover:bg-slate-100 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-4 italic"
                                >
                                    <X size={20} strokeWidth={4} /> ABORT
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-12 opacity-30 pt-10 border-t-2 border-slate-50">
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Fingerprint size={16} strokeWidth={3} className="text-[#007ea7]" /> Authorization_Vault_Verified
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <BarChart3 size={16} strokeWidth={3} className="text-[#007ea7]" /> Pipeline_Metric_Nominal
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Zap size={16} strokeWidth={3} className="text-[#007ea7]" /> Vetting_Latency: 0.4ms
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminApplications;
