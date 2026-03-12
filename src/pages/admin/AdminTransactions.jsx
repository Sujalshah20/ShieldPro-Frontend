import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { TableSkeleton } from "../../components/common/Skeleton";
import { 
    CreditCard, ArrowUpRight, ArrowDownRight, 
    Calendar, User, Shield, Search, 
    Download, FileText, CheckCircle, XCircle
} from "lucide-react";
import { motion } from "framer-motion";

const AdminTransactions = () => {
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['adminTransactions', user?.token],
        queryFn: () => api.get('/transactions', user.token),
        enabled: !!user?.token
    });

    if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={6} /></div>;

    const stats = {
        totalRevenue: transactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
        todayRevenue: transactions?.filter(t => new Date(t.paymentDate).toDateString() === new Date().toDateString())
                                 .reduce((acc, curr) => acc + curr.amount, 0) || 0,
        successCount: transactions?.filter(t => t.status === 'Success').length || 0,
        avgTicket: transactions?.length ? (transactions.reduce((acc, curr) => acc + curr.amount, 0) / transactions.length).toFixed(0) : 0
    };

    const filteredTxns = transactions?.filter(t => 
        t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/export/transactions`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ShieldPro_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    return (
        <div className="p-8 premium-gradient min-h-screen">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">FinOps <span className="text-gold">Intelligence</span></h2>
                    <p className="opacity-70 font-medium text-lg">System-wide transaction monitoring and revenue reconciliation.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-6 py-3 glass border border-gold/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold/10 transition-all text-gold"
                    >
                        <Download size={14} /> Export XLS
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 glass border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        <FileText size={14} /> Monthly Statement
                    </button>
                </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: "Gross Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, trend: "+12.4%", up: true },
                    { label: "Daily Volume", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: ArrowUpRight, trend: "+5.2%", up: true },
                    { label: "Successful Txns", value: stats.successCount, icon: CheckCircle, trend: "99.8%", up: true },
                    { label: "Average Premium", value: `₹${Number(stats.avgTicket).toLocaleString()}`, icon: Shield, trend: "-2.1%", up: false }
                ].map((s, i) => (
                    <div key={i} className="glass p-8 rounded-[3rem] border border-border/50">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-2xl text-gold">
                                <s.icon size={24} />
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {s.trend}
                            </span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{s.label}</p>
                        <h4 className="text-3xl font-black tracking-tighter">{s.value}</h4>
                    </div>
                ))}
            </div>

            <div className="glass rounded-[3rem] border border-border/50 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-border/10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5">
                    <h3 className="text-xl font-bold italic">Transaction Ledger</h3>
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            type="text" 
                            placeholder="Find by Transaction ID or Client Name..." 
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-border/50 rounded-2xl outline-none focus:border-gold transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                                <th className="px-8 py-6">ID / Timestamp</th>
                                <th className="px-8 py-6">Client Identity</th>
                                <th className="px-8 py-6">Policy Context</th>
                                <th className="px-8 py-6">Method</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {filteredTxns?.map((txn, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={txn._id} 
                                    className="hover:bg-white/5 transition-colors group text-sm"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gold uppercase tracking-tighter">{txn.transactionId}</span>
                                            <span className="text-[10px] opacity-40 flex items-center gap-1 mt-1">
                                                <Calendar size={10} /> {new Date(txn.paymentDate).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <User size={14} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{txn.user?.name}</span>
                                                <span className="text-[10px] opacity-40 uppercase tracking-widest">{txn.user?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-gold/50" />
                                            <span className="font-medium">{txn.policy?.policyName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                                            {txn.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-black text-lg">₹{txn.amount.toLocaleString()}</td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                                            txn.status === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {txn.status === 'Success' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {txn.status}
                                        </span>
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

export default AdminTransactions;
