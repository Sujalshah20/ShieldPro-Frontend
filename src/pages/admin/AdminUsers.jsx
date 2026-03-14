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
    ChevronDown, Globe, Command
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
            toast({ title: "OPERATOR_ENLISTED", description: "New agent profile has been successfully integrated into the system." });
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
                title: "PROTOCOL_UPDATED", 
                description: `Agent status synchronized to: ${variables.status.toUpperCase()}` 
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
            toast({ title: "ASSET_REASSIGNED", description: "Customer portfolio has been successfully transferred to the new coordinator." });
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

    return (
        <div className="admin-users p-6 md:p-10 bg-background-main min-h-screen relative overflow-hidden font-display">
            {/* Mission Atmosphere */}
            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]">
                 <ShieldIcon size={600} className="animate-spin-slow text-primary" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/40" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-header-bg">
                                DIRECTORY<span className="text-primary tracking-normal ml-1">_SYSTEM</span>
                             </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[6px] ml-7">
                            Workforce optimization and global portfolio distribution
                        </p>
                    </div>
                    {activeTab === 'agents' && (
                        <button 
                            onClick={() => setIsAddingAgent(true)}
                            className="h-16 px-10 bg-header-bg text-white rounded-2xl font-black uppercase tracking-[4px] text-[10px] flex items-center gap-6 shadow-2xl shadow-header-bg/20 hover:bg-primary transition-all active:scale-95 group"
                        >
                            <UserPlus size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> ENLIST NEW OPERATOR
                        </button>
                    )}
                </div>
            </Reveal>

            {/* CONTROL CONSOLE */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16">
                <div className="flex gap-4 bg-white p-2.5 rounded-3xl border border-slate-200 shadow-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setActiveTab('agents')}
                        className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all flex items-center gap-4 whitespace-nowrap ${activeTab === 'agents' ? 'bg-header-bg text-white shadow-lg' : 'text-slate-400 hover:text-header-bg'}`}
                    >
                        <ShieldIcon size={16} className={activeTab === 'agents' ? 'text-primary' : 'opacity-20'} /> OPERATOR_REGISTRY
                    </button>
                    <button 
                        onClick={() => setActiveTab('reassignment')}
                        className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all flex items-center gap-4 whitespace-nowrap ${activeTab === 'reassignment' ? 'bg-header-bg text-white shadow-lg' : 'text-slate-400 hover:text-header-bg'}`}
                    >
                        <AgentIcon size={16} className={activeTab === 'reassignment' ? 'text-accent' : 'opacity-20'} /> ASSET_TRANSFER
                    </button>
                </div>
                
                <div className="relative group w-full lg:w-auto">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="SEARCH SECURITY RECORDS..." 
                        className="pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-3xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none w-full lg:w-96 transition-all font-bold text-[10px] uppercase tracking-[4px] text-header-bg shadow-lg" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>
            </div>

            {activeTab === 'agents' ? (
                <>
                {/* Operational Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                     {[
                        { label: "Active_Operators", value: agents?.filter(a => a.status === 'active').length, icon: ShieldCheck, color: "text-primary", bg: "bg-primary/5", tag: "STABLE" },
                        { label: "Protected_Assets", value: agents?.reduce((acc, curr) => acc + (curr.stats?.customers || 0), 0), icon: Globe, color: "text-indigo-600", bg: "bg-indigo-50", tag: "ACTIVE" },
                        { label: "Safety_Rating", value: "96.4%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", tag: "OPTIMAL" },
                        { label: "Total_Yield", value: `₹${(totalPortfolio / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-header-bg", bg: "bg-header-bg/5", tag: "ANNUAL" }
                     ].map((stat, i) => (
                        <Reveal key={i} width="100%" delay={i * 0.1} direction="up">
                            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className={`absolute -right-8 -top-8 w-32 h-32 ${stat.bg} rounded-full blur-[40px] opacity-20 group-hover:scale-150 transition-all duration-700`} />
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} shadow-sm border border-white/20`}>
                                        <stat.icon size={28} strokeWidth={2.5} />
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-[3px] px-3 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-header-bg group-hover:text-white transition-all`}>{stat.tag}</span>
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[5px] text-slate-400 mb-2 leading-none">{stat.label}</p>
                                <h4 className="text-4xl font-black tracking-tighter text-header-bg uppercase leading-none">
                                    {stat.value}
                                </h4>
                            </div>
                        </Reveal>
                     ))}
                </div>

                {/* Registry Chassis */}
                <Reveal width="100%" direction="up" delay={0.4}>
                    <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl mb-16">
                        <div className="px-12 py-10 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-slate-50 relative overflow-hidden">
                            <div className="absolute top-0 right-[-10%] opacity-[0.03] pointer-events-none">
                                <Command size={150} className="text-header-bg" />
                            </div>
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-16 h-16 bg-header-bg rounded-2xl flex items-center justify-center text-white shadow-xl shadow-header-bg/20 border border-white/10">
                                    <ShieldIcon size={32} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">OPERATOR_REGISTRY</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-3">Verified network of certified security coordinators</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end relative z-10">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">VALIDATED_NODES</span>
                                <span className="text-3xl font-black text-primary uppercase tracking-tight leading-none mt-1">{filteredAgents?.length || 0}</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                            {agentsLoading ? (
                                <div className="p-12">
                                    <TableSkeleton rows={8} cols={5} />
                                </div>
                            ) : (
                                <table className="w-full text-left font-bold text-[10px] uppercase tracking-widest text-slate-500">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-[9px] text-slate-400 border-b border-slate-100">
                                            <th className="px-12 py-10 tracking-[5px]">OPERATOR_IDENTITY</th>
                                            <th className="px-12 py-10 text-center tracking-[5px]">PERFORMANCE_LOGS</th>
                                            <th className="px-12 py-10 tracking-[5px]">YIELD_PARAMETER</th>
                                            <th className="px-12 py-10 text-center tracking-[5px]">STATUS</th>
                                            <th className="px-12 py-10 text-right tracking-[5px]">PROTOCOL_ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">

                                    {filteredAgents?.map((agent, idx) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, x: -15 }} 
                                            animate={{ opacity: 1, x: 0 }} 
                                            transition={{ delay: idx * 0.05 }}
                                            key={agent._id} 
                                            className="hover:bg-slate-50/50 transition-all group"
                                        >
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500" />
                                                        <div className="relative w-20 h-20 bg-header-bg rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all overflow-hidden shadow-lg shadow-header-bg/10">
                                                            {agent.profilePic ? (
                                                                <img src={agent.profilePic} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                                                            ) : (
                                                                <span className="text-3xl font-black text-white italic">{agent.name.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                                                            <Fingerprint size={16} className="text-primary" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black tracking-tight text-header-bg group-hover:text-primary transition-colors leading-none mb-3 uppercase">{agent.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 tracking-[3px] flex items-center gap-3 lowercase">
                                                            <Mail size={12} className="text-primary/60" /> {agent.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-center">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center justify-center gap-4 bg-white py-3 px-6 rounded-xl border border-slate-100 shadow-sm">
                                                        <Users size={16} className="text-primary/40" />
                                                        <span className="font-black text-xs text-header-bg">{agent.stats?.customers} <span className="text-[9px] opacity-30 ml-2">PORTFOLIOS</span></span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-4 bg-white py-3 px-6 rounded-xl border border-slate-100 shadow-sm">
                                                        <IndianRupee size={16} className="text-emerald-500/40" />
                                                        <span className="font-black text-xs text-emerald-600">₹{agent.stats?.earnings.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-black text-slate-300 spacing-[4px]">NODE_RANK: BRONZE</span>
                                                        <span className="text-xs font-black text-primary">{agent.commissionRate}%</span>
                                                    </div>
                                                    <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${agent.commissionRate}%` }}
                                                            transition={{ duration: 1.5, ease: "circOut" }}
                                                            className="h-full bg-primary shadow-lg shadow-primary/40" 
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex justify-center">
                                                    <div className={`px-6 py-2.5 rounded-full text-[9px] font-black tracking-[4px] flex items-center gap-4 border ${
                                                        agent.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' : 'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                        <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                                        {agent.status.toUpperCase()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <div className="flex justify-end gap-4">
                                                    {agent.status === 'active' ? (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); statusMutation.mutate({ id: agent._id, status: 'suspended' }); }}
                                                            className="h-12 px-8 bg-header-bg text-white rounded-xl text-[9px] font-black uppercase tracking-[4px] hover:bg-rose-600 transition-all shadow-xl active:scale-95 flex items-center gap-4 border border-white/5 group/sus"
                                                        >
                                                            SUSPEND <ShieldAlert size={16} className="group-hover/sus:rotate-12 transition-transform" />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); statusMutation.mutate({ id: agent._id, status: 'active' }); }}
                                                            className="h-12 px-8 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-[4px] hover:bg-header-bg transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-4 group/act"
                                                        >
                                                            ACTIVATE <Zap size={16} className="group-hover/act:animate-bounce" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </Reveal>
                </>
            ) : (
                <Reveal width="100%" direction="up">
                    <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl mb-16">
                        <div className="px-12 py-10 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-slate-50 relative">
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-header-bg shadow-xl shadow-accent/20 border border-white/10">
                                    <Users size={32} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-tight text-header-bg leading-none">ASSET_ASSIGNMENTS</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-3">Portfolio redistribution and coordinator management</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end relative z-10">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">TOTAL_PROTECTED</span>
                                <span className="text-3xl font-black text-accent uppercase tracking-tight leading-none mt-1">{filteredCustomers?.length || 0}</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                            {customersLoading ? (
                                <div className="p-12">
                                    <TableSkeleton rows={8} cols={4} />
                                </div>
                            ) : (
                                <table className="w-full text-left font-bold text-[10px] tracking-[4px] uppercase text-slate-500">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-[9px] text-slate-400 border-b border-slate-100">
                                            <th className="px-12 py-10 tracking-[5px]">ASSET_OWNER</th>
                                            <th className="px-12 py-10 tracking-[5px]">SECURITY_COORDINATOR</th>
                                            <th className="px-12 py-10 text-center tracking-[5px]">LIVE_STATUS</th>
                                            <th className="px-12 py-10 text-right tracking-[5px]">DEPLOYMENT_ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">

                                    {filteredCustomers?.map((customer, idx) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, scale: 0.98 }} 
                                            animate={{ opacity: 1, scale: 1 }} 
                                            transition={{ delay: idx * 0.05 }}
                                            key={customer._id} 
                                            className="hover:bg-slate-50/50 transition-all group"
                                        >
                                            <td className="px-12 py-10">
                                                <div className="flex flex-col gap-3">
                                                    <span className="font-black text-2xl tracking-tight text-header-bg group-hover:text-primary transition-colors leading-none uppercase">{customer.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 tracking-[3px] lowercase flex items-center gap-3">
                                                        <Mail size={12} className="text-primary/60" /> {customer.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                {customer.assignedAgent ? (
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
                                                            {customer.assignedAgent.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="font-black text-sm text-header-bg leading-none uppercase">{customer.assignedAgent.name}</span>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                                <span className="text-[9px] font-black text-slate-400 tracking-[2px]">VERIFIED_NODE</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-5 bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100 w-fit">
                                                        <AlertCircle size={14} className="text-rose-500 animate-pulse" />
                                                        <span className="text-[10px] text-rose-600 font-black tracking-[4px]">UNASSIGNED</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-12 py-10 text-center">
                                                <div className="px-6 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-[9px] font-black text-slate-500 tracking-[4px] w-fit mx-auto shadow-inner">
                                                    {customer.status?.toUpperCase() || 'ACTIVE'}
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <button 
                                                    onClick={() => setSelectedCustomer(customer)}
                                                    className="h-14 px-10 bg-white border border-slate-200 text-header-bg rounded-2xl text-[10px] font-black uppercase tracking-[4px] hover:bg-header-bg hover:text-white hover:border-header-bg transition-all shadow-xl active:scale-95 flex items-center gap-6 justify-end float-right group/trans"
                                                >
                                                    TRANSFER PORTFOLIO <AgentIcon size={18} className="group-hover/trans:translate-x-2 transition-transform" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </Reveal>
            )}

            {/* Reassignment Modal Console */}
            <AnimatePresence>
                {selectedCustomer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-header-bg/95 backdrop-blur-xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-2xl bg-white p-16 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-[-30%] right-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
                            
                            <div className="flex items-center gap-8 mb-16 relative z-10">
                                <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center text-header-bg shadow-2xl shadow-accent/20 border border-white/20">
                                    <AgentIcon size={36} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter text-header-bg leading-none">PORTFOLIO_TRANSFER</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[5px] mt-4 flex items-center gap-3">
                                        REASSIGNING: <span className="text-primary">{selectedCustomer.name}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6 max-h-[450px] overflow-y-auto no-scrollbar pr-4 relative z-10">
                                {agents?.filter(a => a.status === 'active' && a._id !== selectedCustomer.assignedAgent?._id).map((agent, aidx) => (
                                    <motion.button 
                                        initial={{ opacity: 0, y: 20 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: aidx * 0.1 }}
                                        key={agent._id}
                                        onClick={() => reassignMutation.mutate({ customerId: selectedCustomer._id, agentId: agent._id })}
                                        className="w-full p-10 bg-slate-50 border border-slate-200 rounded-[3rem] flex items-center justify-between group hover:border-primary/50 hover:bg-white transition-all shadow-lg overflow-hidden relative"
                                    >
                                        <div className="flex items-center gap-10">
                                            <div className="w-24 h-24 bg-header-bg rounded-[2rem] flex items-center justify-center text-primary font-black text-4xl shadow-2xl group-hover:rotate-12 transition-all">
                                                {agent.name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-3xl tracking-tighter text-header-bg uppercase mb-2 leading-none">{agent.name}</p>
                                                <div className="flex items-center gap-6 mt-4 opacity-40">
                                                    <div className="flex items-center gap-3">
                                                        <Users size={14} />
                                                        <p className="text-[10px] font-black uppercase tracking-[3px]">{agent.stats?.customers} ASSETS</p>
                                                    </div>
                                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                                    <p className="text-[10px] font-black uppercase tracking-[3px]">YIELD: {agent.commissionRate}%</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-xl">
                                            <CheckCircle size={32} strokeWidth={3} />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => setSelectedCustomer(null)}
                                className="w-full mt-12 py-5 text-[10px] font-black uppercase tracking-[6px] text-slate-400 hover:text-primary transition-all"
                            >
                                ABORT_TRANSFER [ESC]
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Registration Console Chassis */}
            <AnimatePresence>
                {isAddingAgent && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingAgent(false)} className="absolute inset-0 bg-header-bg/95 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-5xl bg-white p-16 md:p-24 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]">
                                <ShieldIcon size={500} className="text-primary animate-spin-slow" />
                            </div>
                            
                            <div className="relative z-10 flex flex-col mb-16">
                                <div className="flex items-center gap-8 mb-6">
                                    <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 border border-white/10">
                                        <UserPlus size={40} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h3 className="text-5xl font-black uppercase tracking-tighter text-header-bg leading-none">OPERATOR_ENLISTMENT</h3>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[6px] mt-4 ml-1">Official system integration protocol for field agents</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">IDENTITY_SET</label>
                                        <div className="relative group">
                                            <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                placeholder="FULL LEGAL NAME..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-16 py-6 font-black uppercase text-xs tracking-[4px] outline-none focus:border-primary focus:bg-white shadow-lg transition-all focus:ring-8 focus:ring-primary/5 text-header-bg"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">ACCESS_UPLINK</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                type="email"
                                                placeholder="OPERATOR_EMAIL@SHIELD.LIVE"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-16 py-6 font-black text-xs uppercase tracking-[4px] outline-none focus:border-primary focus:bg-white shadow-lg transition-all focus:ring-8 focus:ring-primary/5 text-header-bg"
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">ENCRYPTED_KEY</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-16 py-6 font-black outline-none focus:border-primary focus:bg-white shadow-lg transition-all focus:ring-8 focus:ring-primary/5 text-header-bg"
                                                    value={formData.password}
                                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">SECURE_CONTACT</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    placeholder="+91-0000000000"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-16 py-6 font-black uppercase text-xs tracking-[4px] outline-none focus:border-primary focus:bg-white shadow-lg transition-all focus:ring-8 focus:ring-primary/5 text-header-bg"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">GEOSPATIAL_HUB</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                placeholder="OPERATIONAL HEADQUARTERS ADDRESS..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-16 py-6 font-black uppercase text-xs tracking-[4px] outline-none focus:border-primary focus:bg-white shadow-lg transition-all focus:ring-8 focus:ring-primary/5 text-header-bg"
                                                value={formData.address}
                                                onChange={e => setFormData({...formData, address: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">BIRTH_PARAMETER</label>
                                            <input 
                                                type="date"
                                                className="w-full h-[76px] bg-slate-50 border border-slate-200 rounded-2xl px-10 font-black outline-none focus:border-primary focus:bg-white shadow-lg transition-all text-header-bg"
                                                value={formData.dob}
                                                onChange={e => setFormData({...formData, dob: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[6px] text-primary mb-3 block">COMMISSION_YIELD (%)</label>
                                            <div className="relative group">
                                                <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-3xl text-primary/30 group-focus-within:text-primary transition-colors">%</span>
                                                <input 
                                                    type="number"
                                                    className="w-full h-[76px] bg-slate-50 border border-slate-200 rounded-2xl px-20 font-black text-header-bg text-4xl italic outline-none focus:border-primary focus:bg-white shadow-lg transition-all text-right pr-12"
                                                    value={formData.commissionRate}
                                                    onChange={e => setFormData({...formData, commissionRate: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 pt-10">
                                        <button 
                                            type="button"
                                            onClick={() => setIsAddingAgent(false)}
                                            className="h-24 px-12 bg-slate-900 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[6px] hover:bg-header-bg transition-all active:scale-95 border border-white/5"
                                        >
                                            ABORT_ENLISTMENT
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={createMutation.isLoading}
                                            className="flex-1 h-24 bg-primary text-white rounded-[2.5rem] text-xs font-black uppercase tracking-[8px] shadow-2xl shadow-primary/40 hover:bg-header-bg hover:translate-y-[-10px] active:scale-95 transition-all flex items-center justify-center gap-8 group"
                                        >
                                            {createMutation.isLoading ? "INITIALIZING..." : (
                                                <>INITIALIZE_OPERATOR <AgentIcon size={24} className="group-hover:rotate-180 transition-transform duration-1000" strokeWidth={3} /></>
                                            )}
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