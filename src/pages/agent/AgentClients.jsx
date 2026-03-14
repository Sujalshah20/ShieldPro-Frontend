import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Users, Mail, Phone, ExternalLink, FileText, 
    ShieldCheck, Search, Activity, Target, 
    Fingerprint, Globe, Command, Briefcase,
    ChevronRight, ArrowLeft, IndianRupee, Zap,
    Shield, Lock, Award, Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AgentClients = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [applyingFor, setApplyingFor] = useState(null);
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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
            toast({ title: "PROTOCOL_TRIGGERED", description: "The asset protection sequence has been successfully initialized for the entity." });
            setApplyingFor(null);
            setSelectedPolicy("");
        },
        onError: (err) => {
            toast({ 
                title: "INIT_FAILURE", 
                description: err?.errors?.[0]?.message || err?.message || "Operational anomaly detected during mainframe request.", 
                variant: "destructive" 
            });
        }
    });

    const handleApply = () => {
        if (!selectedPolicy) return toast({ title: "PARAM_MISSING", description: "Select a valid asset class before initialization.", variant: "destructive" });
        applyMutation.mutate({
            customerId: applyingFor._id,
            policyId: selectedPolicy,
            formData: { appliedBy: "FieldAgent", source: "Mainframe_Direct" }
        });
    };

    const filteredClients = clients?.filter(c => 
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
            <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {[1,2,3].map(i => <div key={i} className="h-96 bg-white rounded-[2.5rem] animate-pulse" />)}
            </div>
        </div>
    );

    return (
        <div className="agent-clients p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Entity Matrix</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Portfolio optimization and asset protection coordination. Signal: Locked.</p>
                </div>
                
                <div className="relative group w-full xl:w-96 shadow-xl shadow-black/5">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0082a1] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="FILTER ENTITIES..." 
                        className="pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-2xl outline-none w-full transition-all font-bold text-[10px] uppercase tracking-widest text-[#012b3f] focus:border-[#0082a1]" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredClients?.map((client, idx) => (
                    <motion.div 
                        key={client._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white p-10 rounded-[3rem] border border-white shadow-2xl relative overflow-hidden group hover:border-[#0082a1]/30 transition-all duration-500 min-h-[450px] flex flex-col"
                    >
                         <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]">
                            <Fingerprint size={250} className="text-[#012b3f]" />
                         </div>
                         
                         <div className="flex items-center gap-6 mb-10 relative z-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#0082a1]/20 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500" />
                                <div className="relative w-20 h-20 bg-[#012b3f] rounded-[1.5rem] flex items-center justify-center text-[#0082a1] border border-white/10 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                                    <span className="text-3xl font-black uppercase italic">{client.name.charAt(0)}</span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-xl">
                                    <div className={`w-2.5 h-2.5 rounded-full ${client.isVerified ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 animate-pulse'}`} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-[#012b3f] leading-none mb-2 group-hover:text-[#0082a1] transition-colors">{client.name}</h3>
                                <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-[#012b3f] group-hover:text-white transition-all w-fit">
                                    {client.isVerified ? 'ID VALIDATED' : 'VETTING PENDING'}
                                </div>
                            </div>
                         </div>

                         <div className="space-y-4 mb-8 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                                <Mail size={14} className="text-[#0082a1]" /> {client.email}
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                                <Phone size={14} className="text-[#0082a1]" /> {client.phone}
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4 mb-10 relative z-10 flex-1">
                            <div className="p-6 bg-[#012b3f] text-white rounded-[1.8rem] border border-white/5 shadow-xl relative overflow-hidden group/sub">
                                 <div className="absolute inset-0 bg-gradient-to-br from-[#0082a1]/10 to-transparent" />
                                 <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">ASSETS</p>
                                 <div className="flex items-center gap-3 relative z-10">
                                    <span className="text-3xl font-black tracking-tight">{client.activePolicyCount || 0}</span>
                                    <Shield size={16} className="text-[#0082a1]" />
                                 </div>
                            </div>
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.8rem] shadow-xl relative overflow-hidden hover:border-[#0082a1]/30 transition-all">
                                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 mb-2">PIPELINE</p>
                                 <div className="flex items-center gap-3 relative z-10">
                                    <span className="text-3xl font-black tracking-tight text-[#012b3f]">{client.applicationCount || 0}</span>
                                    <Target size={16} className="text-[#012b3f] opacity-20" />
                                 </div>
                            </div>
                         </div>

                         <div className="flex gap-4 relative z-10 mt-auto">
                            <button className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#012b3f] hover:text-[#0082a1] transition-all shadow-sm active:scale-95 group/btn">
                                <Activity size={20} strokeWidth={2.5} />
                            </button>
                            <button 
                                onClick={() => setApplyingFor(client)}
                                className="flex-1 h-14 bg-[#012b3f] text-[#0082a1] rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-4 shadow-xl hover:bg-[#0082a1] hover:text-white transition-all active:scale-95 group/btn border border-white/5"
                            >
                                INITIATE PROTOCOL <Zap size={16} fill="currentColor" className="group-hover/btn:animate-pulse" />
                            </button>
                         </div>
                    </motion.div>
                ))}
            </div>

            {/* Application Overlay Console */}
            <AnimatePresence>
                {applyingFor && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApplyingFor(null)} className="absolute inset-0 bg-[#012b3f]/90 backdrop-blur-3xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white p-12 md:p-16 rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-[#0082a1]/10 rounded-full blur-[100px] pointer-events-none" />
                            
                            <div className="flex items-center gap-8 mb-12 relative z-10">
                                <div className="w-16 h-16 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl">
                                    <Zap size={28} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#012b3f] leading-none mb-2">Initiate Protocol</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target: <span className="text-[#0082a1]">{applyingFor.name}</span></p>
                                </div>
                            </div>

                            <div className="space-y-10 relative z-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] mb-4 block ml-1">Asset Class Selection</label>
                                    <div className="relative group">
                                        <select 
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-10 font-bold uppercase text-[10px] tracking-widest outline-none focus:border-[#0082a1] focus:bg-white shadow-inner transition-all appearance-none cursor-pointer text-[#012b3f]"
                                            value={selectedPolicy}
                                            onChange={(e) => setSelectedPolicy(e.target.value)}
                                        >
                                            <option value="">Choose Asset Class...</option>
                                            {policies?.map(p => (
                                                <option key={p._id} value={p._id}>{p.policyName.toUpperCase()} (₹{p.premiumAmount?.toLocaleString()})</option>
                                            ))}
                                        </select>
                                        <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="p-6 bg-[#012b3f] text-white rounded-2xl border border-white/5 relative overflow-hidden group/warn">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Shield size={40} className="text-[#0082a1]" />
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#0082a1] mb-2 flex items-center gap-2">
                                        <Terminal size={12} /> PROTOCOL ADVISORY
                                    </p>
                                    <p className="text-[9px] leading-relaxed font-bold text-white/30 uppercase tracking-widest">Direct field initialization will trigger the FIELD_OFFICE_SYNC flag. Manual verification mandatory post-submission.</p>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setApplyingFor(null)} 
                                        className="h-16 px-8 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#012b3f] hover:text-white transition-all flex items-center justify-center"
                                    >
                                        Abort Ops
                                    </button>
                                    <button 
                                        onClick={handleApply}
                                        disabled={applyMutation.isLoading}
                                        className="flex-1 h-16 bg-[#0082a1] text-white rounded-xl text-[10px] font-black uppercase tracking-[3px] shadow-xl hover:bg-[#012b3f] transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                                    >
                                        {applyMutation.isLoading ? "Syncing..." : "Commit Protocol"}
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
