import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { motion } from "framer-motion";
import { 
    Paperclip, ArrowLeft, Shield, Clock, 
    IndianRupee, Activity, Truck, Home, 
    Globe, FileText, Zap, ShieldCheck,
    TrendingUp, AlertCircle, 
    Layout, Box, Lock,
    Eye, Download, Share2, Trash2, Edit3, ClipboardList,
    Layers, Command, Compass, Terminal, Award, Cpu, HardDrive
} from "lucide-react";
import Reveal from "../../components/common/Reveal";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../hooks/use-toast";

const PolicyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: policy, isLoading } = useQuery({
        queryKey: ['policyDetails', id, user?.token],
        queryFn: () => api.get(`/policies/${id}`, user.token),
        enabled: !!user?.token && !!id
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/policies/${id}`, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "SCHEME_DECOMMISSIONED", description: "The policy protocol has been successfully purged from the mainframe." });
            navigate('/admin/policies');
        },
        onError: () => {
            toast({ title: "DECOMMISSION_ERROR", description: "Mainframe rejected the purge request. Verify your clearance levels.", variant: "destructive" });
        }
    });

    const getPolicyIcon = (type) => {
        const iconProps = { size: 36, strokeWidth: 3, className: "text-primary group-hover:scale-110 transition-transform duration-500" };
        switch(type) {
            case 'Health': return <Activity {...iconProps} />;
            case 'Vehicle': case 'Auto': return <Truck {...iconProps} />;
            case 'Property': case 'Home': return <Home {...iconProps} />;
            case 'Life': return <Shield {...iconProps} />;
            case 'Travel': return <Globe {...iconProps} />;
            default: return <FileText {...iconProps} />;
        }
    };

    const coverageItems = [
        { name: "Fire and Lightning", description: "Coverage for damage caused by fire, smoke, and lightning strikes.", icon: Zap },
        { name: "Windstorm and Hail", description: "Protection against severe weather conditions and structural damage.", icon: Activity },
        { name: "Theft and Burglary", description: "Security coverage for stolen property and resulting physical damage.", icon: ShieldCheck },
    ];

    if (isLoading) return <div className="p-10 bg-[#dae5e5] min-h-screen"><TableSkeleton rows={8} /></div>;

    if (!policy) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#012b3f] text-white p-10 font-display">
            <h2 className="text-4xl font-black uppercase mb-6">Asset Not Found</h2>
            <button onClick={() => navigate('/admin/policies')} className="px-10 py-4 bg-[#0082a1] text-white rounded-xl font-bold uppercase transition-all">Return to Inventory</button>
        </div>
    );

    return (
        <div className="admin-policy-details p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Header Section */}
            <div className="mb-8 overflow-hidden">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-6">
                    <button onClick={() => navigate('/admin')} className="hover:text-[#0082a1] transition-colors">Dashboard</button>
                    <span>/</span>
                    <button onClick={() => navigate('/admin/policies')} className="hover:text-[#0082a1] transition-colors">Policy Management</button>
                    <span>/</span>
                    <span className="text-[#012b3f]">Details</span>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#012b3f] shadow-sm border border-slate-200 hover:bg-[#012b3f] hover:text-white transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                             <div className="flex items-center gap-4 mb-1">
                                <h1 className="text-3xl font-black text-[#012b3f]">Policy Portfolio #{id.slice(-8).toUpperCase()}</h1>
                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                             </div>
                             <p className="text-sm text-slate-500 font-medium">Detailed asset overview and coverage configuration.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 border-2 border-[#012b3f] text-[#012b3f] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#012b3f] hover:text-white transition-all">Manage Policy</button>
                        <button className="px-6 py-3 bg-[#0082a1] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#0082a1]/20 hover:scale-105 transition-all">Raise Claim</button>
                    </div>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Policy Value", value: `$${policy.coverageAmount?.toLocaleString()}`, icon: Shield, color: "text-[#0082a1]" },
                    { label: "Annual Premium", value: `$${policy.premiumAmount?.toLocaleString()}`, icon: IndianRupee, color: "text-amber-500" },
                    { label: "Renewal Date", value: "Oct 12, 2026", icon: Clock, color: "text-blue-500" },
                    { label: "Claims Filed", value: "0", icon: ClipboardList, color: "text-rose-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl bg-slate-50 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-2xl font-black text-[#012b3f]">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Description & Coverage */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-10">
                        <h3 className="text-xl font-black text-[#012b3f] mb-6 flex items-center gap-4">
                            <FileText size={22} className="text-[#0082a1]" /> Policy Description
                        </h3>
                        <p className="text-slate-500 font-medium leading-[1.8]">
                            {policy.description || "This policy provides comprehensive commercial protection for high-value assets. Designed for enterprise-grade operations, it includes specific protocols for liability mitigation and asset recovery under standard global compliance frameworks."}
                        </p>
                        
                        <div className="mt-12 space-y-6">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Active Coverage Types</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {coverageItems.map((item, i) => (
                                    <div key={i} className="p-6 bg-[#f8fafb] border border-slate-100 rounded-2xl group hover:border-[#0082a1] hover:bg-white transition-all">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-[#0082a1] group-hover:bg-[#0082a1] group-hover:text-white transition-all">
                                                <item.icon size={18} />
                                            </div>
                                            <span className="text-sm font-black text-[#012b3f]">{item.name}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Holder & Links */}
                <div className="space-y-8">
                    {/* Policy Holder Info */}
                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8">
                        <h3 className="text-lg font-black text-[#012b3f] mb-8">Policy Holder</h3>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-[#012b3f] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">AW</div>
                            <div>
                                <p className="text-base font-black text-[#012b3f]">Alexander Wright</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Primary Insured</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Details</p>
                                <p className="text-sm font-bold text-[#012b3f]">alex.wright@enterprise.com</p>
                                <p className="text-xs text-slate-500 mt-1 font-medium">+1 (555) 902-1240</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Entity Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    <span className="text-sm font-black text-[#012b3f]">Verified (Class A)</span>
                                </div>
                            </div>
                        </div>
                        
                        <button className="w-full mt-10 py-4 bg-slate-50 text-[#012b3f] rounded-2xl text-[11px] font-black uppercase tracking-widest border border-slate-100 hover:bg-[#012b3f] hover:text-white transition-all">View Client Matrix</button>
                    </div>

                    {/* Quick Access Documents */}
                    <div className="bg-[#012b3f] rounded-[2rem] shadow-xl p-8 text-white relative overflow-hidden">
                        <div className="absolute bottom-[-10%] right-[-10%] opacity-10"><FileText size={100} /></div>
                        <h3 className="text-lg font-black mb-8 relative z-10">Policy Assets</h3>
                        <div className="space-y-4 relative z-10">
                            {[
                                { name: "Contract_Specs.pdf", size: "2.4 MB" },
                                { name: "Coverage_Matrix.xls", size: "1.1 MB" },
                                { name: "Security_Audit.pdf", size: "840 KB" },
                            ].map((doc, i) => (
                                <button key={i} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Paperclip size={16} className="text-[#0082a1]" />
                                        <div className="text-left">
                                            <p className="text-xs font-bold leading-none mb-1">{doc.name}</p>
                                            <p className="text-[9px] text-white/30 font-medium uppercase">{doc.size}</p>
                                        </div>
                                    </div>
                                    <Download size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetails;