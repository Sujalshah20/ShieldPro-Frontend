import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    FileText, Plus, Shield, CheckCircle, 
    AlertCircle, Clock, Search, Upload, X,
    Zap, Target, Cpu, Satellite, Lock, 
    Activity, ArrowUpRight, ShieldAlert, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

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
            toast({ title: "INCIDENT_LOGGED", description: "Strategic investigation protocol initiated. Deployment in progress." });
            setIsFiling(false);
            setFormData({ userPolicyId: "", amount: "", description: "" });
            setFiles([]);
        },
        onError: (err) => {
            toast({ 
                title: "FILING_FAILURE", 
                description: err?.errors?.[0]?.message || err?.message || "Signal interruption during submission.", 
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
        if (!formData.userPolicyId || !formData.amount) return toast({ title: "LOGIC_ERROR", description: "Incomplete parameters detected in filing request." });
        
        const mockDocs = files.map(f => ({ name: f.name, url: `https://mock.shieldpro.com/${f.name}` }));
        
        fileMutation.mutate({
            ...formData,
            amount: Number(formData.amount),
            documents: mockDocs
        });
    };

    if (isLoading) return <div className="p-8"><TableSkeleton rows={8} cols={5} /></div>;

    return (
        <div className="customer-claims p-6 md:p-10 bg-[#F4F7FB] min-h-screen relative overflow-hidden">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #FF5A00 1px, transparent 0)`, backgroundSize: '50px 50px' }} />
            
            <div className="absolute top-[-10%] right-[-10%] opacity-[0.05] pointer-events-none animate-spin-slow">
                <Target size={800} className="text-accent rotate-45" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-accent rounded-full shadow-[0_0_20px_#FF5A00]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                CLAIMS<span className="text-accent tracking-normal">_ORDNANCE</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Report anomalies & track settlement architecture progress
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => setIsFiling(true)}
                        className="h-20 px-12 bg-accent text-white rounded-[2rem] font-black uppercase tracking-[5px] text-[11px] flex items-center gap-6 shadow-2xl shadow-accent/40 hover:translate-y-[-6px] active:scale-95 transition-all italic group"
                    >
                        <Plus size={20} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-500" /> FILE_NEW_INCIDENT
                    </button>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-10">
                {myClaims?.map((claim, idx) => (
                    <Reveal key={claim._id} width="100%" delay={idx * 0.05} direction="up">
                        <div className="bg-white rounded-[3rem] border border-border/50 hover:border-accent/30 transition-all flex flex-col xl:flex-row items-center justify-between gap-12 p-10 group relative overflow-hidden shadow-sm">
                            <div className="flex flex-col md:flex-row items-center gap-10 w-full xl:w-auto">
                                 <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center shrink-0 border-2 transition-all group-hover:scale-110 duration-500 ${
                                    claim.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-xl shadow-emerald-500/10' :
                                    claim.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-xl shadow-rose-500/10' :
                                    'bg-accent/10 text-accent border-accent/20 shadow-xl shadow-accent/10'
                                 }`}>
                                    <ShieldAlert size={40} strokeWidth={2.5} />
                                 </div>
                                 <div className="text-center md:text-left">
                                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">NODE_#{claim.userPolicy?.policyNumber}</h3>
                                        <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[4px] border italic ${
                                            claim.status === 'Approved' ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30' :
                                            claim.status === 'Rejected' ? 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/30' :
                                            'bg-zinc-950 text-white border-white/10 opacity-80'
                                        }`}>
                                            STATUS::{claim.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6 opacity-40">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-[4px] italic">INCIDENT_LOG_DATE: {new Date(claim.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs font-black opacity-30 uppercase tracking-[3px] italic leading-relaxed max-w-2xl">{claim.description}</p>
                                 </div>
                            </div>

                            <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-8 w-full xl:w-auto xl:text-right border-t xl:border-t-0 xl:border-l border-border/50 pt-10 xl:pt-0 xl:pl-12">
                                 <div className="flex flex-col xl:items-end">
                                     <span className="text-[10px] font-black uppercase tracking-[4px] opacity-20 mb-3 italic">SETTLEMENT_YIELD</span>
                                     <span className="text-4xl font-black italic tracking-tighter text-accent leading-none">₹{claim.amount.toLocaleString()}</span>
                                 </div>
                                 <button className="h-14 px-8 bg-zinc-950 text-white rounded-2xl font-black text-[9px] uppercase tracking-[4px] transition-all italic hover:bg-accent flex items-center gap-4 active:scale-95 group/btn">
                                     VIEW_TIMELINE <ArrowUpRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                 </button>
                            </div>
                        </div>
                    </Reveal>
                ))}

                {myClaims?.length === 0 && (
                    <div className="py-40 text-center bg-white/50 border-4 border-dashed border-border/30 rounded-[6rem] backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                            <Cpu size={500} className="mx-auto" />
                        </div>
                        <FileText size={100} className="mx-auto mb-10 opacity-5" />
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter opacity-10">NULL_INCIDENT_REGISTRY</h3>
                        <p className="opacity-10 max-w-sm mx-auto mt-6 font-black uppercase text-[10px] tracking-[6px] italic leading-loose">No strategic anomalies detected in your operational sector.</p>
                    </div>
                )}
            </div>

            {/* Filing Chassis */}
            <AnimatePresence>
                {isFiling && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFiling(false)} className="absolute inset-0 bg-zinc-950/90 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-3xl bg-white p-16 md:p-24 rounded-[5rem] border border-white/10 shadow-[0_100px_150px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <Shield size={400} className="text-accent rotate-12" />
                            </div>

                            <div className="relative z-10 flex flex-col mb-16">
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-accent/40">
                                        <ShieldAlert size={32} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">LOG <span className="text-accent italic-none not-italic">INCIDENT_V5</span></h3>
                                </div>
                                <p className="opacity-30 text-xs font-black uppercase tracking-[8px] italic ml-20">Authorized field anomaly report v1.0.4</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">SELECT_ACTIVE_SAFEGUARD</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                        <select 
                                            className="w-full h-20 bg-zinc-50 border border-border/50 rounded-2xl px-16 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all appearance-none cursor-pointer shadow-sm focus:ring-8 focus:ring-accent/5 italic"
                                            value={formData.userPolicyId}
                                            onChange={e => setFormData({...formData, userPolicyId: e.target.value})}
                                            required
                                        >
                                            <option value="" className="bg-zinc-900">IDENTIFY_SECTOR_PROTOCOL...</option>
                                            {activePolicies?.map(p => (
                                                <option key={p._id} value={p._id} className="bg-zinc-900">
                                                    {p.policy?.policyName} - {p.policyNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">REQUIRED_COMPENSATION (₹)</label>
                                        <div className="relative group">
                                            <TrendingUp className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                            <input 
                                                type="number" 
                                                className="w-full h-20 bg-zinc-50 border border-border/50 rounded-2xl px-16 font-black text-xl italic tracking-tighter outline-none focus:border-accent shadow-sm focus:ring-8 focus:ring-accent/5"
                                                value={formData.amount}
                                                onChange={e => setFormData({...formData, amount: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">CRYPTO_EVIDENCE_ATTACH</label>
                                        <div className="relative h-20 group">
                                            <input 
                                                type="file" 
                                                multiple 
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                onChange={handleFileChange}
                                            />
                                            <div className="h-full bg-zinc-50 border border-border/50 rounded-2xl flex items-center justify-center gap-4 group-hover:border-accent transition-all px-6">
                                                <Upload size={18} className="text-accent opacity-40 group-hover:opacity-100 transition-opacity" />
                                                <span className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic">INJECT_ARTIFACTS</span>
                                                {files.length > 0 && <span className="ml-2 px-3 py-1 bg-accent text-white rounded-lg text-[10px] font-black">{files.length}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">ANOMALY_NARRATIVE</label>
                                    <textarea 
                                        className="w-full h-40 bg-zinc-50 border border-border/50 rounded-[2.5rem] p-10 outline-none focus:border-accent transition-all font-black uppercase no-scrollbar text-[11px] tracking-[4px] leading-relaxed shadow-sm focus:ring-8 focus:ring-accent/5 italic"
                                        placeholder="PROVIDE_DETAILED_SEQUENCE_OF_INCIDENTS..."
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>

                                {files.length > 0 && (
                                    <div className="flex flex-wrap gap-4 px-2">
                                        {files.map((f, i) => (
                                            <div key={i} className="px-6 py-3 bg-accent/10 rounded-xl text-[10px] font-black text-accent flex items-center gap-4 border border-accent/20 italic">
                                                <span className="truncate max-w-[150px]">{f.name}</span>
                                                <button type="button" onClick={() => handleFileRemove(i)} className="hover:text-rose-500 transition-colors">
                                                    <X size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-8 pt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setIsFiling(false)}
                                        className="h-20 px-12 bg-zinc-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[6px] hover:bg-zinc-800 transition-all font-black italic active:scale-95 shadow-xl border border-white/5"
                                    >
                                        ABORT_SIGNAL
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={fileMutation.isLoading}
                                        className="flex-1 h-20 bg-accent text-white rounded-[2rem] text-xs font-black uppercase tracking-[7px] shadow-[0_25px_60px_rgba(255,90,0,0.4)] font-black italic hover:translate-y-[-8px] transition-all active:scale-95 flex items-center justify-center gap-6 group"
                                    >
                                        {fileMutation.isLoading ? "TRANSMITTING..." : (
                                            <>TRANSMIT_INCIDENT_DATA <Zap size={20} className="group-hover:scale-125 transition-transform" strokeWidth={3} /></>
                                        )}
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