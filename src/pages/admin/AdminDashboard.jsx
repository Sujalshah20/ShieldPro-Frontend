import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { 
    Shield, Users, UserCheck, Activity, 
    Globe as GlobeIcon, FileText, TrendingUp,
    Clock, ArrowUpRight, Zap, Target,
    Fingerprint, Cpu, BarChart3,
    IndianRupee, AlertCircle, Box, Layers,
    Command, Layout, ClipboardList, ShieldCheck
} from "lucide-react";
import Globe from "../../components/lightswind/globe";
import { api } from "../../utils/api";
import { BentoGrid } from "../../components/lightswind/bento-grid";
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, AreaChart, Area
} from "recharts";
import { TableSkeleton } from "../../components/common/Skeleton";
import Reveal from "../../components/common/Reveal";
import { Button } from "@/components/lightswind/button";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    // Fetch dashboard stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['adminStats', user?.token],
        queryFn: () => api.get('/stats/admin', user.token),
        enabled: !!user?.token
    });

    if (statsLoading) {
        return <div className="p-8"><TableSkeleton rows={10} cols={5} /></div>;
    }

    const statsCards = [
        {
            title: "DASHBOARD_SUMMARY",
            description: "Live monitoring of platform operations",
            icon: GlobeIcon,
            className: "col-span-1 md:col-span-2 row-span-2 overflow-hidden",
            background: <div className="absolute inset-0 flex items-center justify-center opacity-60"><Globe className="w-full h-full" /></div>
        },
        {
            title: "TOTAL_COLLECTIONS",
            description: `₹${statsData?.stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: IndianRupee,
            className: "col-span-1",
            background: <div className="absolute inset-0 bg-primary/5 overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            </div>
        },
        {
            title: "ACTIVE_POLICIES",
            description: `${statsData?.stats?.activePolicies || 0} Policies`,
            icon: Shield,
            className: "col-span-1",
            background: <div className="absolute inset-0 bg-accent/5 overflow-hidden">
                 <div className="absolute bottom-[-20%] left-[-20%] w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" />
            </div>
        },
        {
            title: "TOTAL_CUSTOMERS",
            description: `${statsData?.stats?.totalCustomers || 0} Registered`,
            icon: Users,
            className: "col-span-1",
            background: <div className="absolute inset-0 bg-indigo-500/5" />
        },
        {
            title: "AGENT_DIRECTORY",
            description: `${statsData?.stats?.totalAgents || 0} Active Agents`,
            icon: UserCheck,
            className: "col-span-1",
            background: <div className="absolute inset-0 bg-emerald-500/5" />
        }
    ];

    const chartData = statsData?.charts?.policyDistribution || [];
    const performanceData = statsData?.charts?.performanceData || [];

    const THEME_COLORS = ["#0165FF", "#FF5A00", "#8b5cf6", "#10b981", "#ef4444"];

    return (
        <div className="admin-dashboard p-6 md:p-10 bg-[#F4F7FB] min-h-screen relative overflow-hidden">
            {/* Professional Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #0165FF 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
            
            <Reveal width="100%" direction="down">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-16">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#0165FF]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                ADMIN<span className="text-primary tracking-normal">_DASHBOARD</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Comprehensive platform administration & real-time monitoring
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 bg-white backdrop-blur-md shadow-2xl border border-border/50 px-10 py-6 rounded-[2.5rem] relative">
                         <div className="absolute -top-3 -right-3">
                            <Activity size={20} className="text-primary animate-bounce" />
                         </div>
                         <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-[4px] opacity-20 mb-2 italic">SERVER_STATUS</span>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                                <span className="text-xs font-black italic tracking-tighter uppercase">SYSTEM_ACTIVE</span>
                            </div>
                         </div>
                         <div className="w-px h-10 bg-border/20" />
                         <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-[4px] opacity-20 mb-2 italic">RESPONSE_TIME</span>
                            <span className="text-xs font-black italic tracking-tighter uppercase text-primary">0.0042 MS</span>
                         </div>
                         <div className="w-px h-10 bg-border/20" />
                         <div className="flex flex-col items-center min-w-[120px]">
                            <span className="text-[9px] font-black uppercase tracking-[4px] opacity-20 mb-2 italic">UPTIME_RELIABILITY</span>
                            <span className="text-xs font-black italic tracking-tighter uppercase text-accent">99.99%</span>
                         </div>
                    </div>
                </div>
            </Reveal>

            {/* Operational Metrics Grid */}
            <div className="mb-16">
                <BentoGrid cards={statsCards} columns={4} />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 mb-16">
                <Reveal width="100%" direction="up" delay={0.1} className="xl:col-span-2">
                    <div className="bg-white p-12 rounded-[4rem] border border-border/50 shadow-2xl relative overflow-hidden backdrop-blur-md group">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                            <Activity size={300} className="text-primary" />
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 relative z-10 gap-8">
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-6 leading-none">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                                        <TrendingUp size={24} strokeWidth={3} />
                                    </div>
                                    REVENUE_&_GROWTH
                                </h3>
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] mt-4 italic ml-1 flex items-center gap-3">
                                    <Activity size={12} className="text-primary" /> Track business growth and revenue performance metrics
                                </p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 px-6 py-3 rounded-2xl text-xs font-black border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] italic">
                                    <ArrowUpRight className="w-5 h-5" strokeWidth={4} /> +12.8% GROWTH_RATE
                                </div>
                                <span className="text-[8px] font-black opacity-20 uppercase tracking-[3px] mt-2 mr-2">LAST_MONTH_SUMMARY</span>
                            </div>
                        </div>
                        
                        <div className="h-[420px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0165FF" stopOpacity={0.5}/>
                                            <stop offset="95%" stopColor="#0165FF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#64748b', letterSpacing: '2px', textTransform: 'uppercase'}} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#64748b'}} />
                                    <Tooltip 
                                        cursor={{ stroke: '#0165FF', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        contentStyle={{ borderRadius: '32px', border: '1px solid rgba(1, 101, 255, 0.2)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3)', fontWeight: 'black', background: 'rgba(12, 26, 21, 0.95)', textTransform: 'uppercase', fontSize: '10px', color: '#fff', backdropBlur: '10px' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#0165FF" strokeWidth={8} fillOpacity={1} fill="url(#colorValue)" animationDuration={2500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Reveal>

                <Reveal width="100%" direction="up" delay={0.2}>
                    <div className="bg-white p-12 rounded-[4rem] border border-border/50 shadow-2xl flex flex-col h-full relative overflow-hidden group backdrop-blur-md">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.02] pointer-events-none group-hover:scale-150 transition-transform duration-1000">
                            <Box size={250} />
                        </div>
                        
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-6 mb-16 relative z-10 leading-none">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent border border-accent/20 shadow-lg">
                                <Layout size={24} strokeWidth={3} />
                            </div>
                            POLICY_TYPE_RATIO
                        </h3>
                        
                        <div className="flex-1 min-h-[320px] relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={100}
                                        outerRadius={135}
                                        paddingAngle={8}
                                        dataKey="value"
                                        animationDuration={2000}
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: '900', paddingTop: '40px', textTransform: 'uppercase', opacity: 0.4, letterSpacing: '2px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-12 pt-12 border-t border-border/20 grid grid-cols-2 gap-10 relative z-10">
                             <div className="text-center group-hover:translate-x-2 transition-transform">
                                <p className="text-[9px] font-black opacity-30 uppercase tracking-[4px] mb-3 italic">PROCESSING_RATE</p>
                                <p className="text-3xl font-black italic tracking-tighter text-indigo-500">98.42%</p>
                             </div>
                             <div className="text-center group-hover:translate-x-[-2px] transition-transform">
                                <p className="text-[9px] font-black opacity-30 uppercase tracking-[4px] mb-3 italic">SYSTEM_HEALTH</p>
                                <p className="text-3xl font-black italic tracking-tighter text-primary">99.98%</p>
                             </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* REAL_TIME_ACTIVITY */}
            <Reveal width="100%" direction="up" delay={0.3}>
                <div className="bg-white rounded-[4.5rem] border border-border/50 shadow-[0_60px_100px_rgba(0,0,0,0.4)] overflow-hidden mb-16 backdrop-blur-xl">
                    <div className="px-12 py-12 border-b border-border/50 flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-zinc-50 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse" />
                                <div className="relative w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 border border-white/10">
                                    <Activity size={32} strokeWidth={3} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-4 leading-none">
                                    REAL_TIME_ACTIVITY
                                </h3>
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-[6px] mt-3 italic flex items-center gap-3 ml-1">
                                    <BarChart3 size={12} className="text-indigo-500" /> Monitor latest transactions and system events
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="px-6 py-3 bg-white rounded-2xl border border-border/50 shadow-inner flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                <span className="text-[9px] font-black uppercase tracking-[3px] opacity-40">FEED_ACTIVE</span>
                            </div>
                            <button className="px-10 py-5 bg-zinc-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[4px] hover:bg-primary transition-all shadow-2xl active:scale-95 italic border border-white/5">
                                VIEW_LOGS
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-10 space-y-6">
                        {statsData?.recentActivities?.length === 0 ? (
                            <div className="py-40 text-center relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                                    <ClipboardList size={400} className="animate-pulse" />
                                </div>
                                <AlertCircle size={80} className="mx-auto opacity-10 mb-8" />
                                <h4 className="text-4xl font-black uppercase italic tracking-tighter opacity-10">NO_RECENT_ACTIVITY</h4>
                                <p className="text-[10px] font-black uppercase tracking-[8px] opacity-10 mt-6 italic">Waiting for incoming platform events.</p>
                            </div>
                        ) : (
                            statsData?.recentActivities?.map((activity, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: -30 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: index * 0.08 }}
                                    className="flex flex-col lg:flex-row lg:items-center justify-between p-8 rounded-[3rem] bg-zinc-50/50 border border-border/30 hover:border-primary/50 hover:bg-white transition-all group cursor-pointer shadow-xl relative overflow-hidden"
                                >
                                    <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-primary transition-colors" />
                                    <div className="flex items-center gap-10">
                                        <div className="relative">
                                            <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity ${
                                                activity.type === 'new_user' ? 'bg-indigo-500' :
                                                activity.type === 'new_policy' ? 'bg-primary' :
                                                'bg-accent'
                                            }`} />
                                            <div className={`w-20 h-20 rounded-[2rem] shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/10 ${
                                                activity.type === 'new_user' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-indigo-500/10' :
                                                activity.type === 'new_policy' ? 'bg-primary/10 text-primary border-primary/20 shadow-primary/10' :
                                                'bg-accent/10 text-accent border-accent/20 shadow-accent/10'
                                            }`}>
                                                {activity.type === 'new_user' && <Users size={32} strokeWidth={3} />}
                                                {activity.type === 'new_policy' && <Shield size={32} strokeWidth={3} />}
                                                {activity.type === 'new_claim' && <FileText size={32} strokeWidth={3} />}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                                <span className={`text-[10px] font-black uppercase tracking-[3px] px-3 py-1 rounded-lg italic shadow-sm ${
                                                    activity.type === 'new_user' ? 'bg-indigo-600 text-white' :
                                                    activity.type === 'new_policy' ? 'bg-primary text-white' :
                                                    'bg-accent text-white'
                                                }`}>
                                                    {activity.type.replace('_', ' ')}
                                                </span>
                                                <p className="font-black text-2xl italic uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">{activity.description}</p>
                                            </div>
                                            <div className="flex items-center gap-6 opacity-30">
                                                <div className="flex items-center gap-3">
                                                    <Clock size={12} className="text-primary" />
                                                    <p className="text-[10px] font-black uppercase tracking-[4px] italic">{new Date(activity.date).toLocaleTimeString().toUpperCase()} [LOCAL]</p>
                                                </div>
                                                <div className="w-2 h-2 bg-zinc-400/20 rounded-full" />
                                                <p className="text-[10px] font-black uppercase tracking-[4px] italic">INSTANCE_01</p>
                                                <div className="w-2 h-2 bg-zinc-400/20 rounded-full" />
                                                <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[3px]">STATUS_OK</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 lg:mt-0 flex items-center gap-8 bg-zinc-100 p-4 rounded-2xl group-hover:bg-white transition-colors">
                                         <div className="flex -space-x-4">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-2xl border-4 border-white bg-zinc-200 overflow-hidden shadow-lg relative group/av">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="operator" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            <div className="w-10 h-10 rounded-2xl border-4 border-white bg-primary flex items-center justify-center text-[10px] font-black text-white italic shadow-lg">+4</div>
                                         </div>
                                         <button className="h-14 px-10 bg-white border-2 border-border/50 text-zinc-400 group-hover:text-primary group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10 rounded-2xl font-black text-[10px] uppercase tracking-[4px] transition-all flex items-center gap-4 italic active:scale-95">
                                            VIEW_DETAILS <ArrowUpRight size={16} strokeWidth={4} className="group-hover:scale-125 transition-transform" />
                                         </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <div className="p-12 bg-zinc-950 border-t border-white/5 flex flex-col xl:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary blur-xl opacity-40 animate-pulse" />
                                <div className="relative w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#0165FF]" />
                            </div>
                            <p className="text-xs font-black text-white/50 uppercase tracking-[6px] italic">System Status: Connected @ PRIMARY_INSTANCE_01</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-12 text-[10px] font-black uppercase tracking-[4px] text-white/30">
                            <span className="flex items-center gap-4 italic group cursor-pointer hover:text-primary transition-colors">
                                <ShieldCheck size={18} className="text-primary" /> STABLE
                            </span>
                            <span className="flex items-center gap-4 italic group cursor-pointer hover:text-accent transition-colors">
                                <Activity size={18} className="text-accent" /> BACKUP_ACTIVE
                            </span>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex items-center gap-4">
                                <Layout size={18} />
                                <span>VERSION_1.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminDashboard;
