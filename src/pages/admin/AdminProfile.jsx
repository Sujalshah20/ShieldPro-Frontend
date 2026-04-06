import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";
import { 
    Edit2, Mail, RotateCcw
} from "lucide-react";
import { motion } from "framer-motion";

const AdminProfile = () => {
    const { user, setAuthData } = useContext(AuthContext);
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Mock/Fallback data
    const adminData = {
        name: user?.name || "Alexander Pierce",
        role: "Super Admin",
        email: user?.email || "a.pierce@secureshield.cc",
        avatar: user?.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander"
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Function to resize image
        const resizeImage = (file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 256;
                        const MAX_HEIGHT = 256;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Output as JPEG to save space
                        resolve(canvas.toDataURL('image/jpeg', 0.8));
                    };
                };
            });
        };

        setIsUploading(true);
        try {
            const base64data = await resizeImage(file);
            setAvatarPreview(base64data);
            
            const token = user?.token || localStorage.getItem('token');
            const res = await api.put('/users/profile', { profilePic: base64data }, token);
            setAuthData({ ...user, profilePic: res.profilePic || base64data });
            toast({ title: "Profile image updated successfully!" });
        } catch (err) {
            console.error(err);
            toast({ title: "Image upload failed", description: err.message, variant: "destructive" });
            setAvatarPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="-mt-8 min-h-[calc(100vh+2rem)] bg-[#F8FAFC] font-sans pb-10">
            {/* 1. Top Header */}
            <header className="h-[72px] bg-white flex items-center justify-between px-8 border-b border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                {/* Search removed, leaving empty div for flex spacing */}
                <div></div>

                {/* Right Utilities */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                    </div>

                    <div className="h-8 w-px bg-slate-200"></div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[13px] font-bold text-slate-800 leading-tight">{adminData.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">SUPER ADMIN</span>
                        </div>
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-orange-100 flex-shrink-0">
                            <img src={avatarPreview || adminData.avatar} alt="Admin Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-8 pt-8 space-y-6">
                
                {/* Profile Summary Card */}
                <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Avatar Upload */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-orange-100 shadow-sm relative group">
                            <img src={avatarPreview || adminData.avatar} alt="Profile" className={`w-full h-full object-cover transition-all duration-300 ${isUploading ? 'opacity-50 blur-sm' : 'group-hover:opacity-80'}`} />
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            id="avatar-upload" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                        />
                        <label htmlFor="avatar-upload" className={`absolute -bottom-2 -right-2 w-8 h-8 bg-[#111827] text-white rounded-lg flex items-center justify-center shadow-lg transition-all cursor-pointer z-10 hover:scale-105 active:scale-95 ${isUploading ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-800'}`}>
                            <Edit2 size={14} />
                        </label>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{adminData.name}</h2>
                                <p className="text-[13px] font-medium text-[#2563EB] mt-0.5">{adminData.role}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-full">ACTIVE</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full">ADMIN</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-slate-50/80 rounded-xl border border-slate-100/50">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-[13px] font-medium text-slate-600">{adminData.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Credentials Card */}
                <div className="bg-white rounded-2xl p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50">
                    <div className="flex items-center gap-3 mb-8">
                        <RotateCcw size={20} className="text-rose-500" />
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Update Credentials</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">CURRENT PASSWORD</label>
                            <input 
                                type="password" 
                                defaultValue="password123"
                                className="w-full h-11 bg-[#F8FAFC] border border-transparent rounded-xl px-4 text-slate-700 font-medium focus:border-slate-300 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">NEW PASSWORD</label>
                            <input 
                                type="password" 
                                placeholder="Create strong password"
                                className="w-full h-11 bg-[#F8FAFC] border border-transparent rounded-xl px-4 text-slate-700 font-medium focus:border-slate-300 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            />
                            <div className="flex items-center justify-end gap-2 pr-1 mt-2">
                                <div className="h-1.5 w-12 bg-slate-200 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-slate-300 flex-1"></div>
                                    <div className="h-full bg-slate-300 flex-1 border-l border-white"></div>
                                    <div className="h-full bg-slate-300 flex-1 border-l border-white"></div>
                                </div>
                                <span className="text-[10px] font-extrabold text-slate-800 tracking-wider">STRONG</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">CONFIRM NEW PASSWORD</label>
                            <input 
                                type="password" 
                                placeholder="Repeat new password"
                                className="w-full h-11 bg-[#F8FAFC] border border-transparent rounded-xl px-4 text-slate-700 font-medium focus:border-slate-300 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <button className="w-full mt-8 py-3.5 bg-[#1F2937] hover:bg-slate-800 text-white rounded-xl text-[13px] font-bold transition-all shadow-md mt-4">
                            Apply New Password
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminProfile;
