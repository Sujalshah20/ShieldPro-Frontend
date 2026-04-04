import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    User, CheckCircle, Clock, AlertCircle, 
    X, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const AgentApplications = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatusTab, setActiveStatusTab] = useState('All Applications');

    const updateAppMutation = useMutation({
        mutationFn: ({ appId, status }) =>
            api.put(`/applications/${appId}/status`, { status }, user.token),
        onSuccess: (_, variables) => {
            toast({
                title: `Application ${variables.status}`,
                description: `Application has been ${variables.status.toLowerCase()} successfully.`,
            });
            queryClient.invalidateQueries(['agentApps']);
            setSelectedApp(null);
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

    const statusTabs = [
        { id: 'All Applications', label: 'All Applications' },
        { id: 'Pending', label: 'Pending Review' },
        { id: 'Approved', label: 'Approved' },
        { id: 'Rejected', label: 'Rejected' },
    ];

    const filteredApplications = applications?.filter(app => {
        const matchesSearch = app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app._id.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesTab = false;
        if (activeStatusTab === 'All Applications') {
            matchesTab = true;
        } else {
            matchesTab = app.status === activeStatusTab;
        }

        return matchesSearch && matchesTab;
    });

    if (isLoading) return (
        <div className="py-20 px-8 flex flex-col gap-8">
             <div className="h-20 w-full bg-slate-100 animate-pulse rounded-2xl" />
             <div className="h-[600px] bg-white rounded-3xl border border-slate-100 animate-pulse shadow-sm" />
        </div>
    );

    return (
        <div className="py-6 min-h-screen">
            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-[#1a2744] tracking-tight">Policy Applications</h1>
                <p className="text-slate-500 font-medium mt-1.5">Review and manage insurance applications assigned to you.</p>
            </div>

            {/* Applications Table — always full width, panel slides over from right */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Tabs Navigation */}
                <div className="flex items-center px-4 pt-4 border-b border-slate-50 overflow-x-auto no-scrollbar">
                    {statusTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveStatusTab(tab.id)}
                            className={`px-5 py-4 text-[13px] font-bold whitespace-nowrap transition-all relative ${
                                activeStatusTab === tab.id 
                                ? 'text-[#1a2744]' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {tab.label}
                            {activeStatusTab === tab.id && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-5 right-5 h-[3px] bg-[#1a2744] rounded-t-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/50 border-b border-slate-50">
                                <th className="pl-6 pr-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">App ID</th>
                                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer Name</th>
                                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Policy Name</th>
                                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date Submitted</th>
                                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredApplications?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">No applications found in this category.</td>
                                </tr>
                            ) : (
                                filteredApplications?.map(app => (
                                    <tr 
                                        key={app._id} 
                                        onClick={() => setSelectedApp(app)}
                                        className={`group cursor-pointer transition-all hover:bg-slate-50/50 ${selectedApp?._id === app._id ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <td className="pl-6 pr-4 py-5">
                                            <span className="text-[13px] font-bold text-[#1a2744]">APP-{app._id.slice(-4).toUpperCase()}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[13px] font-bold text-slate-700">{app.user?.name}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[13px] font-medium text-slate-500">{app.policy?.policyName}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[13px] font-medium text-slate-500">
                                                {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end">
                                                {app.status === 'Approved' ? (
                                                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                                        <Check size={15} strokeWidth={3} />
                                                    </div>
                                                ) : app.status === 'Rejected' ? (
                                                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                                                        <AlertCircle size={15} strokeWidth={3} />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                                                        <Clock size={15} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Review Panel ── */}
            <AnimatePresence>
                {selectedApp && (
                    <>
                        {/* Backdrop — covers whole page on mobile, dims table on desktop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedApp(null)}
                            className="fixed inset-0 bg-[#0a0a14]/40 backdrop-blur-[2px] z-[60]"
                        />

                        {/* Panel — fixed right drawer: slides in from right on desktop & mobile */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-20 bottom-0 z-[70] w-full max-w-[400px] bg-white border-l border-slate-100 shadow-[−20px_0_60px_-15px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
                        >
                            {/* Panel Header */}
                            <div className="flex-shrink-0 px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-[#1a2744] tracking-tight">Review Application</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.12em]">APP-{selectedApp._id.slice(-4).toUpperCase()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-700 active:scale-90"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-7 py-5 space-y-6">

                                {/* Customer Information */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <User size={13} className="text-slate-300" /> Customer Information
                                    </h4>
                                    <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                                                <p className="text-[15px] font-extrabold text-[#1a2744] truncate">{selectedApp.user?.name}</p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mobile</p>
                                                <p className="text-[13px] font-bold text-slate-600 tabular-nums">{selectedApp.user?.phone || '+91 78457 44444'}</p>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-slate-200 space-y-2">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Coverage Plan</p>
                                            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                                                <span className="text-[13px] font-bold text-[#1a2744]">{selectedApp.policy?.policyName}</span>
                                                <span className="text-[14px] font-black text-emerald-600">₹{selectedApp.policy?.premiumAmount?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action Buttons */}
                            <div className="flex-shrink-0 px-7 py-5 border-t border-slate-100 bg-white">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleAppStatus('Approved')}
                                        disabled={updateAppMutation.isPending}
                                        className="h-14 bg-[#10b981] text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2.5 hover:bg-[#059669] hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none group"
                                    >
                                        <CheckCircle size={18} className="group-hover:rotate-12 transition-transform" />
                                        Final Approval
                                    </button>
                                    <button
                                        onClick={() => handleAppStatus('Rejected')}
                                        disabled={updateAppMutation.isPending}
                                        className="h-14 bg-[#ef4444] text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2.5 hover:bg-[#dc2626] hover:-translate-y-0.5 transition-all shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none group"
                                    >
                                        <X size={18} className="group-hover:rotate-[-12deg] transition-transform" />
                                        Reject Case
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentApplications;

