import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { Users, Mail, Phone, ExternalLink, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const AgentClients = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [applyingFor, setApplyingFor] = useState(null);
    const [selectedPolicy, setSelectedPolicy] = useState("");

    const { data: clients, isLoading } = useQuery({
        queryKey: ['agentClients', user?.token],
        queryFn: () => api.get('/agent/customers', user.token),
        enabled: !!user?.token
    });

    const { data: policies } = useQuery({
        queryKey: ['agentPoliciesSelect', user?.token],
        queryFn: () => api.get('/policies', user.token),
        enabled: !!applyingFor
    });

    const applyMutation = useMutation({
        mutationFn: (data) => api.post('/agent/apply-on-behalf', data, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['agentClients']);
            toast({ title: "Application Submitted", description: "The customer will be notified." });
            setApplyingFor(null);
            setSelectedPolicy("");
        },
        onError: (err) => {
            toast({ title: "Application Failed", description: err.message, variant: "destructive" });
        }
    });

    const handleApply = () => {
        if (!selectedPolicy) return toast({ title: "Error", description: "Please select a policy." });
        applyMutation.mutate({
            customerId: applyingFor._id,
            policyId: selectedPolicy,
            formData: { appliedBy: "Agent", source: "Manual" }
        });
    };

    if (isLoading) return <div className="p-8"><TableSkeleton rows={8} cols={5} /></div>;

    return (
        <div className="p-8 premium-gradient min-h-screen">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">My <span className="text-gold">Clients</span></h2>
                    <p className="opacity-70 font-medium text-lg">Manage your assigned customers and their protection status.</p>
                </div>
                <div className="flex gap-4">
                     <div className="px-6 py-3 glass rounded-2xl border border-gold/20 flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Capacity</span>
                        <span className="text-xl font-bold">{clients?.length || 0} / 50</span>
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients?.map((client, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={client._id} 
                        className="glass p-8 rounded-[2.5rem] border border-border/50 hover:border-gold/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users size={80} />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-gold-foreground transition-all shrink-0">
                                <span className="text-2xl font-black">{client.name.charAt(0)}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold leading-tight">{client.name}</h3>
                                <p className="text-xs font-bold text-gold uppercase tracking-widest">{client.isVerified ? 'Verified Citizen' : 'Verification Pending'}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-sm opacity-60">
                                <Mail size={16} className="text-gold" />
                                {client.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm opacity-60">
                                <Phone size={16} className="text-gold" />
                                {client.phone}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                             <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Policies</p>
                                <p className="text-lg font-black">{client.activePolicyCount || 0}</p>
                             </div>
                             <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Apps</p>
                                <p className="text-lg font-black">{client.applicationCount || 0}</p>
                             </div>
                        </div>

                        <div className="flex gap-2">
                             <button className="flex-1 py-4 bg-gold/5 border border-gold/10 rounded-2xl text-xs font-bold hover:bg-gold hover:text-gold-foreground transition-all flex items-center justify-center gap-2">
                                Profile <ExternalLink size={14} />
                             </button>
                             <button 
                                onClick={() => setApplyingFor(client)}
                                className="flex-1 py-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-xs font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                             >
                                Apply Behalf <FileText size={14} />
                             </button>
                        </div>
                    </motion.div>
                ))}

                {clients?.length === 0 && (
                    <div className="col-span-full py-20 text-center glass rounded-[3rem]">
                        <Users size={64} className="mx-auto mb-4 opacity-20" />
                        <h3 className="text-2xl font-bold opacity-40">No Assigned Customers</h3>
                        <p className="opacity-30">Please contact Admin to get leads assigned to your portfolio.</p>
                    </div>
                )}
            </div>

            {/* Apply on Behalf Modal */}
            <AnimatePresence>
                {applyingFor && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApplyingFor(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div className="relative w-full max-w-md glass-premium p-10 rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden">
                            <h3 className="text-2xl font-black mb-1">New Application</h3>
                            <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-8">On behalf of {applyingFor.name}</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 mb-2 block">Select Insurance Plan</label>
                                    <select 
                                        className="w-full bg-white/5 border border-border/50 rounded-2xl p-4 outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                                        value={selectedPolicy}
                                        onChange={(e) => setSelectedPolicy(e.target.value)}
                                    >
                                        <option value="" className="bg-zinc-900">Choose a policy...</option>
                                        {policies?.map(p => (
                                            <option key={p._id} value={p._id} className="bg-zinc-900">{p.policyName} (₹{p.premiumAmount})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                    <p className="text-[10px] leading-relaxed opacity-70">Note: Applying on behalf will tag this application as Agent-Initiated. The customer will need to verify details later.</p>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setApplyingFor(null)} className="flex-1 py-4 bg-white/5 border border-border/50 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                                    <button 
                                        onClick={handleApply}
                                        disabled={applyMutation.isLoading}
                                        className="flex-1 py-4 bg-gold text-gold-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/20 disabled:opacity-50"
                                    >
                                        {applyMutation.isLoading ? "Processing..." : "Submit Application"}
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

export default AgentClients;
