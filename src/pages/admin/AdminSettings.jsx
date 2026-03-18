import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Settings, Shield, Zap, Globe, Lock, RefreshCcw, IndianRupee,
    Search, Filter, Mail, Phone, Calendar, ChevronRight, 
    ArrowUpRight, FileText, AlertCircle, Clock, Download,
    Terminal, Fingerprint, Lock as LockIcon, ShieldCheck, Activity, TrendingUp, MoreHorizontal,
    Briefcase, Cpu, Layers, Bell, Eye, EyeOff, Save, Database, Server
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminSettings = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("Security");

    const tabs = [
        { id: "Security", icon: Shield, label: "Grid_Security" },
        { id: "Protocols", icon: Zap, label: "Protocol_Sync" },
        { id: "Nodes", icon: Server, label: "Node_Configuration" },
        { id: "Fiscal", icon: IndianRupee, label: "Fiscal_Rules" }
    ];

    const handleSave = () => {
        toast({ title: "Calibration parameters synchronized" });
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header Module */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Global_Controller</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none text-wrap break-all">
                            System <span className="text-[#007ea7]">Calibration_</span>
                        </h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">
                            Fine-tuning core grid parameters and governing logic for the ShieldPro ecosystem.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-4">
                        <div className="h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center gap-6 shadow-inner italic font-black">
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Protocol_Uptime</span>
                                <span className="text-xl text-[#003249] tracking-tight">99.998%</span>
                            </div>
                            <div className="w-3 h-3 bg-[#007ea7] rounded-full animate-ping" />
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Tactical Navigation */}
            <div className="flex flex-wrap gap-4 p-3 bg-white border-2 border-slate-50 rounded-[2rem] shadow-3xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`h-16 px-8 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-[4px] transition-all italic flex-1 min-w-[180px] ${
                            activeTab === tab.id 
                            ? "bg-[#003249] text-[#80ced7] shadow-xl shadow-blue-500/10" 
                            : "text-slate-400 hover:bg-slate-50 hover:text-[#003249]"
                        }`}
                    >
                        <tab.icon size={20} strokeWidth={3} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Configuration Interface */}
            <div className="grid lg:grid-cols-1 gap-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-4xl overflow-hidden relative"
                    >
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
                        
                        <div className="p-12 md:p-16 space-y-16 relative z-10 italic">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-[#003249] rounded-3xl flex items-center justify-center text-[#007ea7] shadow-4xl border border-white/5">
                                    {tabs.find(t => t.id === activeTab).icon({ size: 40, strokeWidth: 2.5 })}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] leading-none">{activeTab}_Parameters</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] leading-none">Hardware and software calibration for {activeTab.toLowerCase()} node.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-10">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] leading-none pl-2">Security_Mode</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button className="h-20 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex flex-col items-center justify-center gap-1 group">
                                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">STANDARD</span>
                                                <span className="text-[8px] font-black text-emerald-400/60 uppercase">NOMINAL_VAL</span>
                                            </button>
                                            <button className="h-20 bg-slate-50 border-2 border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-1 opacity-40">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ELEVATED</span>
                                                <span className="text-[8px] font-black text-slate-400/60 uppercase">LOCKED_MODE</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] leading-none pl-2">Sync_Frequency</h4>
                                        <div className="relative h-12 bg-slate-50 rounded-full overflow-hidden border-2 border-slate-50 italic">
                                            <div className="absolute inset-y-0 left-0 bg-[#007ea7] w-[75%] flex items-center justify-end pr-6">
                                                <span className="text-[10px] font-black text-white uppercase tracking-[4px]">750MHz</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] leading-none pl-2">Notification_Channels</h4>
                                        <div className="space-y-4 font-mono">
                                            {[
                                                { label: "GRID_ALERTS", status: true },
                                                { label: "FISCAL_SIGNALS", status: true },
                                                { label: "USER_TELEMETRY", status: false }
                                            ].map((n, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-slate-50">
                                                    <span className="text-[11px] font-black uppercase tracking-[3px] text-[#003249]">{n.label}</span>
                                                    <div className={`w-12 h-6 rounded-full p-1 transition-all ${n.status ? 'bg-[#007ea7]' : 'bg-slate-200'}`}>
                                                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${n.status ? 'translate-x-6' : ''}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-10 font-mono">
                                <div className="flex items-center gap-6 opacity-30">
                                    <Fingerprint size={24} />
                                    <div>
                                        <p className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] leading-none mb-1">Authorization_Token</p>
                                        <p className="text-[8px] font-black text-[#003249] uppercase tracking-widest leading-none">SESSION_SECURE_AES</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSave}
                                    className="h-20 w-full sm:w-auto px-16 bg-[#003249] text-[#80ced7] rounded-[1.5rem] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[6px] hover:bg-[#007ea7] hover:text-white transition-all shadow-4xl active:scale-95 italic group"
                                >
                                    <Save size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> SYNCHRONIZE_CORE
                                </button>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50/20 border-t border-slate-50 flex flex-wrap justify-center gap-12 text-[10px] font-black text-[#003249] uppercase tracking-[5px] opacity-30 mt-auto">
                            <div className="flex items-center gap-3"><Database size={14} /> DB_Link: NOMINAL</div>
                            <div className="flex items-center gap-3"><Activity size={14} /> LOAD_BALANCER: 0.12%</div>
                            <div className="flex items-center gap-3"><RefreshCcw size={14} /> CLOUD_SYNC: ACTIVE</div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminSettings;
