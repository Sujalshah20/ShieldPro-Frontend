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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-black mb-1">Account Settings</h1>
                    <p className="text-black font-bold text-xs uppercase tracking-wide">Manage your profile, security, and notification preferences.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-black uppercase tracking-[2px]">Last synced: Just now</span>
                    <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-black hover:text-white transition-colors shadow-sm">
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-4 space-y-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-4 ${
                                activeTab === tab.id
                                    ? 'bg-[#002b45] border-[#002b45] text-white shadow-md'
                                    : 'bg-white border-slate-100 text-black font-bold hover:border-slate-200 hover:bg-gray-50'
                            }`}
                        >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                activeTab === tab ? 'bg-white/10 text-white' : 'bg-gray-100 text-black'
                            }`}>
                                <tab.icon size={18} />
                            </div>
                            <div>
                                <p className="font-black text-xs leading-none mb-1 uppercase tracking-wide">{tab.label}</p>
                                <p className={`text-[9px] uppercase tracking-[2px] font-black ${activeTab === tab.id ? 'text-white/80' : 'text-black/60'}`}>
                                    {tab.sub}
                                </p>
                            </div>
                            {activeTab === tab.id && <ChevronRight size={16} className="ml-auto opacity-60" />}
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-[#f8fafc] rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#002b45] flex items-center justify-center text-white">
                                <Shield size={16} />
                            </div>
                            <p className="font-bold text-black text-sm">Security Check</p>
                        </div>
                        <p className="text-xs text-black font-bold leading-relaxed mb-4 italic">Your account security is 85% complete. Enable 2FA to reach 100%.</p>
                        <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-black hover:bg-gray-50 transition-colors uppercase tracking-widest">
                            Complete Setup
                        </button>
                    </div>
                </div>

                {/* Content HUD */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                        >
                            <div className="p-5 md:p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <div>
                                    <h2 className="text-lg font-black text-black uppercase tracking-wide">
                                        {tabs.find(t => t.id === activeTab)?.label}
                                    </h2>
                                    <p className="text-[11px] text-black font-bold uppercase tracking-wider italic">Update your preferences and account configuration</p>
                                </div>
                                <div className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-wider">
                                    SYNCHRONIZED
                                </div>
                            </div>

                            <div className="p-5 md:p-6 space-y-6">
                                {activeTab === 'profile' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-gray-100 shadow-md">
                                                    <img src="https://i.pravatar.cc/150?u=rahul" alt="Avatar" className="w-full h-full object-cover" />
                                                </div>
                                                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-slate-200 rounded-lg shadow-lg flex items-center justify-center text-black hover:text-[#002b45] transition-colors">
                                                    <RefreshCcw size={14} />
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-black uppercase tracking-wide">Profile Picture</h3>
                                                <p className="text-xs text-black font-bold mt-1 italic">PNG, JPG or GIF. Max size 2MB.</p>
                                                <div className="flex gap-3 mt-3">
                                                    <button className="text-[10px] font-black text-black uppercase tracking-wider py-1.5 px-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Change</button>
                                                    <button className="text-[10px] font-black text-rose-500 uppercase tracking-wider py-1.5 px-3 border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors">Remove</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                                            {[
                                                { label: "First Name", icon: User, val: "Rahul" },
                                                { label: "Last Name", icon: User, val: "Sharma" },
                                                { label: "Email Address", icon: Mail, val: "rahul.sharma@example.com" },
                                                { label: "Phone Number", icon: Smartphone, val: "+91 98765 43210" },
                                            ].map((field, i) => (
                                                <div key={i} className="space-y-2">
                                                    <label className="text-[10px] font-black text-black uppercase tracking-[2.5px]">{field.label}</label>
                                                    <div className="relative">
                                                        <field.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                                                        <input 
                                                            type="text" 
                                                            defaultValue={field.val}
                                                            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#002b45] transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-black uppercase tracking-[2.5px]">Timezone</label>
                                                <div className="relative">
                                                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                                                    <select className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-slate-200 rounded-xl text-sm font-bold text-black focus:outline-none focus:border-[#002b45] transition-all appearance-none">
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
                                        <p className="text-[12px] font-black text-black opacity-60 leading-relaxed italic uppercase tracking-tighter">Choose how you receive alerts about your policies, claims, and security updates.</p>
                                        <div className="space-y-4">
                                            {[
                                                { id: 'email', label: 'Email Notifications', sub: 'Receive weekly summaries and important policy updates.', icon: Mail },
                                                { id: 'sms', label: 'SMS Notifications', sub: 'Get instant alerts for claim status and critical renewals.', icon: Smartphone },
                                                { id: 'push', label: 'Push Notifications', sub: 'Real-time updates directly in your browser or mobile app.', icon: Bell },
                                                { id: 'security', label: 'Security Alerts', sub: 'Mandatory alerts for login attempts and password changes.', icon: ShieldCheck, mandatory: true },
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-start justify-between p-4 border border-gray-50 rounded-2xl hover:bg-gray-50/50 transition-colors">
                                                    <div className="flex gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-[#002b45]/5 text-white flex items-center justify-center shrink-0">
                                                            <item.icon size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-black text-black text-sm uppercase tracking-wide">{item.label}</p>
                                                                {item.mandatory && <span className="bg-[#002b45] text-white text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">Required</span>}
                                                            </div>
                                                            <p className="text-xs text-black font-bold mt-1 max-w-sm italic">{item.sub}</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        disabled={item.mandatory}
                                                        onClick={() => toggleNotification(item.id)}
                                                        className={`w-12 h-6 rounded-full relative transition-all duration-300 shadow-inner ${
                                                            notifications[item.id] ? 'bg-emerald-500' : 'bg-gray-200'
                                                        } ${item.mandatory ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                        <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                                            <Info size={18} className="text-[#3b82f6] shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-bold text-black mb-1">Two-Factor Authentication is Disabled</p>
                                                <p className="text-xs text-blue-700/70 leading-relaxed">Protect your account with an extra layer of security. We recommend using a generator app like Google Authenticator.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-black opacity-40 uppercase tracking-[4px] px-1 italic">Change_Security_Vector</h4>
                                            {[
                                                { label: "Current Password" },
                                                { label: "New Password" },
                                                { label: "Confirm New Password" },
                                            ].map((field, i) => (
                                                <div key={i} className="space-y-2">
                                                    <label className="text-xs font-black text-black uppercase tracking-wide">{field.label}</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="password" 
                                                            className="w-full px-4 py-3 bg-gray-50/50 border border-slate-200 rounded-xl text-sm font-bold text-black focus:outline-none focus:border-[#002b45] transition-all"
                                                        />
                                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-[#002b45]">
                                                            <Eye size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 flex flex-col md:flex-row gap-4">
                                            <button className="flex-1 py-3 bg-[#002b45] text-white rounded-xl font-black text-xs hover:bg-[#003b5c] transition-colors shadow-sm uppercase tracking-widest">
                                                Update Password
                                            </button>
                                            <button className="flex-1 py-3 bg-white border border-slate-200 text-black rounded-xl font-black text-xs hover:bg-gray-50 transition-colors uppercase tracking-widest">
                                                Setup Two-Factor (2FA)
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'billing' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-black opacity-40 uppercase tracking-[4px] px-1 italic">Active_Payment_Nodes</h4>
                                            <div className="p-5 border border-gray-100 rounded-2xl flex items-center justify-between bg-white shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-8 bg-[#002b45] rounded-md flex items-center justify-center text-white font-bold italic text-[10px]">
                                                        VISA
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-black text-sm">•••• •••• •••• 4582</p>
                                                        <p className="text-[10px] text-black font-black uppercase tracking-[2px] mt-0.5">Expires 12/26 • Primary</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="text-[10px] font-black text-black uppercase tracking-wider py-1.5 px-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Edit</button>
                                                </div>
                                            </div>
                                            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-black font-black hover:border-[#002b45]/30 hover:bg-[#002b45]/5 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                                                + Add New Payment Method
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[10px] font-black text-black opacity-40 uppercase tracking-[4px] px-1 italic">Recent_Invoice_Sync</h4>
                                                <button className="text-[10px] font-black text-black uppercase tracking-widest hover:underline">View All</button>
                                            </div>
                                            <div className="border border-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-50">
                                                {[
                                                    { id: "#INV-8821", date: "Oct 12, 2023", amt: "₹12,450.00", status: "Paid" },
                                                    { id: "#INV-8794", date: "Sep 12, 2023", amt: "₹12,450.00", status: "Paid" },
                                                ].map((inv) => (
                                                    <div key={inv.id} className="p-4 flex items-center justify-between bg-white hover:bg-gray-50/50 transition-colors">
                                                        <div className="flex gap-4 items-center font-black text-sm">
                                                            <span className="text-black">{inv.id}</span>
                                                            <span className="text-black/60 italic">{inv.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <span className="font-black text-black text-sm">{inv.amt}</span>
                                                            <button className="p-2 text-black hover:text-[#002b45] transition-colors"><RefreshCcw size={16} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 md:p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-emerald-600">
                                    <CheckCircle2 size={16} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Auto-save Enabled</span>
                                </div>
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-8 py-3 bg-[#002b45] text-white rounded-xl font-black text-[9px] uppercase tracking-[6px] italic shadow-xl active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                                    SAVE_PREFERENCES
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