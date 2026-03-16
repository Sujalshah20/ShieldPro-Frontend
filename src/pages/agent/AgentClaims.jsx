import React, { useState, useEffect } from "react";
import { 
    Shield, Search, Filter, ArrowUpRight, 
    MoreHorizontal, Clock, CheckCircle2, XCircle,
    FileText, Download, Lock, Compass, Terminal, Layers, Fingerprint,
    Satellite, Award, Globe, Zap, SearchCheck, RefreshCcw, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/AuthContext";

const AgentClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const res = await api.get("/agent/claims", user?.token);
            setClaims(res.data);
        } catch (error) {
            toast({ 
                title: "SYNC_FAILURE", 
                description: "Could not retrieve claim data from settlement clusters.", 
                variant: "destructive" 
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredClaims = filterStatus === "All" 
        ? claims 
        : claims.filter(c => c.status === filterStatus);

    return (
        <div className="space-y-16 pb-20">
            {/* Header / Command Center */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Global_Settlement_Ledger</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Claim <span className="text-[#007ea7]">Protocols_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Oversee and monitor active settlement requests across your portfolio. Status: <span className="text-[#007ea7]">LIVE_FEED</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-wrap items-center gap-8">
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                            <input 
                                type="text" 
                                placeholder="IDENTIFY_INCIDENT..." 
                                className="bg-white border-2 border-slate-100 rounded-[1.5rem] py-5 pl-16 pr-8 text-[11px] font-black uppercase tracking-[5px] focus:outline-none focus:border-[#007ea7] focus:ring-8 focus:ring-[#007ea7]/5 transition-all shadow-inner w-full text-[#003249] italic placeholder:text-slate-200"
                            />
                             <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                                <Satellite size={16} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Filter Tabs & Export */}
            <Reveal direction="up" delay={0.2}>
                <div className="flex flex-col xl:flex-row items-center justify-between gap-10">
                    <div className="flex flex-wrap gap-5 w-full xl:w-auto">
                        {["All", "Pending", "Approved", "Rejected"].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[6px] transition-all border-2 italic relative overflow-hidden group/tab ${
                                    filterStatus === status 
                                    ? 'bg-[#003249] text-[#80ced7] border-[#003249] shadow-3xl' 
                                    : 'bg-white text-slate-400 border-slate-50 hover:border-[#007ea7]/30 hover:text-[#003249]'
                                }`}
                            >
                                <div className={`absolute bottom-0 left-0 h-1 bg-[#007ea7] transition-all duration-500 ${filterStatus === status ? 'w-full' : 'w-0'}`} />
                                {status.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    
                    <button className="h-16 px-10 bg-white border-2 border-slate-100 text-[#003249] rounded-2xl text-[11px] font-black uppercase tracking-[5px] shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center justify-center gap-5 active:scale-95 italic group w-full md:w-auto">
                        <Download size={20} className="text-[#007ea7] group-hover:rotate-12 transition-transform" strokeWidth={3} /> EXPORT_SETTLEMENT_LOG
                    </button>
                </div>
            </Reveal>

            {/* Claims Table Container */}
            <Reveal direction="up" delay={0.4}>
                <div className="saas-card !p-0 overflow-hidden shadow-3xl border-2 border-slate-50">
                    <div className="p-12 border-b-2 border-slate-50 bg-slate-50/20 flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative">
                         {/* Tactical Background */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                <Terminal size={36} strokeWidth={2.5} className="animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Settlement Matrix</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Global disbursement protocols and vetting logs</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-6 bg-slate-50 px-10 py-4 rounded-xl border-2 border-slate-50 shadow-inner overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#007ea7]/5 to-transparent animate-shimmer" />
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
                            <span className="text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic relative z-10">SETTLEMENT_ENGINE_V4.2_ONLINE</span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="bg-[#003249] text-white">
                                <tr className="text-[10px] font-black uppercase tracking-[5px] italic border-b border-white/5">
                                    <th className="px-12 py-10 border-r border-white/5">INCIDENT_ID</th>
                                    <th className="px-12 py-10 border-r border-white/5">CLIENT_IDENTITY</th>
                                    <th className="px-12 py-10 border-r border-white/5">TIMESTAMP_FILED</th>
                                    <th className="px-12 py-10 text-center border-r border-white/5">LIFECYCLE_STATUS</th>
                                    <th className="px-12 py-10 text-right">COMMAND</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 italic">
                                {loading ? (
                                    [1,2,3,4].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="5" className="px-12 py-12"><div className="h-16 bg-slate-50 rounded-2xl w-full" /></td>
                                        </tr>
                                    ))
                                ) : filteredClaims.length > 0 ? (
                                    filteredClaims.map((claim, i) => (
                                        <tr key={claim._id} className="hover:bg-slate-50/50 transition-all duration-500 group cursor-pointer">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-4 group/id">
                                                    <div className="w-1.5 h-10 bg-[#007ea7] rounded-full group-hover:h-12 transition-all duration-500" />
                                                    <span className="text-xl font-black text-[#003249] italic tracking-tighter group-hover:text-[#007ea7] transition-colors uppercase leading-none">#{claim._id.slice(-8)}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#003249] text-[#007ea7] flex items-center justify-center text-2xl font-black shadow-3xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 border-2 border-white relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                                        {claim.userId?.name?.charAt(0) || "U"}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="font-black text-[#003249] text-xl leading-none uppercase tracking-tighter group-hover:text-[#007ea7] transition-colors">{claim.userId?.name || "Anonymous Client"}</p>
                                                        <div className="flex items-center gap-3 opacity-40">
                                                            <Shield size={14} strokeWidth={3} className="text-[#007ea7]" />
                                                            <span className="text-[10px] font-black uppercase tracking-[3px] leading-none">{claim.policyId?.title || "Standard Coverage"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                 <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-50 w-fit group-hover:bg-white group-hover:border-[#007ea7]/30 transition-all shadow-sm">
                                                    <Clock size={16} className="text-[#007ea7]" strokeWidth={3} />
                                                    <span className="text-[11px] font-black text-[#003249] uppercase tracking-[5px] leading-none">
                                                        {new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                                    </span>
                                                 </div>
                                            </td>
                                            <td className="px-12 py-10 text-center">
                                                <div className="flex justify-center">
                                                    <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[4px] border-2 shadow-xl italic flex items-center gap-4 ${
                                                        claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-50 shadow-emerald-500/10' :
                                                        claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-50 shadow-rose-500/10' :
                                                        'bg-amber-50 text-amber-600 border-amber-50 shadow-amber-500/10'
                                                    }`}>
                                                        <div className={`w-2.5 h-2.5 rounded-full ${
                                                            claim.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' :
                                                            claim.status === 'Rejected' ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' :
                                                            'bg-amber-500 animate-pulse'
                                                        }`} />
                                                        {claim.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <button className="h-16 w-16 bg-white border-2 border-slate-100 text-[#003249] rounded-2xl shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center justify-center active:scale-95 group/btn">
                                                    <ArrowUpRight size={24} strokeWidth={4} className="group-hover/btn:rotate-45 transition-transform duration-500" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-12 py-40 text-center">
                                             <Compass size={64} className="mx-auto mb-8 opacity-5 text-[#003249] animate-spin-slow" strokeWidth={1} />
                                             <p className="text-[12px] font-black uppercase tracking-[8px] text-slate-300 italic">No active signal identified in settlement quadrant</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>

            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Agent_ID: {user?.id?.slice(-8).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Settlement_Sync_Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Shield size={20} strokeWidth={3} className="text-[#007ea7]" /> Encryption: AES-256
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Mainframe_Ping: 1.2ms
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentClaims;
