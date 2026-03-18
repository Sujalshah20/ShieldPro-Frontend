import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Clock, Search, ClipboardList, Eye, 
    Filter, X, Shield, CheckCircle2, 
    FileText, ChevronRight, Zap, 
    MoreHorizontal, Check, AlertCircle
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
            toast({ title: "Application status updated successfully" });
            setSelectedApp(null);
        },
        onError: () => toast({ title: "Failed to update status", variant: "destructive" })
    });

    const filteredApps = applications?.filter(app => 
        app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.policy?.policyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vetting Center</h1>
                        <p className="text-sm font-medium text-slate-400">Review and authorize incoming policy applications</p>
                    </div>
                </Reveal>
                
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">In Queue</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter">{filteredApps?.length || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                        <ClipboardList size={24} />
                    </div>
                </div>
            </div>

            {/* Tactical Search Module */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Client or Policy..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="h-12 px-5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                    <Filter size={18} /> Filter Status
                </button>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">ID</th>
                                <th className="px-8 py-6">Client</th>
                                <th className="px-8 py-6">Policy</th>
                                <th className="px-8 py-6">Premium</th>
                                <th className="px-8 py-6 text-center">Lifecycle</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-8 py-20 text-center"><TableSkeleton /></td></tr>
                            ) : filteredApps?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100">
                                            <Zap size={32} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">No applications found in the current queue</p>
                                    </td>
                                </tr>
                            ) : filteredApps.map((app) => (
                                <tr key={app._id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                                    <td className="px-8 py-7 text-xs font-bold text-slate-400 uppercase tracking-tight">
                                        #{app._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase text-xs">
                                                {app.user?.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-slate-700">{app.user?.name}</span>
                                                <span className="text-[10px] font-medium text-slate-400">{app.user?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <Shield size={14} className="text-blue-500" />
                                            {app.policy?.policyName}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="text-sm font-black text-slate-800 tracking-tight">
                                            ₹{app.amount?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-7 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusStyle(app.status)}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{app.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <button className="p-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Detail Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800 border border-slate-100">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800 tracking-tight text-nowrap">Application Details</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">ID: #{selectedApp._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Client Information</label>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                            <div className="scale-125 ml-2">
                                                 <div className="w-8 h-8 rounded-full border border-slate-200 shadow-sm bg-white flex items-center justify-center font-bold text-slate-500 uppercase text-[10px]">
                                                    {selectedApp.user?.name?.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{selectedApp.user?.name}</span>
                                                <span className="text-[10px] font-medium text-slate-400">{selectedApp.user?.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Policy Selected</label>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                                <Shield size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{selectedApp.policy?.policyName}</span>
                                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{selectedApp.policy?.policyType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-[#1a2332] rounded-[1.5rem] flex items-center justify-between text-white">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Calculated Premium</p>
                                        <h3 className="text-3xl font-black tracking-tight">₹{selectedApp.amount?.toLocaleString()}</h3>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 ${selectedApp.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-300'}`}>
                                        {selectedApp.status}
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 bg-slate-50 border-t border-slate-100 mt-auto flex gap-4">
                                {selectedApp.status === 'Pending' ? (
                                    <>
                                        <button 
                                            onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Approved' })}
                                            disabled={statusMutation.isPending}
                                            className="flex-1 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                        >
                                            <Check size={18} /> Approve Policy
                                        </button>
                                        <button 
                                            onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Rejected' })}
                                            disabled={statusMutation.isPending}
                                            className="px-8 h-14 border border-rose-200 text-rose-600 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <X size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl opacity-60">
                                        <CheckCircle2 size={18} className="text-slate-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 italic">Review Completed</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminApplications;
ns;
