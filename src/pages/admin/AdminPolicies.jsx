import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Filter, Shield, Activity, Truck, 
    Home, FileText, Star, ArrowUpRight, Plus, 
    X, Globe, Zap, ShieldCheck, TrendingUp,
    Layout, Briefcase, ClipboardList, PieChart,
    ChevronDown, Layers, Command, Award, Eye, Trash2, IndianRupee, Terminal, Fingerprint,
    Cpu, RefreshCcw, ChevronRight, SearchCheck, Satellite
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { TableSkeleton } from "../../components/common/Skeleton";
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
            toast({ 
                title: "PROTOCOL_CATALOGED", 
                description: "New insurance protocol successfully added to global matrix.",
                variant: "default"
            });
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
            toast({ 
                title: "PROTOCOL_DECOMMISSIONED", 
                description: "Policy has been purged from the global registry." 
            });
        },
        onError: (err) => {
            toast({
                title: "PROCESS_FAILED",
                description: err?.message || "Failed to remove policy node.",
                variant: "destructive"
            });
        }
    });

    const getPolicyIcon = (type) => {
        const iconProps = { size: 28, strokeWidth: 3, className: "group-hover:scale-110 transition-transform duration-700" };
        switch(type) {
            case 'Health': return <Activity {...iconProps} />;
            case 'Vehicle': case 'Auto': return <Truck {...iconProps} />;
            case 'Property': case 'Home': return <Home {...iconProps} />;
            case 'Life': return <Shield {...iconProps} />;
            case 'Travel': return <Globe {...iconProps} />;
            default: return <FileText {...iconProps} />;
        }
    };

    const filteredPolicies = policies?.filter((policy) => {
        const matchesSearch = policy.policyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || policy.policyType === filterType;
        return matchesSearch && matchesType;
    });

    if (isLoading) return (
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-[500px] bg-slate-50 rounded-[3rem] border-2 border-slate-100 animate-pulse" />
                ))}
             </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-10">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-[#007ea7] rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-[#007ea7] italic leading-none">Security_Asset_Catalog</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Insurance <span className="text-[#007ea7]">Protocols_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-[10px] italic leading-relaxed">Strategic parameter configuration and coverage distribution console. Current Registry State: <span className="text-emerald-500">ACTIVE</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                            <input
                                type="text"
                                placeholder="SCAN_PROTOCOL_GRID..."
                                className="w-full pl-12 pr-6 h-12 bg-white border-2 border-slate-100 rounded-xl outline-none transition-all font-black text-[10px] text-[#003249] shadow-inner focus:border-[#007ea7] focus:ring-4 focus:ring-[#007ea7]/5 uppercase tracking-[2px] placeholder:text-slate-200 italic"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="h-12 px-6 bg-[#003249] text-[#80ced7] rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[3px] hover:bg-[#007ea7] hover:text-white transition-all shadow-3xl active:scale-95 italic group relative overflow-hidden"
                        >
                             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                             <Plus size={18} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-500" /> DEPLOY_PROTOCOL
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* Tactical Filters */}
            <Reveal direction="up">
                <div className="flex flex-wrap gap-3 bg-slate-50 p-2 rounded-2xl border-2 border-slate-50 w-fit">
                    {["All", "Health", "Vehicle", "Home", "Life", "Travel"].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 h-10 rounded-xl text-[9px] font-black uppercase tracking-[3px] transition-all duration-500 italic border-2 ${
                                filterType === type 
                                ? 'bg-[#003249] text-[#80ced7] border-[#003249] shadow-2xl skew-x-[-10deg]' 
                                : 'bg-transparent text-slate-300 border-transparent hover:text-[#003249]'
                            }`}
                        >
                            <span className={filterType === type ? 'skew-x-[10deg] inline-block' : ''}>{type}</span>
                        </button>
                    ))}
                </div>
            </Reveal>

            {/* Protocol Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPolicies?.map((policy, idx) => (
                    <Reveal direction="up" delay={idx * 0.1} key={policy._id}>
                        <div className="saas-card group relative p-8 border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-1000 min-h-[420px] flex flex-col justify-between overflow-hidden shadow-3xl">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-150 group-hover:rotate-12 transition-transform duration-[3000ms]">
                                <Layers size={200} className="text-[#003249]" />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-14 h-14 bg-[#003249] border-2 border-white/5 rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl group-hover:scale-110 transition-all duration-700">
                                    {getPolicyIcon(policy.policyType)}
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[4px] block mb-2 italic">NODE_SIG</span>
                                    <span className="px-3 py-1 bg-slate-50 border-2 border-slate-100 rounded-lg text-[9px] font-black text-[#003249] uppercase tracking-[3px] shadow-inner italic">
                                        ID://{policy._id.slice(-8).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 mt-8 relative z-10">
                                <h3 className="text-2xl font-black text-[#003249] mb-3 group-hover:text-[#007ea7] transition-colors leading-tight uppercase tracking-tighter italic">
                                    {policy.policyName}
                                </h3>
                                <div className="w-12 h-1 bg-[#007ea7] mb-6 rounded-full group-hover:w-20 transition-all duration-1000 shadow-[0_0_10px_#007ea7]" />
                                <p className="text-[11px] font-black text-slate-400 mb-8 line-clamp-3 uppercase tracking-[2px] leading-relaxed italic opacity-60">
                                    {policy.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                                <div className="p-5 bg-white border-2 border-slate-50 rounded-2xl shadow-inner group-hover:border-[#007ea7]/20 transition-all duration-700">
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[4px] block mb-2 italic">ANNUAL_YIELD</span>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee size={16} className="text-[#007ea7]" strokeWidth={4} />
                                        <span className="text-xl font-black text-[#003249] tracking-tighter uppercase italic leading-none group-hover:text-[#007ea7] transition-colors">₹{policy.premiumAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-[#003249] rounded-2xl border border-white/5 shadow-3xl relative overflow-hidden group/cap">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none group-hover/cap:scale-150 transition-transform duration-1000" />
                                    <span className="text-[8px] font-black text-[#80ced7] uppercase tracking-[4px] block mb-2 italic relative z-10">CORE_CAP</span>
                                    <span className="text-xl font-black text-white tracking-tighter uppercase italic leading-none relative z-10 group-hover:text-[#80ced7] transition-colors">₹{(policy.coverageAmount / 100000).toFixed(1)}L</span>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-auto relative z-10">
                                <Link to={`/admin/policies/${policy._id}`} className="flex-[3]">
                                    <button className="w-full h-12 px-6 bg-[#003249] text-[#80ced7] rounded-xl text-[10px] font-black uppercase tracking-[3px] hover:bg-[#007ea7] hover:text-white transition-all shadow-3xl active:scale-95 flex items-center justify-center gap-3 group/btn border border-white/5 italic">
                                        ANALYZE_NODES <ChevronRight size={16} strokeWidth={4} className="group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </Link>
                                <button 
                                    onClick={() => deleteMutation.mutate(policy._id)}
                                    className="w-12 h-12 bg-white border-2 border-slate-100 text-slate-200 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-500 active:scale-90 shadow-xl group/del"
                                >
                                    <Trash2 size={20} strokeWidth={3} className="group-hover/del:scale-125 transition-all" />
                                </button>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Empty State */}
            {(!filteredPolicies || filteredPolicies.length === 0) && (
                <Reveal direction="up" width="100%">
                    <div className="text-center py-40 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 shadow-3xl opacity-20">
                            <Command size={48} className="text-[#003249]" strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black text-[#003249] opacity-30 uppercase tracking-[10px] italic">No Records Identified in Current Quadrant</h3>
                        <p className="mt-6 text-[11px] font-black text-[#007ea7] opacity-40 uppercase tracking-[5px] italic">Awaiting high-altitude synchronization...</p>
                    </div>
                </Reveal>
            )}

            {/* Deployment Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-[#003249]/95 backdrop-blur-2xl" />
                            <div className="relative w-full max-w-4xl bg-white p-10 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20">
                                <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#007ea7]/10 rounded-full blur-[100px] pointer-events-none" />

                                <div className="flex items-center gap-8 mb-10 relative z-10 border-b-2 border-slate-50 pb-8">
                                    <div className="w-16 h-16 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl relative overflow-hidden group border-2 border-white/20">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                         <ClipboardList size={32} strokeWidth={3} className="relative z-10 group-hover:rotate-12 transition-transform duration-700" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Deploy Protocol</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic leading-none">Level-5 Infrastructure Deployment Protocol</p>
                                    </div>
                                    <button onClick={() => setIsAdding(false)} className="ml-auto p-4 bg-slate-50 hover:bg-rose-50 rounded-2xl transition-all group active:scale-95 border-2 border-transparent hover:border-rose-100">
                                        <X size={20} className="text-slate-300 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-500" strokeWidth={4} />
                                    </button>
                                </div>

                                <form className="space-y-8 relative z-10" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[4px] text-[#007ea7] ml-4 italic flex items-center gap-3">
                                                <Fingerprint size={14} strokeWidth={3} /> IDENT_NAME
                                            </label>
                                            <input 
                                                placeholder="NODE_LEGAL_ID"
                                                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-8 font-black text-base uppercase text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner tracking-[1px] italic"
                                                value={formData.policyName}
                                                onChange={e => setFormData({...formData, policyName: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[4px] text-[#007ea7] ml-4 italic flex items-center gap-3">
                                                <Layers size={14} strokeWidth={3} /> CLASSIFICATION
                                            </label>
                                            <div className="relative">
                                                <select 
                                                    className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-8 font-black text-base uppercase text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all cursor-pointer shadow-inner tracking-[1px] italic appearance-none"
                                                    value={formData.policyType}
                                                    onChange={e => setFormData({...formData, policyType: e.target.value})}
                                                >
                                                    {["Life", "Health", "Vehicle", "Home", "Travel", "Auto", "Property"].map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} strokeWidth={4} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[4px] text-[#007ea7] ml-4 italic flex items-center gap-3">
                                                <IndianRupee size={14} strokeWidth={3} /> PREM_BASE
                                            </label>
                                            <input 
                                                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 font-black text-2xl text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner tracking-tighter italic"
                                                type="number"
                                                value={formData.premiumAmount}
                                                onChange={e => setFormData({...formData, premiumAmount: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[4px] text-[#007ea7] ml-4 italic flex items-center gap-3">
                                                <ShieldCheck size={14} strokeWidth={3} /> CORE_SAFETY
                                            </label>
                                            <input 
                                                className="w-full h-14 bg-[#003249] border-2 border-white shadow-3xl rounded-2xl px-6 font-black text-2xl text-[#80ced7] outline-none focus:ring-8 focus:ring-[#007ea7]/10 transition-all tracking-tighter italic text-right"
                                                type="number"
                                                value={formData.coverageAmount}
                                                onChange={e => setFormData({...formData, coverageAmount: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[4px] text-[#007ea7] ml-4 italic flex items-center gap-3">
                                                <Zap size={14} strokeWidth={3} /> YRS_CYCLE
                                            </label>
                                            <input 
                                                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 font-black text-2xl text-[#003249] text-center outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic"
                                                type="number"
                                                value={formData.durationYears}
                                                onChange={e => setFormData({...formData, durationYears: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[4px] text-[#007ea7] ml-4 italic flex items-center gap-3">
                                            <Terminal size={14} strokeWidth={3} /> PROTOCOL_DESC
                                        </label>
                                        <textarea 
                                            placeholder="APPEND_SPECIFICATIONS..."
                                            className="w-full h-32 bg-slate-50 border-2 border-slate-50 rounded-[2rem] p-8 outline-none focus:border-[#007ea7] focus:bg-white transition-all font-black text-[11px] uppercase tracking-[2px] shadow-inner italic leading-normal"
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                        <button 
                                            type="button"
                                            onClick={() => setIsAdding(false)}
                                            className="h-16 px-8 bg-slate-50 text-[#003249] rounded-2xl text-[10px] font-black uppercase tracking-[5px] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 border-2 border-transparent transition-all italic flex-1 active:scale-95 flex items-center justify-center"
                                        >
                                            CANCEL_SYNC
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={createMutation.isLoading}
                                            className="h-16 px-8 bg-[#003249] text-[#80ced7] rounded-2xl text-[11px] font-black uppercase tracking-[6px] shadow-[0_20px_40px_-10px_rgba(0,50,73,0.4)] hover:bg-[#007ea7] hover:text-white transition-all italic flex-[2] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 group/btn"
                                        >
                                            <Cpu size={22} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> 
                                            {createMutation.isLoading ? "DEPLOYING..." : "AUTHORIZE_DEPLOYMENT"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-12 opacity-30 pt-10 border-t-2 border-slate-50">
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Fingerprint size={16} strokeWidth={3} className="text-[#007ea7]" /> Protocol_Grid_Verified
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Layers size={16} strokeWidth={3} className="text-[#007ea7]" /> Registry_Mapping_Sync
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Globe size={16} strokeWidth={3} className="text-[#007ea7]" /> Node_Coverage_Nominal
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminPolicies;