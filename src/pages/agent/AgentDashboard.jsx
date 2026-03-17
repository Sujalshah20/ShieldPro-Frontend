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

const AgentDashboard = () => {
    // Chart Data
    const salesData = [
        { name: 'May', value: 30 },
        { name: 'Jun', value: 45 },
        { name: 'Jul', value: 35 },
        { name: 'Aug', value: 55 },
        { name: 'Sep', value: 40 },
        { name: 'Oct', value: 65 },
    ];

    const policyTypeData = [
        { name: 'Health', value: 42, color: '#124C89' },
        { name: 'Life', value: 28, color: '#10b981' },
        { name: 'Vehicle', value: 20, color: '#f59e0b' },
        { name: 'Others', value: 10, color: '#cbd5e1' },
    ];

    const stats = [
        { 
            label: "Total Customers", 
            value: "45", 
            trend: "+12%", 
            icon: Users, 
            iconColor: "text-blue-600", 
            iconBg: "bg-blue-50",
            badge: null
        },
        { 
            label: "Pending Applications", 
            value: "8", 
            trend: null, 
            icon: FileText, 
            iconColor: "text-orange-600", 
            iconBg: "bg-orange-50",
            badge: { text: "Pending", color: "bg-gray-100 text-gray-600" }
        },
        { 
            label: "Claims to Review", 
            value: "5", 
            trend: null, 
            icon: AlertCircle, 
            iconColor: "text-rose-600", 
            iconBg: "bg-rose-50",
            badge: { text: "Critical", color: "bg-rose-50 text-rose-600" }
        },
        { 
            label: "Month Commission", 
            value: "₹12,450", 
            trend: null, 
            icon: CreditCard, 
            iconColor: "text-emerald-600", 
            iconBg: "bg-emerald-50",
            badge: { text: "Target: 80%", color: "bg-emerald-50 text-emerald-600" }
        },
    ];

    return (
        <div className="space-y-6 pb-8 font-sans px-4">
            {/* Welcome Section */}
            <div className="pt-2">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Welcome back, Sarah Jenkins! 📈
                </h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">Here's your performance snapshot for Oct 2023.</p>
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
                            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center ${s.iconColor}`}>
                                <s.icon size={20} />
                            </div>
                            {s.trend && (
                                <span className="text-emerald-500 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-lg">
                                    {s.trend}
                                </span>
                            )}
                            {s.badge && (
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${s.badge.color}`}>
                                    {s.badge.text}
                                </span>
                            )}
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
                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-600 focus:outline-none cursor-pointer">
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                        </select>
                    </div>
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
                                <Bar dataKey="value" fill="#124C89" radius={[6, 6, 6, 6]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Policies by Type Donut Chart */}
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Policies by Type</h3>
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
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-[-10px]">
                            <p className="text-2xl font-bold text-slate-800">124</p>
                            <p className="text-[8px] uppercase font-black tracking-[1px] text-slate-400 mt-0.5">TOTAL</p>
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
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Applications */}
                <div className="lg:col-span-7 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="text-lg font-bold text-slate-800">Recent Applications</h3>
                        <button className="text-[11px] font-bold text-[#124C89] hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="pb-3 px-1 text-[9px] font-black uppercase tracking-[1px] text-slate-400">Customer</th>
                                    <th className="pb-3 px-1 text-[9px] font-black uppercase tracking-[1px] text-slate-400">Policy</th>
                                    <th className="pb-3 px-1 text-[9px] font-black uppercase tracking-[1px] text-slate-400">Date</th>
                                    <th className="pb-3 px-1 text-[9px] font-black uppercase tracking-[1px] text-slate-400">Status</th>
                                    <th className="pb-3 px-1 text-[9px] font-black uppercase tracking-[1px] text-slate-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: "Rahul Sharma", policy: "Health Shield", date: "Oct 12", status: "PENDING", statusColor: "bg-orange-50 text-orange-600" },
                                    { name: "Priya Varma", policy: "Life Secure", date: "Oct 10", status: "ACTIVE", statusColor: "bg-emerald-50 text-emerald-600" },
                                    { name: "Amit Singh", policy: "Vehicle Guard", date: "Oct 09", status: "PENDING", statusColor: "bg-orange-50 text-orange-600" },
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3.5 px-1 font-bold text-slate-700 text-[12px]">{row.name}</td>
                                        <td className="py-3.5 px-1 font-medium text-slate-500 text-[12px]">{row.policy}</td>
                                        <td className="py-3.5 px-1 font-medium text-slate-400 text-[12px]">{row.date}</td>
                                        <td className="py-3.5 px-1">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${row.statusColor}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-1 text-right">
                                            <button className="text-slate-400 hover:text-[#124C89] transition-colors font-bold text-[11px]">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pending Claims */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="text-lg font-bold text-slate-800">Pending Claims</h3>
                        <button className="text-[11px] font-bold text-[#124C89] hover:underline">View All</button>
                    </div>
                    <div className="space-y-4 flex-1">
                        {[
                            { id: "#CLM-4492", name: "Priya K.", amount: "₹45,000", date: "Oct 12", status: "Processing" },
                            { id: "#CLM-4485", name: "Sujit M.", amount: "₹1,20,000", date: "Oct 11", status: "Pending" },
                        ].map((claim, i) => (
                            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#124C89]">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none mb-0.5">{claim.id}</p>
                                        <p className="font-bold text-slate-700 text-sm">{claim.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800 text-sm">{claim.amount}</p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{claim.date} • {claim.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[#124C89] font-bold text-[12px] transition-all">
                        Process New Claim
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
