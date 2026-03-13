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
    User, ShieldCheck as ShieldIcon, UserCheck as AgentIcon
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
            toast({ title: "AGENT REGISTERED", description: "New agent profile has been successfully created." });
            setIsAddingAgent(false);
            setFormData({ name: "", email: "", password: "", phone: "", dob: "", gender: "Male", address: "", commissionRate: 10 });
        },
        onError: (err) => toast({ 
            title: "REGISTRATION FAILED", 
            description: err?.errors?.[0]?.message || err?.message || "An error occurred during registration.", 
            variant: "destructive" 
        })
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/admin/agents/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['adminAgents']);
            toast({ 
                title: "STATUS UPDATED", 
                description: `Agent status changed to: ${variables.status.toUpperCase()}` 
            });
        },
        onError: (err) => {
            toast({
                title: "UPDATE ERROR",
                description: err?.message || "Failed to update agent status.",
                variant: "destructive"
            });
        }
    });

    const reassignMutation = useMutation({
        mutationFn: (data) => api.put(`/admin/customers/${data.customerId}/reassign`, { agentId: data.agentId }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminCustomers']);
            toast({ title: "CUSTOMER REASSIGNED", description: "Customer has been successfully assigned to the new agent." });
            setSelectedCustomer(null);
        },
        onError: (err) => {
            toast({
                title: "REASSIGNMENT FAILED",
                description: err?.message || "Failed to reassign customer.",
                variant: "destructive"
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const totalPortfolio = agents?.reduce((acc, curr) => acc + (curr.stats?.earnings || 0), 0) || 0;

    // Filter logic
    const filteredAgents = agents?.filter(agent => 
        agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCustomers = customers?.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-users p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#0c1a15] min-h-screen relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                 <ShieldIcon size={600} className="animate-spin-slow" />
            </div>

            <Reveal width="100%" direction="down">
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2 h-10 bg-primary rounded-full shadow-[0_0_15px_#0165FF]" />
                             <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                DIRECTORY<span className="text-primary tracking-normal">_MANAGEMENT</span>
                             </h1>
                        </div>
                        <p className="text-xs font-black opacity-30 uppercase tracking-[5px] ml-6 italic">
                            Manage your workforce of agents and customer assignments
                        </p>
                    </div>
                    {activeTab === 'agents' && (
                        <button 
                            onClick={() => setIsAddingAgent(true)}
                            className="h-16 px-10 bg-accent text-white rounded-2xl font-black uppercase tracking-[4px] text-[10px] flex items-center gap-5 shadow-2xl shadow-accent/40 hover:translate-y-[-5px] active:scale-95 transition-all group italic"
                        >
                            <UserPlus size={18} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> REGISTER NEW AGENT
                        </button>
                    )}
                </div>
            </Reveal>

            {/* TAB SELECTOR & COMMAND BAR */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
                <div className="flex gap-4 bg-white dark:bg-zinc-900/50 p-2 rounded-[2rem] border border-border/50 shadow-sm w-full lg:w-auto backdrop-blur-md">
                    <button 
                        onClick={() => setActiveTab('agents')}
                        className={`px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[3px] transition-all italic flex items-center gap-3 ${activeTab === 'agents' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                    >
                        <ShieldIcon size={14} className={activeTab === 'agents' ? 'text-primary' : 'opacity-20'} /> AGENT_REGISTRY
                    </button>
                    <button 
                        onClick={() => setActiveTab('reassignment')}
                        className={`px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[3px] transition-all italic flex items-center gap-3 ${activeTab === 'reassignment' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                    >
                        <AgentIcon size={14} className={activeTab === 'reassignment' ? 'text-accent' : 'opacity-20'} /> CUSTOMER_REASSIGNMENT
                    </button>
                </div>
                
                <div className="relative group w-full lg:w-auto">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="SEARCH BY NAME OR EMAIL..." 
                        className="pl-16 pr-8 py-5 bg-white dark:bg-zinc-900/50 border border-border/50 rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none w-full lg:w-96 transition-all font-black text-[10px] uppercase tracking-[4px] shadow-sm backdrop-blur-md italic" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>
            </div>

            {activeTab === 'agents' ? (
                <>
                {/* Performance Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                     {[
                        { label: "Active_Agents", value: agents?.filter(a => a.status === 'active').length, icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10", tag: "ACTIVE" },
                        { label: "Total_Customers", value: agents?.reduce((acc, curr) => acc + (curr.stats?.customers || 0), 0), icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10", tag: "GROWING" },
                        { label: "Total_Policies", value: "72%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", tag: "STABLE" },
                        { label: "Total_Revenue", value: `₹${(totalPortfolio / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-accent", bg: "bg-accent/10", tag: "ACTUAL" }
                     ].map((stat, i) => (
                        <Reveal key={i} width="100%" delay={i * 0.1} direction="up">
                            <div className="bg-white dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all hover:translate-y-[-5px]">
                                <div className={`absolute -right-8 -top-8 w-32 h-32 ${stat.bg} rounded-full blur-[40px] opacity-30 group-hover:opacity-60 transition-all group-hover:scale-125`} />
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm border border-white/10`}>
                                        <stat.icon size={24} strokeWidth={3} />
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-[2px] px-2 py-1 rounded-md bg-zinc-100 dark:bg-white/5 opacity-40 group-hover:opacity-100 transition-all`}>{stat.tag}</span>
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[4px] opacity-30 mb-2 italic">{stat.label}</p>
                                <h4 className="text-4xl font-black italic tracking-tighter leading-none">
                                    {stat.value}
                                </h4>
                            </div>
                        </Reveal>
                     ))}
                </div>

                {/* Identity Register Chassis */}
                <Reveal width="100%" direction="up" delay={0.4}>
                    <div className="bg-white dark:bg-zinc-900/50 rounded-[4rem] border border-border/50 overflow-hidden shadow-2xl backdrop-blur-md mb-10">
                        <div className="p-10 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-zinc-50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-lg border border-primary/20">
                                    <AgentIcon size={28} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">AGENT_DIRECTORY</h3>
                                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[4px] mt-2 italic ml-1">Official list of registered insurance agents</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-[3px] opacity-20">ACTIVE_AGENTS</span>
                                <span className="text-2xl font-black italic text-primary">{filteredAgents?.length || 0}</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                            {agentsLoading ? (
                                <div className="p-10">
                                    <TableSkeleton rows={5} cols={5} />
                                </div>
                            ) : (
                                <table className="w-full text-left font-black text-[10px] uppercase tracking-widest italic">
                                    <thead>
                                        <tr className="bg-zinc-100 dark:bg-white/5 text-[9px] opacity-40">
                                            <th className="px-12 py-8 tracking-[4px]">AGENT_INFORMATION</th>
                                            <th className="px-12 py-8 text-center tracking-[4px]">PERFORMANCE_STATS</th>
                                            <th className="px-12 py-8 tracking-[4px]">COMMISSION_RATE</th>
                                            <th className="px-12 py-8 text-center tracking-[4px]">STATUS</th>
                                            <th className="px-12 py-8 text-right tracking-[4px]">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/10">

                                    {filteredAgents?.map((agent, idx) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={agent._id} 
                                            className="hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-all group cursor-pointer"
                                        >
                                            <td className="px-12 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="relative group/avatar">
                                                        <div className="absolute inset-0 bg-primary blur-xl opacity-0 group-hover/avatar:opacity-20 transition-all" />
                                                        <div className="relative w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center border-2 border-border/50 group-hover:border-primary/50 transition-all overflow-hidden shadow-lg">
                                                            {agent.profilePic ? (
                                                                <img src={agent.profilePic} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                            ) : (
                                                                <span className="text-3xl font-black text-primary italic leading-none">{agent.name.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors leading-none mb-2">{agent.name}</p>
                                                        <p className="text-[9px] opacity-30 tracking-[3px] flex items-center gap-3 mt-1 lowercase font-black italic">
                                                            <Mail size={12} className="text-primary" /> {agent.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-center">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-center gap-4 bg-zinc-100 dark:bg-white/5 py-2 px-4 rounded-xl border border-border/30">
                                                        <Users size={14} className="opacity-20 text-primary" strokeWidth={3} />
                                                        <span className="font-black text-xs leading-none">{agent.stats?.customers} <span className="text-[9px] opacity-20 ml-1">CUSTOMERS</span></span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-4 bg-zinc-100 dark:bg-white/5 py-2 px-4 rounded-xl border border-border/30">
                                                        <IndianRupee size={14} className="text-accent opacity-60" strokeWidth={3} />
                                                        <span className="font-black text-xs text-accent leading-none">₹{agent.stats?.earnings.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-[8px] font-black opacity-20 tracking-[2px]">LEVEL: BRONZE</span>
                                                        <span className="text-xs font-black italic text-primary">{agent.commissionRate}%</span>
                                                    </div>
                                                    <div className="w-32 h-2 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner border border-border/30">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${agent.commissionRate}%` }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            className="h-full bg-primary shadow-[0_0_15px_rgba(1,101,255,1)]" 
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                <div className="flex justify-center">
                                                    <div className={`px-6 py-3 rounded-2xl text-[9px] font-black tracking-[4px] flex items-center gap-4 w-fit shadow-inner ${
                                                        agent.status === 'active' ? 'bg-emerald-500/5 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/5 text-rose-500 border border-rose-500/20'
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-rose-500'}`} />
                                                        {agent.status.toUpperCase()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-right">
                                                <div className="flex justify-end gap-3">
                                                    {agent.status === 'active' ? (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); statusMutation.mutate({ id: agent._id, status: 'suspended' }); }}
                                                            className="h-12 px-6 bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-500 rounded-xl text-[9px] font-black uppercase tracking-[3px] hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-3 border border-white/5"
                                                        >
                                                            SUSPEND <ShieldAlert size={14} strokeWidth={3} />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); statusMutation.mutate({ id: agent._id, status: 'active' }); }}
                                                            className="h-12 px-6 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-[3px] hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-3 italic"
                                                        >
                                                            ACTIVATE <Zap size={14} strokeWidth={3} />
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
                    <div className="bg-white dark:bg-zinc-900/50 rounded-[4rem] border border-border/50 overflow-hidden shadow-2xl backdrop-blur-md">
                        <div className="p-10 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-zinc-50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-lg border border-accent/20">
                                    <Users size={28} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">CUSTOMER_ASSIGNMENTS</h3>
                                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[4px] mt-2 italic ml-1">Manage customer and agent assignments</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-[3px] opacity-20">CUSTOMER_COUNT</span>
                                <span className="text-2xl font-black italic text-accent">{filteredCustomers?.length || 0}</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                            {customersLoading ? (
                                <div className="p-10">
                                    <TableSkeleton rows={5} cols={4} />
                                </div>
                            ) : (
                                <table className="w-full text-left font-black text-[10px] tracking-[3px] uppercase italic">
                                    <thead>
                                        <tr className="bg-zinc-100 dark:bg-white/5 text-[9px] opacity-40">
                                            <th className="px-12 py-8 tracking-[4px]">CUSTOMER_NAME</th>
                                            <th className="px-12 py-8 tracking-[4px]">ASSIGNED_AGENT</th>
                                            <th className="px-12 py-8 text-center tracking-[4px]">STATUS</th>
                                            <th className="px-12 py-8 text-right tracking-[4px]">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/10">

                                    {filteredCustomers?.map((customer, idx) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={customer._id} 
                                            className="hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-all group"
                                        >
                                            <td className="px-12 py-8">
                                                <div className="flex flex-col gap-2">
                                                    <span className="font-black text-xl italic tracking-tighter group-hover:text-primary transition-colors leading-none">{customer.name}</span>
                                                    <span className="text-[10px] opacity-30 tracking-[3px] lowercase font-black italic flex items-center gap-2">
                                                        <Mail size={10} className="text-primary" /> {customer.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                {customer.assignedAgent ? (
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black italic text-base border border-primary/20 shadow-sm">
                                                            {customer.assignedAgent.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-sm italic leading-none mb-1">{customer.assignedAgent.name}</span>
                                                            <span className="text-[8px] opacity-20 tracking-[2px]">AGENT_ID_0{idx + 1}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-4 bg-rose-500/5 px-4 py-3 rounded-2xl border border-rose-500/10 w-fit">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                                                        <span className="text-[10px] opacity-40 italic font-black tracking-[3px]">UNASSIGNED</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-12 py-8 text-center">
                                                <div className="px-5 py-2.5 bg-zinc-100 dark:bg-white/5 border border-border/30 rounded-2xl text-[9px] font-black uppercase tracking-[3px] opacity-40 italic w-fit mx-auto">
                                                    {customer.status?.toUpperCase() || 'ACTIVE'}
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-right">
                                                <button 
                                                    onClick={() => setSelectedCustomer(customer)}
                                                    className="h-14 px-8 bg-white dark:bg-zinc-900 border-2 border-primary/10 text-primary rounded-2xl text-[9px] font-black uppercase tracking-[4px] hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm active:scale-95 italic flex items-center gap-4 justify-end float-right group/btn"
                                                >
                                                    REASSIGN CUSTOMER <AgentIcon size={16} className="group-hover:rotate-45 transition-transform" />
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

            {/* Reassignment Modal Chassis */}
            <AnimatePresence>
                {selectedCustomer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-zinc-950/90 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-[#10221c] p-16 rounded-[4.5rem] border border-white/10 shadow-[0_80px_100px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className="absolute top-[-30%] right-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
                            
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-accent/40">
                                    <AgentIcon size={32} strokeWidth={3} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-4xl font-black italic leading-none uppercase tracking-tighter">REASSIGN CUSTOMER</h3>
                                    <p className="opacity-30 text-[10px] font-black uppercase tracking-[5px] mt-2 italic">Assigning customer: <span className="text-primary">{selectedCustomer.name}</span></p>
                                </div>
                            </div>

                            <div className="space-y-6 max-h-[450px] overflow-y-auto no-scrollbar pr-2">
                                {agents?.filter(a => a.status === 'active' && a._id !== selectedCustomer.assignedAgent?._id).map((agent, aidx) => (
                                    <motion.button 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: aidx * 0.1 }}
                                        key={agent._id}
                                        onClick={() => reassignMutation.mutate({ customerId: selectedCustomer._id, agentId: agent._id })}
                                        className="w-full p-10 bg-zinc-50 dark:bg-white/[0.02] border border-border/50 rounded-[3rem] flex items-center justify-between group hover:border-primary/50 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-8 relative z-10">
                                            <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center text-primary font-black italic text-3xl border border-white/5 group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                                                {agent.name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-2xl italic uppercase tracking-tighter mb-1">{agent.name}</p>
                                                <div className="flex items-center gap-5 mt-2 opacity-30">
                                                    <div className="flex items-center gap-2">
                                                        <Users size={12} strokeWidth={3} />
                                                        <p className="text-[10px] font-black uppercase tracking-[3px]">{agent.stats?.customers} CUSTOMERS</p>
                                                    </div>
                                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                                                    <p className="text-[10px] font-black uppercase tracking-[3px]">COMMISSION: {agent.commissionRate}%</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-100 dark:bg-white/5 border border-border/30 flex items-center justify-center text-zinc-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-lg relative z-10">
                                            <CheckCircle size={28} strokeWidth={3} />
                                        </div>
                                    </motion.button>
                                ))}
                                
                                {agents?.filter(a => a.status === 'active' && a._id !== selectedCustomer.assignedAgent?._id).length === 0 && (
                                    <div className="py-20 text-center opacity-20 border-2 border-dashed border-border rounded-[3rem]">
                                        <Activity size={48} className="mx-auto mb-4" />
                                        <p className="text-[11px] font-black uppercase tracking-[6px]">NO AVAILABLE AGENTS</p>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => setSelectedCustomer(null)}
                                className="w-full mt-10 py-5 text-[10px] font-black uppercase tracking-[6px] text-zinc-400 hover:text-foreground transition-colors italic"
                            >
                                CANCEL REASSIGNMENT [ESC]
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Registration Modal Chassis */}
            <AnimatePresence>
                {isAddingAgent && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingAgent(false)} className="absolute inset-0 bg-zinc-950/90 backdrop-blur-2xl" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative w-full max-w-5xl bg-white dark:bg-[#10221c] p-16 md:p-24 rounded-[5rem] border border-white/10 shadow-[0_100px_150px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <ShieldIcon size={400} className="text-accent animate-spin-slow" />
                            </div>
                            
                            <div className="relative z-10 flex flex-col mb-16">
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-accent/40">
                                        <User size={32} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">REGISTER <span className="text-accent italic-none not-italic">NEW_AGENT</span></h3>
                                </div>
                                <p className="opacity-30 text-xs font-black uppercase tracking-[8px] italic ml-20">Official insurance agent registration protocol</p>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[5px] text-accent italic ml-2">AGENT_NAME</label>
                                        <div className="relative group">
                                            <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                            <input 
                                                placeholder="FULL NAME..."
                                                className="w-full bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-16 py-6 font-black uppercase text-xs tracking-[3px] outline-none focus:border-accent shadow-sm transition-all focus:ring-8 focus:ring-accent/5"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[5px] text-accent italic ml-2">EMAIL_ADDRESS</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                            <input 
                                                type="email"
                                                placeholder="AGENT@SHIELDPRO.COM"
                                                className="w-full bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-16 py-6 font-black text-xs uppercase tracking-[3px] outline-none focus:border-accent shadow-sm transition-all focus:ring-8 focus:ring-accent/5"
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[5px] text-accent italic ml-2">PASSWORD</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                                <input 
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-16 py-6 font-black outline-none focus:border-accent shadow-sm transition-all focus:ring-8 focus:ring-accent/5"
                                                    value={formData.password}
                                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[5px] text-accent italic ml-2">PHONE_NUMBER</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                                <input 
                                                    placeholder="+91-0000000000"
                                                    className="w-full bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-16 py-6 font-black uppercase text-xs tracking-[3px] outline-none focus:border-accent shadow-sm transition-all focus:ring-8 focus:ring-accent/5"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[5px] text-accent italic ml-2">OFFICE_ADDRESS</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                            <input 
                                                placeholder="ENTER FULL ADDRESS..."
                                                className="w-full bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-16 py-6 font-black uppercase text-xs tracking-[3px] outline-none focus:border-accent shadow-sm transition-all focus:ring-8 focus:ring-accent/5"
                                                value={formData.address}
                                                onChange={e => setFormData({...formData, address: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[5px] text-accent italic ml-2">DATE_OF_BIRTH</label>
                                            <input 
                                                type="date"
                                                className="w-full h-[70px] bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-8 font-black outline-none focus:border-accent shadow-sm transition-all"
                                                value={formData.dob}
                                                onChange={e => setFormData({...formData, dob: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[5px] text-accent italic ml-2">COMMISSION_RATE (%)</label>
                                            <div className="relative">
                                                <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-2xl text-accent/40 leading-none group-hover:translate-x-1 transition-all">%</span>
                                                <input 
                                                    type="number"
                                                    className="w-full h-[70px] bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-16 font-black text-accent text-3xl italic outline-none focus:border-accent shadow-sm transition-all text-right pr-12"
                                                    value={formData.commissionRate}
                                                    onChange={e => setFormData({...formData, commissionRate: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 pt-6">
                                        <button 
                                            type="button"
                                            onClick={() => setIsAddingAgent(false)}
                                            className="h-20 px-10 bg-zinc-900 text-white dark:bg-zinc-800 rounded-[2rem] text-[10px] font-black uppercase tracking-[5px] hover:bg-zinc-800 transition-all active:scale-95 italic border border-white/5"
                                        >
                                            CANCEL
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={createMutation.isLoading}
                                            className="flex-1 h-20 bg-accent text-white rounded-[2rem] text-xs font-black uppercase tracking-[6px] shadow-[0_20px_50px_rgba(255,90,0,0.4)] disabled:opacity-50 hover:translate-y-[-8px] active:scale-95 transition-all italic flex items-center justify-center gap-6 group"
                                        >
                                            {createMutation.isLoading ? "REGISTERING..." : (
                                                <>CREATE_AGENT_PROFILE <AgentIcon size={20} className="group-hover:rotate-180 transition-transform duration-1000" strokeWidth={3} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                            <div className="mt-16 flex justify-center gap-12 opacity-10">
                                 <User size={28} />
                                 <Activity size={28} />
                                 <ShieldIcon size={28} />
                                 <AgentIcon size={28} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;