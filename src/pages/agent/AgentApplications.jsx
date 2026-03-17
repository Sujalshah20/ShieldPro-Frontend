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

    if (isLoading) return (
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="h-[600px] bg-slate-50 rounded-[3rem] border-2 border-slate-100 animate-pulse" />
        </div>
    );

    const flaggedCount = applications?.filter(a => a.isFlagged).length || 0;

    const [activeStatusTab, setActiveStatusTab] = useState('All');
    const [checklist, setChecklist] = useState({
        aadhar: false,
        pan: false,
        photo: false,
        income: false
    });

    const statusTabs = ['All', 'Pending Review', 'Documents Verified', 'Approved', 'Rejected'];

    const filteredApplications = applications?.filter(app => {
        const matchesSearch = app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeStatusTab === 'All' || app.status === activeStatusTab || (activeStatusTab === 'Pending Review' && app.status === 'Pending');
        return matchesSearch && matchesTab;
    });

    return (
        <div className="flex gap-8 pb-10 min-h-[calc(100vh-120px)] relative">
            <div className={`flex-1 space-y-8 transition-all duration-500 ${selectedApp ? 'mr-[420px]' : ''}`}>
                <div>
                    <h1 className="text-4xl font-bold text-[#1e293b] tracking-tight">Policy Applications</h1>
                    <p className="text-base font-medium text-slate-400 mt-2">Review and manage insurance applications assigned to you.</p>
                </div>

                {/* Tab Navigation & Search */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-wrap items-center gap-1">
                        {statusTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveStatusTab(tab)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    activeStatusTab === tab 
                                    ? 'bg-[#1e293b] text-white shadow-lg shadow-slate-900/20' 
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {tab === 'All' ? 'All Applications' : tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search applications..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#1e293b]/5 transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30">
                                <th className="pl-8 pr-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">App ID</th>
                                <th className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Name</th>
                                <th className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy Name</th>
                                <th className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Date Submitted</th>
                                <th className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Documents</th>
                                <th className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredApplications?.map(app => (
                                <tr key={app._id} className={`group hover:bg-slate-50/80 transition-all ${selectedApp?._id === app._id ? 'bg-slate-50/80' : ''}`}>
                                    <td className="pl-8 pr-4 py-6">
                                        <span className="text-xs font-bold text-slate-800">APP-{app._id.slice(-4).toUpperCase()}</span>
                                    </td>
                                    <td className="px-4 py-6">
                                        <span className="text-xs font-bold text-slate-700">{app.user?.name}</span>
                                    </td>
                                    <td className="px-4 py-6">
                                        <span className="text-xs font-medium text-slate-500">{app.policy?.policyName}</span>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <span className="text-xs font-medium text-slate-500">{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <div className="flex justify-center">
                                            {app.status === 'Approved' ? (
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                                                    <CheckCircle size={16} />
                                                </div>
                                            ) : app.status === 'Rejected' ? (
                                                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                                                    <AlertCircle size={16} />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                                    <Clock size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                            app.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                app.status === 'Approved' ? 'bg-emerald-500' :
                                                app.status === 'Rejected' ? 'bg-rose-500' :
                                                'bg-amber-500'
                                            }`} />
                                            {app.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="p-2 text-slate-300 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-all"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Side Panel */}
            <AnimatePresence>
                {selectedApp && (
                    <motion.div 
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        className="fixed top-20 right-8 bottom-8 w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50"
                    >
                        {/* Panel Header */}
                        <div className="p-8 bg-[#1e293b] text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Review Application</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Application ID: APP-{selectedApp._id.slice(-4).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                            {/* Customer Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <User size={12} /> Customer Details
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Full Name</p>
                                        <p className="text-sm font-bold text-slate-800 leading-none">{selectedApp.user?.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Contact</p>
                                        <p className="text-sm font-bold text-slate-800 leading-none">+91 98765 43210</p>
                                    </div>
                                    <div className="w-full space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Plan Details</p>
                                        <p className="text-sm font-bold text-slate-800 leading-none">{selectedApp.policy?.policyName} • ₹{selectedApp.policy?.premiumAmount?.toLocaleString()}/yr</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Preview */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                    <Eye size={12} /> DOCUMENT PREVIEW
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Aadhar Card', img: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=100' },
                                        { label: 'PAN Card', img: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=100' },
                                        { label: 'Medical Rpt', img: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=100' }
                                    ].map(doc => (
                                        <div key={doc.label} className="space-y-2">
                                            <div className="aspect-[3/4] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden group/doc cursor-pointer relative">
                                                <img src={doc.img} alt={doc.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                <div className="absolute inset-x-0 bottom-0 bg-slate-900/40 backdrop-blur-md p-2">
                                                    <p className="text-[8px] font-bold text-white text-center uppercase tracking-tighter">{doc.label}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Verification Checklist */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <ShieldCheck size={12} /> Verification Checklist
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { id: 'aadhar', label: 'Aadhar verified' },
                                        { id: 'pan', label: 'PAN verified' },
                                        { id: 'photo', label: 'Photo matches application' },
                                        { id: 'income', label: 'Income proof valid' }
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${checklist[item.id] ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200 group-hover:border-slate-300'}`}>
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden" 
                                                    checked={checklist[item.id]}
                                                    onChange={() => setChecklist(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                                />
                                                {checklist[item.id] && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors uppercase tracking-tight">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Agent Notes */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <MessageSquare size={12} /> Agent Notes
                                </div>
                                <textarea 
                                    className="w-full h-24 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all resize-none italic"
                                    placeholder="Add a comment or internal note..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-8 border-t border-slate-100 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <button className="h-12 bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                                    <CheckCircle size={16} /> Approve
                                </button>
                                <button className="h-12 bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">
                                    <X size={16} /> Reject
                                </button>
                            </div>
                            <button className="w-full h-12 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                                <Satellite size={16} /> Request More Docs
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
        </div>
    );
};

export default AgentApplications;
