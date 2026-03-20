import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
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
    Satellite, RefreshCcw, SearchCheck,
    Eye, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AgentApplications = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatusTab, setActiveStatusTab] = useState('All');
    const [checklist, setChecklist] = useState({
        aadhar: false,
        pan: false,
        photo: false,
        income: false
    });
    const [agentNotes, setAgentNotes] = useState("");

    const updateAppMutation = useMutation({
        mutationFn: ({ appId, status }) =>
            api.put(`/applications/${appId}/status`, { status }, user.token),
        onSuccess: (_, variables) => {
            toast({
                title: `Application ${variables.status}`,
                description: `Application has been ${variables.status.toLowerCase()} successfully.`,
            });
            queryClient.invalidateQueries(['agentApps']);
            queryClient.invalidateQueries(['recentApplications']);
            setSelectedApp(null);
            setAgentNotes("");
            setChecklist({ aadhar: false, pan: false, photo: false, income: false });
        },
        onError: (err) => {
            toast({ title: "Action failed", description: err.message, variant: "destructive" });
        }
    });

    const handleAppStatus = (status) => {
        if (!selectedApp) return;
        updateAppMutation.mutate({ appId: selectedApp._id, status });
    };

    const { data: applications, isLoading } = useQuery({
        queryKey: ['agentApps', user?.token],
        queryFn: () => api.get('/agent/applications', user.token),
        enabled: !!user?.token
    });

    const statusTabs = ['All Applications', 'Pending Review', 'Documents Verified', 'Approved', 'Rejected'];

    const filteredApplications = applications?.filter(app => {
        const matchesSearch = app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeStatusTab === 'All Applications' || 
                          app.status === activeStatusTab || 
                          (activeStatusTab === 'Pending Review' && app.status === 'Pending');
        return matchesSearch && matchesTab;
    });

    if (isLoading) return (
        <div className="py-20 px-8">
             <div className="h-12 w-64 bg-slate-200 animate-pulse rounded-xl mb-12" />
             <div className="h-[600px] bg-white rounded-3xl border border-slate-200 animate-pulse" />
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 py-6 min-h-screen relative overflow-hidden">
            {/* Left Content: Applications List */}
            <div className={`flex-1 flex flex-col gap-6 transition-all duration-500 pb-10 ${selectedApp ? 'lg:mr-[420px]' : ''}`}>
                <div>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <Link to="/agent" className="hover:text-slate-600 transition-colors">Dashboard</Link>
                        <ChevronRight size={12} />
                        <span className="text-slate-600">Policy Applications</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#1e293b]">Policy Applications</h1>
                    <p className="text-[13px] font-medium text-slate-400 mt-1">Review and manage insurance applications assigned to you.</p>
                </div>

                {/* Tab Navigation & Search */}
                <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-1 w-full md:w-auto">
                        {statusTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveStatusTab(tab)}
                                className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${
                                    activeStatusTab === tab 
                                    ? 'bg-[#1e293b] text-white shadow-md' 
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search applications..." 
                            className="w-full pl-9 pr-4 h-9 bg-slate-50 border-none rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-[#1e293b]/5 transition-all text-slate-600"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Applications List Table */}
                <div className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-white">
                                    <th className="pl-8 pr-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">App ID</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Name</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy Name</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Date Submitted</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Documents</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredApplications?.map(app => (
                                    <tr 
                                        key={app._id} 
                                        className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedApp?._id === app._id ? 'bg-[#f1f5f9]' : ''}`}
                                        onClick={() => setSelectedApp(app)}
                                    >
                                        <td className="pl-8 pr-4 py-5">
                                            <span className="text-[12px] font-bold text-[#1e293b]">APP-{app._id.slice(-4).toUpperCase()}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[12px] font-bold text-[#1e293b]">{app.user?.name}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[11px] font-bold text-slate-500">{app.policy?.policyName}</span>
                                        </td>
                                        <td className="px-4 py-5 text-center">
                                            <span className="text-[11px] font-bold text-slate-500">
                                                {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2023' })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5 text-center">
                                            <div className="flex justify-center">
                                                {app.status === 'Approved' ? (
                                                     <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-200">
                                                        <ShieldCheck size={14} />
                                                     </div>
                                                ) : app.status === 'Rejected' ? (
                                                    <div className="w-7 h-7 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center border border-rose-200">
                                                        <AlertCircle size={14} />
                                                    </div>
                                                ) : (
                                                    <div className="w-7 h-7 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center border border-orange-200">
                                                        <Clock size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-1.5 text-slate-300 group-hover:text-[#1e293b] transition-colors rounded-lg">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Panel: Review Application */}
            <AnimatePresence>
                {selectedApp && (
                    <motion.div 
                        initial={{ x: 420, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 420, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-[88px] right-6 bottom-6 w-full lg:w-[400px] bg-white rounded-[1.5rem] shadow-2xl shadow-slate-200 border border-slate-200 flex flex-col z-50 overflow-hidden"
                    >
                        {/* Panel Header */}
                        <div className="p-6 bg-[#1e293b] text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-[16px] font-bold tracking-tight">Review Application</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Application ID: APP-{selectedApp._id.slice(-4).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all">
                                <X size={14} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
                            {/* Customer Details Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <User size={12} className="text-slate-300" /> Customer Details
                                </div>
                                <div className="p-4 bg-[#f8fafc] rounded-xl border border-slate-100 grid grid-cols-2 gap-y-4 gap-x-2">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                                        <p className="text-[12px] font-bold text-slate-700">{selectedApp.user?.name}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact</p>
                                        <p className="text-[12px] font-bold text-slate-700">{selectedApp.user?.phone || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2 space-y-0.5">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Plan Details</p>
                                        <p className="text-[12px] font-bold text-[#1e293b]">{selectedApp.policy?.policyName} • ₹{selectedApp.policy?.premiumAmount?.toLocaleString()}/yr</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Preview Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Eye size={12} className="text-slate-300" /> Document Preview
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: 'Aadhar Card', color: 'bg-emerald-50 text-emerald-600', icon: ShieldCheck },
                                        { label: 'PAN Card', color: 'bg-orange-50 text-orange-600', icon: FileText },
                                        { label: 'Medical Rpt', color: 'bg-sky-50 text-sky-600', icon: Layout }
                                    ].map((doc, i) => (
                                        <div key={i} className="space-y-1.5 cursor-pointer group">
                                            <div className="aspect-[3/4] rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative shadow-sm transition-transform active:scale-95">
                                                 <div className={`absolute inset-0 flex items-center justify-center ${doc.color}`}>
                                                    <doc.icon size={24} />
                                                 </div>
                                                 <div className="absolute inset-x-0 bottom-0 py-1.5 bg-white/90 backdrop-blur-sm border-t border-slate-100">
                                                    <p className="text-[8px] font-extrabold text-[#111] text-center uppercase tracking-tighter">{doc.label}</p>
                                                 </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Verification Checklist */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Layers size={12} className="text-slate-300" /> Verification Checklist
                                </div>
                                <div className="space-y-2.5">
                                    {[
                                        { id: 'aadhar', label: 'Aadhar verified' },
                                        { id: 'pan', label: 'PAN verified' },
                                        { id: 'photo', label: 'Photo matches application' },
                                        { id: 'income', label: 'Income proof valid' }
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center justify-between cursor-pointer group px-1">
                                            <span className="text-[12px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">{item.label}</span>
                                            <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${checklist[item.id] ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200 group-hover:border-slate-300'}`}>
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden" 
                                                    checked={checklist[item.id]}
                                                    onChange={() => setChecklist(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                                />
                                                {checklist[item.id] && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Agent Notes */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <MessageSquare size={12} className="text-slate-300" /> Agent Notes
                                </div>
                                <div className="relative group">
                                    <textarea 
                                        className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3.5 text-[12px] font-semibold text-slate-600 outline-none focus:ring-4 focus:ring-slate-50 transition-all resize-none italic"
                                        placeholder="Add a comment or internal note..."
                                        value={agentNotes}
                                        onChange={(e) => setAgentNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer Actions */}
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleAppStatus('Approved')}
                                    disabled={updateAppMutation.isPending}
                                    className="h-11 bg-[#10b981] text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#059669] transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-60"
                                >
                                    <CheckCircle size={16} /> Approve
                                </button>
                                <button 
                                    onClick={() => handleAppStatus('Rejected')}
                                    disabled={updateAppMutation.isPending}
                                    className="h-11 bg-[#ef4444] text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#dc2626] transition-all shadow-lg shadow-rose-500/10 disabled:opacity-60"
                                >
                                    <X size={16} /> Reject
                                </button>
                            </div>
                            <button 
                                onClick={() => handleAppStatus('Documents Verified')}
                                disabled={updateAppMutation.isPending}
                                className="w-full h-11 bg-white border border-slate-200 text-[#64748b] rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-[#1e293b] transition-all disabled:opacity-60"
                            >
                                <FileText size={16} /> Mark Docs Verified
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentApplications;
