import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Users, Mail, Phone, ExternalLink, FileText, 
    ShieldCheck, Search, Activity, Target, 
    Fingerprint, Globe, Command, Briefcase,
    ChevronRight, ArrowLeft, IndianRupee, Zap,
    Shield, Lock, Award, Terminal, X, Layers,
    Satellite, SearchCheck, RefreshCcw,
    Bell, Filter, Download, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AgentClients = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: clients, isLoading } = useQuery({
        queryKey: ['agentClients', user?.token],
        queryFn: () => api.get('/agent/customers', user.token),
        enabled: !!user?.token
    });

    const filteredClients = clients?.filter(c => 
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="py-20 px-8">
             <div className="h-12 w-64 bg-slate-200 animate-pulse rounded-xl mb-12" />
             <div className="h-[600px] bg-white rounded-3xl border border-slate-200 animate-pulse" />
        </div>
    );

    return (
        <div className="py-6 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-black uppercase tracking-tighter italic">Customer Database_</h1>
                    <span className="px-3 py-1 bg-black text-white text-[9px] font-black rounded-lg uppercase tracking-[3px] italic shadow-3xl">
                        {clients?.length || 1248} TOTAL
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Bell size={20} className="text-black/40 cursor-pointer hover:text-black transition-colors" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-[13px] font-black text-black uppercase tracking-tight italic">Rajesh Kumar</p>
                            <p className="text-[9px] font-black text-black/40 uppercase tracking-[3px] text-right italic">Senior Agent</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-black text-sm shadow-3xl italic">
                            RK
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search customers by name, email, phone or..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-black/5 transition-all text-[14px] font-bold text-black shadow-sm"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                    <div className="relative min-w-[180px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                        <select className="w-full pl-10 pr-10 h-12 bg-white border border-slate-200 rounded-xl outline-none appearance-none text-[13px] font-bold text-black cursor-pointer hover:border-black/20 transition-all shadow-sm">
                            <option>Policy Type: All</option>
                            <option>Health Insurance</option>
                            <option>Vehicle Insurance</option>
                            <option>Life Insurance</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 rotate-90" />
                    </div>
                    <div className="relative min-w-[160px]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10"></div>
                        </div>
                        <select className="w-full pl-10 pr-10 h-12 bg-white border border-slate-200 rounded-xl outline-none appearance-none text-[11px] font-black text-black cursor-pointer hover:border-black/20 transition-all shadow-sm italic uppercase tracking-widest">
                            <option>Status: Active</option>
                            <option>Inactive</option>
                            <option>Pending</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 rotate-90" />
                    </div>
                    <button className="h-12 px-6 bg-black text-white rounded-xl font-black text-[11px] flex items-center justify-center gap-3 hover:bg-black/90 transition-all shadow-3xl uppercase tracking-widest italic border-b-4 border-white/10">
                        <Download size={18} /> EXPORT_LIST
                    </button>
                </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pl-8 pr-4 py-5 text-[11px] font-black text-black/40 uppercase tracking-widest">Customer Name</th>
                                <th className="px-4 py-5 text-[11px] font-black text-black/40 uppercase tracking-widest">Contact Information</th>
                                <th className="px-4 py-5 text-[11px] font-black text-black/40 uppercase tracking-widest text-center">Policies</th>
                                <th className="px-4 py-5 text-[11px] font-black text-black/40 uppercase tracking-widest text-left">Total Premium (₹)</th>
                                <th className="px-4 py-5 text-[11px] font-black text-black/40 uppercase tracking-widest">Status</th>
                                <th className="pl-4 pr-8 py-5 text-[11px] font-black text-black/40 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredClients?.map((client, idx) => (
                                <tr key={client._id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                                    <td className="pl-8 pr-4 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-100">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-black text-black leading-tight uppercase italic">{client.name}</span>
                                                <span className="text-[10px] font-black text-black/30 uppercase tracking-[3px] mt-1.5 italic">ID: SS-{client._id.slice(-4).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-black/60 font-black text-[10px] uppercase tracking-wider italic">
                                                <Mail size={14} className="text-black/20" /> {client.email}
                                            </div>
                                            <div className="flex items-center gap-3 text-black/60 font-black text-[10px] uppercase tracking-wider italic">
                                                <Phone size={14} className="text-black/20" /> {client.phone || '+91 98765 43210'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex justify-center">
                                            <span className="px-4 py-1.5 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-[3px] italic shadow-3xl">
                                                {client.activePolicyCount || (idx % 4)} ACTIVE_PROTOCOL
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-extrabold text-black">₹{((idx + 1) * 45000 + (idx * 500)).toLocaleString()}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-tight mt-0.5 ${idx % 3 === 2 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                {idx % 3 === 2 ? 'Premium Overdue' : idx % 3 === 1 ? 'Monthly Installment' : 'Paid Annually'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${client.isVerified || idx % 4 !== 2 ? 'bg-emerald-500' : 'bg-black/20'}`} />
                                            <span className={`text-[12px] font-black uppercase tracking-wider ${client.isVerified || idx % 4 !== 2 ? 'text-emerald-500' : 'text-black/40'}`}>
                                                {client.isVerified || idx % 4 !== 2 ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="pl-4 pr-8 py-5 text-right">
                                        <button className="p-2 text-black/20 hover:text-black rounded-lg transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-auto px-8 py-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[12px] font-bold text-black/40">
                        Showing 1 to {filteredClients?.length || 10} of {clients?.length || 1248} customers
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-black/30 hover:text-black transition-colors">
                            <ChevronRight className="rotate-180" size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-black text-white font-bold text-[12px] shadow-md shadow-black/20">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-black/40 font-bold text-[12px] hover:bg-black/5 transition-colors">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-black/40 font-bold text-[12px] hover:bg-black/5 transition-colors">3</button>
                        <span className="text-black/20 px-1 font-bold">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-black/40 font-bold text-[12px] hover:bg-black/5 transition-colors">125</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-black/30 hover:text-black transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentClients;
