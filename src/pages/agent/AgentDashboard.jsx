import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { 
  FileText, Clock, DollarSign, Activity, 
  PieChart as PieIcon, Users, ShieldCheck,
  TrendingUp, Award, Target, Zap, Shield,
  Globe, Compass, Terminal, Cpu, HardDrive,
  MessageSquare, Briefcase, IndianRupee,
  ChevronRight, ArrowUpRight, Lock, 
  Fingerprint, Layers, Box, Layout,
  UserCheck, ShieldAlert
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

    if (statsLoading) {
        return (
            <div className="p-8 bg-[#dae5e5] min-h-screen">
                <div className="mb-12">
                    <div className="h-12 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                    <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] animate-pulse" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-[500px] bg-white rounded-[3rem] animate-pulse" />
                    <div className="h-[500px] bg-white rounded-[3rem] animate-pulse" />
                </div>
            </div>
        );
    }

    const metrics = [
        { label: "Managed Portfolios", value: agentStats?.stats?.assignedCustomers || 0, icon: Users, color: "text-[#0082a1]", bg: "bg-[#0082a1]/10", tag: "ENTITIES" },
        { label: "Pending Vetting", value: agentStats?.stats?.pendingApplications || 0, icon: Target, color: "text-amber-500", bg: "bg-amber-50", tag: "ANALYSIS" },
        { label: "Active Protocols", value: agentStats?.stats?.activePolicies || 0, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50", tag: "SECURED" },
        { label: "Cumulative Yield", value: `₹${agentStats?.stats?.totalCommission?.toLocaleString() || 0}`, icon: IndianRupee, color: "text-[#012b3f]", bg: "bg-slate-100", tag: "REVENUE" }
    ];

    const claimStats = agentStats?.charts?.claimStatusDistribution || [];
    const THEME_COLORS = ["#012b3f", "#0082a1", "#9ccfd1", "#10b981", "#ef4444"];

    return (
        <div className="agent-dashboard p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Command Center</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Operative: {user?.name}. Service Grade: Level-4 Executive. Signal Secured.</p>
                </div>
                
                <div className="flex items-center gap-6 bg-white shadow-xl border border-white px-8 py-4 rounded-[2rem] relative group cursor-pointer hover:border-[#0082a1]/30 transition-all">
                     <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black uppercase tracking-[3px] text-slate-300 mb-1.5">Auth Sequence</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                            <span className="text-[10px] font-black uppercase text-[#012b3f]">#OP_00{user?.id?.toString().slice(-3) || '92'}</span>
                        </div>
                     </div>
                     <div className="w-px h-8 bg-slate-100" />
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#012b3f]/5 rounded-xl flex items-center justify-center text-[#012b3f]">
                            <Fingerprint size={20} />
                        </div>
                     </div>
                </div>
            </div>

            {/* Tactical Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {metrics.map((metric, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white hover:border-[#0082a1]/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[3000ms] pointer-events-none transform rotate-12">
                            <metric.icon size={120} className="text-[#012b3f]" />
                        </div>
                        <div className="flex justify-between items-start mb-8">
                            <div className={`p-4 rounded-2xl ${metric.bg} ${metric.color} shadow-inner`}>
                                <metric.icon size={26} strokeWidth={2.5} />
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] py-1 px-3 border border-slate-50 rounded-full">{metric.tag}</span>
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] mb-3">{metric.label}</h3>
                        <p className="text-4xl font-black text-[#012b3f] tracking-tighter leading-none">{metric.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                {/* Distribution Matrix */}
                <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white relative overflow-hidden group min-h-[550px] flex flex-col">
                    <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none group-hover:scale-150 transition-transform duration-[5000ms]">
                         <Layers size={350} className="text-[#012b3f] rotate-12" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl border border-white/5">
                                <PieIcon size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-[#012b3f] leading-none">Claims Matrix</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] mt-2 italic">Multi-vector lifecycle analysis</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {THEME_COLORS.slice(0, 4).map((c, i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 relative z-10 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={claimStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={90}
                                    outerRadius={135}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="white"
                                    strokeWidth={8}
                                    animationDuration={2000}
                                >
                                    {claimStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', fontWeight: 'black', textTransform: 'uppercase', fontStyle: 'italic', padding: '15px' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '40px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Operations Signal Feed */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white relative group overflow-hidden h-full">
                         <h3 className="text-xl font-black uppercase tracking-tight text-[#012b3f] flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-[#012b3f]/5 rounded-xl flex items-center justify-center text-[#0082a1] border border-slate-50">
                                <Cpu size={20} strokeWidth={3} />
                            </div>
                            Rapid Ops
                         </h3>
                         <div className="space-y-6">
                            {[
                                { to: "/agent/clients", label: "Client Nodes", sub: "Manage managed entities", icon: Users, color: "bg-[#012b3f]", txt: "text-white" },
                                { to: "/agent/policies", label: "Asset Vault", sub: "Browse insurance schemes", icon: ShieldCheck, color: "bg-[#0082a1]", txt: "text-white" },
                            ].map((link, i) => (
                                <Link key={i} to={link.to} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[2rem] border border-slate-50 hover:bg-white hover:border-[#0082a1]/30 hover:translate-y-[-5px] transition-all duration-300 group/link shadow-sm hover:shadow-xl">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 ${link.color} ${link.txt} rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover/link:rotate-[360deg]`}>
                                            <link.icon size={22} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="font-black text-[10px] text-[#012b3f] uppercase tracking-[3px]">{link.label}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[2px]">{link.sub}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover/link:text-[#0082a1] transition-all group-hover/link:translate-x-1" strokeWidth={4} />
                                </Link>
                            ))}
                            
                            <div className="p-10 bg-[#012b3f] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group/card mt-6 transition-all hover:bg-[#012b3f]/95">
                                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                                    <Award size={150} className="text-white" />
                                 </div>
                                 <h3 className="text-white text-2xl font-black uppercase tracking-tight leading-none mb-4 relative z-10">Field Elite<br/><span className="text-[#0082a1] italic text-3xl">Program</span></h3>
                                 <p className="text-white/40 text-[9px] font-bold uppercase tracking-[3px] mb-8 relative z-10 leading-relaxed italic">Access exclusive multipliers and priority coordinate uplinks.</p>
                                 <button className="relative z-10 w-full py-4 bg-[#0082a1] text-white rounded-xl font-black uppercase tracking-[4px] text-[10px] hover:bg-white hover:text-[#012b3f] transition-all duration-500 shadow-xl active:scale-95 border border-white/5">
                                     Authorize Uplink
                                 </button>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Sync Integrity Module */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 bg-white rounded-[3rem] border border-white shadow-2xl relative group overflow-hidden">
                <div className="flex items-center gap-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shadow-[0_0_8px_#10b981]" />
                        <span className="text-[9px] font-black uppercase tracking-[4px] text-slate-400">Mainframe Sync: 100%</span>
                    </div>
                    <div className="w-px h-6 bg-slate-100" />
                    <div className="flex items-center gap-4">
                        <HardDrive size={14} className="text-[#0082a1] opacity-60" />
                        <span className="text-[9px] font-black uppercase tracking-[4px] text-slate-400">Total Nodes: 4,921</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-8 relative z-10">
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[3px] text-slate-300">
                       <MessageSquare size={14} className="text-[#0082a1]" /> Security Hotline Active
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#012b3f] border border-slate-100 group-hover:bg-[#012b3f] group-hover:text-white transition-all cursor-pointer shadow-inner">
                        <Compass size={22} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
