import React, { useState, useEffect } from "react";
import { 
    Users, Search, Filter, Plus, 
    MoreHorizontal, Mail, Phone, 
    Calendar, Shield, ChevronRight,
    ArrowUpRight, FileText, AlertCircle,
    CheckCircle2, XCircle, Clock,
    Download, UserPlus, ShieldCheck,
    MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import api from "../../utils/api";

const AdminUsers = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/admin/customers', user.token);
            setCustomers(response.data);
        } catch (error) {
            toast({ title: "Error fetching customers", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { label: "Total Customers", value: customers.length, icon: Users, color: "blue" },
        { label: "Active Policies", value: "1,245", icon: ShieldCheck, color: "emerald" },
        { label: "Pending Claims", value: "24", icon: AlertCircle, color: "rose" },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manage Customers</h1>
                        <p className="text-slate-500 font-medium">View and manage your platform's customer base.</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <div className="flex items-center gap-3">
                        <button className="h-11 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-all">
                            <Download size={18} /> Export
                        </button>
                        <button className="h-11 px-6 bg-blue-600 text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                            <Plus size={18} /> Add Customer
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400`}>
                                <s.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{s.label}</p>
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
                        placeholder="Search customers by name, ID or email..." 
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none h-11 px-4 flex items-center justify-center gap-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-5">ID</th>
                                <th className="px-6 py-5">Customer</th>
                                <th className="px-6 py-5">Contact Details</th>
                                <th className="px-6 py-5 text-center">Policies</th>
                                <th className="px-6 py-5 text-center">Claims</th>
                                <th className="px-6 py-5">Joined Date</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                                            <p className="text-sm font-bold text-slate-400 animate-pulse">SYNCHRONIZING RECORDS...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-20 text-center text-slate-400 font-bold">NO CUSTOMERS FOUND</td>
                                </tr>
                            ) : (
                                customers.filter(c => 
                                    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((customer, idx) => (
                                    <tr key={customer._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-500">CUST-{customer._id?.slice(-4).toUpperCase() || '00' + (idx + 1)}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-100/50 shadow-sm">
                                                    {customer.name?.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700">{customer.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Member</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-2"><Mail size={12} className="text-slate-300" /> {customer.email}</span>
                                                <span className="flex items-center gap-2 font-medium text-slate-400"><Phone size={12} className="text-slate-300" /> +91 98765-43210</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                             <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-100">
                                                {customer.policies?.length || 1}
                                             </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                             <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 font-bold text-xs border border-orange-100">
                                                0
                                             </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-500">{new Date(customer.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-emerald-50 text-emerald-600`}>
                                                <CheckCircle2 size={12} />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Profile">
                                                    <ChevronRight size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {customers.length} records</p>
                    <div className="flex gap-2">
                         <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                         <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;