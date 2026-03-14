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
    Layout, Briefcase, ClipboardList, PieChart
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
            toast({ title: "POLICY_CREATED", description: "Insurance policy has been successfully added to the catalog." });
            setIsAdding(false);
            setFormData({ policyName: "", policyType: "Health", premiumAmount: "", coverageAmount: "", durationYears: "", description: "" });
        },
        onError: (err) => {
            toast({
                title: "CREATION_FAILED",
                description: err?.errors?.[0]?.message || err?.message || "An error occurred while creating the policy.",
                variant: "destructive"
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/policies/${id}`, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "POLICY_DELETED", description: "Insurance policy has been successfully removed." });
        },
        onError: (err) => {
            toast({
                title: "DELETE_FAILED",
                description: err?.message || "Failed to delete the policy.",
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
            case 'Vehicle': case 'Auto': return 'accent';
            case 'Property': case 'Home': return 'primary';
            case 'Life': return 'emerald';
            case 'Travel': return 'indigo';
            default: return 'zinc';
        }
    };

    const filteredPolicies = policies?.filter((policy) => {
        const matchesSearch = policy.policyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || policy.policyType === filterType;
        return matchesSearch && matchesType;
    });

    if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={4} /></div>;

    return (
        <div className="admin-policies p-6 md:p-10 bg-[#F4F7FB] min-h-screen relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] left-[-10%] opacity-[0.03] pointer-events-none">
                <PieChart size={800} className="animate-spin-slow rotate-45" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#0165FF]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                INSURANCE<span className="text-primary tracking-normal">_POLICIES</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Manage your insurance products and coverage parameters
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
                        <div className="relative group flex-1 md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={18} strokeWidth={3} />
                            <Input
                                type="text"
                                placeholder="SEARCH_BY_PLAN_NAME..."
                                className="pl-16 h-16 bg-white border-border/50 rounded-[1.5rem] focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all font-black uppercase text-[10px] tracking-[4px] shadow-sm backdrop-blur-md italic"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="h-16 bg-white border-border/50 rounded-[1.5rem] px-8 hover:bg-zinc-50 border flex gap-4 font-black uppercase text-[10px] tracking-[4px] shadow-sm text-foreground backdrop-blur-md italic group">
                                    <Filter size={16} className="text-primary group-hover:rotate-180 transition-transform" strokeWidth={3} /> {filterType}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white border-border/50 rounded-[2rem] p-4 min-w-[240px] shadow-[0_40px_80px_rgba(0,0,0,0.2)]">
                                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[5px] opacity-20 p-4">Plan Classification</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/30" />
                                {["All", "Health", "Vehicle", "Home", "Life", "Auto", "Property", "Travel"].map(type => (
                                    <DropdownMenuItem key={type} className="rounded-xl font-black uppercase text-[10px] tracking-[4px] p-5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-all italic" onClick={() => setFilterType(type)}>
                                        {type}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button 
                            onClick={() => setIsAdding(true)}
                            className="h-16 px-10 bg-accent text-white rounded-[1.5rem] font-black uppercase tracking-[4px] text-[10px] flex items-center gap-5 shadow-2xl shadow-accent/40 hover:translate-y-[-5px] active:scale-95 transition-all italic group"
                        >
                            <Plus size={20} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-500" /> ADD_NEW_POLICY
                        </button>
                    </div>
                </div>
            </Reveal>

            {/* Catalog Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                {filteredPolicies?.map((policy, idx) => (
                    <Reveal key={policy._id} width="100%" delay={idx * 0.05} direction="up">
                        <div className="bg-white rounded-[4rem] border border-border/50 hover:border-primary/50 transition-all group overflow-hidden shadow-sm hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.2)] relative">
                            {/* Card Accent Glow */}
                            <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <ShieldCheck size={140} className="text-primary rotate-12" />
                            </div>

                            <div className="p-12 relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-xl border border-white/10 group-hover:scale-110 duration-500 ${
                                        getPolicyColor(policy.policyType) === 'rose' ? 'bg-rose-500/10 text-rose-500 shadow-rose-500/20' :
                                        getPolicyColor(policy.policyType) === 'accent' ? 'bg-accent/10 text-accent shadow-accent/20' :
                                        getPolicyColor(policy.policyType) === 'primary' ? 'bg-primary/10 text-primary shadow-primary/20' :
                                        getPolicyColor(policy.policyType) === 'emerald' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20' :
                                        getPolicyColor(policy.policyType) === 'indigo' ? 'bg-indigo-500/10 text-indigo-500 shadow-indigo-500/20' :
                                        'bg-zinc-500/10 text-zinc-500 shadow-zinc-500/20'
                                    }`}>
                                        {getPolicyIcon(policy.policyType)}
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="px-5 py-2 bg-zinc-100 border border-border/30 rounded-full text-[8px] font-black uppercase tracking-[3px] opacity-40 italic group-hover:opacity-100 transition-opacity">
                                            POLICY_INDEX_{idx + 1}
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black mb-5 group-hover:text-primary transition-colors leading-none italic uppercase tracking-tighter">
                                    {policy.policyName}
                                </h2>
                                <p className="opacity-30 text-[10px] mb-12 line-clamp-2 font-black leading-relaxed uppercase tracking-[3px] italic">
                                    {policy.description}
                                </p>

                                <div className="space-y-4 mb-12">
                                    <div className="flex justify-between items-center p-8 bg-zinc-50 rounded-[2.5rem] border border-border/20 shadow-inner group-hover:bg-white transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black opacity-20 uppercase tracking-[4px] mb-1">ANNUAL_PREMIUM</span>
                                            <span className="text-3xl font-black italic tracking-tighter text-primary">₹{policy.premiumAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            <Zap size={20} strokeWidth={3} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center px-8 py-2">
                                         <div className="flex items-center gap-3">
                                            <ShieldCheck size={14} className="opacity-20 text-emerald-500" />
                                            <span className="text-[8px] font-black opacity-20 uppercase tracking-[4px]">COVERAGE_LIMIT</span>
                                         </div>
                                         <span className="text-sm font-black italic tracking-tighter">₹{(policy.coverageAmount / 100000).toFixed(1)}L</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <Link to={`/admin/policies/${policy._id}`} className="flex-1">
                                        <button className="w-full h-16 bg-zinc-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-[4px] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 italic group/btn">
                                            VIEW_POLICY <TrendingUp size={16} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => deleteMutation.mutate(policy._id)}
                                        className="flex-1 h-16 bg-white border-2 border-rose-500/10 text-rose-500 rounded-2xl font-black text-[9px] uppercase tracking-[4px] hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-lg italic"
                                    >
                                        DELETE_POLICY <X size={16} strokeWidth={4} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Policy Creation Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-zinc-950/90 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-4xl bg-white p-16 md:p-24 rounded-[5rem] border border-white/10 shadow-[0_100px_150px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <Briefcase size={400} className="text-accent rotate-12" />
                            </div>

                            <div className="relative z-10 flex flex-col mb-16">
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-accent/40">
                                        <ClipboardList size={32} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">CREATE <span className="text-accent italic-none not-italic">INSURANCE_POLICY</span></h3>
                                </div>
                                <p className="opacity-30 text-xs font-black uppercase tracking-[8px] italic ml-20">Official insurance product creation protocol</p>
                            </div>

                            <form className="space-y-12 relative z-10" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">POLICY_NAME</label>
                                        <div className="relative group">
                                            <Layout className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                            <Input 
                                                placeholder="e.g. Health Protection Gold"
                                                className="h-20 bg-zinc-50 border-border/50 rounded-2xl px-16 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent shadow-sm focus:ring-8 focus:ring-accent/5 italic"
                                                value={formData.policyName}
                                                onChange={e => setFormData({...formData, policyName: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">POLICY_CATEGORY</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors pointer-events-none" />
                                            <select 
                                                className="w-full h-20 bg-zinc-50 border border-border/50 rounded-2xl px-16 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all appearance-none cursor-pointer shadow-sm focus:ring-8 focus:ring-accent/5 italic"
                                                value={formData.policyType}
                                                onChange={e => setFormData({...formData, policyType: e.target.value})}
                                            >
                                                {["Life", "Health", "Vehicle", "Home", "Travel", "Auto", "Property"].map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                                                <Activity size={18} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">ANNUAL_PREMIUM (₹)</label>
                                        <Input 
                                            className="h-20 bg-zinc-50 border-border/50 rounded-2xl font-black text-primary text-3xl tracking-tighter"
                                            type="number"
                                            value={formData.premiumAmount}
                                            onChange={e => setFormData({...formData, premiumAmount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">COVERAGE_LIMIT (₹)</label>
                                        <Input 
                                            className="h-20 bg-zinc-50 border-border/50 rounded-2xl font-black text-3xl tracking-tighter"
                                            type="number"
                                            value={formData.coverageAmount}
                                            onChange={e => setFormData({...formData, coverageAmount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">DURATION_IN_YEARS</label>
                                        <Input 
                                            className="h-20 bg-zinc-50 border-border/50 rounded-2xl font-black text-3xl tracking-tighter text-center"
                                            type="number"
                                            value={formData.durationYears}
                                            onChange={e => setFormData({...formData, durationYears: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">POLICY_DESCRIPTION</label>
                                    <textarea 
                                        placeholder="Detailed description of the insurance policy and its benefits..."
                                        className="w-full h-40 bg-zinc-50 border border-border/50 rounded-[2.5rem] p-10 outline-none focus:border-accent transition-all font-black uppercase no-scrollbar text-[11px] tracking-[4px] leading-relaxed shadow-sm focus:ring-8 focus:ring-accent/5 italic"
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="flex gap-8 pt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="h-20 px-12 bg-zinc-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[6px] hover:bg-zinc-800 transition-all font-black italic active:scale-95 shadow-xl border border-white/5"
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 h-20 bg-accent text-white rounded-[2rem] text-xs font-black uppercase tracking-[7px] shadow-[0_25px_60px_rgba(255,90,0,0.4)] font-black italic hover:translate-y-[-8px] transition-all active:scale-95 flex items-center justify-center gap-6 group"
                                    >
                                        {createMutation.isLoading ? "CREATING..." : (
                                            <>CREATE_POLICY <Plus size={20} className="group-hover:scale-125 transition-transform" strokeWidth={3} /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {filteredPolicies?.length === 0 && (
                <div className="text-center py-60 bg-white/50 border-4 border-dashed border-border/30 rounded-[6rem] backdrop-blur-sm relative">
                    <Shield size={120} className="mx-auto mb-10 opacity-5" />
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter opacity-10">NO_POLICIES_MATCHED</h3>
                    <p className="opacity-10 max-w-sm mx-auto mt-6 font-black uppercase text-[10px] tracking-[6px] italic leading-loose">Adjust filters or search terms to find insurance policies.</p>
                </div>
            )}
        </div>
    );
};

export default AdminPolicies;