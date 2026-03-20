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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);
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
        if (!validateAadhaar(form.nationalId)) return toast({ title: "Invalid Aadhaar", description: "Must be exactly 12 digits", variant: "destructive" });
        if (!validatePAN(form.panNumber)) return toast({ title: "Invalid PAN", description: "Must be in format ABCDE1234F", variant: "destructive" });

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
            <div className="h-56 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] relative">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-full relative">
                    {/* Placeholder for Cover pattern/image */}
                    <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                </div>
            </div>

            {/* Profile Header & Tabs */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 bg-white border-b border-gray-100 shadow-sm relative z-10 pt-3">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-6 -mt-20 md:-mt-16">
                        <div className="relative group">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-sm overflow-hidden bg-[#002b45] flex items-center justify-center text-4xl font-bold text-white relative z-10">
                                {form.profilePic ? (
                                    <img src={form.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    form.name?.charAt(0) || user.email.charAt(0).toUpperCase()
                                )}
                            </div>
                            <label className="absolute bottom-1 right-1 w-7 h-7 bg-[#002b45] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#003b5c] transition-colors z-20 cursor-pointer">
                                <Camera size={12} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-xl font-bold text-[#002b45] mb-0.5">{form.name || 'User'}</h1>
                            <p className="text-xs text-gray-500">{user.email} • Member since Jan 2022</p>
                        </div>
                    </div>
                    
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Edit2 size={14} /> Edit Cover
                    </button>
                </div>

                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {["Personal Info", "Security", "Documents", "Settings"].map((tab) => {
                        const Icon = tab === "Personal Info" ? UserIcon :
                                     tab === "Security" ? Shield :
                                     tab === "Documents" ? FileText : Settings;
                        
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-[13px] font-semibold flex items-center gap-2 whitespace-nowrap transition-colors relative ${
                                    activeTab === tab ? "text-[#002b45]" : "text-gray-500 hover:text-gray-800"
                                }`}
                            >
                                <Icon size={14} /> {tab}
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
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
                
                {/* Information Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column (Forms) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#002b45]">Personal Information</h2>
                                <span className="bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider">
                                    Verified
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <input 
                                        name="name" 
                                        value={form.name} 
                                        onChange={handleChange} 
                                        onKeyDown={(e) => blockInvalidChar(e, 'name')}
                                        onPaste={(e) => handlePaste(e, 'name')}
                                        className={`w-full bg-white border ${getFieldStatus('name', form.name) === 'valid' ? 'border-emerald-500' : getFieldStatus('name', form.name) === 'invalid' ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none transition-colors`} 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <input 
                                        name="email" 
                                        value={form.email} 
                                        readOnly 
                                        className={`w-full bg-gray-50 border ${getFieldStatus('email', form.email) === 'valid' ? 'border-emerald-500 focus:border-emerald-500' : 'border-gray-200'} rounded-lg px-3.5 py-2.5 text-[13px] text-gray-500 outline-none`} 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <input 
                                        name="phone" 
                                        value={form.phone} 
                                        onChange={handleChange} 
                                        onKeyDown={(e) => blockInvalidChar(e, 'phone')}
                                        onPaste={(e) => handlePaste(e, 'phone')}
                                        className={`w-full bg-white border ${getFieldStatus('phone', form.phone) === 'valid' ? 'border-emerald-500' : getFieldStatus('phone', form.phone) === 'invalid' ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none transition-colors`} 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">Date of Birth</label>
                                    <div className="relative">
                                        <input type="date" name="dob" value={form.dob?.split('T')[0] || ''} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#002b45] transition-colors appearance-none" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                                    <div className="relative">
                                        <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#002b45] transition-colors appearance-none pr-10">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Occupation</label>
                                    <input name="occupation" value={form.occupation} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#002b45] transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Aadhar Number</label>
                                    <input 
                                        name="nationalId" 
                                        value={formatAadhaar(form.nationalId)} 
                                        onChange={(e) => setForm(prev => ({ ...prev, nationalId: e.target.value.replace(/\s/g, '') }))} 
                                        onKeyDown={(e) => blockInvalidChar(e, 'nationalId')}
                                        onPaste={(e) => handlePaste(e, 'nationalId')}
                                        className={`w-full bg-white border ${getFieldStatus('nationalId', form.nationalId) === 'valid' ? 'border-emerald-500' : getFieldStatus('nationalId', form.nationalId) === 'invalid' ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none transition-colors tracking-widest font-mono`} 
                                        placeholder="XXXX XXXX 1234" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">PAN Card Number</label>
                                    <input 
                                        name="panNumber" 
                                        value={form.panNumber.toUpperCase()} 
                                        onChange={(e) => setForm(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))} 
                                        onKeyDown={(e) => blockInvalidChar(e, 'panNumber')}
                                        onPaste={(e) => handlePaste(e, 'panNumber')}
                                        className={`w-full bg-white border ${getFieldStatus('panNumber', form.panNumber) === 'valid' ? 'border-emerald-500' : getFieldStatus('panNumber', form.panNumber) === 'invalid' ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none transition-colors tracking-widest font-mono uppercase`} 
                                        placeholder="ABCDE1234F" 
                                    />
                                </div>
                                
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current Address</label>
                                    <textarea name="address" value={form.address} onChange={handleChange} rows="2" className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#002b45] transition-colors resize-none" />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Annual Income (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                        <input type="number" name="annualIncome" value={form.annualIncome} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#002b45] transition-colors" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end pt-5 border-t border-gray-100">
                                <button 
                                    onClick={handleSave}
                                    className="bg-[#002b45] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#003b5c] transition-colors shadow-sm"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Security / Stats) */}
                    <div className="space-y-6">
                        {/* Security Settings Widget */}
                        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-[#002b45] mb-5">Security Settings</h2>
                            
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div>
                                    <p className="font-bold text-[#002b45] text-[13px] mb-0.5">Two-Factor Auth</p>
                                    <p className="text-[11px] text-gray-500">Secure your account</p>
                                </div>
                                <ToggleRight size={28} className="text-[#002b45] cursor-pointer" />
                            </div>

                            <div className="pt-5">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Login History</p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-1/2"><p className="text-[12px] font-semibold text-[#002b45]">Chrome / Win</p></div>
                                        <div className="w-1/2 text-right">
                                            <p className="text-[9px] text-gray-400 mb-0.5">2 mins ago</p>
                                            <span className="text-[11px] font-bold text-emerald-600">Active</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="w-1/2"><p className="text-[12px] font-semibold text-gray-500">iPhone 13 / iOS</p></div>
                                        <div className="w-1/2 text-right">
                                            <p className="text-[9px] text-gray-400 mb-0.5">Yesterday</p>
                                            <span className="text-[11px] font-bold text-gray-400">Expired</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Shield Widget */}
                        <div className="bg-[#002b45] rounded-2xl p-5 md:p-6 text-white">
                            <h2 className="text-lg font-bold text-white mb-5">Account Shield</h2>
                            
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[85%] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                                </div>
                                <span className="font-bold text-xs">85%</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                    <span className="text-xs font-medium">Verified Phone</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                    <span className="text-xs font-medium">Verified Aadhar</span>
                                </div>
                                <div className="flex items-center gap-2.5 opacity-50">
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 shrink-0"></div>
                                    <span className="text-xs font-medium">Link alternate email</span>
                                </div>
                            </div>

                            <button className="w-full bg-white text-[#002b45] font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-colors shadow-sm text-sm">
                                Security Audit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Uploaded Documents */}
                <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[#002b45]">Uploaded Documents</h2>
                        <button className="text-[12px] font-bold text-[#002b45] hover:text-[#003b5c] flex items-center gap-1 transition-colors">
                            <Plus size={14} /> Upload New
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="border border-gray-200 rounded-xl p-3.5 flex items-center justify-between group hover:border-[#002b45] hover:shadow-sm transition-all">
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                    <span className="text-[9px] font-black uppercase">PDF</span>
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-[#002b45] mb-0.5">Aadhar_Card.pdf</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">2.4 MB • May 20</p>
                                </div>
                            </div>
                            <div className="flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-400 hover:text-[#002b45]"><Eye size={14} /></button>
                                <button className="text-gray-400 hover:text-[#002b45]"><Download size={14} /></button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-3.5 flex items-center justify-between group hover:border-[#002b45] hover:shadow-sm transition-all">
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <ImageIcon size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-[#002b45] mb-0.5">PAN_Card_Front.jpg</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">1.1 MB • May 21</p>
                                </div>
                            </div>
                            <div className="flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-400 hover:text-[#002b45]"><Eye size={14} /></button>
                                <button className="text-gray-400 hover:text-[#002b45]"><Download size={14} /></button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-3.5 flex items-center justify-between group hover:border-[#002b45] hover:shadow-sm transition-all">
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-lg bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-[#002b45] mb-0.5">Employment_Cert...</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">3.8 MB • Jun 05</p>
                                </div>
                            </div>
                            <div className="flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-400 hover:text-[#002b45]"><Eye size={14} /></button>
                                <button className="text-gray-400 hover:text-[#002b45]"><Download size={14} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;