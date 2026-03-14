import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Database, Zap,
    Activity, Fingerprint,
    Command, Layout, Info,
    Power, AlertTriangle, RefreshCcw, Save, ClipboardList, ShieldCheck,
    Cpu, Globe, HardDrive, Terminal, Award, ChevronRight,
    ArrowUpRight, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminSettings = () => {
    const { toast } = useToast();
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [baselineYield, setBaselineYield] = useState(15);
    const [securityLevel, setSecurityLevel] = useState("Standard Protection");

    const handleSaveProtocols = () => {
        toast({
            title: "PROTOCOLS_SYNCHRONIZED",
            description: "Mainframe configurations have been successfully distributed across all orbital nodes.",
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
        <div className="admin-settings p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Core Protocols</h1>
                <p className="text-sm text-slate-500 font-medium italic">Global platform configuration manager and high-security mainframe settings.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Navigation Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    {[
                        { id: 'general', label: 'SYSTEM_CONFIGURATION', icon: Settings, active: true },
                        { id: 'security', label: 'THREAT_COMPLIANCE', icon: ShieldCheck, active: false },
                        { id: 'notifications', label: 'UPLINK_ALERTS', icon: Bell, active: false },
                        { id: 'yield', label: 'PRICING_MAINFRAME', icon: Zap, active: false },
                        { id: 'database', label: 'DATA_CLUSTERS', icon: Database, active: false },
                    ].map((item) => (
                        <div 
                            key={item.id}
                            className={`p-8 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                                item.active 
                                ? 'bg-[#012b3f] text-white border-[#012b3f] shadow-2xl shadow-black/20 translate-x-4' 
                                : 'bg-white border-slate-200 hover:border-[#0082a1]/50 hover:translate-x-2'
                            }`}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-xl border transition-colors ${item.active ? 'bg-[#0082a1] border-white/20' : 'bg-slate-50 border-slate-200'}`}>
                                        <item.icon size={22} strokeWidth={item.active ? 3 : 2} className={item.active ? 'text-white' : 'text-slate-400'} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[4px]">{item.label}</span>
                                </div>
                                {item.active && <ChevronRight size={16} className="text-[#0082a1] animate-pulse" />}
                            </div>
                        </div>
                    ))}

                    <div className="p-10 bg-[#012b3f] text-white rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group mt-10 transition-all hover:bg-[#012b3f]/95">
                        <div className="absolute top-[-10%] right-[-10%] opacity-10 pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform duration-1000">
                            <Cpu size={120} className="text-white" />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight mb-8 relative z-10 flex items-center gap-4">
                            <Activity size={20} className="text-[#0082a1]" /> SYSTEM_VITALITY
                        </h4>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[4px] text-white/40">
                                <span>Mainframe Uptime</span>
                                <span className="text-emerald-500 font-black">100.0%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_10px_#10b981]" />
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[4px] text-white/40">
                                <span>Signal Latency</span>
                                <span className="text-[#0082a1] font-black">12.4 MS</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[4px] text-white/40">
                                <span>Dist. Nodes</span>
                                <span className="text-white font-black">642 / 642</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="xl:col-span-2 space-y-10">
                    <div className="bg-white rounded-[3rem] border border-white shadow-2xl overflow-hidden">
                        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-slate-50 relative">
                             <div className="flex items-center gap-6 relative z-10">
                                <div className="w-14 h-14 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl shadow-black/10 transition-transform hover:scale-110">
                                    <Globe size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-[#012b3f] leading-none">Global Mainframe Config</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] mt-2">Calibrate core logic across the global distribution network</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 relative z-10 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[3px]">UPLINK_SECURE</span>
                             </div>
                        </div>

                        <div className="p-12 space-y-16">
                            {/* Maintenance Toggle */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:border-[#0082a1]/30 transition-all group relative overflow-hidden">
                                <div className="flex items-center gap-8">
                                    <div className={`p-6 rounded-2xl transition-all duration-700 ${isMaintenance ? 'bg-rose-600 shadow-rose-500/20' : 'bg-[#012b3f] shadow-black/20'} shadow-2xl text-white border border-white/10`}>
                                        <Power size={28} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black uppercase tracking-tighter text-[#012b3f] leading-none mb-2">Isolation Protocol</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[4px]">Restrict node access during critical updates.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleToggleMaintenance}
                                    className={`h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[4px] transition-all border-2 flex items-center gap-4 shadow-xl ${
                                        isMaintenance 
                                        ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/20 hover:bg-rose-700' 
                                        : 'bg-[#012b3f] text-white border-[#012b3f] hover:bg-[#0082a1] hover:border-[#0082a1] shadow-[#012b3f]/20'
                                    }`}
                                >
                                    {isMaintenance ? 'ABORT ISOLATION' : 'INITIATE ISOLATION'}
                                    <AlertTriangle size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Commission Yield Input */}
                            <div className="space-y-8 group">
                                <div className="flex items-center justify-between px-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-[5px] text-[#0082a1]">Commission Matrix Weight [%]</label>
                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[3px]">CALIBRATING OPERATOR YIELD RATIO</span>
                                    </div>
                                    <span className="text-4xl font-black tracking-tighter text-[#012b3f] bg-[#012b3f]/5 px-6 py-2 rounded-2xl border border-slate-100 transition-all group-hover:scale-110 group-hover:text-[#0082a1]">{baselineYield}.0%</span>
                                </div>
                                <div className="relative group p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 transition-colors hover:bg-slate-50 shadow-inner">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="50" 
                                        value={baselineYield}
                                        onChange={(e) => setBaselineYield(e.target.value)}
                                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0082a1] border border-slate-300 transition-all hover:h-2 focus:ring-4 focus:ring-[#0082a1]/10"
                                    />
                                    <div className="flex justify-between mt-6 text-[9px] font-bold text-slate-300 uppercase tracking-[4px]">
                                        <span>THRESHOLD_ALPHA</span>
                                        <span className="text-[#0082a1] italic">OPTIMAL ZONE</span>
                                        <span>THRESHOLD_MAX</span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Level Select */}
                            <div className="space-y-8">
                                <div className="flex flex-col gap-1.5 px-6">
                                    <label className="text-[10px] font-black uppercase tracking-[5px] text-[#0082a1]">Entity Clearance Protocol</label>
                                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[3px]">VERIFYING GLOBAL ACCESS MATRIX</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {['Standard Protection', 'Advanced Security', 'Enterprise Compliance', 'Maximum Security'].map((level) => (
                                        <div 
                                            key={level}
                                            onClick={() => setSecurityLevel(level)}
                                            className={`p-8 rounded-[2.5rem] border transition-all flex items-center gap-6 group relative overflow-hidden cursor-pointer ${
                                                securityLevel === level 
                                                ? 'bg-[#0082a1]/5 border-[#0082a1] shadow-2xl shadow-[#0082a1]/10' 
                                                : 'bg-white border-slate-100 hover:border-[#0082a1]/30 hover:scale-[1.02]'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                                                securityLevel === level ? 'bg-[#0082a1] text-white border-[#0082a1] shadow-lg shadow-[#0082a1]/30' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-[#0082a1]'
                                            }`}>
                                                <Target size={24} strokeWidth={3} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[11px] font-black uppercase tracking-[3px] ${securityLevel === level ? 'text-[#012b3f]' : 'text-slate-400 group-hover:text-slate-600'}`}>{level}</span>
                                                {securityLevel === level && (
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1 h-1 bg-[#0082a1] rounded-full animate-ping" />
                                                        <span className="text-[7px] font-black text-[#0082a1] uppercase tracking-[2px]">ACTIVE_ENFORCEMENT</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-10">
                             <div className="flex items-center gap-6 opacity-40">
                                <RefreshCcw size={20} className="text-[#0082a1] animate-spin-slow" />
                                <span className="text-[9px] font-black uppercase tracking-[5px] text-slate-400">Awaiting multi-node synchronization sweep...</span>
                             </div>
                             <button 
                                onClick={handleSaveProtocols}
                                className="h-16 px-12 bg-[#012b3f] text-white rounded-[1.2rem] font-black text-[11px] uppercase tracking-[4px] shadow-2xl shadow-black/20 hover:bg-[#0082a1] hover:translate-y-[-5px] transition-all active:scale-95 flex items-center gap-6 border border-white/5 group"
                             >
                                SYNC_PROTOCOLS <Save size={20} strokeWidth={3} className="text-[#0082a1] group-hover:text-white transition-colors" />
                             </button>
                        </div>
                    </div>

                    {/* Admin Log */}
                    <div className="bg-[#012b3f] text-white rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative group p-12 transition-all hover:bg-[#012b3f]/95">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transform rotate-12 group-hover:scale-125 transition-transform duration-[3000ms]">
                             <Shield size={300} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight mb-10 flex items-center gap-6 relative z-10 leading-none">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#0082a1] border border-white/5 shadow-2xl shadow-black/20 group-hover:rotate-[360deg] transition-all duration-1000">
                                <Terminal size={24} strokeWidth={3} />
                            </div>
                            Mainframe Operational Log
                        </h4>
                        <div className="space-y-6 relative z-10 max-h-[350px] overflow-y-auto no-scrollbar pr-6 border-l-2 border-[#0082a1]/20 pl-10">
                            {[
                                { event: 'PROTOCOL_UPDATE', status: 'SUCCESS', node: 'SAT_UPLINK_01' },
                                { event: 'MATRIX_CALIBRATION', status: 'SYNCHRONIZING', node: 'CORE_ENGINE' },
                                { event: 'PERIMETER_SCAN', status: 'SUCCESS', node: 'SHIELD_PRO_V3' },
                                { event: 'UNAUTHORIZED_PING', status: 'MITIGATED', node: 'SECURE_GATEWAY' },
                                { event: 'ASSET_RECONCILIATION', status: 'SUCCESS', node: 'FINANCE_NODE_B' },
                             ].map((log, i) => (
                                <div key={i} className="flex flex-col gap-3 group/log cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-2 h-2 rounded-full ${
                                                log.status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                                                log.status === 'MITIGATED' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-[#0082a1] animate-pulse shadow-[0_0_8px_#0082a1]'
                                            }`} />
                                            <span className="text-[10px] font-black uppercase tracking-[4px] group-hover/log:text-[#0082a1] transition-colors">{log.event}</span>
                                        </div>
                                        <span className={`text-[8px] font-black px-2.5 py-1 rounded-md border ${
                                            log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                            log.status === 'MITIGATED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-[#0082a1]/10 text-[#0082a1] border-[#0082a1]/20'
                                        }`}>{log.status}</span>
                                    </div>
                                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-[3px] ml-7">ORIGIN_NODE::{log.node}</span>
                                    {i !== 4 && <div className="h-px bg-white/5 mt-4 w-1/3 group-hover/log:w-1/2 transition-all duration-500" />}
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
