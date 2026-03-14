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
    TrendingUp, AlertCircle, 
    Layout, Box, Lock,
    Eye, Download, Share2, Trash2, Edit3, ClipboardList,
    Layers, Command, Compass, Terminal, Award, Cpu, HardDrive
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
            toast({ title: "SCHEME_DECOMMISSIONED", description: "The policy protocol has been successfully purged from the mainframe." });
            navigate('/admin/policies');
        },
        onError: () => {
            toast({ title: "DECOMMISSION_ERROR", description: "Mainframe rejected the purge request. Verify your clearance levels.", variant: "destructive" });
        }
    });

    const getPolicyIcon = (type) => {
        const iconProps = { size: 36, strokeWidth: 3, className: "text-primary group-hover:scale-110 transition-transform duration-500" };
        switch(type) {
            case 'Health': return <Activity {...iconProps} />;
            case 'Vehicle': case 'Auto': return <Truck {...iconProps} />;
            case 'Property': case 'Home': return <Home {...iconProps} />;
            case 'Life': return <Shield {...iconProps} />;
            case 'Travel': return <Globe {...iconProps} />;
            default: return <FileText {...iconProps} />;
        }
    };

    if (isLoading) return <div className="p-10 bg-background-main min-h-screen"><TableSkeleton rows={8} /></div>;

    if (!policy) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-header-bg text-white p-10 font-display">
            <div className="relative mb-16">
                <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-40 animate-pulse" />
                <AlertCircle size={120} className="text-rose-500 relative z-10" strokeWidth={1} />
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-6">IDENT_NOT_FOUND</h2>
            <p className="text-[11px] font-bold opacity-30 uppercase tracking-[10px] mb-16">THE REQUESTED ASSET PROTOCOL IS EITHER PURGED OR RESTRICTED.</p>
            <button 
                onClick={() => navigate('/admin/policies')} 
                className="h-20 px-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[8px] text-[11px] hover:bg-white hover:text-header-bg transition-all flex items-center justify-center gap-6 shadow-2xl shadow-primary/20 active:scale-95 border border-white/10"
            >
                <ArrowLeft size={24} strokeWidth={4} /> RE_ENTRY_SEQUENCING
            </button>
        </div>
    );

    return (
        <div className="admin-policy-details p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Global Matrix Atmosphere */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 2px, transparent 0)`, backgroundSize: '70px 70px' }} />
            
            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-10">
                        <button 
                            onClick={() => navigate('/admin/policies')}
                            className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-primary border border-slate-200 shadow-2xl hover:translate-x-[-12px] hover:bg-header-bg hover:text-white transition-all duration-500 active:scale-90 group"
                        >
                            <ArrowLeft size={32} strokeWidth={4} />
                        </button>
                        <div>
                             <div className="flex items-center gap-8 mb-4">
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg leading-none">
                                    PROTOCOL<span className="text-primary tracking-normal ml-3">_SPEC</span>
                                </h1>
                                <div className="px-8 py-2.5 bg-header-bg text-white rounded-full text-[10px] font-black uppercase tracking-[5px] shadow-2xl shadow-header-bg/20 border border-white/10">
                                    CLASS: {policy.policyType.toUpperCase()}
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[6px] flex items-center gap-4">
                                <Terminal size={14} className="text-primary" /> MISSION_ASSET_ID: <span className="text-header-bg font-black">#{id.slice(-8).toUpperCase()}</span>
                             </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-8">
                        <button className="h-18 w-18 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary border border-slate-200 shadow-xl transition-all hover:scale-110 active:scale-90">
                            <Share2 size={26} strokeWidth={3} />
                        </button>
                        <button className="h-18 w-18 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary border border-slate-200 shadow-xl transition-all hover:scale-110 active:scale-90">
                            <Edit3 size={26} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Left Column: Visual Unit */}
                <div className="xl:col-span-1 space-y-12">
                    <Reveal width="100%" direction="right">
                        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-[-10%] opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]">
                                {getPolicyIcon(policy.policyType)}
                             </div>
                             
                             <div className="relative mb-16">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="relative w-28 h-28 bg-header-bg rounded-[2.5rem] flex items-center justify-center text-white border border-white/10 shadow-2xl group-hover:rotate-12 transition-all duration-700">
                                    {getPolicyIcon(policy.policyType)}
                                </div>
                             </div>
                             
                             <h2 className="text-4xl font-black uppercase tracking-tight text-header-bg leading-none mb-10 group-hover:text-primary transition-colors duration-500">{policy.policyName}</h2>
                             <div className="w-20 h-1.5 bg-primary mb-12 rounded-full" />
                             <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[4px] leading-relaxed mb-16">
                                {policy.description}
                             </p>

                             <div className="space-y-8">
                                {[
                                    { label: "FISCAL_PREMIUM", value: `₹${policy.premiumAmount?.toLocaleString()}`, sub: "YIELD / PA", icon: IndianRupee, color: "text-primary", bg: "bg-primary/5" },
                                    { label: "TOTAL_LIQUIDITY_COVER", value: `₹${policy.coverageAmount?.toLocaleString()}`, sub: "AGGR_LIMIT", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
                                    { label: "CONTRACT_DURATION", value: `${policy.durationYears} YEARS`, sub: "OPS_WINDOW", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" }
                                ].map((stat, i) => (
                                    <div key={i} className={`p-10 ${stat.bg} rounded-[2.5rem] border border-slate-100 transition-all shadow-sm relative overflow-hidden group/item hover:border-primary/30`}>
                                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-[1500ms]" />
                                         <p className="text-[10px] font-black uppercase tracking-[6px] text-slate-400 mb-4">{stat.label}</p>
                                         <div className="flex items-center gap-6">
                                            <div className="p-3 bg-white rounded-xl shadow-md">
                                                <stat.icon size={22} className={stat.color} strokeWidth={3} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-3xl font-black uppercase tracking-tighter text-header-bg leading-none">{stat.value}</span>
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[3px] mt-2">{stat.sub}</span>
                                            </div>
                                         </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </Reveal>

                    <Reveal width="100%" direction="up" delay={0.2}>
                         <div className="bg-header-bg text-white p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-rose-900/40 opacity-50" />
                            <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[120px] pointer-events-none group-hover:scale-150 transition-transform duration-[3000ms]" />
                            
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-12 flex items-center gap-6 relative z-10 leading-none">
                                <div className="p-4 bg-white/5 rounded-2xl text-primary border border-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <Zap size={28} strokeWidth={3} />
                                </div>
                                COMMANDS
                            </h3>
                            
                            <div className="space-y-8 relative z-10">
                                <button className="w-full h-20 bg-white text-header-bg rounded-[2rem] font-black text-[11px] uppercase tracking-[6px] hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-6 shadow-2xl active:scale-95 group/btn border-4 border-white/10">
                                    RECONFIGURE_PROTOCOL <TrendingUp size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                                <button 
                                    onClick={() => deleteMutation.mutate()}
                                    className="w-full h-20 bg-rose-600/10 text-rose-500 border-2 border-rose-500/30 rounded-[2rem] font-black text-[11px] uppercase tracking-[6px] hover:bg-rose-600 hover:text-white transition-all duration-500 flex items-center justify-center gap-6 shadow-2xl active:scale-95 group/del"
                                >
                                    PURGE_PROTOCOL <Trash2 size={20} strokeWidth={3} className="group-hover/del:rotate-12 transition-transform" />
                                </button>
                            </div>
                         </div>
                    </Reveal>
                </div>

                {/* Right Column: Deep Specifications */}
                <div className="xl:col-span-2 space-y-12">
                    <Reveal width="100%" direction="left">
                        <div className="bg-white p-12 lg:p-20 rounded-[5rem] border border-slate-200 shadow-2xl flex flex-col relative overflow-hidden">
                             <div className="absolute top-0 left-[-10%] opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[5000ms]">
                                <Layers size={500} className="text-header-bg" />
                             </div>
                             
                             <div className="mb-16 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                                <div className="flex items-center gap-10">
                                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-slate-100">
                                        <Award size={36} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">ASSET_SPECIFICATIONS</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[6px] mt-4 flex items-center gap-4">
                                            <Compass size={14} className="text-primary" /> Full matrix mapping for global deployment configuration
                                        </p>
                                    </div>
                                </div>
                                <div className="flex -space-x-4">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="w-14 h-14 rounded-2xl border-4 border-white bg-header-bg flex items-center justify-center text-[10px] font-black text-white group-hover:translate-y-[-8px] transition-transform" style={{ transitionDelay: `${i * 100}ms` }}>S{i}</div>
                                    ))}
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10 flex-1">
                                <div className="group/intel">
                                    <h4 className="text-[11px] font-black uppercase tracking-[6px] text-primary mb-12 flex items-center gap-6 group-hover/intel:translate-x-4 transition-transform duration-500">
                                        <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/40" /> PROTOCOL_CONSTRAINTS
                                    </h4>
                                    <div className="relative">
                                        <div className="absolute left-[-40px] top-0 bottom-0 w-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="w-full bg-primary h-1/2 rounded-full" />
                                        </div>
                                        <div className="prose prose-lg max-w-none">
                                             <p className="text-sm font-bold text-slate-500 uppercase tracking-[4px] leading-[2.6] whitespace-pre-wrap group-hover:text-header-bg transition-colors duration-700">
                                                {policy.terms || "CRITICAL: THIS OPERATION IS GOVERNED BY SECURE SHIELD ENTERPRISE BYLAWS. ANY DEVIATION FROM DEFINED PARAMETERS REQUIRES CLASS-A AUTHORIZATION. ASSET PROTECTION IS SUBJECT TO GLOBAL COMPLIANCE VERIFICATION."}
                                             </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-20">
                                    <div className="space-y-12">
                                        <h4 className="text-[11px] font-black uppercase tracking-[6px] text-primary mb-12 flex items-center gap-6">
                                            <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/40" /> SECURE_ASSET_LOGS
                                        </h4>
                                        <div className="grid grid-cols-1 gap-8">
                                            {[
                                                { name: "PROTOCOL_MANIFEST.PDF", size: "2.4 MB", type: "ENCRYPTED" },
                                                { name: "YIELD_ANALYSIS.XLSX", size: "1.2 MB", type: "SECURE" },
                                                { name: "COMPLIANCE_CERT.PDF", size: "812 KB", type: "VERIFIED" }
                                            ].map((doc, i) => (
                                                <button key={i} className="w-full p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between group/doc hover:border-primary/50 hover:bg-white hover:translate-y-[-10px] transition-all duration-500 shadow-xl relative overflow-hidden">
                                                    <div className="absolute inset-y-0 left-0 w-2 bg-transparent group-hover/doc:bg-primary transition-colors duration-500" />
                                                    <div className="flex items-center gap-8">
                                                        <div className="w-16 h-16 bg-header-bg rounded-2xl flex items-center justify-center text-primary shadow-2xl border border-white/5">
                                                            <Paperclip size={28} className="text-white/40 group-hover/doc:text-primary transition-colors duration-500" />
                                                        </div>
                                                        <div className="text-left flex flex-col gap-2">
                                                            <span className="text-[11px] font-black uppercase tracking-[4px] text-header-bg">{doc.name}</span>
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[3px]">{doc.size} // {doc.type}</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary opacity-0 group-hover/doc:opacity-100 translate-x-10 group-hover/doc:translate-x-0 transition-all duration-700">
                                                        <Download size={22} strokeWidth={3} />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-12 bg-header-bg text-white rounded-[3.5rem] border border-white/10 relative overflow-hidden group/risk shadow-2xl">
                                         <div className="absolute top-[-50%] right-[-50%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] group-hover:scale-150 transition-transform duration-[5000ms]" />
                                         <div className="flex items-center gap-8 mb-10 relative z-10">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                                <ClipboardList size={32} strokeWidth={3} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] font-black uppercase tracking-[5px]">VETTING_SUMMARY</span>
                                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[3px]">CALIBRATING_RISK_VECTOR</span>
                                            </div>
                                         </div>
                                         <p className="text-[13px] font-bold text-white/50 uppercase tracking-[4px] leading-relaxed italic relative z-10 group-hover:text-white/80 transition-colors duration-500">
                                            GLOBAL_RISK_INDEX: STABLE. ALL COMPLIANCE MATRICES REPORT POSITIVE INITIALIZATION. MISSION-READY STATUS AUTHORIZED.
                                         </p>
                                         <div className="mt-12 pt-10 border-t border-white/5 relative z-10 flex justify-between items-end">
                                            <div className="flex flex-col gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-[5px] text-primary">STABILITY_COEF</span>
                                                <div className="flex gap-2">
                                                    {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`w-3 h-1.5 rounded-full ${i <= 7 ? 'bg-primary' : 'bg-white/10'}`} />)}
                                                </div>
                                            </div>
                                            <span className="text-4xl font-black uppercase tracking-tighter text-white">94.8%</span>
                                         </div>
                                    </div>
                                </div>
                             </div>

                             <div className="mt-20 pt-16 border-t border-slate-100 flex flex-wrap gap-12 items-center text-[10px] font-black uppercase tracking-[6px] text-slate-300 relative z-10">
                                <span className="flex items-center gap-5 bg-slate-50 px-6 py-2 rounded-xl group hover:text-header-bg transition-colors"><Lock size={16} className="text-primary" /> SECURED_CRYPTO_MANIFEST</span>
                                <div className="w-2.5 h-2.5 bg-slate-200 rounded-full animate-pulse" />
                                <span className="flex items-center gap-5 bg-slate-50 px-6 py-2 rounded-xl group hover:text-header-bg transition-colors"><ShieldCheck size={16} className="text-primary" /> VALIDATED_ASSET_#774</span>
                                <div className="w-2.5 h-2.5 bg-slate-200 rounded-full animate-pulse" />
                                <span className="flex items-center gap-5 bg-slate-50 px-6 py-2 rounded-xl group hover:text-header-bg transition-colors"><Globe size={16} className="text-primary" /> GLOBAL_SYNC_ACTIVE</span>
                             </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetails;