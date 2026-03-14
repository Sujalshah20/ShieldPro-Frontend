import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    FileText, User, ShieldCheck, CheckCircle, XCircle, 
    Clock, AlertCircle, TrendingUp, IndianRupee, Mail,
    Briefcase, Fingerprint, Zap, Search, ShieldAlert,
    BarChart3, Target, Activity, Lock,
    Eye, ArrowUpRight, Command, Compass, PieChart, Award,
    Filter, Layout, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const AgentClaims = () => {
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const { data: claims, isLoading } = useQuery({
        queryKey: ['agentClaims', user?.token],
        queryFn: () => api.get('/claims/all', user.token),
        enabled: !!user?.token
    });

    // In a real scenario, we'd filter by assigned customers on the backend or here.
    // For now, mirroring the admin display but identifying it as "Field Perspective"
    const filteredClaims = claims?.filter(claim => {
        const matchesSearch = (
            claim.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.userPolicy?.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim._id?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesStatus = filterStatus === "All" || claim.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={10} cols={6} /></div>;

    const stats = {
        active: filteredClaims?.filter(c => c.status === 'Pending' || c.status === 'Investigation').length || 0,
        resolved: filteredClaims?.filter(c => c.status === 'Approved').length || 0,
        volume: filteredClaims?.reduce((acc, curr) => acc + curr.amount, 0) || 0
    };

    return (
        <div className="agent-claims p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Field Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 2px, transparent 0)`, backgroundSize: '50px 50px' }} />

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                             <div className="w-2.5 h-12 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                INCIDENT<span className="text-primary tracking-normal ml-3">_TRACKER</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-9">
                            Real-time monitoring of client settlement requests and lifecycle events
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="px-10 py-6 bg-header-bg rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-8 group hover:bg-primary transition-all duration-700 h-28">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary shadow-xl border border-white/10 group-hover:bg-white/10">
                                <Activity size={24} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[4px] mb-1">TOTAL_VOLUME</span>
                                <span className="text-3xl font-black text-white tracking-tighter uppercase leading-none">₹{(stats.volume / 1000).toFixed(1)}K</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* Field Metrics Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                    { label: "QUEUE_ACTIVE", value: stats.active, icon: Clock, color: "text-amber-500", bg: "bg-amber-50", tag: "VETTING" },
                    { label: "SUCCESS_RELEASE", value: stats.resolved, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50", tag: "SETTLED" },
                    { label: "RESPONSE_RATE", value: "98.2%", icon: Zap, color: "text-primary", bg: "bg-primary/5", tag: "LATENCY" },
                    { label: "SYSTEM_LOAD", value: "OPTIMAL", icon: Cpu, color: "text-slate-400", bg: "bg-slate-50", tag: "STATUS" }
                ].map((stat, i) => (
                    <Reveal key={i} width="100%" delay={i * 0.1} direction="up">
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all">
                             <div className="absolute top-[-10%] right-[-10%] opacity-[0.03] group-hover:scale-125 transition-transform duration-[3000ms]">
                                <stat.icon size={200} className={stat.color} />
                             </div>
                             <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center border border-white shadow-lg`}>
                                        <stat.icon size={24} strokeWidth={3} />
                                    </div>
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[4px] px-3 py-1 border border-slate-50 rounded-full">{stat.tag}</span>
                                </div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] mb-2">{stat.label}</h4>
                                <p className="text-3xl font-black text-header-bg uppercase tracking-tight truncate">{stat.value}</p>
                             </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Filter Hub */}
            <Reveal width="100%" direction="up" delay={0.4}>
                <div className="mb-12 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="relative group w-full lg:w-[500px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="SEARCH_MISSION_LOGS..." 
                            className="pl-16 pr-8 h-18 py-6 bg-white border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full transition-all font-bold text-[10px] uppercase tracking-[4px] text-header-bg shadow-xl" 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2">
                        {["All", "Pending", "Investigation", "Approved", "Rejected"].map(status => (
                            <button 
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-8 py-5 rounded-2xl text-[9px] font-black uppercase tracking-[3px] transition-all whitespace-nowrap shadow-lg border ${filterStatus === status ? 'bg-header-bg text-white border-white/10' : 'bg-white text-slate-400 border-slate-100 hover:border-primary'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </Reveal>

            {/* Incident Manifest */}
            <Reveal width="100%" direction="up" delay={0.5}>
                <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl relative">
                    <div className="px-12 py-10 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="w-14 h-14 bg-header-bg rounded-2xl flex items-center justify-center text-primary shadow-xl border border-white/10">
                                <Target size={28} strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight text-header-bg leading-none">INCIDENT_MANIFEST</h3>
                        </div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">
                            RECORDS_BUFFERED: {filteredClaims?.length || 0}
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto no-scrollbar">
                         <table className="w-full text-left font-bold text-[10px] tracking-[4px] uppercase text-slate-500">
                             <thead>
                                 <tr className="bg-slate-50/10 text-[9px] text-slate-400 border-b border-slate-50">
                                     <th className="px-12 py-10 tracking-[5px]">ENTITY_IDENT</th>
                                     <th className="px-12 py-10 tracking-[5px]">ASSET_CLASS</th>
                                     <th className="px-12 py-10 tracking-[5px]">YIELD_VAL</th>
                                     <th className="px-12 py-10 text-center tracking-[5px]">LIFECYCLE</th>
                                     <th className="px-12 py-10 text-right tracking-[5px]">VETTING</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                 {filteredClaims?.map((claim, idx) => (
                                     <motion.tr 
                                         initial={{ opacity: 0, x: -10 }}
                                         animate={{ opacity: 1, x: 0 }}
                                         transition={{ delay: idx * 0.05 }}
                                         key={claim._id} 
                                         className="hover:bg-slate-50 transition-all group"
                                     >
                                         <td className="px-12 py-8">
                                             <div className="flex items-center gap-6">
                                                 <div className="w-14 h-14 bg-header-bg rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-header-bg/20 group-hover:bg-primary transition-colors duration-500 relative overflow-hidden">
                                                     <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                     <span className="relative z-10">{claim.user?.name?.charAt(0)}</span>
                                                 </div>
                                                 <div>
                                                     <p className="font-black text-xl tracking-tighter text-header-bg group-hover:text-primary transition-colors leading-none mb-1">{claim.user?.name}</p>
                                                     <p className="text-[9px] font-bold text-slate-400 lowercase tracking-normal">{claim.user?.email}</p>
                                                 </div>
                                             </div>
                                         </td>
                                         <td className="px-12 py-8">
                                             <div className="flex flex-col gap-2">
                                                 <div className="flex items-center gap-4">
                                                     <ShieldCheck size={16} className="text-primary" strokeWidth={3} />
                                                     <span className="font-black text-sm text-header-bg tracking-tight uppercase leading-none">{claim.userPolicy?.policy?.policyName}</span>
                                                 </div>
                                                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-[2px]">TYPE: {claim.userPolicy?.policy?.policyType?.toUpperCase()}</span>
                                             </div>
                                         </td>
                                         <td className="px-12 py-8 font-black text-xl text-primary tracking-tighter">₹{claim.amount.toLocaleString()}</td>
                                         <td className="px-12 py-8">
                                             <div className="flex justify-center">
                                                 <span className={`px-5 py-2 rounded-full text-[8px] font-black tracking-[3px] flex items-center gap-3 border shadow-sm ${
                                                     claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                     claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                     'bg-amber-50 text-amber-600 border-amber-100'
                                                 }`}>
                                                     <div className={`w-2 h-2 rounded-full ${
                                                         claim.status === 'Approved' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 
                                                         claim.status === 'Rejected' ? 'bg-rose-500 shadow-lg shadow-rose-500/40' : 
                                                         'bg-amber-500 shadow-lg shadow-amber-500/40 animate-pulse'
                                                     }`} />
                                                     {claim.status.toUpperCase()}
                                                 </span>
                                             </div>
                                         </td>
                                         <td className="px-12 py-8 text-right">
                                             <button className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:bg-header-bg hover:text-white hover:border-header-bg transition-all shadow-xl active:scale-95 group/btn">
                                                 <ArrowUpRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                             </button>
                                         </td>
                                     </motion.tr>
                                 ))}
                                 {filteredClaims?.length === 0 && (
                                     <tr>
                                         <td colSpan="5" className="px-12 py-40 text-center">
                                             <ShieldAlert size={80} className="mx-auto mb-8 text-slate-100" strokeWidth={1} />
                                             <h3 className="text-2xl font-black uppercase text-slate-200 italic tracking-[12px]">NO_INCIDENTS_VECTORS</h3>
                                         </div>
                                     </tr>
                                 )}
                             </tbody>
                         </table>
                    </div>
                    
                    {/* SYNC METRICS FOOTER */}
                    <div className="px-12 py-8 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-slate-100 text-[9px] font-black uppercase tracking-[5px] text-slate-400">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3"><Lock size={14} className="text-primary" /> ENCRYPTED_STREAM</div>
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            <div className="flex items-center gap-3"><Compass size={14} className="text-primary" /> COORDINATE_SYNC_ON</div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span>OPERATIONAL_STATUS: STABLE</span>
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-emerald-500/40 shadow-lg" />
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentClaims;
