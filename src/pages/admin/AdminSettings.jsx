import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Database, Zap,
    Activity, Fingerprint,
    Command, Layout, Info,
    Power, AlertTriangle, RefreshCcw, Save, ClipboardList, ShieldCheck,
    Cpu, Globe, HardDrive, Terminal, Award
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
        <div className="admin-settings p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Global Matrix Atmosphere */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #007ea8 2px, transparent 0)`, backgroundSize: '60px 60px' }} />
            
            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                CORE<span className="text-primary tracking-normal ml-1">_PROTOCOLS</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-7">
                            Global platform configuration manager and high-security mainframe settings
                        </p>
                    </div>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Navigation Sidebar */}
                <div className="xl:col-span-1 space-y-8">
                    {[
                        { id: 'general', label: 'SYSTEM_CONFIGURATION', icon: Settings, active: true },
                        { id: 'security', label: 'THREAT_COMPLIANCE', icon: ShieldCheck, active: false },
                        { id: 'notifications', label: 'UPLINK_ALERTS', icon: Bell, active: false },
                        { id: 'yield', label: 'PRICING_MAINFRAME', icon: Zap, active: false },
                        { id: 'database', label: 'DATA_CLUSTERS', icon: Database, active: false },
                    ].map((item) => (
                        <div 
                            key={item.id}
                            className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
                                item.active 
                                ? 'bg-header-bg text-white border-header-bg shadow-2xl shadow-header-bg/30 translate-x-4' 
                                : 'bg-white border-slate-200 hover:border-primary/50 hover:translate-x-2'
                            }`}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                    <div className={`p-5 rounded-2xl border transition-colors ${item.active ? 'bg-primary border-white/20' : 'bg-slate-50 border-slate-200'}`}>
                                        <item.icon size={24} strokeWidth={item.active ? 3 : 2} className={item.active ? 'text-white' : 'text-slate-400'} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[5px]">{item.label}</span>
                                </div>
                                {item.active && <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/40 animate-pulse" />}
                            </div>
                        </div>
                    ))}

                    <div className="p-12 bg-header-bg text-white rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group mt-16 transition-all hover:bg-header-bg/95">
                        <div className="absolute top-[-20%] right-[-10%] opacity-10 pointer-events-none">
                            <Cpu size={120} className="text-white brightness-200" />
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight mb-10 relative z-10 flex items-center gap-6">
                            <Info size={24} className="text-primary" /> SYSTEM_VITALITY
                        </h4>
                        <div className="space-y-8 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[5px] text-white/40">
                                <span>ORBITAL_UPTIME</span>
                                <span className="text-emerald-500 font-black">100.0%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[100%] shadow-lg shadow-emerald-500/40" />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[5px] text-white/40">
                                <span>SIGNAL_LATENCY</span>
                                <span className="text-primary font-black">12.4 MS</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[5px] text-white/40">
                                <span>DIST_NODES</span>
                                <span className="text-white font-black">642 / 642</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="xl:col-span-2 space-y-12">
                    <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-12 bg-slate-50 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                <HardDrive size={200} className="text-header-bg rotate-12" />
                             </div>
                             <div className="flex items-center gap-10 relative z-10">
                                <div className="w-20 h-20 bg-header-bg rounded-2xl flex items-center justify-center text-white shadow-xl shadow-header-bg/20 border border-white/10">
                                    <Globe size={36} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">GLOBAL_MAIN_CONFIG</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-4">Calibrate core operational logic across the global distribution network</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-6 bg-emerald-50 px-8 py-4 rounded-2xl border border-emerald-100 relative z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[4px]">UPLINK_SECURE</span>
                             </div>
                        </div>

                        <div className="p-16 space-y-20 relative">
                            {/* Maintenance Toggle */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 p-12 bg-slate-50/50 rounded-[3rem] border border-slate-100 hover:border-primary/40 transition-all group relative overflow-hidden">
                                <div className="flex items-center gap-10">
                                    <div className={`p-8 rounded-[2.5rem] transition-all duration-700 ${isMaintenance ? 'bg-rose-600 shadow-rose-500/30' : 'bg-primary shadow-primary/30'} shadow-2xl text-white border border-white/10`}>
                                        <Power size={32} strokeWidth={4} />
                                    </div>
                                    <div>
                                        <h4 className="text-3xl font-black uppercase tracking-tighter text-header-bg leading-none mb-3">ISOLATION_PROTOCOL</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px]">Restrict node access during critical mainframe updates.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleToggleMaintenance}
                                    className={`h-20 px-12 rounded-[2rem] font-black text-[11px] uppercase tracking-[6px] transition-all border-4 flex items-center gap-6 shadow-2xl ${
                                        isMaintenance 
                                        ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20' 
                                        : 'bg-header-bg text-white border-header-bg hover:bg-primary hover:border-primary shadow-header-bg/20'
                                    }`}
                                >
                                    {isMaintenance ? 'ABORT_ISOLATION' : 'INITIATE_ISOLATION'}
                                    <AlertTriangle size={20} strokeWidth={3} />
                                </button>
                            </div>

                            {/* Commission Yield Input */}
                            <div className="space-y-10 group">
                                <div className="flex items-center justify-between px-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black uppercase tracking-[6px] text-primary">COMMISSION_MATRIX_WEIGHT [%]</label>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[3px]">CALIBRATING_OPERATOR_YIELD_RATIO</span>
                                    </div>
                                    <span className="text-4xl font-black tracking-tighter text-primary">{baselineYield}.0%</span>
                                </div>
                                <div className="relative group p-12 bg-slate-50/50 rounded-[3.5rem] border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="50" 
                                        value={baselineYield}
                                        onChange={(e) => setBaselineYield(e.target.value)}
                                        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary border border-slate-300 transition-all hover:h-3"
                                    />
                                    <div className="flex justify-between mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-[5px]">
                                        <span>THRESHOLD_ALPHA</span>
                                        <span className="text-primary italic">OPTIMAL_ZONE</span>
                                        <span>THRESHOLD_MAX</span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Level Select */}
                            <div className="space-y-10">
                                <div className="flex flex-col gap-2 px-8">
                                    <label className="text-[11px] font-black uppercase tracking-[6px] text-primary">ENTITY_CLEARANCE_PROTOCOL</label>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[3px]">VERIFYING_GLOBAL_ACCESS_MATRIX</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {['Standard Protection', 'Advanced Security', 'Enterprise Compliance', 'Maximum Security'].map((level) => (
                                        <div 
                                            key={level}
                                            onClick={() => setSecurityLevel(level)}
                                            className={`p-10 rounded-[3rem] border-2 cursor-pointer transition-all flex items-center gap-8 group relative overflow-hidden ${
                                                securityLevel === level 
                                                ? 'bg-primary/5 border-primary shadow-2xl shadow-primary/5' 
                                                : 'bg-white border-slate-100 hover:border-primary/30 group'
                                            }`}
                                        >
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all ${
                                                securityLevel === level ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-primary'
                                            }`}>
                                                <ShieldCheck size={28} strokeWidth={3} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={`text-[12px] font-black uppercase tracking-[4px] ${securityLevel === level ? 'text-header-bg' : 'text-slate-400 group-hover:text-slate-600'}`}>{level}</span>
                                                {securityLevel === level && <span className="text-[8px] font-black text-primary uppercase tracking-[2px]">ACTIVE_ENFORCEMENT</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-16 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-12">
                             <div className="flex items-center gap-8">
                                <RefreshCcw size={24} className="text-primary opacity-40 animate-spin-slow" />
                                <span className="text-[10px] font-black uppercase tracking-[6px] text-slate-400">Awaiting multi-node synchronization sweep...</span>
                             </div>
                             <button 
                                onClick={handleSaveProtocols}
                                className="h-20 px-16 bg-primary text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[6px] shadow-2xl shadow-primary/30 hover:translate-y-[-10px] hover:bg-header-bg transition-all active:scale-95 flex items-center gap-8 border border-white/10"
                             >
                                SYNC_PROTOCOLS <Save size={24} strokeWidth={4} />
                             </button>
                        </div>
                    </div>

                    {/* Admin Log */}
                    <div className="bg-header-bg text-white rounded-[4rem] border border-white/10 shadow-2xl overflow-hidden relative group p-16 transition-all hover:bg-header-bg/95">
                        <div className="absolute top-[-10%] right-[-10%] opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]">
                             <Award size={300} className="text-white" />
                        </div>
                        <h4 className="text-3xl font-black uppercase tracking-tight mb-12 flex items-center gap-8 relative z-10 leading-none">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/10 shadow-2xl">
                                <Terminal size={32} strokeWidth={3} />
                            </div>
                            OPERATIONAL_MAINFRAME_LOG
                        </h4>
                        <div className="space-y-8 relative z-10 max-h-[400px] overflow-y-auto no-scrollbar pr-10 border-l-2 border-primary/20 pl-12">
                            {[
                                { event: 'PROTOCOL_UPDATE', status: 'SUCCESS', node: 'SAT_UPLINK_01' },
                                { event: 'MATRIX_CALIBRATION', status: 'SYNCHRONIZING', node: 'CORE_ENGINE' },
                                { event: 'PERIMETER_SCAN', status: 'SUCCESS', node: 'SHIELD_PRO_V3' },
                                { event: 'UNAUTHORIZED_PING', status: 'MITIGATED', node: 'SECURE_GATEWAY' },
                                { event: 'ASSET_RECONCILIATION', status: 'SUCCESS', node: 'FINANCE_NODE_B' },
                             ].map((log, i) => (
                                <div key={i} className="flex flex-col gap-3 group/log">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-2.5 h-2.5 rounded-full ${
                                                log.status === 'SUCCESS' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 
                                                log.status === 'MITIGATED' ? 'bg-amber-500 shadow-lg shadow-amber-500/40' : 'bg-primary animate-pulse shadow-lg shadow-primary/40'
                                            }`} />
                                            <span className="text-[11px] font-black uppercase tracking-[5px] group-hover/log:text-primary transition-colors">{log.event}</span>
                                        </div>
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-md border ${
                                            log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                            log.status === 'MITIGATED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'
                                        }`}>{log.status}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-[4px] ml-9">ORIGIN_NODE::{log.node}</span>
                                    {i !== 4 && <div className="h-px bg-white/5 mt-4 w-1/2" />}
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
