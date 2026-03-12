import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { FileText, Plus, Shield, CheckCircle, AlertCircle, Clock, Search, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const CustomerClaims = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isFiling, setIsFiling] = useState(false);
    const [formData, setFormData] = useState({ userPolicyId: "", amount: "", description: "" });
    const [files, setFiles] = useState([]);

    const { data: myClaims, isLoading } = useQuery({
        queryKey: ['myClaims', user?.token],
        queryFn: () => api.get('/claims', user.token),
        enabled: !!user?.token
    });

    const { data: activePolicies } = useQuery({
        queryKey: ['activePoliciesForClaims', user?.token],
        queryFn: () => api.get('/user-policies', user.token),
        enabled: !!user?.token && isFiling
    });

    const fileMutation = useMutation({
        mutationFn: (data) => api.post('/claims', data, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['myClaims']);
            toast({ title: "Claim Filed", description: "Your request has been submitted for investigation." });
            setIsFiling(false);
            setFormData({ userPolicyId: "", amount: "", description: "" });
            setFiles([]);
        },
        onError: (err) => {
            toast({ 
                title: "Filing Failed", 
                description: err?.errors?.[0]?.message || err?.message || "Submission failed", 
                variant: "destructive" 
            });
        }
    });

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selected]);
    };

    const handleFileRemove = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.userPolicyId || !formData.amount) return toast({ title: "Error", description: "Please fill all required fields." });
        
        // Mocking file upload URLs as backend currently expects strings
        const mockDocs = files.map(f => ({ name: f.name, url: `https://mock.shieldpro.com/${f.name}` }));
        
        fileMutation.mutate({
            ...formData,
            amount: Number(formData.amount),
            documents: mockDocs
        });
    };

    if (isLoading) return <div className="p-8"><TableSkeleton rows={8} cols={5} /></div>;

    return (
        <div className="p-8 premium-gradient min-h-screen">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">Claims <span className="text-gold">Center</span></h2>
                    <p className="opacity-70 font-medium text-lg">Report incidents and track your settlement progress.</p>
                </div>
                <button 
                    onClick={() => setIsFiling(true)}
                    className="px-8 py-4 bg-gold text-gold-foreground rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-lg shadow-gold/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={18} /> File New Claim
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {myClaims?.map((claim, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={claim._id}
                        className="glass p-8 rounded-[3rem] border border-border/50 hover:border-gold/30 transition-all flex flex-col md:flex-row items-center justify-between gap-8 group relative overflow-hidden"
                    >
                        <div className="flex items-center gap-6">
                             <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 ${
                                claim.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                                claim.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                'bg-gold/10 text-gold'
                             }`}>
                                <Shield size={36} />
                             </div>
                             <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold">Policy #{claim.userPolicy?.policyNumber}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        claim.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                                        claim.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                        'bg-zinc-100 dark:bg-white/10 opacity-60'
                                    }`}>
                                        {claim.status}
                                    </span>
                                </div>
                                <p className="text-sm opacity-50 font-medium mb-3 italic">Filed on {new Date(claim.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm opacity-80 leading-relaxed max-w-xl">{claim.description}</p>
                             </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-right">
                             <div className="text-[10px] font-black uppercase tracking-widest opacity-30">Claim Amount</div>
                             <div className="text-3xl font-black">₹{claim.amount.toLocaleString()}</div>
                             <button className="text-xs font-black text-gold uppercase tracking-widest mt-2 hover:underline">View Timeline</button>
                        </div>
                    </motion.div>
                ))}

                {myClaims?.length === 0 && !isFiling && (
                    <div className="py-24 text-center glass rounded-[3rem] border-2 border-dashed border-border">
                        <FileText size={64} className="mx-auto mb-4 opacity-10" />
                        <h3 className="text-2xl font-bold opacity-30 tracking-tight">No Claims History</h3>
                        <p className="opacity-20 font-medium">You haven't filed any claims yet. We're glad you're safe!</p>
                    </div>
                )}
            </div>

            {/* Filing Modal */}
            <AnimatePresence>
                {isFiling && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFiling(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div className="relative w-full max-w-2xl glass-premium p-12 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden">
                            <h3 className="text-3xl font-black italic mb-2 tracking-tight">Report <span className="text-gold">Incident</span></h3>
                            <p className="opacity-50 text-sm font-medium mb-10">Provide accurate details to speed up your settlement.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 mb-2 block">Select Active Policy</label>
                                    <select 
                                        className="w-full bg-white/5 border border-border/50 rounded-2xl p-5 outline-none focus:border-gold transition-all appearance-none cursor-pointer font-bold"
                                        value={formData.userPolicyId}
                                        onChange={e => setFormData({...formData, userPolicyId: e.target.value})}
                                        required
                                    >
                                        <option value="" className="bg-zinc-900">Choose your coverage...</option>
                                        {activePolicies?.map(p => (
                                            <option key={p._id} value={p._id} className="bg-zinc-900">
                                                {p.policy?.policyName} - {p.policyNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 block">Requested Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gold">₹</span>
                                            <input 
                                                type="number" 
                                                placeholder="0.00"
                                                className="w-full bg-white/5 border border-border/50 rounded-2xl p-5 pl-10 outline-none focus:border-gold transition-all font-bold"
                                                value={formData.amount}
                                                onChange={e => setFormData({...formData, amount: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 block">Upload Evidence</label>
                                        <div className="relative h-full">
                                            <input 
                                                type="file" 
                                                multiple 
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                onChange={handleFileChange}
                                            />
                                            <div className="h-[60px] bg-white/5 border border-border/50 rounded-2xl flex items-center justify-center gap-2 group-hover:border-gold transition-all">
                                                <Upload size={18} className="opacity-40" />
                                                <span className="text-xs font-bold opacity-40 italic">Add Receipts/Reports</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 block">Description of Incident</label>
                                    <textarea 
                                        className="w-full h-32 bg-white/5 border border-border/50 rounded-2xl p-6 outline-none focus:border-gold transition-all no-scrollbar"
                                        placeholder="What happened? Please be specific..."
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>

                                {files.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {files.map((f, i) => (
                                            <div key={i} className="px-4 py-2 bg-gold/10 rounded-xl text-[10px] font-bold text-gold flex items-center gap-2 border border-gold/20">
                                                <span className="truncate max-w-[100px]">{f.name}</span>
                                                <button type="button" onClick={() => handleFileRemove(i)}><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsFiling(false)}
                                        className="flex-1 py-5 bg-white/5 border border-border/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={fileMutation.isLoading}
                                        className="flex-3 py-5 bg-gold text-gold-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/20 disabled:opacity-50 font-bold"
                                    >
                                        {fileMutation.isLoading ? "Processing..." : "Submit Claim Request"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerClaims;