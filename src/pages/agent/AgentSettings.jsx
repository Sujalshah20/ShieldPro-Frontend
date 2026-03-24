import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Sun, Moon, Zap, User, Mail, 
    Smartphone, Globe, ShieldCheck, 
    ChevronRight, CreditCard, Eye, 
    EyeOff, Save, RefreshCcw, Info,
    CheckCircle2, AlertCircle, Laptop,
    Smartphone as MobileIcon,
    LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AgentSettings = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('security');
    const [loading, setLoading] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(true);

    const [notifications, setNotifications] = useState({
        newApplications: { email: true, inApp: true },
        claimStatus: { email: true, inApp: true },
        policyRenewals: { email: true, inApp: false },
        commission: { email: true, inApp: true }
    });

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Preferences Saved",
                description: "Your account settings have been updated successfully.",
            });
        }, 1000);
    };

    const tabs = [
        { id: 'security', label: 'Account Security' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'preferences', label: 'Preferences' }
    ];

    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-8 min-h-screen">
            {/* Header */}
            <div className="space-y-1">
                <Reveal>
                    <h1 className="text-3xl font-black text-black uppercase tracking-tighter italic">Settings</h1>
                </Reveal>
                <p className="text-black/40 text-[11px] font-black uppercase tracking-[2px] italic">Manage your account security and application preferences.</p>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex gap-12 border-b border-slate-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 text-[10px] font-black uppercase tracking-[3px] transition-all relative italic ${
                            activeTab === tab.id ? "text-black opacity-100" : "text-black opacity-20 hover:opacity-100"
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeSettingsTab"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                >
                    {activeTab === 'security' && (
                        <>
                            {/* Change Password */}
                            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-white bg-slate-50">
                                    <h3 className="text-[11px] font-black text-black uppercase tracking-[3px] italic font-black">Change Password</h3>
                                </div>
                                <div className="p-8 max-w-xl space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">Current Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all italic"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all italic"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all italic"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button className="h-12 px-8 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black/90 transition-all shadow-3xl active:scale-95 italic border-b-4 border-white/10">
                                        Update Password
                                    </button>
                                </div>
                            </section>

                            {/* 2FA */}
                            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-[11px] font-black text-black uppercase tracking-[3px] italic font-black">Two-Factor Authentication (2FA)</h3>
                                    <p className="text-[10px] font-black text-black opacity-30 uppercase tracking-[2px] mt-1.5 italic">Add an extra layer of security to your account by requiring a code from your phone at login.</p>
                                </div>
                                <button 
                                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                                        is2FAEnabled ? 'bg-emerald-500' : 'bg-slate-200'
                                    }`}
                                >
                                    <motion.div 
                                        animate={{ x: is2FAEnabled ? 26 : 4 }}
                                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                                    />
                                </button>
                            </section>

                            {/* Active Sessions */}
                            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-white bg-slate-50">
                                    <h3 className="text-[11px] font-black text-black uppercase tracking-[3px] italic font-black">Active Sessions</h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                     <div className="p-6 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black/20">
                                                <Laptop size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-black text-black uppercase tracking-widest text-[12px] italic">MacBook Pro - Chrome (Current Session)</p>
                                                <p className="text-[10px] text-black/30 font-black uppercase tracking-widest italic">San Francisco, USA • IP: 192.168.1.1</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-[2px] italic">Active Now</span>
                                    </div>
                                     <div className="p-6 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black/20">
                                                <MobileIcon size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-black text-black uppercase tracking-widest text-[12px] italic">iPhone 15 - Safari</p>
                                                <p className="text-[10px] text-black/30 font-black uppercase tracking-widest italic">San Francisco, USA • 2 hours ago</p>
                                            </div>
                                        </div>
                                        <button className="text-rose-500 font-black text-[10px] uppercase tracking-widest italic hover:underline">Revoke</button>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-white bg-slate-50">
                                <h3 className="text-[11px] font-black text-black uppercase tracking-[3px] italic font-black">Notification Preferences</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                            <th className="px-8 py-4">Activity</th>
                                            <th className="px-8 py-4 text-center">Email</th>
                                            <th className="px-8 py-4 text-center">In-App</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-sm">
                                        {[
                                            { id: 'newApplications', label: 'New Applications' },
                                            { id: 'claimStatus', label: 'Claim Status Changes' },
                                            { id: 'policyRenewals', label: 'Policy Renewals' },
                                            { id: 'commission', label: 'Commission Payouts' }
                                        ].map((row) => (
                                            <tr key={row.id}>
                                                <td className="px-8 py-6 font-black text-black uppercase text-[12px] tracking-widest italic">{row.label}</td>
                                                <td className="px-8 py-6 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={notifications[row.id].email}
                                                        onChange={() => setNotifications(prev => ({
                                                            ...prev,
                                                            [row.id]: { ...prev[row.id], email: !prev[row.id].email }
                                                        }))}
                                                        className="w-5 h-5 rounded border-slate-200 text-[#1f3b61] focus:ring-[#1f3b61]"
                                                    />
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={notifications[row.id].inApp}
                                                        onChange={() => setNotifications(prev => ({
                                                            ...prev,
                                                            [row.id]: { ...prev[row.id], inApp: !prev[row.id].inApp }
                                                        }))}
                                                        className="w-5 h-5 rounded border-slate-200 text-[#1f3b61] focus:ring-[#1f3b61]"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-inner">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">Language</label>
                                    <select className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-[12px] font-black focus:border-black outline-none transition-all italic appearance-none cursor-pointer uppercase tracking-widest">
                                        <option>English (United States)</option>
                                        <option>Spanish (ES)</option>
                                        <option>French (FR)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">Timezone</label>
                                    <select className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-[12px] font-black focus:border-black outline-none transition-all italic appearance-none cursor-pointer uppercase tracking-widest">
                                        <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                                        <option>(UTC+05:30) India Standard Time</option>
                                        <option>(UTC+00:00) Greenwich Mean Time</option>
                                    </select>
                                </div>
                            </section>

                            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
                                <h3 className="text-[11px] font-black text-black uppercase tracking-[3px] italic font-black">Theme Appearance</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3 cursor-pointer group">
                                        <div className="aspect-[16/9] rounded-2xl bg-white border-2 border-black p-4 flex flex-col gap-2 relative overflow-hidden shadow-3xl">
                                            <div className="w-full h-2 bg-slate-100 rounded-full" />
                                            <div className="w-2/3 h-2 bg-slate-50 rounded-full" />
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-center text-[11px] font-black text-black uppercase tracking-widest italic">Light Mode_</p>
                                    </div>
                                    <div className="space-y-3 cursor-pointer group">
                                        <div className="aspect-[16/9] rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col gap-2 relative overflow-hidden">
                                            <div className="w-full h-2 bg-slate-700 rounded-full" />
                                            <div className="w-2/3 h-2 bg-slate-800 rounded-full" />
                                        </div>
                                        <p className="text-center text-[11px] font-black text-black/40 group-hover:text-black uppercase tracking-widest italic transition-colors">Dark Mode_</p>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end">
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="h-14 px-10 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-[3px] shadow-3xl hover:bg-black/90 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 italic border-b-4 border-white/10"
                                >
                                    {loading && <RefreshCcw size={16} className="animate-spin" />}
                                    Save System Preferences_
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AgentSettings;
