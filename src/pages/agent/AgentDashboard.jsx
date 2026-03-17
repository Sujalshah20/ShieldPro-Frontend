import React from "react";
import { 
    Users, FileText, ShieldCheck, 
    IndianRupee, TrendingUp, Search, 
    Bell, ChevronDown, MoreHorizontal,
    ArrowUpRight, AlertCircle, PieChart as PieChartIcon
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
            value: "₹12,500", 
            trend: null, 
            icon: IndianRupee, 
            iconColor: "text-emerald-600", 
            iconBg: "bg-emerald-50",
            badge: { text: "Target: 80%", color: "bg-emerald-50 text-emerald-600" }
        },
    ];

    return (
        <div className="space-y-8 pb-12 font-sans px-4">
            {/* Welcome Section */}
            <div>
                <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                    Welcome back, Agent Sarah! 📈
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Here's your performance snapshot for Oct 2023.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 ${s.iconBg} rounded-xl flex items-center justify-center ${s.iconColor}`}>
                                <s.icon size={24} />
                            </div>
                            {s.trend && (
                                <span className="text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">
                                    {s.trend}
                                </span>
                            )}
                            {s.badge && (
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${s.badge.color}`}>
                                    {s.badge.text}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-semibold mb-1">{s.label}</p>
                            <h2 className="text-3xl font-bold text-slate-800">{s.value}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Trend Bar Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-slate-800">Policy Sales Trend</h3>
                        <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:outline-none">
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full">
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
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-slate-800 mb-8">Policies by Type</h3>
                    <div className="relative flex-1 flex flex-col justify-center items-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={policyTypeData}
                                        innerRadius={75}
                                        outerRadius={100}
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-[-15px]">
                            <p className="text-4xl font-bold text-slate-800">124</p>
                            <p className="text-[10px] uppercase font-black tracking-[2px] text-slate-400 mt-1">TOTAL</p>
                        </div>

                        {/* Custom Legend */}
                        <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                            {policyTypeData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-bold text-slate-600">{item.name} ({item.value}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Applications */}
                <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <h3 className="text-xl font-bold text-slate-800">Recent Policy Applications</h3>
                        <button className="text-sm font-bold text-[#124C89] hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="pb-4 px-2 text-[10px] font-black uppercase tracking-[2px] text-slate-400">Customer</th>
                                    <th className="pb-4 px-2 text-[10px] font-black uppercase tracking-[2px] text-slate-400">Policy</th>
                                    <th className="pb-4 px-2 text-[10px] font-black uppercase tracking-[2px] text-slate-400">Date</th>
                                    <th className="pb-4 px-2 text-[10px] font-black uppercase tracking-[2px] text-slate-400">Status</th>
                                    <th className="pb-4 px-2 text-[10px] font-black uppercase tracking-[2px] text-slate-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: "Rahul Sharma", policy: "Health Shield", date: "Oct 12, 2023", status: "PENDING", statusColor: "bg-orange-50 text-orange-600" },
                                    { name: "Priya Varma", policy: "Life Secure", date: "Oct 10, 2023", status: "ACTIVE", statusColor: "bg-emerald-50 text-emerald-600" },
                                    { name: "Amit Singh", policy: "Vehicle Guard", date: "Oct 09, 2023", status: "PENDING", statusColor: "bg-orange-50 text-orange-600" },
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-2 font-bold text-slate-700 text-sm">{row.name}</td>
                                        <td className="py-5 px-2 font-medium text-slate-500 text-sm">{row.policy}</td>
                                        <td className="py-5 px-2 font-medium text-slate-400 text-sm">{row.date}</td>
                                        <td className="py-5 px-2">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${row.statusColor}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-2">
                                            <button className="text-slate-400 hover:text-[#124C89] transition-colors font-bold text-sm">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pending Claims */}
                <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <h3 className="text-xl font-bold text-slate-800">Pending Claims</h3>
                        <button className="text-sm font-bold text-[#124C89] hover:underline">View All</button>
                    </div>
                    <div className="space-y-6 flex-1">
                        {[
                            { id: "#CLM-4492", name: "Priya K.", amount: "₹45,000", date: "Oct 12", status: "Processing" },
                            { id: "#CLM-4485", name: "Sujit M.", amount: "₹1,20,000", date: "Oct 11", status: "Pending" },
                        ].map((claim, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#124C89]">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{claim.id}</p>
                                        <p className="font-bold text-slate-700">{claim.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-800">{claim.amount}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{claim.date} • {claim.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[#124C89] font-bold text-sm transition-all">
                        Process New Claim
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
