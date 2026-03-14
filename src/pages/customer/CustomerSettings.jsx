import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Sun, Zap,
    Cpu, Target, Activity, Fingerprint,
    Command, Radar, Layout, Info,
    Power, AlertTriangle, RefreshCcw, Save,
    User, Mail, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const CustomerSettings = () => {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
        security: true
    });

    const handleSaveProtocols = () => {
        toast({
            title: "HUB_PROTOCOLS_SYNCED",
            description: "Personal architecture parameters have been committed to the secure node.",
        });
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="customer-settings p-6 md:p-10 bg-[#F4F7FB] min-h-screen relative overflow-hidden">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #FF5A00 1px, transparent 0)`, backgroundSize: '50px 50px' }} />
            
            <div className="absolute top-[-10%] right-[-10%] opacity-[0.05] pointer-events-none animate-spin-slow">
                <Radar size={800} className="text-accent rotate-45" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-accent rounded-full shadow-[0_0_20px_#FF5A00]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                HUB<span className="text-accent tracking-normal">_PROTOCOLS</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                            Configure personal safehouse parameters & individual safeguard logics
                        </p>
                    </div>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Protocol Navigation Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    {[
                        { id: 'appearance', label: 'VISUAL_INTERFACE', icon: Monitor, active: true },
                        { id: 'security', label: 'IDENTITY_ARMOR', icon: Shield, active: false },
                        { id: 'notifications', label: 'SIGNAL_ALERTS', icon: Bell, active: false },
                        { id: 'uplink', label: 'CORE_UPLINK', icon: Zap, active: false },
                    ].map((item) => (
                        <div 
                            key={item.id}
                            className={`p-8 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                                item.active 
                                ? 'bg-accent text-white border-accent shadow-2xl shadow-accent/30 translate-x-4' 
                                : 'bg-white border-border/50 hover:border-accent/40 hover:translate-x-2'
                            }`}
                        >
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
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                        <h4 className="text-xl font-black italic uppercase tracking-tighter mb-4 relative z-10 flex items-center gap-4">
                            <Info size={18} className="text-accent" /> HUB_INTEGRITY
                        </h4>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[4px] opacity-40">
                                <span>SHIELD_STABILITY</span>
                                <span className="text-emerald-500">OPTIMAL</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_10px_#10b981]" />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[4px] opacity-40">
                                <span>UPLINK_ENCRYPTION</span>
                                <span className="text-accent">AES_256</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Matrix */}
                <div className="xl:col-span-2 space-y-12">
                    <div className="bg-white rounded-[4rem] border border-border/50 shadow-2xl overflow-hidden backdrop-blur-md">
                        <div className="p-12 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-50">
                             <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent border border-accent/20 shadow-xl">
                                    <Fingerprint size={32} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">INTERFACE_SYNERGY</h3>
                                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] mt-3 italic ml-1">Calibrate hub aesthetics & notification frequencies</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/20">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[3px] italic">UPLINK_LIVE</span>
                             </div>
                        </div>

                        <div className="p-12 space-y-16">
                            {/* Appearance — Light Mode Active */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 p-10 bg-zinc-50/50 rounded-[3rem] border border-border/30 hover:border-accent/40 transition-all group">
                                <div className="flex items-center gap-8">
                                    <div className="p-6 rounded-[2rem] bg-accent shadow-accent/30 shadow-2xl text-white">
                                        {/* Sun icon removed, replaced with a static Monitor icon */}
                                        <Monitor size={28} strokeWidth={4} />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-2">CHROMATIC_ENGINE</h4>
                                        <p className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic">Precision Light Mode — Active &amp; Locked.</p>
                                    </div>
                                </div>
                                <div className="h-12 px-10 bg-zinc-100 text-zinc-400 rounded-2xl font-black text-[10px] uppercase tracking-[5px] italic border-2 border-zinc-200 flex items-center gap-3 cursor-default select-none">
                                    LIGHT_MODE <Monitor size={16} />
                                </div>
                            </div>

                            {/* Notification Consoles */}
                            <div className="space-y-8">
                                <label className="text-[11px] font-black uppercase tracking-[6px] text-accent italic ml-6">SIGNAL_CHANNEL_CONFIGURATION</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { id: 'email', label: 'STATION_EMAILS', icon: Mail, value: notifications.email },
                                        { id: 'sms', label: 'MOBILE_ENCRYPT_SMS', icon: Smartphone, value: notifications.sms },
                                        { id: 'push', label: 'BROWSER_OVERLAYS', icon: Monitor, value: notifications.push },
                                        { id: 'security', label: 'SECURITY_BREACH_ALERTS', icon: Shield, value: notifications.security },
                                    ].map((channel) => (
                                        <div 
                                            key={channel.id}
                                            onClick={() => toggleNotification(channel.id)}
                                            className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${
                                                channel.value 
                                                ? 'bg-accent/5 border-accent shadow-xl shadow-accent/10' 
                                                : 'bg-white border-border/30 hover:border-accent/40'
                                            }`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                                                    channel.value ? 'bg-accent text-white border-accent' : 'bg-zinc-50 border-border/50 text-zinc-400 group-hover:text-accent'
                                                }`}>
                                                    <channel.icon size={20} strokeWidth={3} />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-[3px] italic ${channel.value ? 'text-accent' : 'opacity-40'}`}>{channel.label}</span>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full relative transition-all ${channel.value ? 'bg-accent' : 'bg-zinc-200'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${channel.value ? 'left-5' : 'left-1'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-12 bg-zinc-50 border-t border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-10">
                             <div className="flex items-center gap-6">
                                <RefreshCcw size={20} className="text-accent opacity-40 animate-spin-slow" />
                                <span className="text-[10px] font-black uppercase tracking-[5px] opacity-20 italic">Awaiting protocol commit...</span>
                             </div>
                             <button 
                                onClick={handleSaveProtocols}
                                className="h-18 px-14 bg-accent text-white rounded-2xl font-black text-[11px] uppercase tracking-[6px] shadow-2xl shadow-accent/30 hover:translate-y-[-6px] transition-all active:scale-95 italic flex items-center gap-6"
                             >
                                COMMIT_CHASSIS_SYNC <Save size={18} strokeWidth={4} />
                             </button>
                        </div>
                    </div>

                    {/* Operational Manifest */}
                    <div className="bg-zinc-950 text-white rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden relative group p-12">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                             <Target size={300} className="text-white" />
                        </div>
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-6 relative z-10">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent border border-white/5">
                                <Activity size={24} strokeWidth={3} />
                            </div>
                            HUB_ACTIVITY_LOG
                        </h4>
                        <div className="space-y-6 relative z-10">
                            {[
                                { event: 'VISUAL_ENGINE_CALIBRATED', status: 'SUCCESS', node: 'LOCAL_UI' },
                                { event: 'MFA_IDENTITY_CHALLENGE', status: 'SUCCESS', node: 'SECURE_GATE' },
                                { event: 'EXTERNAL_SIGNAL_FILTER_ACTIVE', status: 'ACTIVE', node: 'SYNERGY_X' },
                             ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group/log hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-2 h-2 rounded-full ${
                                            log.status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-accent animate-pulse'
                                        }`} />
                                        <span className="text-[10px] font-black uppercase tracking-[4px] italic">{log.event}</span>
                                    </div>
                                    <span className="text-[8px] font-black opacity-20 uppercase tracking-[3px]">NODE::{log.node}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSettings;