import React, { useContext, useState } from "react";
import { jsPDF } from "jspdf";
import { 
    Download, CreditCard, Landmark, Banknote,
    ChevronLeft, ChevronRight
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

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['myTransactions', user?.token],
        queryFn: () => api.get('/transactions/my', user.token),
        enabled: !!user?.token,
    });

    const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
    const paginated = transactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const totalPaid = transactions.filter(t => t.status === 'Success' || t.status === 'Successful').reduce((s, t) => s + (t.amount || 0), 0);
    const pendingCount = transactions.filter(t => t.status === 'Pending').length;

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#134e8d]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 font-sans pb-20">
            <div className="mb-10">
                <h1 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">Payment History</h1>
                <p className="text-slate-500 text-sm font-medium">Manage and track all your policy payments, renewals and downloadable receipts.</p>
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
                                            onClick={() => {
                                                const doc = new jsPDF();
                                                
                                                // Receipt Header
                                                doc.setFillColor(30, 58, 138); // Navy Blue
                                                doc.rect(0, 0, 210, 40, 'F');
                                                doc.setTextColor(255, 255, 255);
                                                doc.setFontSize(22);
                                                doc.text("SHIELDPRO INSURANCE", 20, 25);
                                                doc.setFontSize(10);
                                                doc.text("Official Payment Receipt", 20, 32);
                                                
                                                // Transaction Details Box
                                                doc.setDrawColor(241, 245, 249);
                                                doc.setFillColor(248, 250, 252);
                                                doc.roundedRect(20, 50, 170, 80, 3, 3, 'FD');
                                                
                                                doc.setTextColor(100, 116, 139);
                                                doc.setFontSize(9);
                                                doc.text("TRANSACTION DETAILS", 25, 60);
                                                
                                                doc.setTextColor(30, 41, 59);
                                                doc.setFontSize(11);
                                                doc.setFont("helvetica", "bold");
                                                doc.text(`Transaction ID: ${txn.transactionId || `#TXN-${txn._id?.slice(-8).toUpperCase()}`}`, 25, 75);
                                                doc.text(`Policy Name: ${txn.policy?.policyName || 'N/A'}`, 25, 85);
                                                doc.text(`Policy Type: ${txn.policy?.policyType || 'N/A'}`, 25, 95);
                                                doc.text(`Payment Method: ${txn.paymentMethod || 'Online'}`, 25, 105);
                                                doc.text(`Date & Time: ${new Date(txn.createdAt).toLocaleString('en-IN')}`, 25, 115);
                                                
                                                // Amount Section
                                                doc.setFillColor(236, 253, 245);
                                                doc.roundedRect(20, 140, 170, 30, 3, 3, 'F');
                                                doc.setTextColor(5, 150, 105);
                                                doc.setFontSize(14);
                                                doc.text(`AMOUNT PAID: INR ${txn.amount.toLocaleString()}`, 30, 158);
                                                
                                                // Footer
                                                doc.setTextColor(148, 163, 184);
                                                doc.setFontSize(8);
                                                doc.setFont("helvetica", "normal");
                                                doc.text("This is a computer generated receipt and does not require a physical signature.", 105, 270, null, null, "center");
                                                doc.text("© 2026 SHIELDPRO BROKERS • Licensed by IRDAI", 105, 275, null, null, "center");
                                                
                                                doc.save(`Receipt_${txn.transactionId || txn._id}.pdf`);
                                            }}
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
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Displaying {paginated.length} of {transactions.length} records</p>
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

            {/* Bottom stats removed */}


        </div>
    );
};

export default PaymentHistory;
