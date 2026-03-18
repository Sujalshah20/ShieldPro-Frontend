import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Shield, Search, Plus, Edit, Trash2, 
    X, Globe, Zap, ShieldCheck, TrendingUp,
    ChevronDown, RefreshCcw, ChevronRight, SearchCheck, Satellite, IndianRupee, Terminal, Fingerprint,
    MoreHorizontal, CheckCircle2, AlertCircle, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminPolicies = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newPolicy, setNewPolicy] = useState({
        policyName: "",
        policyType: "Health",
        description: "",
        premiumAmount: "",
        coverageAmount: "",
        duration: "1 Year"
    });

    const { data: policies, isLoading } = useQuery({
        queryKey: ['adminPolicies', user?.token],
        queryFn: () => api.get('/policies', user.token),
        enabled: !!user?.token
    });

    const createMutation = useMutation({
        mutationFn: (data) => api.post('/policies', data, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "Protocol deployed successfully" });
            setIsModalOpen(false);
            setNewPolicy({ policyName: "", policyType: "Health", description: "", premiumAmount: "", coverageAmount: "", duration: "1 Year" });
        },
        onError: () => toast({ title: "Deployment failed", variant: "destructive" })
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/policies/${id}`, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "Protocol de-authorized" });
        }
    });

    const filteredPolicies = policies?.filter(p => 
        p.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.policyType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIcon = (type) => {
        switch(type) {
            case 'Health': return <Activity size={20} />;
            case 'Life': return <ShieldCheck size={20} />;
            case 'Vehicle': return <Zap size={20} />;
            case 'Home': return <Globe size={20} />;
            default: return <Shield size={20} />;
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
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Policy_Framework</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">
                            Policy <span className="text-[#007ea7]">Mainframe_</span>
                        </h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">
                            Configuration and deployment of insurance protocols for global grid asset protection.
                        </p>
                    </div>
                </Reveal>
                
                <Reveal direction="right">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="h-16 px-8 bg-[#003249] text-[#80ced7] rounded-2xl flex items-center gap-4 text-[11px] font-black uppercase tracking-[4px] hover:bg-[#007ea7] hover:text-white transition-all shadow-3xl active:scale-95 italic group"
                    >
                        <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> Initialize_New_Protocol
                    </button>
                </Reveal>
            </div>

            {/* Metrics Stripe */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Active_Protocols", val: policies?.length || 0, icon: ShieldCheck, color: "text-[#007ea7]" },
                    { label: "Deployment_Rate", val: "94.2%", icon: TrendingUp, color: "text-emerald-500" },
                    { label: "Grid_Sectors", val: "12", icon: Globe, color: "text-blue-500" },
                    { label: "Risk_Index", val: "Low", icon: Zap, color: "text-amber-500" }
                ].map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-6 rounded-2xl border-2 border-slate-50 flex items-center justify-between group hover:border-[#007ea7]/20 transition-all shadow-sm">
                            <div className="space-y-1">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{s.label}</span>
                                <p className="text-xl font-black text-[#003249] italic">{s.val}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                                <s.icon size={20} strokeWidth={2.5} />
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* List Module */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-4xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
                
                <div className="p-10 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-2xl border border-white/5">
                            <Layers size={28} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Protocol_Registry</h3>
                    </div>
                    <div className="relative group/search flex-1 max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-[#007ea7] transition-colors" size={18} strokeWidth={3} />
                        <input 
                            type="text" 
                            placeholder="FILTER PROTOCOLS..." 
                            className="h-14 w-full bg-white border-2 border-slate-50 rounded-2xl pl-16 pr-6 text-[10px] font-black uppercase tracking-[3px] text-[#003249] focus:border-[#007ea7] transition-all outline-none italic"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto relative z-10 font-mono italic">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">
                                <th className="px-10 py-10">TYPE_CODE</th>
                                <th className="px-10 py-10">PROTOCOL_DESCRIPTION</th>
                                <th className="px-10 py-10">MONTHLY_PREMIUM</th>
                                <th className="px-10 py-10">COVERAGE_CAP</th>
                                <th className="px-10 py-10 text-right">OPERATIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Inverting Grid Data...</td></tr>
                            ) : filteredPolicies?.map((policy) => (
                                <tr key={policy._id} className="group hover:bg-slate-50/50 transition-all duration-500">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-[#003249] rounded-xl flex items-center justify-center text-[#007ea7] shadow-xl group-hover:rotate-12 transition-transform">
                                                {getIcon(policy.policyType)}
                                            </div>
                                            <span className="text-base font-black text-[#003249] tracking-tighter uppercase">{policy.policyType}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1 max-w-xs">
                                            <span className="text-lg font-black text-[#007ea7] italic tracking-tight uppercase leading-none">{policy.policyName}</span>
                                            <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest truncate">{policy.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 bg-slate-50/30">
                                        <span className="text-xl font-black text-[#003249] tracking-tighter">₹{policy.premiumAmount?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-xl font-black text-emerald-500 tracking-tighter">₹{policy.coverageAmount?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-300 hover:text-[#007ea7] rounded-xl transition-all border-2 border-slate-50 shadow-sm">
                                                <Edit size={20} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => deleteMutation.mutate(policy._id)}
                                                className="w-12 h-12 flex items-center justify-center bg-white text-slate-300 hover:text-rose-500 rounded-xl transition-all border-2 border-slate-50 shadow-sm"
                                            >
                                                <Trash2 size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-slate-50 bg-slate-50/20 flex flex-wrap justify-center gap-12 text-[10px] font-black text-[#003249] uppercase tracking-[5px] opacity-30">
                    <div className="flex items-center gap-3"><Terminal size={14} /> Mainframe_Link: STABLE</div>
                    <div className="flex items-center gap-3"><Fingerprint size={14} /> Auth_Logs: ACTIVE</div>
                    <div className="flex items-center gap-3"><Satellite size={14} /> Grid_Frequency: 144MHz</div>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-xl bg-[#003249]/20">
                        <motion.div 
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-5xl border-2 border-white/20"
                        >
                            <div className="p-12 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-[#003249] flex items-center justify-center text-[#80ced7] border border-white/5 shadow-3xl">
                                        <Shield size={32} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Initialize_New_Protocol</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] italic mt-1">Status: Ready_to_Deploy</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#003249] hover:bg-rose-50 hover:text-rose-500 transition-all shadow-xl">
                                    <X size={24} strokeWidth={4} />
                                </button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newPolicy); }} className="p-12 space-y-8 font-mono italic">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Protocol_Identifier</label>
                                        <input 
                                            required
                                            className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[12px] font-bold text-[#003249] focus:bg-white focus:border-[#007ea7] outline-none transition-all"
                                            placeholder="UNIFIED HEALTH MAX"
                                            value={newPolicy.policyName}
                                            onChange={e => setNewPolicy({...newPolicy, policyName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Node_Classification</label>
                                        <select 
                                            className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 text-[12px] font-bold text-[#003249] focus:bg-white focus:border-[#007ea7] outline-none transition-all"
                                            value={newPolicy.policyType}
                                            onChange={e => setNewPolicy({...newPolicy, policyType: e.target.value})}
                                        >
                                            <option>Health</option>
                                            <option>Life</option>
                                            <option>Vehicle</option>
                                            <option>Home</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Operational_Manifest</label>
                                    <textarea 
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-6 text-[12px] font-bold text-[#003249] focus:bg-white focus:border-[#007ea7] outline-none transition-all h-32 resize-none"
                                        placeholder="Define protocol coverage parameters..."
                                        value={newPolicy.description}
                                        onChange={e => setNewPolicy({...newPolicy, description: e.target.value})}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Fiscal_Premium</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} strokeWidth={3} />
                                            <input 
                                                required
                                                type="number"
                                                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl pl-16 pr-6 text-[12px] font-bold text-[#003249] focus:bg-white focus:border-[#007ea7] outline-none transition-all"
                                                placeholder="999"
                                                value={newPolicy.premiumAmount}
                                                onChange={e => setNewPolicy({...newPolicy, premiumAmount: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Coverage_Cap</label>
                                        <div className="relative">
                                            <SearchCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} strokeWidth={3} />
                                            <input 
                                                required
                                                type="number"
                                                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl pl-16 pr-6 text-[12px] font-bold text-[#003249] focus:bg-white focus:border-[#007ea7] outline-none transition-all"
                                                placeholder="1000000"
                                                value={newPolicy.coverageAmount}
                                                onChange={e => setNewPolicy({...newPolicy, coverageAmount: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-[#003249] rounded-2xl flex flex-col md:flex-row items-center gap-10">
                                    <div className="flex-1 space-y-1 text-center md:text-left">
                                        <p className="text-[11px] font-black text-[#80ced7] uppercase tracking-[6px] leading-none mb-1">Final_Calibration</p>
                                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[2px] leading-relaxed italic">Verification status: AUTHORIZED_PENDING_DEPLOYMENT</p>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="h-14 px-12 bg-[#80ced7] text-[#003249] rounded-xl font-black uppercase tracking-[4px] text-[10px] hover:bg-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                    >
                                        {createMutation.isPending ? "Deploying..." : "Finalize & Deploy"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPolicies;