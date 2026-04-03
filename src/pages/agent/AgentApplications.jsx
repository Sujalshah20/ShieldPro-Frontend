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
    Eye
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

    const statusTabs = ['All Applications', 'Pending Review', 'Documents Verified', 'Approved', 'Rejected', 'Paid'];

    const filteredApplications = applications?.filter(app => {
        const matchesSearch = app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesTab = false;
        if (activeStatusTab === 'All Applications') {
            matchesTab = true;
        } else if (activeStatusTab === 'Pending Review') {
            matchesTab = app.status === 'Pending';
        } else {
            matchesTab = app.status === activeStatusTab;
        }

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
                    <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] mb-2 italic">
                        <Link to="/agent" className="hover:text-black hover:opacity-100 transition-colors uppercase italic font-black">Dashboard</Link>
                        <ChevronRight size={12} className="opacity-40" />
                        <span className="text-black opacity-100">Policy Applications</span>
                    </div>
                    <h1 className="text-2xl font-black text-black tracking-tighter italic uppercase">Policy Applications_</h1>
                    <p className="text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] mt-1 italic leading-relaxed uppercase">Review and manage insurance applications assigned to you // SYNC_ACTIVE</p>
                </div>

                {/* Tab Navigation & Search */}
                <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-1 w-full md:w-auto">
                        {statusTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveStatusTab(tab)}
                                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic ${
                                    activeStatusTab === tab 
                                    ? 'bg-black text-white shadow-3xl' 
                                    : 'text-black/40 hover:bg-slate-50 hover:text-black'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black opacity-20" size={14} strokeWidth={3} />
                        <input 
                            type="text" 
                            placeholder="Search applications..." 
                            className="w-full pl-9 pr-4 h-10 bg-slate-50 border border-transparent rounded-xl text-[11px] font-black italic outline-none focus:bg-white focus:border-slate-100 transition-all text-black uppercase tracking-tighter"
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
                                    <th className="pl-8 pr-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic">App ID</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Customer Name</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Policy Name</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic text-center">Date Submitted</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic text-center">Documents</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic text-right">Action</th>
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
                                            <span className="text-[12px] font-black text-black italic uppercase tracking-tighter">APP-{app._id.slice(-4).toUpperCase()}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[12px] font-black text-black italic uppercase tracking-tighter">{app.user?.name}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[11px] font-black text-black opacity-40 italic uppercase tracking-tighter">{app.policy?.policyName}</span>
                                        </td>
                                        <td className="px-4 py-5 text-center">
                                            <span className="text-[11px] font-black text-black opacity-40 uppercase tracking-widest italic">
                                                {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
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
                                            <button className="p-1.5 text-black opacity-20 group-hover:opacity-100 hover:text-black transition-all rounded-lg">
                                                <ChevronRight size={18} strokeWidth={3} />
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
                        <div className="p-6 bg-black text-white flex items-center justify-between border-b border-white/5 shadow-3xl">
                            <div>
                                <h3 className="text-[16px] font-black tracking-tighter italic uppercase leading-none">Review Application_</h3>
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[4px] mt-1.5 italic">Application ID: APP-{selectedApp._id.slice(-4).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                                <X size={16} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
                            {/* Customer Details Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">
                                    <User size={12} className="text-black opacity-20" strokeWidth={3} /> Customer Details
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-y-4 gap-x-2 shadow-inner">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Full Name</p>
                                        <p className="text-[12px] font-black text-black italic leading-none">{selectedApp.user?.name}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Contact</p>
                                        <p className="text-[12px] font-black text-black italic leading-none">{selectedApp.user?.phone || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2 space-y-0.5 mt-2">
                                        <p className="text-[9px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Plan Details</p>
                                        <p className="text-[11px] font-black text-black uppercase tracking-widest italic">{selectedApp.policy?.policyName} • <span className="text-emerald-600">₹{selectedApp.policy?.premiumAmount?.toLocaleString()}/yr</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Preview Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">
                                    <Eye size={12} className="text-black opacity-20" strokeWidth={3} /> Document Preview
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
                                <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">
                                    <Layers size={12} className="text-black opacity-20" strokeWidth={3} /> Verification Checklist
                                </div>
                                <div className="space-y-2.5">
                                    {[
                                        { id: 'aadhar', label: 'Aadhar verified' },
                                        { id: 'pan', label: 'PAN verified' },
                                        { id: 'photo', label: 'Photo matches application' },
                                        { id: 'income', label: 'Income proof valid' }
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center justify-between cursor-pointer group px-1">
                                            <span className="text-[12px] font-black text-black opacity-40 group-hover:opacity-100 transition-all uppercase italic tracking-tighter">{item.label}</span>
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
                                <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">
                                    <MessageSquare size={12} className="text-black opacity-20" strokeWidth={3} /> Agent Notes
                                </div>
                                <div className="relative group">
                                    <textarea 
                                        className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3.5 text-[11px] font-black text-black outline-none focus:ring-8 focus:ring-black/5 transition-all resize-none italic uppercase tracking-tighter shadow-inner"
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
