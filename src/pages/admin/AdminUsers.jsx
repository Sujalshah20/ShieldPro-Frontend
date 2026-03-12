import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    Users, UserPlus, ShieldCheck, ShieldAlert, 
    TrendingUp, Mail, Phone, MapPin, 
    X, CheckCircle, AlertCircle, IndianRupee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const AdminUsers = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("agents"); // agents or reassignment
    const [selectedCustomer, setSelectedCustomer] = useState(null);

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

    const createMutation = useMutation({
        mutationFn: (data) => api.post('/admin/agents', data, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminAgents']);
            toast({ title: "Agent Onboarded", description: "The new agent account is now active." });
            setIsAddingAgent(false);
            setFormData({ name: "", email: "", password: "", phone: "", dob: "", gender: "Male", address: "", commissionRate: 10 });
        },
        onError: (err) => toast({ title: "Registration Failed", description: err.message, variant: "destructive" })
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/admin/agents/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['adminAgents']);
            toast({ 
                title: "Status Synchronized", 
                description: `Agent account has been ${variables.status === 'active' ? 'activated' : 'suspended'}.` 
            });
        }
    });

    const reassignMutation = useMutation({
        mutationFn: (data) => api.put(`/admin/customers/${data.customerId}/reassign`, { agentId: data.agentId }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminCustomers']);
            toast({ title: "Portfolio Moved", description: "Customer has been reassigned to the selected agent." });
            setSelectedCustomer(null);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const queryClient = useQueryClient();
    const [isAddingAgent, setIsAddingAgent] = useState(false);
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", phone: "", 
        dob: "", gender: "Male", address: "", commissionRate: 10
    });

    const totalPortfolio = agents?.reduce((acc, curr) => acc + (curr.stats?.earnings || 0), 0) || 0;

    return (
        <div className="p-8 premium-gradient min-h-screen">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight italic">Agent <span className="text-gold">Orchestration</span></h2>
                    <p className="opacity-70 font-medium text-lg">Manage your distributed workforce and monitor acquisition metrics.</p>
                </div>
                {activeTab === 'agents' && (
                    <button 
                        onClick={() => setIsAddingAgent(true)}
                        className="px-8 py-5 bg-gold text-gold-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-2xl shadow-gold/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        <UserPlus size={18} /> Recruit New Agent
                    </button>
                )}
            </div>

            {/* TAB SELECTOR */}
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={() => setActiveTab('agents')}
                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'agents' ? 'bg-gold text-gold-foreground' : 'glass opacity-50'}`}
                >
                    Agent Force
                </button>
                <button 
                    onClick={() => setActiveTab('reassignment')}
                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reassignment' ? 'bg-gold text-gold-foreground' : 'glass opacity-50'}`}
                >
                    Client Reassignment
                </button>
            </div>

            {activeTab === 'agents' ? (
                <>
                {/* Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                     {[
                        { label: "Active Force", value: agents?.filter(a => a.status === 'active').length, icon: ShieldCheck, color: "gold" },
                        { label: "Direct Clients", value: agents?.reduce((acc, curr) => acc + (curr.stats?.customers || 0), 0), icon: Users, color: "blue" },
                        { label: "Conversion Rate", value: "72%", icon: TrendingUp, color: "green" },
                        { label: "Total AUM", value: `₹${(totalPortfolio / 100000).toFixed(1)}L`, icon: IndianRupee, color: "purple" }
                     ].map((stat, i) => (
                        <div key={i} className="glass p-8 rounded-[3rem] border border-border/50 group hover:border-gold/30 transition-all overflow-hidden relative">
                            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-all`} />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{stat.label}</p>
                            <h4 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                                {stat.value}
                                <stat.icon size={20} className={`text-${stat.color}-500 opacity-50`} />
                            </h4>
                        </div>
                     ))}
                </div>

                <div className="glass rounded-[3rem] border border-border/50 overflow-hidden shadow-2xl bg-white/5 backdrop-blur-3xl">
                    <div className="p-8 border-b border-border/10">
                        <h3 className="text-xl font-bold italic tracking-tight">System Identity Register</h3>
                    </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                                <th className="px-8 py-6">Agent Identity</th>
                                <th className="px-8 py-6">Performance</th>
                                <th className="px-8 py-6">Commission</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Operational Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {agents?.map((agent, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={agent._id} 
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-gold/50 transition-all overflow-hidden">
                                                {agent.profilePic ? (
                                                    <img src={agent.profilePic} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl font-black text-gold">{agent.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg tracking-tight">{agent.name}</p>
                                                <p className="text-[10px] opacity-40 uppercase tracking-widest flex items-center gap-2">
                                                    <Mail size={10} /> {agent.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="opacity-40 font-bold uppercase tracking-widest text-[9px]">Clients</span>
                                                <span className="font-black">{agent.stats?.customers}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="opacity-40 font-bold uppercase tracking-widest text-[9px]">Earnings</span>
                                                <span className="font-black text-gold">₹{agent.stats?.earnings.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gold" style={{ width: `${agent.commissionRate}%` }} />
                                            </div>
                                            <span className="text-xs font-black">{agent.commissionRate}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                                            agent.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {agent.status === 'active' ? <CheckCircle size={12} /> : <ShieldAlert size={12} />}
                                            {agent.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {agent.status === 'active' ? (
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: agent._id, status: 'suspended' })}
                                                className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                                            >
                                                Suspend Access
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: agent._id, status: 'active' })}
                                                className="px-6 py-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/5"
                                            >
                                                Restore Access
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </>
            ) : (
                <div className="glass rounded-[3rem] border border-border/50 overflow-hidden shadow-2xl bg-white/5 backdrop-blur-3xl">
                    <div className="p-8 border-b border-border/10 flex justify-between items-center">
                        <h3 className="text-xl font-bold italic tracking-tight">Global Client Base</h3>
                        <p className="text-[10px] font-black uppercase opacity-40">Total Registered: {customers?.length || 0}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                                    <th className="px-8 py-6">Customer</th>
                                    <th className="px-8 py-6">Current Strategist</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Reassignment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {customers?.map((customer, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={customer._id} 
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg">{customer.name}</span>
                                                <span className="text-[10px] opacity-40 uppercase tracking-widest">{customer.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {customer.assignedAgent ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-gold" />
                                                    <span className="font-medium text-sm">{customer.assignedAgent.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs opacity-30 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                {customer.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => setSelectedCustomer(customer)}
                                                className="px-6 py-2.5 glass border border-gold/20 text-gold rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-gold-foreground transition-all"
                                            >
                                                Switch Agent
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reassignment Selection Modal */}
            <AnimatePresence>
                {selectedCustomer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div className="relative w-full max-w-2xl glass-premium p-12 rounded-[4rem] border border-white/20 shadow-2xl">
                            <h3 className="text-3xl font-black italic mb-2">Reassign <span className="text-gold">{selectedCustomer.name}</span></h3>
                            <p className="opacity-40 text-xs font-black uppercase tracking-widest mb-8">Select a new acquisition strategist</p>

                            <div className="space-y-3 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                                {agents?.filter(a => a.status === 'active' && a._id !== selectedCustomer.assignedAgent?._id).map((agent) => (
                                    <button 
                                        key={agent._id}
                                        onClick={() => reassignMutation.mutate({ customerId: selectedCustomer._id, agentId: agent._id })}
                                        className="w-full p-6 glass border border-border/50 rounded-[2rem] flex items-center justify-between group hover:border-gold transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-gold font-black">
                                                {agent.name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-sm">{agent.name}</p>
                                                <p className="text-[9px] opacity-40 uppercase tracking-widest">{agent.stats?.customers} Current Clients</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:text-gold-foreground transition-all">
                                            <CheckCircle size={14} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Recruitment Modal */}
            <AnimatePresence>
                {isAddingAgent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingAgent(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div className="relative w-full max-w-4xl glass-premium p-12 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden">
                            <h3 className="text-4xl font-black italic mb-2 tracking-tight">Onboard <span className="text-gold">Agent</span></h3>
                            <p className="opacity-40 text-xs font-black uppercase tracking-[0.3em] mb-10">Strategic Force Expansion</p>

                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Full Identity</label>
                                        <input 
                                            placeholder="John Archer"
                                            className="w-full bg-white/5 border border-border/50 rounded-2xl p-5 font-bold outline-none focus:border-gold transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Communication (Email)</label>
                                        <input 
                                            type="email"
                                            placeholder="agent@shieldpro.com"
                                            className="w-full bg-white/5 border border-border/50 rounded-2xl p-5 font-bold outline-none focus:border-gold transition-all"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Secure Passcode</label>
                                            <input 
                                                type="password"
                                                className="w-full bg-white/5 border border-border/50 rounded-2xl p-5 font-bold outline-none focus:border-gold transition-all"
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Contact Link</label>
                                            <input 
                                                className="w-full bg-white/5 border border-border/50 rounded-2xl p-5 font-bold outline-none focus:border-gold transition-all"
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Physical Location</label>
                                        <input 
                                            placeholder="Global HQ, Sector 7"
                                            className="w-full bg-white/5 border border-border/50 rounded-2xl p-5 font-bold outline-none focus:border-gold transition-all"
                                            value={formData.address}
                                            onChange={e => setFormData({...formData, address: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Birth Record</label>
                                            <input 
                                                type="date"
                                                className="w-full bg-white/5 border border-border/50 rounded-2xl p-5 font-bold outline-none focus:border-gold transition-all"
                                                value={formData.dob}
                                                onChange={e => setFormData({...formData, dob: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Commission Rate (%)</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-white/5 border border-border/50 rounded-2xl p-5 font-bold outline-none focus:border-gold transition-all text-gold"
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
                                            className="flex-1 py-5 bg-white/5 border border-border/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={createMutation.isLoading}
                                            className="flex-2 py-5 bg-gold text-gold-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-gold/20 disabled:opacity-50"
                                        >
                                            {createMutation.isLoading ? "Syncing..." : "Initialize Agent Profile"}
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