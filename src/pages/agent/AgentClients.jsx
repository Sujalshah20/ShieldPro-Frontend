import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Users, Mail, Phone, Search, 
    ChevronRight, Bell, 
    CheckCircle2, Clock, XCircle
} from "lucide-react";
import { motion } from "framer-motion";

const AgentClients = () => {
    const { user } = useContext(AuthContext);
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
        <div className="py-6 space-y-8 font-sans">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-[#002b45]">Customer Database</h1>
                    <span className="px-3 py-1 bg-slate-100 text-[#134e8d] text-[11px] font-bold rounded-full uppercase tracking-widest">
                        {clients?.length || 0} TOTAL
                    </span>
                </div>
                <div className="flex items-center gap-6">
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search customers by name, email, phone or..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#134e8d]/30 transition-all text-sm outline-none"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="pl-10 pr-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer Name</th>
                                <th className="px-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</th>
                                <th className="px-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Policies</th>
                                <th className="px-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Premium (₹)</th>
                                <th className="px-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredClients && filteredClients.length > 0 ? (
                                filteredClients.map((client, idx) => {
                                    const name = client.name;
                                    const email = client.email;
                                    const phone = client.phone || 'N/A';
                                    const activeCount = client.activePolicyCount || 0;
                                    const premium = client.totalPremium || 0;
                                    const status = client.status?.toUpperCase() || 'INACTIVE';
                                    const paymentLabel = client.paymentStatus || 'NO PAYMENTS';

                                    return (
                                        <tr key={client._id || idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="pl-10 pr-4 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-white shadow-sm">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[15px] font-bold text-[#002b45]">{name}</span>
                                                        <span className="text-[11px] text-slate-400 font-medium tracking-tight">ID: SS-{(client._id || '0000').slice(-4).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2.5 text-slate-500 text-[13px] font-medium">
                                                        <Mail size={14} className="text-slate-300" /> {email}
                                                    </div>
                                                    <div className="flex items-center gap-2.5 text-slate-500 text-[13px] font-medium">
                                                        <Phone size={14} className="text-slate-300" /> {phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6">
                                                <span className="px-4 py-1.5 bg-slate-100 text-[#134e8d] rounded-full text-[12px] font-bold">
                                                    {activeCount} active
                                                </span>
                                            </td>
                                            <td className="px-4 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[16px] font-bold text-[#002b45]">₹{premium.toLocaleString()}</span>
                                                    <span className={`text-[10px] font-bold mt-1 ${
                                                        paymentLabel === 'OVERDUE' ? 'text-rose-500' : 
                                                        paymentLabel === 'PENDING' ? 'text-slate-400' : 'text-emerald-500'
                                                    }`}>
                                                        {paymentLabel}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    <div className={`w-2 h-2 rounded-full ${status === 'ACTIVE' || status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                    <span className={`text-[12px] font-bold ${status === 'ACTIVE' || status === 'VERIFIED' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        {status}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Users size={48} className="mb-4 opacity-20" />
                                            <p className="text-lg font-bold">No customers found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="px-10 py-8 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[14px] text-slate-400 font-medium">
                        Showing <span className="text-slate-600 font-bold">{filteredClients?.length > 0 ? 1 : 0} to {filteredClients?.length || 0}</span> of <span className="text-slate-600 font-bold">{clients?.length || 0}</span> customers
                    </p>
                    {clients?.length > 0 && (
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-300 hover:text-slate-600 hover:border-slate-300 transition-all">
                                <ChevronRight className="rotate-180" size={18} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#002b45] text-white font-bold text-[14px] shadow-lg shadow-blue-900/20">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-300 hover:text-slate-600 hover:border-slate-300 transition-all">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentClients;
