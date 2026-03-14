import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { Button } from "@/components/lightswind/button";
import { Input } from "@/components/lightswind/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/lightswind/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
    Search, Filter, Shield, Activity, Truck, 
    Home, FileText, Star, ArrowUpRight, Plus, 
    X, Globe, Zap, ShieldCheck, TrendingUp,
    Layout, Briefcase, ClipboardList, PieChart,
    ChevronDown, Layers, Command, Award
} from "lucide-react";
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
            toast({ title: "ASSET_CATALOGED", description: "Insurance protocol has been successfully added to the central registry." });
            setIsAdding(false);
            setFormData({ policyName: "", policyType: "Health", premiumAmount: "", coverageAmount: "", durationYears: "", description: "" });
        },
        onError: (err) => {
            toast({
                title: "INTEGRATION_FAILED",
                description: err?.errors?.[0]?.message || err?.message || "An error occurred while deploying the policy protocol.",
                variant: "destructive"
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/policies/${id}`, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "PROTOCOL_REMOVED", description: "Insurance policy has been successfully decommissioned." });
        },
        onError: (err) => {
            toast({
                title: "DECOMMISSION_ERROR",
                description: err?.message || "Failed to remove policy from registry.",
                variant: "destructive"
            });
        }
    });

    const getPolicyIcon = (type) => {
        switch(type) {
            case 'Health': return <Activity size={28} strokeWidth={2.5} />;
            case 'Vehicle': case 'Auto': return <Truck size={28} strokeWidth={2.5} />;
            case 'Property': case 'Home': return <Home size={28} strokeWidth={2.5} />;
            case 'Life': return <Shield size={28} strokeWidth={2.5} />;
            case 'Travel': return <Globe size={28} strokeWidth={2.5} />;
            default: return <FileText size={28} strokeWidth={2.5} />;
        }
    };

    const getPolicyColor = (type) => {
        switch(type) {
            case 'Health': return 'rose';
            case 'Vehicle': case 'Auto': return 'primary';
            case 'Property': case 'Home': return 'indigo';
            case 'Life': return 'emerald';
            case 'Travel': return 'accent';
            default: return 'slate';
        }
    };

    const filteredPolicies = policies?.filter((policy) => {
        const matchesSearch = policy.policyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || policy.policyType === filterType;
        return matchesSearch && matchesType;
    });

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={10} cols={4} /></div>;

    return (
        <div className="admin-policies p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Mission Atmosphere */}
            <div className="absolute top-[-10%] left-[-10%] opacity-[0.03] pointer-events-none transform -rotate-12">
                <ShieldCheck size={800} className="animate-pulse-slow text-primary" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/30" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                PRODUCT<span className="text-primary tracking-normal ml-1">_CATALOG</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-7">
                            Strategic insurance asset management and coverage distribution
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
                        <div className="relative group flex-1 md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} strokeWidth={3} />
                            <Input
                                type="text"
                                placeholder="IDENTIFY_PROTECTION_PLAN..."
                                className="pl-16 h-16 bg-white border-slate-200 rounded-2xl focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all font-bold uppercase text-[10px] tracking-[4px] text-header-bg shadow-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="h-16 bg-white border-slate-200 rounded-2xl px-10 hover:bg-slate-50 border flex gap-6 font-black uppercase text-[10px] tracking-[4px] shadow-xl text-header-bg group">
                                    <Filter size={18} className="text-primary group-hover:rotate-180 transition-transform" strokeWidth={3} /> {filterType}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white border-slate-200 rounded-2xl p-4 min-w-[280px] shadow-2xl border border-slate-100">
                                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[5px] text-slate-400 p-4">Plan Classification</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                {["All", "Health", "Vehicle", "Home", "Life", "Auto", "Property", "Travel"].map(type => (
                                    <DropdownMenuItem key={type} className="rounded-xl font-bold uppercase text-[10px] tracking-[4px] p-5 cursor-pointer hover:bg-slate-50 hover:text-primary transition-all text-header-bg" onClick={() => setFilterType(type)}>
                                        {type}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button 
                            onClick={() => setIsAdding(true)}
                            className="h-16 px-10 bg-header-bg text-white rounded-2xl font-black uppercase tracking-[4px] text-[10px] flex items-center gap-6 shadow-2xl shadow-header-bg/20 hover:bg-primary transition-all active:scale-95 group"
                        >
                            <Plus size={22} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-500" /> DEPLOY NEW PROTOCOL
                        </button>
                    </div>
                </div>
            </Reveal>

            {/* Catalog Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredPolicies?.map((policy, idx) => (
                    <Reveal key={policy._id} width="100%" delay={idx * 0.05} direction="up">
                        <div className="bg-white rounded-[3rem] border border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-xl hover:shadow-2xl relative">
                            {/* Card Decorative Mask */}
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none transform rotate-12 scale-150">
                                <Award size={180} className="text-header-bg" />
                            </div>

                            <div className="p-12 relative z-10">
                                <div className="flex justify-between items-start mb-12">
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all shadow-xl border border-white/20 group-hover:rotate-12 duration-500 ${
                                        getPolicyColor(policy.policyType) === 'rose' ? 'bg-header-bg text-rose-500 shadow-rose-500/10' :
                                        getPolicyColor(policy.policyType) === 'primary' ? 'bg-header-bg text-primary shadow-primary/10' :
                                        getPolicyColor(policy.policyType) === 'indigo' ? 'bg-header-bg text-indigo-400 shadow-indigo-400/10' :
                                        getPolicyColor(policy.policyType) === 'emerald' ? 'bg-header-bg text-emerald-500 shadow-emerald-500/10' :
                                        getPolicyColor(policy.policyType) === 'accent' ? 'bg-header-bg text-accent shadow-accent/10' :
                                        'bg-header-bg text-slate-400 shadow-slate-400/10'
                                    }`}>
                                        {getPolicyIcon(policy.policyType)}
                                    </div>
                                    <div className="flex flex-col items-end gap-3 text-right">
                                        <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-[4px] text-slate-400">
                                            SEC_POL_0{idx + 1}
                                        </div>
                                        <div className="flex gap-2.5">
                                            <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/40 animate-pulse" />
                                            <div className="w-2 h-2 rounded-full bg-slate-100" />
                                            <div className="w-2 h-2 rounded-full bg-slate-100" />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black mb-6 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight text-header-bg">
                                    {policy.policyName}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 mb-12 line-clamp-3 uppercase tracking-[4px] leading-relaxed">
                                    {policy.description}
                                </p>

                                <div className="space-y-4 mb-12">
                                    <div className="flex justify-between items-center p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner group-hover:bg-background-main/30 group-hover:border-primary/10 transition-colors">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[4px]">ANNUAL_YIELD</span>
                                            <span className="text-3xl font-black text-header-bg uppercase tracking-tight">₹{policy.premiumAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                                            <Zap size={24} strokeWidth={3} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center px-6 py-2">
                                         <div className="flex items-center gap-4 text-emerald-600/60">
                                            <ShieldCheck size={18} strokeWidth={2.5} />
                                            <span className="text-[10px] font-black uppercase tracking-[4px]">COVERAGE_CAP</span>
                                         </div>
                                         <span className="text-lg font-black text-header-bg uppercase tracking-tight">₹{(policy.coverageAmount / 100000).toFixed(1)}L</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <Link to={`/admin/policies/${policy._id}`} className="flex-1">
                                        <button className="w-full h-16 bg-header-bg text-white rounded-2xl font-black text-[10px] uppercase tracking-[4px] hover:bg-primary transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 group/btn border border-white/5">
                                            VIEW_LOGS <ArrowUpRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => deleteMutation.mutate(policy._id)}
                                        className="flex-1 h-16 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[4px] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-sm"
                                    >
                                        DECOMMISSION <X size={18} strokeWidth={4} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Deployment Console */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-header-bg/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-4xl bg-white p-16 md:p-24 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[4000ms]">
                                <Layers size={500} className="text-primary rotate-45" />
                            </div>

                            <div className="relative z-10 flex flex-col mb-16">
                                <div className="flex items-center gap-8 mb-6">
                                    <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 border border-white/10">
                                        <ClipboardList size={40} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h3 className="text-5xl font-black uppercase tracking-tighter text-header-bg leading-none">DEPLOY <span className="text-primary tracking-normal ml-2">PROTOCOL</span></h3>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[6px] mt-4 ml-1">Strategic product synthesis and risk parameter configuration</p>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-12 relative z-10" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">IDENTIFICATION_SET</label>
                                        <div className="relative group">
                                            <Layout className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input 
                                                placeholder="e.g. ULTRA_HEALTH_SHIELD_PRO_MAX"
                                                className="h-20 bg-slate-50 border-slate-200 rounded-2xl px-16 font-black text-xs uppercase tracking-[4px] outline-none focus:border-primary focus:bg-white shadow-lg focus:ring-8 focus:ring-primary/5 text-header-bg"
                                                value={formData.policyName}
                                                onChange={e => setFormData({...formData, policyName: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">CLASSIFICATION_ZONE</label>
                                        <div className="relative group">
                                            <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                                            <select 
                                                className="w-full h-20 bg-slate-50 border border-slate-200 rounded-2xl px-16 font-black text-xs uppercase tracking-[4px] outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer shadow-lg focus:ring-8 focus:ring-primary/5 text-header-bg"
                                                value={formData.policyType}
                                                onChange={e => setFormData({...formData, policyType: e.target.value})}
                                            >
                                                {["Life", "Health", "Vehicle", "Home", "Travel", "Auto", "Property"].map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-focus-within:text-primary">
                                                <ChevronDown size={22} strokeWidth={4} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">YIELD_ANNUAL (₹)</label>
                                        <Input 
                                            className="h-20 bg-slate-50 border-slate-200 rounded-2xl font-black text-header-bg text-4xl tracking-tighter shadow-lg focus:bg-white text-right pr-10"
                                            type="number"
                                            value={formData.premiumAmount}
                                            onChange={e => setFormData({...formData, premiumAmount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">COVERAGE_MAX (₹)</label>
                                        <Input 
                                            className="h-20 bg-slate-50 border-slate-200 rounded-2xl font-black text-header-bg text-4xl tracking-tighter shadow-lg focus:bg-white text-right pr-10"
                                            type="number"
                                            value={formData.coverageAmount}
                                            onChange={e => setFormData({...formData, coverageAmount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">CYCLE_LIFE (YRS)</label>
                                        <Input 
                                            className="h-20 bg-slate-50 border-slate-200 rounded-2xl font-black text-header-bg text-4xl tracking-tighter text-center shadow-lg focus:bg-white"
                                            type="number"
                                            value={formData.durationYears}
                                            onChange={e => setFormData({...formData, durationYears: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">PROTOCOL_DOCUMENTATION</label>
                                    <textarea 
                                        placeholder="Detailed specification of the insurance coverage and risk mitigation parameters..."
                                        className="w-full h-44 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-12 outline-none focus:border-primary focus:bg-white transition-all font-bold uppercase no-scrollbar text-xs tracking-[4px] leading-relaxed shadow-lg focus:ring-8 focus:ring-primary/5 text-header-bg"
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="flex gap-10 pt-10">
                                    <button 
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="h-24 px-12 bg-slate-900 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[6px] hover:bg-header-bg transition-all active:scale-95 shadow-xl border border-white/5"
                                    >
                                        ABORT_DEPLOYMENT
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 h-24 bg-primary text-white rounded-[2.5rem] text-xs font-black uppercase tracking-[8px] shadow-2xl shadow-primary/40 hover:translate-y-[-10px] hover:bg-header-bg transition-all active:scale-95 flex items-center justify-center gap-8 group"
                                    >
                                        {createMutation.isLoading ? "SYNTHESIZING..." : (
                                            <>AUTHORIZE_PROTOCOL <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {filteredPolicies?.length === 0 && (
                <div className="text-center py-60 bg-white/50 border-4 border-dashed border-slate-200 rounded-[6rem] backdrop-blur-sm relative">
                    <Command size={120} className="mx-auto mb-10 opacity-5 text-header-bg" />
                    <h3 className="text-4xl font-black uppercase tracking-tighter text-header-bg opacity-10">NO_RECORDS_IDENTIFIED</h3>
                    <p className="opacity-20 max-w-sm mx-auto mt-6 font-bold uppercase text-[10px] tracking-[6px] leading-loose">Adjust system filters to retrieve indexed insurance protocols.</p>
                </div>
            )}
        </div>
    );
};

export default AdminPolicies;