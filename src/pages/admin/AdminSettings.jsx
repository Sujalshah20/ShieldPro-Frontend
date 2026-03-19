import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Settings, Shield, Zap, Server, 
    IndianRupee, Save, Database, 
    RefreshCcw, Bell, Lock, 
    Fingerprint, Activity, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminSettings = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("Security");

    const tabs = [
        { id: "Security", icon: Shield, label: "Security" },
        { id: "Protocols", icon: Zap, label: "Protocols" },
        { id: "Nodes", icon: Server, label: "Nodes" },
        { id: "Fiscal", icon: IndianRupee, label: "Fiscal Rules" }
    ];

    const handleSave = () => {
        toast({ title: "System settings synchronized" });
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Settings</h1>
                        <p className="text-sm font-medium text-slate-400">Configure core parameters and operational logic</p>
                    </div>
                </Reveal>
                
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">System Uptime</p>
                        <p className="text-lg font-black text-blue-600 tracking-tighter">99.998%</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        className="h-12 px-6 bg-[#1a2332] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        <Save size={18} /> Synchronize All
                    </button>
                </div>
            </div>

            {/* Main Interface */}
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Tabs Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full h-14 px-5 rounded-2xl flex items-center justify-between group transition-all ${
                                activeTab === tab.id 
                                ? "bg-white text-blue-600 shadow-sm border border-blue-50" 
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-transparent"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon size={18} className={activeTab === tab.id ? "text-blue-500" : "text-slate-300"} />
                                <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full transition-all ${activeTab === tab.id ? "bg-blue-500" : "bg-transparent"}`} />
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-10"
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800 border border-slate-100">
                                    {React.createElement(tabs.find(t => t.id === activeTab).icon, { size: 24 })}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight">{activeTab} Parameters</h2>
                                    <p className="text-xs font-medium text-slate-400">Configuration for the system's {activeTab.toLowerCase()} node</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Calibration Mode</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="h-14 bg-blue-50 border border-blue-200 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                                Standard
                                            </button>
                                            <button className="h-14 bg-slate-50 border border-transparent rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                                                Elevated
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Telemetry Sync Status</label>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: "85%" }}
                                                className="h-full bg-blue-500 rounded-full"
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 italic">
                                            <span>Active Monitoring</span>
                                            <span>85% Decrypted</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Grid Notifications</label>
                                    {[
                                        { label: "Critical Alerts", status: true },
                                        { label: "Policy Transmissions", status: true },
                                        { label: "Analytical Reports", status: false }
                                    ].map((n, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                            <span className="text-xs font-bold text-slate-600">{n.label}</span>
                                            <div className={`w-10 h-5 rounded-full p-1 transition-all flex items-center ${n.status ? 'bg-blue-500' : 'bg-slate-300'}`}>
                                                <div className={`w-3 h-3 bg-white rounded-full transition-all ${n.status ? 'translate-x-5' : ''}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between gap-6 opacity-30">
                                <div className="flex items-center gap-3">
                                    <Fingerprint size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-[2px]">Authorization: SECURE_AES_256</span>
                                </div>
                                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[2px] hidden md:flex">
                                    <span className="flex items-center gap-2"><Database size={14} /> NOMINAL</span>
                                    <span className="flex items-center gap-2"><Activity size={14} /> ACTIVE</span>
                                    <span className="flex items-center gap-2"><RefreshCcw size={14} /> SYNCED</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
