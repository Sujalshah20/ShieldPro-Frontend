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
        occupation: '', annualIncome: '', profilePic: ''
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
                annualIncome: profileData.employment?.annualIncome || '',
                profilePic: profileData.profilePic || ''
            });
        }
    }, [profileData, user]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const compressImage = (file, maxWidth = 500, quality = 0.7) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxWidth) {
                            width *= maxWidth / height;
                            height = maxWidth;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
            };
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Compression to keep payload small and avoid 413 error
                const compressedBase64 = await compressImage(file);
                setForm(prev => ({ ...prev, profilePic: compressedBase64 }));
            } catch (err) {
                toast({ title: "Upload failed", description: "Failed to process image", variant: "destructive" });
            }
        }
    };

    const validateEmail = (email) => {
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!email) return false;
        if (email.includes(' ') || email.includes('..') || email.startsWith('.') || email.split('@').length !== 2) return false;
        return re.test(email.toLowerCase());
    };

    const validateName = (name) => /^[A-Za-z\s]{3,50}$/.test(name);
    const validateAadhaar = (val) => /^\d{12}$/.test(val.replace(/\s/g, ''));
    const validatePAN = (val) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val.toUpperCase());
    const validateMobile = (val) => /^[6-9]\d{9}$/.test(val);

    const getFieldStatus = (name, value) => {
        if (!value) return 'none';
        switch (name) {
            case 'name': return validateName(value) ? 'valid' : 'invalid';
            case 'email': return validateEmail(value) ? 'valid' : 'invalid';
            case 'phone': return validateMobile(value) ? 'valid' : 'invalid';
            case 'nationalId': return validateAadhaar(value) ? 'valid' : 'invalid';
            case 'panNumber': return validatePAN(value) ? 'valid' : 'invalid';
            default: return 'none';
        }
    };

    const blockInvalidChar = (e, name) => {
        const key = e.key;
        const ctrlShift = e.ctrlKey || e.metaKey || e.shiftKey;
        
        // Allow navigation/editing keys
        if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key) || (e.ctrlKey && ['c', 'v', 'x', 'a'].includes(key.toLowerCase()))) return;

        if (name === 'name') {
            if (!/^[A-Za-z\s]$/.test(key)) {
                e.preventDefault();
                toast({ title: "Invalid Input", description: "Name can only contain letters and spaces", variant: "destructive" });
            }
        } else if (name === 'phone' || name === 'nationalId') {
            if (!/^\d$/.test(key)) {
                e.preventDefault();
                toast({ title: "Invalid Input", description: "Only numbers are allowed in this field", variant: "destructive" });
            }
            if (name === 'phone' && form.phone.length >= 10) e.preventDefault();
            if (name === 'nationalId' && form.nationalId.replace(/\s/g, '').length >= 12) e.preventDefault();
        } else if (name === 'panNumber') {
            const raw = form.panNumber.toUpperCase();
            const pos = raw.length;
            if (pos >= 10) { e.preventDefault(); return; }
            if (pos < 5 || pos === 9) { // Should be letter
                if (!/^[A-Za-z]$/.test(key)) {
                    e.preventDefault();
                    toast({ title: "Format Error", description: "This position must be a letter (A-Z)", variant: "destructive" });
                }
            } else { // Should be number
                if (!/^\d$/.test(key)) {
                    e.preventDefault();
                    toast({ title: "Format Error", description: "This position must be a number (0-9)", variant: "destructive" });
                }
            }
        }
    };

    const handlePaste = (e, name) => {
        const text = e.clipboardData.getData('text');
        if (name === 'name' && !/^[A-Za-z\s]*$/.test(text)) e.preventDefault();
        if ((name === 'phone' || name === 'nationalId') && !/^\d*$/.test(text)) e.preventDefault();
    };

    const formatAadhaar = (val) => {
        const cleaned = val.replace(/\s/g, '').slice(0, 12);
        return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    };

    const handleSave = async () => {
        // Final Validation Check
        if (!validateName(form.name)) return toast({ title: "Invalid Name", description: "3-50 letters only", variant: "destructive" });
        if (!validateEmail(form.email)) return toast({ title: "Invalid Email", description: "Please enter a valid email", variant: "destructive" });
        if (!validateMobile(form.phone)) return toast({ title: "Invalid Mobile", description: "Must be 10 digits starting with 6-9", variant: "destructive" });
        if (form.nationalId && !validateAadhaar(form.nationalId)) return toast({ title: "Invalid Aadhaar", description: "Must be exactly 12 digits", variant: "destructive" });
        if (form.panNumber && !validatePAN(form.panNumber)) return toast({ title: "Invalid PAN", description: "Must be in format ABCDE1234F", variant: "destructive" });

        try {
            const payload = {
                name: form.name,
                phone: form.phone,
                email: form.email,
                address: form.address,
                dob: form.dob,
                gender: form.gender,
                nationalId: form.nationalId.replace(/\s/g, ''),
                panNumber: form.panNumber.toUpperCase(),
                employment: {
                    occupation: form.occupation,
                    annualIncome: Number(form.annualIncome)
                },
                profilePic: form.profilePic
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
            <div className="h-64 bg-gradient-to-r from-[#134e8d] to-[#002b45] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
            </div>

            {/* Profile Header & Tabs */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 bg-white border-b border-slate-100 shadow-sm relative z-10 -mt-10 rounded-t-[2.5rem]">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 pt-4">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 -mt-24">
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-8 border-white shadow-2xl overflow-hidden bg-[#134e8d] flex items-center justify-center text-5xl font-bold text-white relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                                {form.profilePic ? (
                                    <img src={form.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    form.name?.charAt(0) || user.email.charAt(0).toUpperCase()
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#134e8d] text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl hover:bg-[#002b45] transition-all z-20 cursor-pointer hover:scale-110 active:scale-95">
                                <Camera size={16} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <div className="text-center md:text-left mb-2">
                            <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                                <h1 className="text-2xl font-bold text-slate-800">{form.name || 'User Name'}</h1>
                                <span className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                                    <CheckCircle2 size={12} /> Verified
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-2 justify-center md:justify-start">
                                {user.email} <span className="w-1 h-1 rounded-full bg-slate-300" /> Member since {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Jan 2022'}
                            </p>
                        </div>
                    </div>
                    
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-all shadow-sm uppercase tracking-widest">
                        <Edit2 size={14} /> Update Cover
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
                                className={`pb-4 text-[11px] font-bold uppercase tracking-[2px] flex items-center gap-2.5 whitespace-nowrap transition-all relative ${
                                    activeTab === tab ? "text-[#134e8d]" : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                <Icon size={16} strokeWidth={activeTab === tab ? 2.5 : 2} /> {tab}
                                {activeTab === tab && (
                                    <motion.div 
                                        layoutId="profileTab"
                                        className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#134e8d] rounded-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8">
                
                {/* Information Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Forms) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Core Profile Sync</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        name="name" 
                                        value={form.name} 
                                        onChange={handleChange} 
                                        onKeyDown={(e) => blockInvalidChar(e, 'name')}
                                        onPaste={(e) => handlePaste(e, 'name')}
                                        className={`w-full bg-slate-50 border ${getFieldStatus('name', form.name) === 'valid' ? 'border-emerald-500' : getFieldStatus('name', form.name) === 'invalid' ? 'border-red-500' : 'border-slate-100'} rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all`} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input 
                                        name="email" 
                                        value={form.email} 
                                        readOnly 
                                        className="w-full bg-slate-100/50 border border-slate-100 rounded-xl px-4 py-3 text-[13px] text-slate-400 font-medium outline-none cursor-not-allowed" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input 
                                        name="phone" 
                                        value={form.phone} 
                                        onChange={handleChange} 
                                        onKeyDown={(e) => blockInvalidChar(e, 'phone')}
                                        onPaste={(e) => handlePaste(e, 'phone')}
                                        className={`w-full bg-slate-50 border ${getFieldStatus('phone', form.phone) === 'valid' ? 'border-emerald-500' : getFieldStatus('phone', form.phone) === 'invalid' ? 'border-red-500' : 'border-slate-100'} rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all`} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                    <div className="relative">
                                        <input type="date" name="dob" value={form.dob?.split('T')[0] || ''} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all appearance-none" />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                                    <div className="relative">
                                        <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all appearance-none pr-10">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Occupation</label>
                                    <input name="occupation" value={form.occupation} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Aadhar Number</label>
                                    <input 
                                        name="nationalId" 
                                        value={formatAadhaar(form.nationalId)} 
                                        onChange={(e) => setForm(prev => ({ ...prev, nationalId: e.target.value.replace(/\s/g, '') }))} 
                                        onKeyDown={(e) => blockInvalidChar(e, 'nationalId')}
                                        onPaste={(e) => handlePaste(e, 'nationalId')}
                                        className={`w-full bg-slate-50 border ${getFieldStatus('nationalId', form.nationalId) === 'valid' ? 'border-emerald-500' : getFieldStatus('nationalId', form.nationalId) === 'invalid' ? 'border-red-500' : 'border-slate-100'} rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all tracking-wider font-mono`} 
                                        placeholder="XXXX XXXX 1234" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">PAN Card Number</label>
                                    <input 
                                        name="panNumber" 
                                        value={form.panNumber.toUpperCase()} 
                                        onChange={(e) => setForm(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))} 
                                        onKeyDown={(e) => blockInvalidChar(e, 'panNumber')}
                                        onPaste={(e) => handlePaste(e, 'panNumber')}
                                        className={`w-full bg-slate-50 border ${getFieldStatus('panNumber', form.panNumber) === 'valid' ? 'border-emerald-500' : getFieldStatus('panNumber', form.panNumber) === 'invalid' ? 'border-red-500' : 'border-slate-100'} rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all tracking-wider font-mono uppercase`} 
                                        placeholder="ABCDE1234F" 
                                    />
                                </div>
                                
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Address</label>
                                    <textarea name="address" value={form.address} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all resize-none" />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Annual Income (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                        <input type="number" name="annualIncome" value={form.annualIncome} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-10 flex justify-end pt-8 border-t border-slate-50">
                                <button 
                                    onClick={handleSave}
                                    className="bg-[#134e8d] text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#002b45] transition-all shadow-lg shadow-blue-100 active:scale-95"
                                >
                                    Save Profile Data
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Security / Stats) */}
                    <div className="space-y-8">
                        {/* Security Settings Widget */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 mb-8">Security Hub</h2>
                            
                            <div className="flex items-center justify-between py-5 border-b border-slate-50">
                                <div>
                                    <p className="font-bold text-slate-700 text-sm mb-1">Two-Factor Auth</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enhanced Shield Protection</p>
                                </div>
                                <ToggleRight size={32} className="text-slate-200 cursor-pointer hover:text-[#134e8d] transition-all" />
                            </div>

                            <div className="pt-8">
                                <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest">Recent Access Logs</p>
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between group/log">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#134e8d] group-hover/log:scale-110 transition-transform">
                                                <Settings size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">Chrome / Windows</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Kolkata, India</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-300 font-bold uppercase mb-1">Just now</p>
                                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Direct</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between group/log">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/log:scale-110 transition-transform">
                                                <Settings size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-500">iPhone 13 / iOS</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Mumbai, India</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-300 font-bold uppercase mb-1">Yesterday</p>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">Mobile</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Shield Widget */}
                        <div className="bg-[#134e8d] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Shield size={120} />
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-xl font-bold text-white mb-6">Profile Strength</h2>
                                
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: '85%' }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                                        />
                                    </div>
                                    <span className="font-bold text-sm">85%</span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                                            <CheckCircle2 size={12} className="text-emerald-400" />
                                        </div>
                                        <span className="text-xs font-medium text-blue-50">Identity Verified</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                                            <CheckCircle2 size={12} className="text-emerald-400" />
                                        </div>
                                        <span className="text-xs font-medium text-blue-50">Documents Uploaded</span>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-50">
                                        <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                                        <span className="text-xs font-medium text-blue-200">2FA Not Enabled</span>
                                    </div>
                                </div>

                                <button className="w-full bg-white text-[#134e8d] font-bold py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg text-[11px] uppercase tracking-widest active:scale-95">
                                    Security Audit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Uploaded Documents */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-1">Electronic Vault</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure Cloud Storage</p>
                        </div>
                        <button className="flex items-center gap-2 bg-[#134e8d] text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#002b45] transition-all shadow-lg shadow-blue-100">
                            <Plus size={14} /> NEW UPLOAD
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profileData?.documents && profileData.documents.length > 0 ? profileData.documents.map((doc, i) => (
                            <div key={i} className="border border-slate-50 rounded-2xl p-5 flex items-center justify-between group hover:border-[#134e8d]/20 hover:shadow-xl hover:shadow-blue-50/50 transition-all bg-slate-50/30 hover:bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 text-[#134e8d] flex items-center justify-center shrink-0 font-bold shadow-sm group-hover:scale-110 transition-transform">
                                        <FileText size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-[13px] text-slate-700 mb-1 truncate max-w-[140px]">{doc.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {doc.type} <span className="mx-1">•</span> {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-[#134e8d] hover:bg-blue-50 transition-all"><Eye size={16} /></a>
                                    <a href={doc.url} download className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-[#134e8d] hover:bg-blue-50 transition-all"><Download size={16} /></a>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
                                <div className="w-20 h-20 bg-white rounded-full border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <FileText className="text-slate-200" size={32} />
                                </div>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[6px]">Secure Node Empty</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;