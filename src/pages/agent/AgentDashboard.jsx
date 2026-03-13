import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { 
  FileText, Clock, DollarSign, Activity, 
  PieChart as PieIcon, Users, ShieldCheck,
  TrendingUp, Award, Target, Zap
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { TableSkeleton } from "../../components/common/Skeleton";
import { api } from "../../utils/api";
import Reveal from "../../components/common/Reveal";

const AgentDashboard = () => {
    const { user } = useContext(AuthContext);

    const { data: agentStats, isLoading: statsLoading } = useQuery({
        queryKey: ['agentStats', user?.token],
        queryFn: () => api.get('/stats/agent', user.token),
        enabled: !!user?.token
    });

    if (statsLoading) return <div className="p-8"><TableSkeleton rows={10} cols={5} /></div>;

    const statsCards = [
        {
            title: "Assigned Clients",
            description: `${agentStats?.stats?.assignedCustomers || 0} Elite Portfolio`,
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/5"
        },
        {
            title: "Pipeline Review",
            description: `${agentStats?.stats?.pendingApplications || 0} Pending Clearance`,
            icon: Clock,
            color: "text-accent",
            bg: "bg-accent/5"
        },
        {
            title: "Live Safeguards",
            description: `${agentStats?.stats?.activePolicies || 0} Active Shields`,
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5"
        },
        {
            title: "Total Earnings",
            description: `₹${agentStats?.stats?.totalCommission?.toLocaleString() || 0}`,
            icon: DollarSign,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        }
    ];

    const claimStats = agentStats?.charts?.claimStatusDistribution || [];
    const THEME_COLORS = ["#FF5A00", "#10b981", "#ef4444"];

    return (
        <div className="agent-dashboard p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#10221c] min-h-screen">
            <Reveal width="100%" direction="down">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-2 h-8 bg-accent rounded-full" />
                             <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                                AGENT<span className="text-accent tracking-normal">STATION</span>
                             </h1>
                        </div>
                        <p className="text-sm font-bold opacity-40 uppercase tracking-[3px] ml-5">
                            Client Portfolio & Claims Ordinance
                        </p>
                    </div>
                </div>
            </Reveal>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statsCards.map((card, idx) => (
                    <Reveal key={idx} width="100%" delay={idx * 0.1} direction="up">
                        <div className={`p-8 rounded-[2.5rem] border border-border/50 bg-white dark:bg-zinc-900/50 shadow-sm relative overflow-hidden group hover:border-accent/30 transition-all`}>
                            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-transform ${card.color}`}>
                                <card.icon size={80} />
                            </div>
                            <div className="relative z-10">
                                <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center ${card.color} mb-6 border border-white/20`}>
                                    <card.icon size={28} />
                                </div>
                                <h3 className="text-[10px] font-black opacity-40 uppercase tracking-[30px] mb-2">{card.title}</h3>
                                <p className="text-2xl font-black italic tracking-tight">{card.description}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Distribution Analysis */}
                <div className="lg:col-span-3 bg-white dark:bg-zinc-900/50 p-8 rounded-[3rem] border border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Target className="w-40 h-40" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-3 mb-10">
                            <PieIcon className="text-accent w-6 h-6" /> Claims Ordnance Distribution
                        </h3>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={claimStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={10}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {claimStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Tactical Operations */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[3rem] border border-border/50 shadow-sm relative group overflow-hidden">
                         <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                         <h3 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-3 mb-8">
                            <Zap className="text-primary w-6 h-6" /> System Actions
                         </h3>
                         <div className="grid grid-cols-1 gap-4">
                            <Link to="/agent/clients" className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-border/50 hover:bg-white dark:hover:bg-zinc-700 hover:shadow-xl transition-all group/action">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover/action:bg-primary group-hover/action:text-white transition-colors">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-xs uppercase tracking-widest">Manage Fleet</p>
                                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-0.5">Assigned client database</p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover/action:opacity-100 transition-opacity">
                                    <TrendingUp className="text-primary" />
                                </div>
                            </Link>
                            <Link to="/agent/policies" className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-border/50 hover:bg-white dark:hover:bg-zinc-700 hover:shadow-xl transition-all group/action">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover/action:bg-accent group-hover/action:text-white transition-colors">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-xs uppercase tracking-widest">Tactical Recs</p>
                                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-0.5">Policy engine deployment</p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover/action:opacity-100 transition-opacity">
                                    <Award className="text-accent" />
                                </div>
                            </Link>
                         </div>
                    </div>

                    <div className="bg-primary p-10 rounded-[3rem] shadow-2xl shadow-primary/30 relative overflow-hidden group">
                         <div className="absolute bottom-[-20%] right-[-10%] w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                         <h3 className="text-white text-2xl font-black italic uppercase leading-tight mb-4 relative z-10">UPGRADE TO<br/>GOLD STATUS</h3>
                         <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-8 relative z-10">Unlock elite commission tiers and priority support for your top-tier clients.</p>
                         <button className="relative z-10 w-full py-4 bg-white text-primary rounded-2xl font-black uppercase tracking-[3px] hover:translate-y-[-5px] active:scale-[0.95] transition-all">
                             Activate Elite
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
