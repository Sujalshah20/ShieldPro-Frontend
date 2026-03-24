import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
    Settings, Mail, Phone, MapPin, 
    Upload, Shield, Zap, CreditCard, 
    Users, Database, Save, X,
    Image as ImageIcon, Info
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminSettings = () => {
    const { tab } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    
    // Default to general if no tab is provided or if tab is invalid
    const activeTabRaw = tab || "general";
    
    // Map URL param to formal ID
    const tabMap = {
        general: "General",
        email: "Email Templates",
        payment: "Payment Gateway",
        roles: "Roles & Permissions",
        backup: "Backup"
    };

    const activeTab = tabMap[activeTabRaw.toLowerCase()] || "General";

    const handleSave = () => {
        toast({ title: "Global settings saved successfully" });
    };

    return (
        <div className="space-y-8 pb-10 max-w-5xl mx-auto">
            {/* Header Module */}
            <div className="space-y-1">
                <Reveal direction="left">
                    <h1 className="text-2xl font-black text-black tracking-tighter italic uppercase">{activeTab} Settings_</h1>
                    <p className="text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] italic">
                        {activeTab === "General" 
                            ? "Configure your corporate identity and global system parameters // ROOT_ACCESS"
                            : `Manage and configure your ${activeTab.toLowerCase()} parameters // MODULE_IO`}
                    </p>
                </Reveal>
            </div>

            {/* Main Settings Content */}
            <div className="space-y-8">
                {activeTab === "General" ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Company Information Section */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-white bg-slate-50">
                                <h3 className="text-[11px] font-black text-black uppercase tracking-[3px] italic">Company Information</h3>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-8">
                                {/* Logo Upload Area */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">Company Logo</label>
                                    <div className="aspect-[3/2] border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white hover:border-black/10 transition-all cursor-pointer group shadow-sm">
                                        <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-black opacity-10 group-hover:opacity-100 transition-all mb-4 shadow-sm">
                                            <ImageIcon size={32} strokeWidth={3} />
                                        </div>
                                        <p className="text-[11px] font-black text-black opacity-30 uppercase tracking-widest italic">
                                            Drag & drop or <span className="text-black opacity-100 font-black">browse</span>
                                        </p>
                                        <p className="text-[9px] font-black text-black opacity-20 mt-2 uppercase tracking-[2px] italic">Recommended: 512×512px SVG or PNG</p>
                                    </div>
                                </div>

                                {/* Input Fields */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">Company Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue="Secure Shield Insurance Corp."
                                            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all italic"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">Contact Email</label>
                                            <input 
                                                type="email" 
                                                defaultValue="admin@secureshield.com"
                                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-black outline-none transition-all italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">Phone Number</label>
                                            <input 
                                                type="text" 
                                                defaultValue="+1 (555) 902-1234"
                                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-black outline-none transition-all italic"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-black opacity-40 uppercase tracking-[3px] italic pl-1">Headquarters Address</label>
                                        <input 
                                            type="text" 
                                            defaultValue="101 Financial Plaza, New York, NY 10004"
                                            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-black outline-none transition-all italic"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms & Conditions Section */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
                                <h3 className="text-[11px] font-black text-black uppercase tracking-[3px] italic font-black">Terms & Conditions</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-black text-sm">
                                    <Info size={18} className="mt-0.5 flex-shrink-0 opacity-20" />
                                    <p className="font-black text-black opacity-40 text-[11px] uppercase tracking-[2px] italic">This content will be displayed to all clients during the policy onboarding process.</p>
                                </div>
                                <textarea 
                                    rows="6"
                                    className="w-full p-6 bg-white border border-slate-200 rounded-xl text-sm font-black focus:border-black outline-none transition-all resize-none leading-relaxed font-mono italic"
                                    defaultValue={`Secure Shield Insurance (the "Company") provides management services under the following terms...

1. Policy Issuance: All policies are subject to underwriter approval.
2. Claim Processing: Claims must be submitted within 30 days of the incident.
3. Privacy: We adhere to global data protection standards.`}
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 mt-10">
                            <button className="h-12 px-8 bg-white border border-slate-100 text-black opacity-40 hover:opacity-100 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all italic">
                                Discard Changes
                            </button>
                            <button 
                                onClick={handleSave}
                                className="h-12 px-8 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black/90 transition-all shadow-3xl active:scale-95 italic border-b-4 border-white/10"
                            >
                                Save Global Settings
                            </button>
                        </div>

                        {/* Other Modules Preview Divider */}
                        <div className="pt-10 flex items-center gap-4 opacity-30">
                            <div className="h-[1px] flex-1 bg-slate-300" />
                            <span className="text-[10px] font-black uppercase tracking-[5px] text-black opacity-20 italic">Other Modules Preview // STANDBY</span>
                            <div className="h-[1px] flex-1 bg-slate-300" />
                        </div>
                    </motion.div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-black opacity-10 mx-auto">
                            <Settings size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-lg font-black text-black italic uppercase tracking-tighter">{activeTab} Interface</h3>
                        <p className="text-black opacity-30 max-w-sm mx-auto text-[10px] font-black uppercase tracking-widest italic leading-relaxed">This module is currently in standard operational status. Access the parameters view to configure {activeTab.toLowerCase()} logic.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSettings;
