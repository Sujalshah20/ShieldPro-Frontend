import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Shield, ShieldCheck, Zap, Activity, 
    Truck, Home, Globe, FileText,
    TrendingUp, Calendar, Clock, ArrowUpRight,
    Target, Cpu, Satellite, Lock, Command,
    Fingerprint, Terminal, HeartPulse, ShieldAlert,
    Layers, IndianRupee, RefreshCcw, SearchCheck,
    ChevronRight, Award, Briefcase, Plus,
    Layout, Eye, Database, Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TableSkeleton } from "../../components/common/Skeleton";
import Reveal from "../../components/common/Reveal";
import { useNavigate } from "react-router-dom";

const CustomerPolicies = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { data: myPolicies = [], isLoading } = useQuery({
        queryKey: ['myPolicies', user?.token],
        queryFn: () => api.get('/user-policies', user.token),
        enabled: !!user?.token
    });

    const getPolicyIcon = (type) => {
        const iconProps = { size: 44, strokeWidth: 2.5, className: "group-hover:scale-110 transition-all duration-700" };
        switch(type) {
            case 'Health': return <Activity {...iconProps} />;
            case 'Vehicle': case 'Auto': return <Truck {...iconProps} />;
            case 'Property': case 'Home': return <Home {...iconProps} />;
            case 'Life': return <Shield {...iconProps} />;
            case 'Travel': return <Globe {...iconProps} />;
            default: return <FileText {...iconProps} />;
        }
    };

    const getPolicyGradient = (type) => {
        switch(type) {
            case 'Health': return "from-rose-500/10 to-transparent";
            case 'Vehicle': case 'Auto': return "from-emerald-500/10 to-transparent";
            case 'Property': case 'Home': return "from-amber-500/10 to-transparent";
            case 'Life': return "from-blue-500/10 to-transparent";
            case 'Travel': return "from-violet-500/10 to-transparent";
            default: return "from-slate-500/10 to-transparent";
        }
    };

    if (isLoading) return (
        <div className="py-20 space-y-12 h-screen">
             <div className="h-20 w-[400px] bg-slate-50 animate-pulse rounded-[2.5rem] border-2 border-slate-100" />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[1,2,3].map(i => <div key={i} className="h-[600px] bg-white rounded-[5rem] border-2 border-slate-50 animate-pulse shadow-4xl" />)}
             </div>
        </div>
    );

    return (
        <div className="space-y-16 pb-24">
            {/* Elite Inventory Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-3 h-12 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black uppercase tracking-[8px] text-[#003249] italic leading-none opacity-60">Global_Asset_Manifest_v4.2</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] mt-2 italic">SECTOR: ACTIVE_VAULT_SYNC</span>
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Protection <span className="text-[#007ea7]">Grid_</span></h1>
                        <p className="max-w-2xl text-slate-400 font-bold uppercase tracking-[4px] text-xs italic leading-relaxed">
                            A unified visualization of your deployed protection protocols. Each node represents a synchronized 
                            <span className="text-[#007ea7]"> ShieldPro Asset</span> operating under active v4.2 SIGMA guidelines.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="bg-[#003249] p-12 rounded-[5rem] border-4 border-white shadow-4xl flex items-center gap-12 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                         <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:rotate-45 transition-transform duration-[8000ms]">
                            <Satellite size={220} className="text-[#007ea7]" strokeWidth={1} />
                         </div>
                         
                         <div className="relative z-10 w-24 h-24 rounded-[3rem] bg-[#007ea7] flex items-center justify-center text-white shadow-4xl group-hover:scale-110 transition-transform duration-700 border-4 border-white/20">
                            <Database size={44} strokeWidth={2.5} />
                         </div>
                         
                         <div className="relative z-10 space-y-3">
                            <span className="text-[11px] font-black uppercase tracking-[8px] text-[#80ced7] italic block opacity-60 leading-none">ACTIVE_RESOURCES</span>
                            <div className="flex items-end gap-6">
                                <span className="text-7xl font-black tracking-tighter text-white italic leading-none">{myPolicies.length}</span>
                                <div className="flex flex-col mb-1">
                                    <span className="text-[10px] text-[#007ea7] font-black uppercase tracking-[4px] italic leading-none">SYNC_STABLE</span>
                                    <div className="w-12 h-1 bg-emerald-500 mt-2 rounded-full shadow-[0_0_10px_#10b981]" />
                                </div>
                            </div>
                         </div>
                    </div>
                </Reveal>
            </div>

            {myPolicies.length === 0 ? (
                <Reveal direction="up" delay={0.2}>
                    <div className="text-center py-72 bg-white/50 backdrop-blur-md border-4 border-dashed border-slate-100 rounded-[6rem] group hover:border-[#007ea7]/30 transition-all duration-1000 relative overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-mesh-gradient opacity-20 pointer-events-none" />
                        <ShieldAlert size={140} strokeWidth={1.5} className="mx-auto mb-12 text-slate-100 group-hover:text-[#007ea7] group-hover:scale-110 group-hover:rotate-12 transition-all duration-[1500ms]" />
                        <h3 className="text-5xl font-black uppercase tracking-[15px] text-[#003249]/10 italic mb-10 group-hover:text-[#003249]/20 transition-all">Vault_Empty_</h3>
                        <p className="text-[14px] font-black uppercase text-slate-300 tracking-[8px] max-w-xl mx-auto italic leading-relaxed opacity-60 group-hover:opacity-100 transition-all">
                            No active protection protocols detected in your asset grid. Initial authorization required for node deployment.
                        </p>
                        <button 
                            onClick={() => navigate('/customer/apply')}
                            className="mt-16 h-20 px-16 bg-[#003249] text-[#80ced7] rounded-[2.5rem] text-[13px] font-black uppercase tracking-[8px] shadow-4xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 italic group relative overflow-hidden/btn"
                        >
                             DEPLOY_FIRST_NODE <Plus className="group-hover:rotate-180 transition-transform duration-700" size={24} strokeWidth={3} />
                        </button>
                    </div>
                </Reveal>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
                    {myPolicies.map((p, idx) => (
                        <Reveal key={p._id} direction="up" delay={0.1 + idx * 0.1}>
                            <div className="saas-card group relative overflow-hidden flex flex-col min-h-[620px] shadow-4xl transition-all duration-1000 hover:border-[#007ea7]/30 border-2 border-slate-50 bg-white/50 backdrop-blur-md rounded-[5rem] p-16">
                                {/* Ambient Field Effect */}
                                <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${getPolicyGradient(p.policy?.policyType)} blur-[120px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-[6000ms] opacity-60`} />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#003249_1px,transparent_0)] [background-size:32px_32px] opacity-[0.015] pointer-events-none" />

                                <div className="flex flex-col h-full relative z-20">
                                    <div className="flex justify-between items-start mb-20">
                                        <div className="w-32 h-32 bg-[#003249] border-4 border-white shadow-4xl rounded-[3.5rem] flex items-center justify-center text-[#007ea7] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 relative overflow-hidden">
                                             <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                            {getPolicyIcon(p.policy?.policyType)}
                                        </div>
                                        <div className="flex flex-col items-end gap-5">
                                            <div className="px-8 py-3 bg-slate-50/50 backdrop-blur-sm border-2 border-slate-100 rounded-3xl text-[11px] font-black text-[#003249] uppercase tracking-[6px] shadow-inner italic group-hover:bg-[#003249] group-hover:text-[#80ced7] group-hover:border-[#003249] transition-all duration-500">
                                                ID: {p.policyNumber.toUpperCase()}
                                            </div>
                                            <div className="flex items-center gap-4 bg-white/80 px-5 py-2 rounded-2xl border border-slate-100 shadow-sm opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Fingerprint size={14} strokeWidth={3} className="text-[#007ea7]" />
                                                <span className="text-[10px] font-black uppercase tracking-[4px] italic text-[#003249]">BIO_LOCKED</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6 mb-16">
                                        <h2 className="text-5xl font-black text-[#003249] leading-tight uppercase tracking-tighter italic group-hover:text-[#007ea7] transition-all duration-500">
                                            {p.policy?.policyName}
                                        </h2>
                                        <div className="w-20 h-2 bg-[#007ea7] mb-8 rounded-full group-hover:w-40 transition-all duration-1000 shadow-[0_0_20px_#007ea7]" />
                                        
                                        <div className="inline-flex items-center gap-6 p-6 bg-emerald-50 text-emerald-600 rounded-3xl border-2 border-emerald-100 shadow-sm group-hover:shadow-emerald-500/10 transition-all duration-700">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
                                            <span className="text-[12px] font-black uppercase tracking-[6px] italic leading-none">ACTIVE_GRID_SYNC_STABLE</span>
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="p-12 bg-[#003249] rounded-[4rem] border-4 border-white shadow-4xl relative overflow-hidden group/val hover:translate-y-[-5px] transition-all duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/val:rotate-45 transition-transform">
                                                <Target size={120} strokeWidth={1} />
                                            </div>
                                            
                                            <div className="flex flex-col relative z-10 gap-8">
                                                <div className="flex items-center justify-between">
                                                     <span className="text-[11px] font-black text-[#80ced7] uppercase tracking-[10px] italic leading-none opacity-60">UPLINK_VALUATION</span>
                                                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#007ea7] border border-white/10 shadow-2xl">
                                                        <SearchCheck size={28} strokeWidth={3} />
                                                     </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                                                        <IndianRupee size={32} strokeWidth={4} className="text-[#007ea7]" />
                                                    </div>
                                                    <span className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                                                        {(p.policy?.coverageAmount / 100000).toFixed(1)}L <span className="text-2xl text-[#80ced7] opacity-40">INR</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-10 bg-slate-50/50 backdrop-blur-md border-2 border-slate-100 p-10 rounded-[3.5rem] shadow-inner group-hover:bg-white transition-all duration-700">
                                             <div className="flex flex-col gap-4 border-r-2 border-slate-100 pr-8">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic leading-none flex items-center gap-3">
                                                    <Calendar size={12} strokeWidth={4} className="text-[#003249]" /> DEPLOYED
                                                </span>
                                                <span className="text-[14px] font-black text-[#003249] tracking-[2px] uppercase italic">{new Date(p.purchaseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                                             </div>
                                             <div className="flex flex-col gap-4 items-end text-right pl-8">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic leading-none flex items-center gap-3">
                                                    EXPIRY <Clock size={12} strokeWidth={4} className="text-[#007ea7]" />
                                                </span>
                                                <span className="text-[14px] font-black text-[#003249] tracking-[2px] uppercase italic">{new Date(p.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                                             </div>
                                        </div>

                                        <div className="flex gap-6">
                                            <button className="flex-1 h-20 bg-white border-2 border-slate-100 text-[#003249] rounded-[2.5rem] text-[12px] font-black uppercase tracking-[8px] shadow-4xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center justify-center gap-6 active:scale-95 group/btn italic overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/5 to-transparent pointer-events-none" />
                                                ASSET_DNA <Terminal size={24} strokeWidth={3} className="text-[#007ea7] group-hover/btn:translate-x-2' transition-transform" />
                                            </button>
                                            <button className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex items-center justify-center text-[#003249] hover:bg-[#007ea7] hover:border-[#007ea7] hover:text-white transition-all active:scale-90 group/share shadow-xl">
                                                <Share2 size={28} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            )}

            {/* Matrix Status Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-24 pt-20 border-t-4 border-slate-50 relative">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] w-32 h-1 bg-[#007ea7] rounded-full" />
                    
                    {[
                        { icon: Fingerprint, label: "VAL_PROTO_ACTIVE" },
                        { icon: Layers, label: "GRID_SYNC_NOMINAL" },
                        { icon: Zap, label: "ENCRYPT_AES_512" },
                        { icon: RefreshCcw, label: "NODES_REDUNDANT" }
                    ].map((status, i) => (
                        <div key={i} className="flex items-center gap-5 group cursor-crosshair">
                            <status.icon size={28} strokeWidth={3} className="text-[#007ea7] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 opacity-20 group-hover:opacity-100" />
                            <span className="text-[12px] font-black text-slate-300 uppercase tracking-[10px] italic leading-none group-hover:text-[#003249] transition-colors">{status.label}</span>
                        </div>
                    ))}
                </div>
            </Reveal>
        </div>
    );
};

export default CustomerPolicies;