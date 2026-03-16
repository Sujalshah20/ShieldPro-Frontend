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
    Fingerprint, Terminal, Award, Layers, IndianRupee, Globe,
    ChevronRight, CreditCard, RefreshCcw, SearchCheck,
    Briefcase, Layout, Eye, MessageSquare, Wallet, Compass
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
            toast({ 
                title: "INCIDENT_LOGGED", 
                description: "The strategic investigation protocol has been successfully initialized." 
            });
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
        if (!formData.userPolicyId || !formData.amount) return toast({ 
            title: "LOGIC_ERROR", 
            description: "Incomplete parameters detected in filing request.", 
            variant: "destructive" 
        });
        
        const mockDocs = files.map(f => ({ name: f.name, url: `https://mock.shieldpro.com/${f.name}` }));
        
        fileMutation.mutate({
            ...formData,
            amount: Number(formData.amount),
            documents: mockDocs
        });
    };

    if (isLoading) return (
        <div className="py-20 space-y-12 h-screen">
             <div className="h-20 w-[400px] bg-slate-50 animate-pulse rounded-[2.5rem] border-2 border-slate-100" />
             <div className="space-y-10">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[4rem] border-2 border-slate-50 animate-pulse shadow-4xl" />)}
             </div>
        </div>
    );

    return (
        <div className="space-y-16 pb-24">
            {/* Mission Critical Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-3 h-12 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black uppercase tracking-[8px] text-[#003249] italic leading-none opacity-60">Global_Incident_Register_v4.2</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] mt-2 italic">STATUS: LIVE_MAINFRAME_SYNC</span>
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Incident <span className="text-[#007ea7]">Matrix_</span></h1>
                        <p className="max-w-2xl text-slate-400 font-bold uppercase tracking-[4px] text-xs italic leading-relaxed">
                            Initialize field anomaly reports and track the synchronized status of your 
                            <span className="text-[#007ea7]"> Settlement Manifests</span>. All transmissions are AES-512 encrypted.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <button 
                        onClick={() => setIsFiling(true)}
                        className="h-24 px-16 bg-[#003249] text-[#80ced7] rounded-[2.5rem] text-[13px] font-black uppercase tracking-[10px] flex items-center gap-8 shadow-4xl active:scale-95 transition-all group overflow-hidden relative italic border-4 border-white"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                        <div className="w-12 h-12 bg-[#007ea7] rounded-2xl flex items-center justify-center text-[#003249] shadow-inner group-hover:rotate-90 transition-transform duration-700">
                            <Plus size={32} strokeWidth={4} />
                        </div>
                        <span className="relative z-10">LOG_FIELD_ANOMALY</span>
                    </button>
                </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-14 pb-16">
                {myClaims?.map((claim, idx) => (
                    <Reveal key={claim._id} direction="up" delay={idx * 0.1}>
                        <div className="saas-card group relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-14 p-16 shadow-4xl transition-all duration-1000 hover:border-[#007ea7]/30 border-2 border-slate-50 bg-white/50 backdrop-blur-md rounded-[5rem]">
                            {/* Tactical HUD Deco */}
                            <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-[6000ms]">
                                <Fingerprint size={450} className="text-[#003249] rotate-12" />
                            </div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#003249_1px,transparent_0)] [background-size:40px_40px] opacity-[0.01] pointer-events-none" />

                            <div className="flex flex-col md:flex-row items-center gap-14 w-full xl:w-auto relative z-10">
                                    <div className={`w-36 h-36 rounded-[3.5rem] flex items-center justify-center shrink-0 border-4 transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110 relative overflow-hidden ${
                                        claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-50 shadow-emerald-500/10' :
                                        claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-50 shadow-rose-500/10' :
                                        'bg-[#003249] text-[#007ea7] border-white/10 shadow-4xl shadow-[#003249]/20'
                                    }`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-30" />
                                        <ShieldAlert size={64} strokeWidth={2.5} className="relative z-10" />
                                    </div>
                                    
                                    <div className="flex-1 space-y-8">
                                        <div className="flex flex-col md:flex-row items-center gap-10">
                                            <h3 className="text-4xl font-black text-[#003249] uppercase tracking-tighter italic group-hover:text-[#007ea7] transition-colors leading-none">NODE::{claim.userPolicy?.policyNumber.toUpperCase()}</h3>
                                            <div className="flex bg-slate-50/50 backdrop-blur-sm p-2 rounded-3xl border-2 border-slate-100 shadow-inner group-hover:bg-white transition-all duration-700">
                                                <span className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[6px] border-2 italic shadow-2xl flex items-center gap-4 ${
                                                    claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-50' :
                                                    claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-50' :
                                                    'bg-[#003249] text-[#80ced7] border-[#003249] shadow-4xl shadow-[#003249]/30'
                                                }`}>
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        claim.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' :
                                                        claim.status === 'Rejected' ? 'bg-rose-500' :
                                                        'bg-[#007ea7] animate-pulse shadow-[0_0_15px_#007ea7]'
                                                    }`} />
                                                    {claim.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-12 text-slate-300">
                                            <div className="flex items-center gap-5 italic opacity-40 group-hover:opacity-100 transition-all duration-500">
                                                <div className="w-10 h-10 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] shadow-lg">
                                                    <Clock size={20} strokeWidth={3} />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-[8px]">LOGGED://{new Date(claim.createdAt).toLocaleDateString().toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-5 italic opacity-40 group-hover:opacity-100 transition-all duration-500">
                                                <div className="w-10 h-10 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] shadow-lg">
                                                    <Compass size={20} strokeWidth={3} />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-[8px]">SECTOR://GLOBAL_OPS</span>
                                            </div>
                                        </div>
                                        
                                        <div className="p-10 bg-slate-50/50 backdrop-blur-sm border-2 border-slate-100 border-l-[12px] border-l-[#003249] rounded-[3rem] group-hover:bg-white group-hover:border-[#007ea7]/20 transition-all duration-700 shadow-inner relative overflow-hidden">
                                             <div className="absolute inset-0 bg-gradient-to-r from-[#007ea7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                                             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                                                <Terminal size={64} strokeWidth={1} />
                                             </div>
                                            <p className="text-[14px] font-black text-[#003249]/60 uppercase tracking-[5px] italic leading-loose max-w-3xl relative z-10 group-hover:text-[#003249] transition-colors">
                                                "{claim.description}"
                                            </p>
                                        </div>
                                    </div>
                            </div>

                            <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-12 w-full xl:w-[500px] relative z-10 border-t-4 xl:border-t-0 xl:border-l-4 border-slate-50/50 pt-14 xl:pt-0 xl:pl-20 mt-6 xl:mt-0">
                                    <div className="flex flex-col xl:items-end space-y-6">
                                        <div className="flex items-center gap-6 italic opacity-30">
                                            <div className="w-4 h-4 rounded-full bg-[#007ea7] shadow-[0_0_20px_#007ea7] animate-pulse" />
                                            <span className="text-[12px] font-black uppercase tracking-[10px] text-slate-400">VALUATION_REQ</span>
                                        </div>
                                        <div className="flex items-center gap-8 bg-white/80 p-6 rounded-[3rem] border-2 border-slate-100 shadow-xl group-hover:scale-110 transition-transform duration-700 group-hover:shadow-[#007ea7]/10">
                                            <IndianRupee size={40} className="text-[#007ea7]" strokeWidth={4} />
                                            <span className="text-7xl font-black text-[#003249] tracking-tighter uppercase leading-none italic group-hover:text-[#007ea7] transition-all">
                                                {claim.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="h-20 px-16 bg-[#003249] text-[#80ced7] rounded-[2rem] text-[13px] font-black uppercase tracking-[10px] transition-all hover:bg-[#007ea7] hover:text-white border-2 border-white/10 flex items-center justify-center gap-8 active:scale-95 group/btn shadow-4xl italic overflow-hidden relative">
                                         <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none group-hover:animate-shimmer" />
                                         TRACE_MANIFEST <ArrowUpRight size={28} strokeWidth={4} className="group-hover/btn:translate-x-3 group-hover/btn:-translate-y-3 transition-transform duration-700" />
                                    </button>
                            </div>
                        </div>
                    </Reveal>
                ))}

                {(!myClaims || myClaims.length === 0) && (
                    <Reveal direction="up" delay={0.2}>
                        <div className="py-72 text-center bg-white/50 backdrop-blur-md border-4 border-dashed border-slate-100 rounded-[6rem] flex flex-col items-center justify-center group hover:border-[#007ea7]/30 transition-all duration-1000 relative overflow-hidden shadow-inner">
                            <div className="absolute inset-0 bg-mesh-gradient opacity-20 pointer-events-none" />
                            <div className="w-40 h-40 bg-white rounded-[4.5rem] flex items-center justify-center text-slate-100 shadow-4xl group-hover:bg-[#003249] group-hover:text-[#007ea7] group-hover:rotate-[360deg] transition-all duration-[2000ms] mb-16 relative overflow-hidden border-4 border-slate-50">
                                 <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-50 shadow-inner" />
                                <Lock size={80} strokeWidth={3} className="relative z-10" />
                            </div>
                            <h3 className="text-5xl font-black uppercase tracking-[18px] text-[#003249]/10 italic mb-10 transition-all group-hover:text-[#003249]/20">Archive_Empty_</h3>
                            <p className="text-[14px] font-black text-slate-300 uppercase tracking-[10px] italic max-w-2xl leading-relaxed opacity-60 group-hover:opacity-100 transition-all">
                                No incident transmissions detected in your operational sector archives. Grid status is currently at maximum integrity.
                            </p>
                        </div>
                    </Reveal>
                )}
            </div>

            {/* Filing Chassis Overlay - Elite Glassmorphism */}
            <AnimatePresence>
                {isFiling && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 md:p-20">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFiling(false)} className="absolute inset-0 bg-[#003249]/98 backdrop-blur-[30px]" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 50 }}
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            className="relative w-full max-w-[1300px] max-h-[90vh] bg-white p-16 md:p-32 rounded-[6rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] border-4 border-white/20 overflow-y-auto no-scrollbar"
                        >
                            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#007ea7]/5 rounded-full blur-[180px] pointer-events-none" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#003249_1px,transparent_0)] [background-size:40px_40px] opacity-[0.02] pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16 mb-24 border-b-4 border-slate-50 pb-20">
                                <div className="flex items-center gap-14">
                                    <div className="w-32 h-32 bg-[#003249] rounded-[3.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl relative overflow-hidden group border-4 border-white">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent animate-pulse" />
                                         <ShieldAlert size={64} strokeWidth={3} className="relative z-10 group-hover:rotate-[-12deg] transition-transform duration-700" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-5xl font-black uppercase tracking-tighter text-[#003249] leading-none italic mb-2">Field Anomaly Registry</h3>
                                        <p className="text-[12px] font-black text-slate-300 uppercase tracking-[10px] italic opacity-60 flex items-center gap-4">
                                            <Satellite size={16} className="text-[#007ea7]" strokeWidth={3} /> INITIALIZING_GATEWAY_v4.2_SIGMA
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsFiling(false)} 
                                    className="w-24 h-24 bg-slate-50 hover:bg-rose-50 rounded-[2.5rem] transition-all group active:scale-95 border-2 border-transparent hover:border-rose-100 flex items-center justify-center shadow-inner"
                                >
                                    <X size={44} className="text-slate-300 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-700" strokeWidth={5} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-24 relative z-10 max-w-6xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                                    <div className="space-y-10">
                                        <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic block leading-none">
                                            <Layout size={24} strokeWidth={3} /> SELECT_NODE_ARCHIVE
                                        </label>
                                        <div className="relative group">
                                            <select 
                                                className="w-full h-24 bg-slate-50 border-4 border-slate-50 rounded-[3.5rem] px-16 font-black text-[14px] uppercase tracking-[6px] outline-none focus:border-[#007ea7] focus:bg-white shadow-inner transition-all appearance-none cursor-pointer text-[#003249] italic"
                                                value={formData.userPolicyId}
                                                onChange={e => setFormData({...formData, userPolicyId: e.target.value})}
                                                required
                                            >
                                                <option value="">SCANNING_ACTIVE_PROTOCOLS...</option>
                                                {activePolicies?.map(p => (
                                                    <option key={p._id} value={p._id}>
                                                        {p.policy?.policyName.toUpperCase()} // ID::{p.policyNumber.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none group-hover:rotate-180 transition-transform duration-700">
                                                <ChevronRight className="text-[#007ea7] rotate-90" size={32} strokeWidth={4} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic block leading-none">
                                            <Wallet size={24} strokeWidth={3} /> REQUIRED_YIELD [₹]
                                        </label>
                                        <div className="relative group">
                                            <input 
                                                type="number" 
                                                className="w-full h-24 bg-[#003249] border-4 border-white rounded-[3.5rem] text-right px-20 font-black text-5xl tracking-tighter outline-none focus:border-[#007ea7] shadow-[0_30px_70px_-10px_rgba(0,50,73,0.5)] text-[#80ced7] italic transition-all"
                                                placeholder="0.00"
                                                value={formData.amount}
                                                onChange={e => setFormData({...formData, amount: e.target.value})}
                                                required
                                            />
                                            <div className="absolute left-16 top-1/2 -translate-y-1/2 text-[#007ea7] font-black text-[13px] uppercase tracking-[10px] italic opacity-40 leading-none">AMOUNT:</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic block leading-none">
                                        <Terminal size={24} strokeWidth={3} /> ANOMALY_MANIFEST_NARRATIVE
                                    </label>
                                    <textarea 
                                        className="w-full h-72 bg-slate-50 border-4 border-slate-50 rounded-[4.5rem] p-16 outline-none focus:border-[#007ea7] focus:bg-white transition-all font-black uppercase no-scrollbar text-[15px] tracking-[4px] shadow-inner text-[#003249] italic leading-[2.5] placeholder:text-slate-100"
                                        placeholder="PROVIDE DETAILED ARCHITECTURAL SEQUENCE OF FIELD ANOMALIES FOR MAINFRAME AUDIT..."
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="space-y-12">
                                    <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic block leading-none">
                                        <Upload size={24} strokeWidth={3} /> VERIFICATION_ARTIFACTS
                                    </label>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                        <div className="relative h-28 group">
                                            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                                            <div className="h-full bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex items-center justify-center gap-10 group-hover:border-[#007ea7] group-hover:bg-white transition-all px-16 shadow-inner duration-700">
                                                <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-[#007ea7] shadow-2xl border-2 border-slate-50 group-hover:bg-[#003249] transition-all duration-700">
                                                    <Upload size={36} strokeWidth={4} />
                                                </div>
                                                <span className="text-[14px] font-black text-slate-300 uppercase tracking-[12px] italic group-hover:text-[#007ea7] transition-all">INJECT_ARTIFACTS</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-6 items-center min-h-[7rem] p-10 bg-slate-50/50 backdrop-blur-md rounded-[4rem] border-4 border-slate-50 shadow-inner">
                                            {files.length > 0 ? files.map((f, i) => (
                                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} key={i} className="px-10 py-4 bg-[#003249] text-[#80ced7] rounded-[1.5rem] text-[11px] font-black flex items-center gap-10 border-2 border-white/5 shadow-4xl group/item italic relative overflow-hidden">
                                                     <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none group-hover:animate-shimmer" />
                                                    <span className="truncate max-w-[200px] tracking-[6px] font-black uppercase relative z-10">{f.name}</span>
                                                    <button type="button" onClick={() => handleFileRemove(i)} className="text-rose-500 hover:scale-150 transition-transform relative z-10 group-hover:rotate-180 duration-700">
                                                        <X size={24} strokeWidth={5} />
                                                    </button>
                                                </motion.div>
                                            )) : (
                                                <div className="flex items-center gap-8 mx-auto opacity-20">
                                                     <SearchCheck size={32} strokeWidth={3} className="text-[#007ea7]" />
                                                     <span className="text-[14px] font-black text-[#003249] uppercase tracking-[12px] italic">Buffer_Empty_</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-12 pt-16">
                                    <button 
                                        type="button"
                                        onClick={() => setIsFiling(false)}
                                        className="h-28 px-20 bg-white border-4 border-slate-50 text-slate-300 rounded-[4rem] text-[15px] font-black uppercase tracking-[12px] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95 italic flex-1"
                                    >
                                        ABORT_TRANSMISSION
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={fileMutation.isLoading}
                                        className="flex-[2] h-28 bg-[#003249] text-[#80ced7] rounded-[4rem] text-[17px] font-black uppercase tracking-[15px] shadow-4xl active:scale-95 flex items-center justify-center gap-12 group disabled:opacity-50 italic relative overflow-hidden border-4 border-white/10"
                                    >
                                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-shimmer" />
                                        {fileMutation.isLoading ? (
                                            <RefreshCcw size={44} strokeWidth={4} className="animate-spin text-[#007ea7]" />
                                        ) : (
                                            <>TRANSMIT_INCIDENT_SIGNAL <Zap size={36} fill="currentColor" className="animate-pulse text-[#80ced7]" strokeWidth={0} /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Matrix Operational Log Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-24 pt-24 border-t-8 border-slate-50 relative">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-48 h-2 bg-[#007ea7] rounded-full shadow-[0_0_15px_#007ea7]" />
                    
                    {[
                        { icon: Fingerprint, label: "SIGNAL_AUTH_80%" },
                        { icon: Layers, label: "SYNAPSE_GRID_NOMINAL" },
                        { icon: Zap, label: "ENCRYPT_SHA_512" },
                        { icon: RefreshCcw, label: "AUTO_FIX_ACTIVE" }
                    ].map((status, i) => (
                        <div key={i} className="flex items-center gap-6 group cursor-crosshair">
                            <status.icon size={28} strokeWidth={3} className="text-[#007ea7] opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                            <span className="text-[13px] font-black text-slate-300 uppercase tracking-[12px] italic leading-none group-hover:text-[#003249] transition-all">{status.label}</span>
                        </div>
                    ))}
                </div>
            </Reveal>
        </div>
    );
};

export default CustomerClaims;