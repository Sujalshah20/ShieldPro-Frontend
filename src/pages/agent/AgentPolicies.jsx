import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Filter, Shield, Activity, Truck, 
    Home, FileText, Star, ArrowUpRight, 
    Globe, Compass, Target, Zap, Waves, 
    Layers, Cpu, Command, IndianRupee,
    ChevronDown, ShieldCheck, Box, 
    Layout, Briefcase, Lock, 
    Terminal, Award, ChevronRight, Fingerprint, X,
    Satellite, SearchCheck, RefreshCcw
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
        const iconProps = { size: 36, strokeWidth: 2.5, className: "group-hover:scale-110 transition-transform duration-700" };
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
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[1,2,3].map(i => <div key={i} className="h-[500px] bg-slate-50 rounded-[3.5rem] border-2 border-slate-100 animate-pulse" />)}
             </div>
        </div>
    );

    return (
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Global_Asset_Library</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Asset <span className="text-[#007ea7]">Catalog_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Field deployment of enterprise protection schemes. Catalog status: <span className="text-[#007ea7]">OPTIMIZED</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full xl:w-auto">
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                            <input 
                                type="text" 
                                placeholder="IDENTIFY_PLAN_NODE..." 
                                className="pl-16 pr-8 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none w-full transition-all font-black text-[11px] uppercase tracking-[4px] text-[#003249] shadow-inner focus:border-[#007ea7] focus:ring-8 focus:ring-[#007ea7]/5 placeholder:text-slate-200 italic" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                                <Satellite size={16} strokeWidth={3} />
                            </div>
                        </div>
                        
                        <div className="flex gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
                            {["All", "Health", "Vehicle", "Property", "Life"].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[5px] transition-all whitespace-nowrap border-2 italic relative overflow-hidden group/tab ${
                                        filterType === type 
                                        ? 'bg-[#003249] text-[#80ced7] border-[#003249] shadow-3xl' 
                                        : 'bg-white text-slate-400 border-slate-50 hover:border-[#007ea7]/30 hover:text-[#003249]'
                                    }`}
                                >
                                    <div className={`absolute bottom-0 left-0 h-1 bg-[#007ea7] transition-all duration-500 ${filterType === type ? 'w-full' : 'w-0'}`} />
                                    {type.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPolicies?.map((policy, idx) => (
                    <Reveal key={policy._id} direction="up" delay={idx * 0.05}>
                        <div className="saas-card relative overflow-hidden group border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[580px] flex flex-col shadow-3xl group/card">
                             {/* Decorative Background Icon */}
                             <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                <Layers size={320} className="text-[#003249] rotate-12" />
                             </div>

                             <div className="p-10 flex-1 flex flex-col relative z-20">
                                 <div className="flex justify-between items-start mb-12 relative">
                                    <div className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center border-2 border-white shadow-3xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 ${
                                        policy.policyType === 'Health' ? 'bg-[#003249] text-[#80ced7]' :
                                        policy.policyType === 'Vehicle' ? 'bg-[#003249] text-amber-500' :
                                        'bg-[#003249] text-[#007ea7]'
                                    }`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-20" />
                                        {getPolicyIcon(policy.policyType)}
                                    </div>
                                    <div className="px-6 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-[4px] text-slate-400 group-hover:bg-[#003249] group-hover:text-[#80ced7] group-hover:border-[#003249] transition-all italic">
                                        {policy.policyType?.toUpperCase()}
                                    </div>
                                 </div>

                                 <div className="flex-1 space-y-4 mb-10">
                                    <h2 className="text-3xl font-black mb-4 group-hover:text-[#007ea7] transition-colors leading-tight uppercase tracking-tighter italic">
                                        {policy.policyName}
                                    </h2>
                                    <div className="w-16 h-1.5 bg-[#007ea7] mb-8 rounded-full group-hover:w-32 transition-all duration-700 shadow-[0_0_15px_#007ea7]" />
                                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-[4px] leading-relaxed line-clamp-4 italic opacity-60 group-hover:opacity-100 transition-opacity">
                                        {policy.description}
                                    </p>
                                 </div>

                                 <div className="mt-auto space-y-8">
                                      <div className="p-10 bg-slate-50 border-2 border-slate-50 rounded-[3rem] group-hover:bg-white group-hover:border-[#007ea7]/30 transition-all duration-500 shadow-inner group/metrics">
                                          <div className="flex flex-col gap-8">
                                              <div className="flex justify-between items-end">
                                                  <div className="space-y-2">
                                                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic leading-none block">FISCAL_PREMIUM</span>
                                                      <div className="h-1 w-8 bg-slate-100 group-hover/metrics:w-16 transition-all duration-500" />
                                                  </div>
                                                  <div className="flex items-center gap-4 group-hover:scale-110 transition-transform">
                                                    <IndianRupee size={22} className="text-[#007ea7]" strokeWidth={3} />
                                                    <span className="text-4xl font-black text-[#003249] tracking-tighter italic uppercase group-hover:text-[#007ea7] transition-colors leading-none">₹{policy.premiumAmount?.toLocaleString()}</span>
                                                  </div>
                                              </div>
                                              <div className="flex justify-between items-center opacity-40 border-t border-slate-100 pt-6">
                                                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-[6px] italic leading-none">COVERAGE_LIMIT</span>
                                                   <span className="text-sm font-black text-[#003249] uppercase tracking-widest italic leading-none">₹{policy.coverageAmount?.toLocaleString()}</span>
                                              </div>
                                          </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-6">
                                        <button className="h-18 bg-[#003249] text-[#80ced7] rounded-[2rem] font-black text-[11px] uppercase tracking-[6px] hover:bg-[#007ea7] hover:text-white transition-all shadow-3xl active:scale-95 flex items-center justify-center gap-4 group/btn border-2 border-white/5 relative overflow-hidden italic">
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                                            DEPLOY <Zap size={18} fill="currentColor" strokeWidth={0} className="group-hover/btn:animate-pulse relative z-10" />
                                        </button>
                                        <button className="h-18 bg-white border-2 border-slate-100 rounded-[2rem] font-black text-[11px] uppercase tracking-[6px] hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group/btn text-[#003249] italic">
                                            EXTRACT_SPEC <ArrowUpRight size={22} strokeWidth={4} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-500" />
                                        </button>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Zero State */}
            {(!filteredPolicies || filteredPolicies.length === 0) && (
                <div className="text-center py-60">
                    <Reveal direction="up">
                        <Command size={100} className="mx-auto mb-10 opacity-5 text-[#003249] animate-pulse" strokeWidth={1} />
                        <p className="text-[14px] font-black uppercase tracking-[10px] text-slate-400 italic">No policies yet. Create your first policy!</p>
                    </Reveal>
                </div>
            )}

            {/* Sync Feed Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Globe size={20} strokeWidth={3} className="text-[#007ea7]" /> Multi-Region_Deployment_Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Catalog_Integrity_Verified
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Node_Directory_Synced
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Sync_Latency: 0.12ms
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentPolicies;
