import React, { useContext, useState, useRef, useEffect } from "react";
import { 
    Mail, Edit, User, Shield, Camera, Save, X, Loader2, MapPin, Phone, Briefcase, Calendar, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import Reveal from "../../components/common/Reveal";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";

const AgentProfile = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    // State for form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        address: "",
        profilePic: ""
    });

    // Populate form data when user context is available
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                specialization: user.specialization || "Health & Life Insurance",
                experience: user.experience || "8 Years",
                address: user.address || "",
                profilePic: user.profilePic || ""
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setIsEditing(false);
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                specialization: user.specialization || "Health & Life Insurance",
                experience: user.experience || "8 Years",
                address: user.address || "",
                profilePic: user.profilePic || ""
            });
        } else {
            setIsEditing(true);
        }
    };

    const handleImageClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast({ title: "File too large", description: "Image must be under 2MB", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, profilePic: reader.result }));
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put("/users/profile", formData);
            toast({ title: "Success", description: "Profile updated successfully." });
            setIsEditing(false);
            window.location.reload(); 
        } catch (error) {
            toast({ title: "Error", description: error.response?.data?.message || "Update failed", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayAvatar = formData.profilePic || user?.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram";

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-16">
            <div className="max-w-[1400px] mx-auto p-12 space-y-10">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Agent Profile Management</h1>
                        <p className="text-slate-500 mt-2 text-lg font-medium">Manage your personal information and professional settings.</p>
                    </div>
                    {isEditing && (
                        <div className="flex items-center gap-4">
                            <button onClick={handleEditToggle} className="flex items-center gap-2 px-6 py-3 text-slate-500 hover:text-slate-700 font-bold text-base transition-all">
                                <X size={20} /> Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-base shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 active:scale-95">
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Balanced Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    
                    {/* Left Column: Summary Card (takes 4/12) */}
                    <div className="xl:col-span-4 space-y-8">
                        <Reveal>
                            <div className="bg-white rounded-[24px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center">
                                {/* Profile Pic */}
                                <div 
                                    onClick={handleImageClick}
                                    className={`group relative w-48 h-48 rounded-[32px] overflow-hidden border-4 transition-all mb-8 ${
                                        isEditing ? "border-emerald-500 cursor-pointer scale-[1.03] shadow-2xl shadow-emerald-50" : "border-slate-50"
                                    } bg-slate-50 shadow-lg`}
                                >
                                    <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isUploading ? <Loader2 size={32} className="text-white animate-spin" /> : <><Camera size={32} className="text-white mb-2" /><span className="text-xs text-white font-bold uppercase tracking-widest">Update Photo</span></>}
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                                </div>

                                <div className="space-y-3 w-full">
                                    <h2 className="text-3xl font-bold text-slate-900 truncate px-2">{isEditing ? formData.name : user?.name}</h2>
                                    <div className="flex items-center justify-center gap-2 pb-2">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                                            {user?.role === 'agent' ? 'Senior Agent' : user?.role || 'Agent'}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">AG-7829</span>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-slate-50 w-full flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-3 text-slate-500 font-medium">
                                            <Mail size={18} className="text-slate-400" />
                                            <span className="text-[15px]">{isEditing ? formData.email : user?.email}</span>
                                        </div>
                                    </div>

                                    {!isEditing && (
                                        <button onClick={handleEditToggle} className="w-full mt-8 flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]">
                                            <Edit size={18} />
                                            Edit Your Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Reveal>

                        {/* Quick Stats Placeholder to fill vertical space if needed */}
                        <Reveal delay={0.1}>
                           <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[24px] p-8 text-white relative overflow-hidden group">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                <h4 className="text-white/40 font-bold text-[11px] uppercase tracking-[3px] mb-6">Security & Account</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                                        <span className="text-white/60">Verification Status</span>
                                        <span className="text-emerald-400 font-bold flex items-center gap-2"><CheckCircle2 size={14} /> Verified</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2">
                                        <span className="text-white/60">Member Since</span>
                                        <span className="text-white font-bold">{user?.createdAt ? new Date(user.createdAt).getFullYear() : '2016'}</span>
                                    </div>
                                </div>
                           </div>
                        </Reveal>
                    </div>

                    {/* Right Column: Detailed Info (takes 8/12) */}
                    <div className="xl:col-span-8">
                        <Reveal delay={0.2}>
                            <form onSubmit={handleSubmit} className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden h-full">
                                <div className="px-10 py-8 border-b border-slate-50 bg-white flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Personal & Professional Details</h3>
                                        <p className="text-sm text-slate-400 font-medium mt-1">Keep your information up to date to ensure seamless settlements.</p>
                                    </div>
                                    {isEditing && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Live Editing</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <DetailBlock label="FULL NAME" name="name" icon={User} value={formData.name} onChange={handleInputChange} isEditing={isEditing} />
                                        <DetailBlock label="EMAIL ADDRESS" name="email" icon={Mail} value={formData.email} onChange={handleInputChange} isEditing={isEditing} />
                                        <DetailBlock label="PHONE NUMBER" name="phone" icon={Phone} value={formData.phone} onChange={handleInputChange} isEditing={isEditing} />
                                        <DetailBlock label="SPECIALIZATION" name="specialization" icon={Shield} value={formData.specialization} onChange={handleInputChange} isEditing={isEditing} />
                                        <DetailBlock label="EXPERIENCE" name="experience" icon={Briefcase} value={formData.experience} onChange={handleInputChange} isEditing={isEditing} />
                                        <DetailBlock label="JOIN DATE" icon={Calendar} value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "March 12, 2016"} isEditing={false} />
                                    </div>
                                    <div className="mt-10 pt-10 border-t border-slate-50">
                                        <DetailBlock label="REGISTERED OFFICE ADDRESS" name="address" icon={MapPin} value={formData.address} onChange={handleInputChange} isEditing={isEditing} fullWidth />
                                    </div>
                                </div>
                            </form>
                        </Reveal>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Helper Components ---

const DetailBlock = ({ label, value, name, onChange, isEditing, icon: Icon, fullWidth = false }) => (
    <div className={`space-y-3 ${fullWidth ? 'w-full' : ''}`}>
        <div className="flex items-center gap-2 pl-1">
            {Icon && <Icon size={12} className="text-slate-300" />}
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        </div>
        {isEditing ? (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-[16px] font-bold text-base text-slate-700 focus:border-emerald-500 focus:outline-none transition-all shadow-sm hover:border-slate-300"
                placeholder={`Enter your ${label.toLowerCase()}...`}
            />
        ) : (
            <div className="w-full px-5 py-4 bg-slate-50/50 border border-slate-50 rounded-[16px] transition-all hover:bg-white hover:border-slate-200">
                <span className="text-[15px] font-bold text-slate-700">{value}</span>
            </div>
        )}
    </div>
);

export default AgentProfile;
