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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002b45]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans pb-20">
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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">My Claims</h1>
                                <p className="text-gray-500 text-xs">Track and manage your insurance claim requests in real-time.</p>
                            </div>
                            <button 
                                onClick={() => setIsCreatingClaim(true)}
                                className="flex items-center justify-center gap-2 bg-[#002b45] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#003b5c] transition-colors shadow-sm"
                            >
                                <Plus size={18} /> New Claim
                            </button>
                        </div>

                        {/* Claims Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8 overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Claim ID</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Policy</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                               </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {myClaims.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                No claims found. Start by filing a new claim.
                                            </td>
                                        </tr>
                                    ) : myClaims.map(claim => (
                                        <tr 
                                            key={claim._id} 
                                            className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedClaim?._id === claim._id ? 'bg-[#002b45]/5' : ''}`}
                                            onClick={() => setSelectedClaim(claim)}
                                        >
                                            <td className="px-6 py-4 font-bold text-white text-[13px]">
                                                CLM-{claim._id.slice(-4).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-[13px]">
                                                {claim.userPolicy?.policy?.policyName || "Unknown Policy"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-[13px]">
                                                {claim.userPolicy?.policy?.policyType || "General"}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900 text-[13px]">
                                                ₹{claim.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-[12px]">
                                                {new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={getStatusStyle(claim.status)}>{claim.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-white font-bold text-[12px] hover:underline">
                                                    View Details
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
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                                >
                                    {/* Left Column: Details & Documents */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Summary Widget */}
                                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                                                <div>
                                                    <h2 className="text-xl font-bold text-white mb-2">Claim Lifecycle Tracking</h2>
                                                    <p className="text-[12px] text-gray-400 font-medium tracking-tight">
                                                        Case ID: CLM-{(selectedClaim || myClaims[0])._id.slice(-8).toUpperCase()} • Active Response Node
                                                    </p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-50 transition-all shadow-sm">
                                                        <Printer size={18} />
                                                    </button>
                                                    <button className="bg-[#002b45] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#003b5c] transition-all shadow-lg flex items-center gap-3">
                                                        <Download size={14} /> Export Report
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Stepper */}
                                            <div className="relative pt-6 pb-2">
                                                <div className="absolute top-10 left-8 right-8 h-1.5 bg-gray-50 -z-10 rounded-full"></div>
                                                <div 
                                                    className="absolute top-10 left-8 h-1.5 bg-[#002b45] -z-10 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,43,69,0.3)]"
                                                    style={{ width: `${(getActiveStep((selectedClaim || myClaims[0]).status) - 1) * 20}%` }}
                                                ></div>
                                                <div className="flex justify-between">
                                                    {steps.map((step) => {
                                                        const isActive = step.id <= getActiveStep((selectedClaim || myClaims[0]).status);
                                                        const Icon = step.icon;
                                                        return (
                                                            <div key={step.id} className="flex flex-col items-center gap-4 group">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                                                                    isActive 
                                                                    ? 'bg-[#002b45] text-[#007ea7] shadow-xl scale-110' 
                                                                    : 'bg-white text-gray-200 border-2 border-gray-50'
                                                                }`}>
                                                                    <Icon size={18} strokeWidth={3} />
                                                                </div>
                                                                <span className={`text-[9px] font-black uppercase tracking-[3px] text-center ${
                                                                    isActive ? 'text-white' : 'text-gray-300'
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
                                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-lg font-bold text-white">Evidence Manifest</h3>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                                                    {(selectedClaim || myClaims[0]).documents?.length || 0} FILES_DETACHED
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(selectedClaim || myClaims[0]).documents?.length > 0 ? (selectedClaim || myClaims[0]).documents.map((doc, i) => (
                                                    <a 
                                                        key={i}
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-[#007ea7]/30 hover:bg-white transition-all shadow-sm"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className="p-3 bg-white rounded-xl text-[#007ea7] shadow-sm group-hover:scale-110 transition-transform">
                                                                <FileText size={20} strokeWidth={2.5} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-xs text-[#003249] truncate max-w-[140px] uppercase tracking-wider">{doc.name || `ATTACHMENT_${i+1}`}</p>
                                                                <p className="text-[9px] text-slate-400 font-bold mt-1">SECURE_SYNC_VERIFIED</p>
                                                            </div>
                                                        </div>
                                                        <ArrowRight size={16} className="text-slate-300 group-hover:text-[#007ea7] group-hover:translate-x-1 transition-all" strokeWidth={3} />
                                                    </a>
                                                )) : (
                                                    <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                                        <UploadCloud className="mx-auto text-slate-200 mb-4" size={40} />
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px] italic">No active evidence detected</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Agent & Logs */}
                                    <div className="space-y-6">
                                        {/* Adjuster Card */}
                                        <div className="bg-[#003249] rounded-[2.5rem] p-8 text-white relative overflow-hidden group/ad">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/ad:rotate-12 transition-transform duration-1000">
                                                <Shield size={120} />
                                            </div>
                                            <div className="relative z-10 flex flex-col gap-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#007ea7] flex items-center justify-center text-[#003249] shadow-2xl font-black text-xl italic">
                                                        {(selectedClaim || myClaims[0]).userPolicy?.agent?.name?.charAt(0) || "A"}
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-[#007ea7] uppercase tracking-[4px] mb-1 italic">Case_Adjuster</p>
                                                        <h4 className="text-xl font-bold italic tracking-tight">{(selectedClaim || myClaims[0]).userPolicy?.agent?.name || "Assigning..."}</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full w-fit">
                                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
                                                    <span className="text-[9px] font-black uppercase tracking-[3px] opacity-60">Status: ACTIVE_REVIEW</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Logs */}
                                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex-1">
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] mb-8 italic">Review_Session_Logs</h3>
                                            <div className="space-y-6">
                                                {(selectedClaim || myClaims[0]).comments?.length > 0 ? (selectedClaim || myClaims[0]).comments.map((comment, i) => (
                                                    <div key={i} className="relative pl-8 border-l-2 border-slate-50 group/log">
                                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-200 group-hover/log:bg-[#007ea7] transition-colors" />
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[9px] font-black text-[#003249] uppercase tracking-widest italic">{comment.user?.name || "System"}</p>
                                                                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <p className="text-[13px] font-medium text-slate-500 leading-relaxed italic">
                                                                "{comment.text}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="py-20 text-center space-y-4">
                                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto">
                                                            <MessageSquare size={24} />
                                                        </div>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] italic">No logs initialized</p>
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