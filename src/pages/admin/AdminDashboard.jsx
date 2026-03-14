import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { 
    Shield, Users, UserCheck, Activity, 
    Globe as GlobeIcon, FileText, TrendingUp,
    Clock, ArrowUpRight, Zap, Target,
    Fingerprint, Cpu, BarChart3,
    IndianRupee, AlertCircle, Box, Layers,
    Command, Layout, ClipboardList, ShieldCheck,
    ReceiptText, HandCoins, HeartPulse
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
            title: "GLOBAL OPERATIONS",
            description: "Live monitoring of Secure Shield assets",
            icon: GlobeIcon,
            className: "col-span-1 md:col-span-2 row-span-2 overflow-hidden",
            background: <div className="absolute inset-0 flex items-center justify-center opacity-40"><Globe className="w-full h-full" /></div>
        },
        {
            title: "PREMIUMS WRITTEN",
            description: `₹${statsData?.stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: IndianRupee,
            className: "col-span-1 bg-card-accent/20",
            background: <div className="absolute inset-0 bg-primary/5 overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            </div>
        },
        {
            title: "ACTIVE POLICIES",
            description: `${statsData?.stats?.activePolicies || 0} Portfolios`,
            icon: Shield,
            className: "col-span-1 bg-card-accent/20",
            background: <div className="absolute inset-0 bg-accent/5 overflow-hidden">
                 <div className="absolute bottom-[-20%] left-[-20%] w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" />
            </div>
        },
        {
            title: "LOSS RATIO",
            description: `62.4%`,
            icon: Activity,
            className: "col-span-1 bg-card-accent/20",
            background: <div className="absolute inset-0 bg-indigo-500/5" />
        },
        {
            title: "PENDING CLAIMS",
            description: `156 Requests`,
            icon: ClipboardList,
            className: "col-span-1 bg-card-accent/20",
            background: <div className="absolute inset-0 bg-emerald-500/5" />
        }
    ];

    const chartData = statsData?.charts?.policyDistribution || [];
    const performanceData = statsData?.charts?.performanceData || [];

    const THEME_COLORS = ["#007ea8", "#9ad1d4", "#003249", "#10b981", "#ef4444"];

    return (
        <div className="admin-dashboard p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Global Perspective Protocol */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
            
            <Reveal width="100%" direction="down">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-16">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                ADMIN<span className="text-primary tracking-normal">_OVERVIEW</span>
                             </h1>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[6px] ml-7">
                            Welcome back, {user?.name}. Here's the current mission status.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 bg-white shadow-xl border border-slate-200 px-10 py-6 rounded-3xl relative">
                         <div className="absolute -top-3 -right-3">
                            <Activity size={20} className="text-primary animate-bounce" />
                         </div>
                         <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-[4px] opacity-40 mb-2">NETWORK_STATUS</span>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" />
                                <span className="text-xs font-bold uppercase text-header-bg">OPS_ACTIVE</span>
                            </div>
                         </div>
                         <div className="w-px h-10 bg-slate-200" />
                         <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-[4px] opacity-40 mb-2">LATENCY</span>
                            <span className="text-xs font-bold uppercase text-primary">4.2 MS</span>
                         </div>
                         <div className="w-px h-10 bg-slate-200" />
                         <div className="flex flex-col items-center min-w-[120px]">
                            <span className="text-[9px] font-black uppercase tracking-[4px] opacity-40 mb-2">RELIABILITY</span>
                            <span className="text-xs font-bold uppercase text-header-bg">99.99%</span>
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
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                            <TrendingUp size={300} className="text-primary" />
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 relative z-10 gap-8">
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg flex items-center gap-6 leading-none">
                                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                                        <TrendingUp size={24} strokeWidth={3} />
                                    </div>
                                    REVENUE_INTELLIGENCE
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-4 ml-1 flex items-center gap-3">
                                    <Activity size={12} className="text-primary" /> Live business yield and growth performance
                                </p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-xl text-xs font-black border border-emerald-100">
                                    <ArrowUpRight className="w-5 h-5" strokeWidth={4} /> +12.5% M/M
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[3px] mt-2 mr-2">ANNUAL_VECTOR</span>
                            </div>
                        </div>
                        
                        <div className="h-[420px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#007ea8" stopOpacity={0.6}/>
                                            <stop offset="95%" stopColor="#007ea8" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#64748b', letterSpacing: '1px'}} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#64748b'}} />
                                    <Tooltip 
                                        cursor={{ stroke: '#007ea8', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold', background: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#007ea8" strokeWidth={6} fillOpacity={1} fill="url(#colorValue)" animationDuration={2000} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Reveal>

                <Reveal width="100%" direction="up" delay={0.2}>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl flex flex-col h-full relative overflow-hidden group">
                        <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-1000">
                            <ShieldCheck size={250} className="text-primary" />
                        </div>
                        
                        <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg flex items-center gap-6 mb-16 relative z-10 leading-none">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-md">
                                <Layout size={24} strokeWidth={3} />
                            </div>
                            POLICY_MIX
                        </h3>
                        
                        <div className="flex-1 min-h-[320px] relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={90}
                                        outerRadius={120}
                                        paddingAngle={6}
                                        dataKey="value"
                                        animationDuration={1500}
                                        stroke="white"
                                        strokeWidth={4}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '9px', fontWeight: '800', paddingTop: '30px', textTransform: 'uppercase', opacity: 0.6 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-12 pt-12 border-t border-slate-100 grid grid-cols-2 gap-10 relative z-10">
                             <div className="text-center group-hover:translate-x-2 transition-transform">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[3px] mb-3">CONVERSION</p>
                                <p className="text-3xl font-black tracking-tight text-primary">88.4%</p>
                             </div>
                             <div className="text-center group-hover:translate-x-[-2px] transition-transform">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[3px] mb-3">RETENTION</p>
                                <p className="text-3xl font-black tracking-tight text-header-bg">96.2%</p>
                             </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* REAL_TIME_OPS */}
            <Reveal width="100%" direction="up" delay={0.3}>
                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden mb-16">
                    <div className="px-12 py-10 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-slate-50 relative">
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-40 animate-pulse" />
                                <div className="relative w-16 h-16 bg-header-bg rounded-2xl flex items-center justify-center text-white shadow-xl shadow-header-bg/20 border border-white/10">
                                    <Activity size={32} strokeWidth={3} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">
                                    MISSION_LOG
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-3 flex items-center gap-3">
                                    <BarChart3 size={12} className="text-primary" /> REAL-TIME PLATFORM OPERATIONS FEED
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                <span className="text-[9px] font-black uppercase tracking-[3px] text-slate-400">SYNC_ACTIVE</span>
                            </div>
                            <button className="px-10 py-4 bg-header-bg text-white rounded-xl text-[10px] font-black uppercase tracking-[4px] hover:bg-primary transition-all shadow-xl active:scale-95">
                                EXPORT_LOGS
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-10 space-y-6">
                        {statsData?.recentActivities?.length === 0 ? (
                            <div className="py-32 text-center opacity-40">
                                <AlertCircle size={64} className="mx-auto mb-6 text-slate-300" />
                                <p className="text-[10px] font-black uppercase tracking-[6px] italic text-slate-400">Waiting for incoming platform events...</p>
                            </div>
                        ) : (
                            statsData?.recentActivities?.map((activity, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: index * 0.05 }}
                                    className="px-8 py-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all group cursor-pointer shadow-sm relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-8">
                                        <div className={`w-16 h-16 rounded-xl shadow-md flex items-center justify-center transition-all duration-500 ${
                                            activity.type === 'new_user' ? 'bg-primary/10 text-primary border border-primary/20' :
                                            activity.type === 'new_policy' ? 'bg-header-bg text-white shadow-lg' :
                                            'bg-card-accent/20 text-header-bg border border-card-accent/40'
                                        }`}>
                                            {activity.type === 'new_user' && <Users size={28} />}
                                            {activity.type === 'new_policy' && <Shield size={28} />}
                                            {activity.type === 'new_claim' && <FileText size={28} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                    activity.type === 'new_user' ? 'bg-primary text-white' :
                                                    activity.type === 'new_policy' ? 'bg-header-bg text-white' :
                                                    'bg-card-accent text-header-bg'
                                                }`}>
                                                    {activity.type.replace('_', ' ')}
                                                </span>
                                                <p className="font-bold text-lg text-header-bg group-hover:text-primary transition-colors leading-none">{activity.description}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                <Clock size={12} /> {new Date(activity.date).toLocaleTimeString()} • SYSTEM_UPLINK • SECURE
                                            </div>
                                        </div>
                                        <button className="hidden lg:flex items-center gap-3 text-[10px] font-black uppercase tracking-[3px] text-slate-400 hover:text-primary transition-colors">
                                            DETAILS <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <div className="p-10 bg-header-bg border-t border-white/5 flex flex-col xl:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-6">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" />
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[6px]">Secure Shield Infrastructure: VERSION_X.4.2_OPS</p>
                        </div>
                        <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[4px] text-white/30">
                            <span className="flex items-center gap-3">
                                <ShieldCheck size={16} className="text-primary" /> VALIDATED
                            </span>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="flex items-center gap-3">
                                <Layout size={16} /> DATA_CLUSTER_ALPHA
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminDashboard;
