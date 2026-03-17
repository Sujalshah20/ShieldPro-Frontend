import React from "react";
import { 
    Users, FileText, 
    ArrowUpRight, ArrowDownRight, 
    Filter, MoreHorizontal, ArrowRight,
    Database, TrendingUp, Plus, Activity, Terminal, Fingerprint, Layers,
    Cpu, Globe, Lock, Search, RefreshCcw, ChevronRight, FileCheck
} from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const AdminDashboard = () => {
    const stats = [
        { label: "Net_Premiums", value: "$4.82M", trend: "+12.5%", icon: Database, trendUp: true, tag: "FISCAL_NODE" },
        { label: "Loss_Ratio", value: "62.4%", trend: "+8.2%", icon: TrendingUp, trendUp: true, tag: "RISK_INDEX" },
        { label: "Pending_Vetting", value: "156", trend: "-3.1%", icon: FileText, trendUp: false, tag: "QUEUE_LOAD" },
        { label: "Authorized_Nodes", value: "12,842", trend: "+6.8%", icon: Users, trendUp: true, tag: "GRID_EXPANSION" },
    ];

    const policies = [
        { id: "POL-88219", client: "Jane Doe", type: "Auto", status: "Active", premium: "₹24,500.00", date: "Oct 12, 2026", node: "MUM_SEC_01" },
        { id: "POL-88220", client: "Robert King", type: "Life", status: "Pending", premium: "₹48,200.00", date: "Nov 05, 2026", node: "DEL_HUB_42" },
        { id: "POL-88221", client: "Linda Meyer", type: "Health", status: "Active", premium: "₹11,500.00", date: "Sep 18, 2026", node: "BLR_CORE_09" },
        { id: "POL-88222", client: "Arthur Taylor", type: "Auto", status: "Expired", premium: "₹82,000.00", date: "Aug 30, 2026", node: "HYD_ARC_11" },
    ];

    return (
        <div className="space-y-10 pb-16">
            {/* Header Module */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <Reveal direction="left">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-[#007ea7] rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-[#007ea7] italic leading-none">Global_Command_Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Mainframe <span className="text-[#007ea7]">Overview_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-[2px] text-[10px] italic leading-relaxed">Centralized infrastructure monitoring and security protocol management. Current Grid Health: <span className="text-emerald-500">OPTIMIZED</span></p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex flex-wrap items-center gap-4">
                         <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl shadow-inner group hover:border-[#007ea7]/20 transition-all">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none mb-0.5">Grid_Uplink</span>
                                <span className="text-[9px] font-black text-[#003249] uppercase tracking-[2px] italic">NOMINAL_SYNC</span>
                            </div>
                        </div>
                        <button className="h-12 px-6 bg-[#003249] text-[#80ced7] rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[3px] hover:bg-[#007ea7] hover:text-white transition-all shadow-xl active:scale-95 italic group">
                             <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> New_Protocol
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* Metrics Chassis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="saas-card group relative p-6 border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[220px] flex flex-col justify-between overflow-hidden">
                            {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000">
                                 <s.icon size={100} className="text-[#003249]" />
                            </div>
                            
                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-12 h-12 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] shadow-xl group-hover:rotate-6 group-hover:scale-105 transition-all duration-500 border border-white/5">
                                    <s.icon size={22} strokeWidth={3} />
                                </div>
                                <div className={`flex flex-col items-end`}>
                                    <div className={`text-[8px] font-black flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 ${s.trendUp ? 'text-emerald-500 bg-emerald-50 border-emerald-50' : 'text-rose-500 bg-rose-50 border-rose-50'} shadow-sm group-hover:scale-105 transition-transform uppercase`}>
                                        {s.trendUp ? <ArrowUpRight size={12} strokeWidth={4} /> : <ArrowDownRight size={12} strokeWidth={4} />}
                                        {s.trend}
                                    </div>
                                    <span className="text-[6px] font-black text-slate-300 uppercase tracking-[3px] mt-1.5 italic leading-none">{s.tag}</span>
                                </div>
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] mb-2 italic flex items-center gap-2">
                                    <Terminal size={10} className="text-[#007ea7]" /> {s.label}
                                </p>
                                <h3 className="text-3xl font-black text-[#003249] tracking-tighter italic uppercase group-hover:text-[#007ea7] transition-colors">{s.value}</h3>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Command Grid & Logs Split */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Main Registry Table */}
                <Reveal direction="up" className="xl:col-span-8">
                    <div className="saas-card !p-0 overflow-hidden shadow-2xl border-2 border-slate-50 flex flex-col h-full">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-6 relative">
                             {/* Tactical Background Element */}
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
                            
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-12 h-12 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] shadow-xl border border-white/5 group-hover:rotate-6 transition-transform">
                                    <Activity size={24} strokeWidth={3} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-[#003249] leading-none italic">Protocol_Registry</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[3px] leading-none italic opacity-60">Real-time status tracking of all grid deployments</p>
                                </div>
                            </div>
                            <div className="flex gap-3 relative z-10">
                                 <div className="relative group/search">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-[#007ea7] transition-colors" size={14} strokeWidth={3} />
                                    <input 
                                        type="text" 
                                        placeholder="FILTER..." 
                                        className="h-10 w-40 bg-white border-2 border-slate-100 rounded-xl pl-10 pr-4 text-[9px] font-black uppercase tracking-[2px] text-[#003249] focus:border-[#007ea7] focus:ring-4 focus:ring-[#007ea7]/5 outline-none transition-all italic"
                                    />
                                 </div>
                                 <button className="h-10 px-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[2px] bg-white text-[#003249] border-2 border-slate-100 rounded-xl hover:border-[#007ea7] transition-all italic shadow-sm">
                                    <RefreshCcw size={14} strokeWidth={3} className="text-[#007ea7]" /> SYNC
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto relative z-10">
                            <table className="w-full text-left">
                                <thead className="bg-[#f8fafb]">
                                    <tr className="border-b border-slate-50 uppercase tracking-[3px] text-[9px] font-black text-slate-400 italic font-mono">
                                        <th className="px-8 py-6">CMD_ID</th>
                                        <th className="px-8 py-6">OPERATIVE_MANIFEST</th>
                                        <th className="px-8 py-6">PROTOCOL_TIER</th>
                                        <th className="px-8 py-6 text-center">LIFECYCLE</th>
                                        <th className="px-10 py-6">FISCAL_VAL</th>
                                        <th className="px-8 py-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {policies.map((p, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-all duration-500 group cursor-pointer relative">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-[#007ea7] italic tracking-tight group-hover:translate-x-1 transition-transform inline-block uppercase">#{p.id.split('-')[1]}</span>
                                                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest mt-0.5 italic">{p.node}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] font-black text-sm shadow-xl group-hover:scale-105 group-hover:rotate-3 transition-all border border-white/5">
                                                        {p.client.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-black text-[#003249] uppercase tracking-tighter italic leading-none mb-0.5 group-hover:text-[#007ea7] transition-colors">{p.client}</span>
                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic opacity-40">VERIFIED_HOLDER_0{i+1}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border-2 border-slate-50 w-fit group-hover:border-[#007ea7]/20 transition-all shadow-sm">
                                                    <div className="w-1.5 h-1.5 bg-[#007ea7] rounded-full group-hover:animate-pulse" />
                                                    <span className="text-[9px] font-black text-[#003249] uppercase tracking-[3px] italic">{p.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[3px] border shadow-md italic ${
                                                    p.status === 'Active' ? 'text-emerald-500 bg-emerald-50 border-emerald-50' :
                                                    p.status === 'Pending' ? 'text-amber-500 bg-amber-50 border-amber-50' :
                                                    'text-rose-500 bg-rose-50 border-rose-50'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-base font-black text-[#003249] italic tracking-tight">{p.premium}</td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-[#007ea7] hover:bg-white rounded-lg transition-all shadow-sm"><MoreHorizontal size={18} strokeWidth={3} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-6 bg-[#f8fafb] border-t border-slate-50 flex justify-center">
                            <button className="text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic hover:text-[#007ea7] flex items-center gap-3 group transition-all">
                                VIEW_FULL_REGISTRY_MANIFEST <ChevronRight size={14} className="group-hover:translate-x-1.5 transition-transform" strokeWidth={4} />
                            </button>
                        </div>
                    </div>
                </Reveal>

                {/* Right Module Stack */}
                <div className="xl:col-span-4 space-y-10">
                     {/* Asset Calibrator */}
                     <Reveal direction="right">
                        <div className="saas-card relative overflow-hidden group p-12 shadow-3xl border-2 border-slate-50">
                             {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-150 transition-transform duration-[4000ms]">
                                 <Cpu size={150} className="text-[#003249]" />
                            </div>

                            <div className="flex items-center gap-6 mb-12 relative z-10">
                                <div className="w-16 h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl flex items-center justify-center text-[#003249] shadow-inner group-hover:bg-[#003249] group-hover:text-[#007ea7] transition-all duration-500">
                                    <Layers size={32} strokeWidth={3} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Grid_Liquidity</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] leading-none italic opacity-60 italic">Real-time resource calibration index</p>
                                </div>
                            </div>
                            
                            <div className="space-y-10 relative z-10">
                                {[
                                    { label: "Vetting_Queue", val: 78, color: "bg-[#007ea7]", icon: FileCheck },
                                    { label: "Critical_Delta", val: 42, color: "bg-[#003249]", icon: Activity },
                                    { label: "Settlement_Sync", val: 91, color: "bg-[#80ced7]", icon: Zap }
                                ].map((q, i) => (
                                    <div key={i} className="group/stat">
                                        <div className="flex justify-between items-end mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-[5px] text-slate-400 italic leading-none group-hover/stat:text-[#003249] transition-colors">{q.label}</span>
                                            </div>
                                            <span className="text-xl font-black text-[#003249] italic tracking-tighter leading-none">{q.val}%</span>
                                        </div>
                                        <div className="h-4 bg-slate-50 border-2 border-slate-50 rounded-full overflow-hidden shadow-inner p-0.5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${q.val}%` }}
                                                transition={{ duration: 2, ease: "circOut", delay: i * 0.2 }}
                                                className={`h-full ${q.color} rounded-full shadow-[0_0_15px_rgba(0,126,167,0.4)] relative`} 
                                            >
                                                <div className="absolute top-0 right-0 w-2 h-full bg-white/20 animate-pulse" />
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </Reveal>

                    {/* Operational Terminal Logs */}
                    <Reveal direction="right" delay={0.2}>
                        <div className="saas-card relative overflow-hidden p-8 shadow-xl border-2 border-slate-50 flex flex-col min-h-[400px]">
                            {/* Terminal Grid Background */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                 <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] shadow-xl border border-white/5">
                                        <Terminal size={24} strokeWidth={3} className="animate-pulse" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Event_Stream</h3>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[3px] leading-none italic opacity-60">High-velocity telemetry logs</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 relative z-10 flex-1">
                                {[
                                    { title: "Service Request #CLM-9021 Inbound", detail: "Property damage sync initialized for POL-88210.", time: "2h ago", color: "#007ea7", tag: "INCIDENT" },
                                    { title: "Protocol Renewal Synchronized", detail: "Automatic settlement for Client: Jane Doe completed.", time: "5h ago", color: "#10b981", tag: "SYSTEM" },
                                    { title: "New Node Authorization", detail: "Field Agent: Wright, A. registered new asset class.", time: "8h ago", color: "#f59e0b", tag: "GATEWAY" },
                                ].map((act, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentcolor] group-hover:scale-125 transition-transform`} style={{ color: act.color, backgroundColor: act.color }} />
                                            <div className="w-0.5 flex-1 bg-slate-50 group-last:bg-transparent" />
                                        </div>
                                        <div className="flex-1 pb-8 group-last:pb-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-[13px] font-black text-[#003249] uppercase tracking-tighter italic group-hover:text-[#007ea7] transition-colors">{act.title}</p>
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">{act.time}</span>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[1.5px] leading-relaxed italic mb-2 opacity-60">{act.detail}</p>
                                            <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[6px] font-black text-slate-400 uppercase tracking-widest italic">{act.tag}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                             <button className="mt-8 w-full h-12 bg-[#003249] text-[#007ea7] rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[3px] hover:bg-[#007ea7] hover:text-white transition-all shadow-lg active:scale-95 italic group relative overflow-hidden">
                                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                 UPSTREAM_CONSOLE <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Footer Metadata */}
            <Reveal direction="up" delay={0.5}>
                <div className="flex flex-wrap justify-center gap-10 opacity-30 pt-10 border-t border-slate-50 pb-10">
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Fingerprint size={16} strokeWidth={3} className="text-[#007ea7]" /> Mainframe_Auth_Verified
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Globe size={16} strokeWidth={3} className="text-[#007ea7]" /> Global_Grid_Presence
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Lock size={16} strokeWidth={3} className="text-[#007ea7]" /> Quantum_Layer_Active
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminDashboard;
