import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { 
    ShieldCheck, Activity, Zap, Globe, FileText, 
    ChevronRight, RefreshCcw, ArrowRight, Clock, CheckCircle2,
    Calendar, IndianRupee, Satellite, Fingerprint, Lock, Terminal
} from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const PolicyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: policy, isLoading } = useQuery({
        queryKey: ['policyDetails', id],
        queryFn: () => api.get(`/policies/${id}`)
    });

    const coverageItems = [
        { name: "Fire and Lightning", description: "Coverage for damage caused by fire, smoke, and lightning strikes.", icon: Zap },
        { name: "Theft and Burglary", description: "Protection against loss due to illegal entry and property theft.", icon: Lock },
        { name: "Natural Calamities", description: "Coverage for earthquakes, floods, and other natural events.", icon: Globe },
        { name: "Third Party Liability", description: "Protection against legal liabilities to third parties.", icon: ShieldCheck },
    ];

    if (isLoading) return <div className="h-screen flex items-center justify-center text-[#003249] font-black uppercase tracking-[10px] animate-pulse">Syncing_Protocol_Data...</div>;

    return (
        <div className="space-y-12 pb-20">
            {/* Header Module */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Protocol_Specification</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none text-wrap break-all">
                            {policy?.policyName} <span className="text-[#007ea7]">_SPEC</span>
                        </h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">
                            Detailed structural manifest of the identified insurance protocol and risk coverage parameters.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <button 
                        onClick={() => navigate(-1)}
                        className="h-16 px-8 border-2 border-slate-100 text-[#003249] rounded-2xl flex items-center gap-4 text-[11px] font-black uppercase tracking-[4px] hover:border-[#007ea7] transition-all italic active:scale-95 group"
                    >
                         RETURN_TO_REGISTRY <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </Reveal>
            </div>

            {/* Core Data Module */}
            <div className="grid lg:grid-cols-3 gap-10">
                <Reveal direction="up" className="lg:col-span-2">
                    <div className="saas-card relative overflow-hidden p-12 shadow-3xl border-2 border-slate-50 h-full">
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
                        
                        <div className="flex items-center gap-8 mb-16 relative z-10">
                            <div className="w-20 h-20 bg-[#003249] rounded-3xl flex items-center justify-center text-[#007ea7] shadow-4xl border border-white/5">
                                <FileText size={40} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] leading-none italic">Protocol_Manifest</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] leading-none italic">Comprehensive definition of coverage bounds</p>
                            </div>
                        </div>

                        <div className="space-y-12 relative z-10">
                            <div className="grid sm:grid-cols-2 gap-12 italic">
                                {[
                                    { label: "PROTOCOL_TYPE", val: policy?.policyType, icon: ShieldCheck },
                                    { label: "FISCAL_MONTHLY", val: `₹${policy?.premiumAmount?.toLocaleString()}`, icon: IndianRupee },
                                    { label: "COVERAGE_THRESHOLD", val: `₹${policy?.coverageAmount?.toLocaleString()}`, icon: Activity },
                                    { label: "GRID_SECTOR", val: "GLOBAL_RESIDENTIAL", icon: Globe }
                                ].map((d, i) => (
                                    <div key={i} className="space-y-4 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#007ea7] group-hover:bg-[#003249] group-hover:text-white transition-all">
                                                <d.icon size={20} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">{d.label}</span>
                                        </div>
                                        <p className="text-4xl font-black text-[#003249] tracking-tighter uppercase group-hover:translate-x-2 transition-transform duration-500">{d.val}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-10 bg-slate-50/50 rounded-[2.5rem] border-2 border-slate-50 space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] italic leading-none">DESCRIPTION_CORE</h4>
                                <p className="text-lg font-black text-[#003249]/80 uppercase tracking-tighter italic leading-relaxed">
                                    {policy?.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="saas-card bg-[#003249] text-white p-12 border border-white/5 shadow-5xl h-full flex flex-col justify-between overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-[4000ms]">
                            <Zap size={200} />
                        </div>
                        
                        <div className="space-y-12 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-12 bg-[#80ced7] rounded-full group-hover:h-16 transition-all" />
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Security_<br />Calibrations</h3>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[4px]">
                                        <span className="text-slate-400">Auth_Integrity</span>
                                        <span className="text-emerald-400">100%_SECURE</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-full" />
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[4px]">
                                        <span className="text-slate-400">Risk_Assessment</span>
                                        <span className="text-amber-400">NOMINAL_VAL</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[65%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-[#80ced7]/20 transition-all">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Grid_Uptime</span>
                                    <span className="text-xl font-black text-[#80ced7] italic">99.9%</span>
                                </div>
                                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-[#80ced7]/20 transition-all">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Sync_Rate</span>
                                    <span className="text-xl font-black text-[#80ced7] italic">1.2ms</span>
                                </div>
                            </div>
                            <button className="w-full h-16 bg-[#80ced7] text-[#003249] rounded-2xl flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[5px] hover:bg-white transition-all shadow-xl italic">
                                <Clock size={20} strokeWidth={3} /> INITIALIZE_RECALIBRATION
                            </button>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Sub-Manifest Module */}
            <div className="grid lg:grid-cols-2 gap-10">
                 <Reveal direction="up">
                    <div className="saas-card p-12 border-2 border-slate-50 shadow-3xl">
                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003249] shadow-inner">
                                <Layers size={28} strokeWidth={2.5} />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tighter text-[#003249] italic">Protocol_Layers</h4>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 italic">
                            {coverageItems.map((item, i) => (
                                <div key={i} className="p-8 bg-slate-50/50 rounded-[2rem] border-2 border-slate-50 hover:border-[#007ea7]/20 transition-all group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#007ea7] shadow-sm mb-6 group-hover:rotate-12 transition-transform">
                                        <item.icon size={24} strokeWidth={2.5} />
                                    </div>
                                    <h5 className="font-black text-[#003249] uppercase tracking-tighter mb-2">{item.name}</h5>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                 </Reveal>

                 <Reveal direction="up" delay={0.2}>
                    <div className="saas-card relative overflow-hidden p-12 shadow-3xl border-2 border-slate-50 flex flex-col justify-between italic">
                        <div className="space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-xl border border-white/5">
                                    <Fingerprint size={28} strokeWidth={2.5} />
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tighter text-[#003249] italic">Protocol_Authorization</h4>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 p-6 bg-emerald-50 border-2 border-emerald-50 rounded-2xl">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[4px] leading-none mb-1">Clearance_Status</p>
                                        <p className="text-xs font-black text-[#003249] uppercase tracking-widest leading-none">AUTHENTICATED_SYSTEM_ROOT</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 p-6 bg-slate-50 border-2 border-slate-50 rounded-2xl">
                                    <div className="w-3 h-3 bg-slate-300 rounded-full" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] leading-none mb-1">Operational_Mode</p>
                                        <p className="text-xs font-black text-[#003249] uppercase tracking-widest leading-none">READ_WRITE_MANIFEST</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-slate-50 flex flex-wrap justify-center gap-12 text-[10px] font-black text-[#003249] uppercase tracking-[5px] opacity-30 mt-10">
                            <div className="flex items-center gap-3"><Terminal size={14} /> Mainframe_Link: ACTIVE</div>
                            <div className="flex items-center gap-3"><Satellite size={14} /> Grid_Sync: NOMINAL</div>
                        </div>
                    </div>
                 </Reveal>
            </div>
        </div>
    );
};

export default PolicyDetails;