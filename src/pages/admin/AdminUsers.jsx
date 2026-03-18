import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Users, Search, Plus, 
    Download, ChevronDown, Calendar, 
    Eye, Edit, Trash2, MoreHorizontal,
    Mail, Phone, ShieldCheck, ClipboardList,
    X, LogOut
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
            ? 'bg-slate-100 text-slate-500' 
            : 'bg-emerald-100 text-emerald-700';
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manage Customers</h1>
                        <p className="text-sm font-medium text-slate-400">View and manage your customer database</p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-4">
                        <button className="h-11 px-6 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all bg-white shadow-sm">
                            <Download size={16} /> Export Data (CSV/PDF)
                        </button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="h-11 px-6 bg-[#1e3a8a] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#1e40af] transition-all shadow-lg active:scale-95"
                        >
                            <Plus size={18} /> Add Customer
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email or..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    {[
                        { label: "All Status", icon: ChevronDown },
                        { label: "Select Policy Type", icon: ChevronDown },
                        { label: "Join Date range", icon: Calendar }
                    ].map((f, i) => (
                        <button key={i} className="h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 flex items-center gap-10 hover:bg-slate-50 transition-all shadow-sm">
                            {f.label} <f.icon size={16} className="text-slate-400" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">ID</th>
                                <th className="px-8 py-6">Name</th>
                                <th className="px-8 py-6">Contact Details</th>
                                <th className="px-8 py-6">Policies</th>
                                <th className="px-8 py-6">Claims</th>
                                <th className="px-8 py-6">Joined Date</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="8" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing Personnel Data...</td></tr>
                            ) : users?.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((u, i) => (
                                <tr key={u._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                        CUST-{u._id.slice(-3).toUpperCase()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                                                <img src={`https://i.pravatar.cc/100?u=${u._id}`} alt={u.name} />
                                            </div>
                                            <span className="text-sm font-black text-slate-700 leading-tight">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-slate-600">{u.email}</p>
                                            <p className="text-[10px] font-medium text-slate-400">{u.phone || '+91 98765 43210'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 text-xs font-black text-slate-700">
                                            {i % 3 + 1}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 text-xs font-black text-slate-700">
                                            {i % 2}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-medium text-slate-500">
                                        {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(i === 2 ? 'Inactive' : 'Active')}`}>
                                            {i === 2 ? 'Inactive' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 font-bold">Showing 1 to {users?.length || 0} of 128 entries</span>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all">
                            <ChevronDown size={18} className="rotate-90" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-900/10 transition-all">1</button>
                        <button className="w-8 h-8 rounded-lg text-xs font-bold text-slate-500 hover:bg-white flex items-center justify-center transition-all">2</button>
                        <button className="w-8 h-8 rounded-lg text-xs font-bold text-slate-500 hover:bg-white flex items-center justify-center transition-all">3</button>
                        <span className="text-slate-300 px-1 font-bold">...</span>
                        <button className="w-8 h-8 rounded-lg text-xs font-bold text-slate-500 hover:bg-white flex items-center justify-center transition-all">12</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all">
                            <ChevronDown size={18} className="-rotate-90" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Red Logout Button at Bottom of Sidebar (Conceptual placement context) */}
            {/* The Logout button in the sidebar will be handled separately in Sidebar.jsx if not already done */}

            {/* Create Modal (Placeholder for parity) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800">Add New Customer</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500">Full Name</label>
                                            <input className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-all" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500">Email Address</label>
                                            <input className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-all" placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500">Phone Number</label>
                                        <input className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-all" placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button className="w-full h-14 bg-[#1e3a8a] text-white rounded-xl font-bold text-sm hover:bg-[#1e40af] transition-all shadow-lg active:scale-95">
                                        Add Customer
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