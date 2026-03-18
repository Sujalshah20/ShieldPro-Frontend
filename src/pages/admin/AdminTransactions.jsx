import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Activity, CheckCircle2, DollarSign, Globe, RefreshCcw, IndianRupee,
    Search, Filter, Mail, Phone, Calendar, ChevronRight, 
    ArrowUpRight, FileText, AlertCircle, Clock, Download,
    Terminal, Fingerprint, Lock, Shield, Cpu, Layers, MoreHorizontal, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";
import { TableSkeleton } from "../../components/common/Skeleton";

const AdminTransactions = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['adminTransactions', user?.token],
        queryFn: () => api.get('/admin/transactions', user.token),
        enabled: !!user?.token
    });

    const filteredTransactions = transactions?.filter(t => 
        t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header Module */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Fiscal_Integrity</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none text-wrap break-all">
                            Fiscal <span className="text-[#007ea7]">Ledger_</span>
                        </h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">
                            Continuous monitoring of all grid financial transmissions and asset liquidity movements.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[3px] italic">
                         <div className="flex flex-col items-end">
                            <span className="text-slate-300">STREAM_VOLUME</span>
                            <span className="text-2xl text-[#003249] tracking-tight">₹{(filteredTransactions?.reduce((acc, t) => acc + (t.amount || 0), 0) || 0).toLocaleString()}</span>
                         </div>
                         <div className="w-16 h-16 bg-[#003249] rounded-2xl flex items-center justify-center text-[#80ced7] shadow-3xl">
                             <Activity size={28} strokeWidth={3} />
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
                        placeholder="IDENTIFY TRANSMISSION BY ENTITY/ID..." 
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
                        <Download size={18} strokeWidth={3} /> EXPORT_AUDIT_LOG
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
                                <th className="px-10 py-10">TXN_SIG</th>
                                <th className="px-10 py-10">ENTITY_ORIGIN</th>
                                <th className="px-10 py-10">CHANNEL</th>
                                <th className="px-10 py-10">VAL_QUANTUM</th>
                                <th className="px-10 py-10 text-center">LIFECYLE</th>
                                <th className="px-10 py-10 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Decrypting Transaction Stream...</td></tr>
                            ) : filteredTransactions?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center opacity-30">
                                        <RefreshCcw size={60} className="mx-auto text-[#003249] animate-pulse mb-4" />
                                        <p className="text-[12px] font-black uppercase tracking-[8px]">No_Inbound_Transmissions</p>
                                    </td>
                                </tr>
                            ) : filteredTransactions?.map((t, i) => (
                                <tr key={t._id} className="group hover:bg-slate-50/50 transition-all duration-500 cursor-pointer">
                                    <td className="px-10 py-8">
                                        <span className="text-base font-black text-[#007ea7] tracking-tighter uppercase group-hover:translate-x-2 transition-transform inline-block">#{t._id.slice(-8).toUpperCase()}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] font-black text-lg shadow-xl border border-white/5">
                                                {t.user?.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-lg font-black text-[#003249] tracking-tighter italic leading-none group-hover:text-[#007ea7] transition-colors">{t.user?.name}</span>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1 italic">MEMBER_NODE</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                            <Globe size={14} className="text-[#007ea7]" />
                                            {t.method?.toUpperCase() || 'EXTERNAL'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-xl font-black text-[#003249] tracking-tighter">₹{t.amount?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <div className="inline-flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border-2 border-slate-50 group-hover:border-emerald-100 transition-all shadow-sm">
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[4px]">FINALIZED</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-300 hover:text-[#007ea7] rounded-xl transition-all border-2 border-slate-50 shadow-sm">
                                            <MoreHorizontal size={24} strokeWidth={3} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-slate-50 bg-slate-50/20 flex flex-wrap justify-center gap-12 text-[10px] font-black text-[#003249] uppercase tracking-[5px] opacity-30">
                    <div className="flex items-center gap-3"><Terminal size={14} /> Fiscal_Node: SYNCED</div>
                    <div className="flex items-center gap-3"><Fingerprint size={14} /> Transmission_Enc: AES-256</div>
                    <div className="flex items-center gap-3"><Zap size={14} /> Grid_Latency: 0.1ms</div>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;
