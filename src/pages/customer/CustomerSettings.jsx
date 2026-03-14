import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Sun, Zap,
    Cpu, Target, Activity, Fingerprint,
    Command, Radar, Layout, Info,
    Power, AlertTriangle, RefreshCcw, Save,
    User, Mail, Smartphone,
    Terminal, Globe, ZapOff, ShieldCheck
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
            description: "Your architecture parameters have been successfully committed to the secure node.",
        });
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="customer-settings p-4 md:p-8 bg-[#dae5e5] min-h-screen relative overflow-hidden font-display">
            {/* Mission Header */}
            <div className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-[#0082a1] rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Node Configuration Terminal</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#012b3f] uppercase tracking-tight">Hub_Protocols</h1>
                    <p className="text-sm text-slate-500 font-medium italic mt-1">Configure personal safehouse parameters & individual safeguard logics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Protocol Navigation Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    {[
                        { id: 'appearance', label: 'VISUAL_INTERFACE', icon: Monitor, active: true },
                        { id: 'security', label: 'IDENTITY_ARMOR', icon: Shield, active: false },
                        { id: 'notifications', label: 'SIGNAL_ALERTS', icon: Bell, active: false },
                        { id: 'uplink', label: 'CORE_UPLINK', icon: Zap, active: false },
                    ].map((item, idx) => (
                        <div 
                            key={item.id}
                            className={`p-10 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
                                item.active 
                                ? 'bg-[#012b3f] text-white border-white/5 shadow-2xl translate-x-4' 
                                : 'bg-white border-white hover:border-[#0082a1]/30 hover:shadow-xl'
                            }`}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl border transition-colors ${item.active ? 'bg-[#0082a1]/20 border-[#0082a1]/40 text-[#0082a1]' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-[#0082a1]'}`}>
                                        <item.icon size={24} strokeWidth={3} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[4px] italic">{item.label}</span>
                                </div>
                                {item.active && <div className="w-2.5 h-2.5 rounded-full bg-[#0082a1] shadow-[0_0_10px_#0082a1]" />}
                            </div>
                        </div>
                    ))}

                    <div className="p-10 bg-[#012b3f] text-white rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group mt-10">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                <Fingerprint size={120} className="text-[#0082a1]" />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight mb-8 relative z-10 flex items-center gap-4 italic text-[#0082a1]">
                            <Info size={20} /> Hub_Integrity
                        </h4>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[4px] text-white/40">
                                <span>Shield Stability</span>
                                <span className="text-emerald-500">Optimal_Flow</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_10px_#10b981]" />
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[4px] text-white/40 pt-2">
                                <span>Uplink Encryption</span>
                                <span className="text-[#0082a1]">AES_256_GCM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Matrix */}
                <div className="xl:col-span-2 space-y-10">
                    <div className="bg-white rounded-[3rem] border border-white shadow-2xl overflow-hidden relative">
                        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-slate-50/50">
                             <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl">
                                    <Fingerprint size={32} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#012b3f]">Interface_Synergy</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Calibrate hub aesthetics & notification frequencies</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                                <span className="text-[9px] font-black text-[#012b3f] uppercase tracking-widest">Uplink: Live</span>
                             </div>
                        </div>

                        <div className="p-10 space-y-12">
                            {/* Appearance — Light Mode Active */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 p-10 bg-slate-50 border border-slate-200 rounded-[2.5rem] group hover:border-[#0082a1]/40 transition-all">
                                <div className="flex items-center gap-8">
                                    <div className="p-6 rounded-2xl bg-[#012b3f] text-[#0082a1] shadow-2xl">
                                        <Monitor size={28} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black uppercase tracking-tight text-[#012b3f] mb-2 leading-none">Chromatic_Engine</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">ShieldPro Light UI — System Default_Locked.</p>
                                    </div>
                                </div>
                                <div className="h-12 px-8 bg-white text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-widest italic border border-slate-200 flex items-center gap-3 cursor-default shadow-sm">
                                    LIGHT_MODE <ShieldCheck size={16} />
                                </div>
                            </div>

                            {/* Notification Consoles */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 ml-6">
                                    <div className="w-1 h-4 bg-[#0082a1] rounded-full" />
                                    <label className="text-[11px] font-black uppercase tracking-[5px] text-[#012b3f]">Signal_Channel_Configuration</label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { id: 'email', label: 'STATION_EMAILS', icon: Mail, value: notifications.email },
                                        { id: 'sms', label: 'MOBILE_ENCRYPT_SMS', icon: Smartphone, value: notifications.sms },
                                        { id: 'push', label: 'BROWSER_OVERLAYS', icon: Monitor, value: notifications.push },
                                        { id: 'security', label: 'SECURITY_ALERTS', icon: Shield, value: notifications.security },
                                    ].map((channel) => (
                                        <div 
                                            key={channel.id}
                                            onClick={() => toggleNotification(channel.id)}
                                            className={`p-8 rounded-[2rem] border transition-all flex items-center justify-between cursor-pointer group ${
                                                channel.value 
                                                ? 'bg-[#012b3f] border-white/5 text-white shadow-2xl' 
                                                : 'bg-white border-slate-100 hover:border-[#0082a1]/30 hover:shadow-xl text-[#012b3f]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                                                    channel.value ? 'bg-[#0082a1]/20 border-[#0082a1]/40 text-[#0082a1]' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-[#0082a1]'
                                                }`}>
                                                    <channel.icon size={20} strokeWidth={3} />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${channel.value ? 'text-white' : 'text-[#012b3f] opacity-40 group-hover:opacity-100'}`}>{channel.label}</span>
                                            </div>
                                            <div className={`w-10 h-5 rounded-full relative transition-all ${channel.value ? 'bg-[#0082a1]' : 'bg-slate-200'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${channel.value ? 'left-6' : 'left-1'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-10">
                             <div className="flex items-center gap-6">
                                <RefreshCcw size={18} className="text-[#0082a1] animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Awaiting Protocol Commit...</span>
                             </div>
                             <button 
                                onClick={handleSaveProtocols}
                                className="h-16 px-12 bg-[#012b3f] text-[#0082a1] rounded-xl font-black text-[10px] uppercase tracking-[4px] shadow-xl hover:bg-[#0082a1] hover:text-white transition-all active:scale-95 border border-white/5"
                             >
                                COMMIT_CHASSIS_SYNC
                             </button>
                        </div>
                    </div>

                    {/* Operational Manifest */}
                    <div className="bg-[#012b3f] text-white rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative group p-12">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <Target size={300} className="text-white" />
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight mb-10 flex items-center gap-6 relative z-10 italic text-[#0082a1]">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#0082a1] border border-white/5">
                                <Activity size={24} strokeWidth={3} />
                            </div>
                            Hub_Activity_Log
                        </h4>
                        <div className="space-y-6 relative z-10">
                            {[
                                { event: 'VISUAL_ENGINE_CALIBRATED', status: 'SUCCESS', node: 'LOCAL_UI' },
                                { event: 'MFA_IDENTITY_CHALLENGE', status: 'SUCCESS', node: 'SECURE_GATE' },
                                { event: 'CRYPTO_UPLINK_ESTABLISHED', status: 'ACTIVE', node: 'MAINFRAME' },
                             ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group/log hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-2 h-2 rounded-full ${
                                            log.status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-[#0082a1] animate-pulse'
                                        }`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">{log.event}</span>
                                    </div>
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[3px]">Node::{log.node}</span>
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