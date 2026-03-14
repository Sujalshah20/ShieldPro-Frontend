import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { FileText, User, Shield, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const AgentApplications = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const [remarks, setRemarks] = useState("");

    const { data: applications, isLoading } = useQuery({
        queryKey: ['agentApps', user?.token],
        queryFn: () => api.get('/agent/applications', user.token),
        enabled: !!user?.token
    });

    const remarkMutation = useMutation({
        mutationFn: (data) => api.put(`/agent/applications/${data.id}/remarks`, { remarks: data.remarks }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['agentApps']);
            toast({ title: "Remarks Saved", description: "Internal note has been updated." });
            setSelectedApp(null);
        },
        onError: (err) => toast({
            title: "Update Failed",
            description: err?.errors?.[0]?.message || err?.message || "Failed to save remarks",
            variant: "destructive"
        })
    });

    const flagMutation = useMutation({
        mutationFn: (id) => api.put(`/agent/applications/${id}/flag`, {}, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['agentApps']);
            toast({ title: "Priority Updated", description: "Application flag status changed." });
        },
        onError: (err) => toast({
            title: "Flag Error",
            description: err?.message || "Could not update flag status",
            variant: "destructive"
        })
    });


    if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={6} /></div>;

    return (
        <div className="p-8 premium-gradient min-h-screen">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">Application <span className="text-gold">Review</span></h2>
                    <p className="opacity-70 font-medium text-lg">Monitor statuses and provide feedback for your leads.</p>
                </div>
                {applications?.filter(a => a.isFlagged).length > 0 && (
                     <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={18} />
                        <span className="text-xs font-bold text-red-500">{applications.filter(a => a.isFlagged).length} flagged for priority</span>
                     </div>
                )}
            </div>

            <div className="glass rounded-[3rem] border border-border/50 overflow-hidden">
                <div className="p-8 border-b border-border/10">
                    <h3 className="text-xl font-bold">Managed Applications</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                                <th className="px-8 py-5">Applicant</th>
                                <th className="px-8 py-5">Policy Plan</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Flag</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Action</th>
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
                                                <p className="text-[10px] opacity-40 uppercase tracking-widest leading-none mt-1">{app.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Shield size={16} className="text-gold" />
                                            <div>
                                                <p className="font-bold text-sm">{app.policy?.policyName}</p>
                                                <p className="text-[10px] opacity-40 uppercase tracking-widest">{app.policy?.policyType}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                                            app.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                                            app.status === 'Paid' ? 'bg-blue-500/10 text-blue-500' :
                                            app.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                            'bg-orange-500/10 text-orange-500'
                                        }`}>
                                            {app.status === 'Approved' ? <CheckCircle size={12} /> : 
                                             app.status === 'Rejected' ? <AlertCircle size={12} /> : 
                                             <Clock size={12} />}
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button 
                                            onClick={() => flagMutation.mutate(app._id)}
                                            className={`p-2 rounded-lg transition-all ${app.isFlagged ? 'bg-red-500 text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
                                        >
                                            <AlertCircle size={18} />
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-sm opacity-50 font-medium whitespace-nowrap">
                                        {new Date(app.appliedDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => {
                                                setSelectedApp(app);
                                                setRemarks(app.internalRemarks || "");
                                            }}
                                            className="px-6 py-2.5 bg-white/5 border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
                                        >
                                            Review
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {applications?.length === 0 && (
                        <div className="py-20 text-center opacity-30 italic">No applications found in your pipeline.</div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedApp(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            layoutId={selectedApp._id}
                            className="relative w-full max-w-lg glass-premium p-10 rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-black italic">Application Feedback</h3>
                                    <p className="text-xs opacity-50 uppercase tracking-widest font-bold mt-1">For {selectedApp.user?.name}</p>
                                </div>
                                <div className="p-3 bg-gold/10 rounded-2xl text-gold">
                                    <MessageSquare size={24} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 mb-2 block">Internal Agent Remarks</label>
                                    <textarea 
                                        className="w-full h-40 bg-white/5 border border-border/50 rounded-2xl p-6 outline-none focus:border-gold transition-all no-scrollbar"
                                        placeholder="Add notes for the Admin to review..."
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setSelectedApp(null)}
                                        className="flex-1 py-4 bg-white/5 border border-border/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => remarkMutation.mutate({ id: selectedApp._id, remarks })}
                                        className="flex-1 py-4 bg-gold text-gold-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/20"
                                    >
                                        Save Remarks
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentApplications;
