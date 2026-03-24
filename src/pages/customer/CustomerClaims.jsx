import React, { useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { useLocation } from "react-router-dom";
import { 
    Printer, Download, User as UserIcon, Check, Shield, 
    Banknote, UploadCloud, MessageSquare, Send, Plus, TextSelect, FileText, Image as ImageIcon,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import SubmitClaimForm from "./SubmitClaimForm";

const CustomerClaims = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const location = useLocation();
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [isCreatingClaim, setIsCreatingClaim] = useState(false);

    // Auto-open the claim form if navigated with openNewClaim state
    useEffect(() => {
        if (location.state?.openNewClaim) {
            setIsCreatingClaim(true);
            // Clear state to prevent re-triggering on revisit
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const { data: myClaims = [], isLoading } = useQuery({
        queryKey: ['myClaims', user?.token],
        queryFn: () => api.get('/claims', user.token),
        enabled: !!user?.token
    });

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return "bg-emerald-50 text-emerald-600 font-semibold px-3 py-1 rounded-full text-xs";
            case 'Pending': return "bg-amber-50 text-amber-600 font-semibold px-3 py-1 rounded-full text-xs";
            case 'Rejected': return "bg-rose-50 text-rose-600 font-semibold px-3 py-1 rounded-full text-xs";
            default: return "bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full text-xs";
        }
    };

    const steps = [
        { id: 1, label: "SUBMITTED", icon: Check },
        { id: 2, label: "UNDER REVIEW", icon: Check },
        { id: 3, label: "AGENT ASSIGNED", icon: UserIcon },
        { id: 4, label: "VERIFIED", icon: Shield },
        { id: 5, label: "DECISION", icon: Check },
        { id: 6, label: "DISBURSED", icon: Banknote },
    ];

    const getActiveStep = (status) => {
        if (status === 'Approved') return 6;
        if (status === 'Rejected') return 5;
        return 3; // Pending default
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 font-sans pb-20">
            <AnimatePresence mode="wait">
                {isCreatingClaim ? (
                    <SubmitClaimForm 
                        key="submit-form"
                        onCancel={() => setIsCreatingClaim(false)} 
                        onSubmit={() => {
                            queryClient.invalidateQueries(['myClaims']);
                            setIsCreatingClaim(false);
                            toast({
                                title: "Claim Submitted Successfully!",
                                description: "Your new claim has been forwarded for processing.",
                            });
                        }}
                    />
                ) : (
                    <motion.div 
                        key="claims-list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 mb-1">My Claims</h1>
                                <p className="text-slate-500 text-sm font-medium">Track and manage your insurance claim requests with end-to-end transparency.</p>
                            </div>
                            <button 
                                onClick={() => setIsCreatingClaim(true)}
                                className="flex items-center justify-center gap-2 bg-[#134e8d] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#002b45] transition-all shadow-lg shadow-blue-100"
                            >
                                <Plus size={18} /> File New Claim
                            </button>
                        </div>

                        {/* Claims Table */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-12 overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claim Reference</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy Name</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claim Amount</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submission Date</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Activity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {myClaims.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                        <FileText size={32} className="text-slate-200" />
                                                    </div>
                                                    <p className="text-slate-500 font-medium">No claims recorded yet. Need to report an incident?</p>
                                                    <button 
                                                        onClick={() => setIsCreatingClaim(true)}
                                                        className="text-[#134e8d] font-bold text-sm hover:underline"
                                                    >
                                                        Start filing a claim now
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : myClaims.map(claim => (
                                        <tr 
                                            key={claim._id} 
                                            className={`hover:bg-blue-50/30 transition-colors cursor-pointer group ${selectedClaim?._id === claim._id ? 'bg-blue-50/50' : ''}`}
                                            onClick={() => setSelectedClaim(claim)}
                                        >
                                            <td className="px-8 py-5 font-bold text-slate-700 text-[13px]">
                                                #CLM-{claim._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#134e8d]">
                                                        <Shield size={16} />
                                                    </div>
                                                    <span className="text-slate-700 font-bold text-[13px]">{claim.userPolicy?.policy?.policyName || "General Policy"}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-slate-500 font-bold text-[11px] uppercase tracking-widest">
                                                {claim.userPolicy?.policy?.policyType || "General"}
                                            </td>
                                            <td className="px-8 py-5 font-bold text-slate-800 text-[13px]">
                                                ₹{claim.amount.toLocaleString()}
                                            </td>
                                            <td className="px-8 py-5 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                                                {new Date(claim.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric'})}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={getStatusStyle(claim.status)}>{claim.status}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-[#134e8d] font-bold text-[12px] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                                                    Manage Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Details Panel */}
                        <AnimatePresence>
                            {(selectedClaim || (myClaims.length > 0 && !selectedClaim)) && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                                >
                                    {/* Left Column: Details & Documents */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Summary Widget */}
                                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-800 mb-2">Claim Progress</h2>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                        Reference: #CLM-{(selectedClaim || myClaims[0])._id.slice(-8).toUpperCase()} <span className="mx-2">•</span> Verified Application
                                                    </p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#134e8d] hover:bg-blue-50 transition-all shadow-sm">
                                                        <Printer size={18} />
                                                    </button>
                                                    <button className="bg-[#134e8d] text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#002b45] transition-all shadow-lg shadow-blue-100 flex items-center gap-3">
                                                        <Download size={14} /> Export Summary
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Stepper */}
                                            <div className="relative pt-8 pb-4">
                                                <div className="absolute top-12 left-8 right-8 h-2 bg-slate-50 rounded-full"></div>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(getActiveStep((selectedClaim || myClaims[0]).status) - 1) * 20}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="absolute top-12 left-8 h-2 bg-[#134e8d] rounded-full shadow-[0_4px_12px_rgba(19,78,141,0.2)]"
                                                ></motion.div>
                                                <div className="flex justify-between relative z-10 px-0">
                                                    {steps.map((step) => {
                                                        const isActive = step.id <= getActiveStep((selectedClaim || myClaims[0]).status);
                                                        const Icon = step.icon;
                                                        return (
                                                            <div key={step.id} className="flex flex-col items-center gap-6 group">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 border-4 border-white ${
                                                                    isActive 
                                                                    ? 'bg-[#134e8d] text-white shadow-xl scale-110' 
                                                                    : 'bg-white text-slate-200 border-slate-50'
                                                                }`}>
                                                                    <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                                                                </div>
                                                                <span className={`text-[9px] font-bold uppercase tracking-widest text-center max-w-[80px] leading-tight ${
                                                                    isActive ? 'text-slate-800' : 'text-slate-300'
                                                                }`}>
                                                                    {step.label}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Documents Section */}
                                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-10">
                                                <h3 className="text-lg font-bold text-slate-800">Supportive Evidence</h3>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {(selectedClaim || myClaims[0]).documents?.length || 0} Attachments
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {(selectedClaim || myClaims[0]).documents?.length > 0 ? (selectedClaim || myClaims[0]).documents.map((doc, i) => (
                                                    <a 
                                                        key={i}
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-transparent group hover:border-[#134e8d]/20 hover:bg-white transition-all shadow-sm"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div className="p-4 bg-white rounded-xl text-[#134e8d] shadow-sm group-hover:scale-110 transition-transform">
                                                                <FileText size={24} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-[13px] text-slate-700 truncate max-w-[150px]">{doc.name || `Document_${i+1}`}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Verified Upload</p>
                                                            </div>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#134e8d] group-hover:text-white transition-all">
                                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </a>
                                                )) : (
                                                    <div className="col-span-2 py-16 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                                                        <UploadCloud className="mx-auto text-slate-200 mb-6" size={48} />
                                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No documentation provided</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Agent & Logs */}
                                    <div className="space-y-8">
                                        {/* Adjuster Card */}
                                        <div className="bg-[#134e8d] rounded-[2.5rem] p-10 text-white relative overflow-hidden group/ad shadow-xl shadow-blue-100">
                                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover/ad:rotate-12 transition-transform duration-1000">
                                                <Shield size={140} />
                                            </div>
                                            <div className="relative z-10 flex flex-col gap-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xl font-bold text-2xl border border-white/20">
                                                        {(selectedClaim || myClaims[0]).userPolicy?.agent?.name?.charAt(0) || "A"}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-blue-100/60 uppercase tracking-widest mb-2">Assigned Agent</p>
                                                        <h4 className="text-xl font-bold">{(selectedClaim || myClaims[0]).userPolicy?.agent?.name || "Pending Assignment"}</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-2xl w-fit border border-white/10">
                                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_12px_#34d399]" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Review Active</span>
                                                </div>
                                                <button className="w-full py-4 bg-white text-[#134e8d] rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                                                    Message Agent
                                                </button>
                                            </div>
                                        </div>

                                        {/* Review Logs */}
                                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex-1">
                                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Application Audit Log</h3>
                                            <div className="space-y-10">
                                                {(selectedClaim || myClaims[0]).comments?.length > 0 ? (selectedClaim || myClaims[0]).comments.map((comment, i) => (
                                                    <div key={i} className="relative pl-10 border-l-2 border-slate-50 group/log">
                                                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-200 group-hover/log:bg-[#134e8d] group-hover/log:scale-125 transition-all" />
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">{comment.user?.name || "System Automated"}</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <p className="text-[14px] font-medium text-slate-600 leading-relaxed italic border-l-4 border-slate-50 pl-4 py-1">
                                                                "{comment.text}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="py-24 text-center space-y-6">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto">
                                                            <MessageSquare size={32} />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No activity reported yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerClaims;