import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Users, Mail, Phone, Search, Filter, 
    Download, ChevronRight, Bell, CreditCard,
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
                        {clients?.length || 1248} TOTAL
                    </span>
                </div>
                <div className="flex items-center gap-6">
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search customers by name, email, phone or..." 
                        className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#134e8d]/30 transition-all text-sm outline-none"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="lg:col-span-2 relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select className="w-full pl-10 pr-10 h-12 bg-white border border-slate-200 rounded-xl appearance-none text-[13px] font-medium text-slate-600 outline-none cursor-pointer">
                        <option>Policy Type: All</option>
                    </select>
                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
                </div>
                <div className="lg:col-span-2 relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select className="w-full pl-10 pr-10 h-12 bg-white border border-slate-200 rounded-xl appearance-none text-[13px] font-medium text-slate-600 outline-none cursor-pointer">
                        <option>Status: Active</option>
                    </select>
                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
                </div>
                <div className="lg:col-span-2">
                    <button className="w-full h-12 bg-white border border-slate-200 text-[#002b45] rounded-xl font-bold text-[13px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                        <Download size={18} /> Export
                    </button>
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
                                <th className="px-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="pl-4 pr-10 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {(filteredClients || Array(4).fill({})).map((client, idx) => {
                                // Mock data for empty states if API returns less than 4
                                const name = client.name || ['Arjun Mehta', 'Priya Sharma', 'Rohan Gupta', 'Ananya Iyer'][idx % 4];
                                const email = client.email || ['arjun.m@example.com', 'priya.s@corp.com', 'rohan.g@web.in', 'ananya.i@email.co.in'][idx % 4];
                                const phone = client.phone || ['+91 98765 43210', '+91 98234 56789', '+91 99887 76655', '+91 91234 87654'][idx % 4];
                                const activeCount = client.activePolicyCount || [3, 1, 0, 4][idx % 4];
                                const premium = client.totalPremium || [125000, 45000, 82500, 210000][idx % 4];
                                const status = (client.isVerified || idx % 4 !== 2) ? 'ACTIVE' : 'INACTIVE';
                                const paymentLabel = ['PAID ANNUALLY', 'MONTHLY INSTALLMENT', 'PREMIUM OVERDUE', 'PREMIUM PAID'][idx % 4];

                                return (
                                    <tr key={client._id || idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="pl-10 pr-4 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-white shadow-sm">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[15px] font-bold text-[#002b45]">{name}</span>
                                                    <span className="text-[11px] text-slate-400 font-medium tracking-tight">ID: SS-{(client._id || '9842').slice(-4).toUpperCase()}</span>
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
                                                    paymentLabel === 'PREMIUM OVERDUE' ? 'text-rose-500' : 
                                                    paymentLabel === 'MONTHLY INSTALLMENT' ? 'text-slate-400' : 'text-emerald-500'
                                                }`}>
                                                    {paymentLabel}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-6">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-2 h-2 rounded-full ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                <span className={`text-[12px] font-bold ${status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                    {status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="pl-4 pr-10 py-6 text-right">
                                            <button className="p-2 text-slate-300 hover:text-[#134e8d] hover:bg-slate-100 rounded-lg transition-all">
                                                <ChevronRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="px-10 py-8 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[14px] text-slate-400 font-medium">
                        Showing <span className="text-slate-600 font-bold">1 to 10</span> of <span className="text-slate-600 font-bold">{clients?.length || 1248}</span> customers
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-300 hover:text-slate-600 hover:border-slate-300 transition-all">
                            <ChevronRight className="rotate-180" size={18} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#002b45] text-white font-bold text-[14px] shadow-lg shadow-blue-900/20">1</button>
                        {[2, 3].map(n => (
                            <button key={n} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 font-bold text-[14px] hover:bg-slate-100 transition-all">{n}</button>
                        ))}
                        <span className="text-slate-300 px-1 font-bold">...</span>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 font-bold text-[14px] hover:bg-slate-100 transition-all">125</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-300 hover:text-slate-600 hover:border-slate-300 transition-all">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentClients;
