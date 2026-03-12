import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { DollarSign, User, ShieldCheck, CheckCircle, Clock, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../hooks/use-toast";

const AdminCommissions = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: commissions, isLoading } = useQuery({
        queryKey: ['adminCommissions', user?.token],
        queryFn: () => api.get('/commissions', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/commissions/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminCommissions']);
            toast({ title: "Payout Processed", description: "Commission status has been updated." });
        }
    });

    const handleExport = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/export/commissions`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ShieldPro_Commissions_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={6} /></div>;

    const stats = {
        totalOutstanding: commissions?.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0) || 0,
        totalPaid: commissions?.filter(c => c.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0) || 0,
        pendingCount: commissions?.filter(c => c.status === 'Pending').length || 0
    };

    return (
        <div className="p-8 premium-gradient min-h-screen">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">Commission <span className="text-gold">Payouts</span></h2>
                    <p className="opacity-70 font-medium text-lg">Manage agent earnings and verify platform profitability.</p>
                </div>
                <div className="flex gap-4 items-center">
                     <button 
                        onClick={handleExport}
                        className="px-6 py-4 glass border border-gold/20 text-gold rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-gold-foreground transition-all mr-4 flex items-center gap-2"
                     >
                        <Search size={14} /> Export Statement
                     </button>
                     <div className="px-8 py-5 glass rounded-[2rem] border border-orange-500/20 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Outstanding</p>
                        <p className="text-2xl font-black text-orange-500">₹{stats.totalOutstanding.toLocaleString()}</p>
                     </div>
                     <div className="px-8 py-5 glass rounded-[2rem] border-green-500/20 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Total Paid</p>
                        <p className="text-2xl font-black text-green-500">₹{stats.totalPaid.toLocaleString()}</p>
                     </div>
                </div>
            </div>

            <div className="glass rounded-[3rem] border border-border/50 overflow-hidden shadow-2xl bg-white/5 backdrop-blur-3xl">
                <div className="p-8 border-b border-border/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <DollarSign className="text-gold" /> Payout Queue
                    </h3>
                    <div className="flex gap-2">
                        <span className="px-4 py-2 bg-gold/10 text-gold rounded-xl text-[10px] font-black uppercase tracking-widest">
                            {stats.pendingCount} Pending Requests
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                                <th className="px-8 py-6">Agent</th>
                                <th className="px-8 py-6">Customer</th>
                                <th className="px-8 py-6">Policy</th>
                                <th className="px-8 py-6">Commission</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Action</th>
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
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold">{comm.agent?.name}</p>
                                                <p className="text-[10px] opacity-40 uppercase tracking-widest mt-0.5">{comm.agent?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-medium text-sm">{comm.customer?.name}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-gold" />
                                            <span className="text-sm font-medium">{comm.policy?.policyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-lg">₹{comm.amount.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                                            comm.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                        }`}>
                                            {comm.status === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                            {comm.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {comm.status === 'Pending' ? (
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: comm._id, status: 'Paid' })}
                                                className="px-6 py-2.5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 hover:brightness-110 transition-all"
                                            >
                                                Process Payout
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Processed</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCommissions;
