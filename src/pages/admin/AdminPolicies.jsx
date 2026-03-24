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
                        <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] mb-2 italic">
                            <span>Admin</span>
                            <ChevronRight size={12} className="text-black opacity-20" />
                            <span className="text-black opacity-100">Asset Management</span>
                        </div>
                        <h1 className="text-2xl font-black text-black tracking-tighter italic uppercase">Policy Architect_</h1>
                        <p className="text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic leading-relaxed">Configure and deploy coverage protocols for the network // DATA_LAYER_01</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="h-12 px-8 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black/90 transition-all shadow-3xl active:scale-95 italic border-b-4 border-white/10 flex items-center gap-2"
                    >
                        <Plus size={18} strokeWidth={3} /> DEPLOY_NEW_POLICY
                    </button>
                </Reveal>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black opacity-20 group-focus-within:text-black group-focus-within:opacity-100 transition-all font-black" size={20} strokeWidth={3} />
                    <input 
                        type="text" 
                        placeholder="SEARCH_POLICY_MANIFEST_NODE..." 
                        className="w-full pl-14 pr-6 h-14 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:border-black/10 focus:ring-8 focus:ring-black/5 outline-none transition-all shadow-sm italic placeholder:text-black/10"
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
                        <button key={i} className="h-14 px-6 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-[3px] text-black hover:bg-slate-50 transition-all shadow-sm italic">
                            <span className="opacity-40">{f.label}</span> <f.icon size={16} className="text-black opacity-20" strokeWidth={3} />
                        </button>
                    ))}
                    <button className="h-14 w-14 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 text-black opacity-30 hover:opacity-100 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-95">
                        <Filter size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Tabs */}
                <div className="flex px-10 border-b border-slate-50 bg-slate-50/20">
                    {["All Policies", "Active", "Inactive", "Draft"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-6 text-[10px] font-black uppercase tracking-[4px] transition-all relative italic ${
                                activeTab === tab ? "text-black" : "text-black/20 hover:text-black"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTabPolicies" className="absolute bottom-0 left-0 right-0 h-1.5 bg-black rounded-t-full shadow-[0_0_10px_rgba(0,0,0,0.2)]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-black opacity-30 uppercase tracking-[3px] border-b border-slate-100 bg-slate-50/5 italic">
                                <th className="px-6 py-4">Identity_Tag</th>
                                <th className="px-6 py-4">Protocol_Name</th>
                                <th className="px-6 py-4">Category_Node</th>
                                <th className="px-6 py-4 text-right">Valuation_Range</th>
                                <th className="px-6 py-4 text-center">Lifecycle</th>
                                <th className="px-6 py-4 text-center">Nexus_Load</th>
                                <th className="px-6 py-4">Current_State</th>
                                <th className="px-6 py-4 text-right">Operations</th>
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
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-black/40 bg-slate-50 px-2.5 py-1 rounded border border-slate-100 uppercase italic">
                                                #POL-{p._id.slice(-5).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-black block max-w-[200px] leading-snug italic tracking-tighter uppercase">{p.policyName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-black opacity-20">{getTypeIcon(p.policyType)}</div>
                                                <span className="text-[10px] font-black uppercase tracking-[3px] text-black opacity-40 italic">{p.policyType}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs font-black text-slate-800 italic">{stats.range}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-[10px] font-bold text-slate-400 italic">{stats.duration}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-black text-black italic text-xs tracking-tighter uppercase leading-none opacity-80">
                                            {stats.customers}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border italic ${getStatusStyle(stats.status)}`}>
                                                <div className={`w-1 h-1 rounded-full ${stats.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_bg-emerald-500]' : 'bg-slate-400'}`} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{stats.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-2 bg-white border border-slate-100 text-black opacity-30 hover:opacity-100 hover:text-blue-600 rounded-lg shadow-sm hover:scale-110 transition-all font-black">
                                                    <Edit size={14} strokeWidth={3} />
                                                </button>
                                                <button className="p-2 bg-white border border-slate-100 text-black opacity-30 hover:opacity-100 hover:text-blue-600 rounded-lg shadow-sm hover:scale-110 transition-all font-black">
                                                    <Eye size={14} strokeWidth={3} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteMutation.mutate(p._id)}
                                                    className="p-2 bg-white border border-slate-100 text-black opacity-30 hover:opacity-100 hover:text-rose-600 rounded-lg shadow-sm hover:scale-110 transition-all font-black"
                                                >
                                                    <Trash2 size={14} strokeWidth={3} />
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
                        <button className="h-11 px-5 border-2 border-slate-100 rounded-xl text-[11px] font-black text-black opacity-30 hover:opacity-100 hover:bg-white hover:text-blue-600 transition-all italic uppercase tracking-widest">Previous</button>
                        {[1, 2, 3].map(page => (
                            <button key={page} className={`w-11 h-11 flex items-center justify-center rounded-xl text-[11px] font-black transition-all italic ${
                                page === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-black opacity-20 hover:opacity-100 hover:bg-white"
                            }`}>
                                {page}
                            </button>
                        ))}
                        <button className="h-11 px-6 bg-[#1e293b] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all italic active:scale-95">Next Cluster</button>
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
                                    <h2 className="text-3xl font-black text-black tracking-tight italic leading-tight uppercase">Define Coverage Node</h2>
                                    <p className="text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">Asset Configuration Protocol v4.2 // MASTER_ARCHITECT</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-black opacity-20 hover:opacity-100 hover:text-rose-500 hover:scale-110 transition-all shadow-sm">
                                    <X size={24} strokeWidth={3} />
                                </button>
                            </div>
                            <form 
                                className="p-12 space-y-8"
                                onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newPolicy); }}
                            >
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] pl-1 h-4 italic">Protocol Identifier</label>
                                            <input 
                                                className="w-full h-15 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[13px] font-black uppercase italic outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner tracking-tight"
                                                placeholder="e.g. Aegis Health Standard"
                                                value={newPolicy.policyName}
                                                onChange={e => setNewPolicy({...newPolicy, policyName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] pl-1 h-4 italic">Categorization Node</label>
                                            <div className="relative">
                                                <select 
                                                    className="w-full h-15 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[13px] font-black uppercase italic outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer shadow-inner tracking-tight"
                                                    value={newPolicy.policyType}
                                                    onChange={e => setNewPolicy({...newPolicy, policyType: e.target.value})}
                                                >
                                                    <option>Health</option>
                                                    <option>Life</option>
                                                    <option>Auto</option>
                                                    <option>Home</option>
                                                </select>
                                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-black opacity-20 pointer-events-none" size={18} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] pl-1 h-4 italic">Coverage Scope Matrix</label>
                                        <textarea 
                                            className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-[13px] font-black uppercase italic outline-none focus:bg-white focus:border-blue-500 transition-all resize-none shadow-inner tracking-tight"
                                            placeholder="Detailed parameters of policy coverage..."
                                            value={newPolicy.description}
                                            onChange={e => setNewPolicy({...newPolicy, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] pl-1 h-4 italic">Base Premium (₹)</label>
                                            <input 
                                                type="number"
                                                className="w-full h-15 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[13px] font-black uppercase italic outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner tracking-tight"
                                                placeholder="999"
                                                value={newPolicy.premiumAmount}
                                                onChange={e => setNewPolicy({...newPolicy, premiumAmount: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] pl-1 h-4 italic">Coverage Ceiling (₹)</label>
                                            <input 
                                                type="number"
                                                className="w-full h-15 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[13px] font-black uppercase italic outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner tracking-tight"
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
                                        className="flex-1 h-16 bg-white border-2 border-slate-100 text-black opacity-30 hover:opacity-100 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all italic active:scale-95"
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