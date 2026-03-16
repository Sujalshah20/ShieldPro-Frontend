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
    Shield, Lock, Award, Terminal, X, Layers,
    Satellite, SearchCheck, RefreshCcw
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
            toast({ 
                title: "PROTOCOL_TRIGGERED", 
                description: "The asset protection sequence has been successfully initialized for the entity.",
                variant: "default"
            });
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
        if (!selectedPolicy) return toast({ 
            title: "PARAM_MISSING", 
            description: "Select a valid asset class before initialization.", 
            variant: "destructive" 
        });
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
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[1,2,3].map(i => <div key={i} className="h-[450px] bg-slate-50 rounded-[3.5rem] border-2 border-slate-100 animate-pulse" />)}
             </div>
        </div>
    );

    return (
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Global_Entity_Register</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Client <span className="text-[#007ea7]">Matrix_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Portfolio optimization and asset protection coordination. Signal: <span className="text-emerald-500">LOCKED</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="relative group w-full xl:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                        <input 
                            type="text" 
                            placeholder="IDENTIFY_ENTITY_NODE..." 
                            className="pl-16 pr-8 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none w-full transition-all font-black text-[11px] uppercase tracking-[4px] text-[#003249] shadow-inner focus:border-[#007ea7] focus:ring-8 focus:ring-[#007ea7]/5 placeholder:text-slate-200 italic" 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                            <Satellite size={16} strokeWidth={3} />
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredClients?.map((client, idx) => (
                    <Reveal key={client._id} direction="up" delay={idx * 0.05}>
                        <div className="saas-card relative overflow-hidden group border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[520px] flex flex-col shadow-3xl group/card">
                             {/* Decorative Background Icon */}
                             <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                <Fingerprint size={280} className="text-[#003249]" />
                             </div>

                             <div className="p-10 flex-1 flex flex-col relative z-20">
                                 <div className="flex items-center gap-8 mb-12 relative">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#007ea7]/20 blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500 rounded-full" />
                                        <div className="relative w-24 h-24 bg-[#003249] rounded-[2.2rem] flex items-center justify-center text-[#007ea7] border-2 border-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-3xl">
                                            <span className="text-4xl font-black uppercase italic tracking-tighter">{client.name.charAt(0)}</span>
                                        </div>
                                        <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-slate-50 shadow-2xl z-20">
                                            <div className={`w-3.5 h-3.5 rounded-full ${client.isVerified ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-amber-500 animate-pulse shadow-[0_0_15px_#f59e0b]'}`} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-[#003249] leading-none group-hover:text-[#007ea7] transition-colors italic">{client.name}</h3>
                                        <div className="px-5 py-2 bg-slate-50 border-2 border-slate-50 rounded-xl text-[9px] font-black uppercase tracking-[4px] text-slate-400 group-hover:bg-[#003249] group-hover:text-[#80ced7] group-hover:border-[#003249] transition-all w-fit italic">
                                            {client.isVerified ? 'ID_VALIDATED' : 'VETTING_PENDING'}
                                        </div>
                                    </div>
                                 </div>

                                 <div className="space-y-6 mb-12 relative border-l-4 border-slate-50 pl-8 group-hover:border-[#007ea7]/20 transition-all">
                                    <div className="flex items-center gap-5 text-[11px] font-black text-[#003249] uppercase tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-[#003249]/5 transition-colors">
                                            <Mail size={16} className="text-[#007ea7]" strokeWidth={3} />
                                        </div>
                                        {client.email}
                                    </div>
                                    <div className="flex items-center gap-5 text-[11px] font-black text-[#003249] uppercase tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-[#003249]/5 transition-colors">
                                            <Phone size={16} className="text-[#007ea7]" strokeWidth={3} />
                                        </div>
                                        {client.phone}
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-6 mb-12 flex-1">
                                    <div className="p-8 bg-[#003249] text-white rounded-[2.5rem] border border-white/5 shadow-3xl relative overflow-hidden group/sub hover:scale-105 transition-transform duration-500">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                         <p className="text-[10px] font-black uppercase tracking-[5px] text-[#80ced7] mb-4 italic leading-none">ASSETS_ACTIVE</p>
                                         <div className="flex items-center justify-between relative z-10">
                                            <span className="text-5xl font-black tracking-tighter italic">{client.activePolicyCount || 0}</span>
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#007ea7] border border-white/5">
                                                <Shield size={22} strokeWidth={3} />
                                            </div>
                                         </div>
                                    </div>
                                    <div className="p-8 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] shadow-inner relative overflow-hidden hover:border-[#007ea7]/30 hover:bg-white transition-all duration-500 hover:scale-105">
                                         <p className="text-[10px] font-black uppercase tracking-[5px] text-slate-300 mb-4 italic leading-none">PIPELINE_REQ</p>
                                         <div className="flex items-center justify-between relative z-10">
                                            <span className="text-5xl font-black tracking-tighter text-[#003249] italic">{client.applicationCount || 0}</span>
                                            <div className="w-12 h-12 bg-[#003249]/5 rounded-2xl flex items-center justify-center text-[#003249] border border-[#003249]/5">
                                                <Target size={22} strokeWidth={3} className="opacity-40" />
                                            </div>
                                         </div>
                                    </div>
                                 </div>

                                 <div className="flex gap-6 mt-auto">
                                    <button className="h-16 w-16 bg-white border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-200 hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all shadow-xl active:scale-95 group/btn">
                                        <Activity size={24} strokeWidth={3} />
                                    </button>
                                    <button 
                                        onClick={() => setApplyingFor(client)}
                                        className="flex-1 h-16 bg-[#003249] text-[#80ced7] rounded-[1.5rem] font-black uppercase tracking-[6px] text-[11px] flex items-center justify-center gap-5 shadow-[0_20px_40px_-10px_rgba(0,50,73,0.4)] hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 group/btn border-2 border-white/5 relative overflow-hidden italic"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                                        INITIATE PROTOCOL <Zap size={18} fill="currentColor" strokeWidth={0} className="group-hover/btn:animate-pulse" />
                                    </button>
                                 </div>
                             </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Application Overlay Console */}
            <AnimatePresence>
                {applyingFor && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApplyingFor(null)} className="absolute inset-0 bg-[#003249]/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-2xl bg-white p-16 md:p-20 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden"
                        >
                            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#007ea7]/10 rounded-full blur-[120px] pointer-events-none" />
                            
                            <div className="flex items-center gap-10 mb-16 relative z-10 border-b-2 border-slate-50 pb-12">
                                <div className="w-20 h-20 bg-[#003249] rounded-[2rem] flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5 relative group overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                     <Zap size={36} strokeWidth={3} className="relative z-10 group-hover:rotate-12 transition-transform" fill="currentColor" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] leading-none mb-1 italic">Initiate Protocol</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] italic">Target_Entity: <span className="text-[#007ea7]">{applyingFor.name}</span></p>
                                </div>
                                <button onClick={() => setApplyingFor(null)} className="ml-auto p-6 bg-slate-50 hover:bg-rose-50 rounded-[2.5rem] transition-all group active:scale-95 border-2 border-transparent hover:border-rose-100">
                                    <X size={24} className="text-slate-300 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-500" strokeWidth={4} />
                                </button>
                            </div>

                            <div className="space-y-12 relative z-10">
                                <div className="space-y-6">
                                    <label className="text-[12px] font-black uppercase tracking-[10px] text-[#007ea7] ml-4 italic block leading-none">Asset Class Selection</label>
                                    <div className="relative group">
                                        <select 
                                            className="w-full h-20 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] pl-10 pr-16 font-black uppercase text-[12px] tracking-[5px] outline-none focus:border-[#007ea7] focus:bg-white shadow-inner transition-all appearance-none cursor-pointer text-[#003249] italic"
                                            value={selectedPolicy}
                                            onChange={(e) => setSelectedPolicy(e.target.value)}
                                        >
                                            <option value="">IDENTIFY_ASSET_CLASS...</option>
                                            {policies?.map(p => (
                                                <option key={p._id} value={p._id}>{p.policyName.toUpperCase()} (₹{p.premiumAmount?.toLocaleString()})</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronRight size={24} className="rotate-90 text-[#007ea7] animate-pulse" strokeWidth={4} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 bg-[#003249] text-white rounded-[3.5rem] border border-white/5 relative overflow-hidden group/warn shadow-3xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                    <p className="text-[11px] font-black uppercase tracking-[8px] text-[#80ced7] mb-6 flex items-center gap-4 italic leading-none">
                                        <Terminal size={18} strokeWidth={3} className="text-[#007ea7]" /> PROTOCOL_ADVISORY
                                    </p>
                                    <p className="text-[10px] leading-relaxed font-black text-white/30 uppercase tracking-[5px] italic">Direct field initialization will trigger the <span className="text-[#007ea7]">FIELD_OFFICE_SYNC</span> flag. All logs are globally audited.</p>
                                </div>

                                <div className="flex gap-8 pt-6">
                                    <button 
                                        onClick={() => setApplyingFor(null)} 
                                        className="h-20 px-12 bg-white border-2 border-slate-100 text-[#003249] rounded-[2.5rem] text-[12px] font-black uppercase tracking-[8px] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center active:scale-95 italic flex-1"
                                    >
                                        ABORT_OPS
                                    </button>
                                    <button 
                                        onClick={handleApply}
                                        disabled={applyMutation.isLoading}
                                        className="flex-[2] h-20 bg-[#003249] text-[#80ced7] rounded-[2.5rem] text-[13px] font-black uppercase tracking-[10px] shadow-3xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-6 italic disabled:opacity-50 group/btn"
                                    >
                                        <RefreshCcw size={24} strokeWidth={3} className={`${applyMutation.isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                                        {applyMutation.isLoading ? "SYNCING..." : "COMMIT_PROTOCOL"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Operational_Compliance_Verified
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Entity_Mapping_Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Globe size={20} strokeWidth={3} className="text-[#007ea7]" /> Sector: Global_Assets
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Uplink_Direct: AES-256
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentClients;
