import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { 
    User as UserIcon, Shield, FileText, Settings, 
    Edit2, Camera, Calendar, ChevronDown, CheckCircle2,
    ToggleRight, Image as ImageIcon, Download, Eye, Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const CustomerProfile = () => {
    const { user, setProfile: setAuthProfile } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("Personal Info");

    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '', dob: '', gender: 'Male',
        nationalId: '', panNumber: '',
        occupation: '', annualIncome: ''
    });

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['profile', user?.token],
        queryFn: () => api.get('/users/profile', user.token),
        enabled: !!user?.token,
    });

    useEffect(() => {
        if (profileData) {
            setForm({
                name: profileData.name || '',
                email: user.email || '',
                phone: profileData.phone || '',
                address: profileData.address || '',
                dob: profileData.dob || '',
                gender: profileData.gender || 'Male',
                nationalId: profileData.nationalId || '',
                panNumber: profileData.panNumber || '',
                occupation: profileData.employment?.occupation || '',
                annualIncome: profileData.employment?.annualIncome || ''
            });
        }
    }, [profileData, user]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                name: form.name,
                phone: form.phone,
                address: form.address,
                dob: form.dob,
                gender: form.gender,
                nationalId: form.nationalId,
                panNumber: form.panNumber,
                employment: {
                    occupation: form.occupation,
                    annualIncome: Number(form.annualIncome)
                }
            };
            const updated = await api.put('/users/profile', payload, user.token);
            setAuthProfile(updated);
            toast({ 
                title: "Profile Updated", 
                description: "Your personal information has been saved successfully." 
            });
            queryClient.invalidateQueries(['profile', user?.token]);
        } catch (err) {
            toast({ 
                title: "Update failed", 
                description: err.message, 
                variant: "destructive" 
            });
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002b45]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans">
            
            {/* Banner Area */}
            <div className="h-64 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] relative">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-full relative">
                    {/* Placeholder for Cover pattern/image */}
                    <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                </div>
            </div>

            {/* Profile Header & Tabs */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 bg-white border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative z-10 pt-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 -mt-24 md:-mt-20">
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#002b45] flex items-center justify-center text-5xl font-bold text-white relative z-10">
                                {form.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#002b45] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#003b5c] transition-colors z-20">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold text-[#002b45] mb-1">{form.name || 'User'}</h1>
                            <p className="text-sm text-gray-500">{user.email} • Member since Jan 2022</p>
                        </div>
                    </div>
                    
                    <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Edit2 size={16} /> Edit Cover
                    </button>
                </div>

                <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {["Personal Info", "Security", "Documents", "Settings"].map((tab) => {
                        const Icon = tab === "Personal Info" ? UserIcon :
                                     tab === "Security" ? Shield :
                                     tab === "Documents" ? FileText : Settings;
                        
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors relative ${
                                    activeTab === tab ? "text-[#002b45]" : "text-gray-500 hover:text-gray-800"
                                }`}
                            >
                                <Icon size={16} /> {tab}
                                {activeTab === tab && (
                                    <motion.div 
                                        layoutId="profileTab"
                                        className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#002b45]"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
                
                {/* Information Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Forms) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-[#002b45]">Personal Information</h2>
                                <span className="bg-emerald-50 text-emerald-600 font-semibold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                                    Verified Profile
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <input name="name" value={form.name} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#002b45] transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <input name="email" value={form.email} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#002b45] transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">Date of Birth</label>
                                    <div className="relative">
                                        <input type="date" name="dob" value={form.dob?.split('T')[0] || ''} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#002b45] transition-colors appearance-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                                    <div className="relative">
                                        <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#002b45] transition-colors appearance-none pr-10">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Occupation</label>
                                    <input name="occupation" value={form.occupation} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#002b45] transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Aadhar Number</label>
                                    <input name="nationalId" value={form.nationalId} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#002b45] transition-colors tracking-widest font-mono" placeholder="XXXX XXXX 1234" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">PAN Card Number</label>
                                    <input name="panNumber" value={form.panNumber} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#002b45] transition-colors tracking-widest font-mono uppercase" placeholder="ABCDE1234F" />
                                </div>
                                
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Address</label>
                                    <textarea name="address" value={form.address} onChange={handleChange} rows="3" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#002b45] transition-colors resize-none" />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Annual Income (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                        <input type="number" name="annualIncome" value={form.annualIncome} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-[#002b45] transition-colors" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                                <button 
                                    onClick={handleSave}
                                    className="bg-[#002b45] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#003b5c] transition-colors shadow-sm"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Security / Stats) */}
                    <div className="space-y-8">
                        {/* Security Settings Widget */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                            <h2 className="text-xl font-bold text-[#002b45] mb-6">Security Settings</h2>
                            
                            <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                <div>
                                    <p className="font-bold text-[#002b45] text-sm mb-1">Two-Factor Authentication</p>
                                    <p className="text-xs text-gray-500">Secure your account with 2FA</p>
                                </div>
                                <ToggleRight size={32} className="text-[#002b45] cursor-pointer" />
                            </div>

                            <div className="pt-6">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Login History</p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-1/3"><p className="text-xs font-semibold text-[#002b45]">Chrome / Windows</p></div>
                                        <div className="w-1/3"><p className="text-xs text-gray-500">Bangalore, IN</p></div>
                                        <div className="w-1/3 text-right">
                                            <p className="text-[10px] text-gray-400 mb-1">2 mins ago</p>
                                            <span className="text-xs font-bold text-emerald-600">Active</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="w-1/3"><p className="text-xs font-semibold text-gray-500">iPhone 13 / iOS</p></div>
                                        <div className="w-1/3"><p className="text-xs text-gray-500">Mumbai, IN</p></div>
                                        <div className="w-1/3 text-right">
                                            <p className="text-[10px] text-gray-400 mb-1">Yesterday</p>
                                            <span className="text-xs font-bold text-gray-400">Expired</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Shield Widget */}
                        <div className="bg-[#002b45] rounded-3xl p-6 md:p-8 border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-white">
                            <h2 className="text-xl font-bold text-white mb-6">Account Shield</h2>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                </div>
                                <span className="font-bold text-sm">85%</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                    <span className="text-sm font-medium">Verified Phone</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                    <span className="text-sm font-medium">Verified Aadhar</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-50">
                                    <div className="w-4 h-4 rounded-full border-2 border-white/40 shrink-0"></div>
                                    <span className="text-sm font-medium">Link alternate email</span>
                                </div>
                            </div>

                            <button className="w-full bg-white text-[#002b45] font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                                Security Audit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Uploaded Documents */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-[#002b45]">Uploaded Documents</h2>
                        <button className="text-sm font-semibold text-[#002b45] hover:text-[#003b5c] flex items-center gap-1.5 transition-colors">
                            <Plus size={16} /> Upload New
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between group hover:border-[#002b45] hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-black uppercase">PDF</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#002b45] mb-0.5">Aadhar_Card.pdf</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">2.4 MB • Uploaded May 20</p>
                                </div>
                            </div>
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-400 hover:text-[#002b45]"><Eye size={16} /></button>
                                <button className="text-gray-400 hover:text-[#002b45]"><Download size={16} /></button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between group hover:border-[#002b45] hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <ImageIcon size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#002b45] mb-0.5">PAN_Card_Front.jpg</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1.1 MB • Uploaded May 21</p>
                                </div>
                            </div>
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-400 hover:text-[#002b45]"><Eye size={16} /></button>
                                <button className="text-gray-400 hover:text-[#002b45]"><Download size={16} /></button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between group hover:border-[#002b45] hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#002b45] mb-0.5">Employment_Certificate...</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">3.8 MB • Uploaded Jun 05</p>
                                </div>
                            </div>
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-400 hover:text-[#002b45]"><Eye size={16} /></button>
                                <button className="text-gray-400 hover:text-[#002b45]"><Download size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CustomerProfile;