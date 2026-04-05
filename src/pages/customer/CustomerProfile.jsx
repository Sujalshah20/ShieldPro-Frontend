import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { 
    User as UserIcon, Camera, Calendar, CheckCircle2, ChevronDown
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
                email: profileData.email || user.email || '',
                phone: profileData.phone || '',
                address: profileData.address || '',
                dob: profileData.dob || '',
                gender: profileData.gender || 'Male',
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
    const validateMobile = (val) => /^[6-9]\d{9}$/.test(val);

    const getFieldStatus = (name, value) => {
        if (!value) return 'none';
        switch (name) {
            case 'name': return validateName(value) ? 'valid' : 'invalid';
            case 'email': return validateEmail(value) ? 'valid' : 'invalid';
            case 'phone': return validateMobile(value) ? 'valid' : 'invalid';
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
        } else if (name === 'phone') {
            if (!/^\d$/.test(key)) {
                e.preventDefault();
                toast({ title: "Invalid Input", description: "Only numbers are allowed in this field", variant: "destructive" });
            }
            if (name === 'phone' && form.phone.length >= 10) e.preventDefault();
        }
    };

    const handlePaste = (e, name) => {
        const text = e.clipboardData.getData('text');
        if (name === 'name' && !/^[A-Za-z\s]*$/.test(text)) e.preventDefault();
        if (name === 'phone' && !/^\d*$/.test(text)) e.preventDefault();
    };

    const handleSave = async () => {
        // Final Validation Check
        if (!validateName(form.name)) return toast({ title: "Invalid Name", description: "3-50 letters only", variant: "destructive" });
        if (!validateEmail(form.email)) return toast({ title: "Invalid Email", description: "Please enter a valid email", variant: "destructive" });
        if (!validateMobile(form.phone)) return toast({ title: "Invalid Mobile", description: "Must be 10 digits starting with 6-9", variant: "destructive" });

        try {
            const payload = {
                name: form.name,
                phone: form.phone,
                email: form.email,
                address: form.address,
                dob: form.dob,
                gender: form.gender,
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
                                <h1 className="text-2xl font-bold text-slate-800">{profileData?.name || user?.name || 'User Name'}</h1>
                                <span className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                                    <CheckCircle2 size={12} /> Verified
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-2 justify-center md:justify-start">
                                {profileData?.email || user?.email} <span className="w-1 h-1 rounded-full bg-slate-300" /> Member since {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Jan 2026'}
                            </p>
                        </div>
                    </div>
                    
                </div>

                <div className="flex items-center gap-8 border-b border-slate-50">
                    <div className="pb-4 text-[11px] font-bold uppercase tracking-[2px] text-[#134e8d] flex items-center gap-2.5 relative">
                        <UserIcon size={16} strokeWidth={2.5} /> Personal Info
                        <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#134e8d] rounded-full" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8">
                
                {/* Information Layout */}
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
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
                                    onChange={handleChange}
                                    className={`w-full bg-slate-50 border ${getFieldStatus('email', form.email) === 'valid' ? 'border-emerald-500' : getFieldStatus('email', form.email) === 'invalid' ? 'border-red-500' : 'border-slate-100'} rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-[#134e8d] transition-all`} 
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
            </div>
        </div>
    );
};

export default CustomerProfile;