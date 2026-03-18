import React, { useState } from "react";
import { 
    Users, Search, Filter, Plus, 
    MoreHorizontal, Mail, Phone, 
    Calendar, Shield, ChevronRight,
    ArrowUpRight, Star, Briefcase,
    CheckCircle2, XCircle, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const AdminAgents = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const agents = [
        { id: "AGT-8821", name: "Johnathan Smith", email: "john.s@shieldpro.com", phone: "+91 98765 43210", region: "North Zone", policies: 124, revenue: "₹45.2L", rating: 4.8, status: "Active", joined: "12 Oct 2023" },
        { id: "AGT-8822", name: "Sarah Jenkins", email: "sarah.j@shieldpro.com", phone: "+91 87654 32109", region: "West Zone", policies: 98, revenue: "₹32.8L", rating: 4.5, status: "Active", joined: "15 Nov 2023" },
        { id: "AGT-8823", name: "Michael Vance", email: "m.vance@shieldpro.com", phone: "+91 76543 21098", region: "South Zone", policies: 76, revenue: "₹24.5L", rating: 4.2, status: "Inactive", joined: "20 Jan 2024" },
        { id: "AGT-8824", name: "Priya Sharma", email: "priya.s@shieldpro.com", phone: "+91 65432 10987", region: "East Zone", policies: 145, revenue: "₹52.1L", rating: 4.9, status: "Active", joined: "05 Mar 2024" },
    ];

    const stats = [
        { label: "Total Agents", value: "156", icon: Users, color: "blue" },
        { label: "Active Now", value: "142", icon: CheckCircle2, color: "emerald" },
        { label: "Top Rated", value: "34", icon: Star, color: "amber" },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manage Agents</h1>
                        <p className="text-slate-500 font-medium">Oversee and manage your insurance agent workforce.</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <button className="h-11 px-6 bg-blue-600 text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                        <Plus size={18} /> Enlist New Agent
                    </button>
                </Reveal>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${s.color}-50 text-${s.color}-600`}>
                                <s.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-400">{s.label}</p>
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{s.value}</h3>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search agents by name, ID or region..." 
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none h-11 px-4 flex items-center justify-center gap-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={18} /> Filters
                    </button>
                    <button className="flex-1 md:flex-none h-11 px-4 flex items-center justify-center gap-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Agents Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-5">Agent ID</th>
                                <th className="px-6 py-5">Agent Info</th>
                                <th className="px-6 py-5">Region</th>
                                <th className="px-6 py-5">Performance</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Joined Date</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {agents.map((agent, idx) => (
                                <tr key={agent.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">#{agent.id.split('-')[1]}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold overflow-hidden shadow-sm">
                                                <img src={`https://i.pravatar.cc/100?u=${agent.id}`} alt="" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{agent.name}</span>
                                                <span className="text-xs font-medium text-slate-400">{agent.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                           <Briefcase size={14} className="text-slate-400" />
                                           {agent.region}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between text-[11px] font-bold">
                                                <span className="text-slate-400">{agent.policies} POLICIES</span>
                                                <span className="text-blue-600">{agent.revenue}</span>
                                            </div>
                                            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                                            agent.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                            {agent.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {agent.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-slate-500">{agent.joined}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 1 to 4 of 156 Agents</p>
                    <div className="flex gap-2">
                         <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                         <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAgents;
