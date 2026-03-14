import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Filter, Shield, Activity, Truck, 
    Home, FileText, Star, ArrowUpRight, Plus, 
    X, Globe, Zap, ShieldCheck, TrendingUp,
    Layout, Briefcase, ClipboardList, PieChart,
    ChevronDown, Layers, Command, Award, Eye, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../hooks/use-toast";

const AdminPolicies = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        policyName: "",
        policyType: "Health",
        premiumAmount: "",
        coverageAmount: "",
        durationYears: "",
        description: ""
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
            toast({ title: "PROTOCOL_CATALOGED", description: "New insurance protocol successfully added." });
            setIsAdding(false);
            setFormData({ policyName: "", policyType: "Health", premiumAmount: "", coverageAmount: "", durationYears: "", description: "" });
        },
        onError: (err) => {
            toast({
                title: "DEPLOYMENT_FAILED",
                description: err?.errors?.[0]?.message || err?.message || "Failed to deploy policy protocol.",
                variant: "destructive"
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/policies/${id}`, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "PROTOCOL_DECOMMISSIONED", description: "Policy has been removed from the registry." });
        },
        onError: (err) => {
            toast({
                title: "PROCESS_FAILED",
                description: err?.message || "Failed to remove policy.",
                variant: "destructive"
            });
        }
    });

    const getPolicyIcon = (type) => {
        switch(type) {
            case 'Health': return <Activity size={24} />;
            case 'Vehicle': case 'Auto': return <Truck size={24} />;
            case 'Property': case 'Home': return <Home size={24} />;
            case 'Life': return <Shield size={24} />;
            case 'Travel': return <Globe size={24} />;
            default: return <FileText size={24} />;
        }
    };

    const filteredPolicies = policies?.filter((policy) => {
        const matchesSearch = policy.policyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || policy.policyType === filterType;
        return matchesSearch && matchesType;
    });

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
            <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse" />
                ))}
            </div>
        </div>
    );

    return (
        <div className="admin-policies p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Header Area */}
            <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Insurance Protocols</h1>
                    <p className="text-sm text-slate-500 font-medium">Strategic insurance asset management and coverage distribution.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Identify Protection Plan..."
                            className="w-full pl-10 pr-4 h-12 bg-white border-slate-200 rounded-xl outline-none focus:border-[#0082a1] transition-all font-bold text-xs text-[#012b3f] shadow-sm uppercase tracking-widest placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="h-12 px-6 bg-[#012b3f] text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-lg shadow-[#012b3f]/20 hover:bg-[#0082a1] transition-all active:scale-95 group whitespace-nowrap"
                    >
                        <Plus size={18} /> Deploy New Protocol
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-8 flex flex-wrap gap-2">
                {["All", "Health", "Vehicle", "Home", "Life", "Travel"].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            filterType === type 
                            ? 'bg-[#0082a1] text-white shadow-lg shadow-[#0082a1]/20' 
                            : 'bg-white text-slate-400 hover:text-[#012b3f] border border-slate-100 shadow-sm'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Matrix Console */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPolicies?.map((policy, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={policy._id} 
                        className="bg-white rounded-[2.5rem] border border-slate-100 hover:border-[#0082a1]/30 transition-all group overflow-hidden shadow-xl"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-10">
                                <div className="w-16 h-16 bg-[#dae5e5] rounded-2xl flex items-center justify-center text-[#012b3f] shadow-inner">
                                    {getPolicyIcon(policy.policyType)}
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1 px-3 py-1 bg-slate-50 rounded-lg">ID: {policy._id.slice(-6).toUpperCase()}</span>
                                    <div className="flex justify-end gap-1 px-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0082a1] animate-pulse" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-[#012b3f] mb-4 group-hover:text-[#0082a1] transition-colors leading-tight uppercase tracking-tight">
                                {policy.policyName}
                            </h2>
                            <p className="text-xs font-bold text-slate-400 mb-8 line-clamp-2 uppercase tracking-wider leading-relaxed pr-4">
                                {policy.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Annual Yield</span>
                                    <span className="text-xl font-black text-[#012b3f]">₹{policy.premiumAmount.toLocaleString()}</span>
                                </div>
                                <div className="p-5 bg-[#0082a1]/5 rounded-2xl border border-[#0082a1]/10">
                                    <span className="text-[9px] font-black text-[#0082a1] uppercase tracking-widest block mb-2">Coverage</span>
                                    <span className="text-xl font-black text-[#012b3f]">₹{(policy.coverageAmount / 100000).toFixed(1)}L</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link to={`/admin/policies/${policy._id}`} className="flex-1">
                                    <button className="w-full h-14 bg-[#012b3f] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0082a1] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95">
                                        View Logs <ArrowUpRight size={16} />
                                    </button>
                                </Link>
                                <button 
                                    onClick={() => deleteMutation.mutate(policy._id)}
                                    className="w-14 h-14 bg-white border border-slate-200 text-slate-300 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95 shadow-sm"
                                    title="Decommission Protocol"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Zero State */}
            {filteredPolicies?.length === 0 && (
                <div className="text-center py-40 bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem] mt-10">
                    <Command size={48} className="mx-auto mb-6 opacity-10 text-[#012b3f]" />
                    <h3 className="text-2xl font-black text-[#012b3f] opacity-20 uppercase tracking-widest">No Records Identified</h3>
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-[#012b3f]/90 backdrop-blur-md" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-14 h-14 bg-[#012b3f] rounded-2xl flex items-center justify-center text-white shadow-xl">
                                    <ClipboardList size={28} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-[#012b3f] uppercase tracking-tighter">Deploy Protocol</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configure new insurance parameters.</p>
                                </div>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Protocol Name</label>
                                        <input 
                                            placeholder="e.g. Shield Pro Max"
                                            className="w-full h-14 bg-slate-50 border-slate-100 rounded-xl px-6 font-bold text-xs uppercase text-[#012b3f] outline-none focus:border-[#0082a1] transition-all"
                                            value={formData.policyName}
                                            onChange={e => setFormData({...formData, policyName: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Classification</label>
                                        <select 
                                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-6 font-bold text-xs uppercase text-[#012b3f] outline-none focus:border-[#0082a1] transition-all cursor-pointer"
                                            value={formData.policyType}
                                            onChange={e => setFormData({...formData, policyType: e.target.value})}
                                        >
                                            {["Life", "Health", "Vehicle", "Home", "Travel", "Auto", "Property"].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Annual Premium</label>
                                        <input 
                                            className="w-full h-14 bg-slate-50 border-slate-100 rounded-xl px-6 font-black text-lg text-[#012b3f] outline-none focus:border-[#0082a1] transition-all"
                                            type="number"
                                            value={formData.premiumAmount}
                                            onChange={e => setFormData({...formData, premiumAmount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Coverage Cap</label>
                                        <input 
                                            className="w-full h-14 bg-slate-50 border-slate-100 rounded-xl px-6 font-black text-lg text-[#012b3f] outline-none focus:border-[#0082a1] transition-all"
                                            type="number"
                                            value={formData.coverageAmount}
                                            onChange={e => setFormData({...formData, coverageAmount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Cycle (Yrs)</label>
                                        <input 
                                            className="w-full h-14 bg-slate-50 border-slate-100 rounded-xl px-6 font-black text-lg text-[#012b3f] text-center outline-none focus:border-[#0082a1] transition-all"
                                            type="number"
                                            value={formData.durationYears}
                                            onChange={e => setFormData({...formData, durationYears: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0082a1] ml-2">Protocol Specifications</label>
                                    <textarea 
                                        placeholder="Detailed specification of the insurance coverage..."
                                        className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-6 outline-none focus:border-[#0082a1] transition-all font-bold text-xs uppercase"
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 h-14 bg-slate-100 text-[#012b3f] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={createMutation.isLoading}
                                        className="flex-[2] h-14 bg-[#012b3f] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-[#0082a1] transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {createMutation.isLoading ? "Deploying..." : "Authorize Protocol"}
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