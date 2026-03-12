import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { DollarSign, TrendingUp, Calendar, ArrowRight, User, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const AgentCommissions = () => {
    const { user } = useContext(AuthContext);

    const { data: commissions, isLoading } = useQuery({
        queryKey: ['agentCommissions', user?.token],
        queryFn: () => api.get('/agent/commissions', user.token),
        enabled: !!user?.token
    });

    const totalEarned = commissions?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const pendingAmount = commissions?.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0) || 0;

    if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={5} /></div>;

    return (
        <div className="p-8 premium-gradient min-h-screen">
            <div className="mb-12">
                <h2 className="text-4xl font-black mb-2 tracking-tight">Earnings <span className="text-gold">Dashboard</span></h2>
                <p className="opacity-70 font-medium text-lg">Track your performance and collected commissions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass p-8 rounded-[2.5rem] bg-gold/5 border-gold/20">
                    <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-gold-foreground mb-4">
                        <DollarSign size={24} />
                    </div>
                    <p className="text-xs font-black uppercase opacity-40 tracking-widest mb-1">Total Earnings</p>
                    <p className="text-3xl font-black">₹{totalEarned.toLocaleString()}</p>
                </div>
                <div className="glass p-8 rounded-[2.5rem] bg-orange-500/5 border-orange-500/10">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-4">
                        <TrendingUp size={24} />
                    </div>
                    <p className="text-xs font-black uppercase opacity-40 tracking-widest mb-1">Unpaid Commission</p>
                    <p className="text-3xl font-black">₹{pendingAmount.toLocaleString()}</p>
                </div>
                <div className="glass p-8 rounded-[2.5rem] bg-green-500/5 border-green-500/10">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white mb-4">
                        <Calendar size={24} />
                    </div>
                    <p className="text-xs font-black uppercase opacity-40 tracking-widest mb-1">Next Payout</p>
                    <p className="text-3xl font-black">March 31</p>
                </div>
            </div>

            <div className="glass rounded-[3rem] overflow-hidden border border-border/50">
                <div className="p-8 border-b border-border/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold italic">Recent Earnings History</h3>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Showing {commissions?.length || 0} Records</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-50">
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Customer</th>
                                <th className="px-8 py-5">Policy</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {commissions?.map((comm, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={comm._id} 
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-8 py-6 text-sm font-medium opacity-60">
                                        {new Date(comm.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                <User size={14} />
                                            </div>
                                            <span className="font-bold">{comm.customer?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-gold" />
                                            <span className="text-sm font-medium">{comm.policy?.policyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-gold">₹{comm.amount.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            comm.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                        }`}>
                                            {comm.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded-xl">
                                            <ArrowRight size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                            {commissions?.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center opacity-30 italic">No commission records found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgentCommissions;
