import React, { useState, useContext } from "react";
import { 
    Search, Clock, AlertCircle, CheckCircle, 
    FileText, User, Eye, X, ChevronRight,
    ShieldCheck, Layers, MessageSquare, Download,
    Layout, Loader2
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
        incidentReport: false,
        damagePhotos: false,
        identityProof: false,
        policeReport: false
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
            queryClient.invalidateQueries(['recentClaims']);
            setSelectedClaim(null);
            setAuditNotes("");
            setChecklist({ incidentReport: false, damagePhotos: false, identityProof: false, policeReport: false });
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
        queryFn: () => api.get('/agent/claims', user.token),
        enabled: !!user?.token
    });

    const statusTabs = ['All Claims', 'Pending', 'In Progress', 'Approved', 'Rejected'];

    const filteredClaims = claims?.filter(claim => {
        const matchesSearch = claim.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            claim._id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeStatusTab === 'All Claims' || 
                          claim.status === activeStatusTab;
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
            {/* Left Content: Claims List */}
            <div className={`flex-1 flex flex-col gap-6 transition-all duration-500 pb-10 ${selectedClaim ? 'lg:mr-[420px]' : ''}`}>
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] mb-2 italic">
                        <Link to="/agent" className="hover:text-black hover:opacity-100 transition-colors uppercase italic font-black">Dashboard</Link>
                        <ChevronRight size={12} className="opacity-40" />
                        <span className="text-black opacity-100 italic">Claims to Process</span>
                    </div>
                    <h1 className="text-2xl font-black text-black tracking-tighter italic uppercase">Claims to Process_</h1>
                    <p className="text-[10px] font-black text-black opacity-30 mt-1 uppercase tracking-[4px] italic leading-relaxed">Audit and verify settlement requests from policyholders // NEXUS_AUDIT</p>
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
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search claims..." 
                                className="w-full pl-9 pr-4 h-9 bg-slate-50 border-none rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-[#1e293b]/5 transition-all text-slate-600"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="h-9 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 hover:bg-slate-50 transition-all italic shadow-inner">
                            <Download size={14} strokeWidth={3} /> Export
                        </button>
                    </div>
                </div>

                {/* Claims Ledger Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-white">
                                    <th className="pl-8 pr-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Incident ID</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Policyholder</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Type</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic text-center">Filed Date</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic text-center">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] italic text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredClaims?.map(claim => (
                                    <tr 
                                        key={claim._id} 
                                        className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedClaim?._id === claim._id ? 'bg-[#f1f5f9]' : ''}`}
                                        onClick={() => setSelectedClaim(claim)}
                                    >
                                        <td className="pl-8 pr-4 py-5">
                                            <span className="text-[12px] font-bold text-[#1e293b]">CLM-{claim._id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center text-[10px] font-black italic shadow-3xl border border-white/10 uppercase">
                                                    {claim.userId?.name?.charAt(0)}
                                                </div>
                                                <span className="text-[12px] font-black text-black italic uppercase tracking-tighter">{claim.userId?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[10px] font-black text-black opacity-40 uppercase tracking-widest italic">{claim.policyId?.title || "Standard Claim"}</span>
                                        </td>
                                        <td className="px-4 py-5 text-center">
                                            <span className="text-[10px] font-black text-black opacity-40 uppercase tracking-widest italic">
                                                {new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2023' })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5 text-center">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                                    claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                                    claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                                                    'bg-orange-50 text-orange-600'
                                                }`}>
                                                    {claim.status}
                                                </span>
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

            {/* Right Panel: Review Claim */}
            <AnimatePresence>
                {selectedClaim && (
                    <motion.div 
                        initial={{ x: 420, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 420, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-[88px] right-6 bottom-6 w-full lg:w-[400px] bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-200 flex flex-col z-50 overflow-hidden"
                    >
                        {/* Panel Header */}
                        <div className="p-6 bg-black text-white flex items-center justify-between border-b border-white/5 shadow-3xl">
                            <div>
                                <h3 className="text-[16px] font-black tracking-tighter italic uppercase leading-none">Review Claim_</h3>
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[4px] mt-0.5 italic">Incident ID: CLM-{selectedClaim._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedClaim(null)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                                <X size={16} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
                            {/* Claimant Details */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">
                                    <User size={12} className="text-black opacity-20" strokeWidth={3} /> Claimant Details
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-y-4 gap-x-2 shadow-inner">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Full Name</p>
                                        <p className="text-[12px] font-black text-black italic leading-none">{selectedClaim.userId?.name}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Incident Date</p>
                                        <p className="text-[12px] font-black text-black italic leading-none">Oct 12, 2023</p>
                                    </div>
                                    <div className="col-span-2 space-y-0.5 mt-2">
                                        <p className="text-[9px] font-black text-black opacity-30 uppercase tracking-[3px] italic">Policy Coverage</p>
                                        <p className="text-[11px] font-black text-black uppercase tracking-widest italic">{selectedClaim.policyId?.title || "Standard Comprehensive"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Proof of Loss Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">
                                    <Eye size={12} className="text-black opacity-20" strokeWidth={3} /> Proof of Loss
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: 'Damage Photo', color: 'bg-rose-50 text-rose-600', icon: Layout },
                                        { label: 'Police Rpt', color: 'bg-sky-50 text-sky-600', icon: FileText },
                                        { label: 'Estimate', color: 'bg-emerald-50 text-emerald-600', icon: ShieldCheck }
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

                            {/* Settlement Checklist */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">
                                    <Layers size={12} className="text-black opacity-20" strokeWidth={3} /> Settlement Checklist
                                </div>
                                <div className="space-y-2.5">
                                    {[
                                        { id: 'incidentReport', label: 'Incident details verified' },
                                        { id: 'damagePhotos', label: 'Damage evidence confirmed' },
                                        { id: 'identityProof', label: 'Claimant identity verified' },
                                        { id: 'policeReport', label: 'Police report cross-checked' }
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

                            {/* Settlement Notes */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">
                                    <MessageSquare size={12} className="text-black opacity-20" strokeWidth={3} /> Audit Notes
                                </div>
                                <div className="relative group">
                                    <textarea 
                                        className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3.5 text-[12px] font-semibold text-slate-600 outline-none focus:ring-4 focus:ring-slate-50 transition-all resize-none italic"
                                        placeholder="Add settlement notes or audit comments..."
                                        value={auditNotes}
                                        onChange={(e) => setAuditNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer Actions */}
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleStatusUpdate('Approved')}
                                    disabled={updateClaimMutation.isPending}
                                    className="h-11 bg-[#10b981] text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#059669] transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-60"
                                >
                                    {updateClaimMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} Approve
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate('Rejected')}
                                    disabled={updateClaimMutation.isPending}
                                    className="h-11 bg-[#ef4444] text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#dc2626] transition-all shadow-lg shadow-rose-500/10 disabled:opacity-60"
                                >
                                    {updateClaimMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />} Reject
                                </button>
                            </div>
                            <button 
                                onClick={() => handleStatusUpdate('In Progress')}
                                disabled={updateClaimMutation.isPending}
                                className="w-full h-11 bg-white border border-slate-200 text-[#64748b] rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-[#1e293b] transition-all disabled:opacity-60"
                            >
                                <FileText size={16} /> Mark In Progress
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentClaims;
