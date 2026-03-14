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
    Shield
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
            toast({ title: "APPLICATION_INITIALIZED", description: "The asset protection protocol has been triggered for the entity." });
            setApplyingFor(null);
            setSelectedPolicy("");
        },
        onError: (err) => {
            toast({ 
                title: "INITIATION_FAILURE", 
                description: err?.errors?.[0]?.message || err?.message || "Operational anomaly detected during request.", 
                variant: "destructive" 
            });
        }
    });

    const handleApply = () => {
        if (!selectedPolicy) return toast({ title: "PARAM_MISSING", description: "Select a valid asset class before initialization." });
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

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={8} cols={5} /></div>;

    return (
        <div className="agent-clients p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Mission Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 2px, transparent 0)`, backgroundSize: '60px 60px' }} />

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                             <div className="w-2.5 h-12 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                ENTITY<span className="text-primary tracking-normal ml-3">_MATRIX</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-9">
                            Portfolio optimization and asset protection coordination
                        </p>
                    </div>
                    
                    <div className="relative group min-w-[320px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="FILTER_ENTITIES..." 
                            className="pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full transition-all font-bold text-[10px] uppercase tracking-[4px] text-header-bg shadow-xl" 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredClients?.map((client, idx) => (
                    <Reveal key={client._id} width="100%" delay={idx * 0.05} direction="up">
                        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500 min-h-[420px] flex flex-col">
                             <div className="absolute top-[-20%] right-[-10%] opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]">
                                <Fingerprint size={300} className="text-header-bg" />
                             </div>
                             
                             <div className="flex items-center gap-6 mb-10 relative z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500" />
                                    <div className="relative w-24 h-24 bg-header-bg rounded-[2rem] flex items-center justify-center text-white border border-white/10 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-header-bg/20">
                                        <span className="text-4xl font-black uppercase italic">{client.name.charAt(0)}</span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-xl">
                                        <div className={`w-3 h-3 rounded-full ${client.isVerified ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-header-bg leading-none mb-3 group-hover:text-primary transition-colors">{client.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="px-5 py-1.5 bg-slate-50 rounded-full text-[8px] font-black uppercase tracking-[3px] text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                            {client.isVerified ? 'ID_VALIDATED' : 'VETTING_PENDING'}
                                        </div>
                                    </div>
                                </div>
                             </div>

                             <div className="space-y-6 mb-12 relative z-10">
                                <div className="flex items-center gap-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-primary/20 transition-all">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-[1px] lowercase truncate">{client.email}</span>
                                </div>
                                <div className="flex items-center gap-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-primary/20 transition-all">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                        <Phone size={16} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-[3px]">{client.phone}</span>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-6 mb-12 relative z-10 flex-1">
                                <div className="p-8 bg-header-bg text-white rounded-[2.5rem] border border-white/5 shadow-xl group/card relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                                     <p className="text-[9px] font-black uppercase tracking-[4px] text-white/30 mb-2 relative z-10">POLICIES</p>
                                     <div className="flex items-center gap-4 relative z-10">
                                        <span className="text-4xl font-black tracking-tighter">{client.activePolicyCount || 0}</span>
                                        <Shield size={18} className="text-primary" />
                                     </div>
                                </div>
                                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl group/card relative overflow-hidden hover:border-primary/30 transition-all">
                                     <p className="text-[9px] font-black uppercase tracking-[4px] text-slate-300 mb-2 relative z-10">APPS</p>
                                     <div className="flex items-center gap-4 relative z-10">
                                        <span className="text-4xl font-black tracking-tighter text-header-bg">{client.applicationCount || 0}</span>
                                        <Target size={18} className="text-primary opacity-30" />
                                     </div>
                                </div>
                             </div>

                             <div className="flex gap-6 relative z-10 mt-auto">
                                <button className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-header-bg hover:text-white transition-all shadow-xl active:scale-95 group/btn">
                                    <Target size={24} strokeWidth={2.5} className="group-hover/btn:scale-110" />
                                </button>
                                <button 
                                    onClick={() => setApplyingFor(client)}
                                    className="flex-1 h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[4px] text-[10px] flex items-center justify-center gap-6 shadow-2xl shadow-primary/20 hover:bg-header-bg transition-all active:scale-95 group/btn"
                                >
                                    INIT_PROTOCOL <Zap size={18} fill="currentColor" className="group-hover/btn:animate-bounce" />
                                </button>
                             </div>
                        </div>
                    </Reveal>
                ))}

                {filteredClients?.length === 0 && (
                    <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border border-slate-200 shadow-2xl">
                        <Users size={80} className="mx-auto mb-8 text-slate-200" strokeWidth={1} />
                        <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg mb-4">NO_ENTITIES_ASSIGNED</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[6px] italic">Awaiting workforce redistribution from the mainframe.</p>
                    </div>
                )}
            </div>

            {/* Application Protocol Console */}
            <AnimatePresence>
                {applyingFor && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApplyingFor(null)} className="absolute inset-0 bg-header-bg/95 backdrop-blur-3xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-2xl bg-white p-16 md:p-20 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-[-30%] right-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
                            
                            <div className="flex items-center gap-10 mb-16 relative z-10">
                                <div className="w-24 h-24 bg-header-bg rounded-[2.5rem] flex items-center justify-center text-primary shadow-2xl border border-white/10">
                                    <Zap size={40} strokeWidth={3} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-4xl font-black uppercase tracking-tighter text-header-bg leading-none">INIT_PROTOCOL</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] flex items-center gap-3">
                                        TARGET: <span className="text-primary">{applyingFor.name.toUpperCase()}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-12 relative z-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-5 block ml-2">ASSET_CLASS_SELECTION</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Shield size={20} />
                                        </div>
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-3xl pl-16 pr-10 py-6 font-black uppercase text-xs tracking-[4px] outline-none focus:border-primary focus:bg-white shadow-xl transition-all appearance-none cursor-pointer text-header-bg"
                                            value={selectedPolicy}
                                            onChange={(e) => setSelectedPolicy(e.target.value)}
                                        >
                                            <option value="" className="bg-white">CHOOSE_ASSET_CLASS...</option>
                                            {policies?.map(p => (
                                                <option key={p._id} value={p._id} className="bg-white">{p.policyName.toUpperCase()} (₹{p.premiumAmount?.toLocaleString()})</option>
                                            ))}
                                        </select>
                                        <ChevronRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] border border-white/5 relative overflow-hidden group/warn">
                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                        <Command size={60} className="text-primary group-hover:rotate-12 transition-transform duration-1000" />
                                    </div>
                                    <div className="flex gap-6 mb-4 relative z-10">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-ping mt-1.5" />
                                        <p className="text-[11px] font-black uppercase tracking-[6px] text-primary">PROTOCOL_NOTE</p>
                                    </div>
                                    <p className="text-[10px] leading-relaxed font-bold text-white/40 uppercase tracking-[3px] relative z-10">Application on behalf will tag this session as FIELD_OFFICE_INITIATED. Citizen verification manifest required post-submission.</p>
                                </div>

                                <div className="flex gap-8">
                                    <button 
                                        onClick={() => setApplyingFor(null)} 
                                        className="h-20 px-10 bg-white border border-slate-200 text-slate-400 rounded-3xl text-[10px] font-black uppercase tracking-[6px] hover:bg-header-bg hover:text-white transition-all active:scale-95"
                                    >
                                        ABORT_OPS
                                    </button>
                                    <button 
                                        onClick={handleApply}
                                        disabled={applyMutation.isLoading}
                                        className="flex-1 h-20 bg-primary text-white rounded-3xl text-xs font-black uppercase tracking-[8px] shadow-2xl shadow-primary/40 hover:bg-header-bg hover:translate-y-[-10px] transition-all active:scale-95 flex items-center justify-center gap-6 disabled:opacity-50"
                                    >
                                        {applyMutation.isLoading ? "REQU_SYNCING..." : "COMMIT_PROTOCOL"}
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
