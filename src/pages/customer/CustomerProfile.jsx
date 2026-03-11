import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";

const CustomerProfile = () => {
    const { user, profile, setProfile } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({ name: '', phone: '', address: '' });

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['profile', user?.token],
        queryFn: () => api.get('/users/profile', user.token),
        enabled: !!user?.token,
    });

    useEffect(() => {
        if (profileData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                name: profileData.name || '',
                phone: profileData.phone || '',
                address: profileData.address || ''
            });
            setProfile(profileData);
        }
    }, [profileData, setProfile]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updated = await api.put('/users/profile', form, user.token);
            setProfile(updated);
            toast({ title: "Profile updated" });
            queryClient.invalidateQueries(['profile', user?.token]);
        } catch (err) {
            toast({ title: "Update failed", description: err.message });
        }
    };

    if (isLoading) return <p>Loading profile...</p>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-border shadow-xl shadow-blue-500/5">
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                        {profile?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                    </div>
                </div>
                
                <div className="text-center md:text-left flex-1 space-y-2">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{profile?.name || 'Account Member'}</h1>
                    <p className="text-muted-foreground font-medium">{profile?.email || user?.email}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                        <span className="px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest rounded-full">Active Member</span>
                        <span className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-muted-foreground text-xs font-bold uppercase tracking-widest rounded-full">Verified</span>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                        <h2 className="text-2xl font-bold tracking-tight">Personal Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Identity</label>
                            <input
                                className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                                name="name" value={form.name || ""} onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Number</label>
                            <input
                                className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                                name="phone" value={form.phone || ""} onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Registered Address</label>
                            <input
                                className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                                name="address" value={form.address || ""} onChange={handleChange}
                                placeholder="123 Luxury Ave, Suite 500"
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave} 
                        className="mt-12 w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.01] active:scale-100 transition-all"
                    >
                        Save Profile Changes
                    </button>
                </div>
                
                <div className="space-y-8">
                    <div className="bg-zinc-900 border border-white/5 p-8 rounded-[40px] text-white overflow-hidden relative group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 blur-3xl group-hover:bg-blue-600/40 transition-colors" />
                        <h3 className="text-xl font-bold mb-4 relative z-10">Security</h3>
                        <p className="text-sm text-zinc-400 mb-6 relative z-10 leading-relaxed">Ensure your account remains encrypted and protected with our advanced security protocols.</p>
                        <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all">Change Password</button>
                    </div>
                    
                    <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-500/20">
                         <h3 className="text-xl font-bold mb-4">Membership</h3>
                         <p className="text-sm text-blue-100 mb-6 leading-relaxed">You are a valued premium member of ShieldPro. Enjoy priority support and exclusive benefits.</p>
                         <div className="text-4xl font-black mb-1">PRO</div>
                         <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Status Active</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;