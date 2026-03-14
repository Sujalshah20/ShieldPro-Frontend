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
    ChevronDown, ShieldCheck
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

    if (isLoading) return <div className="p-8 bg-background-main min-h-screen"><TableSkeleton rows={10} cols={4} /></div>;

    return (
        <div className="agent-policies p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Mission Geometry Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 2px, transparent 0)`, backgroundSize: '40px 40px' }} />

            <Reveal width="100%" direction="down">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-16">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                             <div className="w-2.5 h-12 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                ASSET<span className="text-primary tracking-normal ml-3">_CATALOG</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-9">
                            Field deployment of enterprise protection schemes
                        </p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full xl:w-auto">
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="FILTER_ASSET_CLASSES..." 
                                className="pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-3xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full transition-all font-bold text-[10px] uppercase tracking-[4px] text-header-bg shadow-xl" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-2">
                            {["All", "Health", "Vehicle", "Property", "Life"].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-8 py-5 rounded-2xl text-[9px] font-black uppercase tracking-[3px] transition-all whitespace-nowrap shadow-lg border ${filterType === type ? 'bg-header-bg text-white border-white/10' : 'bg-white text-slate-400 border-slate-100 hover:border-primary'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Reveal>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {filteredPolicies?.map((policy, idx) => (
                    <Reveal key={policy._id} width="100%" delay={idx * 0.05} direction="up">
                        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl relative overflow-hidden group hover:border-primary transition-all duration-700 h-[520px] flex flex-col">
                             {/* Decorative Background Element */}
                             <div className="absolute top-[-20%] right-[-10%] opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]">
                                <Layers size={350} className="text-header-bg rotate-12" />
                             </div>

                             <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className={`w-18 h-18 rounded-[1.5rem] flex items-center justify-center border border-white/50 shadow-xl transition-all duration-500 group-hover:rotate-12 ${
                                    policy.policyType === 'Health' ? 'bg-rose-500 text-white shadow-rose-500/20' :
                                    policy.policyType === 'Vehicle' ? 'bg-amber-500 text-header-bg shadow-amber-500/20' :
                                    'bg-primary text-white shadow-primary/20'
                                }`}>
                                    {getPolicyIcon(policy.policyType)}
                                </div>
                                <div className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-[4px] text-slate-400 group-hover:bg-header-bg group-hover:text-white transition-all">
                                    {policy.policyType?.toUpperCase()}
                                </div>
                             </div>

                             <div className="flex-1 relative z-10">
                                <h2 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors leading-none uppercase tracking-tighter">
                                    {policy.policyName}
                                </h2>
                                <div className="w-16 h-1 bg-primary mb-8 rounded-full group-hover:w-32 transition-all duration-700" />
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[4px] font-medium leading-[2.2] line-clamp-3">
                                    {policy.description}
                                </p>
                             </div>

                             <div className="space-y-6 mb-12 relative z-10">
                                  <div className="flex justify-between items-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group-hover:bg-white group-hover:border-primary/20 transition-all shadow-inner">
                                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px]">FISCAL_PREMIUM</span>
                                      <div className="flex items-center gap-3">
                                        <IndianRupee size={16} className="text-primary" />
                                        <span className="text-2xl font-black text-header-bg tracking-tighter">₹{policy.premiumAmount?.toLocaleString()}</span>
                                      </div>
                                  </div>
                                  <div className="flex justify-between items-center px-6">
                                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-[6px]">AGGR_LIQUIDITY</span>
                                       <span className="text-[10px] font-black text-slate-500">₹{policy.coverageAmount?.toLocaleString()}</span>
                                  </div>
                             </div>

                             <div className="grid grid-cols-2 gap-6 relative z-10">
                                <button className="h-16 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[4px] hover:bg-header-bg transition-all shadow-2xl shadow-primary/20 active:scale-95 flex items-center justify-center gap-4 group/btn">
                                  DEPLOY <Zap size={16} fill="currentColor" className="group-hover/btn:animate-pulse" />
                                </button>
                                <button className="h-16 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[4px] hover:bg-header-bg hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group/btn">
                                  SPEC <ArrowUpRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                             </div>
                        </div>
                    </Reveal>
                ))}
            </motion.div>

            {filteredPolicies?.length === 0 && (
                <div className="text-center py-40 bg-white rounded-[4rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ShieldCheck size={100} className="mx-auto mb-10 text-slate-200 group-hover:scale-110 transition-transform duration-1000" strokeWidth={1} />
                    <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg mb-4">NO_ASSET_MATCH</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[8px] italic">Adjust matrix filters to scan for alternative protection schemes.</p>
                </div>
            )}

            {/* SYNC METRICS FOOTER */}
            <Reveal width="100%" direction="up" delay={0.6}>
                <div className="mt-20 flex flex-wrap gap-12 items-center text-[10px] font-black uppercase tracking-[6px] text-slate-300">
                    <span className="flex items-center gap-5 bg-white px-8 py-3 rounded-2xl border border-slate-100 shadow-sm"><Globe size={16} className="text-primary" /> MULTI-REGION_OPS</span>
                    <div className="w-2.5 h-2.5 bg-slate-200 rounded-full animate-pulse" />
                    <span className="flex items-center gap-5 bg-white px-8 py-3 rounded-2xl border border-slate-100 shadow-sm"><ShieldCheck size={16} className="text-primary" /> QUANTUM_VALIDATED</span>
                    <div className="w-2.5 h-2.5 bg-slate-200 rounded-full animate-pulse" />
                    <span className="flex items-center gap-5 bg-white px-8 py-3 rounded-2xl border border-slate-100 shadow-sm"><Compass size={16} className="text-primary" /> DIRECTORY_SYNCED</span>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentPolicies;
