import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Sun, Zap,
    Cpu, Target, Activity, Fingerprint,
    Command, Radar, Layout, Info,
    Power, AlertTriangle, RefreshCcw, Save,
    User, Mail, Smartphone,
    Terminal, Globe, ZapOff, ShieldCheck, ChevronRight, Layers, CreditCard,
    Satellite, Compass, Award, Briefcase, Eye, EyeOff, Plus, Database, SearchCheck,
    BriefcaseIcon, CompassIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const CustomerSettings = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('appearance');
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

    const tabs = [
        { id: 'appearance', label: 'INTERFACE_CALIB', icon: Monitor, sub: 'Visual engine parameters' },
        { id: 'security', label: 'IDENTITY_ARMOR', icon: Shield, sub: 'Encryption & access keys' },
        { id: 'notifications', label: 'SIGNAL_ALERTS', icon: Bell, sub: 'Field alert configuration' },
        { id: 'uplink', label: 'CORE_UPLINK', icon: Zap, sub: 'Node synchronization' },
    ];

    return (
        <div className="space-y-16 pb-24">
            {/* System Control Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-3 h-12 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black uppercase tracking-[8px] text-[#003249] italic leading-none opacity-60">System_Control_Module_v4.2</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] mt-2 italic">AUTH_STATE: ROOT_SYNERGY</span>
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Control <span className="text-[#007ea7]">Nodes_</span></h1>
                        <p className="max-w-2xl text-slate-400 font-bold uppercase tracking-[4px] text-xs italic leading-relaxed">
                            Calibrate your personal safehouse parameters and individual safeguard logics. 
                            Active synchronization with the <span className="text-[#007ea7]">ShieldPro Mainframe</span> is 100% stable.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-10 bg-[#003249] px-12 py-8 rounded-[3.5rem] border-4 border-white shadow-4xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                        <div className="relative z-10 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981] animate-pulse" />
                        <div className="relative z-10 flex flex-col">
                            <span className="text-[12px] font-black text-[#80ced7] uppercase tracking-[6px] italic leading-none mb-1">LATENCY_STABLE</span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[4px] italic">0.02ms_REALTIME_SYNC</span>
                        </div>
                        <div className="relative z-10 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-180 transition-transform duration-700">
                            <RefreshCcw size={28} className="text-[#007ea7]" strokeWidth={3} />
                        </div>
                    </div>
                </Reveal>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 pb-16">
                {/* Protocol Navigation Matrix */}
                <div className="xl:col-span-4 space-y-12">
                    <div className="space-y-6">
                        {tabs.map((item, idx) => (
                            <Reveal key={item.id} direction="left" delay={idx * 0.1}>
                                <motion.div 
                                    whileHover={{ x: 20, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`p-10 rounded-[3.5rem] border-4 transition-all duration-1000 cursor-pointer group relative overflow-hidden ${
                                        activeTab === item.id 
                                        ? 'bg-[#003249] text-white border-white shadow-4xl' 
                                        : 'bg-white/50 backdrop-blur-md border-slate-50 hover:border-[#007ea7]/30 shadow-2xl'
                                    }`}
                                >
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-10">
                                            <div className={`w-20 h-20 rounded-[2rem] border-4 flex items-center justify-center transition-all duration-700 ${
                                                activeTab === item.id 
                                                ? 'bg-[#007ea7] border-white/20 text-white rotate-12 scale-110 shadow-4xl' 
                                                : 'bg-white border-slate-50 text-slate-200 group-hover:text-[#007ea7] group-hover:bg-[#003249] group-hover:border-[#003249] group-hover:rotate-12 group-hover:shadow-4xl transition-all duration-1000'
                                            }`}>
                                                <item.icon size={36} strokeWidth={2.5} />
                                            </div>
                                            <div className="space-y-3">
                                                <span className="text-[14px] font-black uppercase tracking-[8px] italic block leading-none">{item.label}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-[4px] italic block leading-none ${activeTab === item.id ? 'text-[#80ced7] opacity-60' : 'text-slate-300'}`}>{item.sub}</span>
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {activeTab === item.id && (
                                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                                                    <ChevronRight size={32} className="text-[#007ea7]" strokeWidth={5} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {activeTab === item.id && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                                    )}
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal direction="up" delay={0.5}>
                        <div className="bg-[#003249] text-white rounded-[5.5rem] p-16 border-4 border-white shadow-4xl relative overflow-hidden group hover:translate-y-[-10px] transition-all duration-1000">
                            <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-150 transition-transform duration-[8000ms] pointer-events-none">
                                    <Fingerprint size={350} className="text-[#007ea7] rotate-12" />
                            </div>
                            <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
                            
                            <div className="flex items-center justify-between mb-16 relative z-10">
                                <h4 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-8 italic text-[#007ea7] leading-none">
                                    <Info size={36} strokeWidth={3} /> Hub_Integrity
                                </h4>
                                <div className="w-16 h-16 bg-white/5 border-2 border-white/10 rounded-[2rem] flex items-center justify-center shadow-4xl">
                                    <Lock size={28} className="text-[#007ea7]" strokeWidth={3} />
                                </div>
                            </div>
                            
                            <div className="space-y-16 relative z-10">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-[10px] text-white/40 italic">
                                        <span>SHIELD_STABILITY</span>
                                        <span className="text-emerald-400">NOMINAL_FLOW</span>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border-2 border-white/5 shadow-inner p-1">
                                        <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: '100%' }} 
                                            transition={{ duration: 2.5, ease: "circOut" }} 
                                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_30px_#10b981]" 
                                        />
                                    </div>
                                </div>
                                <div className="p-10 bg-white/5 rounded-[3.5rem] border-2 border-white/10 italic flex flex-col gap-6 relative overflow-hidden group/enc backdrop-blur-md">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent opacity-0 group-hover/enc:opacity-100 transition-all duration-1000" />
                                    <span className="text-[12px] font-black uppercase tracking-[8px] text-white/20">Encryption_Standard_Uplink</span>
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-[#007ea7] rounded-2xl flex items-center justify-center text-[#003249] shadow-inner group-hover/enc:rotate-[360deg] transition-all duration-1000">
                                            <ShieldCheck size={28} strokeWidth={3} />
                                        </div>
                                        <span className="text-[#80ced7] text-[15px] font-black uppercase tracking-[6px] italic">AES_512_GCM_V4.2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Configuration HUD */}
                <div className="xl:col-span-8 space-y-16">
                    <Reveal direction="up" delay={0.2}>
                        <div className="saas-card shadow-4xl overflow-hidden relative border-4 border-white group bg-white/50 backdrop-blur-md rounded-[5rem]">
                            <div className="p-20 border-b-4 border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-16 bg-slate-50/30">
                                 <div className="flex items-center gap-14">
                                    <div className="w-28 h-28 bg-[#003249] rounded-[3.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl relative overflow-hidden group-hover:rotate-12 transition-all duration-700 border-4 border-white">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                        <Settings size={48} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-5xl font-black uppercase tracking-tighter text-[#003249] italic leading-none mb-1 group-hover:text-[#007ea7] transition-all duration-500">Interface_Synergy</h3>
                                        <p className="text-[13px] font-black text-slate-300 uppercase tracking-[10px] italic opacity-60 leading-none">Calibrate workstation aesthetics and protocol overlays</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-8 px-12 py-6 bg-white rounded-[2.5rem] shadow-4xl border-2 border-slate-50 italic group-hover:scale-105 transition-all duration-700">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981] animate-pulse" />
                                    <span className="text-[13px] font-black text-[#003249] uppercase tracking-[8px]">ROOT: ACTIVE_SYNC</span>
                                 </div>
                            </div>

                            <div className="p-20 space-y-20">
                                {/* Appearance — Premium Light Hub */}
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-16 p-14 bg-slate-50/50 backdrop-blur-sm border-4 border-slate-50 rounded-[4.5rem] group/appearance hover:border-[#007ea7]/30 transition-all duration-1000 shadow-inner group-hover:bg-white">
                                    <div className="flex items-center gap-14 relative z-10 w-full group/inner">
                                        <div className="w-28 h-28 rounded-[3rem] bg-[#003249] text-[#007ea7] shadow-4xl flex items-center justify-center group-hover/appearance:rotate-[360deg] transition-all duration-[2000ms] relative overflow-hidden border-4 border-white/10 shrink-0">
                                             <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                            <Monitor size={48} strokeWidth={2.5} />
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <h4 className="text-4xl font-black uppercase tracking-tighter text-[#003249] mb-1 leading-none italic group-hover:text-[#007ea7] transition-colors">Chromatic_Engine</h4>
                                            <p className="text-[13px] font-black text-slate-300 uppercase tracking-[8px] italic opacity-60">ShieldPro v4.2 Light UI — System Default_Legacy_Locked.</p>
                                        </div>
                                        <button className="h-24 px-16 bg-white border-4 border-slate-50 text-[#007ea7] rounded-[2.5rem] font-black text-[14px] uppercase tracking-[10px] italic flex items-center gap-8 cursor-default shadow-3xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all duration-700 relative overflow-hidden shrink-0">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/5 to-transparent pointer-events-none" />
                                            LIGHT_SYNCED <ShieldCheck size={28} strokeWidth={4} className="text-[#10b981]" />
                                        </button>
                                    </div>
                                </div>

                                {/* Signal Channel Matrices */}
                                <div className="space-y-16">
                                    <div className="flex items-center gap-10 ml-10">
                                        <div className="w-4 h-14 bg-[#007ea7] rounded-full shadow-[0_0_25px_#007ea7]" />
                                        <label className="text-lg font-black uppercase tracking-[15px] text-[#003249] italic">Signal_Matrix_Config</label>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                        {[
                                            { id: 'email', label: 'STATION_EMAILS', icon: Mail, value: notifications.email },
                                            { id: 'sms', label: 'ENCRYPTED_SMS', icon: Smartphone, value: notifications.sms },
                                            { id: 'push', label: 'HUB_OVERLAYS', icon: Layers, value: notifications.push },
                                            { id: 'security', label: 'SECURITY_ALERTS', icon: ShieldAlert, value: notifications.security },
                                        ].map((channel, cIdx) => (
                                            <motion.div 
                                                key={channel.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: cIdx * 0.1 }}
                                                onClick={() => toggleNotification(channel.id)}
                                                className={`p-14 rounded-[4.5rem] border-4 transition-all duration-1000 flex items-center justify-between cursor-pointer group/channel relative overflow-hidden ${
                                                    channel.value 
                                                    ? 'bg-[#003249] border-white text-white shadow-4xl' 
                                                    : 'bg-white border-slate-50 hover:border-[#007ea7]/40 hover:shadow-4xl text-[#003249]'
                                                }`}
                                            >
                                                {channel.value && (
                                                     <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover/channel:scale-150 group-hover/channel:rotate-12 transition-transform duration-[6000ms]">
                                                        <channel.icon size={180} strokeWidth={1.5} />
                                                     </div>
                                                )}
                                                <div className="flex items-center gap-12 relative z-10 w-full">
                                                    <div className={`w-24 h-24 rounded-[3rem] flex items-center justify-center border-4 transition-all duration-1000 ${
                                                        channel.value 
                                                        ? 'bg-white/5 border-white/20 text-[#80ced7] shadow-4xl rotate-12' 
                                                        : 'bg-slate-50 border-slate-100 text-slate-200 group-hover/channel:text-[#007ea7] group-hover/channel:bg-[#003249]'
                                                    }`}>
                                                        <channel.icon size={36} strokeWidth={2.5} />
                                                    </div>
                                                    <div className="flex items-center justify-between flex-1 gap-14">
                                                         <span className={`text-[15px] font-black uppercase tracking-[8px] italic leading-none transition-all duration-1000 ${channel.value ? 'text-white' : 'text-slate-300 group-hover/channel:text-[#003249]'}`}>{channel.label}</span>
                                                         
                                                         <div className={`w-24 h-12 rounded-full relative transition-all duration-1000 shadow-inner overflow-hidden border-4 ${channel.value ? 'bg-emerald-500 border-white' : 'bg-slate-50 border-slate-100'}`}>
                                                             <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none opacity-50" />
                                                            <motion.div 
                                                                animate={{ x: channel.value ? 48 : 8 }}
                                                                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                                                                className={`absolute top-2 w-7 h-7 rounded-full shadow-4xl ${channel.value ? 'bg-white' : 'bg-slate-200 shadow-none'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-20 bg-slate-50/50 border-t-8 border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-16 group/footer">
                                 <div className="flex items-center gap-14">
                                    <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-[3rem] flex items-center justify-center shadow-4xl group-hover/footer:rotate-[360deg] transition-all duration-[2000ms]">
                                        <RefreshCcw size={36} className="text-[#007ea7] animate-spin-slow" strokeWidth={3} />
                                    </div>
                                    <div className="space-y-4">
                                        <span className="text-[14px] font-black uppercase tracking-[12px] text-slate-400 italic block leading-none">AWAITING_COMMIT_SIGNAL</span>
                                        <div className="flex items-center gap-6 bg-white px-6 py-2 rounded-2xl border border-slate-100 shadow-sm italic opacity-60 group-hover:opacity-100 transition-opacity">
                                             <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]" />
                                             <span className="text-[12px] font-black text-slate-400 uppercase tracking-[6px] italic leading-none">Parameters cached in grid buffer...</span>
                                        </div>
                                    </div>
                                 </div>
                                 <button 
                                    onClick={handleSaveProtocols}
                                    className="h-32 px-20 bg-[#003249] text-[#80ced7] rounded-[4rem] text-[18px] font-black uppercase tracking-[20px] shadow-4xl active:scale-95 group/btn italic relative overflow-hidden border-4 border-white"
                                 >
                                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                                    <span className="relative z-10 flex items-center gap-12">
                                        COMMIT_CHASSIS_V4 <Save size={36} strokeWidth={3} className="group-hover/btn:scale-[1.3] transition-transform duration-700" />
                                    </span>
                                 </button>
                            </div>
                        </div>
                    </Reveal>

                    {/* Operational Log Matrix */}
                    <Reveal direction="up" delay={0.4}>
                        <div className="bg-[#003249] text-white rounded-[6rem] border-4 border-white shadow-4xl overflow-hidden relative group p-16 md:p-24">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:scale-125 group-hover:rotate-[-20deg] transition-transform duration-[10000ms]">
                                    <Database size={550} className="text-white" strokeWidth={1} />
                            </div>
                            <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
                            
                            <div className="flex flex-col md:flex-row items-center justify-between gap-16 mb-20 relative z-10 border-b-4 border-white/5 pb-20">
                                <h4 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-14 italic text-[#007ea7] leading-none">
                                    <div className="w-32 h-32 bg-white/5 rounded-[3.5rem] flex items-center justify-center text-[#007ea7] border-4 border-white/10 shadow-4xl group-hover:rotate-[360deg] transition-all duration-[2000ms] relative overflow-hidden">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent animate-pulse" />
                                        <Activity size={56} strokeWidth={3} className="relative z-10" />
                                    </div>
                                    Node_Transmission_Log
                                </h4>
                                <div className="px-12 py-6 bg-white/5 border-2 border-white/10 rounded-[3rem] flex items-center gap-8 italic backdrop-blur-md shadow-2xl">
                                     <Compass size={24} className="text-[#007ea7] animate-pulse" strokeWidth={3} />
                                     <span className="text-[14px] font-black uppercase tracking-[10px] text-white/40">AUTH_SEQ: 0xCZ-V4</span>
                                </div>
                            </div>
                            
                            <div className="space-y-10 relative z-10">
                                {[
                                    { event: 'INTERFACE_ENGINE_CALIB', status: 'SUCCESS', node: 'LOCAL_UI_SIGMA', time: '02:14:12', icon: Layout },
                                    { event: 'MFA_CHALLENGE_IDENTITY', status: 'SUCCESS', node: 'SECURE_GATE_01', time: '01:45:08', icon: Fingerprint },
                                    { event: 'QUANTUM_UPLINK_STABLE', status: 'ACTIVE', node: 'GLOBAL_MAINFRAME', time: '00:12:44', icon: Satellite },
                                 ].map((log, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
                                        className="flex items-center justify-between p-12 bg-white/5 rounded-[4.5rem] border-4 border-white/5 group/log hover:bg-white/10 transition-all duration-1000 cursor-crosshair relative overflow-hidden shadow-2xl"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#007ea7]/10 to-transparent pointer-events-none opacity-0 group-hover/log:opacity-100 transition-all duration-1000" />
                                        <div className="flex items-center gap-14 relative z-10 w-full group/innerlog">
                                            <div className="flex flex-col gap-4 items-center shrink-0">
                                                <div className={`w-6 h-6 rounded-full ${
                                                    log.status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_25px_#10b981]' : 'bg-[#007ea7] animate-pulse shadow-[0_0_25px_#007ea7]'
                                                }`} />
                                                <div className="w-2 h-20 bg-white/10 rounded-full group-hover/log:bg-[#007ea7]/30 transition-colors" />
                                            </div>
                                            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-white/20 group-hover/log:text-[#007ea7] group-hover/log:scale-110 group-hover/log:rotate-12 transition-all duration-700 border-2 border-white/5 shadow-inner shrink-0 leading-none">
                                                <log.icon size={44} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1 flex flex-col xl:flex-row xl:items-center justify-between gap-8 mr-10 leading-none">
                                                <div className="space-y-4">
                                                    <span className="text-xl font-black uppercase tracking-[10px] italic leading-none block group-hover:text-[#007ea7] transition-all duration-700">{log.event}</span>
                                                    <span className="text-[12px] font-black text-white/10 uppercase tracking-[6px] block leading-none italic group-hover:text-[#80ced7] transition-all duration-1000">NODE_REGISTRY://{log.node}</span>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-5 bg-white/5 px-12 py-6 rounded-[2.5rem] border-2 border-white/5 shadow-inner group-hover/log:bg-white/10 transition-all duration-1000 shrink-0">
                                                    <span className="text-2xl font-black text-[#80ced7] italic block leading-none">{log.time}</span>
                                                    <span className="text-[11px] font-black text-white/5 uppercase tracking-[10px] italic leading-none">NODE_TIMESTAMP::UTC</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                 ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Matrix Operational Log Footer */}
            <Reveal direction="up" delay={1}>
                <div className="flex flex-wrap justify-center gap-32 pt-28 border-t-8 border-slate-50 relative">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-72 h-3 bg-[#007ea7] rounded-full shadow-[0_0_30px_#007ea7]" />
                    
                    {[
                        { icon: Fingerprint, label: "HUB_LOCK_ACTIVE" },
                        { icon: Layers, label: "GRID_SYNC_100%" },
                        { icon: Zap, label: "ENCRYPT_v4.2_AES" },
                        { icon: Globe, label: "NODE: CTZ-S1-ELITE" }
                    ].map((status, i) => (
                        <div key={i} className="flex items-center gap-10 group cursor-crosshair">
                            <status.icon size={36} strokeWidth={3} className="text-[#007ea7] opacity-20 group-hover:opacity-100 group-hover:scale-150 group-hover:rotate-[360deg] transition-all duration-[1500ms]" />
                            <span className="text-[15px] font-black text-slate-300 uppercase tracking-[15px] italic leading-none group-hover:text-[#003249] transition-all duration-700">{status.label}</span>
                        </div>
                    ))}
                </div>
            </Reveal>
        </div>
    );
};

export default CustomerSettings;