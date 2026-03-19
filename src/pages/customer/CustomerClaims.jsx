import React, { useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { useLocation } from "react-router-dom";
import { 
    Printer, Download, User as UserIcon, Check, Shield, 
    Banknote, UploadCloud, MessageSquare, Send, Plus, TextSelect, FileText, Image as ImageIcon
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
                        onSubmit={(data) => {
                            console.log("Submit claim data:", data);
                            toast({
                                title: "Claim Submitted Successfully!",
                                description: "Your new claim has been forwarded for processing.",
                            });
                            setIsCreatingClaim(false);
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
                    <h1 className="text-2xl font-bold text-[#002b45] mb-1">My Claims</h1>
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Claim ID</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Policy</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {myClaims.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    No claims found.
                                </td>
                            </tr>
                        ) : myClaims.map(claim => (
                            <tr 
                                key={claim._id} 
                                className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedClaim?._id === claim._id ? 'bg-[#002b45]/5' : ''}`}
                                onClick={() => setSelectedClaim(claim)}
                            >
                                <td className="px-6 py-4 font-bold text-[#002b45] text-[13px]">
                                    CLM-{claim._id.slice(-4).toUpperCase()}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-[13px]">
                                    {claim.userPolicy?.policy?.policyName || "Unknown Policy"}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-[13px]">
                                    {claim.userPolicy?.policy?.policyType || "General"}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900 text-[13px]">
                                    ${claim.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-[12px]">
                                    {new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={getStatusStyle(claim.status)}>{claim.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-[#002b45] font-bold text-[12px] hover:underline">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom Section */}
            {(selectedClaim || myClaims.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Details & Documents */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Widget */}
                        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
                                <div>
                                    <h2 className="text-lg font-bold text-[#002b45] mb-1">Claim Details Summary</h2>
                                    <p className="text-[12px] text-gray-500">
                                        Case ID: CLM-{(selectedClaim || myClaims[0])._id.slice(-4).toUpperCase()} • {(selectedClaim || myClaims[0]).userPolicy?.policy?.policyType || "General"} • Submitted {new Date((selectedClaim || myClaims[0]).createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
                                        <Printer size={18} />
                                    </button>
                                    <button className="bg-[#002b45] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#003b5c] transition-colors flex items-center justify-center whitespace-nowrap">
                                        Download Report
                                    </button>
                                </div>
                            </div>

                            {/* Stepper */}
                            <div className="relative pt-4 pb-1 overflow-x-auto no-scrollbar">
                                <div className="min-w-[700px]">
                                    <div className="absolute top-9 left-8 right-8 h-1 bg-gray-100 -z-10 rounded-full"></div>
                                    <div 
                                        className="absolute top-9 left-8 h-1 bg-[#002b45] -z-10 rounded-full transition-all duration-1000"
                                        style={{ width: `${(getActiveStep((selectedClaim || myClaims[0]).status) - 1) * 20}%` }}
                                    ></div>
                                    <div className="flex justify-between">
                                        {steps.map((step, idx) => {
                                            const isActive = step.id <= getActiveStep((selectedClaim || myClaims[0]).status);
                                            const Icon = step.icon;
                                            return (
                                                <div key={step.id} className="flex flex-col items-center gap-3 group">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                                        isActive 
                                                        ? 'bg-[#002b45] text-white shadow-sm' 
                                                        : 'bg-white text-gray-300 border border-gray-100'
                                                    }`}>
                                                        <Icon size={16} strokeWidth={isActive ? 3 : 2} />
                                                    </div>
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest text-center whitespace-nowrap ${
                                                        isActive ? 'text-[#002b45]' : 'text-gray-300'
                                                    }`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Uploaded Documents */}
                        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-[#002b45] mb-5">Uploaded Documents</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2.5 group cursor-pointer hover:border-[#002b45] hover:shadow-sm transition-all">
                                    <div className="h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center group-hover:bg-[#002b45]/5">
                                        <ImageIcon className="text-gray-400 group-hover:text-[#002b45]" size={28} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs text-[#002b45] truncate">Damage_01.jpg</p>
                                        <p className="text-[10px] text-gray-500">2.4 MB</p>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2.5 group cursor-pointer hover:border-[#002b45] hover:shadow-sm transition-all">
                                    <div className="h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center group-hover:bg-[#002b45]/5">
                                        <FileText className="text-gray-400 group-hover:text-[#002b45]" size={28} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs text-[#002b45] truncate">Police_Report.pdf</p>
                                        <p className="text-[10px] text-gray-500">1.1 MB</p>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2.5 group cursor-pointer hover:border-[#002b45] hover:shadow-sm transition-all">
                                    <div className="h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center group-hover:bg-[#002b45]/5">
                                        <ImageIcon className="text-gray-400 group-hover:text-[#002b45]" size={28} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs text-[#002b45] truncate">Policy_Copy.png</p>
                                        <p className="text-[10px] text-gray-500">0.8 MB</p>
                                    </div>
                                </div>
                                <label className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#002b45] hover:bg-[#002b45]/5 transition-all text-gray-400 hover:text-[#002b45] min-h-[140px]">
                                    <input type="file" className="hidden" />
                                    <Plus size={20} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Agent & Comments */}
                    <div className="space-y-5">
                        {/* Agent Card */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                                <UserIcon className="text-indigo-500" size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Assigned Agent</p>
                                <p className="font-bold text-[#002b45] text-sm">Sarah Jenkins</p>
                            </div>
                        </div>

                        {/* Recent Comments */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Comments</h3>
                            <div className="space-y-3">
                                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#002b45]">
                                    <p className="text-[10px] text-gray-400 mb-1.5">Yesterday, 2:45 PM</p>
                                    <p className="text-xs text-[#002b45] leading-relaxed">
                                        "We have received your police report. Our technical team is currently assessing the damage estimate provided by the workshop."
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-transparent pl-5">
                                    <p className="text-[10px] text-gray-400 mb-1.5">Nov 3, 10:15 AM</p>
                                    <p className="text-xs text-[#002b45] leading-relaxed">
                                        "Initial review complete. Case assigned to Sarah Jenkins for further verification."
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-5 pt-5 border-t border-gray-100">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Reply to Agent</p>
                                <div className="relative">
                                    <textarea 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-10 text-[13px] focus:outline-none focus:border-[#002b45] focus:bg-white transition-all resize-none h-20 text-[#002b45] placeholder-gray-400"
                                        placeholder="Type your message..."
                                    />
                                    <button className="absolute right-2.5 bottom-2.5 w-7 h-7 flex items-center justify-center bg-[#002b45] text-white rounded-lg hover:bg-[#003b5c] transition-colors">
                                        <Send size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerClaims;