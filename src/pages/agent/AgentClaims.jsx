import React, { useState, useEffect } from "react";
import { 
    Shield, Search, Filter, ArrowUpRight, 
    MoreHorizontal, Clock, CheckCircle2, XCircle,
    FileText, Download, Lock, Compass
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
            toast({ title: "Sync Error", description: "Could not retrieve claim data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filteredClaims = filterStatus === "All" 
        ? claims 
        : claims.filter(c => c.status === filterStatus);

    return (
        <div className="min-h-screen bg-[#dae5e5] p-8 md:p-12 font-display">
            {/* Header / Command Center */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#012b3f] mb-2 tracking-tight">Claim Management</h1>
                    <p className="text-slate-500 font-medium">Oversee and monitor active settlement requests across your portfolio.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search by Claim ID..." 
                            className="bg-white border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0082a1]/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="bg-[#0082a1] text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#012b3f] transition-all shadow-lg shadow-[#0082a1]/20">
                        <Download size={16} /> Export Data
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
                {["All", "Pending", "Approved", "Rejected"].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            filterStatus === status 
                            ? 'bg-[#012b3f] text-white shadow-xl shadow-[#012b3f]/20' 
                            : 'bg-white text-slate-400 hover:bg-slate-50 border border-white'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Claims Table Container */}
            <Reveal direction="up">
                <div className="bg-white rounded-[2rem] shadow-sm border border-white overflow-hidden mb-12">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Incident ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Client / Subject</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Date Filed</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    [1,2,3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="5" className="px-10 py-8"><div className="h-6 bg-slate-50 rounded-lg w-full" /></td>
                                        </tr>
                                    ))
                                ) : filteredClaims.length > 0 ? (
                                    filteredClaims.map((claim, i) => (
                                        <motion.tr 
                                            key={claim._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-10 py-8 font-black text-[#012b3f] text-sm">#{claim._id.slice(-8).toUpperCase()}</td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#dae5e5] text-[#0082a1] flex items-center justify-center text-xs font-black">
                                                        {claim.userId?.name?.split(' ').map(n=>n[0]).join('') || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#012b3f] text-sm">{claim.userId?.name || "Anonymous Client"}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{claim.policyId?.title || "Standard Coverage"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-xs font-bold text-slate-500">
                                                {new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                    claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                                    claim.status === 'Rejected' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                                    'bg-amber-50 text-amber-500 border-amber-100'
                                                }`}>
                                                    {claim.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-[#0082a1] hover:text-white transition-all">
                                                    <ArrowUpRight size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-32 text-center">
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                    <FileText size={40} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No claims found in this category</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>

            {/* Metadata Footer */}
            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2"><Lock size={12} className="text-[#0082a1]" /> Data Encryption Active</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-2"><Compass size={12} className="text-[#0082a1]" /> Node: Secure-Agt-01</span>
                </div>
                <div>Operational Status: Stable</div>
            </div>
        </div>
    );
};

export default AgentClaims;
