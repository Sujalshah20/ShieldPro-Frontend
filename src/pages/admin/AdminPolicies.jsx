import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Plus, Edit, Trash2, 
    ChevronDown, Eye, CheckCircle2, 
    Play, X, Layout, Filter, ChevronRight,
    Briefcase, Shield, Zap, Target
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
        Health: { range: "₹8,500 - ₹45,000", duration: "12 Months", customers: "1,248", status: "Active" },
        Life: { range: "₹15,000 - ₹1,20,000", duration: "Term (20y)", customers: "854", status: "Active" },
        Auto: { range: "₹4,500 - ₹15,000", duration: "6 Months", customers: "0", status: "Draft" },
        Home: { range: "₹8,000 - ₹22,000", duration: "12 Months", customers: "321", status: "Inactive" }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Draft': return 'bg-slate-50 text-slate-500 border-slate-200';
            case 'Inactive': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-200';
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'Health': return <Shield size={14} />;
            case 'Life': return <Target size={14} />;
            case 'Auto': return <Zap size={14} />;
            default: return <Briefcase size={14} />;
        }
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
                            <span className="text-blue-500">Asset Management</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">Policy Architect</h1>
                        <p className="text-sm font-medium text-slate-400">Configure and deploy coverage protocols for the network</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="h-12 px-8 bg-[#1e293b] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0f172a] transition-all shadow-xl shadow-slate-900/10 active:scale-95 italic border-b-4 border-black/20 flex items-center gap-2"
                    >
                        <Plus size={18} /> Deploy New Policy
                    </button>
                </Reveal>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search Policy Manifest by Identity or Type Node..." 
                        className="w-full pl-14 pr-6 h-14 bg-white border border-slate-100 rounded-[1.5rem] text-xs font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    {[
                        { label: "Category", icon: ChevronDown },
                        { label: "State", icon: ChevronDown },
                        { label: "Valuation", icon: ChevronDown }
                    ].map((f, i) => (
                        <button key={i} className="h-14 px-6 bg-white border border-slate-100 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-8 hover:bg-slate-50 transition-all shadow-sm italic">
                            {f.label} <f.icon size={16} className="text-slate-400" />
                        </button>
                    ))}
                    <button className="h-14 w-14 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[1.5rem] flex items-center justify-center transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Tabs */}
                <div className="flex px-10 border-b border-slate-50 bg-slate-50/20">
                    {["All Policies", "Active", "Inactive", "Draft"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-6 text-xs font-black uppercase tracking-widest transition-all relative italic ${
                                activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTabPolicies" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-50 bg-slate-50/5">
                                <th className="px-10 py-6">Identity_Tag</th>
                                <th className="px-10 py-6">Protocol_Name</th>
                                <th className="px-10 py-6">Category_Node</th>
                                <th className="px-10 py-6 text-right">Valuation_Range</th>
                                <th className="px-10 py-6 text-center">Lifecycle</th>
                                <th className="px-10 py-6 text-center">Nexus_Load</th>
                                <th className="px-10 py-6">Current_State</th>
                                <th className="px-10 py-6 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-10 py-32 text-center pointer-events-none">
                                        <div className="flex flex-col items-center gap-4 animate-pulse">
                                            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                                            <span className="text-xs font-black text-slate-300 uppercase tracking-[5px] italic">Retrieving Asset Manifest...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : policies?.filter(p => activeTab === 'All Policies' || mockStats[p.policyType]?.status === activeTab).map((p, i) => {
                                const stats = mockStats[p.policyType] || mockStats.Health;
                                return (
                                    <tr key={p._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6">
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-100 uppercase italic">
                                                #POL-{p._id.slice(-5).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-sm font-black text-slate-800 block max-w-[200px] leading-snug italic tracking-tight">{p.policyName}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="text-slate-400">{getTypeIcon(p.policyType)}</div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">{p.policyType}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <span className="text-sm font-black text-slate-800 italic">{stats.range}</span>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className="text-[11px] font-bold text-slate-400 italic">{stats.duration}</span>
                                        </td>
                                        <td className="px-10 py-6 text-center font-black text-slate-800 italic">
                                            {stats.customers}
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border italic ${getStatusStyle(stats.status)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${stats.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_bg-emerald-500]' : 'bg-slate-400'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{stats.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-xl shadow-sm hover:scale-110 transition-all">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-xl shadow-sm hover:scale-110 transition-all">
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteMutation.mutate(p._id)}
                                                    className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 rounded-xl shadow-sm hover:scale-110 transition-all"
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
                <div className="px-10 py-8 bg-slate-50/20 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] italic">Displaying {policies?.length || 0} of 24 active protocols</span>
                    <div className="flex items-center gap-3">
                        <button className="h-11 px-5 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:bg-white hover:text-blue-600 transition-all italic">Previous</button>
                        {[1, 2, 3].map(page => (
                            <button key={page} className={`w-11 h-11 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                                page === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-400 hover:bg-white"
                            }`}>
                                {page}
                            </button>
                        ))}
                        <button className="h-11 px-5 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-black transition-all italic">Next Cluster</button>
                    </div>
                </div>
            </div>

            {/* Support Center Link */}
            <div className="flex justify-center pt-10">
                <button className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-all group">
                    <div className="w-10 h-10 rounded-2xl border border-slate-100 flex items-center justify-center group-hover:border-blue-200 shadow-sm transition-all">
                        <Layout size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[3px]">Protocol Support Node</span>
                </button>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-lg">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white rounded-[3.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100"
                        >
                            <div className="pt-12 px-12 pb-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight italic leading-tight">Define Coverage Node</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Asset Configuration Protocol v4.2</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 transition-all shadow-sm">
                                    <X size={24} />
                                </button>
                            </div>
                            <form 
                                className="p-12 space-y-8"
                                onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newPolicy); }}
                            >
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] pl-1">Protocol Identifier</label>
                                            <input 
                                                className="w-full h-15 bg-slate-50 border border-slate-100 rounded-[1.25rem] px-6 text-sm font-bold italic outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
                                                placeholder="e.g. Aegis Health Standard"
                                                value={newPolicy.policyName}
                                                onChange={e => setNewPolicy({...newPolicy, policyName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] pl-1">Categorization Node</label>
                                            <div className="relative">
                                                <select 
                                                    className="w-full h-15 bg-slate-50 border border-slate-100 rounded-[1.25rem] px-6 text-sm font-bold italic outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer shadow-inner"
                                                    value={newPolicy.policyType}
                                                    onChange={e => setNewPolicy({...newPolicy, policyType: e.target.value})}
                                                >
                                                    <option>Health</option>
                                                    <option>Life</option>
                                                    <option>Auto</option>
                                                    <option>Home</option>
                                                </select>
                                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] pl-1">Coverage Scope Matrix</label>
                                        <textarea 
                                            className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[1.25rem] px-6 py-5 text-sm font-bold italic outline-none focus:bg-white focus:border-blue-500 transition-all resize-none shadow-inner"
                                            placeholder="Detailed parameters of policy coverage..."
                                            value={newPolicy.description}
                                            onChange={e => setNewPolicy({...newPolicy, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] pl-1">Base Premium (₹)</label>
                                            <input 
                                                type="number"
                                                className="w-full h-15 bg-slate-50 border border-slate-100 rounded-[1.25rem] px-6 text-sm font-bold italic outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                                                placeholder="999"
                                                value={newPolicy.premiumAmount}
                                                onChange={e => setNewPolicy({...newPolicy, premiumAmount: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] pl-1">Coverage Ceiling (₹)</label>
                                            <input 
                                                type="number"
                                                className="w-full h-15 bg-slate-50 border border-slate-100 rounded-[1.25rem] px-6 text-sm font-bold italic outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                                                placeholder="10,00,000"
                                                value={newPolicy.coverageAmount}
                                                onChange={e => setNewPolicy({...newPolicy, coverageAmount: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 flex gap-6">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 h-16 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all italic"
                                    >
                                        Abort
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="flex-[2] h-16 bg-[#1e293b] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0f172a] transition-all shadow-2xl shadow-slate-900/30 active:scale-95 disabled:opacity-50 italic border-b-4 border-black/20"
                                    >
                                        {createMutation.isPending ? "Syncing..." : "Execute Deployment"}
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