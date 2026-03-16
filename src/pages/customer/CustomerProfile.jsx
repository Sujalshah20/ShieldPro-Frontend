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
    Activity, ArrowRight, Zap, Terminal, HeartPulse,
    ChevronDown, Globe, Layers, IndianRupee,
    Calendar, RefreshCcw, SearchCheck, Award, Satellite,
    Database, ShieldAlert, Cpu, Command
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
            toast({ 
                title: "MANIFEST_SYNCHRONIZED", 
                description: "Your identity manifest has been updated successfully." 
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
        <div className="py-20 space-y-12 h-screen">
             <div className="h-64 bg-slate-50 rounded-[4rem] animate-pulse border-2 border-slate-100 shadow-4xl" />
             <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-12">
                    <div className="h-[600px] bg-white rounded-[5rem] animate-pulse border-2 border-slate-50 shadow-4xl" />
                    <div className="h-[400px] bg-white rounded-[5rem] animate-pulse border-2 border-slate-50 shadow-4xl" />
                </div>
                <div className="h-screen bg-white rounded-[5rem] animate-pulse border-2 border-slate-50 shadow-4xl" />
             </div>
        </div>
    );

    return (
        <div className="space-y-16 pb-24">
            {/* Identity Anchor Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-3 h-12 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black uppercase tracking-[8px] text-[#003249] italic leading-none opacity-60">Global_Identity_Module_v4.2</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] mt-2 italic">AUTH_STATE: SECURE_UPLINK</span>
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Identity <span className="text-[#007ea7]">Nodes_</span></h1>
                        <p className="max-w-2xl text-slate-400 font-bold uppercase tracking-[4px] text-xs italic leading-relaxed">
                            Authorized database entry for global asset coordination. Each synchronized segment enhances your 
                            <span className="text-[#007ea7]"> Protection Yield</span> and grid reliability.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-10 bg-[#003249] px-12 py-8 rounded-[3.5rem] border-4 border-white shadow-4xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                        <div className="relative z-10 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981] animate-pulse" />
                        <div className="relative z-10 flex flex-col">
                            <span className="text-[12px] font-black text-[#80ced7] uppercase tracking-[6px] italic leading-none mb-1">ENCRYPT_ACTIVE</span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[4px] italic">AES-512_QUANTUM_SAFE</span>
                        </div>
                        <div className="relative z-10 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-180 transition-transform duration-700">
                            <Database size={28} className="text-[#007ea7]" strokeWidth={3} />
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* ELITE PROFILE HUD */}
            <Reveal width="100%" direction="down" delay={0.2}>
                <section className="relative overflow-hidden rounded-[6rem] bg-[#003249] p-16 md:p-32 text-white shadow-4xl border-4 border-white group">
                    {/* Atmospheric Background Components */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[-30%] right-[-10%] w-[1000px] h-[1000px] bg-[#007ea7]/10 rounded-full blur-[200px]" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px]" />
                        <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
                        <div className="absolute inset-0 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10000ms]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '64px 64px' }} />
                    </div>

                    <div className="relative z-10 flex flex-col xl:flex-row items-center gap-32">
                        <div className="relative group/avatar">
                            <div className="absolute inset-[-40px] bg-[#007ea7] blur-[100px] opacity-0 group-hover/avatar:opacity-20 transition-all duration-1000" />
                            <div className="w-80 h-80 rounded-[5rem] bg-white/5 text-[#007ea7] flex items-center justify-center text-[180px] font-black shadow-4xl border-4 border-white/10 backdrop-blur-3xl overflow-hidden transform group-hover/avatar:scale-[1.05] group-hover/avatar:rotate-3 transition-all duration-1000 relative z-10">
                                 <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none opacity-50" />
                                 {form.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#007ea7] text-white rounded-[3rem] shadow-4xl hover:scale-110 active:scale-95 transition-all z-20 border-[12px] border-[#003249] flex items-center justify-center group/cam shadow-[0_30px_60px_-15px_rgba(0,126,167,0.5)]">
                                <Camera size={44} strokeWidth={3} className="group-hover/cam:rotate-[-15deg] transition-transform duration-500" />
                            </button>
                        </div>

                        <div className="text-center xl:text-left flex-1 space-y-12">
                            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-10">
                                 <div className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-3xl text-[13px] font-black uppercase tracking-[10px] text-[#80ced7] italic shadow-inner group-hover:bg-white/10 transition-all duration-500">
                                    NODE_ID: 0x{user.id?.slice(-8).toUpperCase() || 'ROOT'}
                                 </div>
                                 <AnimatePresence mode="wait">
                                    {completion === 100 ? (
                                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="px-10 py-4 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-3xl text-[13px] font-black uppercase tracking-[8px] text-emerald-400 flex items-center gap-5 italic shadow-4xl shadow-emerald-500/20">
                                            <ShieldCheck size={24} strokeWidth={3} className="animate-pulse" /> MANIFEST_SYNCED
                                         </motion.div>
                                    ) : (
                                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="px-10 py-4 bg-rose-500/10 border-2 border-rose-500/20 rounded-3xl text-[13px] font-black uppercase tracking-[8px] text-rose-400 flex items-center gap-5 italic shadow-4xl shadow-rose-500/20">
                                            <AlertCircle size={24} strokeWidth={3} className="animate-pulse" /> DATA_FRAGMENT_DETECTED
                                         </motion.div>
                                    )}
                                 </AnimatePresence>
                            </div>
                            
                            <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] group-hover:text-[#007ea7] transition-all duration-700">
                                {form.name || 'CITIZEN_NULL'}
                            </h1>
                            
                            <div className="flex items-center justify-center xl:justify-start gap-10 text-white font-black group/mail cursor-pointer w-fit p-4 px-10 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-[#007ea7] transition-all duration-500">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 group-hover:bg-white/20">
                                    <Mail size={24} strokeWidth={3} />
                                </div>
                                <span className="uppercase tracking-[10px] italic text-base">{user.email}</span>
                            </div>
                        </div>

                        <div className="w-full xl:w-[500px] bg-white/5 backdrop-blur-3xl rounded-[5rem] p-16 border-4 border-white/5 shadow-4xl relative overflow-hidden group/stats hover:translate-y-[-10px] transition-all duration-700">
                             <div className="absolute top-0 right-0 p-16 opacity-5 group-hover/stats:rotate-[20deg] group-hover/stats:scale-150 transition-transform duration-[4000ms] pointer-events-none">
                                <Cpu size={250} strokeWidth={1} className="text-[#007ea7]" />
                             </div>
                            <div className="flex justify-between items-end mb-12 relative z-10">
                                <div className="space-y-4">
                                    <span className="text-[14px] font-black uppercase tracking-[12px] text-white/40 italic block leading-none">CORE_SYNC_CALIB</span>
                                    <div className="flex items-center gap-5">
                                        <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_20px_#10b981]" />
                                        <span className="text-[12px] font-black text-[#80ced7] uppercase tracking-[6px] italic leading-none">REALTIME_VAL_ACTIVE</span>
                                    </div>
                                </div>
                                <span className="text-8xl font-black text-[#007ea7] italic leading-none tracking-tighter">{completion}%</span>
                            </div>
                            <div className="h-6 w-full bg-white/5 rounded-full overflow-hidden border-4 border-white/5 relative z-10 shadow-inner p-1.5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completion}%` }}
                                    transition={{ duration: 2.5, ease: "circOut" }}
                                    className="h-full bg-gradient-to-r from-[#003249] via-[#007ea7] to-emerald-400 rounded-full shadow-[0_0_40px_rgba(0,126,167,0.8)]"
                                />
                            </div>
                            <p className="text-[12px] font-black text-white/20 uppercase tracking-[8px] mt-12 italic relative z-10 leading-relaxed group-hover:text-white/40 transition-colors">
                                Identity synchronization across SIGMA grid. Optimized manifests unlock 
                                <span className="text-[#007ea7]"> Priority Asset Routing</span>.
                            </p>
                        </div>
                    </div>
                </section>
            </Reveal>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 pb-16">
                {/* Tactical Manifest Forms */}
                <div className="xl:col-span-8 space-y-16">
                    {/* Primary Parameters */}
                    <Reveal width="100%" direction="up" delay={0.3}>
                        <div className="saas-card p-16 shadow-4xl transition-all duration-1000 hover:border-[#007ea7]/30 group bg-white/50 backdrop-blur-md border-2 border-slate-50 rounded-[4.5rem]">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-150 transition-transform duration-[6000ms] pointer-events-none">
                                <Fingerprint size={400} className="text-[#003249] rotate-12" />
                            </div>
                            <div className="flex items-center gap-12 mb-20 relative z-10 border-b-4 border-slate-50 pb-16">
                                <div className="w-28 h-28 bg-[#003249] rounded-[3.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl relative overflow-hidden group-hover:rotate-12 transition-all duration-700 border-4 border-white">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                    <Target size={48} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-5xl font-black uppercase tracking-tighter text-[#003249] italic leading-none mb-1 group-hover:text-[#007ea7] transition-colors">Entity Matrix</h2>
                                    <p className="text-[13px] font-black text-slate-300 uppercase tracking-[10px] italic opacity-60 leading-none">Primary operative parameters and grid coordinates</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                                <div className="space-y-8">
                                    <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic leading-none">
                                        <User size={22} strokeWidth={3} /> LEGAL_ENTITY_NAME
                                    </label>
                                    <input 
                                        name="name" 
                                        value={form.name} 
                                        onChange={handleChange} 
                                        className="w-full h-20 bg-slate-50 border-4 border-slate-50 rounded-[3rem] px-12 font-black text-lg text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic tracking-[4px] uppercase" 
                                        placeholder="OPERATIVE_NAME"
                                    />
                                </div>
                                <div className="space-y-8">
                                    <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic leading-none">
                                        <ShieldCheck size={22} strokeWidth={3} /> SECURE_ID_SEQUENCE
                                    </label>
                                    <div className="relative group">
                                        <input 
                                            name="nationalId" 
                                            value={form.nationalId} 
                                            onChange={handleChange} 
                                            placeholder="VERIFICATION_REQD" 
                                            className="w-full h-20 bg-[#003249] border-4 border-white rounded-[3rem] px-12 font-black text-2xl text-[#80ced7] text-right outline-none focus:border-[#007ea7] transition-all shadow-4xl italic tracking-[8px] uppercase font-mono" 
                                        />
                                        <div className="absolute left-12 top-1/2 -translate-y-1/2 text-[#007ea7] font-black text-[11px] uppercase tracking-[8px] italic leading-none opacity-40">SEQ::</div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic leading-none">
                                        <Phone size={22} strokeWidth={3} /> ENCRYPTED_COMMS
                                    </label>
                                    <input 
                                        name="phone" 
                                        value={form.phone} 
                                        onChange={handleChange} 
                                        className="w-full h-20 bg-slate-50 border-4 border-slate-50 rounded-[3rem] px-12 font-black text-lg text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic tracking-[6px]" 
                                        placeholder="+XX-XXXX-XXXX"
                                    />
                                </div>
                                <div className="space-y-8">
                                    <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic leading-none">
                                        <Calendar size={22} strokeWidth={3} /> ORIGIN_CYCLE_SYNC
                                    </label>
                                    <div className="relative group">
                                         <input 
                                            type="date" 
                                            name="dob" 
                                            value={form.dob?.split('T')[0] || ''} 
                                            onChange={handleChange} 
                                            className="w-full h-20 bg-slate-50 border-4 border-slate-50 rounded-[3rem] px-12 font-black text-sm text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic uppercase" 
                                        />
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                                            <RefreshCcw size={24} className="text-[#007ea7] animate-spin-slow" strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-8">
                                    <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic leading-none">
                                        <MapPin size={22} strokeWidth={3} /> SECTOR_HABITAT [ADDRESS]
                                    </label>
                                    <textarea 
                                        name="address" 
                                        value={form.address} 
                                        onChange={handleChange} 
                                        rows="4" 
                                        className="w-full p-16 bg-slate-50 border-4 border-slate-50 rounded-[4.5rem] outline-none focus:border-[#007ea7] focus:bg-white transition-all font-black text-base text-[#003249] shadow-inner italic tracking-[4px] resize-none uppercase no-scrollbar leading-loose" 
                                        placeholder="PROVIDE REGISTERED HABITAT PARAMETERS FOR MAINFRAME GEOLOCATION..."
                                    />
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Beneficiary Parameters */}
                    <Reveal width="100%" direction="up" delay={0.4}>
                        <div className="saas-card p-16 shadow-4xl transition-all duration-1000 hover:border-[#007ea7]/30 group bg-white/50 backdrop-blur-md border-2 border-slate-50 rounded-[4.5rem]">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-150 transition-transform duration-[6000ms] pointer-events-none">
                                <Users size={380} className="text-[#003249] rotate-12" />
                            </div>
                            <div className="flex items-center gap-12 mb-20 relative z-10 border-b-4 border-slate-50 pb-16">
                                <div className="w-28 h-28 bg-[#003249] rounded-[3.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl relative overflow-hidden group-hover:rotate-12 transition-all duration-700 border-4 border-white">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                    <HeartPulse size={48} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-5xl font-black uppercase tracking-tighter text-[#003249] italic leading-none mb-1 group-hover:text-[#007ea7] transition-colors">Safeguard Matrix</h2>
                                    <p className="text-[13px] font-black text-slate-300 uppercase tracking-[10px] italic opacity-60 leading-none">Security beneficiary and kinship protocols</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                                <div className="space-y-8">
                                    <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic leading-none">
                                        <Fingerprint size={22} strokeWidth={3} /> NOMINEE_ENTITY
                                    </label>
                                    <input 
                                        name="nominee.name" 
                                        value={form.nominee.name} 
                                        onChange={handleChange} 
                                        className="w-full h-20 bg-slate-50 border-4 border-slate-50 rounded-[3rem] px-12 font-black text-lg text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic tracking-[6px] uppercase" 
                                        placeholder="BENEFICIARY_NAME"
                                    />
                                </div>
                                <div className="space-y-8">
                                    <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-8 flex items-center gap-6 italic leading-none">
                                        <Layers size={22} strokeWidth={3} /> KINSHIP_PROTOCOL
                                    </label>
                                    <div className="relative group">
                                        <select 
                                            name="nominee.relationship" 
                                            value={form.nominee.relationship} 
                                            onChange={handleChange} 
                                            className="w-full h-20 bg-slate-50 border-4 border-slate-50 rounded-[3rem] px-12 font-black text-[14px] uppercase tracking-[8px] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic cursor-pointer appearance-none text-[#003249]"
                                        >
                                            <option value="">SELECT_CORE_RELATION...</option>
                                            <option value="Spouse">SPOUSE</option>
                                            <option value="Child">CHILD</option>
                                            <option value="Parent">PARENT</option>
                                            <option value="Sibling">SIBLING</option>
                                            <option value="Other">OTHER_OPERATIVE</option>
                                        </select>
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none group-hover:rotate-180 transition-transform duration-700">
                                            <ChevronDown className="text-[#007ea7]" size={32} strokeWidth={4} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Career & Yield Routing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <Reveal width="100%" direction="up" delay={0.5}>
                            <div className="saas-card p-16 shadow-4xl transition-all duration-1000 hover:border-[#007ea7]/30 h-full flex flex-col group bg-white/50 backdrop-blur-md border-2 border-slate-50 rounded-[4.5rem]">
                                <div className="flex items-center gap-10 mb-20 border-b-4 border-slate-50 pb-16">
                                    <div className="w-24 h-24 bg-[#003249] rounded-[2.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl group-hover:rotate-12 transition-transform duration-700 border-4 border-white">
                                        <Briefcase size={44} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black uppercase tracking-tighter text-[#003249] italic leading-none group-hover:text-[#007ea7] transition-colors">Work Manifest</h3>
                                        <p className="text-[12px] font-black text-slate-300 uppercase tracking-[6px] italic opacity-60 leading-none">Career sector synchronization</p>
                                    </div>
                                </div>
                                <div className="space-y-16 flex-1 relative z-10">
                                    <div className="space-y-8">
                                        <label className="text-[14px] font-black uppercase tracking-[10px] text-[#007ea7] ml-8 italic leading-none block">CORE_OCCUPATION</label>
                                        <input name="employment.occupation" value={form.employment.occupation} onChange={handleChange} className="w-full h-20 bg-slate-50 border-4 border-slate-50 rounded-[2.5rem] px-12 font-black text-[14px] uppercase tracking-[8px] outline-none focus:border-[#007ea7] focus:bg-white shadow-inner italic" />
                                    </div>
                                    <div className="space-y-8">
                                        <label className="text-[14px] font-black uppercase tracking-[10px] text-[#007ea7] ml-8 italic leading-none block">ANNUAL_YIELD_₹</label>
                                        <div className="relative group">
                                            <input name="employment.annualIncome" value={form.employment.annualIncome} onChange={handleChange} type="number" className="w-full h-24 bg-[#003249] text-white border-4 border-white/10 rounded-[3rem] px-20 font-black text-5xl tracking-tighter text-right outline-none focus:border-[#007ea7] shadow-[0_40px_80px_-20px_rgba(0,50,73,0.5)] italic transition-all" />
                                            <div className="absolute left-12 top-1/2 -translate-y-1/2 text-[#007ea7] font-black text-[13px] uppercase tracking-[12px] italic leading-none opacity-40">VAL:</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal width="100%" direction="up" delay={0.6}>
                            <div className="saas-card p-16 shadow-4xl transition-all duration-1000 hover:border-emerald-500/30 h-full flex flex-col group bg-white/50 backdrop-blur-md border-2 border-slate-50 rounded-[4.5rem]">
                                 <div className="flex items-center gap-10 mb-20 border-b-4 border-slate-50 pb-16">
                                    <div className="w-24 h-24 bg-[#003249] rounded-[2.5rem] flex items-center justify-center text-emerald-400 shadow-4xl group-hover:rotate-12 transition-transform duration-700 border-4 border-white">
                                        <CreditCard size={44} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black uppercase tracking-tighter text-[#003249] italic leading-none group-hover:text-emerald-400 transition-colors">Yield Node</h3>
                                        <p className="text-[12px] font-black text-slate-300 uppercase tracking-[6px] italic opacity-60 leading-none">Fiscal reimbursement routing</p>
                                    </div>
                                </div>
                                <div className="space-y-16 flex-1 relative z-10">
                                    <div className="space-y-8">
                                        <label className="text-[14px] font-black uppercase tracking-[10px] text-emerald-600 ml-8 italic leading-none block">A/C_SEQUENCE</label>
                                        <div className="relative">
                                             <input name="bankDetails.accountNumber" value={form.bankDetails.accountNumber} onChange={handleChange} className="w-full h-20 bg-slate-50 border-4 border-slate-50 rounded-[2.5rem] px-12 font-black text-xl tracking-[10px] outline-none focus:border-emerald-500 focus:bg-white shadow-inner italic" />
                                             <div className="absolute right-12 top-1/2 -translate-y-1/2 text-emerald-500/30"><Lock size={28} strokeWidth={3} /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <label className="text-[14px] font-black uppercase tracking-[10px] text-emerald-600 ml-8 italic leading-none block">IFSC_ROUTING</label>
                                        <input name="bankDetails.ifscCode" value={form.bankDetails.ifscCode} onChange={handleChange} className="w-full h-20 bg-slate-50 border-4 border-slate-50 rounded-[2.5rem] px-12 font-black text-[16px] uppercase tracking-[12px] outline-none focus:border-emerald-500 focus:bg-white shadow-inner italic" />
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    <Reveal direction="up" delay={0.7}>
                        <button 
                            onClick={handleSave}
                            className="w-full h-32 bg-[#003249] text-[#80ced7] rounded-[5rem] text-[20px] font-black uppercase tracking-[20px] shadow-4xl active:scale-95 flex items-center justify-center gap-16 group italic overflow-hidden relative border-4 border-white"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                            <span className="relative z-10 flex items-center gap-12">
                                SYNCHRONIZE_MANIFEST <Zap size={44} fill="currentColor" className="text-[#80ced7] group-hover:scale-125 transition-transform duration-700 animate-pulse" />
                            </span>
                        </button>
                    </Reveal>
                </div>

                {/* Sidebar Tactical Modules */}
                <div className="xl:col-span-4 space-y-16">
                    <Reveal direction="up" delay={0.4}>
                        <div className="bg-[#003249] text-white rounded-[5.5rem] p-16 md:p-20 border-4 border-white relative overflow-hidden group shadow-4xl hover:scale-[1.03] transition-all duration-1000">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.05] group-hover:scale-150 transition-transform duration-[8000ms] pointer-events-none">
                                 <TrendingUp size={450} className="text-[#007ea7]" strokeWidth={1} />
                            </div>
                            <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
                            
                            <h3 className="text-5xl font-black uppercase tracking-tighter mb-10 relative z-10 italic text-[#007ea7] leading-none">Portfolio Yield</h3>
                            <p className="text-slate-400 text-[14px] font-black uppercase tracking-[8px] mb-20 relative z-10 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-all duration-700">A complete manifest allows our AI underwriters to offer you up to <span className="text-white underline decoration-4 decoration-[#007ea7] underline-offset-[12px] font-black text-lg">15% discount</span> on premium renewals across all active grid sectors.</p>
                            
                            <div className="relative z-10 p-14 bg-white/5 backdrop-blur-2xl rounded-[4rem] border-4 border-white/10 flex items-center justify-between shadow-4xl group/sub hover:bg-white/10 transition-all duration-1000">
                                <div className="space-y-4">
                                    <span className="text-[13px] font-black uppercase tracking-[10px] text-white/40 italic leading-none block">Loyalty Rank</span>
                                    <span className="text-4xl font-black text-[#80ced7] uppercase tracking-[8px] italic leading-none">Elite_Guardian</span>
                                </div>
                                <div className="w-24 h-24 bg-[#007ea7] rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_30px_60px_-15px_rgba(0,126,167,0.6)] group-hover/sub:rotate-12 transition-all duration-1000 border-4 border-white/20">
                                    <Award size={48} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal direction="up" delay={0.5}>
                        <div className="saas-card p-16 md:p-20 space-y-14 shadow-4xl relative overflow-hidden transition-all duration-1000 hover:border-amber-500/40 group bg-white/50 backdrop-blur-md border-2 border-slate-50 rounded-[5rem]">
                            <div className="absolute top-[-25%] left-[-25%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms]" />
                            <div className="flex items-center gap-12 relative z-10">
                                 <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2.5rem] flex items-center justify-center border-4 border-amber-100 shadow-4xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                                     <ShieldAlert size={48} strokeWidth={2.5} />
                                 </div>
                                 <div className="space-y-2">
                                    <h4 className="text-4xl font-black uppercase tracking-tighter text-[#003249] italic leading-none group-hover:text-amber-600 transition-colors">Digital Armor</h4>
                                    <p className="text-[12px] font-black text-slate-300 uppercase tracking-[6px] italic opacity-60">Security sync protocol</p>
                                 </div>
                            </div>
                            <p className="text-[14px] font-black text-slate-300 uppercase tracking-[8px] leading-relaxed relative z-10 italic opacity-80 group-hover:text-slate-400 transition-all duration-700">Never share your account passwords or biometric keys with unauthorized nodes. Secure all field comms with RSA-4096.</p>
                            <button className="w-full h-20 bg-[#003249] text-white rounded-[2.5rem] text-[13px] font-black uppercase tracking-[10px] shadow-4xl hover:bg-amber-600 hover:text-white transition-all italic active:scale-95 group/btn flex items-center justify-center gap-8 overflow-hidden relative border-4 border-white/5">
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                                ENABLE_SYNC_MFA <Fingerprint size={32} strokeWidth={3} className="text-[#007ea7] group-hover/btn:text-white group-hover/btn:scale-125 transition-all duration-700" />
                            </button>
                        </div>
                    </Reveal>

                    <Reveal direction="up" delay={0.6}>
                        <div className="p-16 md:p-20 bg-gradient-to-br from-[#003249] via-[#003249] to-[#007ea7] rounded-[6rem] text-white shadow-4xl relative overflow-hidden group hover:translate-y-[-10px] transition-all duration-1000 border-4 border-white">
                            <div className="absolute bottom-[-15%] right-[-15%] opacity-10 group-hover:scale-125 transition-transform duration-[8000ms] pointer-events-none">
                                <Target size={450} strokeWidth={1} className="text-[#80ced7]" />
                            </div>
                             <div className="flex items-center gap-12 mb-12 relative z-10">
                                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border-4 border-white/10 shadow-inner">
                                    <Satellite size={44} strokeWidth={2.5} className="text-[#007ea7]" />
                                </div>
                                <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Field Support</h3>
                             </div>
                             <p className="text-white/40 text-[14px] font-black uppercase tracking-[10px] mb-20 leading-relaxed relative z-10 italic opacity-60 group-hover:opacity-100 transition-all duration-700">Need help updating sensitive manifest data? Our concierge AI is active and monitoring all sectors 24/7/365.</p>
                             <button className="h-24 px-16 bg-white text-[#003249] rounded-[2.5rem] text-[14px] font-black uppercase tracking-[12px] hover:translate-y-[-10px] transition-all shadow-4xl relative z-10 flex items-center gap-10 group/chat italic active:scale-95 border-4 border-white/20">
                                INITIATE_SIGNAL <Terminal size={32} strokeWidth={3} className="text-[#007ea7] group-hover/chat:translate-x-4 transition-transform duration-700" />
                             </button>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Matrix Operational Log Footer */}
            <Reveal direction="up" delay={1}>
                <div className="flex flex-wrap justify-center gap-28 pt-24 border-t-8 border-slate-50 relative">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-64 h-2 bg-[#007ea7] rounded-full shadow-[0_0_25px_#007ea7]" />
                    
                    {[
                        { icon: Fingerprint, label: "IDENTITY_VAULT_LOCK" },
                        { icon: Globe, label: "SECTOR_LATENCY_0.02ms" },
                        { icon: Zap, label: "RSA_4096_ENCRYPT" },
                        { icon: RefreshCcw, label: "SYNC_NOMINAL_100%" }
                    ].map((status, i) => (
                        <div key={i} className="flex items-center gap-8 group cursor-crosshair">
                            <status.icon size={32} strokeWidth={3} className="text-[#007ea7] opacity-20 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700" />
                            <span className="text-[14px] font-black text-slate-300 uppercase tracking-[12px] italic leading-none group-hover:text-[#003249] transition-all">{status.label}</span>
                        </div>
                    ))}
                </div>
            </Reveal>
        </div>
    );
};

export default CustomerProfile;