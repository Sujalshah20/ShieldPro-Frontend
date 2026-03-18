import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import { 
    Search, Filter, Shield, Activity, Truck, 
    Home, FileText, Star, ArrowUpRight, Plus, 
    X, Globe, Zap, ShieldCheck, TrendingUp,
    Layout, Briefcase, ClipboardList, PieChart,
    ChevronDown, Layers, Command, Award, Eye, Trash2, 
    IndianRupee, Terminal, Fingerprint,
    Cpu, RefreshCcw, ChevronRight, SearchCheck, Satellite,
    Download, Settings2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

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
            toast({ title: "Policy deployed successfully" });
            setIsAdding(false);
            setFormData({ policyName: "", policyType: "Health", premiumAmount: "", coverageAmount: "", durationYears: "", description: "" });
        },
        onError: (err) => {
            toast({ title: "Failed to deploy policy", variant: "destructive" });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/policies/${id}`, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "Policy removed" });
        },
        onError: (err) => {
            toast({ title: "Failed to remove policy", variant: "destructive" });
        }
    });

    const getPolicyIcon = (type) => {
        const iconProps = { size: 24, className: "text-blue-600" };
        switch(type) {
            case 'Health': return <Activity {...iconProps} />;
            case 'Vehicle': case 'Auto': return <Truck {...iconProps} />;
            case 'Property': case 'Home': return <Home {...iconProps} />;
            case 'Life': return <Shield {...iconProps} />;
            case 'Travel': return <Globe {...iconProps} />;
            default: return <FileText {...iconProps} />;
        }
    };

    const categories = ["All", "Health", "Life", "Vehicle", "Home", "Travel"];

    const filteredPolicies = policies?.filter((policy) => {
        const matchesSearch = policy.policyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || policy.policyType === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manage Policies</h1>
                        <p className="text-slate-500 font-medium">Configure and deploy insurance products for your customers.</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="h-11 px-6 bg-blue-600 text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                    >
                        <Plus size={18} /> Deploy New Policy
                    </button>
                </Reveal>
            </div>

            {/* Top Bar: Search & Categories */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex p-1 bg-slate-100 rounded-xl w-full lg:w-fit overflow-x-auto no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilterType(cat)}
                            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                filterType === cat 
                                ? "bg-white text-blue-600 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative group w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search protocols..." 
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Policy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-white border border-slate-100 rounded-2xl animate-pulse" />
                    ))
                ) : filteredPolicies?.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-bold">NO POLICIES IDENTIFIED</div>
                ) : (
                    filteredPolicies.map((policy, idx) => (
                        <Reveal key={policy._id} direction="up" delay={idx * 0.05}>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                        {getPolicyIcon(policy.policyType)}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 italic">
                                        ID: {policy._id.slice(-6).toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 uppercase italic tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                                        {policy.policyName}
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-400 line-clamp-2 leading-relaxed mb-6">
                                        {policy.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Premium</span>
                                            <span className="text-base font-bold text-slate-800 italic">₹{policy.premiumAmount?.toLocaleString()}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Coverage</span>
                                            <span className="text-base font-bold text-slate-800 italic">₹{(policy.coverageAmount / 100000).toFixed(1)}L</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-auto">
                                    <Link to={`/admin/policies/${policy._id}`} className="flex-1">
                                        <button className="w-full h-11 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                            Manage Policy <ArrowUpRight size={14} />
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => deleteMutation.mutate(policy._id)}
                                        className="w-11 h-11 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    ))
                )}
            </div>

            {/* Add Policy Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                        <Plus size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Deploy New Protocol</h3>
                                        <p className="text-sm font-medium text-slate-400">Configure parameters for a new insurance product.</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Policy Name</label>
                                        <input 
                                            placeholder="e.g. Health Guard Pro"
                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-700 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                            value={formData.policyName}
                                            onChange={e => setFormData({...formData, policyName: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                        <select 
                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-700 focus:border-blue-500 outline-none cursor-pointer"
                                            value={formData.policyType}
                                            onChange={e => setFormData({...formData, policyType: e.target.value})}
                                        >
                                            {["Health", "Life", "Vehicle", "Home", "Travel"].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Premium (₹)</label>
                                        <input 
                                            type="number"
                                            placeholder="Annually"
                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-700 focus:border-blue-500 outline-none"
                                            value={formData.premiumAmount}
                                            onChange={e => setFormData({...formData, premiumAmount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Coverage (₹)</label>
                                        <input 
                                            type="number"
                                            placeholder="Max Sum Insured"
                                            className="w-full h-12 bg-slate-900 border border-slate-800 rounded-xl px-4 text-sm font-bold text-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none shadow-inner"
                                            value={formData.coverageAmount}
                                            onChange={e => setFormData({...formData, coverageAmount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Duration (Yrs)</label>
                                        <input 
                                            type="number"
                                            placeholder="Term length"
                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-700 focus:border-blue-500 outline-none"
                                            value={formData.durationYears}
                                            onChange={e => setFormData({...formData, durationYears: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Description</label>
                                    <textarea 
                                        placeholder="Outline coverage details, exclusions and benefits..."
                                        className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold text-slate-600 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 h-12 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Discard
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={createMutation.isLoading}
                                        className="flex-[2] h-12 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                    >
                                        {createMutation.isLoading ? "Deploying..." : "Finalize & Deploy"}
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