import React, { useContext, useState } from "react";
import { 
    Download, CreditCard, Landmark, Banknote,
    ChevronLeft, ChevronRight, Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";

const getStatusStyle = (status) => {
    switch (status) {
        case "Success": case "Successful": return "bg-emerald-50 text-emerald-600";
        case "Pending": return "bg-amber-50 text-amber-600";
        case "Failed": return "bg-rose-50 text-rose-600";
        default: return "bg-slate-100 text-slate-600";
    }
};

const getMethodIcon = (method) => {
    const iconClass = "text-[#134e8d]";
    if (!method) return <CreditCard size={14} className={iconClass} />;
    const m = method.toLowerCase();
    if (m.includes('upi') || m.includes('net') || m.includes('bank')) return <Landmark size={14} className={iconClass} />;
    if (m.includes('cash')) return <Banknote size={14} className={iconClass} />;
    return <CreditCard size={14} className={iconClass} />;
};

const PAGE_SIZE = 10;

const PaymentHistory = () => {
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("All Status");
    const [filterType, setFilterType] = useState("All Policies");

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['myTransactions', user?.token],
        queryFn: () => api.get('/transactions/my', user.token),
        enabled: !!user?.token,
    });

    const filtered = transactions.filter(t => {
        const statusMatch = filterStatus === "All Status" || t.status === filterStatus;
        const typeMatch = filterType === "All Policies" || t.policy?.policyType === filterType;
        return statusMatch && typeMatch;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const totalPaid = transactions.filter(t => t.status === 'Success' || t.status === 'Successful').reduce((s, t) => s + (t.amount || 0), 0);
    const pendingCount = transactions.filter(t => t.status === 'Pending').length;

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#134e8d]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 font-sans pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Payment History</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage and track all your policy payments, renewals and downloadable receipts.</p>
                </div>
                <button className="flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-600 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm text-xs uppercase tracking-wider">
                    <Download size={16} /> Export Statement
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-end gap-4 shadow-sm">
                <div className="flex-1 w-full">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Policy Category</p>
                    <select
                        value={filterType}
                        onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
                        className="w-full text-xs font-bold text-slate-700 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-50/50 focus:border-[#134e8d] bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                        <option>All Policies</option>
                        <option>Health</option>
                        <option>Life</option>
                        <option>Vehicle</option>
                        <option>Property</option>
                    </select>
                </div>
                <div className="flex-1 w-full">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Transaction Status</p>
                    <select
                        value={filterStatus}
                        onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                        className="w-full text-xs font-bold text-slate-700 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-50/50 focus:border-[#134e8d] bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                        <option>All Status</option>
                        <option>Success</option>
                        <option>Pending</option>
                        <option>Failed</option>
                    </select>
                </div>
                <button
                    onClick={() => { setFilterStatus("All Status"); setFilterType("All Policies"); setCurrentPage(1); }}
                    className="bg-[#134e8d] text-white px-8 py-3 rounded-xl font-bold text-xs hover:bg-[#002b45] transition-all shadow-lg shadow-blue-100 shrink-0 uppercase tracking-wider"
                >
                    Reset Filters
                </button>
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy Details</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount (₹)</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                        No recent transactions matching your filters.
                                    </td>
                                </tr>
                            ) : paginated.map((txn, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={txn._id}
                                    className="hover:bg-slate-50/40 transition-colors group"
                                >
                                    <td className="px-6 py-5">
                                        <span className="font-mono text-xs font-bold text-slate-400">
                                            {txn.transactionId || `#TXN-${txn._id?.slice(-8).toUpperCase()}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-slate-800 text-sm mb-0.5">{txn.policy?.policyName || 'Standard Policy'}</p>
                                        <p className="text-[10px] font-bold text-[#134e8d]/50 uppercase tracking-wider">{txn.policy?.policyType || 'General'}</p>
                                    </td>
                                    <td className="px-6 py-5 text-right font-bold text-slate-900 text-sm">₹{(txn.amount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs text-slate-700 font-bold">{new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wide">{new Date(txn.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3 text-slate-600 text-xs font-bold">
                                            <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                                                {getMethodIcon(txn.paymentMethod)}
                                            </div>
                                            {txn.paymentMethod || 'Online Payment'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-2 border ${getStatusStyle(txn.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${txn.status === 'Success' || txn.status === 'Successful' ? 'bg-emerald-500' : txn.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button 
                                            className={`p-2 rounded-lg transition-all ${txn.status === 'Success' || txn.status === 'Successful' ? 'text-[#134e8d] hover:bg-blue-50 border border-transparent hover:border-blue-100' : 'text-slate-200 cursor-not-allowed border border-transparent'}`} 
                                            disabled={!(txn.status === 'Success' || txn.status === 'Successful')}
                                        >
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-8 py-5 border-t border-slate-50 bg-slate-50/30">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Displaying {paginated.length} of {filtered.length} records</p>
                    <div className="flex items-center gap-2">
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-[#134e8d] hover:border-[#134e8d] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all font-bold"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${currentPage === p ? 'bg-[#134e8d] text-white shadow-md shadow-blue-100' : 'border border-slate-100 text-slate-400 hover:bg-white hover:text-[#134e8d] bg-white'}`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-[#134e8d] hover:border-[#134e8d] disabled:opacity-30 transition-all font-bold"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#134e8d] rounded-2xl p-6 shadow-lg shadow-blue-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100/60 mb-3">Net Premiums Paid</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-white">₹ {totalPaid.toLocaleString()}</p>
                        <span className="text-[10px] font-bold text-blue-100/40 uppercase tracking-tighter">INR</span>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Total Transaction Count</p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-slate-800">{transactions.length}</p>
                        <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                            <Calendar size={14} className="opacity-50" /> Lifecycle Total
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm group">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Verification Required</p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
                        {pendingCount > 0 ? (
                            <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-wider bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Pending
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-50" /> All verified
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[4px] mt-16">
                © 2024 ShieldPro Insurance • All payments are secured with 256-bit AES encryption
            </p>
        </div>
    );
};

export default PaymentHistory;
