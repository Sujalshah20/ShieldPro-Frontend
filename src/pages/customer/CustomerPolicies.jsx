import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Shield, ShieldCheck, Zap, Activity, 
    Truck, Home, Globe, FileText,
    TrendingUp, Calendar, Clock, ArrowUpRight,
    Target, Cpu, Satellite, Lock, Command
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

    if (isLoading) return <div className="p-8"><TableSkeleton rows={5} cols={4} /></div>;

    return (
        <div className="customer-policies p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#10221c] min-h-screen relative overflow-hidden">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #FF5A00 1px, transparent 0)`, backgroundSize: '50px 50px' }} />
            
            <div className="absolute top-[-10%] left-[-10%] opacity-[0.05] pointer-events-none animate-spin-slow">
                <Satellite size={800} className="text-accent rotate-45" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-accent rounded-full shadow-[0_0_20px_#FF5A00]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                ACTIVE<span className="text-accent tracking-normal">_SAFEGUARDS</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Monitor deployed protection assets & real-time coverage metrics
                        </p>
                    </div>
                    
                    <div className="px-10 py-6 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-accent/20 shadow-2xl flex items-center gap-8 backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[4px] opacity-40 italic leading-none">DEPLOYED_NODES</span>
                            <span className="text-3xl font-black italic tracking-tighter text-accent leading-none mt-2">{myPolicies.length}</span>
                        </div>
                        <div className="w-px h-10 bg-border/50" />
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <ShieldCheck size={24} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </Reveal>

            {myPolicies.length === 0 ? (
                <div className="text-center py-60 bg-white/50 dark:bg-zinc-900/30 border-4 border-dashed border-border/30 rounded-[6rem] backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                        <Target size={500} className="mx-auto" />
                    </div>
                    <Shield size={120} className="mx-auto mb-10 opacity-5" />
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter opacity-10">NULL_SAFEGUARD_MATRIX</h3>
                    <p className="opacity-10 max-w-sm mx-auto mt-6 font-black uppercase text-[10px] tracking-[6px] italic leading-loose">No active protection assets detected in your current sector.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                    {myPolicies.map((p, idx) => (
                        <Reveal key={p._id} width="100%" delay={idx * 0.05} direction="up">
                            <div className="bg-white dark:bg-zinc-900/50 rounded-[4rem] border border-border/50 hover:border-accent/50 transition-all group overflow-hidden shadow-sm hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.2)] relative">
                                {/* Card Accent Glow */}
                                <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                                    <Target size={140} className="text-accent rotate-12" />
                                </div>

                                <div className="p-12 relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-xl border border-white/10 group-hover:scale-110 duration-500 ${
                                            getPolicyColor(p.policy?.policyType) === 'rose' ? 'bg-rose-500/10 text-rose-500 shadow-rose-500/20' :
                                            getPolicyColor(p.policy?.policyType) === 'accent' ? 'bg-accent/10 text-accent shadow-accent/20' :
                                            getPolicyColor(p.policy?.policyType) === 'primary' ? 'bg-primary/10 text-primary shadow-primary/20' :
                                            getPolicyColor(p.policy?.policyType) === 'emerald' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20' :
                                            getPolicyColor(p.policy?.policyType) === 'indigo' ? 'bg-indigo-500/10 text-indigo-500 shadow-indigo-500/20' :
                                            'bg-zinc-500/10 text-zinc-500 shadow-zinc-500/20'
                                        }`}>
                                            {getPolicyIcon(p.policy?.policyType)}
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="px-5 py-2 bg-zinc-100 dark:bg-white/5 border border-border/30 rounded-full text-[8px] font-black uppercase tracking-[3px] opacity-40 italic group-hover:opacity-100 transition-opacity">
                                                NODE_#{p.policyNumber}
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-black mb-5 group-hover:text-accent transition-colors leading-none italic uppercase tracking-tighter">
                                        {p.policy?.policyName}
                                    </h2>
                                    <p className="opacity-30 text-[10px] mb-12 font-black leading-relaxed uppercase tracking-[3px] italic">
                                        Protection protocol deployed in current sector. Real-time monitoring active.
                                    </p>

                                    <div className="space-y-4 mb-12">
                                        <div className="flex justify-between items-center p-8 bg-zinc-50 dark:bg-white/[0.03] rounded-[2.5rem] border border-border/20 shadow-inner group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black opacity-20 uppercase tracking-[4px] mb-1">SAFEGUARD_VALUE</span>
                                                <span className="text-3xl font-black italic tracking-tighter text-accent">₹{(p.policy?.coverageAmount / 100000).toFixed(1)}L</span>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                                                <Shield size={20} strokeWidth={3} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 px-2">
                                             <div className="flex flex-col gap-1">
                                                <span className="text-[8px] font-black opacity-20 uppercase tracking-[4px]">UPLINK_DATE</span>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="opacity-20" />
                                                    <span className="text-[10px] font-black italic tracking-tighter">{new Date(p.purchaseDate).toLocaleDateString()}</span>
                                                </div>
                                             </div>
                                             <div className="flex flex-col gap-1 items-end">
                                                <span className="text-[8px] font-black opacity-20 uppercase tracking-[4px]">EXPIRY_DELTA</span>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className="opacity-20" />
                                                    <span className="text-[10px] font-black italic tracking-tighter">{new Date(p.expiryDate).toLocaleDateString()}</span>
                                                </div>
                                             </div>
                                        </div>
                                    </div>

                                    <button className="w-full h-16 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[4px] shadow-2xl hover:bg-accent dark:hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-4 active:scale-95 italic group/btn">
                                        REVEAL_ASSET_DNA <ArrowUpRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerPolicies;