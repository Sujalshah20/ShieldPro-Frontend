import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Shield, ShieldCheck, Zap, Activity, 
    Truck, Home, Globe, FileText,
    TrendingUp, Calendar, Clock, ArrowUpRight,
    Target, Cpu, Satellite, Lock, Command,
    Fingerprint, Terminal, HeartPulse, ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";
import { TableSkeleton } from "../../components/common/Skeleton";
import Reveal from "../../components/common/Reveal";

const CustomerPolicies = () => {
    const { user } = useContext(AuthContext);

    const { data: myPolicies = [], isLoading } = useQuery({
        queryKey: ['myPolicies', user?.token],
        queryFn: () => api.get('/user-policies', user.token),
        enabled: !!user?.token
    });

    const getPolicyIcon = (type) => {
        switch(type) {
            case 'Health': return <HeartPulse size={24} strokeWidth={2.5} />;
            case 'Vehicle': case 'Auto': return <Truck size={24} strokeWidth={2.5} />;
            case 'Property': case 'Home': return <Home size={24} strokeWidth={2.5} />;
            case 'Life': return <Shield size={24} strokeWidth={2.5} />;
            case 'Travel': return <Globe size={24} strokeWidth={2.5} />;
            default: return <FileText size={24} strokeWidth={2.5} />;
        }
    };

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
             <div className="mb-10">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className="h-96 bg-white rounded-[3rem] animate-pulse shadow-xl" />)}
            </div>
        </div>
    );

    return (
        <div className="customer-policies p-4 md:p-8 bg-[#dae5e5] min-h-screen relative overflow-hidden font-display">
            {/* Mission Header */}
            <div className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-[#0082a1] rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Inventory Management Hub</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#012b3f] uppercase tracking-tight">Active_Safeguards</h1>
                    <p className="text-sm text-slate-500 font-medium italic mt-1">Real-time monitoring of deployed protection protocols & coverage metrics.</p>
                </div>
                
                <div className="max-w-xs w-full bg-[#012b3f] p-6 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-6 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                        <Satellite size={60} className="text-[#0082a1]" />
                     </div>
                     <div className="relative z-10 w-12 h-12 rounded-xl bg-[#0082a1]/20 flex items-center justify-center text-[#0082a1] shadow-inner">
                        <ShieldCheck size={28} strokeWidth={3} />
                     </div>
                     <div className="relative z-10">
                        <span className="text-[9px] font-black uppercase tracking-[4px] text-white/40 block leading-none mb-1.5">Deployed Nodes</span>
                        <span className="text-3xl font-black tracking-tighter text-[#0082a1] italic leading-none">{myPolicies.length}</span>
                     </div>
                </div>
            </div>

            {myPolicies.length === 0 ? (
                <div className="text-center py-48 bg-white/50 border-2 border-dashed border-slate-300/50 rounded-[4rem] group hover:border-[#0082a1]/50 transition-all">
                    <ShieldAlert size={80} className="mx-auto mb-8 text-slate-200 group-hover:text-[#0082a1] transition-colors" />
                    <h3 className="text-2xl font-black uppercase tracking-[10px] text-slate-300 italic mb-4">Null Safeguard Matrix</h3>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-[5px] max-w-sm mx-auto">No active protection assets detected in your current sector. Deploayment required.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {myPolicies.map((p, idx) => (
                        <motion.div 
                            key={p._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[3rem] border border-white hover:border-[#0082a1]/30 transition-all group overflow-hidden shadow-2xl relative flex flex-col h-[480px]"
                        >
                            {/* Card Background Element */}
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
                                <Fingerprint size={180} className="text-[#012b3f]" />
                            </div>

                            <div className="p-10 relative z-10 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#0082a1]/20 blur-xl opacity-0 group-hover:opacity-40 transition-all" />
                                        <div className="relative w-16 h-16 rounded-2xl bg-[#012b3f] text-[#0082a1] flex items-center justify-center transition-all shadow-xl group-hover:rotate-6">
                                            {getPolicyIcon(p.policy?.policyType)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 text-right">
                                        <div className="px-4 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black uppercase tracking-[3px] text-slate-400 group-hover:bg-[#012b3f] group-hover:text-white transition-all">
                                            #{p.policyNumber}
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black mb-4 group-hover:text-[#0082a1] transition-colors leading-none uppercase tracking-tight italic">
                                    {p.policy?.policyName}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest mb-10">
                                    Protection Protocol ID: <span className="text-[#012b3f]">DEPLOYED_V4.2</span>. Neural Monitoring Active.
                                </p>

                                <div className="space-y-4 mb-10 mt-auto">
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors relative overflow-hidden">
                                        <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.1] group-hover:scale-110 transition-transform">
                                            <Target size={80} className="text-[#012b3f]" />
                                        </div>
                                        <div className="flex flex-col relative z-10">
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[4px] mb-1">Safeguard Valuation</span>
                                            <span className="text-3xl font-black italic tracking-tighter text-[#012b3f]">₹{(p.policy?.coverageAmount / 100000).toFixed(1)}L</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 px-2">
                                         <div className="flex flex-col gap-1">
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[3px]">Uplink Date</span>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-[#0082a1]" />
                                                <span className="text-[10px] font-black text-[#012b3f] tracking-tight">{new Date(p.purchaseDate).toLocaleDateString()}</span>
                                            </div>
                                         </div>
                                         <div className="flex flex-col gap-1 items-end text-right">
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[3px]">Expiry Cycle</span>
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} className="text-[#0082a1]" />
                                                <span className="text-[10px] font-black text-[#012b3f] tracking-tight">{new Date(p.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                         </div>
                                    </div>
                                </div>

                                <button className="w-full h-14 bg-[#012b3f] text-[#0082a1] rounded-xl font-black text-[10px] uppercase tracking-[4px] shadow-xl hover:bg-[#0082a1] hover:text-white transition-all flex items-center justify-center gap-4 active:scale-95 border border-white/5 group/btn">
                                    REVEAL ASSET DNA <Terminal size={16} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerPolicies;