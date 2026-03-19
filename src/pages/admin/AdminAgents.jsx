import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Plus, MoreHorizontal,
    Mail, Phone, Shield, 
    ChevronLeft, ChevronRight,
    Briefcase, Users, FileText, 
    DollarSign, Filter, X,
    Edit2, Eye, Trash2, MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { TableSkeleton } from "../../components/common/Skeleton";

const AdminAgents = () => {
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All Agents");

    const { data: agents, isLoading } = useQuery({
        queryKey: ['adminAgents', user?.token],
        queryFn: () => api.get('/admin/agents', user.token),
        enabled: !!user?.token
    });

    const tabs = ["All Agents", "Active", "Inactive", "Onboarding"];

    const getStatusStyle = (status) => {
        switch(status?.toLowerCase()) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'inactive': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'onboarding': return 'bg-slate-50 text-slate-500 border-slate-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const getStatusDot = (status) => {
        switch(status?.toLowerCase()) {
            case 'active': return 'bg-emerald-500';
            case 'inactive': return 'bg-rose-500';
            case 'onboarding': return 'bg-slate-400';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <Reveal direction="left">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Agent Management</h1>
                        <p className="text-base font-medium text-slate-500 max-w-2xl">
                            Create, edit, and oversee all insurance agent profiles and performance metrics.
                        </p>
                    </Reveal>
                </div>
                
                <Reveal direction="right">
                    <button className="h-14 px-8 bg-[#1e293b] text-white rounded-xl text-sm font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-95 whitespace-nowrap">
                        <Plus size={20} strokeWidth={3} /> Create New Agent
                    </button>
                </Reveal>
            </div>

            {/* Filters Row */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by agent ID or name..." 
                        className="w-full pl-12 pr-4 h-12 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                    <select className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-blue-500 transition-all cursor-pointer min-w-[140px]">
                        <option>Region</option>
                        <option>North</option>
                        <option>South</option>
                        <option>East</option>
                        <option>West</option>
                    </select>
                    
                    <select className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-blue-500 transition-all cursor-pointer min-w-[140px]">
                        <option>Level</option>
                        <option>Junior</option>
                        <option>Senior</option>
                        <option>Elite</option>
                    </select>

                    <select className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-blue-500 transition-all cursor-pointer min-w-[140px]">
                        <option>Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Onboarding</option>
                    </select>

                    <button className="h-12 px-6 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Tabs */}
                <div className="px-8 border-b border-slate-50">
                    <div className="flex items-center gap-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-6 text-sm font-bold border-b-2 transition-all relative ${
                                    activeTab === tab 
                                    ? "text-blue-600 border-blue-600" 
                                    : "text-slate-400 border-transparent hover:text-slate-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-50">
                                <th className="px-8 py-6">Agent ID</th>
                                <th className="px-8 py-6">Name</th>
                                <th className="px-8 py-6">Region</th>
                                <th className="px-8 py-6">Total Policies</th>
                                <th className="px-8 py-6">Total Revenue</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="7" className="px-8 py-20"><TableSkeleton /></td></tr>
                            ) : agents?.filter(a => a.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((a, i) => (
                                <tr key={a._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6 text-xs font-bold text-slate-400">
                                        AGT - {a._id.slice(-4).toUpperCase()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                                                <img src={`https://i.pravatar.cc/100?u=${a._id}`} alt={a.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 tracking-tight">{a.name}</span>
                                                <span className="text-[11px] font-medium text-slate-400">{a.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                                            <MapPin size={14} className="text-slate-300" />
                                            {["North Division", "South Hub", "Central Region", "West Coast"][i % 4]}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-slate-700">{(1200 + i * 45).toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-slate-800 tracking-tight">
                                            ₹{(125000 + i * 25000).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Inactive' : 'Onboarding')}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Inactive' : 'Onboarding')}`} />
                                            {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Inactive' : 'Onboarding'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-8 bg-slate-50/30 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <span className="text-xs font-bold text-slate-400">
                        Showing 4 of 24 agents
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all bg-white">
                            <ChevronLeft size={20} />
                        </button>
                        {[1, 2, 3].map((num) => (
                            <button 
                                key={num}
                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                                    num === 1 
                                    ? "bg-[#1e293b] text-white shadow-lg" 
                                    : "bg-white border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600"
                                }`}
                            >
                                {num}
                            </button>
                        ))}
                        <span className="px-2 text-slate-300 font-black">...</span>
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600 text-xs font-black transition-all">5</button>
                        <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all bg-white">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAgents;
