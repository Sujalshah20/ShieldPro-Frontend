import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Database, Zap,
    Activity, Fingerprint,
    Command, Layout, Info,
    Power, AlertTriangle, RefreshCcw, Save, ClipboardList, ShieldCheck,
    Cpu, Globe, HardDrive, Terminal, Award, ChevronRight,
    ArrowUpRight, Target, Layers, Satellite, BarChart3, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminSettings = () => {
    const { toast } = useToast();
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [baselineYield, setBaselineYield] = useState(15);
    const [securityLevel, setSecurityLevel] = useState("Standard Protection");
    const [activeTab, setActiveTab] = useState('general');

    const handleSaveProtocols = () => {
        toast({
            title: "PROTOCOLS_SYNCHRONIZED",
            description: "Mainframe configurations have been successfully distributed across all orbital nodes.",
            variant: "default"
        });
    };

    const handleToggleMaintenance = () => {
        setIsMaintenance(!isMaintenance);
        toast({
            title: isMaintenance ? "OPERATIONAL_READY" : "MAINTENANCE_ACTIVE",
            description: isMaintenance ? "System services are now live for all global operatives." : "Primary uplink restricted to level-5 administrative nodes only.",
            variant: isMaintenance ? "default" : "destructive"
        });
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[#007ea7] rounded-full" />
                            <span className="text-[9px] font-black uppercase tracking-[4px] text-[#007ea7] italic leading-none">Security_Protocol_Manager</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Core <span className="text-[#007ea7]">Protocols_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-[10px] italic leading-relaxed">Global platform configuration manager and high-security mainframe settings. Access Level: <span className="text-[#007ea7]">SUPER_ADMIN</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-50 shadow-inner group hover:border-[#007ea7]/20 transition-all duration-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse" />
                        <span className="text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">MAINFRAME_UPLINK_STABLE</span>
                    </div>
                </Reveal>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="xl:col-span-3 space-y-4">
                    <Reveal direction="up">
                        <div className="space-y-3">
                            {[
                                { id: 'general', label: 'SYSTEM_CONFIGURATION', icon: Settings },
                                { id: 'security', label: 'THREAT_COMPLIANCE', icon: ShieldCheck },
                                { id: 'notifications', label: 'UPLINK_ALERTS', icon: Bell },
                                { id: 'yield', label: 'PRICING_MAINFRAME', icon: Zap },
                                { id: 'database', label: 'DATA_CLUSTERS', icon: Database },
                            ].map((item) => (
                                <div 
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group relative overflow-hidden ${
                                        activeTab === item.id 
                                        ? 'bg-[#003249] text-white border-[#003249] shadow-xl translate-x-2' 
                                        : 'bg-white border-slate-50 hover:border-[#007ea7]/30 hover:translate-x-1'
                                    }`}
                                >
                                     {/* Selection Glow */}
                                    {activeTab === item.id && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#007ea7]/20 to-transparent pointer-events-none" />
                                    )}

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center shadow-lg ${activeTab === item.id ? 'bg-[#007ea7] text-white rotate-6' : 'bg-slate-50 text-slate-300 group-hover:bg-[#003249] group-hover:text-[#007ea7]'}`}>
                                                <item.icon size={18} strokeWidth={3} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-[3px] italic ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#003249]'}`}>{item.label}</span>
                                        </div>
                                        {activeTab === item.id && <ChevronRight size={14} strokeWidth={4} className="text-[#007ea7] animate-pulse" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal direction="up" delay={0.3}>
                        <div className="p-6 bg-[#003249] text-white rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl mt-6 transition-all duration-700 hover:scale-[1.02]">
                            <div className="absolute top-[-5%] right-[-5%] opacity-10 pointer-events-none transform rotate-12 transition-transform duration-[4000ms] group-hover:scale-125">
                                <Cpu size={120} className="text-white" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-tight mb-6 relative z-10 flex items-center gap-4 text-[#80ced7] italic">
                                <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-[#007ea7] border border-white/5 shadow-inner group-hover:rotate-180 transition-transform duration-1000">
                                    <Activity size={18} strokeWidth={3} />
                                </div> 
                                SYSTEM_VITALITY
                            </h4>
                            <div className="space-y-6 relative z-10 font-black">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[8px] uppercase tracking-[3px] text-white/40 italic leading-none">
                                        <span>MAINFRAME_UPTIME</span>
                                        <span className="text-emerald-500 shadow-[0_0_8px_#10b981]">100.0%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                                        <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_15px_#10b981]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors shadow-inner text-center">
                                        <p className="text-[7px] text-white/30 uppercase tracking-[3px] mb-1 italic">LATENCY</p>
                                        <p className="text-xl font-black text-[#007ea7] italic tracking-tighter leading-none">12.4MS</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors shadow-inner text-center">
                                        <p className="text-[7px] text-white/30 uppercase tracking-[3px] mb-1 italic">NODES</p>
                                        <p className="text-xl font-black text-white italic tracking-tighter leading-none">642</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Configuration Panel */}
                <div className="xl:col-span-9 space-y-8">
                    <Reveal direction="up">
                        <div className="saas-card !p-0 overflow-hidden shadow-2xl border-2 border-slate-50">
                            <div className="p-6 border-b-2 border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-slate-50/20 relative">
                                 {/* Decorative Grid */}
                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

                                 <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] shadow-xl border border-white/5">
                                        <Globe size={24} strokeWidth={2.5} className="animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Global Mainframe Config</h3>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[3px] italic opacity-60">Calibrate core logic across global clusters</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4 relative z-10">
                                    <div className="hidden lg:flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-xl border-2 border-emerald-50 shadow-lg">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[3px] italic">SECURE_AUTH_LEVEL_5</span>
                                    </div>
                                 </div>
                            </div>

                            <div className="p-8 space-y-10 relative z-10">
                                {/* Maintenance Toggle */}
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 p-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-slate-50 transition-all hover:bg-white hover:border-[#007ea7]/30 group shadow-inner">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-5 rounded-2xl transition-all duration-1000 ${isMaintenance ? 'bg-rose-600 rotate-[360deg] shadow-rose-500/20' : 'bg-[#003249] shadow-xl'} text-white border-2 border-white/10 group-hover:scale-110`}>
                                            <Power size={28} strokeWidth={3} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black uppercase tracking-tighter text-[#003249] leading-none mb-1 italic">Isolation Protocol</h4>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] italic leading-relaxed">Restrict network access during critical system updates.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleToggleMaintenance}
                                        className={`h-14 px-8 rounded-2xl font-black text-[11px] uppercase tracking-[5px] transition-all border-2 flex items-center justify-center gap-4 shadow-xl active:scale-95 italic ${
                                            isMaintenance 
                                            ? 'bg-rose-600 text-white border-rose-500 hover:bg-rose-700 shadow-rose-500/20' 
                                            : 'bg-[#003249] text-white border-[#003249] hover:bg-[#007ea7] hover:border-[#007ea7] shadow-lg'
                                        }`}
                                    >
                                        {isMaintenance ? 'ABORT_ISOLATION' : 'INITIATE_ISOLATION'}
                                        <AlertTriangle size={18} strokeWidth={3} className={isMaintenance ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'} />
                                    </button>
                                </div>

                                {/* Commission Yield Input */}
                                <div className="space-y-6 group">
                                    <div className="flex items-center justify-between px-6">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none block">Yield Matrix weight</label>
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[4px] italic">CALIBRATING_OPERATOR_YIELD_DELTA</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                             <div className="w-1.5 h-12 bg-[#007ea7] rounded-full hidden md:block shadow-[0_0_15px_#007ea7] animate-pulse" />
                                             <div className="relative">
                                                 <div className="absolute inset-0 bg-[#007ea7]/10 blur-xl rounded-full" />
                                                 <span className="text-4xl font-black tracking-tighter text-[#003249] bg-white px-8 py-4 rounded-2xl border-2 border-slate-100 shadow-lg transition-all group-hover:scale-110 group-hover:text-[#007ea7] italic leading-none block relative z-10">{baselineYield}.0%</span>
                                             </div>
                                        </div>
                                    </div>
                                    <div className="relative p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-slate-50 transition-all hover:bg-slate-50 shadow-inner group/range">
                                         {/* Decorative Marks */}
                                        <div className="absolute top-1/2 left-10 right-10 h-2 mt-[-1px] flex justify-between pointer-events-none px-2">
                                            {[...Array(11)].map((_, i) => (
                                                <div key={i} className={`w-0.5 h-4 rounded-full transition-all duration-700 ${i * 5 <= baselineYield ? 'bg-[#007ea7]' : 'bg-slate-200'}`} />
                                            ))}
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="50" 
                                            value={baselineYield}
                                            onChange={(e) => setBaselineYield(e.target.value)}
                                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#007ea7] relative z-20 border-2 border-white shadow-inner transition-all hover:accent-[#003249]"
                                        />
                                        <div className="flex justify-between mt-6 text-[8px] font-black text-slate-300 uppercase tracking-[5px] italic">
                                            <span>MIN_CAP_0.0</span>
                                            <span className="text-[#007ea7] flex items-center gap-2 animate-pulse"><Zap size={10} strokeWidth={3} /> OPTIMAL_SYNC_RATIO</span>
                                            <span>MAX_CAP_50.0</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Level Select */}
                                <div className="space-y-8">
                                    <div className="space-y-1 px-6">
                                        <label className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none block">Clearance Matrix</label>
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[4px] italic">VERIFYING_GLOBAL_ENCRYPTION_PARAMETERS</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {['Standard Protection', 'Advanced Security', 'Enterprise Compliance', 'Maximum Security'].map((level) => (
                                            <motion.div 
                                                key={level}
                                                whileHover={{ scale: 1.02, y: -4 }}
                                                onClick={() => setSecurityLevel(level)}
                                                className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 group relative overflow-hidden cursor-pointer ${
                                                    securityLevel === level 
                                                    ? 'bg-[#007ea7]/5 border-[#007ea7] shadow-lg' 
                                                    : 'bg-white border-slate-50 hover:border-[#007ea7]/30 shadow-md'
                                                }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all shadow-lg ${
                                                    securityLevel === level ? 'bg-[#007ea7] text-white border-white/20 rotate-6' : 'bg-slate-50 border-slate-100 text-slate-300 group-hover:bg-[#003249] group-hover:text-[#007ea7]'
                                                }`}>
                                                    <Target size={24} strokeWidth={3} />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className={`text-[12px] font-black uppercase tracking-[3px] italic leading-none block ${securityLevel === level ? 'text-[#003249]' : 'text-slate-400 group-hover:text-slate-600'}`}>{level}</span>
                                                    {securityLevel === level ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-[#007ea7] rounded-full animate-ping" />
                                                            <span className="text-[8px] font-black text-[#007ea7] uppercase tracking-[3px] italic">ACTIVE</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[3px] italic">READY</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50 border-t-2 border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
                                 <div className="flex items-center gap-4 opacity-40 group/sync">
                                    <RefreshCcw size={20} className="text-[#007ea7] animate-spin-slow group-hover/sync:rotate-[360deg] transition-all duration-[2000ms]" strokeWidth={3} />
                                    <span className="text-[9px] font-black uppercase tracking-[4px] text-[#003249] italic max-w-sm">Awaiting multi-node synchronization sweep across core clusters...</span>
                                 </div>
                                 <button 
                                    onClick={handleSaveProtocols}
                                    className="h-14 px-10 bg-[#003249] text-white rounded-2xl text-[11px] font-black uppercase tracking-[6px] flex items-center justify-center gap-4 shadow-xl hover:bg-[#007ea7] transition-all active:scale-95 group italic overflow-hidden relative"
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                    SYNC_PROTOCOLS <Save size={18} strokeWidth={3} className="text-[#80ced7] group-hover:text-white transition-colors" />
                                 </button>
                            </div>
                        </div>
                    </Reveal>

                    {/* Admin Log Terminal */}
                    <Reveal direction="up" delay={0.2}>
                        <div className="saas-card bg-[#003249] text-white rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative group p-8 transition-all duration-700 hover:bg-[#002a3a]">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none transform rotate-12 transition-transform duration-[5000ms] group-hover:scale-125">
                                 <Shield size={200} />
                            </div>
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 relative z-10">
                                <h4 className="text-xl font-black uppercase tracking-tighter flex items-center gap-6 leading-none italic text-[#80ced7]">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#007ea7] border border-white/5 shadow-xl group-hover:rotate-[360deg] transition-all duration-1000">
                                        <Terminal size={24} strokeWidth={3} />
                                    </div>
                                    Mainframe Operational Log
                                </h4>
                                <div className="px-5 py-2 bg-white/10 rounded-xl border border-white/10 text-[8px] font-black uppercase tracking-[4px] italic text-sky-400 animate-pulse text-center">
                                    LIVE_STREAM_V4.2
                                </div>
                            </div>
                            
                            <div className="space-y-6 relative z-10 max-h-[300px] overflow-y-auto no-scrollbar pr-6 border-l-2 border-[#007ea7]/20 pl-8 ml-6 custom-scrollbar-v2">
                                {[
                                    { event: 'PROTOCOL_UPDATE', status: 'SUCCESS', node: 'SAT_UPLINK_01', time: '12:04:12', icon: Satellite },
                                    { event: 'MATRIX_CALIBRATION', status: 'SYNCHRONIZING', node: 'CORE_ENGINE', time: '12:04:11', icon: Activity },
                                    { event: 'PERIMETER_SCAN', status: 'SUCCESS', node: 'SHIELD_PRO_V3', time: '12:04:09', icon: ShieldCheck },
                                    { event: 'UNAUTHORIZED_PING', status: 'MITIGATED', node: 'SECURE_GATEWAY', time: '12:04:05', icon: AlertTriangle },
                                    { event: 'ASSET_RECONCILIATION', status: 'SUCCESS', node: 'FINANCE_NODE_B', time: '12:04:01', icon: BarChart3 },
                                 ].map((log, i) => (
                                    <div key={i} className="flex flex-col gap-3 group/log cursor-pointer relative">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-[-38px] top-1 w-2.5 h-2.5 bg-[#003249] border-2 border-[#007ea7] rounded-full z-20 group-hover/log:scale-150 transition-transform" />

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : log.status === 'MITIGATED' ? 'bg-amber-500/10 text-amber-500' : 'bg-[#007ea7]/10 text-[#007ea7]'}`}>
                                                    <log.icon size={14} strokeWidth={3} />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-[3px] group-hover/log:text-[#007ea7] transition-all duration-500 leading-none">{log.event}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[3px] italic">{log.time}</span>
                                                <span className={`text-[8px] font-black px-3 py-1 rounded-lg border italic ${
                                                    log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10 shadow-[0_0_10px_#10b98120]' : 
                                                    log.status === 'MITIGATED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 'bg-[#007ea7]/10 text-[#007ea7] border-[#007ea7]/10 animate-pulse'
                                                }`}>{log.status}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 ml-10">
                                             <div className="w-4 h-px bg-white/10" />
                                             <span className="text-[8px] font-black text-white/20 uppercase tracking-[3px] italic">ORIGIN_NODE::{log.node}</span>
                                        </div>
                                        {i !== 4 && <div className="h-px bg-white/5 mt-3 w-full group-hover/log:bg-white/10 transition-colors" />}
                                    </div>
                                 ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-8 opacity-30 pt-8 border-t-2 border-slate-50">
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Fingerprint size={16} strokeWidth={3} className="text-[#007ea7]" /> Protocol_Audit_Verified
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Layers size={16} strokeWidth={3} className="text-[#007ea7]" /> Mainframe_Static_Active
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#003249] uppercase tracking-[4px] italic">
                        <Zap size={16} strokeWidth={3} className="text-[#007ea7]" /> Sync_Latency: 0.04ms
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminSettings;
