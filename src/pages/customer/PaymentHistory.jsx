import React, { useState } from "react";
import { 
    Download, CreditCard, Landmark, Banknote,
    ChevronLeft, ChevronRight, Calendar
} from "lucide-react";
import { motion } from "framer-motion";

const mockTransactions = [
    {
        id: "#TXN-882910",
        policy: "Premium Health Shield",
        policyId: "SS-H-992",
        amount: "12,450.00",
        date: "Oct 24, 2023",
        time: "10:45 AM",
        method: "Credit Card",
        methodIcon: <CreditCard size={16} className="text-gray-500" />,
        status: "Successful"
    },
    {
        id: "#TXN-882909",
        policy: "Family Life Secure",
        policyId: "SS-L-104",
        amount: "25,000.00",
        date: "Sep 12, 2023",
        time: "02:30 PM",
        method: "UPI",
        methodIcon: <Banknote size={16} className="text-gray-500" />,
        status: "Pending"
    },
    {
        id: "#TXN-882894",
        policy: "Comprehensive Motor Policy",
        policyId: "SS-M-441",
        amount: "8,200.00",
        date: "Aug 28, 2023",
        time: "11:15 AM",
        method: "Net Banking",
        methodIcon: <Landmark size={16} className="text-gray-500" />,
        status: "Failed"
    },
    {
        id: "#TXN-882855",
        policy: "Premium Health Shield",
        policyId: "SS-H-992",
        amount: "12,450.00",
        date: "Jul 24, 2023",
        time: "09:30 AM",
        method: "Credit Card",
        methodIcon: <CreditCard size={16} className="text-gray-500" />,
        status: "Successful"
    },
];

const getStatusStyle = (status) => {
    switch (status) {
        case "Successful": return "bg-emerald-50 text-emerald-600";
        case "Pending": return "bg-amber-50 text-amber-600";
        case "Failed": return "bg-rose-50 text-rose-600";
        default: return "bg-gray-100 text-gray-600";
    }
};

const PaymentHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#002b45] mb-1">Payment History</h1>
                    <p className="text-gray-500 text-xs">Manage and track all your policy payments and renewals.</p>
                </div>
                <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm text-xs">
                    <Download size={16} /> Statement
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-col md:flex-row items-end gap-3">
                <div className="flex-1">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">DATE RANGE</p>
                    <div className="flex items-center gap-2">
                        <input type="date" defaultValue="2023-01-01" className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#002b45] bg-gray-50" />
                        <span className="text-xs text-gray-400 shrink-0">to</span>
                        <input type="date" defaultValue="2023-12-31" className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#002b45] bg-gray-50" />
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">POLICY TYPE</p>
                    <select className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#002b45] bg-gray-50">
                        <option>All Policies</option>
                        <option>Health</option>
                        <option>Life</option>
                        <option>Vehicle</option>
                    </select>
                </div>
                <div className="flex-1">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">STATUS</p>
                    <select className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#002b45] bg-gray-50">
                        <option>All Status</option>
                        <option>Successful</option>
                        <option>Pending</option>
                        <option>Failed</option>
                    </select>
                </div>
                <button className="bg-[#002b45] text-white px-5 py-2 rounded-lg font-bold text-[12px] hover:bg-[#003b5c] transition-colors shadow-sm shrink-0">
                    Apply
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
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">DATE & TIME</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">METHOD</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">STATUS</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">RECEIPT</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {mockTransactions.map((txn, idx) => (
                            <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                key={txn.id}
                                className="hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="px-6 py-4 font-bold text-[#002b45] text-xs">{txn.id}</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-[13px]">{txn.policy}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: {txn.policyId}</p>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900 text-sm">{txn.amount}</td>
                                <td className="px-6 py-4">
                                    <p className="text-[13px] text-gray-700">{txn.date}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{txn.time}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                                        {React.cloneElement(txn.methodIcon, { size: 14 })} {txn.method}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit ${getStatusStyle(txn.status)}`}>
                                        <span className={`w-1 h-1 rounded-full ${txn.status === 'Successful' ? 'bg-emerald-500' : txn.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                        {txn.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className={`text-gray-400 hover:text-[#002b45] transition-colors ${txn.status !== 'Successful' ? 'opacity-30 cursor-not-allowed' : ''}`} disabled={txn.status !== 'Successful'}>
                                        <Download size={16} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Showing 1-10 of 48 transactions</p>
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                            <ChevronLeft size={16} />
                        </button>
                        {[1, 2, 3].map(p => (
                            <button key={p} onClick={() => setCurrentPage(p)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === p ? 'bg-[#002b45] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
                        ))}
                        <span className="text-gray-400 text-sm px-1">...</span>
                        <button onClick={() => setCurrentPage(5)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold border border-gray-200 transition-colors ${currentPage === 5 ? 'bg-[#002b45] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>5</button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors" onClick={() => setCurrentPage(p => Math.min(5, p + 1))}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#002b45] rounded-xl p-5 text-white">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-2.5">TOTAL PAID THIS YEAR</p>
                    <p className="text-2xl font-black">₹ 1,42,500.00</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2.5">NEXT RENEWAL DATE</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xl font-black text-[#002b45] mb-0.5">Nov 15, 2023</p>
                            <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
                                <Calendar size={12} /> Motor Policy Renewal
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2.5">PENDING INVOICES</p>
                    <div>
                        <p className="text-xl font-black text-[#002b45] mb-0.5">1 Transaction</p>
                        <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Awaiting Verification
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">© 2023 Secure Shield Insurance Corp. All payments are secured with 256-bit encryption.</p>
        </div>
    );
};

export default PaymentHistory;
