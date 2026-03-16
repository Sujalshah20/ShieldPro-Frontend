import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Users, UserPlus, ShieldCheck, ShieldAlert, 
    TrendingUp, Mail, Phone, MapPin, 
    X, CheckCircle, AlertCircle, IndianRupee,
    Briefcase, Fingerprint, Zap, Shield, Search,
    Target, Cpu, Satellite, Lock, Activity,
    User, ShieldCheck as ShieldIcon, UserCheck as AgentIcon,
    ChevronDown, Globe, Command, Terminal, Layers,
    RefreshCcw, ChevronRight, Layout, SearchCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminUsers = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("agents"); // agents or reassignment
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: agents, isLoading: agentsLoading } = useQuery({
        queryKey: ['adminAgents', user?.token],
        queryFn: () => api.get('/admin/agents', user.token),
        enabled: !!user?.token
    });

    const { data: customers, isLoading: customersLoading } = useQuery({
        queryKey: ['adminCustomers', user?.token],
        queryFn: () => api.get('/admin/customers', user.token),
        enabled: !!user?.token && activeTab === 'reassignment'
    });

    const queryClient = useQueryClient();
    const [isAddingAgent, setIsAddingAgent] = useState(false);
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", phone: "", 
        dob: "", gender: "Male", address: "", commissionRate: 10
    });

    const createMutation = useMutation({
        mutationFn: (data) => api.post('/admin/agents', data, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminAgents']);
            toast({ 
                title: "OPERATIVE_ENLISTED", 
                description: "New agent profile has been successfully integrated into the system.",
                variant: "default"
            });
            setIsAddingAgent(false);
            setFormData({ name: "", email: "", password: "", phone: "", dob: "", gender: "Male", address: "", commissionRate: 10 });
        },
        onError: (err) => toast({ 
            title: "ENLISTMENT_FAILED", 
            description: err?.errors?.[0]?.message || err?.message || "An error occurred during registration sequence.", 
            variant: "destructive" 
        })
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/admin/agents/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['adminAgents']);
            toast({ 
                title: "PROTOCOL_SYNCHRONIZED", 
                description: `Agent status updated to: ${variables.status.toUpperCase()}` 
            });
        },
        onError: (err) => {
            toast({
                title: "SYNC_ERROR",
                description: err?.message || "Failed to update operator status.",
                variant: "destructive"
            });
        }
    });

    const reassignMutation = useMutation({
        mutationFn: (data) => api.put(`/admin/customers/${data.customerId}/reassign`, { agentId: data.agentId }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminCustomers']);
            toast({ 
                title: "ASSET_REASSIGNED", 
                description: "Customer portfolio has been successfully transferred to the new coordinator."
            });
            setSelectedCustomer(null);
        },
        onError: (err) => {
            toast({
                title: "TRANSFER_FAILED",
                description: err?.message || "Failed to reassign portfolio.",
                variant: "destructive"
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const totalPortfolio = agents?.reduce((acc, curr) => acc + (curr.stats?.earnings || 0), 0) || 0;

    const filteredAgents = agents?.filter(agent => 
        agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCustomers = customers?.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statsCards = [
        { label: "Active_Operators", value: agents?.filter(a => a.status === 'active').length, icon: ShieldCheck, tag: "NODE_STRENGTH" },
        { label: "Protected_Assets", value: agents?.reduce((acc, curr) => acc + (curr.stats?.customers || 0), 0), icon: Globe, tag: "GLOBAL_GRID" },
        { label: "Network_Vitality", value: "99.8%", icon: Activity, tag: "SYNC_NOMINAL" },
        { label: "Asset_Volume", value: `₹${(totalPortfolio / 1000).toFixed(1)}k`, icon: IndianRupee, tag: "LIQUID_VAL" }
    ];

    if (agentsLoading) return (
        <div className="py-20 space-y-12">
             <div className="h-16 w-80 bg-slate-100 animate-pulse rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-50 rounded-[2.5rem] animate-pulse border-2 border-slate-100" />)}
             </div>
             <div className="h-[600px] bg-slate-50 rounded-[3rem] animate-pulse border-2 border-slate-100" />
        </div>
    );

    return (
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Global_Directory_Management</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Operative <span className="text-[#007ea7]">Grid_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">System-wide coordinator management and asset distribution console. Total Nodes Offline: <span className="text-rose-500">ZERO</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border-2 border-slate-50 shadow-inner group">
                            <button 
                                onClick={() => setActiveTab('agents')}
                                className={`px-12 h-14 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[5px] transition-all duration-500 italic flex items-center gap-3 ${activeTab === 'agents' ? 'bg-[#003249] text-[#80ced7] shadow-3xl scale-105' : 'text-slate-300 hover:text-[#003249]'}`}
                            >
                                <Users size={16} strokeWidth={3} /> Operatives
                            </button>
                            <button 
                                onClick={() => setActiveTab('reassignment')}
                                className={`px-12 h-14 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[5px] transition-all duration-500 italic flex items-center gap-3 ${activeTab === 'reassignment' ? 'bg-[#003249] text-[#80ced7] shadow-3xl scale-105' : 'text-slate-300 hover:text-[#003249]'}`}
                            >
                                <Layers size={16} strokeWidth={3} /> Entity_Map
                            </button>
                        </div>
                        {activeTab === 'agents' && (
                            <button 
                                onClick={() => setIsAddingAgent(true)}
                                className="h-18 px-10 bg-[#003249] text-[#80ced7] rounded-[2rem] flex items-center gap-5 text-[11px] font-black uppercase tracking-[5px] hover:bg-[#007ea7] hover:text-white transition-all shadow-3xl active:scale-95 italic group"
                            >
                                <UserPlus size={22} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> Enlist_Operative
                            </button>
                        )}
                    </div>
                </Reveal>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statsCards.map((stat, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="saas-card group relative p-10 border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[260px] flex flex-col justify-between overflow-hidden">
                             {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <stat.icon size={120} className="text-[#003249]" />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${i === 0 ? 'bg-[#003249] text-[#007ea7] shadow-3xl border border-white/5 group-hover:rotate-12' : 'bg-slate-50 text-slate-300 border-2 border-slate-100 group-hover:bg-[#003249] group-hover:text-[#007ea7]'}`}>
                                    <stat.icon size={28} strokeWidth={3} />
                                </div>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[5px] italic">{stat.tag}</span>
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[6px] mb-4 italic flex items-center gap-3">
                                    <Terminal size={12} className="text-[#007ea7]" /> {stat.label}
                                </p>
                                <h2 className="text-5xl font-black text-[#003249] tracking-tighter italic uppercase group-hover:text-[#007ea7] transition-colors">{stat.value}</h2>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Tactical Toolbar */}
            <Reveal direction="up">
                <div className="flex flex-wrap items-center justify-between gap-8 border-b-2 border-slate-50 pb-12 relative z-10">
                    <div className="relative group w-full max-w-xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                        <input 
                            type="text" 
                            placeholder={`IDENTIFY_${activeTab === 'agents' ? 'OPERATOR' : 'ENTITY'}_NODE_ID...`} 
                            className="pl-16 pr-10 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] outline-none w-full transition-all font-black text-[11px] uppercase tracking-[4px] text-[#003249] shadow-inner focus:border-[#007ea7] focus:ring-8 focus:ring-[#007ea7]/5 placeholder:text-slate-200 italic" 
                            value={searchQuery} 
                            onChange={e=>setSearchQuery(e.target.value)} 
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 flex items-center gap-3">
                            <span className="text-[10px] font-black tracking-widest italic uppercase">Sync_Active</span>
                            <RefreshCcw size={14} className="animate-spin" />
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-8 px-10 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.8rem] shadow-inner">
                        <div className="flex items-center gap-4">
                            <Lock size={18} className="text-[#007ea7]" strokeWidth={3} />
                            <span className="text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic leading-none">SECURE_CORE_ACTIVE</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex items-center gap-4 opacity-40">
                             <Satellite size={16} />
                             <span className="text-[8px] font-black tracking-widest">SIGNAL_STRENGTH: 99%</span>
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* Registry Manifest */}
            <Reveal direction="up">
                {activeTab === 'agents' ? (
                    <div className="saas-card !p-0 overflow-hidden shadow-3xl border-2 border-slate-50">
                        <div className="p-12 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/20 relative">
                             {/* Decorative Grid */}
                             <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
                             
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                    <Terminal size={36} strokeWidth={2.5} className="animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Operator Registry</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Complete manifest of all authorized grid nodes</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                                <span className="text-[11px] font-black text-white uppercase tracking-[5px] italic bg-[#003249] px-10 h-14 flex items-center rounded-2xl shadow-2xl skew-x-[-10deg]">
                                    <span className="skew-x-[10deg]">{filteredAgents?.length || 0} ACTIVE_NODES</span>
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto relative z-10">
                            <table className="w-full text-left">
                                <thead className="bg-[#003249] text-white">
                                    <tr className="text-[10px] font-black uppercase tracking-[5px] italic border-b border-white/5">
                                        <th className="px-12 py-10 border-r border-white/5">NODE_IDENTITY</th>
                                        <th className="px-12 py-10 text-center border-r border-white/5">PORTFOLIO_METRICS</th>
                                        <th className="px-12 py-10 border-r border-white/5">YIELD_RANKING</th>
                                        <th className="px-12 py-10 text-center border-r border-white/5">SYNC_HEALTH</th>
                                        <th className="px-12 py-10">COMMANDS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 italic">
                                    {filteredAgents?.map((agent, idx) => (
                                        <tr key={agent._id} className="hover:bg-slate-50/50 transition-all duration-500 group">
                                            <td className="px-12 py-12">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-20 h-20 bg-[#003249] rounded-[1.8rem] flex items-center justify-center font-black text-white text-3xl shadow-3xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 border-2 border-white relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                                        <span className="relative z-10">{agent.name.charAt(0)}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xl font-black text-[#003249] leading-none uppercase tracking-tighter group-hover:text-[#007ea7] transition-colors">{agent.name}</p>
                                                        <div className="flex items-center gap-3 opacity-40">
                                                            <Fingerprint size={14} strokeWidth={3} className="text-[#007ea7]" />
                                                            <span className="text-[10px] font-black lowercase tracking-[3px] leading-none">{agent.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-12 text-center">
                                                <div className="flex flex-col gap-3 items-center">
                                                    <div className="flex items-center gap-3">
                                                       <Users size={18} className="text-[#007ea7]" strokeWidth={3} />
                                                       <span className="text-xl font-black text-[#003249] uppercase tracking-tighter leading-none">{agent.stats?.customers} Entities</span>
                                                    </div>
                                                    <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[5px] italic leading-none bg-emerald-50 px-5 py-2 rounded-xl shadow-lg border border-emerald-100">₹{(agent.stats?.earnings/1000).toFixed(1)}k Vol</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-12">
                                                <div className="flex flex-col gap-4 max-w-[200px]">
                                                    <div className="flex items-center justify-between text-[9px] font-black text-[#007ea7] uppercase tracking-[5px] italic">
                                                        <span>PROTOCOL_YIELD</span>
                                                        <span className="text-xl tracking-tighter text-[#003249]">{agent.commissionRate}%</span>
                                                    </div>
                                                    <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border-2 border-slate-100 shadow-inner p-1">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${agent.commissionRate}%` }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            className="h-full bg-[#007ea7] rounded-full shadow-[0_0_15px_#007ea7] relative" 
                                                        >
                                                            <div className="absolute top-0 right-0 w-2 h-full bg-white/30 animate-pulse" />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-12">
                                                <div className="flex justify-center">
                                                    <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[4px] flex items-center gap-4 border-2 shadow-xl italic ${
                                                        agent.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-50 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 border-rose-50 shadow-rose-500/10'
                                                    }`}>
                                                        <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]' : 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'}`} />
                                                        {agent.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-12 text-right">
                                                <button 
                                                    onClick={() => statusMutation.mutate({ id: agent._id, status: agent.status === 'active' ? 'suspended' : 'active' })}
                                                    className={`h-16 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[5px] transition-all duration-500 italic shadow-2xl active:scale-95 flex items-center justify-center gap-4 group/btn ${
                                                        agent.status === 'active' ? 'bg-white text-rose-500 border-2 border-rose-50 hover:bg-rose-500 hover:text-white' : 'bg-[#007ea7] text-white hover:bg-[#003249]'
                                                    }`}
                                                >
                                                    {agent.status === 'active' ? (
                                                        <>TERMINATE_LINK <ShieldAlert size={18} strokeWidth={3} className="group-hover/btn:rotate-12 transition-transform" /></>
                                                    ) : (
                                                        <>AUTHORIZE_NODE <ShieldCheck size={18} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" /></>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-10 bg-[#f8fafb] border-t-2 border-slate-50 flex justify-center">
                             <button className="text-[11px] font-black text-slate-400 uppercase tracking-[6px] italic hover:text-[#003249] flex items-center gap-4 group transition-all">
                                FETCH_LEGACY_ARCHIVES <ChevronRight size={18} strokeWidth={4} className="group-hover:translate-x-3 transition-transform" />
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="saas-card !p-0 overflow-hidden shadow-3xl border-2 border-slate-50">
                        <div className="p-12 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/20 relative">
                             {/* Tactical Background */}
                             <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
                             
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                    <Layers size={36} strokeWidth={2.5} className="animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Entity Coordination</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] italic opacity-60">Asset distribution and operative mapping</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                                <span className="text-[11px] font-black text-white uppercase tracking-[5px] italic bg-[#003249] px-10 h-14 flex items-center rounded-2xl shadow-2xl skew-x-[-10deg]">
                                    <span className="skew-x-[10deg]">{filteredCustomers?.length || 0} PROTECTED_ENTITIES</span>
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto relative z-10">
                            <table className="w-full text-left">
                                <thead className="bg-[#003249] text-white">
                                    <tr className="text-[10px] font-black uppercase tracking-[5px] italic border-b border-white/5">
                                        <th className="px-12 py-10 border-r border-white/5">ENTITY_SIGNATURE</th>
                                        <th className="px-12 py-10 border-r border-white/5">COORD_ASSIGNMENT</th>
                                        <th className="px-12 py-10 text-center border-r border-white/5">UPLINK_STATUS</th>
                                        <th className="px-12 py-10">COMMANDS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 italic">
                                    {filteredCustomers?.map((customer, idx) => (
                                        <tr key={customer._id} className="hover:bg-slate-50/50 transition-all duration-500 group">
                                            <td className="px-12 py-12">
                                                <div className="flex flex-col gap-3">
                                                    <span className="text-xl font-black text-[#003249] uppercase tracking-tighter group-hover:text-[#003249] transition-colors group-hover:translate-x-2 transition-transform inline-block italic">{customer.name}</span>
                                                    <div className="flex items-center gap-4 opacity-40">
                                                        <Fingerprint size={14} strokeWidth={3} className="text-[#007ea7]" />
                                                        <span className="text-[10px] font-black lowercase tracking-[3px] leading-none">{customer.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-12">
                                                {customer.assignedAgent ? (
                                                    <div className="flex items-center gap-6 group/agent bg-slate-50/50 p-4 rounded-3xl border-2 border-transparent hover:border-[#007ea7]/20 hover:bg-white transition-all w-fit shadow-sm">
                                                        <div className="w-16 h-16 bg-[#003249] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover/agent:rotate-12 transition-transform border-2 border-white">
                                                            {customer.assignedAgent.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-lg font-black text-[#003249] uppercase tracking-tighter leading-none italic mb-1">{customer.assignedAgent.name}</span>
                                                            <span className="text-[9px] font-black text-[#007ea7] uppercase tracking-[4px] italic opacity-60">PRIMARY_COORD</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="px-10 py-4 bg-rose-50 text-rose-500 border-2 border-rose-50 shadow-lg shadow-rose-500/10 rounded-2xl text-[10px] font-black uppercase tracking-[5px] italic flex items-center gap-4 animate-pulse">
                                                        <ShieldAlert size={18} strokeWidth={3} /> UNASSIGNED_ENTITY
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-12 py-12 text-center">
                                                <span className="px-10 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic shadow-inner">
                                                    {customer.status || 'ACTIVE_SYNC'}
                                                </span>
                                            </td>
                                            <td className="px-12 py-12 text-right">
                                                <button 
                                                    onClick={() => setSelectedCustomer(customer)}
                                                    className="h-16 px-10 bg-white border-2 border-slate-100 text-[#003249] text-[10px] font-black uppercase tracking-[5px] rounded-2xl shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center justify-center gap-5 float-right active:scale-95 italic group/btn"
                                                >
                                                    MIGRATION_MAP <Command size={18} strokeWidth={3} className="group-hover/btn:rotate-45 transition-transform" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Reveal>

            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic">
                        <Fingerprint size={18} strokeWidth={3} className="text-[#007ea7]" /> Operative_Logs_Verified
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic">
                        <Layers size={18} strokeWidth={3} className="text-[#007ea7]" /> Global_Coord_Mapping
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic">
                        <Zap size={18} strokeWidth={3} className="text-[#007ea7]" /> Response_Delta: 06ms
                    </div>
                </div>
            </Reveal>

            {/* Reassignment Modal */}
            <AnimatePresence>
                {selectedCustomer && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-[#003249]/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-3xl bg-white p-16 md:p-24 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
                        >
                            {/* Decorative Background Mesh */}
                            <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_#007ea710_0%,_transparent_50%)] pointer-events-none" />

                            <div className="mb-20 text-center relative z-10">
                                <div className="w-28 h-28 bg-[#003249] rounded-[3rem] flex items-center justify-center text-[#007ea7] mx-auto mb-12 shadow-[0_30px_60px_-15px_rgba(0,50,73,0.4)] relative overflow-hidden group border-2 border-white/5">
                                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                     <AgentIcon size={54} strokeWidth={3} className="relative z-10 group-hover:rotate-12 transition-transform duration-700" />
                                </div>
                                <h3 className="text-5xl font-black text-[#003249] uppercase tracking-tighter italic leading-none mb-6">Entity Migration</h3>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="h-0.5 w-12 bg-slate-100" />
                                    <p className="text-[12px] text-slate-400 font-black uppercase tracking-[6px] italic">Target: <span className="text-[#007ea7]">{selectedCustomer.name}</span></p>
                                    <div className="h-0.5 w-12 bg-slate-100" />
                                </div>
                            </div>

                            <div className="space-y-6 max-h-[450px] overflow-y-auto pr-8 no-scrollbar relative z-10 custom-scrollbar-v2">
                                <div className="px-4 mb-10 flex items-center gap-6 opacity-30">
                                    <Terminal size={14} className="text-[#007ea7]" strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-[5px] italic">Available_Nodes_Registry</span>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>
                                {agents?.filter(a => a.status === 'active' && a._id !== selectedCustomer.assignedAgent?._id).map((agent) => (
                                    <button 
                                        key={agent._id}
                                        onClick={() => reassignMutation.mutate({ customerId: selectedCustomer._id, agentId: agent._id })}
                                        className="w-full p-10 bg-slate-50/50 border-2 border-slate-50 rounded-[3.5rem] flex items-center justify-between group hover:border-[#007ea7] hover:bg-white transition-all duration-500 shadow-inner hover:shadow-3xl relative overflow-hidden active:scale-95"
                                    >
                                        <div className="flex items-center gap-10 text-left relative z-10">
                                            <div className="w-20 h-20 bg-[#003249] rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 border-2 border-white">{agent.name.charAt(0)}</div>
                                            <div className="space-y-2">
                                                <p className="font-black text-2xl text-[#003249] uppercase tracking-tighter italic leading-none group-hover:text-[#007ea7] transition-colors">{agent.name}</p>
                                                <div className="flex items-center gap-4 opacity-40">
                                                     <Layers size={14} className="text-[#007ea7]" strokeWidth={3} />
                                                     <p className="text-[11px] text-slate-400 font-black uppercase tracking-[4px] italic">{agent.stats?.customers} Load_Nodes</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 rounded-[1.8rem] bg-white border-2 border-slate-50 flex items-center justify-center text-slate-100 group-hover:border-[#007ea7] group-hover:text-[#007ea7] transition-all group-hover:translate-x-4 shadow-xl relative z-10">
                                            <ChevronRight size={28} strokeWidth={4} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            <button onClick={() => setSelectedCustomer(null)} className="w-full mt-16 py-8 text-[12px] font-black uppercase tracking-[10px] text-slate-200 hover:text-rose-500 transition-all italic group flex items-center justify-center gap-6 relative z-10 bg-slate-50/50 rounded-[2.5rem] hover:bg-rose-50 border-2 border-transparent hover:border-rose-100 active:scale-95">
                                <X size={24} className="group-hover:rotate-90 transition-transform" strokeWidth={4} /> CANCEL_MIGRATION
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Enlistment Modal */}
            <AnimatePresence>
                {isAddingAgent && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingAgent(false)} className="absolute inset-0 bg-[#003249]/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-6xl bg-white p-16 md:p-24 rounded-[6rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
                        >
                             {/* Decorative Background Mesh */}
                            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#007ea7]/10 rounded-full blur-[120px] pointer-events-none" />

                            <div className="flex flex-col md:flex-row items-center gap-12 mb-20 border-b-2 border-slate-50 pb-16 relative z-10">
                                <div className="w-24 h-24 bg-[#007ea7] rounded-[3rem] flex items-center justify-center text-white shadow-[0_30px_60px_-15px_rgba(0,126,167,0.4)] relative overflow-hidden group border-2 border-white/20">
                                     <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                                     <UserPlus size={44} strokeWidth={3} className="relative z-10 group-hover:rotate-12 transition-transform duration-700" />
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-3">
                                    <h3 className="text-5xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Operative Enlistment</h3>
                                    <p className="text-[12px] text-slate-400 font-black uppercase tracking-[6px] italic leading-none">Level-5 Node Authorization Protocol</p>
                                </div>
                                <button onClick={() => setIsAddingAgent(false)} className="p-8 bg-slate-50 hover:bg-rose-50 rounded-[2.5rem] transition-all group active:scale-95 border-2 border-transparent hover:border-rose-100 flex items-center justify-center">
                                    <X size={32} className="text-slate-300 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-500" strokeWidth={4} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-x-24 gap-y-16 relative z-10">
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <label className="text-[12px] font-black uppercase tracking-[6px] text-[#007ea7] ml-6 italic flex items-center gap-5">
                                            <Fingerprint size={18} strokeWidth={3} /> IDENTITY_SIGNATURE
                                        </label>
                                        <input 
                                            placeholder="NODE_LEGAL_NAME"
                                            className="w-full h-20 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] px-12 font-black text-lg text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic tracking-[2px] uppercase"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-[12px] font-black uppercase tracking-[6px] text-[#007ea7] ml-6 italic flex items-center gap-5">
                                            <Mail size={18} strokeWidth={3} /> UPLINK_ADDRESS
                                        </label>
                                        <input 
                                            type="email"
                                            placeholder="CORP_NODE_EMAIL"
                                            className="w-full h-20 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] px-12 font-black text-lg text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic tracking-[2px]"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <label className="text-[12px] font-black uppercase tracking-[6px] text-[#007ea7] ml-6 italic flex items-center gap-5">
                                                <Lock size={18} strokeWidth={3} /> ACCESS_KEY
                                            </label>
                                            <input 
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full h-20 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] px-12 font-black text-lg text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic tracking-[2px]"
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <label className="text-[12px] font-black uppercase tracking-[6px] text-[#007ea7] ml-6 italic flex items-center gap-5">
                                                <Satellite size={18} strokeWidth={3} /> COMMS_LINE
                                            </label>
                                            <input 
                                                placeholder="+X-XX-XXXX"
                                                className="w-full h-20 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] px-12 font-black text-lg text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic tracking-[2px]"
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <label className="text-[12px] font-black uppercase tracking-[6px] text-[#007ea7] ml-6 italic flex items-center gap-5">
                                            <MapPin size={18} strokeWidth={3} /> STATION_COORD
                                        </label>
                                        <input 
                                            placeholder="SECTOR_DEPLOYMENT_HUB"
                                            className="w-full h-20 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] px-12 font-black text-lg text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic tracking-[2px] uppercase"
                                            value={formData.address}
                                            onChange={e => setFormData({...formData, address: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <label className="text-[12px] font-black uppercase tracking-[6px] text-[#007ea7] ml-6 italic flex items-center gap-5">
                                                <Target size={18} strokeWidth={3} /> BIRTH_TOKEN
                                            </label>
                                            <input 
                                                type="date"
                                                className="w-full h-20 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] px-12 font-black text-lg text-[#003249] outline-none focus:border-[#007ea7] focus:bg-white transition-all shadow-inner italic"
                                                value={formData.dob}
                                                onChange={e => setFormData({...formData, dob: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <label className="text-[12px] font-black uppercase tracking-[6px] text-[#007ea7] ml-6 italic flex items-center gap-5">
                                                <Zap size={18} strokeWidth={3} /> YIELD_RATE [%]
                                            </label>
                                            <div className="relative">
                                                <input 
                                                    type="number"
                                                    className="w-full h-24 bg-[#003249] border-4 border-white shadow-3xl rounded-[2.5rem] px-12 font-black text-4xl text-[#80ced7] text-right outline-none focus:ring-12 focus:ring-[#007ea7]/10 transition-all italic tracking-tighter"
                                                    value={formData.commissionRate}
                                                    onChange={e => setFormData({...formData, commissionRate: e.target.value})}
                                                    required
                                                />
                                                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase tracking-[4px] italic">AUTO_CALC</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-10 pt-10">
                                        <button 
                                            type="button"
                                            onClick={() => setIsAddingAgent(false)}
                                            className="h-24 px-12 bg-slate-50 text-[#003249] rounded-[2.8rem] text-[12px] font-black uppercase tracking-[8px] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 border-2 border-transparent transition-all italic flex-1 active:scale-95 flex items-center justify-center"
                                        >
                                            ABORT_SYNC
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={createMutation.isLoading}
                                            className="h-24 px-12 bg-[#003249] text-[#80ced7] rounded-[2.8rem] text-[13px] font-black uppercase tracking-[10px] shadow-[0_30px_60px_-15px_rgba(0,50,73,0.4)] hover:bg-[#007ea7] hover:text-white transition-all italic flex-[2.5] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-8 group/btn"
                                        >
                                            <Cpu size={28} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> 
                                            {createMutation.isLoading ? "COMMITTING..." : "COMMIT_ENLISTMENT"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;