import React from "react";
import { 
    Users, FileText, 
    ArrowUpRight, ArrowDownRight, 
    MoreHorizontal, ArrowRight,
    TrendingUp, Plus, Activity, 
    Search, Bell, ChevronRight, FileCheck,
    Briefcase, Shield, Clock, AlertCircle,
    CheckCircle2, DollarSign, UserPlus
} from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard = () => {
    const stats = [
        { label: "Total Policies", value: "52", trend: "+2.4%", icon: FileText, color: "blue", trendUp: true },
        { label: "Total Customers", value: "10,234", trend: "+5%", icon: Users, color: "indigo", trendUp: true },
        { label: "Total Agents", value: "156", trend: "5%", icon: UserPlus, color: "green", trendUp: true }, // Added UserPlus import below if needed, or use Users
        { label: "Total Claims", value: "3,456", trend: "-3.1%", icon: AlertCircle, color: "rose", trendUp: false },
        { label: "Total Revenue", value: "₹2,45,00,000", trend: "+12.5%", icon: DollarSign, color: "emerald", trendUp: true },
        { label: "Pending Actions", value: "23", trend: "URGENT", icon: Clock, color: "amber", trendUp: false, urgent: true },
    ];

    const revenueData = [
        { name: 'JAN', value: 3000 },
        { name: 'MAR', value: 2000 },
        { name: 'MAY', value: 4500 },
        { name: 'JUL', value: 2500 },
        { name: 'SEP', value: 5500 },
        { name: 'NOV', value: 4000 },
    ];

    const policyData = [
        { name: 'Health', value: 35, color: '#3b82f6' },
        { name: 'Life', value: 20, color: '#6366f1' },
        { name: 'Vehicle', value: 25, color: '#10b981' },
        { name: 'Home', value: 10, color: '#f59e0b' },
        { name: 'Travel', value: 10, color: '#ef4444' },
    ];

    const activities = [
        { id: 1, title: "Policy #SS-8923 Approved", detail: "Health Insurance - Rahul Sharma", time: "10 MINUTES AGO", status: "green" },
        { id: 2, title: "New Claim Submission", detail: "Vehicle Damage - Claim #CLM-401", time: "45 MINUTES AGO", status: "amber" },
        { id: 3, title: "Agent Onboarding Complete", detail: "New agent: Sarah Jenkins (Mumbai Region)", time: "2 HOURS AGO", status: "blue" },
        { id: 4, title: "Claim #CLM-388 Rejected", detail: "Missing documentation for Travel Policy", time: "5 HOURS AGO", status: "rose" },
    ];

    const topAgents = [
        { name: "Vikram Singh", policies: "1,245", revenue: "₹45,20,000", rating: 5, avatar: "https://i.pravatar.cc/100?u=1" },
        { name: "Ananya Reddy", policies: "1,102", revenue: "₹38,90,000", rating: 5, avatar: "https://i.pravatar.cc/100?u=2" },
        { name: "Michael Tan", policies: "945", revenue: "₹31,45,000", rating: 4, avatar: "https://i.pravatar.cc/100?u=3" },
        { name: "Priya Verma", policies: "882", revenue: "₹29,10,000", rating: 4, avatar: "https://i.pravatar.cc/100?u=4" },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back, Administrator!</h1>
                        <p className="text-slate-500 font-medium">Here's what's happening with your platform today.</p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-3">
                         <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search data..." 
                                className="h-11 w-64 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                            />
                         </div>
                         <button className="h-11 w-11 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                         </button>
                    </div>
                </Reveal>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.05}>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                            <div className="flex items-center justify-between relative z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 group-hover:bg-blue-50 transition-colors`}>
                                    <s.icon size={24} className={`text-slate-400 group-hover:text-blue-500 transition-colors`} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className={`flex items-center gap-1 text-[12px] font-bold ${s.urgent ? 'text-white bg-orange-500' : (s.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50')} px-2 py-1 rounded-lg`}>
                                        {s.trendUp ? <ArrowUpRight size={14} /> : (s.urgent ? null : <ArrowDownRight size={14} />)}
                                        {s.trend}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 relative z-10">
                                <p className="text-[14px] font-medium text-slate-400 mb-1">{s.label}</p>
                                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{s.value}</h3>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Reveal direction="up" className="lg:col-span-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Revenue Trends</h3>
                            </div>
                            <div className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 border border-slate-100">
                                Last 12 Months
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1e2b4d" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#1e2b4d" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#1e2b4d" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorValue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="up" delay={0.1} className="lg:col-span-4">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full">
                         <h3 className="text-lg font-bold text-slate-800 mb-8">Policy Distribution</h3>
                         <div className="h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={policyData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {policyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                                <span className="text-2xl font-bold text-slate-800">10,234</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                            </div>
                         </div>
                         <div className="mt-8 space-y-3">
                            {policyData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm font-semibold">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-slate-500">{item.name}</span>
                                    </div>
                                    <span className="text-slate-800">{item.value}%</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </Reveal>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Reveal direction="up" className="lg:col-span-12 xl:col-span-4">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-800">Recent Activities</h3>
                            <button className="text-sm font-bold text-blue-500 hover:underline">View All</button>
                        </div>
                        <div className="space-y-8">
                            {activities.map((act) => (
                                <div key={act.id} className="flex gap-4 group">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full bg-${act.status}-500 shrink-0 mt-1.5`} />
                                        <div className="w-px flex-1 bg-slate-100 group-last:bg-transparent" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{act.title}</h4>
                                        <p className="text-xs font-medium text-slate-500 mt-1">{act.detail}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">{act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="up" delay={0.1} className="lg:col-span-12 xl:col-span-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-800">Top Performing Agents</h3>
                            <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">Export Table</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                                        <th className="pb-4">Agent Name</th>
                                        <th className="pb-4">Policies Sold</th>
                                        <th className="pb-4">Revenue Generated</th>
                                        <th className="pb-4">Rating</th>
                                        <th className="pb-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {topAgents.map((agent, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="py-5">
                                                <div className="flex items-center gap-3">
                                                    <img src={agent.avatar} className="w-9 h-9 rounded-full object-cover shadow-sm" alt="" />
                                                    <span className="text-sm font-bold text-slate-700">{agent.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 text-sm font-bold text-slate-600">{agent.policies}</td>
                                            <td className="py-5 text-sm font-bold text-slate-800">{agent.revenue}</td>
                                            <td className="py-5">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className={`w-3 h-3 rounded-full ${i < agent.rating ? 'bg-orange-400' : 'bg-slate-200'}`} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-5 text-right">
                                                <button className="text-slate-400 hover:text-blue-500 transition-colors">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default AdminDashboard;
