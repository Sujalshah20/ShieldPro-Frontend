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
        default: return "bg-gray-100 text-gray-600";
    }
};

const getMethodIcon = (method) => {
    if (!method) return <CreditCard size={14} className="text-gray-500" />;
    const m = method.toLowerCase();
    if (m.includes('upi') || m.includes('net') || m.includes('bank')) return <Landmark size={14} className="text-gray-500" />;
    if (m.includes('cash') || m.includes('bank')) return <Banknote size={14} className="text-gray-500" />;
    return <CreditCard size={14} className="text-gray-500" />;
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

    const totalPaid = transactions.filter(t => t.status === 'Success').reduce((s, t) => s + (t.amount || 0), 0);
    const pendingCount = transactions.filter(t => t.status === 'Pending').length;

    // Get next renewal from user policies — not available here, show placeholder if no data
    const nextRenewal = null;

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002b45]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Payment History</h1>
                    <p className="text-gray-500 text-xs">Manage and track all your policy payments and renewals.</p>
                </div>
                <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm text-xs">
                    <Download size={16} /> Statement
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-col md:flex-row items-end gap-3">
                <div className="flex-1">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">POLICY TYPE</p>
                    <select
                        value={filterType}
                        onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
                        className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#002b45] bg-gray-50"
                    >
                        <option>All Policies</option>
                        <option>Health</option>
                        <option>Life</option>
                        <option>Vehicle</option>
                        <option>Property</option>
                    </select>
                </div>
                <div className="flex-1">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">STATUS</p>
                    <select
                        value={filterStatus}
                        onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                        className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#002b45] bg-gray-50"
                    >
                        <option>All Status</option>
                        <option>Success</option>
                        <option>Pending</option>
                        <option>Failed</option>
                    </select>
                </div>
                <button
                    onClick={() => { setFilterStatus("All Status"); setFilterType("All Policies"); setCurrentPage(1); }}
                    className="bg-[#002b45] text-white px-5 py-2 rounded-lg font-bold text-[12px] hover:bg-[#003b5c] transition-colors shadow-sm shrink-0"
                >
                    Reset
                </button>
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">TRANSACTION ID</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">POLICY NAME</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">AMOUNT (₹)</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">DATE</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">METHOD</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">STATUS</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">RECEIPT</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-16 text-center text-gray-400 text-sm">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : paginated.map((txn, idx) => (
                            <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.04 }}
                                key={txn._id}
                                className="hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="px-6 py-4 font-bold text-white text-xs">{txn.transactionId || `#TXN-${txn._id?.slice(-6).toUpperCase()}`}</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-[13px]">{txn.policy?.policyName || 'Policy'}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{txn.policy?.policyType || '—'}</p>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900 text-sm">₹{(txn.amount || 0).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <p className="text-[13px] text-gray-700">{new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{new Date(txn.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                                        {getMethodIcon(txn.paymentMethod)} {txn.paymentMethod || 'Online'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit ${getStatusStyle(txn.status)}`}>
                                        <span className={`w-1 h-1 rounded-full ${txn.status === 'Success' ? 'bg-emerald-500' : txn.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                        {txn.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className={`text-gray-400 hover:text-white transition-colors ${txn.status !== 'Success' ? 'opacity-30 cursor-not-allowed' : ''}`} disabled={txn.status !== 'Success'}>
                                        <Download size={16} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Showing {paginated.length} of {filtered.length} transactions</p>
                    <div className="flex items-center gap-2">
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === p ? 'bg-[#002b45] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#002b45] rounded-xl p-5 shadow-sm">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-100/70 mb-2.5">TOTAL PAID</p>
                    <p className="text-2xl font-black !text-white">₹ {totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2.5">TOTAL TRANSACTIONS</p>
                    <p className="text-xl font-black text-white mb-0.5">{transactions.length}</p>
                    <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
                        <Calendar size={12} /> All time
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2.5">PENDING INVOICES</p>
                    <div>
                        <p className="text-xl font-black text-white mb-0.5">{pendingCount} Transaction{pendingCount !== 1 ? 's' : ''}</p>
                        {pendingCount > 0 ? (
                            <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Awaiting Verification
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
                                All cleared
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">© 2024 ShieldPro Insurance. All payments are secured with 256-bit encryption.</p>
        </div>
    );
};

export default PaymentHistory;
