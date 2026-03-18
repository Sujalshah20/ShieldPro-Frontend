import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Database, Zap,
    Activity, Fingerprint,
    Command, Layout, Info,
    Power, AlertTriangle, RefreshCcw, Save, ClipboardList, ShieldCheck,
    Cpu, Globe, HardDrive, Terminal, Award, ChevronRight,
    ArrowUpRight, Target, Layers, Satellite, BarChart3, Search,
    CheckCircle2, X
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
        toast({ title: "Settings synchronized successfully" });
    };

    const handleToggleMaintenance = () => {
        setIsMaintenance(!isMaintenance);
        toast({
            title: isMaintenance ? "System Online" : "Maintenance Mode Enabled",
            variant: isMaintenance ? "default" : "destructive"
        });
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'notifications', label: 'Alerts', icon: Bell },
        { id: 'yield', label: 'Pricing', icon: Zap },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Settings</h1>
                        <p className="text-slate-500 font-medium">Configure global platform parameters and security protocols.</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Platform Healthy
                        </div>
                    </div>
                </Reveal>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Sidebar Nav */}
                <div className="xl:col-span-3 space-y-4">
                    <div className="flex flex-col p-1 bg-slate-100 rounded-2xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === tab.id 
                                    ? "bg-white text-blue-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                                }`}
                            >
                                <tab.icon size={18} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg group">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity size={14} className="text-blue-400" /> System Vitality
                        </h4>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <span>Uptime</span>
                                    <span className="text-emerald-400">99.9%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[99.9%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                                    <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Latency</p>
                                    <p className="text-lg font-bold text-white italic">12ms</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                                    <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Nodes</p>
                                    <p className="text-lg font-bold text-white italic">642</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Settings Panel */}
                <div className="xl:col-span-9 space-y-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                                <Settings size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Core Configuration</h3>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Mainframe Level Access</p>
                            </div>
                        </div>

                        <div className="p-8 space-y-10">
                            {/* Maintenance */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMaintenance ? 'bg-rose-500 text-white shadow-rose-500/20 shadow-lg' : 'bg-white text-slate-400 border border-slate-200'} `}>
                                        <Power size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-800 mb-1">Maintenance Mode</h4>
                                        <p className="text-xs font-semibold text-slate-400 max-w-sm">Restrict platform access to administrative staff only during updates.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleToggleMaintenance}
                                    className={`px-6 h-11 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                        isMaintenance 
                                        ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20' 
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {isMaintenance ? 'Disable Restriction' : 'Enable Restriction'}
                                </button>
                            </div>

                            {/* Yield Calibrator */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Yield Calibration</h4>
                                        <p className="text-xs font-semibold text-slate-400">Set the baseline commission rate for all agents.</p>
                                    </div>
                                    <span className="text-3xl font-bold text-blue-600 tracking-tighter italic">{baselineYield}.0%</span>
                                </div>
                                <div className="relative pt-2">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="50" 
                                        value={baselineYield}
                                        onChange={(e) => setBaselineYield(e.target.value)}
                                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                        <span>Min 0%</span>
                                        <span>Optimal Range</span>
                                        <span>Max 50%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Modules */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Security Clearance Level</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Standard', 'Advanced', 'Compliance', 'Maximum'].map((level) => (
                                        <div 
                                            key={level}
                                            onClick={() => setSecurityLevel(level)}
                                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                                                securityLevel.includes(level) 
                                                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/5' 
                                                : 'bg-white border-slate-100 hover:border-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                                    securityLevel.includes(level) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                    <Shield size={18} />
                                                </div>
                                                <span className={`text-sm font-bold ${securityLevel.includes(level) ? 'text-blue-700' : 'text-slate-500'}`}>{level}</span>
                                            </div>
                                            {securityLevel.includes(level) && <CheckCircle2 size={18} className="text-blue-600" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-xs italic flex items-center gap-2">
                                <RefreshCcw size={12} className="animate-spin-slow" /> Awaiting synchronization across all regional clusters.
                            </p>
                            <button 
                                onClick={handleSaveProtocols}
                                className="h-12 px-8 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                            >
                                <Save size={16} /> Synchronize Settings
                            </button>
                        </div>
                    </div>

                    {/* Operational Log */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl group">
                        <div className="flex items-center justify-between mb-8">
                             <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-3 italic">
                                <Terminal size={18} /> Operational Event Log
                             </h4>
                             <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                Live Stream Active
                             </div>
                        </div>
                        <div className="space-y-4 font-mono">
                            {[
                                { event: 'PROTOCOL_UPDATE', status: 'SUCCESS', time: '12:04:12' },
                                { event: 'MATRIX_CALIBRATION', status: 'SYNCING', time: '12:04:11' },
                                { event: 'PERIMETER_SCAN', status: 'SUCCESS', time: '12:04:09' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between text-[11px] group/log cursor-default border-b border-white/5 pb-3">
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-600">[{log.time}]</span>
                                        <span className="text-slate-300 font-bold tracking-tighter uppercase italic">{log.event}</span>
                                    </div>
                                    <span className={`text-[9px] px-2 py-0.5 rounded border ${
                                        log.status === 'SUCCESS' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5 animate-pulse'
                                    }`}>
                                        {log.status}
                                    </span>
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
