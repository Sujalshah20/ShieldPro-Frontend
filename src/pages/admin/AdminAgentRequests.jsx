import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    UserPlus, Search, 
    ChevronDown, Calendar, 
    Eye, Check, X,
    Mail, Phone, Briefcase, MapPin,
    Clock, ShieldCheck, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminAgentRequests = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("pending");

    const { data: applications, isLoading } = useQuery({
        queryKey: ['agentApplications', user?.token],
        queryFn: () => api.get('/admin/agent-applications', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => api.put(`/admin/agent-applications/${id}/status`, { status }, user.token),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['agentApplications']);
            queryClient.invalidateQueries(['adminAgents']); // Also refresh agents list
            toast({ 
                title: variables.status === 'approved' ? "Application Approved! 🎉" : "Application Rejected", 
                description: data.message, 
                variant: variables.status === 'approved' ? "success" : "default" 
            });
        },
        onError: (err) => {
            toast({ 
                title: "Action Failed", 
                description: err.data?.message || err.message, 
                variant: "destructive" 
            });
        }
    });

    const handleAction = (id, status) => {
        if (window.confirm(`Are you sure you want to ${status} this application?`)) {
            statusMutation.mutate({ id, status });
        }
    };

    const filteredApplications = (applications || []).filter(app => {
        const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 pb-10 max-w-[1400px] mx-auto font-sans">
            <div className="flex flex-col mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Agent Onboarding Requests</h1>
                <p className="text-sm text-slate-500">Review and manage new agent applications for the ShieldPro network.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white px-5 py-5 rounded-[12px] border border-slate-200 flex flex-wrap items-end gap-5 shadow-sm">
                <div className="flex-1 min-w-[220px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Search Applications</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Name or email..." 
                            className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg text-sm outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full sm:w-[180px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Status Filter</label>
                    <div className="relative">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="all">All Requests</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="bg-white p-20 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <Clock className="animate-spin mb-4" size={32} />
                        <p className="font-bold">Fetching matching applications...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white p-20 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <AlertCircle className="mb-4" size={32} />
                        <p className="font-bold uppercase tracking-widest text-xs">No matching applications found</p>
                    </div>
                ) : filteredApplications.map((app, index) => (
                    <Reveal key={app._id} delay={index * 0.05}>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                            <div className="flex flex-col lg:flex-row items-stretch">
                                <div className="p-6 flex-1 border-r border-slate-50">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shrink-0">
                                                <UserPlus size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 leading-tight">{app.fullName}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-rose-100 text-rose-700'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium tracking-tight">Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contact Info</span>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Mail size={14} className="text-slate-400" />
                                                    <span className="text-[13px] font-semibold truncate">{app.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Phone size={14} className="text-slate-400" />
                                                    <span className="text-[13px] font-semibold">{app.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Location</span>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin size={14} className="text-slate-400" />
                                                <span className="text-[13px] font-semibold">{app.city}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Experience</span>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Briefcase size={14} className="text-slate-400" />
                                                <span className="text-[13px] font-semibold">{app.experienceYears} Years</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Reference ID</span>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <ShieldCheck size={14} className="text-slate-400" />
                                                <span className="text-[13px] font-bold font-mono">REF-{app._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {app.message && (
                                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Cover Note</span>
                                            <p className="text-[13px] text-slate-600 font-medium italic leading-relaxed">"{app.message}"</p>
                                        </div>
                                    )}
                                </div>

                                {app.status === 'pending' && (
                                    <div className="bg-slate-50 lg:w-48 p-4 flex flex-col justify-center gap-3">
                                        <button 
                                            onClick={() => handleAction(app._id, 'approved')}
                                            disabled={statusMutation.isPending}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95 disabled:opacity-50"
                                        >
                                            <Check size={16} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(app._id, 'rejected')}
                                            disabled={statusMutation.isPending}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-rose-600 border border-rose-100 rounded-xl font-bold text-xs hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <X size={16} /> Reject By Default
                                        </button>
                                    </div>
                                )}

                                {app.status !== 'pending' && (
                                    <div className="bg-slate-50 lg:w-48 p-4 flex items-center justify-center">
                                        <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${
                                            app.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                                        }`}>
                                            {app.status === 'approved' ? <ShieldCheck size={24} /> : <X size={24} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{app.status}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
};

export default AdminAgentRequests;
