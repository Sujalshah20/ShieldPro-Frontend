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
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">{activeTab} Settings</h1>
                    <p className="text-base font-medium text-slate-500">
                        {activeTab === "General" 
                            ? "Configure your corporate identity and global system parameters."
                            : `Manage and configure your ${activeTab.toLowerCase()} parameters.`}
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
                            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                                <h3 className="text-lg font-bold text-slate-800">Company Information</h3>
                            </div>
                            <div className="p-8 grid md:grid-cols-2 gap-10">
                                {/* Logo Upload Area */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700">Company Logo</label>
                                    <div className="aspect-[3/2] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors mb-4">
                                            <ImageIcon size={32} />
                                        </div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Drag & drop or <span className="text-blue-600 font-bold">browse</span>
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-2">Recommended: 512×512px SVG or PNG</p>
                                    </div>
                                </div>

                                {/* Input Fields */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Company Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue="Secure Shield Insurance Corp."
                                            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Contact Email</label>
                                            <input 
                                                type="email" 
                                                defaultValue="admin@secureshield.com"
                                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Phone Number</label>
                                            <input 
                                                type="text" 
                                                defaultValue="+1 (555) 902-1234"
                                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Headquarters Address</label>
                                        <input 
                                            type="text" 
                                            defaultValue="101 Financial Plaza, New York, NY 10004"
                                            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms & Conditions Section */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                                <h3 className="text-lg font-bold text-slate-800">Terms & Conditions</h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-50 text-blue-700 text-sm">
                                    <Info size={18} className="mt-0.5 flex-shrink-0" />
                                    <p className="font-medium text-slate-500 text-sm">This content will be displayed to all clients during the policy onboarding process.</p>
                                </div>
                                <textarea 
                                    rows="6"
                                    className="w-full p-6 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 outline-none transition-all resize-none leading-relaxed font-mono"
                                    defaultValue={`Secure Shield Insurance (the "Company") provides management services under the following terms...

1. Policy Issuance: All policies are subject to underwriter approval.
2. Claim Processing: Claims must be submitted within 30 days of the incident.
3. Privacy: We adhere to global data protection standards.`}
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 mt-10">
                            <button className="h-12 px-8 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                                Discard Changes
                            </button>
                            <button 
                                onClick={handleSave}
                                className="h-12 px-8 bg-[#1e293b] text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                            >
                                Save Global Settings
                            </button>
                        </div>

                        {/* Other Modules Preview Divider */}
                        <div className="pt-10 flex items-center gap-4 opacity-30">
                            <div className="h-[1px] flex-1 bg-slate-300" />
                            <span className="text-[10px] font-bold uppercase tracking-[3px] text-slate-400">Other Modules Preview</span>
                            <div className="h-[1px] flex-1 bg-slate-300" />
                        </div>
                    </motion.div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                            <Settings size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{activeTab} Interface</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium">This module is currently in standard operational status. Access the parameters view to configure {activeTab.toLowerCase()} logic.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSettings;
