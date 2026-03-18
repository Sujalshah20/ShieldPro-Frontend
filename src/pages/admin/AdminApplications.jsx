import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Clock, Search, 
    ClipboardList, Eye, ShieldCheck, 
    Cpu, Layers, Activity, Filter, Plus, Terminal, Fingerprint, X, Shield, Globe, Lock, AlertCircle,
    ChevronDown, RefreshCcw, ChevronRight, SearchCheck, Satellite, IndianRupee, Zap, BarChart3,
    MoreHorizontal, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminApplications = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: applications, isLoading } = useQuery({
        queryKey: ['adminApplications', user?.token],
        queryFn: () => api.get('/applications', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/applications/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminApplications']);
            toast({ title: "Application state synchronized" });
            setSelectedApp(null);
        },
        onError: () => toast({ title: "Signal transmission failed", variant: "destructive" })
    });

    const filteredApps = applications?.filter(app => 
        app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.policy?.policyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Application_Hub</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">
                            Vetting <span className="text-[#007ea7]">Center_</span>
                        </h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">
                            Screening and authorizing insurance requests across global grid sectors.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-4">
                        <div className="h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center gap-6 shadow-inner">
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Active_Queue</span>
                                <span className="text-xl font-black text-[#003249] italic">{filteredApps?.length || 0}</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="w-3 h-3 bg-[#80ced7] rounded-full animate-ping" />
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Filter Module */}
            <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-3xl flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" size={20} strokeWidth={3} />
                    <input 
                        type="text" 
                        placeholder="IDENTIFY BY CLIENT OR POLICY..." 
                        className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-[3px] text-[#003249] focus:bg-white focus:border-[#007ea7] transition-all outline-none italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="h-14 px-10 flex items-center gap-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-[#003249] hover:bg-slate-50 transition-all w-full md:w-auto italic group">
                    <Filter size={18} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-500" /> Filter_State
                </button>
            </div>

            {/* Main Ledger */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-4xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
                
                <div className="overflow-x-auto text-sm relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[4px] italic">
                                <th className="px-10 py-10">COMMAND_ID</th>
                                <th className="px-10 py-10">ENTITY_(ORIGIN)</th>
                                <th className="px-10 py-10">ASSET_CLASS</th>
                                <th className="px-10 py-10">MAGNITUDE</th>
                                <th className="px-10 py-10 text-center">LIFECYCLE</th>
                                <th className="px-10 py-10 text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 italic">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-20">
                                        <TableSkeleton rows={5} />
                                    </td>
                                </tr>
                            ) : filteredApps?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center">
                                        <div className="space-y-4 opacity-30">
                                            <Satellite size={60} className="mx-auto text-[#003249] animate-pulse" />
                                            <p className="text-[12px] font-black uppercase tracking-[8px]">No_Inbound_Signals_Identified</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => (
                                    <tr key={app._id} className="group hover:bg-slate-50/70 transition-all duration-500 cursor-pointer">
                                        <td className="px-10 py-8" onClick={() => setSelectedApp(app)}>
                                            <span className="text-base font-black text-[#007ea7] tracking-tighter uppercase group-hover:translate-x-2 transition-transform inline-block font-mono">#{app._id.slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-10 py-8" onClick={() => setSelectedApp(app)}>
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-[#003249] flex items-center justify-center text-[#007ea7] font-black text-lg border border-white/5 shadow-2xl group-hover:rotate-12 transition-transform">
                                                    {app.user?.name?.charAt(0)}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-lg font-black text-[#003249] tracking-tighter leading-none">{app.user?.name}</span>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{app.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8" onClick={() => setSelectedApp(app)}>
                                            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border-2 border-slate-50 w-fit group-hover:border-[#80ced7]/30 transition-all">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#007ea7] shadow-[0_0_10px_#007ea7]" />
                                                <span className="text-[10px] font-black text-[#003249] uppercase tracking-[3px]">{app.policy?.policyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8" onClick={() => setSelectedApp(app)}>
                                            <span className="text-xl font-black text-[#003249] tracking-tighter">₹{app.amount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-10 py-8 text-center" onClick={() => setSelectedApp(app)}>
                                            <div className="flex justify-center">
                                                <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[4px] border-2 shadow-lg italic ${getStatusStyle(app.status)}`}>
                                                    {app.status === 'Approved' ? 'Synchronized' : app.status === 'Pending' ? 'In Vetting' : 'Rejected'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button 
                                                onClick={() => setSelectedApp(app)}
                                                className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-[#007ea7] hover:bg-white rounded-2xl transition-all border-2 border-transparent hover:border-[#007ea7]/20 shadow-sm"
                                            >
                                                <ChevronRight size={24} strokeWidth={3} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Sync Line */}
                <div className="p-10 border-t border-slate-50 bg-slate-50/20 flex flex-wrap justify-center gap-12 text-[10px] font-black text-[#003249] uppercase tracking-[5px] opacity-30">
                    <div className="flex items-center gap-3">
                        <Zap size={18} className="text-[#007ea7]" strokeWidth={3} /> Grid_Frequency: 60Hz
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={18} className="text-[#007ea7]" strokeWidth={3} /> Protocol_Encrypted
                    </div>
                    <div className="flex items-center gap-3">
                        <Fingerprint size={18} className="text-[#007ea7]" strokeWidth={3} /> Authorization_Logs: Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic">
                        <Zap size={16} strokeWidth={3} className="text-[#007ea7]" /> Vetting_Latency: 0.4ms
                    </div>
                </div>
            </div>

            {/* Application Detail Modal Overlay */}
            <AnimatePresence>
                {selectedApp && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-xl bg-[#003249]/20"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-5xl border-2 border-white/20 flex flex-col"
                        >
                            <div className="p-12 md:p-16 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm">
                                <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 rounded-3xl bg-[#003249] flex items-center justify-center text-[#80ced7] border border-white/10 shadow-3xl">
                                        <ClipboardList size={40} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic">Vetting_Request</h2>
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[6px] italic">ID: #{selectedApp._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#003249] hover:bg-rose-50 hover:text-rose-500 transition-all shadow-xl"
                                >
                                    <X size={24} strokeWidth={4} />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-12 md:p-16 space-y-12">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] italic">Entity_Detail</h4>
                                            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-50 shadow-inner space-y-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#003249] font-black text-lg shadow-sm border border-slate-100">
                                                        {selectedApp.user?.name?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xl font-black text-[#003249] tracking-tighter leading-none italic">{selectedApp.user?.name}</span>
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{selectedApp.user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] italic">Asset_Specification</h4>
                                            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-50 shadow-inner flex items-center gap-6 italic">
                                                <div className="w-12 h-12 bg-[#80ced7] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
                                                    <ShieldCheck size={28} strokeWidth={2.5}/>
                                                </div>
                                                <div>
                                                    <p className="text-xl font-black text-[#003249] tracking-tighter leading-none">{selectedApp.policy?.policyName}</p>
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1 italic">Type: {selectedApp.policy?.policyType}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] italic">Fiscal_Manifest</h4>
                                            <div className="p-8 bg-[#003249] rounded-[2rem] border border-white/5 shadow-3xl space-y-2 italic">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] opacity-40">CALCULATED_PREMIUM</span>
                                                <h3 className="text-5xl font-black text-[#80ced7] tracking-tighter">₹{selectedApp.amount?.toLocaleString()}</h3>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] italic">Transmission_Metadata</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-50 space-y-2">
                                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">TIMESTAMP</span>
                                                    <p className="text-xs font-black text-[#003249] italic">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-50 space-y-2">
                                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">STATUS</span>
                                                    <p className="text-xs font-black text-[#003249] italic">{selectedApp.status.toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 md:p-16 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row gap-6">
                                {selectedApp.status === 'Pending' ? (
                                    <>
                                        <button 
                                            onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Approved' })}
                                            disabled={statusMutation.isPending}
                                            className="flex-1 h-20 bg-[#003249] text-[#80ced7] rounded-[1.5rem] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[6px] hover:bg-[#007ea7] hover:text-white transition-all shadow-4xl active:scale-95 italic group disabled:opacity-50"
                                        >
                                            <CheckCircle2 size={24} strokeWidth={3} /> AUTHORIZE_SYNC
                                        </button>
                                        <button 
                                            onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Rejected' })}
                                            disabled={statusMutation.isPending}
                                            className="px-12 h-20 bg-rose-50 text-rose-600 border-2 border-rose-100 rounded-[1.5rem] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[6px] hover:bg-rose-100 transition-all active:scale-95 italic disabled:opacity-50"
                                        >
                                            REJECT_SIGNAL
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-20 flex items-center justify-center gap-4 bg-white border-2 border-slate-50 rounded-3xl opacity-60">
                                        <div className={`w-3 h-3 rounded-full ${selectedApp.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                        <span className="text-sm font-black uppercase tracking-[8px] text-[#003249] italic">Lifecycle_Finalized</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminApplications;
