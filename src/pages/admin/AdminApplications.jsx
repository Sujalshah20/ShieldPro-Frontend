import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { Shield, User, CheckCircle, XCircle, Clock, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const AdminApplications = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const { data: applications, isLoading } = useQuery({
        queryKey: ['adminApps', user?.token],
        queryFn: () => api.get('/applications', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/applications/${data.id}/status`, { status: data.status, rejectionReason: data.reason }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminApps']);
            toast({ title: "Status Updated", description: "Application status has been changed successfully." });
            setSelectedApp(null);
            setRejectionReason("");
        }
    });

    if (isLoading) return <div className="p-8"><TableSkeleton rows={12} cols={6} /></div>;

    const stats = {
        pending: applications?.filter(a => a.status === 'Pending' || a.status === 'Under Review').length || 0,
        flagged: applications?.filter(a => a.isFlagged).length || 0,
        total: applications?.length || 0
    };

    return (
        <div className="p-8 premium-gradient min-h-screen">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">System <span className="text-gold">Applications</span></h2>
                    <p className="opacity-70 font-medium text-lg">Process insurance requests and verify customer data.</p>
                </div>
                <div className="flex gap-4">
                     <div className="px-6 py-4 glass rounded-3xl border border-border/50 flex flex-col items-center min-w-[120px]">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Pending</span>
                        <span className="text-2xl font-black text-orange-500">{stats.pending}</span>
                     </div>
                     <div className="px-6 py-4 glass rounded-3xl border border-red-500/20 flex flex-col items-center min-w-[120px]">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Flagged</span>
                        <span className="text-2xl font-black text-red-500">{stats.flagged}</span>
                     </div>
                </div>
            </div>

            <div className="glass rounded-[3rem] border border-border/50 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-border/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="text-gold" /> Application Queue
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                                <th className="px-8 py-6">Applicant</th>
                                <th className="px-8 py-6">Policy</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Priority</th>
                                <th className="px-8 py-6">Agent Info</th>
                                <th className="px-8 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {applications?.map((app, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={app._id} 
                                    className={`hover:bg-white/5 transition-colors group ${app.isFlagged ? 'bg-red-500/5' : ''}`}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold">{app.user?.name}</p>
                                                <p className="text-[10px] opacity-40 uppercase tracking-widest mt-0.5">{app.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Shield size={16} className="text-gold" />
                                            <span className="text-sm font-medium">{app.policy?.policyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                                            app.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                                            app.status === 'Paid' ? 'bg-blue-500/10 text-blue-500' :
                                            app.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                            app.status === 'On Hold' ? 'bg-amber-500/10 text-amber-500' :
                                            'bg-orange-500/10 text-orange-500'
                                        }`}>
                                            {app.status === 'Approved' ? <CheckCircle size={12} /> : 
                                             app.status === 'Rejected' ? <XCircle size={12} /> : 
                                             app.status === 'On Hold' ? <AlertCircle size={12} /> :
                                             <Clock size={12} />}
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {app.isFlagged ? (
                                            <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                                <AlertCircle size={14} /> Priority
                                            </span>
                                        ) : (
                                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest opacity-30">Normal</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {app.agent ? (
                                             <div className="flex flex-col">
                                                <span className="text-xs font-bold">{app.agent.name}</span>
                                                <span className="text-[10px] opacity-40 uppercase tracking-widest">Assigned</span>
                                             </div>
                                        ) : (
                                            <span className="text-[10px] opacity-30 italic">Direct Sale</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="px-6 py-2.5 bg-gold text-gold-foreground rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/10 hover:brightness-110 transition-all"
                                        >
                                            Process
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Processing Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div className="relative w-full max-w-2xl glass-premium p-12 rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-3xl font-black italic">Process Application</h3>
                                    <p className="text-xs opacity-50 uppercase tracking-widest font-bold mt-1">Ref ID: {selectedApp._id}</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${selectedApp.isFlagged ? 'bg-red-500 text-white' : 'bg-gold/10 text-gold'}`}>
                                    {selectedApp.isFlagged ? <AlertCircle size={32} /> : <FileText size={32} />}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-2">Customer Details</p>
                                        <p className="font-bold text-lg">{selectedApp.user?.name}</p>
                                        <p className="text-sm opacity-60 mb-4">{selectedApp.user?.email}</p>
                                        <button className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-widest hover:underline">
                                            View Full Profile <ExternalLink size={12} />
                                        </button>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-2">Policy Requested</p>
                                        <p className="font-bold text-lg">{selectedApp.policy?.policyName}</p>
                                        <p className="text-sm text-gold font-bold">₹{selectedApp.policy?.premiumAmount.toLocaleString()} / year</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-6 bg-gold/5 rounded-2xl border border-gold/20 h-full">
                                        <p className="text-[10px] font-black uppercase text-gold tracking-widest mb-2">Agent Notes</p>
                                        <p className="text-sm italic opacity-80 leading-relaxed">
                                            {selectedApp.internalRemarks || "No remarks provided by the agent."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 mb-2 block">Decision Note (Sent to client on rejection)</label>
                                    <textarea 
                                        className="w-full h-32 bg-white/5 border border-border/50 rounded-2xl p-6 outline-none focus:border-gold transition-all"
                                        placeholder="Reason for decision..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Approved' })}
                                    className="flex-1 py-5 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} /> Approve Application
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'Rejected', reason: rejectionReason })}
                                    className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    <XCircle size={18} /> Reject Request
                                </button>
                                <button 
                                    onClick={() => statusMutation.mutate({ id: selectedApp._id, status: 'On Hold', reason: rejectionReason })}
                                    className="flex-1 py-5 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    <AlertCircle size={18} /> Mark On Hold
                                </button>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="px-8 py-5 bg-white/5 border border-border/50 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminApplications;
