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
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Settings</h1>
                </Reveal>
                <p className="text-slate-500 text-sm font-medium">Manage your account security and application preferences.</p>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex gap-8 border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 text-sm font-bold transition-all relative ${
                            activeTab === tab.id ? "text-[#1f3b61]" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeSettingsTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1f3b61]"
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
                                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                                    <h3 className="font-bold text-slate-800">Change Password</h3>
                                </div>
                                <div className="p-8 max-w-xl space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">Current Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1f3b61] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1f3b61] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1f3b61] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button className="px-6 py-3 bg-[#1f3b61] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/10 hover:bg-[#162a45] transition-all">
                                        Update Password
                                    </button>
                                </div>
                            </section>

                            {/* 2FA */}
                            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-800">Two-Factor Authentication (2FA)</h3>
                                    <p className="text-xs text-slate-500 font-medium">Add an extra layer of security to your account by requiring a code from your phone at login.</p>
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
                                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                                    <h3 className="font-bold text-slate-800">Active Sessions</h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    <div className="p-6 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Laptop size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-slate-800 text-sm">MacBook Pro - Chrome (Current Session)</p>
                                                <p className="text-xs text-slate-400 font-medium tracking-tight">San Francisco, USA • IP: 192.168.1.1</p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Active Now</span>
                                    </div>
                                    <div className="p-6 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <MobileIcon size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-slate-800 text-sm">iPhone 15 - Safari</p>
                                                <p className="text-xs text-slate-400 font-medium tracking-tight">San Francisco, USA • 2 hours ago</p>
                                            </div>
                                        </div>
                                        <button className="text-rose-500 font-bold text-xs uppercase tracking-wider hover:underline">Revoke</button>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                                <h3 className="font-bold text-slate-800">Notification Preferences</h3>
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
                                                <td className="px-8 py-6 font-bold text-slate-700">{row.label}</td>
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
                            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Language</label>
                                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1f3b61] appearance-none font-medium">
                                        <option>English (United States)</option>
                                        <option>Spanish (ES)</option>
                                        <option>French (FR)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Timezone</label>
                                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1f3b61] appearance-none font-medium">
                                        <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                                        <option>(UTC+05:30) India Standard Time</option>
                                        <option>(UTC+00:00) Greenwich Mean Time</option>
                                    </select>
                                </div>
                            </section>

                            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
                                <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">Theme Appearance</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3 cursor-pointer group">
                                        <div className="aspect-[16/9] rounded-2xl bg-slate-50 border-2 border-[#1f3b61] p-4 flex flex-col gap-2 relative overflow-hidden">
                                            <div className="w-full h-2 bg-slate-200 rounded-full" />
                                            <div className="w-2/3 h-2 bg-slate-100 rounded-full" />
                                            <div className="absolute inset-0 bg-[#1f3b61]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-center text-sm font-bold text-slate-800">Light Mode</p>
                                    </div>
                                    <div className="space-y-3 cursor-pointer group">
                                        <div className="aspect-[16/9] rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col gap-2 relative overflow-hidden">
                                            <div className="w-full h-2 bg-slate-700 rounded-full" />
                                            <div className="w-2/3 h-2 bg-slate-800 rounded-full" />
                                        </div>
                                        <p className="text-center text-sm font-bold text-slate-400">Dark Mode</p>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end">
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-8 py-3.5 bg-[#1f3b61] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-900/10 hover:bg-[#162a45] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {loading && <RefreshCcw size={16} className="animate-spin" />}
                                    Save Preferences
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
