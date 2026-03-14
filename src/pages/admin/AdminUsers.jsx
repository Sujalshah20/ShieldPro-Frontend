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

    const statsCards = [
        { label: "Active Operators", value: agents?.filter(a => a.status === 'active').length, icon: ShieldCheck, color: "text-[#0082a1]", bg: "bg-[#0082a1]/5" },
        { label: "Protected Assets", value: agents?.reduce((acc, curr) => acc + (curr.stats?.customers || 0), 0), icon: Globe, color: "text-[#012b3f]", bg: "bg-[#012b3f]/5" },
        { label: "Network Reliability", value: "99.8%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Total Asset Value", value: `$${(totalPortfolio / 1000).toFixed(1)}k`, icon: IndianRupee, color: "text-[#0082a1]", bg: "bg-slate-50" }
    ];

    return (
        <div className="admin-users p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Header */}
            <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1">Network Management</h1>
                    <p className="text-sm text-slate-500 font-medium">Monitor operator performance and coordinate asset distribution across the network.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button 
                            onClick={() => setActiveTab('agents')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'agents' ? 'bg-[#012b3f] text-white shadow-md' : 'text-slate-400 hover:text-[#012b3f]'}`}
                        >
                            Operators
                        </button>
                        <button 
                            onClick={() => setActiveTab('reassignment')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reassignment' ? 'bg-[#012b3f] text-white shadow-md' : 'text-slate-400 hover:text-[#012b3f]'}`}
                        >
                            Clients
                        </button>
                    </div>
                    {activeTab === 'agents' && (
                        <button 
                            onClick={() => setIsAddingAgent(true)}
                            className="px-6 py-2.5 bg-[#0082a1] text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-[#0082a1]/20 hover:scale-105 transition-all"
                        >
                            <UserPlus size={16} /> Enlist Operator
                        </button>
                    )}
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statsCards.map((stat, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100"
                    >
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-[#012b3f]">{stat.value}</h2>
                            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder={`Search ${activeTab === 'agents' ? 'operators' : 'clients'}...`} 
                        className="pl-12 pr-4 h-11 bg-white border border-slate-200 rounded-xl outline-none w-full transition-all font-bold text-[10px] uppercase tracking-widest text-[#012b3f] shadow-sm focus:border-[#0082a1]" 
                        value={searchQuery} 
                        onChange={e=>setSearchQuery(e.target.value)} 
                    />
                </div>
                <div className="hidden md:flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Lock size={14} className="text-[#0082a1]" /> Secure Access Active
                </div>
            </div>

            {activeTab === 'agents' ? (
                <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-[#012b3f]">Operator Registry</h3>
                        <span className="text-[10px] font-black text-[#0082a1] uppercase tracking-widest">{filteredAgents?.length || 0} Registered Nodes</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#f8fafb]">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-8 py-5">Operator</th>
                                    <th className="px-8 py-5 text-center">Portfolio Stats</th>
                                    <th className="px-8 py-5">Yield Rank</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredAgents?.map((agent, idx) => (
                                    <tr key={agent._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#012b3f] rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md">
                                                    {agent.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#012b3f] leading-none mb-1">{agent.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{agent.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col gap-1 items-center">
                                                <span className="text-sm font-bold text-[#012b3f]">{agent.stats?.customers} Clients</span>
                                                <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">${(agent.stats?.earnings/100).toFixed(1)}k Volume</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between text-[10px] font-black text-[#0082a1] uppercase tracking-widest">
                                                    <span>Agent Level</span>
                                                    <span>{agent.commissionRate}%</span>
                                                </div>
                                                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#0082a1]" style={{ width: `${agent.commissionRate}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                                                    agent.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    {agent.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: agent._id, status: agent.status === 'active' ? 'suspended' : 'active' })}
                                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                                    agent.status === 'active' ? 'bg-slate-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white' : 'bg-[#0082a1] text-white hover:bg-[#012b3f]'
                                                }`}
                                            >
                                                {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-[#012b3f]">Client Management</h3>
                        <span className="text-[10px] font-black text-[#0082a1] uppercase tracking-widest">{filteredCustomers?.length || 0} Protected Assets</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#f8fafb]">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-8 py-5">Asset Owner</th>
                                    <th className="px-8 py-5">Assigned Coordinator</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredCustomers?.map((customer, idx) => (
                                    <tr key={customer._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-base font-black text-[#012b3f] uppercase">{customer.name}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{customer.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {customer.assignedAgent ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#012b3f] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                                        {customer.assignedAgent.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-[#012b3f]">{customer.assignedAgent.name}</span>
                                                </div>
                                            ) : (
                                                <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-black uppercase tracking-widest italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="px-4 py-1 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-black text-[#012b3f] uppercase tracking-widest">
                                                {customer.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => setSelectedCustomer(customer)}
                                                className="px-6 py-2 bg-white text-[#012b3f] border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-[#012b3f] hover:text-white transition-all flex items-center gap-2 float-right"
                                            >
                                                Transfer <Fingerprint size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            <AnimatePresence>
                {selectedCustomer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-[#012b3f]/80 backdrop-blur-md" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="mb-10 text-center">
                                <div className="w-16 h-16 bg-[#012b3f] rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
                                    <AgentIcon size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-[#012b3f]">Portfolio Transfer</h3>
                                <p className="text-sm text-slate-500 mt-2">Reassigning <b>{selectedCustomer.name}</b> to a new security coordinator.</p>
                            </div>

                            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                                {agents?.filter(a => a.status === 'active' && a._id !== selectedCustomer.assignedAgent?._id).map((agent) => (
                                    <button 
                                        key={agent._id}
                                        onClick={() => reassignMutation.mutate({ customerId: selectedCustomer._id, agentId: agent._id })}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between group hover:border-[#0082a1] hover:bg-white transition-all"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-10 h-10 bg-[#012b3f] rounded-xl flex items-center justify-center text-white font-black">{agent.name.charAt(0)}</div>
                                            <div>
                                                <p className="font-black text-sm text-[#012b3f]">{agent.name}</p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{agent.stats?.customers} Assigned Assets</p>
                                            </div>
                                        </div>
                                        <ChevronDown size={14} className="text-slate-300 group-hover:text-[#0082a1] -rotate-90" />
                                    </button>
                                ))}
                            </div>
                            
                            <button onClick={() => setSelectedCustomer(null)} className="w-full mt-10 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-rose-500 transition-colors">Abort Sequence</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Enlist Modal */}
            <AnimatePresence>
                {isAddingAgent && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingAgent(false)} className="absolute inset-0 bg-[#012b3f]/80 backdrop-blur-md" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-4xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center gap-6 mb-12 border-b border-slate-100 pb-8">
                                <div className="w-14 h-14 bg-[#0082a1] rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <UserPlus size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[#012b3f]">Operator Enlistment</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Personnel Integration Protocol</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Identity</label>
                                        <input 
                                            placeholder="John Doe"
                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-6 font-bold text-xs text-[#012b3f] outline-none focus:border-[#0082a1] transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Access Email</label>
                                        <input 
                                            type="email"
                                            placeholder="operator@shield.live"
                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-6 font-bold text-xs text-[#012b3f] outline-none focus:border-[#0082a1] transition-all"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Security Key</label>
                                            <input 
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-6 font-bold text-xs text-[#012b3f] outline-none focus:border-[#0082a1] transition-all"
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Uplink</label>
                                            <input 
                                                placeholder="+1-000-000"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-6 font-bold text-xs text-[#012b3f] outline-none focus:border-[#0082a1] transition-all"
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Station Address</label>
                                        <input 
                                            placeholder="Sector 7, Operational HQ"
                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-6 font-bold text-xs text-[#012b3f] outline-none focus:border-[#0082a1] transition-all"
                                            value={formData.address}
                                            onChange={e => setFormData({...formData, address: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Birth Record</label>
                                            <input 
                                                type="date"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-6 font-bold text-xs text-[#012b3f] outline-none focus:border-[#0082a1] transition-all"
                                                value={formData.dob}
                                                onChange={e => setFormData({...formData, dob: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Comm. Rate (%)</label>
                                            <input 
                                                type="number"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-xl text-[#012b3f] text-right outline-none focus:border-[#0082a1] transition-all"
                                                value={formData.commissionRate}
                                                onChange={e => setFormData({...formData, commissionRate: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button 
                                            type="button"
                                            onClick={() => setIsAddingAgent(false)}
                                            className="flex-1 h-16 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={createMutation.isLoading}
                                            className="flex-[2] h-16 bg-[#012b3f] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-[#0082a1] transition-all flex items-center justify-center gap-4"
                                        >
                                            {createMutation.isLoading ? "Integrating..." : "Finalize Enlistment"}
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