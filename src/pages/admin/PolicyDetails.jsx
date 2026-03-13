import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { motion } from "framer-motion";
import { 
    Paperclip, ArrowLeft, Shield, Clock, 
    IndianRupee, Activity, Truck, Home, 
    Globe, FileText, Zap, ShieldCheck,
    TrendingUp, AlertCircle, Satellite,
    Cpu, Target, Layers, Box, Lock,
    Eye, Download, Share2, Trash2, Edit3
} from "lucide-react";
import Reveal from "../../components/common/Reveal";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../hooks/use-toast";

const PolicyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: policy, isLoading } = useQuery({
        queryKey: ['policyDetails', id, user?.token],
        queryFn: () => api.get(`/policies/${id}`, user.token),
        enabled: !!user?.token && !!id
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/policies/${id}`, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "ARTIFACT_DECOMMISSIONED", description: "Security artifact has been successfully sunset from the global inventory." });
            navigate('/admin/policies');
        },
        onError: () => {
            toast({ title: "OVERRIDE_FAILED", description: "System level 7 authorization required for decommissioning.", variant: "destructive" });
        }
    });

    const getPolicyIcon = (type) => {
        const iconProps = { size: 36, strokeWidth: 3, className: "text-primary" };
        switch(type) {
            case 'Health': return <Activity {...iconProps} />;
            case 'Vehicle': case 'Auto': return <Truck {...iconProps} />;
            case 'Property': case 'Home': return <Home {...iconProps} />;
            case 'Life': return <Shield {...iconProps} />;
            case 'Travel': return <Globe {...iconProps} />;
            default: return <FileText {...iconProps} />;
        }
    };

    if (isLoading) return <div className="p-10"><TableSkeleton rows={8} /></div>;

    if (!policy) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-10">
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20 animate-pulse" />
                <AlertCircle size={100} className="text-rose-500 relative z-10" strokeWidth={1} />
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">ARTIFACT_NOT_LOCATED</h2>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[8px] mb-12 italic">Target identification sequence failed. Artifact may have been phased out.</p>
            <button 
                onClick={() => navigate('/admin/policies')} 
                className="h-16 px-12 bg-white text-black rounded-[1.5rem] font-black uppercase tracking-[5px] text-xs hover:bg-primary hover:text-white transition-all flex items-center gap-4 active:scale-95 italic"
            >
                <ArrowLeft size={20} strokeWidth={4} /> RETURN_TO_INVENTORY
            </button>
        </div>
    );

    return (
        <div className="admin-policy-details p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#0a0f0d] min-h-screen relative overflow-hidden">
            {/* Tactical Grid & HUD Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #0165FF 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
            <div className="absolute top-[-20%] right-[-10%] opacity-[0.05] pointer-events-none animate-spin-slow">
                <Target size={1000} className="text-primary rotate-12" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => navigate('/admin/policies')}
                            className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center text-primary border-2 border-border/50 shadow-2xl hover:translate-x-[-8px] transition-all active:scale-90 group relative"
                        >
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity rounded-[2rem]" />
                            <ArrowLeft size={32} strokeWidth={4} />
                        </button>
                        <div>
                             <div className="flex items-center gap-6 mb-3">
                                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                                    ARTIFACT<span className="text-primary tracking-normal">_DOSSIER</span>
                                </h1>
                                <div className="px-6 py-2 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[4px] italic shadow-lg shadow-primary/30">
                                    {policy.policyType}
                                </div>
                             </div>
                             <p className="text-[10px] font-black opacity-30 uppercase tracking-[6px] ml-1 italic flex items-center gap-3">
                                <Satellite size={14} className="text-primary" /> Global Asset Reference: <span className="text-foreground opacity-100">#{id.toUpperCase()}</span>
                             </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-6">
                        <button className="h-16 w-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-primary border border-border/50 shadow-xl transition-all active:scale-90">
                            <Share2 size={24} strokeWidth={3} />
                        </button>
                        <button className="h-16 w-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-accent border border-border/50 shadow-xl transition-all active:scale-90">
                            <Edit3 size={24} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Left Column: Visual Chassis */}
                <div className="xl:col-span-1 space-y-12">
                    <Reveal width="100%" direction="right">
                        <div className="bg-white dark:bg-zinc-900/50 p-12 rounded-[4rem] border border-border/50 shadow-3xl relative overflow-hidden group backdrop-blur-md">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-1000">
                                {getPolicyIcon(policy.policyType)}
                             </div>
                             
                             <div className="relative mb-12">
                                <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative w-24 h-24 bg-zinc-950 rounded-[2.5rem] flex items-center justify-center text-primary border-2 border-white/10 shadow-2xl group-hover:rotate-6 transition-transform">
                                    {getPolicyIcon(policy.policyType)}
                                </div>
                             </div>
                             
                             <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight mb-6 group-hover:text-primary transition-colors">{policy.policyName}</h2>
                             <div className="w-16 h-1 bg-primary mb-8 rounded-full" />
                             <p className="text-xs font-black opacity-30 uppercase tracking-[3px] leading-[2] mb-12 italic">
                                {policy.description}
                             </p>

                             <div className="space-y-6">
                                {[
                                    { label: "SYNC_PREMIUM", value: `₹${policy.premiumAmount?.toLocaleString()}`, sub: "/ ANNUM", icon: IndianRupee, color: "text-primary" },
                                    { label: "STRATEGIC_COVER", value: `₹${policy.coverageAmount?.toLocaleString()}`, sub: "TOTAL_CEILING", icon: ShieldCheck, color: "text-accent" },
                                    { label: "PROTOCOL_WINDOW", value: `${policy.durationYears} CYCLES`, sub: "ORBITAL_DURATION", icon: Clock, color: "text-indigo-500" }
                                ].map((stat, i) => (
                                    <div key={i} className="p-8 bg-zinc-50 dark:bg-white/[0.03] rounded-[2rem] border border-border/50 transition-all shadow-sm relative overflow-hidden group/item">
                                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-1000" />
                                         <p className="text-[10px] font-black uppercase tracking-[5px] opacity-20 mb-3 italic">{stat.label}</p>
                                         <div className="flex items-end gap-3">
                                            <stat.icon size={24} className={stat.color} strokeWidth={3} />
                                            <span className="text-4xl font-black italic tracking-tighter leading-none">{stat.value}</span>
                                            <span className="text-[9px] font-black opacity-20 uppercase tracking-[3px] mb-1 italic">{stat.sub}</span>
                                         </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </Reveal>

                    <Reveal width="100%" direction="up" delay={0.2}>
                         <div className="bg-zinc-950 text-white p-12 rounded-[4rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-rose-500/10 opacity-50" />
                            <div className="absolute bottom-[-20%] right-[-10%] w-60 h-60 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform" />
                            
                            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-5 relative z-10 leading-none">
                                <div className="p-3 bg-primary/20 rounded-xl text-primary border border-primary/30">
                                    <Zap size={24} strokeWidth={3} />
                                </div>
                                COMMAND_OVERRIDES
                            </h3>
                            
                            <div className="space-y-6 relative z-10">
                                <button className="w-full h-18 bg-white text-black rounded-[1.5rem] font-black text-[11px] uppercase tracking-[5px] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4 active:scale-95 italic group/btn">
                                    SYNCHRONIZE_UPDATE <TrendingUp size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                                <button 
                                    onClick={() => deleteMutation.mutate()}
                                    className="w-full h-18 bg-rose-600/10 text-rose-500 border-2 border-rose-500/20 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[5px] hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 italic group/del"
                                >
                                    SUNSET_ARTIFACT <Trash2 size={18} strokeWidth={3} className="group-hover/del:rotate-12 transition-transform" />
                                </button>
                            </div>
                         </div>
                    </Reveal>
                </div>

                {/* Right Column: Deep Intel */}
                <div className="xl:col-span-2 space-y-12">
                    <Reveal width="100%" direction="left">
                        <div className="bg-white dark:bg-zinc-900/50 p-12 lg:p-18 rounded-[5rem] border border-border/50 shadow-3xl min-h-[850px] flex flex-col relative overflow-hidden backdrop-blur-xl">
                             <div className="absolute top-0 left-0 p-20 opacity-1[0.02] pointer-events-none">
                                <Box size={400} />
                             </div>
                             
                             <div className="mb-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                                <div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 leading-none">Protocol <span className="text-primary italic-none not-italic font-black text-4xl">_Blueprints</span></h3>
                                    <p className="text-[10px] opacity-30 font-black uppercase tracking-[6px] italic flex items-center gap-3">
                                        <Layers size={14} className="text-primary" /> Comprehensive operational parameters & deployment scope
                                    </p>
                                </div>
                                <div className="flex -space-x-3">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white dark:border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-black text-white italic">0{i}</div>
                                    ))}
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10 flex-1">
                                <div className="group/intel">
                                    <h4 className="text-[11px] font-black uppercase tracking-[5px] opacity-20 mb-10 flex items-center gap-4 italic group-hover/intel:opacity-50 transition-opacity">
                                        <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_#0165FF]" /> CONTRACTUAL_DNA
                                    </h4>
                                    <div className="relative">
                                        <div className="absolute left-[-30px] top-0 bottom-0 w-1 bg-primary/10 rounded-full" />
                                        <div className="prose prose-lg dark:prose-invert max-w-none">
                                             <p className="text-sm font-black opacity-60 uppercase tracking-[4px] leading-[2.8] italic whitespace-pre-wrap">
                                                {policy.terms || "SYSTEM_REMARK: Standard baseline contractual protocols apply to this insurance artifact. Multi-level authorization required for manuscript overrides. Ensure all disbursement windows are synchronized with terrestrial market volatility."}
                                             </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-16">
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase tracking-[5px] opacity-20 mb-10 flex items-center gap-4 italic">
                                            <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_10px_#FF5A00]" /> ARTIFACT_DOSSIERS
                                        </h4>
                                        <div className="space-y-6">
                                            {[
                                                { name: "CORE_AGREEMENT_P1.PDF", size: "2.4MB", type: "AUTHORIZED" },
                                                { name: "YIELD_PROJECTIONS_XLS.DTA", size: "12KB", type: "ENCRYPTED" },
                                                { name: "DISCLOSURE_PROTOCOL_V4.PDF", size: "8.1MB", type: "PUBLIC" }
                                            ].map((doc, i) => (
                                                <button key={i} className="w-full p-8 bg-zinc-50 dark:bg-white/[0.03] border-2 border-border/50 rounded-[2.5rem] flex items-center justify-between group/doc hover:border-primary hover:translate-y-[-8px] transition-all shadow-xl relative overflow-hidden">
                                                    <div className="absolute inset-y-0 right-0 w-1 bg-transparent group-hover/doc:bg-primary transition-colors" />
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-primary border border-white/5 shadow-inner">
                                                            <Paperclip size={24} className="opacity-40 group-hover/doc:opacity-100 transition-opacity" />
                                                        </div>
                                                        <div className="text-left">
                                                            <span className="text-[10px] font-black uppercase tracking-[3px] block mb-1">{doc.name}</span>
                                                            <span className="text-[8px] font-black opacity-20 tracking-[2px]">{doc.size} // {doc.type}</span>
                                                        </div>
                                                    </div>
                                                    <Download size={20} className="opacity-0 group-hover/doc:opacity-100 transition-all text-primary translate-x-4 group-hover/doc:translate-x-0" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-10 bg-zinc-950 text-white rounded-[3rem] border-2 border-white/5 relative overflow-hidden group/risk">
                                         <div className="absolute top-[-50%] right-[-30%] w-60 h-60 bg-primary/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform" />
                                         <div className="flex items-center gap-6 mb-6 relative z-10">
                                            <Radar size={24} className="text-primary animate-pulse" strokeWidth={3} />
                                            <span className="text-[10px] font-black uppercase tracking-[5px] opacity-40 italic">RISK_SURVEILLANCE_REPORT</span>
                                         </div>
                                         <p className="text-[12px] font-black opacity-50 uppercase tracking-[4px] leading-relaxed italic relative z-10">
                                            Optimized for Tier-1 risk vectors. Recommended for entities requiring mission-critical safeguard parameters. Operational priority: HIGH in domestic economic sectors.
                                         </p>
                                         <div className="mt-8 pt-8 border-t border-white/5 relative z-10 flex justify-between items-center">
                                            <span className="text-[9px] font-black uppercase tracking-[3px] text-primary">STABILITY_INDEX</span>
                                            <span className="text-xl font-black italic tracking-tighter">94.8%</span>
                                         </div>
                                    </div>
                                </div>
                             </div>

                             <div className="mt-16 pt-12 border-t border-border/20 flex flex-wrap gap-12 items-center text-[10px] font-black uppercase tracking-[5px] opacity-10 relative z-10 italic">
                                <span className="flex items-center gap-4"><Lock size={14} /> SECURE_ORBITAL_CACHE</span>
                                <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                                <span>VERIFIED_ARTIFACT_ID_#774</span>
                                <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                                <span className="flex items-center gap-4"><Cpu size={14} /> AUTHORIZED_BY_CENTRAL_COMMAND</span>
                             </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetails;