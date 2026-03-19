import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Users, Search, Plus, 
    Download, ChevronDown, Calendar, 
    Eye, Edit, Trash2, MoreHorizontal,
    Mail, Phone, ShieldCheck, ClipboardList,
    X, LogOut, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminUsers = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: users, isLoading } = useQuery({
        queryKey: ['adminUsers', user?.token],
        queryFn: () => api.get('/admin/users', user.token),
        enabled: !!user?.token
    });

    const getStatusStyle = (status) => {
        return status === 'Inactive' 
            ? 'bg-slate-100 text-slate-500 border-slate-200' 
            : 'bg-emerald-50 text-emerald-600 border-emerald-100';
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-2">
                            <span>Admin</span>
                            <ChevronRight size={12} className="text-slate-300" />
                            <span className="text-blue-500">Client Directory</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">Manage Customers</h1>
                        <p className="text-xs font-medium text-slate-400">Omni-channel view of your registered policyholders</p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-4">
                        <button className="h-12 px-6 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all bg-white shadow-sm italic">
                            <Download size={18} /> Export Registry
                        </button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="h-12 px-6 bg-[#1e293b] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#0f172a] transition-all shadow-lg shadow-slate-900/10 active:scale-95 italic"
                        >
                            <Plus size={18} /> New Prospect
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Identity, Communication Node or Nexus ID..." 
                        className="w-full pl-12 pr-4 h-13 bg-white border border-slate-100 rounded-[1.25rem] text-xs font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    {[
                        { label: "Account Lifecycle", icon: ChevronDown },
                        { label: "Coverage Class", icon: ChevronDown },
                        { label: "Registration Date", icon: Calendar }
                    ].map((f, i) => (
                        <button key={i} className="h-13 px-5 bg-white border border-slate-100 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-6 hover:bg-slate-50 transition-all shadow-sm italic">
                            {f.label} <f.icon size={16} className="text-slate-400" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-50 bg-slate-50/10">
                                <th className="px-6 py-4">Reference ID</th>
                                <th className="px-6 py-4">Identity</th>
                                <th className="px-6 py-4">Comm_Channels</th>
                                <th className="px-6 py-4 text-center">Policies</th>
                                <th className="px-6 py-4 text-center">Claims</th>
                                <th className="px-6 py-4">Nexus_Entry</th>
                                <th className="px-6 py-4">State</th>
                                <th className="px-6 py-4 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-[4px] italic">Accessing Client Database...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users?.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((u, i) => (
                                <tr key={u._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 uppercase tracking-tighter italic">
                                            CUST-{u._id.slice(-5).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                                <img src={`https://i.pravatar.cc/100?u=${u._id}`} alt={u.name} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-800 leading-none mb-1 italic tracking-tight">{u.name}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[2px]">Verified User</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-blue-600 italic leading-none">{u.email}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{u.phone || '+91 98765 43210'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex w-8 h-8 rounded-lg bg-blue-50 items-center justify-center border border-blue-100 text-[11px] font-black text-blue-700 italic shadow-inner">
                                            {i % 3 + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex w-8 h-8 rounded-lg bg-orange-50 items-center justify-center border border-orange-100 text-[11px] font-black text-orange-700 italic shadow-inner">
                                            {i % 2}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-bold text-slate-400 whitespace-nowrap italic">
                                        {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[2px] border italic ${getStatusStyle(i === 2 ? 'Inactive' : 'Active')}`}>
                                            {i === 2 ? 'Inactive' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-lg shadow-sm transition-all hover:scale-110">
                                                <Eye size={14} />
                                            </button>
                                            <button className="p-2 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-lg shadow-sm transition-all hover:scale-110">
                                                <Edit size={14} />
                                            </button>
                                            <button className="p-2 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-lg shadow-sm transition-all hover:scale-110">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-10 py-8 bg-slate-50/20 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] italic">Displaying 1-{users?.length || 0} of 1,280 entries</span>
                    <div className="flex items-center gap-3">
                        <button className="h-11 px-5 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-white hover:border-blue-500/20 hover:text-blue-600 transition-all italic">Previous</button>
                        {[1, 2, 3, "...", 12].map((p, i) => (
                            <button key={i} className={`w-11 h-11 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${p === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-400 hover:bg-white hover:text-blue-600"}`}>
                                {p}
                            </button>
                        ))}
                        <button className="h-11 px-5 bg-[#1e293b] text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/20 hover:bg-[#0f172a] transition-all italic">Next Cluster</button>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100"
                        >
                            <div className="pt-10 px-10 pb-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight italic">Enroll New Prospect</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Onboarding Protocol</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] pl-1">Legal Identity</label>
                                            <input className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold italic outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="e.g. Johnathan Silver" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] pl-1">Communication Node</label>
                                            <input className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold italic outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="john@nexus.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] pl-1">Voice Frequency</label>
                                        <input className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold italic outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="+91 0000 000 000" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] pl-1">Initial Coverage Class</label>
                                        <div className="relative">
                                            <select className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold italic outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer">
                                                <option>Standard Health</option>
                                                <option>Premium Life</option>
                                                <option>Secure Motor</option>
                                            </select>
                                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 h-15 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all italic"
                                    >
                                        Abort
                                    </button>
                                    <button className="flex-[2] h-15 bg-[#1e293b] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0f172a] transition-all shadow-xl shadow-slate-900/20 active:scale-95 italic border-b-4 border-black/20">
                                        Execute Onboarding
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;