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
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState("All");

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading } = useQuery({
        queryKey: ['adminApplications', user?.token, debouncedSearch, activeFilter, currentPage],
        queryFn: () => api.get(`/applications?search=${debouncedSearch}&status=${activeFilter}&page=${currentPage}&limit=10`, user.token),
        enabled: !!user?.token
    });

    const applications = data?.applications || [];
    const totalPages = data?.pages || 1;
    const totalCount = data?.total || 0;

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/applications/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminApplications']);
            toast({ title: "Application status updated successfully" });
            setSelectedApp(null);
        },
        onError: () => toast({ title: "Failed to update status", variant: "destructive" })
    });

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
                        <h1 className="text-2xl font-black text-black tracking-tight uppercase italic">Vetting Center</h1>
                        <p className="text-[10px] font-black text-black/40 uppercase tracking-[2px] italic">Review and authorize incoming policy applications</p>
                    </div>
                </Reveal>
                
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black text-black/20 uppercase tracking-widest leading-none italic">In Queue</p>
                        <p className="text-2xl font-black text-black tracking-tighter italic">{totalCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white shadow-3xl border border-white/5">
                        <ClipboardList size={24} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Tactical Search Module */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="IDENTIFY_CLIENT_OR_PLAN..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase tracking-[3px] focus:border-black/10 focus:ring-8 focus:ring-black/5 outline-none transition-all shadow-inner placeholder:text-black/10 italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {["All", "Pending", "Approved", "Rejected", "On Hold"].map((status) => (
                        <button 
                            key={status}
                            onClick={() => { setActiveFilter(status); setCurrentPage(1); }}
                            className={`h-12 px-5 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all italic border ${
                                activeFilter === status 
                                ? "bg-black text-white border-black shadow-xl" 
                                : "bg-white text-black border-slate-100 hover:bg-slate-50"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-black/20 uppercase tracking-[4px] border-b border-slate-50 italic">
                                <th className="px-6 py-4">OPERATIONAL_ID</th>
                                <th className="px-6 py-4">ENTITY_IDENTITY</th>
                                <th className="px-6 py-4">ASSET_SCHEME</th>
                                <th className="px-6 py-4">FISC_PREMIUM</th>
                                <th className="px-6 py-4 text-center">LIFECYCLE_STATUS</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-8 py-20 text-center"><TableSkeleton /></td></tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100">
                                            <Zap size={32} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">No applications found in the current queue</p>
                                    </td>
                                </tr>
                            ) : applications.map((app) => (
                                <tr key={app._id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                                    <td className="px-6 py-5 text-[10px] font-black text-black/20 uppercase tracking-widest italic">
                                        #{app._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4 group/entity">
                                            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-3xl bg-slate-50 flex items-center justify-center font-black text-black/20 uppercase text-[12px] group-hover:rotate-6 transition-transform italic">
                                                {app.user?.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-black text-black tracking-tighter uppercase italic">{app.user?.name}</span>
                                                <span className="text-[9px] font-black text-black/30 uppercase tracking-widest italic">{app.user?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3 text-[11px] font-black text-black uppercase tracking-[2px] italic">
                                            <Shield size={14} className="text-black/40" strokeWidth={3} />
                                            {app.policy?.policyName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[14px] font-black text-black tracking-tighter uppercase italic">
                                            ₹{app.policy?.premiumAmount?.toLocaleString() || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-xl italic ${getStatusStyle(app.status)}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{app.status.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-black/10 group-hover:text-black transition-colors">
                                            <ChevronRight size={20} strokeWidth={3} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-10 py-8 bg-slate-50/20 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <span className="text-[10px] font-black text-black/30 uppercase tracking-[3px] italic">Displaying {applications.length} of {totalCount} entries</span>
                    <div className="flex items-center gap-3">
                        <button 
                            disabled={currentPage === 1}
                            onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                            className="h-11 px-5 border-2 border-slate-100 rounded-xl text-[11px] font-black text-black opacity-30 hover:opacity-100 disabled:opacity-10 hover:bg-white hover:text-blue-600 transition-all italic uppercase tracking-widest"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i} 
                                onClick={(e) => { e.stopPropagation(); setCurrentPage(i + 1); }}
                                className={`w-11 h-11 flex items-center justify-center rounded-xl text-[11px] font-black transition-all italic ${
                                currentPage === i + 1 ? "bg-black text-white shadow-lg" : "text-black opacity-20 hover:opacity-100 hover:bg-white"
                            }`}>
                                {i + 1}
                            </button>
                        ))}
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                            className="h-11 px-6 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 disabled:opacity-10 transition-all italic active:scale-95"
                        >
                            Next Cluster
                        </button>
                    </div>
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
                            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-3xl">
                                        <FileText size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-black tracking-tight text-nowrap uppercase italic">Application Details</h2>
                                        <p className="text-[10px] font-black text-black/30 uppercase tracking-[4px] leading-none italic">ID: #{selectedApp._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-black/20 hover:text-black hover:bg-slate-100 transition-all border border-slate-100 italic"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-black/20 uppercase tracking-[6px] block ml-1 italic">CLIENT_ENTITY</label>
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-50 flex items-center gap-5 shadow-inner">
                                            <div className="scale-110">
                                                 <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-3xl bg-black flex items-center justify-center font-black text-white uppercase text-[12px] italic">
                                                    {selectedApp.user?.name?.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-black text-black tracking-tighter uppercase italic">{selectedApp.user?.name}</span>
                                                <span className="text-[10px] font-black text-black/30 uppercase tracking-widest italic">{selectedApp.user?.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-black/20 uppercase tracking-[6px] block ml-1 italic">ASSET_PLAN</label>
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-50 flex items-center gap-5 shadow-inner">
                                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-3xl border border-white/5">
                                                <Shield size={22} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-black text-black tracking-tighter uppercase italic">{selectedApp.policy?.policyName}</span>
                                                <span className="text-[10px] font-black text-black/30 uppercase tracking-widest italic">{selectedApp.policy?.policyType?.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-black rounded-[2.5rem] flex items-center justify-between text-white shadow-3xl border-2 border-white/5 relative overflow-hidden italic">
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[4px] leading-none mb-3 italic">FISCAL_PREMIUM</p>
                                        <h3 className="text-4xl font-black tracking-tighter">₹{selectedApp.policy?.premiumAmount?.toLocaleString() || 0}</h3>
                                    </div>
                                    <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[4px] border border-white/20 shadow-xl ${selectedApp.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
                                        {selectedApp.status.toUpperCase()}
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
