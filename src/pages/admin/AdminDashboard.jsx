import React from "react";
import { motion } from "framer-motion";
import { 
    Shield, Activity, Users, FileText, 
    ArrowUpRight, ArrowDownRight, Bell, 
    Search, Plus, Filter, MoreHorizontal,
    CheckCircle2, Clock, XCircle, Database
} from "lucide-react";
import Reveal from "../../components/common/Reveal";

const AdminDashboard = () => {
    const stats = [
        { label: "Total Premiums Written", value: "$4.82M", trend: "+12.5%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Loss Ratio", value: "62.4%", trend: "+8.2%", icon: Database, color: "text-[#0082a1]", bg: "bg-[#dae5e5]" },
        { label: "Pending Claims", value: "156", trend: "-3.1%", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Active Policies", value: "12,842", trend: "68%", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
    ];

    const policies = [
        { id: "POL-88219", client: "Jane Doe", type: "Auto", status: "Active", premium: "$2,450.00", date: "Oct 12, 2024" },
        { id: "POL-88220", client: "Robert King", type: "Life", status: "Pending", premium: "$4,820.00", date: "Nov 05, 2024" },
        { id: "POL-88221", client: "Linda Meyer", type: "Health", status: "Active", premium: "$1,150.00", date: "Sep 18, 2024" },
        { id: "POL-88222", client: "Arthur Taylor", type: "Auto", status: "Expired", premium: "$8,200.00", date: "Aug 30, 2024" },
    ];

    return (
        <div className="min-h-screen bg-[#dae5e5] p-6 md:p-10 font-display">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#012b3f] mb-1 tracking-tight uppercase">Admin Overview</h1>
                    <p className="text-slate-500 font-bold text-xs lowercase tracking-normal">Welcome back, Marcus. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search records..." 
                            className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0082a1]/20 transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <button className="bg-[#0082a1] text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#012b3f] transition-all shadow-lg shadow-[#0082a1]/20">
                        <Plus size={14} strokeWidth={3} /> New Policy
                    </button>
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[#012b3f]">
                         <Bell size={20} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((s, i) => (
                    <Reveal key={i} delay={i * 0.1} direction="up">
                        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-white hover:shadow-xl transition-all group h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color} ${s.bg}`}>
                                    <s.icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${s.trend.startsWith('+') ? 'text-emerald-500 bg-emerald-50' : s.trend.startsWith('-') ? 'text-rose-500 bg-rose-50' : 'text-indigo-500 bg-indigo-50'}`}>
                                    {s.trend}
                                </div>
                            </div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                <h3 className="text-2xl font-black text-[#012b3f] italic-none">{s.value}</h3>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Main Table Card */}
            <Reveal direction="up" delay={0.4}>
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-white overflow-hidden mb-12">
                    <div className="p-7 border-b border-slate-50 flex justify-between items-center text-white bg-[#012b3f]">
                        <h2 className="text-xl font-black uppercase tracking-tight">Policy Management</h2>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">All Policies</button>
                            <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all"><Filter size={18} /></button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Renewal Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-bold text-sm">
                                {policies.map((p, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6 text-slate-500">{p.id}</td>
                                        <td className="px-8 py-6 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#dae5e5] text-[#0082a1] flex items-center justify-center text-[10px]">
                                                {p.client.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            {p.client}
                                        </td>
                                        <td className="px-8 py-6 text-slate-500">{p.type}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                                                p.status === 'Active' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' :
                                                p.status === 'Pending' ? 'text-amber-500 bg-amber-50 border-amber-100' :
                                                'text-rose-500 bg-rose-50 border-rose-100'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">{p.premium}</td>
                                        <td className="px-8 py-6 text-slate-400">{p.date}</td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-slate-300 hover:text-[#012b3f]"><MoreHorizontal size={20} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-8 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Showing 1 to 4 of 284 results</span>
                        <div className="flex gap-2">
                             <button className="px-4 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">Previous</button>
                             <button className="px-4 py-2 bg-[#0082a1] text-white rounded-lg hover:bg-[#012b3f] transition-all">Next</button>
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-10 border border-white shadow-sm">
                    <h3 className="text-xl font-extrabold text-[#012b3f] mb-10">Recent Activity</h3>
                    <div className="space-y-10">
                        {[
                            { icon: CheckCircle2, title: "New Claim Filed: #CLM-9021", time: "2 hours ago by System", desc: "Property damage report received for Policy POL-88210. Initial assessment required.", color: "text-indigo-500", bg: "bg-indigo-50" },
                            { icon: CheckCircle2, title: "Policy Renewed: Jane Doe", time: "5 hours ago by Automatic Renewal", desc: "Auto premium settled for the next billing cycle.", color: "text-emerald-500", bg: "bg-emerald-50" },
                        ].map((act, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${act.color} ${act.bg}`}>
                                    <act.icon size={24} />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-bold text-[#012b3f] leading-none">{act.title}</p>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{act.time}</p>
                                    {act.desc && <div className="p-4 bg-slate-50 rounded-xl text-xs font-bold text-slate-400 mt-2 lowercase tracking-normal">{act.desc}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-1 bg-white rounded-[2rem] p-10 border border-white shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#012b3f] mb-10">Queue Status</h3>
                        <div className="space-y-8">
                            {[
                                { label: "Verification", val: 78 },
                                { label: "Underwriting", val: 42 },
                                { label: "Approval", val: 91 }
                            ].map((q, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>{q.label}</span>
                                        <span>{q.val}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${q.val}%` }}
                                            className="h-full bg-[#0082a1]" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-10 p-6 bg-[#dae5e5] rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-[#0082a1] transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <FileText size={20} className="text-[#0082a1]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#012b3f] uppercase tracking-widest group-hover:text-white transition-colors">Monthly Analytics</p>
                                <p className="text-[10px] font-bold text-slate-400 group-hover:text-white/60 transition-colors tracking-normal">View full report</p>
                            </div>
                        </div>
                        <ArrowUpRight size={20} className="text-[#012b3f] group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
