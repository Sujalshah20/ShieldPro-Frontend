import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    FileText, Plus, Shield, CheckCircle, 
    AlertCircle, Clock, Search, Upload, X,
    Zap, Target, Cpu, Satellite, Lock, 
    Activity, ArrowUpRight, ShieldAlert, TrendingUp,
    Fingerprint, Terminal, Award
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
            toast({ title: "INCIDENT_LOGGED", description: "The strategic investigation protocol has been successfully initialized." });
            setIsFiling(false);
            setFormData({ userPolicyId: "", amount: "", description: "" });
            setFiles([]);
        },
        onError: (err) => {
            toast({ 
                title: "FILING_FAILURE", 
                description: err?.errors?.[0]?.message || err?.message || "Operational anomaly detected during request submission.", 
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
        if (!formData.userPolicyId || !formData.amount) return toast({ title: "LOGIC_ERROR", description: "Incomplete parameters detected in filing request.", variant: "destructive" });
        
        const mockDocs = files.map(f => ({ name: f.name, url: `https://mock.shieldpro.com/${f.name}` }));
        
        fileMutation.mutate({
            ...formData,
            amount: Number(formData.amount),
            documents: mockDocs
        });
    };

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
             <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <TableSkeleton rows={8} cols={5} />
        </div>
    );

    return (
        <div className="customer-claims p-4 md:p-8 bg-[#dae5e5] min-h-screen relative overflow-hidden font-display">
            {/* Mission Header */}
            <div className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-[#0082a1] rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Claims Ordnance Control</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#012b3f] uppercase tracking-tight">Incident_Tracker</h1>
                    <p className="text-sm text-slate-500 font-medium italic mt-1">Report anomalies & track settlement architecture progress. Status: Active.</p>
                </div>
                
                <button 
                    onClick={() => setIsFiling(true)}
                    className="h-16 px-10 bg-[#012b3f] text-[#0082a1] rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-4 shadow-xl hover:bg-[#0082a1] hover:text-white transition-all active:scale-95 group border border-white/5"
                >
                    <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> FILE NEW INCIDENT
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {myClaims?.map((claim, idx) => (
                    <motion.div 
                        key={claim._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-[2.5rem] border border-white hover:border-[#0082a1]/30 transition-all flex flex-col xl:flex-row items-center justify-between gap-10 p-10 group relative overflow-hidden shadow-2xl"
                    >
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                                <Fingerprint size={200} className="text-[#012b3f]" />
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 w-full xl:w-auto relative z-10">
                                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center shrink-0 border transition-all duration-500 ${
                                    claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_#10b98120]' :
                                    claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                    'bg-[#0082a1]/10 text-[#0082a1] border-[#0082a1]/20 shadow-[0_0_15px_#0082a120]'
                                }`}>
                                    <ShieldAlert size={36} strokeWidth={2.5} />
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
                                        <h3 className="text-2xl font-black text-[#012b3f] uppercase tracking-tighter">NODE_#{claim.userPolicy?.policyNumber}</h3>
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                            'bg-slate-900 text-white border-white/10'
                                        }`}>
                                            STATUS::{claim.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-slate-400">
                                        <Clock size={12} className="text-[#0082a1]" />
                                        <span className="text-[9px] font-black uppercase tracking-widest italic">Incident Log: {new Date(claim.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xl line-clamp-2">{claim.description}</p>
                                </div>
                        </div>

                        <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-6 w-full xl:w-80 relative z-10 border-t xl:border-t-0 xl:border-l border-slate-50 pt-8 xl:pt-0 xl:pl-10">
                                <div className="flex flex-col xl:items-end">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-2">Settlement Yield</span>
                                    <span className="text-3xl font-black text-[#012b3f] leading-none tracking-tighter">₹{claim.amount.toLocaleString()}</span>
                                </div>
                                <button className="h-12 px-6 bg-[#012b3f] text-[#0082a1] rounded-xl font-black text-[9px] uppercase tracking-widest transition-all hover:bg-[#0082a1] hover:text-white flex items-center gap-3 active:scale-95 group/btn border border-white/5 shadow-xl">
                                    TIMELINE <ArrowUpRight size={14} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                        </div>
                    </motion.div>
                ))}

                {myClaims?.length === 0 && (
                    <div className="py-40 text-center bg-white/50 border-2 border-dashed border-slate-300/50 rounded-[4rem] flex flex-col items-center justify-center">
                        <Terminal size={64} className="mx-auto mb-8 text-slate-200" />
                        <h3 className="text-2xl font-black uppercase tracking-[10px] text-slate-300 italic mb-2">Null Incident Registry</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No strategic anomalies detected in your operational sector.</p>
                    </div>
                )}
            </div>

            {/* Filing Chassis Overlay */}
            <AnimatePresence>
                {isFiling && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFiling(false)} className="absolute inset-0 bg-[#012b3f]/90 backdrop-blur-3xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white p-12 md:p-16 rounded-[3.5rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-16 opacity-[0.05] pointer-events-none">
                                <Shield size={300} className="text-[#0082a1] rotate-12" />
                            </div>

                            <div className="relative z-10 flex items-center gap-8 mb-12">
                                <div className="w-16 h-16 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl">
                                    <ShieldAlert size={32} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#012b3f] leading-none mb-2">Log Incident</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Field Anomaly Report Protocol</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] mb-3 block ml-1">Select Active Safeguard</label>
                                    <div className="relative group">
                                        <select 
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-bold text-[10px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white shadow-inner transition-all appearance-none cursor-pointer text-[#012b3f]"
                                            value={formData.userPolicyId}
                                            onChange={e => setFormData({...formData, userPolicyId: e.target.value})}
                                            required
                                        >
                                            <option value="">Identify Sector Protocol...</option>
                                            {activePolicies?.map(p => (
                                                <option key={p._id} value={p._id}>
                                                    {p.policy?.policyName} - {p.policyNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] mb-3 block ml-1">Required Compensation (₹)</label>
                                        <input 
                                            type="number" 
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-base tracking-tighter outline-none focus:border-[#0082a1] shadow-inner text-[#012b3f]"
                                            value={formData.amount}
                                            onChange={e => setFormData({...formData, amount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] mb-3 block ml-1">Evidence Artifacts</label>
                                        <div className="relative h-14 group">
                                            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                                            <div className="h-full bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-3 group-hover:border-[#0082a1] transition-all px-4">
                                                <Upload size={16} className="text-[#0082a1]" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inject Artifacts</span>
                                                {files.length > 0 && <span className="ml-auto px-2 py-0.5 bg-[#0082a1] text-white rounded-md text-[9px] font-black">{files.length}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] mb-3 block ml-1">Anomaly Narrative</label>
                                    <textarea 
                                        className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#0082a1] transition-all font-bold uppercase no-scrollbar text-[10px] tracking-widest leading-relaxed shadow-inner text-[#012b3f]"
                                        placeholder="PROVIDE SEQUENCE OF INCIDENTS..."
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>

                                {files.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {files.map((f, i) => (
                                            <div key={i} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[8px] font-black flex items-center gap-3 border border-white/10">
                                                <span className="truncate max-w-[100px]">{f.name}</span>
                                                <button type="button" onClick={() => handleFileRemove(i)} className="text-rose-500">
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsFiling(false)}
                                        className="h-16 px-8 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#012b3f] hover:text-white transition-all active:scale-95"
                                    >
                                        Abort
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={fileMutation.isLoading}
                                        className="flex-1 h-16 bg-[#0082a1] text-white rounded-xl text-[10px] font-black uppercase tracking-[5px] shadow-xl hover:bg-[#012b3f] transition-all active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                                    >
                                        {fileMutation.isLoading ? "TRANSMITTING..." : (
                                            <>TRANSMIT INCIDENT <Zap size={16} fill="currentColor" /></>
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