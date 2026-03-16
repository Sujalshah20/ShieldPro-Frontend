import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Paperclip, ArrowLeft, Shield, Clock, 
    IndianRupee, Activity, Truck, Home, 
    Globe, FileText, Zap, ShieldCheck,
    TrendingUp, AlertCircle, 
    Layout, Box, Lock,
    Eye, Download, Share2, Trash2, Edit3, ClipboardList,
    Layers, Command, Compass, Terminal, Award, Cpu, HardDrive, ChevronRight,
    UserCheck, User, ShieldAlert, Fingerprint, Satellite, RefreshCcw, SearchCheck
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
            toast({ 
                title: "SCHEME_DECOMMISSIONED", 
                description: "The policy protocol has been successfully purged from the mainframe.",
                variant: "default"
            });
            navigate('/admin/policies');
        },
        onError: () => {
            toast({ 
                title: "DECOMMISSION_ERROR", 
                description: "Mainframe rejected the purge request. Verify your clearance levels.", 
                variant: "destructive" 
            });
        }
    });

    const getPolicyIcon = (type) => {
        const iconProps = { size: 36, strokeWidth: 3, className: "text-[#007ea7] group-hover:scale-110 transition-transform duration-500" };
        switch(type) {
            case 'Health': return <Activity {...iconProps} />;
            case 'Vehicle': case 'Auto': return <Truck {...iconProps} />;
            case 'Property': case 'Home': return <Home {...iconProps} />;
            case 'Life': return <Shield {...iconProps} />;
            case 'Travel': return <Globe {...iconProps} />;
            default: return <FileText {...iconProps} />;
        }
    };

    const coverageItems = [
        { name: "Fire and Lightning", description: "Coverage for damage caused by fire, smoke, and lightning strikes.", icon: Zap },
        { name: "Windstorm and Hail", description: "Protection against severe weather conditions and structural damage.", icon: Activity },
        { name: "Theft and Burglary", description: "Security coverage for stolen property and resulting physical damage.", icon: ShieldCheck },
    ];

    if (isLoading) return (
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-50 rounded-[2.5rem] animate-pulse border-2 border-slate-100" />)}
             </div>
             <div className="h-[600px] bg-slate-50 rounded-[3rem] animate-pulse border-2 border-slate-100" />
        </div>
    );

    if (!policy) return (
        <div className="flex flex-col items-center justify-center py-40 text-center space-y-12">
            <Reveal direction="up">
                <div className="w-32 h-32 bg-[#003249] rounded-[3rem] flex items-center justify-center text-[#007ea7] mx-auto shadow-4xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                     <ShieldAlert size={64} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                </div>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
                <div className="space-y-4">
                    <h2 className="text-5xl font-black uppercase text-[#003249] tracking-tighter italic">Asset_Not_Found</h2>
                    <p className="text-[12px] font-black uppercase tracking-[8px] text-slate-400 max-w-md mx-auto leading-relaxed">The requested policy protocol does not exist in the active mainframe or has been decommissioned.</p>
                </div>
            </Reveal>
            <Reveal direction="up" delay={0.4}>
                <button 
                    onClick={() => navigate('/admin/policies')} 
                    className="h-18 px-12 bg-[#003249] text-[#80ced7] rounded-[2rem] text-[11px] font-black uppercase tracking-[6px] hover:bg-[#007ea7] hover:text-white transition-all shadow-3xl active:scale-95 italic group flex items-center gap-6"
                >
                    <ArrowLeft size={18} strokeWidth={3} className="group-hover:-translate-x-2 transition-transform" /> RETURN_TO_INVENTORY
                </button>
            </Reveal>
        </div>
    );

    return (
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="flex items-center gap-10">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-20 h-20 bg-white rounded-[1.8rem] flex items-center justify-center text-[#003249] shadow-4xl border-2 border-slate-100 hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all active:scale-95 group"
                        >
                            <ArrowLeft size={32} strokeWidth={3} className="group-hover:-translate-x-2 transition-transform" />
                        </button>
                        <div className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                                <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Policy_Portfolio_Analysis</span>
                                <span className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[5px] border-2 border-emerald-50 shadow-xl flex items-center gap-4 italic scale-90 origin-left">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]" /> SYNC_UP
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none truncate max-w-2xl">{policy.policyName} <span className="text-[#007ea7]">_</span></h1>
                            <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Detailed asset overview and coverage configuration for sequence <span className="text-[#003249]">#{id.slice(-12).toUpperCase()}</span></p>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-wrap items-center gap-6">
                        <button className="h-18 px-10 bg-white border-2 border-slate-100 text-[#003249] rounded-[2rem] flex items-center gap-5 text-[11px] font-black uppercase tracking-[5px] hover:border-[#003249] transition-all shadow-xl active:scale-95 italic group">
                             <Edit3 size={20} className="group-hover:rotate-12 transition-transform" strokeWidth={3} /> MANAGE_PROTOCOL
                        </button>
                        <button 
                            onClick={() => deleteMutation.mutate()}
                            className="h-18 px-10 bg-[#003249] text-rose-400 rounded-[2rem] flex items-center gap-5 text-[11px] font-black uppercase tracking-[5px] hover:bg-rose-600 hover:text-white transition-all shadow-3xl active:scale-95 italic group border-2 border-white/5"
                        >
                            <Trash2 size={20} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> DECOMMISSION_NODE
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* Tactical Metrics Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Asset Valuation", value: `₹${policy.coverageAmount?.toLocaleString()}`, icon: Shield, trend: "+14.8%", tag: "COVERAGE_VAL" },
                    { label: "Annual Premium", value: `₹${policy.premiumAmount?.toLocaleString()}`, icon: IndianRupee, trend: "-2.4%", tag: "FISCAL_COST" },
                    { label: "Renewal Sequence", value: "Oct 12, 2026", icon: Clock, trend: "LOCKED", tag: "TERM_SYNC" },
                    { label: "Platform Trait", value: "0 CLAIMS", icon: ClipboardList, trend: "NOMINAL", tag: "AUDIT_HIST" }
                ].map((stat, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="saas-card group relative p-10 border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[260px] flex flex-col justify-between overflow-hidden">
                             {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <stat.icon size={120} className="text-[#003249]" />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${i === 0 ? 'bg-[#003249] text-[#007ea7] shadow-3xl border border-white/5 group-hover:rotate-12' : 'bg-slate-50 text-slate-300 border-2 border-slate-100 group-hover:bg-[#003249] group-hover:text-[#007ea7]'}`}>
                                    <stat.icon size={28} strokeWidth={3} />
                                </div>
                                <span className="text-[9px] font-black text-[#007ea7] uppercase tracking-[5px] italic">{stat.trend}</span>
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] mb-4 italic flex items-center gap-3">
                                    <Terminal size={12} className="text-[#007ea7]" /> {stat.label}
                                </p>
                                <h2 className="text-3xl font-black text-[#003249] tracking-tighter italic uppercase group-hover:text-[#007ea7] transition-colors">{stat.value}</h2>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Protocol Manifest & Matrix */}
                <div className="xl:col-span-8 space-y-12">
                    <Reveal direction="up" delay={0.4}>
                        <div className="saas-card p-12 md:p-16 group relative overflow-hidden border-2 border-slate-50">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
                            
                            <div className="flex items-center gap-10 mb-16 relative z-10">
                                <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5 group-hover:rotate-180 transition-transform duration-1000">
                                    <FileText size={36} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Protocol Manifest</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Primary functional parameters and coverage logic</p>
                                </div>
                            </div>
                            
                            <div className="p-10 bg-slate-50/50 rounded-[3rem] border-2 border-slate-50 relative z-10 shadow-inner group/desc hover:bg-white hover:border-[#007ea7]/20 transition-all duration-700">
                                <p className="text-slate-500 font-bold leading-[2.2] text-base italic uppercase tracking-wider line-clamp-6 group-hover/desc:line-clamp-none transition-all">
                                    {policy.description || "This policy provides comprehensive commercial protection for high-value assets. Designed for enterprise-grade operations, it includes specific protocols for liability mitigation and asset recovery under standard global compliance frameworks. Automated reconciliation systems ensure 24/7 coverage synchronization across all registered operational nodes."}
                                </p>
                            </div>
                            
                            <div className="mt-20 space-y-10 relative z-10">
                                <div className="flex items-center gap-8">
                                    <div className="h-0.5 bg-slate-100 flex-1" />
                                    <h4 className="text-[11px] font-black text-[#007ea7] uppercase tracking-[10px] italic flex items-center gap-5">
                                        <Layers size={18} strokeWidth={3} /> Coverage_Logic_Matrix
                                    </h4>
                                    <div className="h-0.5 bg-slate-100 flex-1" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {coverageItems.map((item, i) => (
                                        <div key={i} className="p-10 bg-white border-2 border-slate-50 rounded-[3.5rem] group/item hover:border-[#007ea7] hover:bg-slate-50/30 transition-all shadow-xl hover:shadow-3xl">
                                            <div className="flex items-center gap-8 mb-6">
                                                <div className="w-16 h-16 bg-slate-50 shadow-inner border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center text-[#003249] group-hover/item:bg-[#003249] group-hover/item:text-[#80ced7] transition-all transform group-hover/item:rotate-[-12deg] group-hover/item:scale-110">
                                                    <item.icon size={28} strokeWidth={3} />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xl font-black text-[#003249] uppercase tracking-tighter italic block leading-none">{item.name.replace(' ', '_')}</span>
                                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[4px] italic">STATUS: ACTIVE</span>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-400 leading-relaxed font-black uppercase tracking-[5px] italic opacity-60 group-hover/item:opacity-100 transition-opacity">{item.description}</p>
                                        </div>
                                    ))}
                                    <div className="p-10 bg-slate-50/20 border-2 border-dashed border-slate-200 rounded-[3.5rem] flex flex-col items-center justify-center text-center group/add hover:border-[#007ea7] transition-all cursor-pointer">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-200 group-hover/add:bg-[#003249] group-hover/add:text-[#80ced7] transition-all shadow-lg mb-4">
                                            <Box size={24} strokeWidth={3} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[5px] italic group-hover/add:text-[#003249]">Inject_Custom_Protocol</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Secure Information Panel */}
                <div className="xl:col-span-4 space-y-12">
                    {/* Entity Signature */}
                    <Reveal direction="up" delay={0.6}>
                        <div className="saas-card p-12 group relative overflow-hidden border-2 border-slate-50 hover:border-[#007ea7]/20 transition-all duration-700">
                             {/* Decorative Hologram */}
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-150 transition-transform duration-[5000ms] -rotate-12 text-[#003249]">
                                 <Fingerprint size={200} strokeWidth={1} />
                            </div>

                            <h3 className="text-[13px] font-black text-[#007ea7] mb-10 uppercase tracking-[10px] italic flex items-center gap-5 leading-none">
                                <Fingerprint size={24} strokeWidth={3} /> Entity_Record
                            </h3>
                            
                            <div className="flex items-center gap-8 mb-12 p-8 bg-[#003249] rounded-[2.5rem] shadow-4xl relative z-10 overflow-hidden border-4 border-white">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                <div className="w-18 h-18 bg-[#007ea7] rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl relative z-10 skew-x-[-10deg]">
                                    <span className="skew-x-[10deg]">AW</span>
                                </div>
                                <div className="relative z-10 space-y-2">
                                    <p className="text-2xl font-black text-white leading-none tracking-tighter italic">Alexander Wright</p>
                                    <p className="text-[10px] text-[#80ced7] font-black uppercase tracking-[6px] italic opacity-60 group-hover:tracking-[8px] transition-all">LEVEL_5_CLEARANCE</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                                <div className="p-8 bg-slate-50/50 rounded-[2rem] border-2 border-slate-50 group-hover:bg-white group-hover:border-[#007ea7]/20 transition-all shadow-inner">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] mb-4 italic flex items-center gap-3">
                                        <Satellite size={14} className="text-[#007ea7]" strokeWidth={3} /> UPLINK_ADDRESS
                                    </p>
                                    <p className="text-[13px] font-black text-[#003249] italic break-all">ALEX.WRIGHT@CORP_INFRA.NODE</p>
                                </div>
                                <div className="p-8 bg-slate-50/50 rounded-[2rem] border-2 border-slate-50 group-hover:bg-white group-hover:border-[#007ea7]/20 transition-all shadow-inner">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] mb-4 italic flex items-center gap-3">
                                        <ShieldCheck size={14} className="text-emerald-500" strokeWidth={3} /> SYNC_VERIFICATION
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
                                        <span className="text-[11px] font-black text-[#003249] italic uppercase tracking-[5px]">VERIFIED_CLASS_AA_NODE</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button className="w-full mt-10 h-20 bg-slate-50 text-[#003249] text-[11px] font-black uppercase tracking-[8px] border-2 border-slate-50 rounded-3xl hover:bg-[#003249] hover:text-[#80ced7] transition-all flex items-center justify-center gap-6 italic active:scale-95 group/btn shadow-inner">
                                INSPECT_CLIENT_MATRIX <ChevronRight size={18} strokeWidth={4} className="group-hover/btn:translate-x-3 transition-transform" />
                            </button>
                        </div>
                    </Reveal>

                    {/* Policy Sectors */}
                    <Reveal direction="up" delay={0.8}>
                        <div className="saas-card bg-[#003249] text-white rounded-[4rem] border border-white/5 shadow-4xl relative overflow-hidden group p-12">
                            <div className="absolute bottom-[-10%] right-[-10%] opacity-10 pointer-events-none transform rotate-12 group-hover:scale-125 transition-transform duration-[4000ms]">
                                <HardDrive size={300} strokeWidth={1} className="text-white" />
                            </div>
                            
                            <h3 className="text-[13px] font-black mb-12 relative z-10 uppercase tracking-[10px] italic flex items-center gap-5 text-[#80ced7] leading-none">
                                <Cpu size={24} strokeWidth={3} className="text-[#007ea7]" /> Policy_Sectors
                            </h3>
                            
                            <div className="space-y-6 relative z-10">
                                {[
                                    { name: "Contract_Specs.pdf", size: "2.4 MB", icon: FileText },
                                    { name: "Coverage_Matrix.xls", size: "1.1 MB", icon: Layers },
                                    { name: "Security_Audit.log", size: "840 KB", icon: Lock },
                                ].map((doc, i) => (
                                    <button key={i} className="w-full p-8 bg-white/5 border-2 border-white/5 rounded-[2.5rem] flex items-center justify-between group/doc hover:bg-white/10 hover:border-[#007ea7]/30 transition-all active:scale-95 shadow-inner">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#007ea7] group-hover/doc:bg-[#007ea7] group-hover/doc:text-white transition-all shadow-xl group-hover/doc:rotate-12">
                                                <doc.icon size={24} strokeWidth={3} />
                                            </div>
                                            <div className="text-left space-y-1">
                                                <p className="text-[11px] font-black uppercase tracking-[4px] leading-none group-hover/doc:text-[#80ced7] transition-colors">{doc.name}</p>
                                                <p className="text-[9px] text-white/20 font-black uppercase tracking-[4px] italic">{doc.size}</p>
                                            </div>
                                        </div>
                                        <Download size={20} strokeWidth={3} className="opacity-20 text-[#007ea7] group-hover/doc:opacity-100 transition-all transform group-hover/doc:translate-y-[-2px]" />
                                    </button>
                                ))}
                                <button className="w-full h-20 bg-[#007ea7]/20 border-2 border-dashed border-[#007ea7]/40 rounded-[2.5rem] flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[8px] text-[#80ced7] hover:bg-[#007ea7]/30 transition-all italic mt-8 group/upload">
                                    <RefreshCcw size={20} className="group-hover/upload:rotate-180 transition-transform duration-700" strokeWidth={3} /> SYNC_NEW_SECTOR
                                </button>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
            
            {/* System Metadata */}
            <Reveal direction="up" delay={1}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Terminal size={20} strokeWidth={3} className="text-[#007ea7]" /> Vault_Access_Verified
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Compass size={20} strokeWidth={3} className="text-[#007ea7]" /> Global_Coord_Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Response_Delta: 04ms
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default PolicyDetails;