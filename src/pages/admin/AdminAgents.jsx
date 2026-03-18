import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Plus, MoreHorizontal,
    Mail, Phone, Shield, 
    ChevronLeft, ChevronRight,
    Briefcase, Users, FileText, BadgeIndianRupee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { TableSkeleton } from "../../components/common/Skeleton";

const AdminAgents = () => {
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: agents, isLoading } = useQuery({
        queryKey: ['adminAgents', user?.token],
        queryFn: () => api.get('/admin/agents', user.token),
        enabled: !!user?.token
    });

    const getSpecStyle = (spec) => {
        switch(spec?.toLowerCase()) {
            case 'health': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'life': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'vehicle': return 'bg-orange-50 text-orange-600 border-orange-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const mockSpecializations = ['Health', 'Life', 'Vehicle', 'Health', 'Life'];

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manage Agents</h1>
                    </div>
                </Reveal>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search agents..." 
                            className="w-full pl-12 pr-4 h-12 bg-slate-100/50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="h-12 px-6 bg-[#1a2332] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 whitespace-nowrap">
                        <Plus size={18} /> Add New Agent
                    </button>
                </div>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">Agent ID</th>
                                <th className="px-8 py-6">Name</th>
                                <th className="px-8 py-6">Email & Phone</th>
                                <th className="px-8 py-6">Specialization</th>
                                <th className="px-8 py-6 text-center">Customers</th>
                                <th className="px-8 py-6 text-center">Policies</th>
                                <th className="px-8 py-6 text-right">Commission</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="8" className="px-8 py-20 text-center"><TableSkeleton /></td></tr>
                            ) : agents?.filter(a => a.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((a, i) => (
                                <tr key={a._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-7 text-xs font-bold text-slate-400 uppercase tracking-tight">
                                        #AGT-{a._id.slice(-4).toUpperCase()}
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm bg-slate-200">
                                                <img src={`https://i.pravatar.cc/100?u=${a._id}`} alt={a.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{a.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-medium text-slate-600">{a.email}</p>
                                            <p className="text-[10px] font-medium text-slate-400">+1 (555) 012-{3456 + i}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${getSpecStyle(mockSpecializations[i % 5])}`}>
                                            {mockSpecializations[i % 5]}
                                        </span>
                                    </td>
                                    <td className="px-8 py-7 text-center text-xs font-bold text-slate-600">
                                        {100 + i * 12}
                                    </td>
                                    <td className="px-8 py-7 text-center text-xs font-bold text-slate-600">
                                        {200 + i * 15}
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <span className="text-sm font-black text-slate-800 tracking-tight">
                                            ₹{(8000 + i * 1250.5).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                        Showing 1 to {agents?.length || 0} of 24 agents
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-[#1a2332] text-white text-xs font-bold flex items-center justify-center shadow-lg transition-all">1</button>
                        <button className="w-8 h-8 rounded-lg text-xs font-bold text-slate-500 hover:bg-white flex items-center justify-center transition-all border border-transparent hover:border-slate-100">2</button>
                        <button className="w-8 h-8 rounded-lg text-xs font-bold text-slate-500 hover:bg-white flex items-center justify-center transition-all border border-transparent hover:border-slate-100">3</button>
                        <span className="text-slate-300 px-1 font-bold italic">...</span>
                        <button className="w-8 h-8 rounded-lg text-xs font-bold text-slate-500 hover:bg-white flex items-center justify-center transition-all border border-transparent hover:border-slate-100">5</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAgents;
