import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Database, Zap,
    Activity, Fingerprint,
    Command, Layout, Info,
    Power, AlertTriangle, RefreshCcw, Save, ClipboardList, ShieldCheck
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
            title: "SETTINGS_SAVED_SUCCESSFULLY",
            description: "Platform configurations have been successfully updated across all nodes.",
        });
    };

    const handleToggleMaintenance = () => {
        setIsMaintenance(!isMaintenance);
        toast({
            title: isMaintenance ? "MAINTENANCE_MODE_DISABLED" : "MAINTENANCE_MODE_ENABLED",
            description: isMaintenance ? "System services are now live for all users." : "Access restricted to administrative accounts only.",
            variant: isMaintenance ? "default" : "destructive"
        });
    };

    return (
        <div className="admin-settings p-6 md:p-10 bg-[#F4F7FB] min-h-screen relative overflow-hidden">
            {/* Professional Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #0165FF 1px, transparent 0)`, backgroundSize: '50px 50px' }} />
            
            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#0165FF]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                ADMIN<span className="text-primary tracking-normal">_SETTINGS</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Manage core platform configurations and security parameters
                        </p>
                    </div>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Navigation Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    {[
                        { id: 'general', label: 'GENERAL_SETTINGS', icon: Settings, active: true },
                        { id: 'security', label: 'SECURITY_&_COMPLIANCE', icon: ShieldCheck, active: false },
                        { id: 'notifications', label: 'NOTIFICATIONS', icon: Bell, active: false },
                        { id: 'yield', label: 'PRICING_ENGINE', icon: Zap, active: false },
                        { id: 'database', label: 'DATABASE_SETTINGS', icon: Database, active: false },
                    ].map((item) => (
                        <div 
                            key={item.id}
                            className={`p-8 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                                item.active 
                                ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 translate-x-4' 
                                : 'bg-white border-border/50 hover:border-primary/40 hover:translate-x-2'
                            }`}
                        >
                            {item.active && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary"
                                />
                            )}
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-xl border ${item.active ? 'bg-white/10 border-white/20' : 'bg-zinc-50 border-border/50'}`}>
                                        <item.icon size={22} strokeWidth={item.active ? 3 : 2} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[4px] italic">{item.label}</span>
                                </div>
                                {item.active && <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />}
                            </div>
                        </div>
                    ))}

                    <div className="p-10 bg-zinc-950 text-white rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group mt-12">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                        <h4 className="text-xl font-black italic uppercase tracking-tighter mb-4 relative z-10 flex items-center gap-4">
                            <Info size={18} className="text-primary" /> SYSTEM_HEALTH
                        </h4>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[4px] opacity-40">
                                <span>SERVER_UPTIME</span>
                                <span className="text-emerald-500">100.0%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_10px_#10b981]" />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[4px] opacity-40">
                                <span>RESPONSE_TIME</span>
                                <span className="text-primary">12 MS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="xl:col-span-2 space-y-12">
                    <div className="bg-white rounded-[4rem] border border-border/50 shadow-2xl overflow-hidden backdrop-blur-md">
                        <div className="p-12 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-50">
                             <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-xl">
                                    <Settings size={32} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">GENERAL_CONFIGURATION</h3>
                                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] mt-3 italic ml-1">Configure baseline operational parameters for the platform</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/20">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[3px] italic">STATUS_ONLINE</span>
                             </div>
                        </div>

                        <div className="p-12 space-y-16">
                            {/* Maintenance Toggle */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 p-10 bg-zinc-50/50 rounded-[3rem] border border-border/30 hover:border-primary/40 transition-all group">
                                <div className="flex items-center gap-8">
                                    <div className={`p-6 rounded-[2rem] transition-all duration-700 ${isMaintenance ? 'bg-rose-500 shadow-rose-500/30' : 'bg-primary shadow-primary/30'} shadow-2xl text-white`}>
                                        <Power size={28} strokeWidth={4} />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-2">MAINTENANCE_MODE</h4>
                                        <p className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic">Restrict user access during system updates.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleToggleMaintenance}
                                    className={`h-16 px-12 rounded-2xl font-black text-[10px] uppercase tracking-[5px] transition-all italic border-2 flex items-center gap-4 ${
                                        isMaintenance 
                                        ? 'bg-rose-500 text-white border-rose-500 shadow-xl shadow-rose-500/20' 
                                        : 'bg-zinc-950 text-white border-zinc-950 hover:bg-primary hover:border-primary'
                                    }`}
                                >
                                    {isMaintenance ? 'DISABLE_MAINTENANCE' : 'ENABLE_MAINTENANCE'}
                                    <AlertTriangle size={18} />
                                </button>
                            </div>

                            {/* Commission Yield Input */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-6">
                                    <label className="text-[11px] font-black uppercase tracking-[6px] text-primary italic">COMMISSION_RATE_ADJUSTMENT [%]</label>
                                    <span className="text-2xl font-black italic tracking-tighter text-primary">{baselineYield}%</span>
                                </div>
                                <div className="relative group p-10 bg-zinc-50/50 rounded-[3rem] border border-border/30">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="50" 
                                        value={baselineYield}
                                        onChange={(e) => setBaselineYield(e.target.value)}
                                        className="w-full h-2 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between mt-6 text-[9px] font-black opacity-20 uppercase tracking-[4px] italic">
                                        <span>MIN_RATE</span>
                                        <span>RECOMMENDED_ZONE</span>
                                        <span>MAX_RATE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Level Select */}
                            <div className="space-y-6">
                                <label className="text-[11px] font-black uppercase tracking-[6px] text-primary italic ml-6">SYSTEM_SECURITY_LEVEL</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {['Standard Protection', 'Advanced Security', 'Enterprise Compliance', 'Maximum Security'].map((level) => (
                                        <div 
                                            key={level}
                                            onClick={() => setSecurityLevel(level)}
                                            className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center gap-6 group ${
                                                securityLevel === level 
                                                ? 'bg-primary/5 border-primary shadow-xl shadow-primary/10' 
                                                : 'bg-white border-border/30 hover:border-primary/40'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                                                securityLevel === level ? 'bg-primary text-white border-primary' : 'bg-zinc-50 border-border/50 text-zinc-400 group-hover:text-primary'
                                            }`}>
                                                <ShieldCheck size={20} strokeWidth={3} />
                                            </div>
                                            <span className={`text-xs font-black uppercase tracking-[3px] italic ${securityLevel === level ? 'text-primary' : 'opacity-40'}`}>{level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-12 bg-zinc-50 border-t border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-10">
                             <div className="flex items-center gap-6">
                                <RefreshCcw size={20} className="text-primary opacity-40 animate-spin-slow" />
                                <span className="text-[10px] font-black uppercase tracking-[5px] opacity-20 italic">Awaiting synchronization...</span>
                             </div>
                             <button 
                                onClick={handleSaveProtocols}
                                className="h-18 px-14 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[6px] shadow-2xl shadow-primary/30 hover:translate-y-[-6px] transition-all active:scale-95 italic flex items-center gap-6"
                             >
                                SAVE_SETTINGS <Save size={18} strokeWidth={4} />
                             </button>
                        </div>
                    </div>

                    {/* Admin Log */}
                    <div className="bg-zinc-950 text-white rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden relative group p-12">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-6 relative z-10">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5">
                                <ClipboardList size={24} strokeWidth={3} />
                            </div>
                            ADMIN_ACTIVITY_LOG
                        </h4>
                        <div className="space-y-6 relative z-10 max-h-[300px] overflow-y-auto no-scrollbar pr-6">
                            {[
                                { event: 'SETTINGS_UPDATE', status: 'SUCCESS', node: 'ADMIN_DESKTOP' },
                                { event: 'RATE_CHANGE', status: 'PENDING', node: 'SYSTEM_ENGINE' },
                                { event: 'SECURITY_SCAN', status: 'SUCCESS', node: 'SHIELD_PRO_CORE' },
                                { event: 'LOGIN_ATTEMPT', status: 'ALERT', node: 'AUTH_SERVICE' },
                             ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group/log hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-2 h-2 rounded-full ${
                                            log.status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                                            log.status === 'ALERT' ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : 'bg-orange-500 animate-pulse'
                                        }`} />
                                        <span className="text-[10px] font-black uppercase tracking-[4px] italic">{log.event}</span>
                                    </div>
                                    <span className="text-[8px] font-black opacity-20 uppercase tracking-[3px]">STATUS::{log.status}</span>
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
