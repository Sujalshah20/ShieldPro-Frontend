import React, { useState } from "react";
import { 
    Settings, Shield, Lock, Bell, 
    Monitor, Sun, Zap, User, Mail, 
    Smartphone, Globe, ShieldCheck, 
    ChevronRight, CreditCard, Eye, 
    EyeOff, Save, RefreshCcw, Info,
    CheckCircle2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const CustomerSettings = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
        security: true
    });
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Settings Updated",
                description: "Your preferences have been successfully saved.",
            });
        }, 1000);
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User, sub: 'Personal information and avatar' },
        { id: 'security', label: 'Password & Security', icon: Lock, sub: 'Manage your account security' },
        { id: 'notifications', label: 'Notification Preferences', icon: Bell, sub: 'Control how we reach you' },
        { id: 'billing', label: 'Billing & Payments', icon: CreditCard, sub: 'Payment methods and history' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 font-sans pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Account Settings</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage your profile, security, and communication preferences.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last synced: Just now</span>
                    <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#134e8d] hover:border-[#134e8d] transition-all shadow-sm">
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-4 space-y-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                                activeTab === tab.id
                                    ? 'bg-[#134e8d] border-[#134e8d] text-white shadow-lg shadow-blue-100'
                                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                activeTab === tab.id ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400'
                            }`}>
                                <tab.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold text-sm leading-none mb-1.5 ${activeTab === tab.id ? 'text-white' : 'text-slate-700'}`}>{tab.label}</p>
                                <p className={`text-[10px] uppercase tracking-wider font-bold ${activeTab === tab.id ? 'text-white/60' : 'text-slate-400'}`}>
                                    {tab.sub}
                                </p>
                            </div>
                            {activeTab === tab.id && <ChevronRight size={16} className="opacity-60" />}
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#134e8d] flex items-center justify-center text-white">
                                <Shield size={16} />
                            </div>
                            <p className="font-bold text-slate-800 text-sm">Account Security</p>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">Your security score is <span className="text-[#134e8d] font-bold">85%</span>. Enable Two-Factor authentication to secure your account fully.</p>
                        <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-wider shadow-sm">
                            Setup 2FA Now
                        </button>
                    </div>
                </div>

                {/* Content HUD */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col"
                        >
                            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {tabs.find(t => t.id === activeTab)?.label}
                                    </h2>
                                    <p className="text-xs text-slate-400 font-medium mt-1">Update your preferences and account configuration</p>
                                </div>
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                                    Active Session
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-8 flex-1">
                                {activeTab === 'profile' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-8">
                                            <div className="relative group">
                                                <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-lg">
                                                    <img src="https://i.pravatar.cc/150?u=rahul" alt="Avatar" className="w-full h-full object-cover" />
                                                </div>
                                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-slate-200 rounded-2xl shadow-xl flex items-center justify-center text-slate-400 hover:text-[#134e8d] hover:border-[#134e8d] transition-all">
                                                    <RefreshCcw size={16} />
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg mb-1">Profile Photo</h3>
                                                <p className="text-xs text-slate-400 font-medium mb-4">Recommended: Square image, at least 400x400px.</p>
                                                <div className="flex gap-3">
                                                    <button className="text-xs font-bold text-white bg-[#134e8d] px-5 py-2 rounded-xl hover:bg-[#002b45] transition-all shadow-md shadow-blue-50">Upload New</button>
                                                    <button className="text-xs font-bold text-rose-500 bg-white border border-rose-100 px-5 py-2 rounded-xl hover:bg-rose-50 transition-all">Remove</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                            {[
                                                { label: "First Name", icon: User, val: "Rahul" },
                                                { label: "Last Name", icon: User, val: "Sharma" },
                                                { label: "Email Address", icon: Mail, val: "rahul.sharma@example.com" },
                                                { label: "Phone Number", icon: Smartphone, val: "+91 98765 43210" },
                                            ].map((field, i) => (
                                                <div key={i} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                                                    <div className="relative">
                                                        <field.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input 
                                                            type="text" 
                                                            defaultValue={field.val}
                                                            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-50/50 focus:border-[#134e8d] transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Timezone</label>
                                                <div className="relative">
                                                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <select className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-50/50 focus:border-[#134e8d] transition-all appearance-none cursor-pointer">
                                                        <option>(GMT+05:30) Mumbai, New Delhi</option>
                                                        <option>(GMT+00:00) London, United Kingdom</option>
                                                        <option>(GMT-05:00) New York, USA</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="space-y-6">
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Choose how you receive alerts about your policies, claims, and security updates.</p>
                                        <div className="space-y-4">
                                            {[
                                                { id: 'email', label: 'Email Notifications', sub: 'Receive weekly summaries and important policy updates.', icon: Mail },
                                                { id: 'sms', label: 'SMS Notifications', sub: 'Get instant alerts for claim status and critical renewals.', icon: Smartphone },
                                                { id: 'push', label: 'Push Notifications', sub: 'Real-time updates directly in your browser or mobile app.', icon: Bell },
                                                { id: 'security', label: 'Security Alerts', sub: 'Mandatory alerts for login attempts and password changes.', icon: ShieldCheck, mandatory: true },
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-start justify-between p-5 border border-slate-50 rounded-2xl hover:bg-slate-50/40 transition-all group">
                                                    <div className="flex gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#134e8d] flex items-center justify-center shrink-0 group-hover:bg-[#134e8d] group-hover:text-white transition-all">
                                                            <item.icon size={22} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <p className="font-bold text-slate-800 text-sm tracking-tight">{item.label}</p>
                                                                {item.mandatory && <span className="bg-slate-100 text-slate-400 text-[8px] px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">System Required</span>}
                                                            </div>
                                                            <p className="text-xs text-slate-400 font-medium mt-1.5 max-w-sm">{item.sub}</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        disabled={item.mandatory}
                                                        onClick={() => toggleNotification(item.id)}
                                                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                                                            notifications[item.id] ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-slate-200'
                                                        } ${item.mandatory ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        <motion.div 
                                                            animate={{ x: notifications[item.id] ? 26 : 4 }}
                                                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                                                        />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-8">
                                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#134e8d] shrink-0">
                                                <Info size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 mb-1.5">Two-Factor Authentication (2FA)</p>
                                                <p className="text-xs text-slate-500 leading-relaxed font-medium">Protect your account with an extra layer of security. We recommend using an authenticator app like Google Authenticator or Authy.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Security Update</h4>
                                            {[
                                                { label: "Current Password" },
                                                { label: "New Password" },
                                                { label: "Confirm New Password" },
                                            ].map((field, i) => (
                                                <div key={i} className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-700 ml-1">{field.label}</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="password" 
                                                            placeholder={`Enter ${field.label.toLowerCase()}`}
                                                            className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-50/50 focus:border-[#134e8d] transition-all"
                                                        />
                                                        <button className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#134e8d] transition-colors">
                                                            <Eye size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 flex flex-col md:flex-row gap-4">
                                            <button className="flex-1 py-4 bg-[#134e8d] text-white rounded-2xl font-bold text-sm hover:bg-[#002b45] transition-all shadow-lg shadow-blue-100 transform hover:-translate-y-0.5">
                                                Update Credentials
                                            </button>
                                            <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                                                Configure 2FA
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'billing' && (
                                    <div className="space-y-10">
                                        <div className="space-y-5">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Saved Payment Methods</h4>
                                            <div className="p-6 border border-slate-100 rounded-2xl flex items-center justify-between bg-white shadow-sm hover:border-blue-100 transition-all group">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-10 bg-[#134e8d] rounded-lg flex items-center justify-center text-white font-bold italic text-[11px] shadow-inner">
                                                        VISA
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm tracking-wider">•••• •••• •••• 4582</p>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expires 12/26</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Primary Card</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2 px-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:text-[#134e8d] hover:border-[#134e8d] transition-all">Edit Details</button>
                                                </div>
                                            </div>
                                            <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-[#134e8d] hover:bg-blue-50/30 hover:text-[#134e8d] transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-wider">
                                                <CreditCard size={18} /> Add New Payment Method
                                            </button>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between px-1">
                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Transactions</h4>
                                                <button className="text-[10px] font-bold text-[#134e8d] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View All Invoices</button>
                                            </div>
                                            <div className="border border-slate-50 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-50">
                                                {[
                                                    { id: "#INV-8821", date: "Oct 12, 2023", amt: "₹12,450.00", status: "Paid" },
                                                    { id: "#INV-8794", date: "Sep 12, 2023", amt: "₹12,450.00", status: "Paid" },
                                                ].map((inv) => (
                                                    <div key={inv.id} className="p-5 flex items-center justify-between bg-white hover:bg-slate-50/40 transition-all group">
                                                        <div className="flex gap-6 items-center">
                                                            <span className="font-mono text-xs font-bold text-slate-800">{inv.id}</span>
                                                            <span className="text-xs text-slate-400 font-medium">{inv.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-8">
                                                            <span className="font-bold text-slate-800 text-sm">{inv.amt}</span>
                                                            <button className="p-2.5 text-slate-400 hover:text-[#134e8d] hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"><Download size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-3 text-emerald-500">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Settings secure & synced</span>
                                </div>
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-10 py-4 bg-[#134e8d] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transform active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 hover:bg-[#002b45]"
                                >
                                    {loading ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save All Changes
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CustomerSettings;