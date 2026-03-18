import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Plus, Edit, Trash2, 
    ChevronDown, Eye, CheckCircle2, 
    Play, X, Layout, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminPolicies = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All Policies");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPolicy, setNewPolicy] = useState({
        policyName: "",
        policyType: "Health",
        description: "",
        premiumAmount: "",
        coverageAmount: "",
        duration: "12 Months"
    });

    const { data: policies, isLoading } = useQuery({
        queryKey: ['adminPolicies', user?.token],
        queryFn: () => api.get('/policies', user.token),
        enabled: !!user?.token
    });

    const createMutation = useMutation({
        mutationFn: (data) => api.post('/policies', data, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "Policy created successfully" });
            setIsModalOpen(false);
            setNewPolicy({ policyName: "", policyType: "Health", description: "", premiumAmount: "", coverageAmount: "", duration: "12 Months" });
        },
        onError: () => toast({ title: "Failed to create policy", variant: "destructive" })
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/policies/${id}`, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "Policy deleted successfully" });
        }
    });

    const mockStats = {
        Health: { range: "$120 - $450/mo", duration: "12 Months", customers: "1,248", status: "Active" },
        Life: { range: "$200 - $1,200/mo", duration: "Term (20y)", customers: "854", status: "Active" },
        Auto: { range: "$45 - $150/mo", duration: "6 Months", customers: "0", status: "Draft" },
        Home: { range: "$80 - $220/mo", duration: "12 Months", customers: "321", status: "Inactive" }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700';
            case 'Draft': return 'bg-slate-100 text-slate-600';
            case 'Inactive': return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusDot = (status) => {
        switch(status) {
            case 'Active': return 'bg-emerald-500';
            case 'Draft': return 'bg-slate-400';
            case 'Inactive': return 'bg-rose-500';
            default: return 'bg-slate-400';
        }
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'Health': return 'bg-blue-50 text-blue-600';
            case 'Life': return 'bg-purple-50 text-purple-600';
            case 'Auto': return 'bg-orange-50 text-orange-600';
            case 'Home': return 'bg-teal-50 text-teal-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex justify-between items-start">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Policy Management</h1>
                        <p className="text-sm font-medium text-slate-400">Create, edit, and oversee all insurance policy configurations.</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#1e40af] transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} /> Create New Policy
                    </button>
                </Reveal>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by policy ID or name..." 
                        className="w-full pl-12 pr-4 h-12 bg-slate-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { label: "Policy Type", icon: ChevronDown },
                        { label: "Status", icon: ChevronDown },
                        { label: "Price Range", icon: ChevronDown }
                    ].map((filter, i) => (
                        <button key={i} className="h-12 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl flex items-center gap-6 transition-all border border-transparent">
                            {filter.label} <filter.icon size={16} className="text-slate-400" />
                        </button>
                    ))}
                    <button 
                        className="text-blue-600 text-sm font-bold px-4 hover:underline"
                        onClick={() => setSearchTerm("")}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Tabs */}
                <div className="flex px-8 border-b border-slate-50">
                    {["All Policies", "Active", "Inactive", "Draft"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-6 text-sm font-bold transition-all relative ${
                                activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">Policy ID</th>
                                <th className="px-8 py-6">Name</th>
                                <th className="px-8 py-6">Type</th>
                                <th className="px-8 py-6">Premium Range</th>
                                <th className="px-8 py-6">Duration</th>
                                <th className="px-8 py-6">Customers</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="8" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Policy Manifest...</td></tr>
                            ) : policies?.filter(p => activeTab === 'All Policies' || mockStats[p.policyType]?.status === activeTab).map((p, i) => {
                                const stats = mockStats[p.policyType] || mockStats.Health;
                                return (
                                    <tr key={p._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                            POL-{p._id.slice(-4).toUpperCase()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-slate-700 block max-w-[180px] leading-snug">{p.policyName}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${getTypeColor(p.policyType)}`}>
                                                {p.policyType}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-slate-700">
                                            {stats.range}
                                        </td>
                                        <td className="px-8 py-6 text-xs font-medium text-slate-500">
                                            {stats.duration}
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-slate-700">
                                            {stats.customers}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full w-fit ${getStatusColor(stats.status)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(stats.status)}`} />
                                                <span className="text-[10px] font-bold">{stats.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteMutation.mutate(p._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Showing {policies?.length || 0} of 24 policies</span>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-300 hover:text-slate-600 disabled:opacity-30" disabled>
                            <ChevronDown size={18} className="rotate-90" />
                        </button>
                        {[1, 2, 3].map(page => (
                            <button key={page} className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                                page === 1 ? "bg-[#1e3a8a] text-white shadow-md shadow-blue-900/10" : "text-slate-500 hover:bg-white"
                            }`}>
                                {page}
                            </button>
                        ))}
                        <button className="p-2 text-slate-300 hover:text-slate-600">
                            <ChevronDown size={18} className="-rotate-90" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Support Center Link */}
            <div className="flex justify-center pt-10">
                <button className="flex items-center gap-3 text-slate-300 hover:text-slate-500 transition-colors">
                    <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center">
                        <Layout size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Support Center</span>
                </button>
            </div>

            {/* Create Modal (Minimalist) */}
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
                                <h2 className="text-xl font-bold text-slate-800">Create New Policy</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form 
                                className="p-8 space-y-6"
                                onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newPolicy); }}
                            >
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500">Policy Name</label>
                                            <input 
                                                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-all"
                                                placeholder="e.g. Health Saver Plus"
                                                value={newPolicy.policyName}
                                                onChange={e => setNewPolicy({...newPolicy, policyName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500">Policy Type</label>
                                            <select 
                                                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-all font-semibold"
                                                value={newPolicy.policyType}
                                                onChange={e => setNewPolicy({...newPolicy, policyType: e.target.value})}
                                            >
                                                <option>Health</option>
                                                <option>Life</option>
                                                <option>Vehicle</option>
                                                <option>Home</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500">Description</label>
                                        <textarea 
                                            className="w-full h-24 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all resize-none"
                                            placeholder="Policy coverage and benefits..."
                                            value={newPolicy.description}
                                            onChange={e => setNewPolicy({...newPolicy, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500">Premium Amount</label>
                                            <input 
                                                type="number"
                                                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-all"
                                                placeholder="999"
                                                value={newPolicy.premiumAmount}
                                                onChange={e => setNewPolicy({...newPolicy, premiumAmount: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500">Coverage Limit</label>
                                            <input 
                                                type="number"
                                                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-all"
                                                placeholder="1000000"
                                                value={newPolicy.coverageAmount}
                                                onChange={e => setNewPolicy({...newPolicy, coverageAmount: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="w-full h-14 bg-[#1e3a8a] text-white rounded-xl font-bold text-sm hover:bg-[#1e40af] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        {createMutation.isPending ? "Creating..." : "Create Policy"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPolicies;