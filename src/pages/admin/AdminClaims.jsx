import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { FileText, User, ShieldCheck, CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const AdminClaims = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedClaim, setSelectedClaim] = useState(null);

    const { data: claims, isLoading } = useQuery({
        queryKey: ['adminClaims', user?.token],
        queryFn: () => api.get('/claims/all', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/claims/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminClaims']);
            toast({ title: "Claim Processed", description: `Status updated to ${statusMutation.variables.status}` });
            setSelectedClaim(null);
        }
    });

    if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={6} /></div>;

    const stats = {
        pending: claims?.filter(c => c.status === 'Pending').length || 0,
        investigating: claims?.filter(c => c.status === 'Investigation').length || 0,
        totalVolume: claims?.reduce((acc, curr) => acc + curr.amount, 0) || 0
    };

    return (
        <div className="p-8 premium-gradient min-h-screen">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">Claim <span className="text-gold">Settle</span></h2>
                    <p className="opacity-70 font-medium text-lg">Validate incident reports and authorize disbursements.</p>
                </div>
                <div className="flex gap-4">
                     <div className="px-8 py-5 glass rounded-[2.5rem] border border-gold/20 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Total Payouts</span>
                        <span className="text-2xl font-black text-gold">₹{(stats.totalVolume / 100000).toFixed(1)}L</span>
                     </div>
                </div>
            </div>

            {/* Dashboard Mini Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 {[
                    { label: "New Requests", value: stats.pending, color: "blue", icon: FileText },
                    { label: "In Investigation", value: stats.investigating, color: "orange", icon: Clock },
                    { label: "Approved Today", value: claims?.filter(c => c.status === 'Approved').length || 0, color: "green", icon: CheckCircle }
                 ].map((stat, i) => (
                    <div key={i} className="glass p-8 rounded-[3rem] border border-border/50 flex items-center justify-between group hover:border-gold/30 transition-all">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{stat.label}</p>
                            <h4 className="text-4xl font-black">{stat.value}</h4>
                        </div>
                        <div className={`p-5 bg-${stat.color}-500/10 text-${stat.color}-500 rounded-3xl group-hover:bg-${stat.color}-500 group-hover:text-white transition-all`}>
                            <stat.icon size={32} />
                        </div>
                    </div>
                 ))}
            </div>

            <div className="glass rounded-[3rem] border border-border/50 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-border/10">
                    <h3 className="text-xl font-bold">Investigation Queue</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                                <th className="px-8 py-6">Claimant</th>
                                <th className="px-8 py-6">Policy Details</th>
                                <th className="px-8 py-6">Requested Amount</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Operation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {claims?.map((claim, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={claim._id} 
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold">{claim.user?.name}</p>
                                                <p className="text-[10px] opacity-40 uppercase tracking-widest mt-0.5">{claim.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{claim.userPolicy?.policy?.policyName}</span>
                                            <span className="text-[10px] opacity-40 uppercase tracking-widest">#{claim.userPolicy?.policyNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-lg">₹{claim.amount.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                                            claim.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                                            claim.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                            claim.status === 'Investigation' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-orange-500/10 text-orange-500'
                                        }`}>
                                            {claim.status === 'Approved' ? <CheckCircle size={12} /> : 
                                             claim.status === 'Rejected' ? <XCircle size={12} /> : 
                                             <Clock size={12} />}
                                            {claim.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => setSelectedClaim(claim)}
                                            className="px-6 py-2.5 bg-white/5 border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
                                        >
                                            Review Case
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Case Review Modal */}
            <AnimatePresence>
                {selectedClaim && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedClaim(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div className="relative w-full max-w-2xl glass-premium p-12 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden">
                            <h3 className="text-3xl font-black italic mb-2 tracking-tight">Case <span className="text-gold">Review</span></h3>
                            <p className="opacity-50 text-sm font-medium mb-10 uppercase tracking-[0.2em]">{selectedClaim._id}</p>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-2">Claimant Info</p>
                                        <p className="font-bold text-lg">{selectedClaim.user?.name}</p>
                                        <p className="text-sm opacity-60 italic">Member since {new Date(selectedClaim.user?.createdAt || Date.now()).getFullYear()}</p>
                                    </div>
                                    <div className="p-6 bg-gold/5 rounded-3xl border border-gold/20">
                                        <p className="text-[10px] font-black uppercase text-gold tracking-widest mb-2">Requested Settle</p>
                                        <div className="text-4xl font-black italic">₹{selectedClaim.amount.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="p-8 bg-zinc-900 text-white rounded-[3rem] border border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-4">Incident Report</p>
                                    <p className="text-sm opacity-80 leading-relaxed italic">{selectedClaim.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Investigation' })}
                                    className="py-5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    Investigate
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Approved' })}
                                    className="py-5 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 transition-all"
                                >
                                    Authorise Payout
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedClaim._id, status: 'Rejected' })}
                                    className="py-5 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-105 transition-all"
                                >
                                    Decline Claim
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminClaims;