import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { 
    User, Mail, Phone, MapPin, Briefcase, 
    CreditCard, Users, ShieldCheck, Camera,
    CheckCircle2, AlertCircle, TrendingUp,
    Fingerprint, Lock, Shield, Target,
    Activity, ArrowRight, Zap, Terminal, HeartPulse
} from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const CustomerProfile = () => {
    const { user, setProfile: setAuthProfile } = useContext(AuthContext);
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
        }
    }, [profileData]);

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
            toast({ title: "MANIFEST_SYNCHRONIZED", description: "Your identity manifest has been updated successfully." });
            queryClient.invalidateQueries(['profile', user?.token]);
        } catch (err) {
            toast({ title: "Update failed", description: err.message, variant: "destructive" });
        }
    };

    if (isLoading) return (
        <div className="p-8 bg-[#dae5e5] min-h-screen">
             <div className="h-64 bg-white rounded-[3rem] animate-pulse mb-8" />
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-screen bg-white rounded-[3rem] animate-pulse" />
                <div className="h-96 bg-white rounded-[3rem] animate-pulse" />
             </div>
        </div>
    );

    return (
        <div className="customer-profile p-4 md:p-8 bg-[#dae5e5] min-h-screen space-y-10 font-display">
            {/* Mission Header */}
            <div className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-[#0082a1] rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Identity Manifest Node</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#012b3f] uppercase tracking-tight">Citizen_Profile</h1>
                    <p className="text-sm text-slate-500 font-medium italic mt-1">Authorized database entry for global insurance deployment.</p>
                </div>
            </div>

            {/* HIGH-SECURITY PROFILE HEADER */}
            <Reveal width="100%" direction="down">
                <section className="relative overflow-hidden rounded-[3rem] bg-[#012b3f] p-10 md:p-16 text-white shadow-2xl border border-white/5 group">
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#0082a1]/20 rounded-full blur-[120px]" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 2px, transparent 0)`, backgroundSize: '40px 40px' }} />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-white/5 text-[#0082a1] flex items-center justify-center text-6xl font-black shadow-2xl border border-white/10 backdrop-blur-3xl overflow-hidden transform group-hover:rotate-3 transition-transform duration-500">
                                 {form.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3.5 bg-[#0082a1] text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                                <Camera size={20} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="text-center lg:text-left flex-1 space-y-4">
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-2">
                                 <div className="px-4 py-1.5 bg-[#0082a1]/20 border border-[#0082a1]/30 rounded-full text-[9px] font-black uppercase tracking-[3px] text-[#0082a1]">
                                    VERIFIED CITIZEN
                                 </div>
                                 {completion === 100 ? (
                                     <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-[3px] text-emerald-400 flex items-center gap-2">
                                        <CheckCircle2 size={12}/> MANIFEST_COMPLETE
                                     </div>
                                 ) : (
                                     <div className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-[3px] text-amber-400 flex items-center gap-2">
                                        <AlertCircle size={12}/> DATA_GAP_DETECTED
                                     </div>
                                 )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">{form.name || 'CITIZEN_NULL'}</h1>
                            <div className="flex items-center justify-center lg:justify-start gap-3 text-slate-400 font-bold text-xs">
                                <Mail size={14} className="text-[#0082a1]" />
                                <span className="uppercase tracking-widest">{user.email}</span>
                            </div>
                        </div>

                        <div className="w-full lg:w-80 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[4px] text-white/40">Manifest Strength</span>
                                <span className="text-3xl font-black text-[#0082a1] italic">{completion}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completion}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-[#0082a1] shadow-[0_0_15px_#0082a1]"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Form Sections */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Basic Info */}
                    <Reveal width="100%" direction="up">
                        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-700">
                                <Fingerprint size={120} className="text-[#012b3f]" />
                            </div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-1.5 h-8 bg-[#0082a1] rounded-full shadow-[0_0_10px_#0082a1]" />
                                <h2 className="text-2xl font-black uppercase tracking-tight text-[#012b3f]">Identity & Contact</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 ml-1">Full Legal Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0082a1] transition-colors" size={18} />
                                        <input name="name" value={form.name} onChange={handleChange} className="w-full pl-14 pr-6 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0082a1] focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest text-[#012b3f]" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 ml-1">National ID / Asset Passport</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0082a1] transition-colors" size={18} />
                                        <input name="nationalId" value={form.nationalId} onChange={handleChange} placeholder="Required for claims" className="w-full pl-14 pr-6 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0082a1] focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest text-[#012b3f]" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 ml-1">Secure Uplink Phone</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0082a1] transition-colors" size={18} />
                                        <input name="phone" value={form.phone} onChange={handleChange} className="w-full pl-14 pr-6 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0082a1] focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest text-[#012b3f]" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 ml-1">Biological Birth Cycle</label>
                                    <input type="date" name="dob" value={form.dob?.split('T')[0] || ''} onChange={handleChange} className="w-full px-6 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0082a1] focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest text-[#012b3f]" />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 ml-1">Registered Habitat Coordinates</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-5 top-5 text-slate-300 group-focus-within:text-[#0082a1] transition-colors" size={18} />
                                        <textarea name="address" value={form.address} onChange={handleChange} rows="3" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:border-[#0082a1] focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest text-[#012b3f] resize-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Nominee Info */}
                    <Reveal width="100%" direction="up">
                        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white relative group">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform">
                                <Users size={120} className="text-[#012b3f]" />
                            </div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-1.5 h-8 bg-[#0082a1] rounded-full shadow-[0_0_10px_#0082a1]" />
                                <h2 className="text-2xl font-black uppercase tracking-tight text-[#012b3f]">Beneficiary / Nominee</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 ml-1">Nominee Identity</label>
                                    <div className="relative group">
                                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0082a1] transition-colors" size={18} />
                                        <input name="nominee.name" value={form.nominee.name} onChange={handleChange} className="w-full pl-14 pr-6 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0082a1] focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest text-[#012b3f]" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 ml-1">Kinship Matrix</label>
                                    <select name="nominee.relationship" value={form.nominee.relationship} onChange={handleChange} className="w-full px-6 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0082a1] focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest text-[#012b3f] cursor-pointer appearance-none shadow-sm">
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
                    </Reveal>

                    {/* Employment & Bank */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Reveal width="100%" direction="up">
                            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white h-full group">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#012b3f] border border-slate-100 group-hover:bg-[#012b3f] group-hover:text-[#0082a1] transition-colors">
                                        <Briefcase size={24} />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-[#012b3f]">Work Manifest</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black uppercase tracking-[3px] text-slate-400 ml-1">Occupation</span>
                                        <input name="employment.occupation" value={form.employment.occupation} onChange={handleChange} className="w-full px-6 h-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0082a1] font-black text-[10px] uppercase tracking-widest text-[#012b3f]" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black uppercase tracking-[3px] text-slate-400 ml-1">Annual Yield (₹)</span>
                                        <input name="employment.annualIncome" value={form.employment.annualIncome} onChange={handleChange} type="number" className="w-full px-6 h-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0082a1] font-black text-xs tracking-tighter text-[#012b3f]" />
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal width="100%" direction="up">
                            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white h-full group">
                                 <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-slate-100 group-hover:bg-[#012b3f] transition-colors">
                                        <CreditCard size={24} />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-[#012b3f]">Settlement Node</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black uppercase tracking-[3px] text-slate-400 ml-1">A/C Number</span>
                                        <input name="bankDetails.accountNumber" value={form.bankDetails.accountNumber} onChange={handleChange} className="w-full px-6 h-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-black text-xs tracking-widest text-[#012b3f]" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black uppercase tracking-[3px] text-slate-400 ml-1">IFSC Routing</span>
                                        <input name="bankDetails.ifscCode" value={form.bankDetails.ifscCode} onChange={handleChange} className="w-full px-6 h-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-black text-[10px] uppercase tracking-widest text-[#012b3f]" />
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    <button 
                        onClick={handleSave}
                        className="w-full h-20 bg-[#012b3f] text-[#0082a1] rounded-[2rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-[#0082a1] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-6 group border border-white/5 text-xs"
                    >
                        SYNCHRONIZE MANIFEST <Zap size={20} fill="currentColor" />
                    </button>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-10">
                    <Reveal width="100%" direction="up">
                        <div className="bg-[#012b3f] text-white rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                 <TrendingUp size={150} className="text-[#0082a1]" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10 italic text-[#0082a1]">Portfolio Yield</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-10 relative z-10 leading-relaxed">A complete manifest allows our AI underwriters to offer you up to <span className="text-white">15% discount</span> on premium renewals.</p>
                            <div className="relative z-10 p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-[4px] text-white/40">Loyalty Sector</span>
                                <span className="text-xs font-black text-[#0082a1] uppercase tracking-[3px]">Elite_Guardian</span>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal width="100%" direction="up">
                        <div className="bg-white border border-white rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[#0082a1]/5 rounded-full blur-3xl" />
                            <div className="flex items-center gap-4 relative z-10">
                                 <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-100 shadow-sm">
                                     <AlertCircle size={24} />
                                 </div>
                                 <h4 className="text-xl font-black uppercase tracking-tight text-[#012b3f]">Security Tip</h4>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed relative z-10">Never share your account password or biometric data with unauthorized nodes, including individuals claiming to be ShieldPro associates.</p>
                            <button className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#012b3f] hover:bg-[#012b3f] hover:text-white transition-all shadow-sm">ENABLE 2FA UPLINK</button>
                        </div>
                    </Reveal>

                    <Reveal width="100%" direction="up">
                        <div className="p-10 bg-gradient-to-br from-[#012b3f] to-[#0082a1] rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute bottom-[-10%] right-[-10%] opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <Target size={150} />
                            </div>
                             <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10">Direct Support</h3>
                             <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-8 leading-relaxed relative z-10">Need help updating sensitive manifest data? Our concierge node is available 24/7.</p>
                             <button className="h-14 px-8 bg-white text-[#012b3f] rounded-xl text-[10px] font-black uppercase tracking-widest hover:translate-y-[-4px] transition-all shadow-xl relative z-10 flex items-center gap-3">
                                INITIATE CHAT <Terminal size={16} />
                             </button>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;