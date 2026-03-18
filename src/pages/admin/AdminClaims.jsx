import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    AlertCircle, Shield, Clock, CheckCircle2, XCircle, Search, Filter,
    ChevronDown, RefreshCcw, ChevronRight, SearchCheck, Satellite, IndianRupee,
    Terminal, Fingerprint, Lock, ShieldCheck, Activity, TrendingUp, MoreHorizontal,
    Briefcase, FileText, Download, User, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";
import { TableSkeleton } from "../../components/common/Skeleton";

const AdminClaims = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: claims, isLoading } = useQuery({
        queryKey: ['adminClaims', user?.token],
        queryFn: () => api.get('/admin/claims', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/admin/claims/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminClaims']);
            toast({ title: "Signal state updated" });
        }
    });

    const filteredClaims = claims?.filter(c => 
        c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.policy?.policyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header Module */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Incident_Control</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">
                            Incident <span className="text-[#007ea7]">Response_</span>
                        </h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">
                            Processing and adjudication of protection claims across all authorized grid sectors.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-4">
                        <div className="h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center gap-6 shadow-inner italic font-black">
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Global_Claims</span>
                                <span className="text-2xl text-[#003249] tracking-tight">{claims?.length || 0}</span>
                            </div>
                            <AlertCircle size={28} className="text-[#007ea7]" />
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Tactical Search Module */}
            <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-3xl flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" size={20} strokeWidth={3} />
                    <input 
                        type="text" 
                        placeholder="IDENTIFY INCIDENT BY CLIENT/POLICY..." 
                        className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-[3px] text-[#003249] focus:bg-white focus:border-[#007ea7] transition-all outline-none italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="h-14 px-8 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-[#003249] hover:bg-slate-50 transition-all italic flex items-center gap-3">
                        <Filter size={18} strokeWidth={3} /> Filter_Group
                    </button>
                    <button className="h-14 px-8 bg-[#003249] text-[#80ced7] rounded-2xl text-[10px] font-black uppercase tracking-[3px] hover:bg-[#007ea7] transition-all italic flex items-center gap-3">
                        <Download size={18} strokeWidth={3} /> EXPORT_SIGNAL_LOG
                    </button>
                </div>
            </div>

            {/* List Module */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-4xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
                
                <div className="overflow-x-auto relative z-10 font-mono italic">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">
                                <th className="px-10 py-10">INCIDENT_ID</th>
                                <th className="px-10 py-10">ENTITY_ORIGIN</th>
                                <th className="px-10 py-10">PROTOCOL_REF</th>
                                <th className="px-10 py-10">FISCAL_MAGNITUDE</th>
                                <th className="px-10 py-10 text-center">LIFECYLE</th>
                                <th className="px-10 py-10 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Scanning Transmission Logs...</td></tr>
                            ) : filteredClaims?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center opacity-30">
                                        <Satellite size={60} className="mx-auto text-[#003249] animate-pulse mb-4" />
                                        <p className="text-[12px] font-black uppercase tracking-[8px]">No_Inbound_Signal_Detected</p>
                                    </td>
                                </tr>
                            ) : filteredClaims?.map((c, i) => (
                                <tr key={c._id} className="group hover:bg-slate-50/50 transition-all duration-500 cursor-pointer">
                                    <td className="px-10 py-8">
                                        <span className="text-base font-black text-[#007ea7] tracking-tighter uppercase group-hover:translate-x-2 transition-transform inline-block">#{c._id.slice(-6).toUpperCase()}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] font-black text-lg shadow-xl border border-white/5">
                                                {c.user?.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-lg font-black text-[#003249] tracking-tighter italic leading-none group-hover:text-[#007ea7] transition-colors">{c.user?.name}</span>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1 italic">{c.user?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-[12px] font-black text-[#003249] uppercase tracking-tighter italic">
                                        {c.policy?.policyName}
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-xl font-black text-[#003249] tracking-tighter">₹{c.claimAmount?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <div className="inline-flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border-2 border-slate-50 group-hover:border-[#007ea7]/20 transition-all shadow-sm">
                                            <div className={`w-2.5 h-2.5 rounded-full ${c.status === 'Approved' ? 'bg-emerald-500' : c.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-[4px] ${getStatusStyle(c.status).split(' ')[1]}`}>{c.status.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: c._id, status: 'Approved' })}
                                                className="w-12 h-12 flex items-center justify-center bg-white text-slate-300 hover:text-emerald-500 rounded-xl transition-all border-2 border-slate-50 shadow-sm"
                                            >
                                                <CheckCircle2 size={20} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: c._id, status: 'Rejected' })}
                                                className="w-12 h-12 flex items-center justify-center bg-white text-slate-300 hover:text-rose-500 rounded-xl transition-all border-2 border-slate-50 shadow-sm"
                                            >
                                                <XCircle size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-slate-50 bg-slate-50/20 flex flex-wrap justify-center gap-12 text-[10px] font-black text-[#003249] uppercase tracking-[5px] opacity-30 font-mono">
                    <div className="flex items-center gap-3"><Clock size={14} /> ADJUDICATION_LATENCY: 1.4h</div>
                    <div className="flex items-center gap-3"><Activity size={14} /> GRID_RISK: LOW</div>
                    <div className="flex items-center gap-3"><Shield size={14} /> SECURITY_OVERRIDE: INACTIVE</div>
                </div>
            </div>
        </div>
    );
};

export default AdminClaims;