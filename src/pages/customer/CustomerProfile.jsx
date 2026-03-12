import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { 
    User, Mail, Phone, MapPin, Briefcase, 
    CreditCard, Users, ShieldCheck, Camera,
    CheckCircle2, AlertCircle, TrendingUp
} from "lucide-react";
import "../../styles/customer.css";

const CustomerProfile = () => {
    const { user, profile: authProfile, setProfile: setAuthProfile } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        name: '', phone: '', address: '', dob: '', gender: '',
        nationalId: '',
        nominee: { name: '', relationship: '', phone: '' },
        employment: { occupation: '', annualIncome: 0, employerName: '' },
        bankDetails: { accountName: '', accountNumber: '', ifscCode: '', bankName: '' }
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
                phone: profileData.phone || '',
                address: profileData.address || '',
                dob: profileData.dob || '',
                gender: profileData.gender || 'Male',
                nationalId: profileData.nationalId || '',
                nominee: {
                    name: profileData.nominee?.name || '',
                    relationship: profileData.nominee?.relationship || '',
                    phone: profileData.nominee?.phone || ''
                },
                employment: {
                    occupation: profileData.employment?.occupation || '',
                    annualIncome: profileData.employment?.annualIncome || 0,
                    employerName: profileData.employment?.employerName || ''
                },
                bankDetails: {
                    accountName: profileData.bankDetails?.accountName || '',
                    accountNumber: profileData.bankDetails?.accountNumber || '',
                    ifscCode: profileData.bankDetails?.ifscCode || '',
                    bankName: profileData.bankDetails?.bankName || ''
                }
            });
            setAuthProfile(profileData);
        }
    }, [profileData, setAuthProfile]);

    // Calculate completion percentage
    const calculateCompletion = () => {
        let total = 0;
        if (form.name) total += 10;
        if (form.phone) total += 10;
        if (form.address) total += 5;
        if (form.nationalId) total += 20;
        if (form.nominee.name) total += 15;
        if (form.employment.occupation) total += 20;
        if (form.bankDetails.accountNumber) total += 20;
        return total;
    };

    const completion = calculateCompletion();

    const handleChange = e => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setForm(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            const updated = await api.put('/users/profile', form, user.token);
            setAuthProfile(updated);
            toast({ title: "Success", description: "Profile updated successfully!" });
            queryClient.invalidateQueries(['profile', user?.token]);
        } catch (err) {
            toast({ title: "Update failed", description: err.message, variant: "destructive" });
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* Header / Stats */}
            <div className="relative overflow-hidden bg-blue-600 rounded-[40px] p-8 md:p-12 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-white text-blue-600 flex items-center justify-center text-5xl font-black shadow-xl overflow-hidden">
                             {form.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-3 bg-gold text-gold-foreground rounded-2xl shadow-lg border-4 border-blue-600 transition-transform hover:scale-110 active:scale-95">
                            <Camera size={18} />
                        </button>
                    </div>

                    <div className="text-center md:text-left flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                             <span className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-md">V.I.P Member</span>
                             {completion === 100 && <span className="px-4 py-1.5 bg-green-400 text-green-900 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Profile Complete</span>}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{form.name || 'Set Your Name'}</h1>
                        <p className="text-blue-100 font-medium opacity-80">{user.email}</p>
                    </div>

                    <div className="w-full md:w-64 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80 text-blue-100">Profile Strength</span>
                            <span className="text-2xl font-black">{completion}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gold transition-all duration-1000 ease-out"
                                style={{ width: `${completion}%` }}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full -ml-20 -mb-20 blur-2xl pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Sections */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="glass p-8 rounded-[3rem] border border-border">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                            <h2 className="text-2xl font-bold tracking-tight">Identity & Contact</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input name="name" value={form.name} onChange={handleChange} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">National ID / Passport</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input name="nationalId" value={form.nationalId} onChange={handleChange} placeholder="Required for claims" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input name="phone" value={form.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Date of Birth</label>
                                <input type="date" name="dob" value={form.dob?.split('T')[0] || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Residential Address</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <textarea name="address" value={form.address} onChange={handleChange} rows="3" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold resize-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nominee Info */}
                    <div className="glass p-8 rounded-[3rem] border border-border">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-8 bg-gold rounded-full" />
                            <h2 className="text-2xl font-bold tracking-tight">Beneficiary / Nominee</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Nominee Name</label>
                                <div className="relative group">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input name="nominee.name" value={form.nominee.name} onChange={handleChange} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-gold/20 transition-all font-semibold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Relationship</label>
                                <select name="nominee.relationship" value={form.nominee.relationship} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-gold/20 transition-all font-semibold cursor-pointer appearance-none">
                                    <option value="">Select Relation</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Employment & Bank */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass p-8 rounded-[3rem] border border-border">
                            <div className="flex items-center gap-3 mb-8">
                                <Briefcase className="text-blue-600" size={24} />
                                <h3 className="text-xl font-bold tracking-tight">Work Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase opacity-40 ml-1">Occupation</span>
                                    <input name="employment.occupation" value={form.employment.occupation} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-600/20 font-semibold" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase opacity-40 ml-1">Annual Income</span>
                                    <input name="employment.annualIncome" value={form.employment.annualIncome} onChange={handleChange} type="number" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-600/20 font-semibold" />
                                </div>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[3rem] border border-border">
                             <div className="flex items-center gap-3 mb-8">
                                <CreditCard className="text-green-600" size={24} />
                                <h3 className="text-xl font-bold tracking-tight">Payout Account</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase opacity-40 ml-1">A/C Number</span>
                                    <input name="bankDetails.accountNumber" value={form.bankDetails.accountNumber} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-green-600/20 font-semibold" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase opacity-40 ml-1">IFSC Code</span>
                                    <input name="bankDetails.ifscCode" value={form.bankDetails.ifscCode} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-green-600/20 font-semibold uppercase" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSave}
                        className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/40 hover:bg-blue-700 hover:scale-[1.02] transform transition-all active:scale-100"
                    >
                        Securely Save Profile
                    </button>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-zinc-900 text-white rounded-[3rem] p-8 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                             <TrendingUp size={120} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 relative z-10">Premium Health</h3>
                        <p className="text-zinc-400 text-sm mb-6 relative z-10 leading-relaxed font-medium">A complete profile allows our AI underwriters to offer you up to <span className="text-gold">15% discount</span> on renewing premiums.</p>
                        <div className="relative z-10 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tier</span>
                            <span className="text-sm font-black text-blue-400 uppercase tracking-widest">Elite Platinum</span>
                        </div>
                    </div>

                    <div className="glass border border-border rounded-[3rem] p-8 space-y-6">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                 <AlertCircle size={20} />
                             </div>
                             <h4 className="font-bold">Security Tip</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">Never share your account password or bank OTP with anyone, including individuals claiming to be ShieldPro agents.</p>
                        <button className="w-full py-3 border border-border rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">Two-Factor Auth</button>
                    </div>

                    <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] text-white shadow-xl shadow-blue-600/20">
                         <h3 className="text-xl font-bold mb-4">Support</h3>
                         <p className="text-sm opacity-80 mb-6 leading-relaxed">Need help updating sensitive data? Our concierge is available 24/7.</p>
                         <button className="px-6 py-3 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transform transition-all">Chat Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;