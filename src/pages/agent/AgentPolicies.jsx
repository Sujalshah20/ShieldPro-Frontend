import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { motion } from "framer-motion";
import { 
    Search, Filter, Shield, Activity, Truck, 
    Home, FileText, Star, ArrowUpRight, 
    Globe, Compass, Target, Zap, Waves, 
    Layers, Cpu, Command, IndianRupee,
    ChevronDown, ShieldCheck, Box, 
    Layout, Briefcase, Lock, 
    Terminal, Award, ChevronRight
} from "lucide-react";
import { TableSkeleton } from "../../components/common/Skeleton";
import Reveal from "../../components/common/Reveal";

const AgentPolicies = () => {
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");

    const { data: policies, isLoading } = useQuery({
        queryKey: ['allPolicies', user?.token],
        queryFn: () => api.get('/policies', user.token),
        enabled: !!user?.token
    });

    const filteredPolicies = policies?.filter((policy) => {
        const matchesSearch = policy.policyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || policy.policyType === filterType;
        return matchesSearch && matchesType;
    });

    const getPolicyIcon = (type) => {
        const iconProps = { size: 28, strokeWidth: 3, className: "group-hover:scale-110 transition-transform duration-500" };
        switch(type) {
            case 'Health': return <Activity {...iconProps} />;
            case 'Vehicle': case 'Auto': return <Truck {...iconProps} />;
            case 'Property': case 'Home': return <Home {...iconProps} />;
            case 'Life': return <Shield {...iconProps} />;
            case 'Travel': return <Globe {...iconProps} />;
            default: return <FileText {...iconProps} />;
        }
    };

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
             <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {[1,2,3].map(i => <div key={i} className="h-96 bg-white rounded-[2.5rem] animate-pulse" />)}
            </div>
        </div>
    );

    return (
        <div className="agent-policies p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Asset Catalog</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Field deployment of enterprise protection schemes. Catalog status: Optimized.</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6 w-full xl:w-auto">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0082a1] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="FILTER ASSET CLASSES..." 
                            className="pl-12 pr-4 h-11 bg-white border border-slate-200 rounded-xl outline-none w-full transition-all font-bold text-[10px] uppercase tracking-widest text-[#012b3f] shadow-sm focus:border-[#0082a1]" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
                        {["All", "Health", "Vehicle", "Property", "Life"].map(type => (
                            <button 
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filterType === type ? 'bg-[#012b3f] text-white border-[#012b3f] shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-[#0082a1]'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredPolicies?.map((policy, idx) => (
                    <motion.div
                        key={policy._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white p-10 rounded-[2.5rem] border border-white shadow-2xl relative overflow-hidden group hover:border-[#0082a1]/30 transition-all duration-500 flex flex-col min-h-[500px]"
                    >
                         {/* Decorative Element */}
                         <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]">
                            <Layers size={250} className="text-[#012b3f] rotate-12" />
                         </div>

                         <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/50 shadow-2xl transition-all duration-500 group-hover:rotate-12 ${
                                policy.policyType === 'Health' ? 'bg-rose-500 text-white' :
                                policy.policyType === 'Vehicle' ? 'bg-amber-500 text-[#012b3f]' :
                                'bg-[#0082a1] text-white'
                            }`}>
                                {getPolicyIcon(policy.policyType)}
                            </div>
                            <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-[#012b3f] group-hover:text-white transition-all">
                                {policy.policyType?.toUpperCase()}
                            </div>
                         </div>

                         <div className="flex-1 relative z-10">
                            <h2 className="text-2xl font-black mb-4 group-hover:text-[#0082a1] transition-colors leading-tight uppercase tracking-tight">
                                {policy.policyName}
                            </h2>
                            <div className="w-12 h-1 bg-[#0082a1] mb-8 rounded-full group-hover:w-24 transition-all duration-700" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-4 italic opacity-80">
                                {policy.description}
                            </p>
                         </div>

                         <div className="mt-10 space-y-4 mb-10 relative z-10">
                              <div className="flex justify-between items-center p-6 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-white group-hover:border-[#0082a1]/20 transition-all shadow-inner">
                                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-[4px]">FISCAL_PREMIUM</span>
                                  <div className="flex items-center gap-2">
                                    <IndianRupee size={14} className="text-[#0082a1]" />
                                    <span className="text-2xl font-black text-[#012b3f] tracking-tighter">₹{policy.premiumAmount?.toLocaleString()}</span>
                                  </div>
                              </div>
                              <div className="flex justify-between items-center px-4 opacity-50">
                                   <span className="text-[7px] font-black text-slate-300 uppercase tracking-[6px]">AGGR LIQUIDITY</span>
                                   <span className="text-[10px] font-black text-slate-500">₹{policy.coverageAmount?.toLocaleString()}</span>
                              </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4 relative z-10">
                            <button className="h-14 bg-[#0082a1] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#012b3f] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                              DEPLOY <Zap size={14} fill="currentColor" />
                            </button>
                            <button className="h-14 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#012b3f] hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3 group/btn">
                              SPEC <ArrowUpRight size={14} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </button>
                         </div>
                    </motion.div>
                ))}
            </div>

            {/* Zero State */}
            {filteredPolicies?.length === 0 && (
                <div className="text-center py-40 border-t border-slate-50 opacity-20">
                    <Command size={48} className="mx-auto mb-6 text-[#012b3f]" />
                    <p className="text-[11px] font-black uppercase tracking-[5px] text-slate-400 italic font-bold">No asset classes identified in current scan</p>
                </div>
            )}

            {/* Sync Feed Footer */}
            <div className="mt-12 flex flex-wrap gap-8 items-center text-[9px] font-black uppercase tracking-[5px] text-slate-300 opacity-60">
                <span className="flex items-center gap-3"><Globe size={14} className="text-[#0082a1]" /> Multi-Region Ops</span>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="flex items-center gap-3"><ShieldCheck size={14} className="text-[#0082a1]" /> Quantum Validated</span>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="flex items-center gap-3"><Compass size={14} className="text-[#0082a1]" /> Directory Synced</span>
            </div>
        </div>
    );
};

export default AgentPolicies;
