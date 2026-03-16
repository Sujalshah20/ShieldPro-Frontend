import React from "react";
import { motion } from "framer-motion";
import { 
    Users, FileText, DollarSign, 
    ArrowUpRight, ArrowDownRight, 
    Plus, Search, Bell, Filter,
    CheckCircle2, Clock, Mail,
    BarChart3, Settings
} from "lucide-react";
import Reveal from "../../components/common/Reveal";
import { 
    BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer,
    Cell
} from 'recharts';

const AgentDashboard = () => {
    const data = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 450 },
        { name: 'Mar', value: 300 },
        { name: 'Apr', value: 700 },
        { name: 'May', value: 550 },
        { name: 'Jun', value: 900 },
    ];

    const stats = [
        { label: "New Applications", value: "86", trend: "12%", icon: FileText, color: "text-[#012b3f]", bg: "bg-slate-50" },
        { label: "Claim Status Tracking", value: "24", trend: "5%", icon: Activity, color: "text-[#0082a1]", bg: "bg-[#dae5e5]" },
        { label: "Commission Earnings", value: "$14,250", trend: "2%", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
    ];

    return (
        <div className="min-h-screen bg-[#dae5e5] p-6 md:p-10 font-display">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#012b3f] mb-1 tracking-tight uppercase">Dashboard Overview</h1>
                    <p className="text-slate-500 font-bold lowercase tracking-normal text-xs">Welcome back, Agent Wright. Here's what needs your attention today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="bg-white border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0082a1]/20 transition-all shadow-sm"
                        />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[#012b3f] shadow-sm relative">
                         <Bell size={20} />
                         <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-white">
                        <div className="text-right">
                             <p className="text-[10px] font-black text-[#012b3f] uppercase leading-none">Alexander Wright</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Senior Agent</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                             <img src="https://i.pravatar.cc/100?u=alex" alt="Profile" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {stats.map((s, i) => (
                    <Reveal key={i} delay={i * 0.1} direction="up">
                        <div className="bg-white p-7 rounded-[1.5rem] shadow-sm border border-white hover:shadow-xl transition-all relative overflow-hidden group h-full">
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color} ${s.bg}`}>
                                    <s.icon size={24} strokeWidth={2.5} />
                                </div>
                                <div className={`text-[10px] font-black flex items-center gap-1 ${s.label.includes('Earnings') ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {s.label.includes('Earnings') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                    {s.trend} <span className="text-slate-300">vs last month</span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                <h3 className="text-3xl font-black text-[#012b3f]">{s.value}</h3>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <s.icon size={100} />
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Visual Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Growth Chart - Matching screenshot */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-12 border border-white shadow-sm">
                    <div className="flex justify-between items-center mb-12">
                        <h3 className="text-2xl font-extrabold text-[#012b3f] tracking-tight">Revenue Growth</h3>
                        <div className="px-4 py-2 bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                            Last 6 Months
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900, textAnchor: 'middle' }} 
                                    dy={20}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={80}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#0082a1' : '#dae5e5'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Panel - Recent Activity */}
                <div className="lg:col-span-1 bg-white rounded-[2rem] p-10 border border-white shadow-sm flex flex-col">
                    <h3 className="text-xl font-extrabold text-[#012b3f] mb-12">Recent Activity</h3>
                    <div className="space-y-10 flex-1">
                        {[
                            { title: "Policy Approved", detail: "Policy #12345 for Sarah Jenkins was approved.", status: "POLICY APPROVED", color: "text-emerald-500", bg: "bg-emerald-50" },
                            { title: "New Claim Submitted", detail: "Client: Thomas Miller submitted a claim for Auto Collision.", status: "NEW CLAIM SUBMITTED", color: "text-indigo-500", bg: "bg-indigo-50" },
                            { title: "Premium Payment Received", detail: "Policy #4421 premium payment has been processed.", status: "PREMIUM PAYMENT RECEIVED", color: "text-amber-500", bg: "bg-amber-50" },
                        ].map((act, i) => (
                            <div key={i} className="flex gap-6 items-start group">
                                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${act.bg} ${act.color} shadow-sm group-hover:scale-110 transition-all`}>
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-bold text-[#012b3f] text-sm leading-tight">{act.title}</p>
                                    <p className="text-slate-400 text-xs font-bold leading-tight">{act.detail}</p>
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{act.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-12 py-4 border border-slate-100 rounded-xl text-xs font-black text-[#0082a1] uppercase tracking-[2px] transition-all hover:bg-[#dae5e5] hover:border-[#0082a1]">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple Activity Placeholder since icon was duplicated
const Activity = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        width="24" height="24" viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" strokeWidth="2" 
        strokeLinecap="round" strokeLinejoin="round" 
        className="lucide lucide-activity"
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
);

export default AgentDashboard;
