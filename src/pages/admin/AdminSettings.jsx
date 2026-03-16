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
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Security_Protocol_Manager</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Core <span className="text-[#007ea7]">Protocols_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Global platform configuration manager and high-security mainframe settings. Access Level: <span className="text-[#007ea7]">SUPER_ADMIN</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex items-center gap-6 bg-slate-50 px-10 py-5 rounded-[2.5rem] border-2 border-slate-50 shadow-inner group hover:border-[#007ea7]/20 transition-all duration-700">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
                        <span className="text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic">MAINFRAME_UPLINK_STABLE</span>
                    </div>
                </Reveal>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
                {/* Navigation Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    <Reveal direction="up">
                        <div className="space-y-6">
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
                                    className={`p-10 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${
                                        activeTab === item.id 
                                        ? 'bg-[#003249] text-white border-[#003249] shadow-3xl translate-x-4' 
                                        : 'bg-white border-slate-50 hover:border-[#007ea7]/30 hover:translate-x-2'
                                    }`}
                                >
                                     {/* Selection Glow */}
                                    {activeTab === item.id && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#007ea7]/20 to-transparent pointer-events-none" />
                                    )}

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-8">
                                            <div className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center shadow-2xl ${activeTab === item.id ? 'bg-[#007ea7] text-white rotate-12' : 'bg-slate-50 text-slate-300 group-hover:bg-[#003249] group-hover:text-[#007ea7]'}`}>
                                                <item.icon size={26} strokeWidth={3} />
                                            </div>
                                            <span className={`text-[11px] font-black uppercase tracking-[5px] italic ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#003249]'}`}>{item.label}</span>
                                        </div>
                                        {activeTab === item.id && <ChevronRight size={20} strokeWidth={4} className="text-[#007ea7] animate-pulse" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal direction="up" delay={0.3}>
                        <div className="p-12 bg-[#003249] text-white rounded-[4rem] border border-white/5 relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,50,73,0.5)] mt-12 transition-all duration-700 hover:scale-[1.02]">
                            <div className="absolute top-[-10%] right-[-10%] opacity-10 pointer-events-none transform rotate-12 transition-transform duration-[4000ms] group-hover:scale-125">
                                <Cpu size={220} className="text-white" />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tight mb-12 relative z-10 flex items-center gap-8 text-[#80ced7] italic">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#007ea7] border border-white/5 shadow-inner group-hover:rotate-180 transition-transform duration-1000">
                                    <Activity size={26} strokeWidth={3} />
                                </div> 
                                SYSTEM_VITALITY
                            </h4>
                            <div className="space-y-10 relative z-10 font-black">
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-[5px] text-white/40 italic leading-none">
                                        <span>MAINFRAME_UPTIME</span>
                                        <span className="text-emerald-500 shadow-[0_0_10px_#10b981]">100.0%</span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                                        <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_20px_#10b981]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 group-hover:bg-white/10 transition-colors shadow-inner">
                                        <p className="text-[9px] text-white/30 uppercase tracking-[4px] mb-3 italic">SIGNAL_LATENCY</p>
                                        <p className="text-3xl font-black text-[#007ea7] italic tracking-tighter leading-none">12.4MS</p>
                                    </div>
                                    <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 group-hover:bg-white/10 transition-colors shadow-inner">
                                        <p className="text-[9px] text-white/30 uppercase tracking-[4px] mb-3 italic">DIST_NODES</p>
                                        <p className="text-3xl font-black text-white italic tracking-tighter leading-none">642</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Configuration Panel */}
                <div className="xl:col-span-8 space-y-16">
                    <Reveal direction="up">
                        <div className="saas-card !p-0 overflow-hidden shadow-3xl border-2 border-slate-50">
                            <div className="p-12 border-b-2 border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-slate-50/20 relative">
                                 {/* Decorative Grid */}
                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                                 <div className="flex items-center gap-8 relative z-10">
                                    <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                        <Globe size={36} strokeWidth={2.5} className="animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Global Mainframe Config</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Calibrate core logic across global clusters</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-6 relative z-10">
                                    <div className="hidden lg:flex items-center gap-4 bg-emerald-50 px-8 py-4 rounded-2xl border-2 border-emerald-50 shadow-xl">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[5px] italic">SECURE_AUTH_LEVEL_5</span>
                                    </div>
                                 </div>
                            </div>

                            <div className="p-16 space-y-20 relative z-10">
                                {/* Maintenance Toggle */}
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 p-12 bg-slate-50/50 rounded-[4rem] border-2 border-slate-50 transition-all hover:bg-white hover:border-[#007ea7]/30 group shadow-inner">
                                    <div className="flex items-center gap-10">
                                        <div className={`p-10 rounded-[2.5rem] transition-all duration-1000 ${isMaintenance ? 'bg-rose-600 rotate-[360deg] shadow-rose-500/20' : 'bg-[#003249] shadow-3xl'} text-white border-2 border-white/10 group-hover:scale-110`}>
                                            <Power size={48} strokeWidth={3} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-3xl font-black uppercase tracking-tighter text-[#003249] leading-none mb-1 italic">Isolation Protocol</h4>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[6px] italic leading-relaxed">Restrict network access during critical system updates.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleToggleMaintenance}
                                        className={`h-24 px-16 rounded-[3.5rem] font-black text-[14px] uppercase tracking-[8px] transition-all border-4 flex items-center justify-center gap-8 shadow-3xl active:scale-95 italic ${
                                            isMaintenance 
                                            ? 'bg-rose-600 text-white border-rose-500 hover:bg-rose-700 shadow-rose-500/20' 
                                            : 'bg-[#003249] text-white border-[#003249] hover:bg-[#007ea7] hover:border-[#007ea7] shadow-[0_15px_30px_-10px_rgba(0,50,73,0.4)]'
                                        }`}
                                    >
                                        {isMaintenance ? 'ABORT_ISOLATION' : 'INITIATE_ISOLATION'}
                                        <AlertTriangle size={28} strokeWidth={3} className={isMaintenance ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'} />
                                    </button>
                                </div>

                                {/* Commission Yield Input */}
                                <div className="space-y-12 group">
                                    <div className="flex items-center justify-between px-12">
                                        <div className="space-y-3">
                                            <label className="text-[14px] font-black uppercase tracking-[10px] text-[#007ea7] italic leading-none block">Yield Matrix weight</label>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic">CALIBRATING_OPERATOR_YIELD_DELTA</span>
                                        </div>
                                        <div className="flex items-center gap-10">
                                             <div className="w-2 h-24 bg-[#007ea7] rounded-full hidden md:block shadow-[0_0_20px_#007ea7] animate-pulse" />
                                             <div className="relative">
                                                 <div className="absolute inset-0 bg-[#007ea7]/10 blur-2xl rounded-full" />
                                                 <span className="text-7xl font-black tracking-tighter text-[#003249] bg-white px-12 py-6 rounded-[3rem] border-2 border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all group-hover:scale-110 group-hover:text-[#007ea7] italic leading-none block relative z-10">{baselineYield}.0%</span>
                                             </div>
                                        </div>
                                    </div>
                                    <div className="relative p-14 bg-slate-50/50 rounded-[5rem] border-2 border-slate-50 transition-all hover:bg-slate-50 shadow-inner group/range">
                                         {/* Decorative Marks */}
                                        <div className="absolute top-1/2 left-14 right-14 h-4 mt-[-2px] flex justify-between pointer-events-none px-4">
                                            {[...Array(11)].map((_, i) => (
                                                <div key={i} className={`w-1 h-8 rounded-full transition-all duration-700 ${i * 5 <= baselineYield ? 'bg-[#007ea7]' : 'bg-slate-200'}`} />
                                            ))}
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="50" 
                                            value={baselineYield}
                                            onChange={(e) => setBaselineYield(e.target.value)}
                                            className="w-full h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#007ea7] relative z-20 border-4 border-white shadow-inner transition-all hover:accent-[#003249]"
                                        />
                                        <div className="flex justify-between mt-12 text-[11px] font-black text-slate-300 uppercase tracking-[8px] italic">
                                            <span>MIN_CAP_0.0</span>
                                            <span className="text-[#007ea7] flex items-center gap-4 animate-pulse"><Zap size={14} strokeWidth={3} /> OPTIMAL_SYNC_RATIO</span>
                                            <span>MAX_CAP_50.0</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Level Select */}
                                <div className="space-y-12">
                                    <div className="space-y-3 px-12">
                                        <label className="text-[14px] font-black uppercase tracking-[10px] text-[#007ea7] italic leading-none block">Clearance Matrix</label>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic">VERIFYING_GLOBAL_ENCRYPTION_PARAMETERS</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {['Standard Protection', 'Advanced Security', 'Enterprise Compliance', 'Maximum Security'].map((level) => (
                                            <motion.div 
                                                key={level}
                                                whileHover={{ scale: 1.02, y: -8 }}
                                                onClick={() => setSecurityLevel(level)}
                                                className={`p-12 rounded-[4rem] border-2 transition-all flex items-center gap-10 group relative overflow-hidden cursor-pointer ${
                                                    securityLevel === level 
                                                    ? 'bg-[#007ea7]/5 border-[#007ea7] shadow-[0_30px_60px_-15px_rgba(0,126,167,0.2)]' 
                                                    : 'bg-white border-slate-50 hover:border-[#007ea7]/30 shadow-xl'
                                                }`}
                                            >
                                                <div className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center border-2 transition-all shadow-2xl ${
                                                    securityLevel === level ? 'bg-[#007ea7] text-white border-white/20 rotate-12' : 'bg-slate-50 border-slate-100 text-slate-300 group-hover:bg-[#003249] group-hover:text-[#007ea7]'
                                                }`}>
                                                    <Target size={36} strokeWidth={3} />
                                                </div>
                                                <div className="space-y-3">
                                                    <span className={`text-[15px] font-black uppercase tracking-[5px] italic leading-none block ${securityLevel === level ? 'text-[#003249]' : 'text-slate-400 group-hover:text-slate-600'}`}>{level}</span>
                                                    {securityLevel === level ? (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-2.5 h-2.5 bg-[#007ea7] rounded-full animate-ping" />
                                                            <span className="text-[10px] font-black text-[#007ea7] uppercase tracking-[4px] italic">OPERATIONAL_STATE: ACTIVE</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] italic">READY_FOR_DEPLOYMENT</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 bg-slate-50/50 border-t-2 border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-12 relative z-10">
                                 <div className="flex items-center gap-8 opacity-40 group/sync">
                                    <RefreshCcw size={32} className="text-[#007ea7] animate-spin-slow group-hover/sync:rotate-[360deg] transition-all duration-[2000ms]" strokeWidth={3} />
                                    <span className="text-[11px] font-black uppercase tracking-[6px] text-[#003249] italic max-w-sm">Awaiting multi-node synchronization sweep across core clusters...</span>
                                 </div>
                                 <button 
                                    onClick={handleSaveProtocols}
                                    className="h-24 px-20 bg-[#003249] text-white rounded-[3rem] text-[14px] font-black uppercase tracking-[10px] flex items-center justify-center gap-8 shadow-[0_25px_50px_-12px_rgba(0,50,73,0.5)] hover:bg-[#007ea7] transition-all active:scale-95 group italic overflow-hidden relative"
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                    SYNC_PROTOCOLS <Save size={28} strokeWidth={3} className="text-[#80ced7] group-hover:text-white transition-colors" />
                                 </button>
                            </div>
                        </div>
                    </Reveal>

                    {/* Admin Log Terminal */}
                    <Reveal direction="up" delay={0.2}>
                        <div className="saas-card bg-[#003249] text-white rounded-[5rem] border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden relative group p-20 transition-all duration-700 hover:bg-[#002a3a]">
                            <div className="absolute top-0 right-0 p-24 opacity-[0.05] pointer-events-none transform rotate-12 transition-transform duration-[5000ms] group-hover:scale-125">
                                 <Shield size={500} />
                            </div>
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 mb-16 relative z-10">
                                <h4 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-10 leading-none italic text-[#80ced7]">
                                    <div className="w-20 h-20 bg-white/5 rounded-[2.2rem] flex items-center justify-center text-[#007ea7] border border-white/5 shadow-3xl group-hover:rotate-[360deg] transition-all duration-1000">
                                        <Terminal size={40} strokeWidth={3} />
                                    </div>
                                    Mainframe Operational Log
                                </h4>
                                <div className="px-10 py-4 bg-white/10 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[6px] italic text-sky-400 animate-pulse">
                                    LIVE_STREAM_V4.2
                                </div>
                            </div>
                            
                            <div className="space-y-12 relative z-10 max-h-[500px] overflow-y-auto no-scrollbar pr-12 border-l-4 border-[#007ea7]/20 pl-16 ml-10 custom-scrollbar-v2">
                                {[
                                    { event: 'PROTOCOL_UPDATE', status: 'SUCCESS', node: 'SAT_UPLINK_01', time: '12:04:12', icon: Satellite },
                                    { event: 'MATRIX_CALIBRATION', status: 'SYNCHRONIZING', node: 'CORE_ENGINE', time: '12:04:11', icon: Activity },
                                    { event: 'PERIMETER_SCAN', status: 'SUCCESS', node: 'SHIELD_PRO_V3', time: '12:04:09', icon: ShieldCheck },
                                    { event: 'UNAUTHORIZED_PING', status: 'MITIGATED', node: 'SECURE_GATEWAY', time: '12:04:05', icon: AlertTriangle },
                                    { event: 'ASSET_RECONCILIATION', status: 'SUCCESS', node: 'FINANCE_NODE_B', time: '12:04:01', icon: BarChart3 },
                                 ].map((log, i) => (
                                    <div key={i} className="flex flex-col gap-6 group/log cursor-pointer relative">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-[-64px] top-2 w-4 h-4 bg-[#003249] border-4 border-[#007ea7] rounded-full z-20 group-hover/log:scale-150 transition-transform" />

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-8">
                                                <div className={`p-4 rounded-xl ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : log.status === 'MITIGATED' ? 'bg-amber-500/10 text-amber-500' : 'bg-[#007ea7]/10 text-[#007ea7]'}`}>
                                                    <log.icon size={20} strokeWidth={3} />
                                                </div>
                                                <span className="text-[13px] font-black uppercase tracking-[6px] group-hover/log:text-[#007ea7] transition-all duration-500 leading-none">{log.event}</span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[5px] italic">{log.time}</span>
                                                <span className={`text-[10px] font-black px-5 py-2 rounded-xl border-2 italic ${
                                                    log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10 shadow-[0_0_15px_#10b98120]' : 
                                                    log.status === 'MITIGATED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 'bg-[#007ea7]/10 text-[#007ea7] border-[#007ea7]/10 animate-pulse'
                                                }`}>{log.status}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 ml-16">
                                             <div className="w-8 h-px bg-white/10" />
                                             <span className="text-[10px] font-black text-white/20 uppercase tracking-[5px] italic">ORIGIN_NODE::{log.node}</span>
                                        </div>
                                        {i !== 4 && <div className="h-px bg-white/5 mt-6 w-full group-hover/log:bg-white/10 transition-colors" />}
                                    </div>
                                 ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Protocol_Audit_Verified
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Mainframe_Static_Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Sync_Latency: 0.04ms
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AdminSettings;
