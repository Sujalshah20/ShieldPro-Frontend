import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { 
    Shield, Activity, Zap, Globe, FileText, 
    ChevronRight, ChevronLeft, ArrowRight, Clock, CheckCircle2,
    Calendar, IndianRupee, Satellite, Fingerprint, Lock, Terminal,
    ShieldCheck, Edit, Trash2, ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const PolicyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: policy, isLoading } = useQuery({
        queryKey: ['policyDetails', id],
        queryFn: () => api.get(`/policies/${id}`)
    });

    const coverageItems = [
        { name: "Fire and Lightning", description: "Coverage for damage caused by fire, smoke, and lightning strikes.", icon: Zap },
        { name: "Theft and Burglary", description: "Protection against loss due to illegal entry and property theft.", icon: Lock },
        { name: "Natural Calamities", description: "Coverage for earthquakes, floods, and other natural events.", icon: Globe },
        { name: "Third Party Liability", description: "Protection against legal liabilities to third parties.", icon: ShieldCheck },
    ];

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading details...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <Link to="/admin" className="hover:text-blue-500 transition-colors">Home</Link>
                <ChevronRight size={14} />
                <Link to="/admin/policies" className="hover:text-blue-500 transition-colors">Policies</Link>
                <ChevronRight size={14} />
                <span className="text-slate-800">Details</span>
            </nav>

            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-2">
                             <button 
                                onClick={() => navigate(-1)}
                                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 italic">
                                {policy?.policyType}
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{policy?.policyName}</h1>
                        <p className="text-xs font-medium text-slate-400">Configuration and coverage parameters for this insurance plan</p>
                    </div>
                </Reveal>
                
                <div className="flex items-center gap-4">
                    <button className="h-12 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <Edit size={18} /> Edit Plan
                    </button>
                    <button className="h-12 px-6 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-rose-100 transition-all shadow-sm">
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </div>

            {/* Core Stats Module */}
            <div className="grid lg:grid-cols-3 gap-8">
                <Reveal direction="up" className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col gap-10 h-full">
                        <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Financial Blueprint</h3>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Premium and coverage breakdown</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-12">
                            {[
                                { label: "Monthly Premium", val: `₹${policy?.premiumAmount?.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
                                { label: "Max Coverage", val: `₹${policy?.coverageAmount?.toLocaleString()}`, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "Policy Term", val: "12 Months", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                                { label: "Target Audience", val: "Residential", icon: Globe, color: "text-indigo-600", bg: "bg-indigo-50" }
                            ].map((d, i) => (
                                <div key={i} className="flex items-center gap-6 group">
                                    <div className={`w-12 h-12 ${d.bg} ${d.color} rounded-xl flex items-center justify-center shadow-sm border border-black/5 group-hover:scale-110 transition-transform`}>
                                        <d.icon size={22} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{d.label}</span>
                                        <span className="text-xl font-black text-slate-800 tracking-tight">{d.val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 italic">Plan Description</h4>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                "{policy?.description}"
                            </p>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="bg-[#1a2332] rounded-2xl p-8 text-white flex flex-col justify-between h-full relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                            <Zap size={200} />
                        </div>
                        
                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-1 h-8 bg-blue-500 rounded-full" />
                                <h3 className="text-2xl font-black tracking-tight uppercase italic leading-none">Security<br />Protocol</h3>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <span>Risk Scrutiny</span>
                                        <span className="text-emerald-400 font-black italic">Verified</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-full" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <span>Market Viability</span>
                                        <span className="text-blue-400 font-black italic">High</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[85%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-10">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
                                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                    <CheckCircle2 size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active Status</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">This plan is currently live and available for purchase by customers across all enabled regions.</p>
                            </div>
                            <button className="w-full h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40">
                                <Zap size={18} /> Update Deployment
                            </button>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Coverage Grid */}
            <Reveal direction="up" delay={0.2}>
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800 shadow-inner border border-slate-100">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-slate-800 tracking-tight">Coverage Clauses</h4>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Specific protection layers included</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coverageItems.map((item, i) => (
                            <div key={i} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-4 border border-slate-100 group-hover:scale-110 transition-transform">
                                    <item.icon size={20} />
                                </div>
                                <h5 className="font-bold text-slate-800 text-xs mb-2">{item.name}</h5>
                                <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default PolicyDetails;
ils;