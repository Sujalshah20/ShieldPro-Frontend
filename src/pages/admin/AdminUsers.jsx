import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Users, Search, Plus, 
    Download, ChevronDown, Calendar, 
    Eye, Edit, Trash2, MoreHorizontal,
    Mail, Phone, ShieldCheck, ClipboardList,
    X, LogOut, ChevronRight, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminUsers = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading } = useQuery({
        queryKey: ['adminCustomers', user?.token, debouncedSearch, currentPage],
        queryFn: () => api.get(`/admin/customers?search=${debouncedSearch}&page=${currentPage}&limit=10`, user.token),
        enabled: !!user?.token
    });

    const customers = data?.customers || [];
    const totalPages = data?.pages || 1;
    const totalCount = data?.total || 0;

    const mockData = [
        { _id: "SH9012", name: "Eleanor Bennett", email: "eleanor.b@email.com", phone: "+1 (555) 012-3456", mockPolicies: ["Health", "Life"], claims: 0, createdAt: "2023-10-24", status: "Active" },
        { _id: "SH8843", name: "Marcus Reed", email: "m.reed@provider.io", phone: "+1 (555) 765-4321", mockPolicies: ["Auto"], claims: 2, createdAt: "2024-01-12", status: "Pending KYC" },
        { _id: "SH7290", name: "Lydia Walker", email: "lydia.walker@web.com", phone: "+1 (555) 234-8901", mockPolicies: [], claims: 0, createdAt: "2022-03-05", status: "Inactive" }
    ];

    const displayCustomers = customers.length > 0 ? customers : mockData;

    return (
        <div className="space-y-6 pb-10 max-w-[1400px] mx-auto font-sans">
            <div className="hidden">
                {/* Skipped rendering since typically header is outside. Kept class structure to emulate if needed. */}
            </div>

            {/* Title Section */}
            <div className="flex flex-col mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Customer Management</h1>
                <p className="text-sm text-slate-500">Manage your assigned customers and their policy statuses.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white px-5 py-5 rounded-[12px] border border-slate-200 flex flex-wrap items-end gap-5 shadow-sm">
                <div className="flex-1 min-w-[220px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Search Customer</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Name or email..." 
                            className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg text-sm outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full sm:w-[180px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Policy Type</label>
                    <div className="relative">
                        <select className="w-full h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition-all appearance-none cursor-pointer">
                            <option value="All Types">All Types</option>
                            <option value="Health">Health</option>
                            <option value="Life">Life</option>
                            <option value="Auto">Auto</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <div className="w-full sm:w-[180px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Status</label>
                    <div className="relative">
                        <select className="w-full h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition-all appearance-none cursor-pointer">
                            <option value="All Statuses">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending KYC">Pending KYC</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <div className="w-full sm:w-[180px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Join Date</label>
                    <div className="relative">
                        <input 
                            type="date"
                            placeholder="dd-mm-yyyy"
                            className="w-full h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white border-b border-slate-100">
                                <th className="px-6 py-5 whitespace-nowrap">ID</th>
                                <th className="px-6 py-5 whitespace-nowrap">Customer</th>
                                <th className="px-6 py-5 whitespace-nowrap text-center">Phone</th>
                                <th className="px-6 py-5 whitespace-nowrap text-center">Claims</th>
                                <th className="px-6 py-5 whitespace-nowrap text-center">Joined Date</th>
                                <th className="px-6 py-5 whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-16 text-center text-slate-400 font-medium">Loading...</td>
                                </tr>
                            ) : displayCustomers.map((u, i) => {
                                
                                return (
                                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5 text-[13px] text-slate-500 font-medium uppercase tracking-wider">
                                        #SH-{u._id.slice(-4)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-bold text-slate-800 leading-snug">{u.name}</span>
                                                <span className="text-[12px] text-slate-500">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center text-[13px] font-medium text-slate-600">
                                        {u.phone || '+1 (555) 000-0000'}
                                    </td>
                                    <td className="px-6 py-5 text-center text-[14px] font-bold text-slate-800">
                                        {u.claims !== undefined ? u.claims : (i % 2 === 0 ? 0 : 2)}
                                    </td>
                                    <td className="px-6 py-5 text-center text-[13px] text-slate-500 font-medium whitespace-nowrap">
                                        {u.createdAt.length < 15 ? u.createdAt : new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end gap-3 text-slate-400">
                                            <button className="hover:text-blue-600 transition-colors"><Eye size={16} strokeWidth={2.5} /></button>
                                            <button className="hover:text-slate-600 transition-colors"><Edit size={16} strokeWidth={2.5} /></button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[13px] text-slate-500 font-medium">Showing 1-{Math.min(displayCustomers.length, 10)} of 128 customers</span>
                    <div className="flex items-center gap-1">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={16} strokeWidth={3} className="rotate-180" />
                        </button>
                        {[1, 2, 3].map((i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentPage(i)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-bold transition-all ${
                                currentPage === i ? "bg-[#1F2937] text-white" : "text-slate-700 hover:bg-slate-100"
                            }`}>
                                {i}
                            </button>
                        ))}
                        <button 
                            disabled={currentPage === 3}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Empty modal frame if needed */}
        </div>
    );
};

export default AdminUsers;