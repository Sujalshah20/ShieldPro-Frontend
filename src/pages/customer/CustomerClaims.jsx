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

    // Fetch user claims
    const { data: myClaims = [], isLoading, isError, error } = useQuery({
        queryKey: ['myClaims', user?.token],
        queryFn: () => api.get('/claims', user.token),
        enabled: !!user?.token
    });

    // Fetch user policies for the claim form
    const { data: myPolicies = [] } = useQuery({
        queryKey: ['myPolicies', user?.token],
        queryFn: () => api.get('/user-policies', user.token),
        enabled: !!user?.token && isCreatingClaim
    });

    // Mutation for filing a claim
    const fileClaimMutation = useMutation({
        mutationFn: (formData) => api.postForm('/claims', formData, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['myClaims']);
            setIsCreatingClaim(false);
            toast({
                title: "Claim Submitted Successfully!",
                description: "Your new claim has been forwarded for processing.",
            });
        },
        onError: (err) => {
            toast({
                title: "Submission Failed",
                description: err.message || "There was an error filing your claim.",
                variant: "destructive"
            });
        }
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
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#134e8d] rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Syncing Secure Data...</p>
        </div>
    );

    if (isError) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
                <Info size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Connection Interrupted</h3>
            <p className="text-slate-500 max-w-md text-center">{error.message || "Failed to retrieve claim history."}</p>
            <button 
                onClick={() => queryClient.invalidateQueries(['myClaims'])}
                className="mt-4 px-6 py-2 bg-[#134e8d] text-white rounded-xl text-xs font-bold uppercase tracking-widest"
            >
                Retry Connection
            </button>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 font-sans pb-20">
            <AnimatePresence mode="wait">
                {isCreatingClaim ? (
                    <SubmitClaimForm 
                        key="submit-form"
                        policies={myPolicies}
                        onCancel={() => setIsCreatingClaim(false)} 
                        onSubmit={(formData) => fileClaimMutation.mutate(formData)}
                    />
                ) : (
                    <motion.div 
                        key="claims-list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {/* Header */}
                        <div className="mb-10">
                            <h1 className="text-2xl font-bold text-slate-800 mb-1">My Claims</h1>
                            <p className="text-slate-500 text-sm font-medium">Track and manage your insurance claim requests with end-to-end transparency.</p>
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

                        {/* Premium Claim Support Layout */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* 1. Main Hero / Reassurance Card */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-[#0c2e59] via-[#134e8d] to-[#1e6cb8] rounded-[2rem] p-8 md:p-12 text-white shadow-xl flex flex-col justify-center">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Shield className="w-64 h-64" />
                                </div>
                                <div className="absolute -bottom-10 -right-10 opacity-20">
                                    <Check className="w-48 h-48" />
                                </div>
                                <div className="absolute top-10 right-20 opacity-20 hidden md:block">
                                    <Shield size={64} />
                                </div>
                                <div className="relative z-10 w-full md:w-3/4 lg:w-2/3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-6 w-max">
                                        <Shield size={16} className="text-emerald-300" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-50">Trusted Claims Support</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
                                        Claims Made Simple. <br className="hidden sm:block"/> Support When You Need It Most.
                                    </h2>
                                    <p className="text-blue-100 text-sm md:text-base font-medium mb-8 leading-relaxed max-w-lg">
                                        Track your claim journey, understand the process, and get the support you need with confidence. We stand with you through every claim.
                                    </p>
                                </div>
                            </div>

                            {/* 2. Meaningful Information Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Card A: Claim Assistance */}
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#134e8d] mb-6 group-hover:scale-110 transition-transform">
                                        <MessageSquare size={28} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3">Claim Assistance</h3>
                                    <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                                        Our support team helps you through every step of the claim process. We are here to answer your questions and guide you.
                                    </p>
                                </div>

                                {/* Card B: Documents Guidance */}
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                                        <FileText size={28} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3">Documents Guidance</h3>
                                    <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                                        Prepare ID proof, policy details, and supporting incident documents for faster claim review and hassle-free processing.
                                    </p>
                                </div>

                                {/* Card C: Claim Process Overview */}
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                                        <ArrowRight size={28} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3">Claim Process Overview</h3>
                                    <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                                        Claims typically move through submission, review, validation, approval, and finally, settlement directly to your account.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerClaims;