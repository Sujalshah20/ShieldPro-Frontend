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
            color: "text-black", 
            bg: "bg-slate-50 shadow-inner"
        },
        { 
            label: "Pending Applications", 
            value: statsData?.stats?.pendingApplications || 0, 
            icon: FileText, 
            color: "text-black", 
            bg: "bg-black/[0.02] shadow-inner"
        },
        { 
            label: "Claims to Review", 
            value: statsData?.stats?.claimsToReview || 0, 
            icon: AlertCircle, 
            color: "text-black", 
            bg: "bg-black/[0.02] shadow-inner"
        },
        { 
            label: "Month Commission", 
            value: `₹${(statsData?.stats?.totalCommission || 0).toLocaleString()}`, 
            icon: CreditCard, 
            color: "text-black", 
            bg: "bg-black/[0.02] shadow-inner"
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
                <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                    Welcome back, {user?.name}! 📈
                </h1>
                <p className="text-black mt-1 text-sm font-bold">Here's your performance snapshot.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center ${s.color} border border-white transition-all group-hover:rotate-6 group-hover:scale-110`}>
                                <s.icon size={22} strokeWidth={3} />
                            </div>
                        </div>
                        <div>
                            <p className="text-black text-[10px] font-black mb-1 uppercase tracking-[4px] opacity-20 italic">{s.label}</p>
                            <h2 className="text-3xl font-black text-black tracking-tighter italic uppercase">{s.value}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trend Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-black">Policy Sales Trend</h3>
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
                                        tick={{ fill: '#000000', fontSize: 12, fontWeight: 700 }} 
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
                        <div className="h-[280px] flex items-center justify-center text-black font-medium text-[13px] italic tracking-wider">
                            No sales records found for the last 6 months.
                        </div>
                    )}
                </div>

                {/* Policies by Type Donut Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-black mb-6">Policies by Type</h3>
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
                                        <span className="text-[10px] font-bold text-black truncate">{item.name} ({item.value}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-black font-medium text-center px-4 italic text-[12px]">
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
                        <h3 className="text-lg font-bold text-black">Recent Applications</h3>
                        <button onClick={() => navigate('/agent/applications')} className="text-[11px] font-bold text-emerald-600 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        {applications.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-black">Customer</th>
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-black">Policy</th>
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-black">Date</th>
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-black">Status</th>
                                        <th className="pb-3 px-4 text-[9px] font-black uppercase tracking-[1px] text-black text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {applications.slice(0, 5).map((row, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-4 font-bold text-black text-[12px]">{row.user?.name}</td>
                                            <td className="py-4 px-4 font-bold text-black text-[12px]">{row.policy?.policyName}</td>
                                            <td className="py-4 px-4 font-bold text-black text-[12px]">{new Date(row.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 px-4">
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                                    row.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                                                    row.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-black'
                                                }`}>
                                                    {row.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <button onClick={() => navigate('/agent/applications')} className="h-9 px-4 bg-slate-50 text-black border border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all italic">DEPLOY</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-12 text-center text-black font-bold uppercase tracking-[2px] text-[11px] italic">
                                No applications found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Claims */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="text-lg font-bold text-black">Pending Claims</h3>
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
                                            <p className="text-[8px] font-black text-black uppercase tracking-wider leading-none mb-0.5">#{claim._id.slice(-6).toUpperCase()}</p>
                                            <p className="font-bold text-black text-sm">{claim.user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-black text-sm">₹{claim.amount.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-black mt-0.5 uppercase tracking-wider">{new Date(claim.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-black font-bold uppercase tracking-[2px] text-[11px] italic">
                                Great! All claims are processed.
                            </div>
                        )}
                    </div>
                    <button onClick={() => navigate('/agent/claims')} className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-black font-bold text-[12px] transition-all">
                        Go to Claims Management
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
