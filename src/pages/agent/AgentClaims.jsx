import React, { useState, useContext } from "react";
import { 
    Search, Clock, AlertCircle, CheckCircle, 
    FileText, User, Eye, X, ChevronRight,
    Layout, Loader2, Settings, FileCheck, Check,
    AlertTriangle, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";
import { AuthContext } from "../../context/AuthContext";

const AgentClaims = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatusTab, setActiveStatusTab] = useState('All Claims');
    const [auditNotes, setAuditNotes] = useState("");
    const [checklist, setChecklist] = useState({
        documentAuthenticity: true
    });

    const updateClaimMutation = useMutation({
        mutationFn: ({ claimId, status, comment }) =>
            api.put(`/claims/${claimId}/status`, { status, comment }, user.token),
        onSuccess: (_, variables) => {
            toast({
                title: `Claim ${variables.status}`,
                description: `Claim has been successfully ${variables.status.toLowerCase()}.`,
            });
            queryClient.invalidateQueries(['agentClaims']);
            setSelectedClaim(null);
        },
        onError: (err) => {
            toast({ title: "Action failed", description: err.message, variant: "destructive" });
        }
    });

    const handleStatusUpdate = (status) => {
        if (!selectedClaim) return;
        updateClaimMutation.mutate({
            claimId: selectedClaim._id,
            status,
            comment: auditNotes
        });
    };

    const { data: claims, isLoading } = useQuery({
        queryKey: ['agentClaims', user?.token],
        queryFn: () => api.get('/claims/all', user.token),
        enabled: !!user?.token
    });

    const filteredClaims = claims?.filter(claim => {
        const matchesSearch = claim.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            claim._id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    if (isLoading) return (
        <div className="py-20 px-8 flex flex-col gap-8">
             <div className="h-20 w-full bg-slate-100 animate-pulse rounded-2xl" />
             <div className="h-[600px] bg-white rounded-3xl border border-slate-100 animate-pulse shadow-sm" />
        </div>
    );

    return (
        <div className="py-8 min-h-screen">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#1a2744] tracking-tight">Claims to Process</h1>
                    <p className="text-slate-500 font-medium mt-1.5">Review and manage pending insurance claims from your assigned customers.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Claims Ledger Column */}
                <div className={`flex-1 min-w-0 transition-all duration-300 ${selectedClaim ? 'lg:w-[58%]' : 'w-full'}`}>
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#f8fafc]/50">
                                    <tr className="border-b border-slate-100">
                                        <th className="pl-8 pr-4 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Claim ID</th>
                                        <th className="px-4 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Customer</th>
                                        <th className="px-4 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Policy</th>
                                        <th className="px-4 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Type</th>
                                        <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredClaims?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-24 text-center text-slate-400 font-medium italic">No pending claims for processing.</td>
                                        </tr>
                                    ) : (
                                        filteredClaims?.map(claim => (
                                            <tr 
                                                key={claim._id} 
                                                onClick={() => setSelectedClaim(claim)}
                                                className={`group cursor-pointer transition-all hover:bg-slate-50/70 relative ${selectedClaim?._id === claim._id ? 'bg-blue-50/40' : ''}`}
                                            >
                                                {selectedClaim?._id === claim._id && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1a2744]" />
                                                )}
                                                <td className="pl-8 pr-4 py-6">
                                                    <span className="text-[14px] font-bold text-[#1a2744]">#CL-{claim._id.slice(-4).toUpperCase()}</span>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <span className="text-[14px] font-bold text-slate-700">{claim.user?.name || 'John Doe'}</span>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <span className="text-[14px] font-medium text-slate-500">{claim.userPolicy?.policy?.policyName || 'Life Premium'}</span>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <span className="text-[14px] font-medium text-slate-400">{claim.status}</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-[14px] font-black text-[#1a2744]">₹{claim.amount?.toLocaleString() || '5,000'}</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Claim Review */}
                <AnimatePresence>
                    {selectedClaim && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full lg:w-[420px] bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden sticky top-28"
                        >
                            {/* Panel Header */}
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1a2744]">Claim Review - #CL-{selectedClaim._id.slice(-4).toUpperCase()}</h3>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="px-2 py-0.5 bg-[#1a2744]/5 text-[#1a2744] text-[10px] font-bold uppercase tracking-widest rounded-md border border-slate-100">Active Review</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedClaim(null)} className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-10 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
                                {/* Customer Info Card */}
                                <div className="bg-[#f8fafc] rounded-3xl p-6 border border-slate-100">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden">
                                             <img 
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedClaim.user?.name || 'User'}`} 
                                                alt="Avatar" 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[16px] font-bold text-[#1a2744]">{selectedClaim.user?.name || 'John Doe'}</p>
                                            <p className="text-[12px] text-slate-400 font-medium">Customer ID: SH-{selectedClaim.user?._id?.slice(-5).toUpperCase() || '10293'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 pt-5">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Policy Plan</p>
                                            <p className="text-[13px] font-bold text-[#1a2744] leading-tight">{selectedClaim.userPolicy?.policy?.policyName || 'Life Premium Platinum'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Claim Amount</p>
                                            <p className="text-[15px] font-black text-emerald-600 leading-tight">₹{selectedClaim.amount?.toLocaleString() || '5,000.00'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Claim Details */}
                                <div className="space-y-4">
                                    <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.15em]">Claim Details</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[14px]">
                                            <span className="font-medium text-slate-400">Status</span>
                                            <span className="font-bold text-[#1a2744]">{selectedClaim.status || 'Personal Accident'}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[14px] font-medium text-slate-400">Description</p>
                                            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 italic text-[14px] text-slate-600 leading-relaxed">
                                                "{selectedClaim.description || 'Fracture sustained in a road accident on 20th Oct. Requires reimbursement for emergency care and follow-up surgery.'}"
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Supporting Documents */}
                                <div className="space-y-4">
                                    <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.15em]">Supporting Documents</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { name: 'Hospital_Bill.pdf', icon: FileText, color: 'bg-blue-50/50 text-blue-500' },
                                            { name: 'FIR_Report.pdf', icon: FileCheck, color: 'bg-slate-50 text-slate-500' },
                                            { name: 'X-Ray_Img.jpg', icon: Layout, color: 'bg-emerald-50/50 text-emerald-500' }
                                        ].map((doc, idx) => (
                                            <div key={idx} className="space-y-2 group cursor-pointer">
                                                <div className={`aspect-square rounded-2xl ${doc.color} border border-slate-100 flex items-center justify-center transition-all group-hover:scale-95 shadow-sm overflow-hidden`}>
                                                    {idx === 0 ? (
                                                        <img src="https://images.unsplash.com/photo-1586772002130-b0f3daa6288b?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover opacity-60" alt="doc" />
                                                    ) : (
                                                        <doc.icon size={28} />
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 text-center truncate px-1">{doc.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Verification */}
                                <div className="space-y-4 pt-2">
                                    <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.15em]">Verification Checklist</h4>
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${checklist.documentAuthenticity ? 'bg-[#1a2744] border-[#1a2744]' : 'border-slate-200 group-hover:border-slate-300 bg-white'}`}>
                                            <input 
                                                type="checkbox" 
                                                className="hidden" 
                                                checked={checklist.documentAuthenticity}
                                                onChange={() => setChecklist(prev => ({ ...prev, documentAuthenticity: !prev.documentAuthenticity }))}
                                            />
                                            {checklist.documentAuthenticity && <Check size={14} strokeWidth={4} className="text-white" />}
                                        </div>
                                        <span className="text-[14px] font-bold text-[#1a2744]">Document Authenticity</span>
                                    </label>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 flex flex-col gap-4 pb-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => handleStatusUpdate('Approved')}
                                            disabled={updateClaimMutation.isPending}
                                            className="h-14 bg-[#10b981] text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-[#059669] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <CheckCircle size={20} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate('Rejected')}
                                            disabled={updateClaimMutation.isPending}
                                            className="h-14 bg-[#ef4444] text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-[#dc2626] transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <X size={20} /> Reject
                                        </button>
                                    </div>
                                    <button 
                                        className="h-14 w-full bg-[#f59e0b] text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-[#d97706] transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                                        onClick={() => handleStatusUpdate('In Progress')}
                                    >
                                        <ArrowUpRight size={20} /> Escalate to Manager
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AgentClaims;

