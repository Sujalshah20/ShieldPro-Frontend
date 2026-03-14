import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { 
  FileText, Clock, DollarSign, Activity, 
  PieChart as PieIcon, Users, ShieldCheck,
  TrendingUp, Award, Target, Zap, Shield,
  Globe, Compass, Terminal, Cpu, HardDrive,
  MessageSquare, Briefcase, IndianRupee
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { TableSkeleton } from "../../components/common/Skeleton";
import { api } from "../../utils/api";
import Reveal from "../../components/common/Reveal";
import { motion } from "framer-motion";

const AgentDashboard = () => {
    const { user } = useContext(AuthContext);

    const { data: agentStats, isLoading: statsLoading } = useQuery({
        queryKey: ['agentStats', user?.token],
        queryFn: () => api.get('/stats/agent', user.token),
        enabled: !!user?.token
    });

    if (statsLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={10} cols={5} /></div>;

    const statsCards = [
        {
            title: "MANAGED_PORTFOLIOS",
            description: `${agentStats?.stats?.assignedCustomers || 0} Entities`,
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/5",
            tag: "GLOBAL_OPS"
        },
        {
            title: "RISK_VECTORS",
            description: `${agentStats?.stats?.pendingApplications || 0} Pending`,
            icon: Target,
            color: "text-amber-500",
            bg: "bg-amber-50",
            tag: "ANALYSIS"
        },
        {
            title: "ACTIVE_PROTOCOLS",
            description: `${agentStats?.stats?.activePolicies || 0} Assets`,
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            tag: "SECURED"
        },
        {
            title: "CUMULATIVE_YIELD",
            description: `₹${agentStats?.stats?.totalCommission?.toLocaleString() || 0}`,
            icon: IndianRupee,
            color: "text-header-bg",
            bg: "bg-header-bg/5",
            tag: "REVENUE"
        }
    ];

    const claimStats = agentStats?.charts?.claimStatusDistribution || [];
    const THEME_COLORS = ["#007ea8", "#9ad1d4", "#003249", "#10b981", "#ef4444"];

    return (
        <div className="agent-dashboard p-6 md:p-10 bg-background-main min-h-screen font-display relative overflow-hidden">
            {/* Global Matrix Atmosphere */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 2px, transparent 0)`, backgroundSize: '70px 70px' }} />
            
            <Reveal width="100%" direction="down">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                             <div className="w-2.5 h-12 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                COMMAND<span className="text-primary tracking-normal ml-3">_CENTER</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-9">
                            Field Operative: {user?.name.toUpperCase()} // Service Grade: Level-4 Executive
                        </p>
                    </div>

                    <div className="flex items-center gap-8 bg-white shadow-2xl border border-slate-200 px-12 py-6 rounded-[2.5rem] relative group">
                         <div className="absolute top-0 right-0 p-3">
                            <Activity size={16} className="text-primary animate-pulse" />
                         </div>
                         <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 mb-2">SIGNAL_LOCK</span>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40" />
                                <span className="text-xs font-black uppercase text-header-bg">ENCRYPTED</span>
                            </div>
                         </div>
                         <div className="w-px h-10 bg-slate-100" />
                         <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 mb-2">AUTH_ID</span>
                            <span className="text-xs font-black uppercase text-primary">#OP_00{user?.id?.toString().slice(-3) || '92'}</span>
                         </div>
                    </div>
                </div>
            </Reveal>

            {/* Performance Node Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                {statsCards.map((card, idx) => (
                    <Reveal key={idx} width="100%" delay={idx * 0.1} direction="up">
                        <div className={`p-12 rounded-[3.5rem] border border-slate-200 bg-white shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500`}>
                            <div className={`absolute top-[-20%] right-[-10%] p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[3000ms] ${card.color}`}>
                                <card.icon size={250} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className={`w-18 h-18 ${card.bg} rounded-2xl flex items-center justify-center ${card.color} border border-white/50 shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                                        <card.icon size={32} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[4px] text-slate-300 py-1 px-4 border border-slate-100 rounded-full group-hover:bg-header-bg group-hover:text-white transition-all">{card.tag}</span>
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] mb-4">{card.title}</h3>
                                <p className="text-4xl font-black tracking-tight text-header-bg uppercase leading-none">{card.description}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-16">
                {/* Distribution Matrix */}
                <Reveal width="100%" direction="up" delay={0.4} className="lg:col-span-4">
                    <div className="bg-white p-16 rounded-[4.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group min-h-[600px] flex flex-col">
                        <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-[5000ms]">
                             <Layers size={400} className="text-primary rotate-12" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg flex items-center gap-6 leading-none">
                                    <div className="w-14 h-14 bg-header-bg rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-header-bg/20 border border-white/10">
                                        <PieIcon size={28} strokeWidth={3} />
                                    </div>
                                    CLAIMS_DISTRIBUTION
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[6px] mt-4 ml-1 flex items-center gap-4">
                                    <Activity size={14} className="text-primary" /> Multi-vector analysis of ongoing claim lifecycles
                                </p>
                            </div>
                            <div className="flex gap-4">
                                {THEME_COLORS.slice(0, 3).map((c, i) => (
                                    <div key={i} className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex-1 min-h-[350px] relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={claimStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={110}
                                        outerRadius={150}
                                        paddingAngle={10}
                                        dataKey="value"
                                        stroke="white"
                                        strokeWidth={6}
                                        animationDuration={2000}
                                    >
                                        {claimStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', fontWeight: 'black', textTransform: 'uppercase', fontStyle: 'italic', padding: '20px' }}
                                    />
                                    <Legend iconType="rect" iconSize={12} wrapperStyle={{ paddingTop: '50px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Reveal>

                {/* Operations Terminal */}
                <div className="lg:col-span-2 space-y-12">
                    <Reveal width="100%" direction="right" delay={0.5}>
                        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl relative group overflow-hidden h-full">
                             <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-primary/5 rounded-full blur-[80px]" />
                             <h3 className="text-2xl font-black uppercase tracking-tight text-header-bg flex items-center gap-6 mb-12 leading-none">
                                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                    <Cpu size={24} strokeWidth={3} />
                                </div>
                                RAPID_OPS
                             </h3>
                             <div className="flex flex-col gap-8">
                                <Link to="/agent/clients" className="flex items-center justify-between p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-primary/40 hover:translate-y-[-10px] transition-all duration-500 group/link shadow-sm hover:shadow-2xl">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 bg-header-bg rounded-2xl flex items-center justify-center text-white shadow-xl shadow-header-bg/20 transition-all duration-700 group-hover/link:rotate-[360deg]">
                                            <Users size={30} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="font-black text-[11px] text-header-bg uppercase tracking-[4px]">CLIENT_NODES</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[3px]">Manage managed entities</p>
                                        </div>
                                    </div>
                                    <ArrowLeft size={20} className="text-primary rotate-180 opacity-0 group-hover/link:opacity-100 transition-all" strokeWidth={4} />
                                </Link>
                                
                                <Link to="/agent/policies" className="flex items-center justify-between p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-primary/40 hover:translate-y-[-10px] transition-all duration-500 group/link shadow-sm hover:shadow-2xl">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 transition-all duration-700 group-hover/link:scale-110">
                                            <ShieldCheck size={30} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="font-black text-[11px] text-header-bg uppercase tracking-[4px]">ASSET_VAULT</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[3px]">Browse insurance schemes</p>
                                        </div>
                                    </div>
                                    <ArrowLeft size={20} className="text-primary rotate-180 opacity-0 group-hover/link:opacity-100 transition-all" strokeWidth={4} />
                                </Link>

                                <div className="p-10 bg-header-bg rounded-[3rem] shadow-2xl shadow-header-bg/30 relative overflow-hidden group/card mt-4 transition-all hover:bg-header-bg/95">
                                     <div className="absolute top-[-20%] right-[-10%] opacity-5 group-hover:scale-125 transition-transform duration-[3000ms]">
                                        <Award size={200} className="text-white" />
                                     </div>
                                     <h3 className="text-white text-3xl font-black uppercase tracking-tight leading-none mb-6 relative z-10">FIELD_ELITE<br/><span className="text-primary tracking-tighter text-4xl italic">PROGRAM</span></h3>
                                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[4px] mb-10 relative z-10 leading-relaxed italic">Access exclusive fiscal multipliers and priority coordinate uplinks.</p>
                                     <button className="relative z-10 w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[5px] text-[10px] hover:bg-white hover:text-header-bg transition-all duration-500 shadow-xl active:scale-95 border border-white/10">
                                         AUTHORIZE_UPLINK
                                     </button>
                                </div>
                             </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* SYNC STATUS FOOTER */}
            <Reveal width="100%" direction="up" delay={0.6}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 p-12 bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-10 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-[5px] text-slate-500">SYSTEM_MAINFRAME_SYNC: 100%</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex items-center gap-5">
                            <HardDrive size={16} className="text-primary opacity-40" />
                            <span className="text-[10px] font-black uppercase tracking-[5px] text-slate-500">NODES_ONLINE: 4,921</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-10 relative z-10">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[4px] text-slate-400">
                           <MessageSquare size={16} className="text-primary" /> SUPPORT_UPLINK_READY
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-200 group-hover:bg-primary group-hover:text-white transition-all cursor-pointer">
                            <Compass size={24} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentDashboard;
