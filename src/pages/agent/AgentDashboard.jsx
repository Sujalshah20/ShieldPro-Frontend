import React from "react";
import { 
    Users, FileText, ShieldCheck, 
    Bell, ChevronDown, MoreHorizontal,
    ArrowUpRight, AlertCircle, PieChart as PieChartIcon,
    CreditCard
} from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from "framer-motion";

import { 
    Users, FileText, ShieldCheck, 
    Bell, ChevronDown, MoreHorizontal,
    ArrowUpRight, AlertCircle, PieChart as PieChartIcon,
    CreditCard
} from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch Agent Stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['agentStats'],
        queryFn: () => api.get('/stats/agent')
    });

    // Fetch Recent Applications
    const { data: applications = [], isLoading: appsLoading } = useQuery({
        queryKey: ['recentApplications'],
        queryFn: () => api.get('/applications')
    });

    // Fetch Recent Claims
    const { data: claims = [], isLoading: claimsLoading } = useQuery({
        queryKey: ['recentClaims'],
        queryFn: () => api.get('/claims/all')
    });

    const stats = [
        { 
            label: "Total Customers", 
            value: statsData?.stats?.assignedCustomers || 0, 
            icon: Users, 
            color: "text-slate-700", 
            bg: "bg-slate-100"
        },
        { 
            label: "Pending Applications", 
            value: statsData?.stats?.pendingApplications || 0, 
            icon: FileText, 
            color: "text-orange-600", 
            bg: "bg-orange-50"
        },
        { 
            label: "Claims to Review", 
            value: statsData?.stats?.claimsToReview || 0, 
            icon: AlertCircle, 
            color: "text-rose-600", 
            bg: "bg-rose-50"
        },
        { 
            label: "Month Commission", 
            value: `₹${(statsData?.stats?.totalCommission || 0).toLocaleString()}`, 
            icon: CreditCard, 
            color: "text-emerald-600", 
            bg: "bg-emerald-50"
        },
    ];

    const salesData = statsData?.charts?.salesTrend || [];
    const policyTypeData = statsData?.charts?.policyTypeDistribution || [];

    if (statsLoading || appsLoading || claimsLoading) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="h-10 w-64 bg-slate-200 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-80 bg-white rounded-2xl border border-slate-100" />
                    <div className="h-80 bg-white rounded-2xl border border-slate-100" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8 font-sans px-4">
            {/* Welcome Section */}
            <div className="pt-2">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Welcome back, {user?.name}! 📈
                </h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">Here's your performance snapshot.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center ${s.color}`}>
                                <s.icon size={20} />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[11px] font-semibold mb-0.5">{s.label}</p>
                            <h2 className="text-2xl font-bold text-slate-800">{s.value}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trend Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Policy Sales Trend</h3>
                    </div>
                    {salesData.length > 0 ? (
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                                        dy={10}
                                    />
                                    <YAxis axisLine={false} tickLine={false} hide />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#1e293b" radius={[6, 6, 6, 6]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-slate-400 font-medium">
                            No sales records found for the last 6 months.
                        </div>
                    )}
                </div>

                {/* Policies by Type Donut Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Policies by Type</h3>
                    {policyTypeData.length > 0 ? (
                        <div className="relative flex-1 flex flex-col justify-center items-center">
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={policyTypeData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {policyTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {/* Custom Legend */}
                            <div className="grid grid-cols-2 gap-3 mt-6 w-full px-2">
                                {policyTypeData.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] font-bold text-slate-600 truncate">{item.name} ({item.value}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 font-medium text-center px-4">
                            Sell your first policy to see the distribution here!
                        </div>
                    )}
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Applications */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="text-lg font-bold text-slate-800">Recent Applications</h3>
                        <button onClick={() => navigate('/agent/applications')} className="text-[11px] font-bold text-emerald-600 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        {applications.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-slate-400">Customer</th>
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-slate-400">Policy</th>
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-slate-400">Date</th>
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-slate-400">Status</th>
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-slate-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {applications.slice(0, 5).map((row, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-4 font-bold text-slate-700 text-[12px]">{row.user?.name}</td>
                                            <td className="py-4 px-4 font-medium text-slate-500 text-[12px]">{row.policy?.policyName}</td>
                                            <td className="py-4 px-4 font-medium text-slate-400 text-[12px]">{new Date(row.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 px-4">
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                                    row.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                                                    row.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-600'
                                                }`}>
                                                    {row.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button onClick={() => navigate('/agent/applications')} className="text-slate-400 hover:text-[#124C89] transition-colors font-bold text-[11px]">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-12 text-center text-slate-400 font-medium">
                                No applications found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Claims */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="text-lg font-bold text-slate-800">Pending Claims</h3>
                        <button onClick={() => navigate('/agent/claims')} className="text-[11px] font-bold text-emerald-600 hover:underline">View All</button>
                    </div>
                    <div className="space-y-4 flex-1">
                        {claims.filter(c => c.status === 'Pending').length > 0 ? (
                            claims.filter(c => c.status === 'Pending').slice(0, 4).map((claim, i) => (
                                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#124C89]">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none mb-0.5">#{claim._id.slice(-6).toUpperCase()}</p>
                                            <p className="font-bold text-slate-700 text-sm">{claim.user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800 text-sm">₹{claim.amount.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{new Date(claim.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-slate-400 font-medium">
                                Great! All claims are processed.
                            </div>
                        )}
                    </div>
                    <button onClick={() => navigate('/agent/claims')} className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[#1e293b] font-bold text-[12px] transition-all">
                        Go to Claims Management
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
