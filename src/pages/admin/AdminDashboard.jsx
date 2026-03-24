import React from "react";
import { 
    Users, FileText, 
    TrendingUp, 
    Search, Bell, 
    Briefcase, AlertCircle,
    IndianRupee, ClipboardCheck,
    MoreHorizontal, Star, UserPlus,
    CheckCircle2, Clock, XCircle, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
import Reveal from "../../components/common/Reveal";

const StatCard = ({ title, value, icon: Icon, color, sparkline }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
        <div className="space-y-1">
            <p className="text-slate-500 text-sm font-bold">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        {sparkline && (
            <div className="mt-4 h-12 w-full">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                    <path 
                        d="M0 25 Q 20 5, 40 20 T 80 10 T 100 25" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        )}
    </div>
);

const RevenueTrends = ({ data = [] }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-[#134e8d]">Growth Trends</h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Monthly Purchases</span>
        </div>
        <div className="h-64 relative group">
            {data.length > 0 ? (
                <>
                    <svg viewBox="0 0 800 200" className="w-full h-full">
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#134e8d" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#134e8d" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {[0, 50, 100, 150].map((y) => (
                            <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                        ))}
                        <path 
                            d={`M0 160 ${data.map((d, i) => `L ${i * (800 / (data.length - 1))} ${160 - (d.value * 20)}`).join(' ')}`} 
                            fill="none" 
                            stroke="#134e8d" 
                            strokeWidth="5" 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-lg"
                        />
                    </svg>
                    <div className="flex justify-between mt-6 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {data.map(d => <span key={d.name}>{d.name}</span>)}
                    </div>
                </>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-400 font-medium text-xs">No trend data available</div>
            )}
        </div>
    </div>
);

const PolicyDistribution = ({ data = [] }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
        <h3 className="text-lg font-bold text-[#134e8d] self-start mb-6">Policy Distribution</h3>
        <div className="relative w-48 h-48 mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                {data.map((d, i) => {
                    const offset = data.slice(0, i).reduce((acc, curr) => acc + (curr.value * 2.512), 0);
                    return (
                        <circle 
                            key={i} 
                            cx="50" cy="50" r="40" 
                            fill="transparent" 
                            stroke={['#10b981', '#3b82f6', '#134e8d', '#f59e0b', '#ef4444'][i % 5]} 
                            strokeWidth="12" 
                            strokeDasharray={`${d.value * 2.512} 251.2`} 
                            strokeDashoffset={-offset}
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#134e8d] leading-none">{data.reduce((a, b) => a + b.value, 0)}%</span>
            </div>
        </div>
        <div className="w-full space-y-3">
            {data.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${['bg-emerald-500', 'bg-blue-500', 'bg-[#134e8d]', 'bg-orange-500', 'bg-rose-500'][i % 5]}`} />
                        <span className="text-slate-600">{d.name}</span>
                    </div>
                    <span className="text-slate-800">{d.value}%</span>
                </div>
            ))}
            {data.length === 0 && <div className="text-center text-slate-400 text-[10px] font-bold italic py-4">NO DATA</div>}
        </div>
    </div>
);

const RecentActivities = ({ activities = [] }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#134e8d]">Recent Activities</h3>
        </div>
        <div className="space-y-8">
            {activities.length > 0 ? activities.map((activity, i) => (
                <div key={i} className="flex gap-4">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        activity.type === 'new_user' ? 'bg-blue-500' : 
                        activity.type === 'new_policy' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800 leading-tight">{activity.description}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(activity.date).toLocaleString()}</p>
                    </div>
                </div>
            )) : (
                <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">No activity detected</div>
            )}
        </div>
    </div>
);

const TopAgents = ({ agents = [] }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#134e8d]">Top Performing Agents</h3>
        </div>
        <div className="overflow-x-auto">
            {agents.length > 0 ? (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="pb-4">Agent Name</th>
                            <th className="pb-4">Policies Sold</th>
                            <th className="pb-4">Revenue Generated</th>
                            <th className="pb-4">Rating</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {agents.map((agent, i) => (
                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#134e8d] font-bold text-[10px]">
                                            {agent.name.charAt(0)}
                                        </div>
                                        <span className="text-xs font-bold text-slate-800">{agent.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-xs font-bold text-slate-600">{agent.policiesSold}</td>
                                <td className="py-4 text-xs font-bold text-slate-600">₹{agent.revenue.toLocaleString()}</td>
                                <td className="py-4">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, star) => (
                                            <Star key={star} size={10} className="fill-orange-400 text-orange-400" />
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">No agents recorded</div>
            )}
        </div>
    </div>
);

const AdminDashboard = () => {
    const { data: adminStats, isLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: () => api.get('/stats/admin')
    });

    if (isLoading) return (
        <div className="p-8 space-y-8 animate-pulse">
            <div className="h-10 w-64 bg-slate-200 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[400px] bg-white rounded-2xl border border-slate-100" />
                <div className="h-[400px] bg-white rounded-2xl border border-slate-100" />
            </div>
        </div>
    );

    const { stats = {}, charts = {}, recentActivities = [], topAgents = [] } = adminStats || {};

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-[#134e8d] tracking-tight">Admin Overview</h1>
                        <p className="text-sm font-medium text-slate-500">Manage and track your platform's performance in real-time.</p>
                    </div>
                </Reveal>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Policies" value={stats.totalPolicies || 0} icon={FileText} color="bg-blue-500" />
                <StatCard title="Total Customers" value={stats.totalCustomers || 0} icon={Users} color="bg-blue-400" />
                <StatCard title="Total Agents" value={stats.totalAgents || 0} icon={UserPlus} color="bg-emerald-500" />
                <StatCard title="Active Policies" value={stats.activePolicies || 0} icon={AlertCircle} color="bg-rose-500" />
                <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} icon={IndianRupee} color="bg-emerald-600" sparkline={true} />
                <StatCard title="Pending Actions" value={stats.pendingActions || 0} icon={ClipboardCheck} color="bg-orange-500" />
            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <RevenueTrends data={charts.performanceData} />
                </div>
                <div className="xl:col-span-1">
                    <PolicyDistribution data={charts.policyDistribution} />
                </div>
            </div>

            {/* Bottom Section: Activities & Agents */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <RecentActivities activities={recentActivities} />
                <TopAgents agents={topAgents} />
            </div>
        </div>
    );
};

export default AdminDashboard;
