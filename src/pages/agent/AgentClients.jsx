import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Users, Mail, Phone, ExternalLink, FileText, 
    ShieldCheck, Search, Activity, Target, 
    Fingerprint, Globe, Command, Briefcase,
    ChevronRight, ArrowLeft, IndianRupee, Zap,
    Shield, Lock, Award, Terminal, X, Layers,
    Satellite, SearchCheck, RefreshCcw,
    Bell, Filter, Download, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AgentClients = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [applyingFor, setApplyingFor] = useState(null);
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: clients, isLoading } = useQuery({
        queryKey: ['agentClients', user?.token],
        queryFn: () => api.get('/agent/customers', user.token),
        enabled: !!user?.token
    });

    const { data: policies } = useQuery({
        queryKey: ['agentPoliciesSelect', user?.token],
        queryFn: () => api.get('/policies', user.token),
        enabled: !!applyingFor
    });

    const applyMutation = useMutation({
        mutationFn: (data) => api.post('/agent/apply-on-behalf', data, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['agentClients']);
            toast({ 
                title: "PROTOCOL_TRIGGERED", 
                description: "The asset protection sequence has been successfully initialized for the entity.",
                variant: "default"
            });
            setApplyingFor(null);
            setSelectedPolicy("");
        },
        onError: (err) => {
            toast({ 
                title: "INIT_FAILURE", 
                description: err?.errors?.[0]?.message || err?.message || "Operational anomaly detected during mainframe request.", 
                variant: "destructive" 
            });
        }
    });

    const handleApply = () => {
        if (!selectedPolicy) return toast({ 
            title: "PARAM_MISSING", 
            description: "Select a valid asset class before initialization.", 
            variant: "destructive" 
        });
        applyMutation.mutate({
            customerId: applyingFor._id,
            policyId: selectedPolicy,
            formData: { appliedBy: "FieldAgent", source: "Mainframe_Direct" }
        });
    };

    const filteredClients = clients?.filter(c => 
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[1,2,3].map(i => <div key={i} className="h-[450px] bg-slate-50 rounded-[3.5rem] border-2 border-slate-100 animate-pulse" />)}
             </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">Customer Database</h1>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {clients?.length || 0} TOTAL
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                    </button>
                    <div className="h-8 w-px bg-slate-200 mx-2" />
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-700 leading-none">Rajesh Kumar</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Senior Agent</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-white font-bold text-sm">
                            RK
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search customers by name, email, phone or..." 
                        className="w-full pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/50 transition-all text-sm font-medium text-slate-600 shadow-sm"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[180px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select className="w-full pl-11 pr-10 h-14 bg-white border border-slate-200 rounded-2xl outline-none appearance-none text-sm font-bold text-slate-600 cursor-pointer hover:border-slate-300 transition-all shadow-sm">
                            <option>Policy Type: All</option>
                            <option>Health</option>
                            <option>Vehicle</option>
                            <option>Life</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
                    </div>
                    <div className="relative min-w-[180px]">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select className="w-full pl-11 pr-10 h-14 bg-white border border-slate-200 rounded-2xl outline-none appearance-none text-sm font-bold text-slate-600 cursor-pointer hover:border-slate-300 transition-all shadow-sm">
                            <option>Status: Active</option>
                            <option>Inactive</option>
                            <option>Pending</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
                    </div>
                    <button className="h-14 px-6 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} /> Export
                    </button>
                </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto overflow-y-hidden no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="pl-10 pr-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer Name</th>
                                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</th>
                                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Policies</th>
                                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Total Premium (₹)</th>
                                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredClients?.map((client, idx) => (
                                <tr key={client._id} className="group hover:bg-slate-50/80 transition-all duration-300 cursor-pointer">
                                    <td className="pl-10 pr-6 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                                                <img src={`https://i.pravatar.cc/150?u=${client._id}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 leading-none group-hover:text-[#1e293b] transition-colors">{client.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">ID: {client._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                                                <Mail size={14} className="text-slate-400" /> {client.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                                                <Phone size={14} className="text-slate-400" /> {client.phone || '+91 98765 43210'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            {client.activePolicyCount || 0} active
                                        </span>
                                    </td>
                                    <td className="px-6 py-8 text-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">₹{((client.activePolicyCount || 1) * 25000).toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-teal-500 uppercase tracking-widest mt-1">Premium Paid</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-2 h-2 rounded-full ${client.isVerified ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                            <span className={`text-[11px] font-bold uppercase tracking-wider ${client.isVerified ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {client.isVerified ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="p-2 text-slate-300 hover:text-[#1e293b] hover:bg-slate-200/50 rounded-lg transition-all">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Showing 1 to {filteredClients?.length || 0} of {clients?.length || 0} customers
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-700 transition-all">
                            <ChevronRight className="rotate-180" size={16} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1e293b] text-white font-bold text-sm shadow-lg shadow-slate-900/20">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all">2</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all">3</button>
                        <span className="text-slate-400 mx-1">...</span>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all">125</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-700 transition-all">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Application Overlay Console */}
            <AnimatePresence>
                {applyingFor && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApplyingFor(null)} className="absolute inset-0 bg-[#003249]/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-2xl bg-white p-16 md:p-20 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden"
                        >
                            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#007ea7]/10 rounded-full blur-[120px] pointer-events-none" />
                            
                            <div className="flex items-center gap-10 mb-16 relative z-10 border-b-2 border-slate-50 pb-12">
                                <div className="w-20 h-20 bg-[#003249] rounded-[2rem] flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5 relative group overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                     <Zap size={36} strokeWidth={3} className="relative z-10 group-hover:rotate-12 transition-transform" fill="currentColor" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] leading-none mb-1 italic">Initiate Protocol</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] italic">Target_Entity: <span className="text-[#007ea7]">{applyingFor.name}</span></p>
                                </div>
                                <button onClick={() => setApplyingFor(null)} className="ml-auto p-6 bg-slate-50 hover:bg-rose-50 rounded-[2.5rem] transition-all group active:scale-95 border-2 border-transparent hover:border-rose-100">
                                    <X size={24} className="text-slate-300 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-500" strokeWidth={4} />
                                </button>
                            </div>

                            <div className="space-y-12 relative z-10">
                                <div className="space-y-6">
                                    <label className="text-[12px] font-black uppercase tracking-[10px] text-[#007ea7] ml-4 italic block leading-none">Asset Class Selection</label>
                                    <div className="relative group">
                                        <select 
                                            className="w-full h-20 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] pl-10 pr-16 font-black uppercase text-[12px] tracking-[5px] outline-none focus:border-[#007ea7] focus:bg-white shadow-inner transition-all appearance-none cursor-pointer text-[#003249] italic"
                                            value={selectedPolicy}
                                            onChange={(e) => setSelectedPolicy(e.target.value)}
                                        >
                                            <option value="">IDENTIFY_ASSET_CLASS...</option>
                                            {policies?.map(p => (
                                                <option key={p._id} value={p._id}>{p.policyName.toUpperCase()} (₹{p.premiumAmount?.toLocaleString()})</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronRight size={24} className="rotate-90 text-[#007ea7] animate-pulse" strokeWidth={4} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 bg-[#003249] text-white rounded-[3.5rem] border border-white/5 relative overflow-hidden group/warn shadow-3xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                    <p className="text-[11px] font-black uppercase tracking-[8px] text-[#80ced7] mb-6 flex items-center gap-4 italic leading-none">
                                        <Terminal size={18} strokeWidth={3} className="text-[#007ea7]" /> PROTOCOL_ADVISORY
                                    </p>
                                    <p className="text-[10px] leading-relaxed font-black text-white/30 uppercase tracking-[5px] italic">Direct field initialization will trigger the <span className="text-[#007ea7]">FIELD_OFFICE_SYNC</span> flag. All logs are globally audited.</p>
                                </div>

                                <div className="flex gap-8 pt-6">
                                    <button 
                                        onClick={() => setApplyingFor(null)} 
                                        className="h-20 px-12 bg-white border-2 border-slate-100 text-[#003249] rounded-[2.5rem] text-[12px] font-black uppercase tracking-[8px] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center active:scale-95 italic flex-1"
                                    >
                                        ABORT_OPS
                                    </button>
                                    <button 
                                        onClick={handleApply}
                                        disabled={applyMutation.isLoading}
                                        className="flex-[2] h-20 bg-[#003249] text-[#80ced7] rounded-[2.5rem] text-[13px] font-black uppercase tracking-[10px] shadow-3xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-6 italic disabled:opacity-50 group/btn"
                                    >
                                        <RefreshCcw size={24} strokeWidth={3} className={`${applyMutation.isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                                        {applyMutation.isLoading ? "SYNCING..." : "COMMIT_PROTOCOL"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Operational_Compliance_Verified
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Entity_Mapping_Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Globe size={20} strokeWidth={3} className="text-[#007ea7]" /> Sector: Global_Assets
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Uplink_Direct: AES-256
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentClients;
