import React, { useContext } from "react";
import { 
    Shield, 
    Clock, 
    CheckCircle, 
    Wallet, 
    ExternalLink, 
    Search,
    ShoppingBag,
    FileText,
    Users,
    Headphones,
    PlusCircle,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Reveal from "../../components/common/Reveal";
import { motion } from "framer-motion";

const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);
    const userName = user?.name || "Rahul Sharma";

    const stats = [
        { label: "Active Policies", value: "3", icon: Shield, color: "bg-blue-50 text-blue-600" },
        { label: "Pending Claims", value: "1", icon: Clock, color: "bg-orange-50 text-orange-600" },
        { label: "Approved Claims", value: "5", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
        { label: "Total Premium Paid", value: "₹45,000", icon: Wallet, color: "bg-purple-50 text-purple-600" },
    ];

    const activePolicies = [
        { id: "SS-450921-2023", name: "Health Shield Plus", type: "Health", status: "Active", premium: "₹1,200/mo", exp: "12 Nov 2024" },
        { id: "SS-CAR-8822", name: "Safe Drive Auto", type: "Motor", status: "Active", premium: "₹850/mo", exp: "01 Jan 2025" },
        { id: "SS-HOM-0092", name: "Home Security Max", type: "Property", status: "Active", premium: "₹2,100/mo", exp: "15 Aug 2024" },
    ];

    const recentClaims = [
        { id: "CL-99231", name: "Health Shield Plus", amount: "₹12,400", date: "Oct 24, 2023", status: "PENDING", color: "text-orange-600 bg-orange-100" },
        { id: "CL-98440", name: "Safe Drive Auto", amount: "₹4,200", date: "Sep 12, 2023", status: "APPROVED", color: "text-emerald-600 bg-emerald-100" },
        { id: "CL-98112", name: "Home Security Max", amount: "₹25,000", date: "Aug 05, 2023", status: "REJECTED", color: "text-rose-600 bg-rose-100" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Welcome Banner */}
            <Reveal direction="up">
                <div className="relative overflow-hidden bg-[#124C89] rounded-[1.5rem] p-8 md:p-10 text-white shadow-xl">
                    <div className="relative z-10 max-w-xl">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-sm flex items-center gap-3">
                            Welcome back, {userName}! 👋
                        </h1>
                        <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed">
                            Your insurance dashboard is up to date. You have one claim pending review and 3 active policies protecting your assets.
                        </p>
                    </div>
                    {/* Abstract Decorative Element */}
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 hidden lg:block scale-110">
                         <Shield size={180} />
                    </div>
                    {/* Background Soft Blobs */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -mr-24 -mt-24" />
                </div>
            </Reveal>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-5 rounded-[1.2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-0.5">{stat.label}</p>
                                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Active Policies */}
                <div className="lg:col-span-8 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 pb-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">My Active Policies</h2>
                        <button className="text-[11px] font-bold text-[#124C89] hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Policy Detail</th>
                                    <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Premium</th>
                                    <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {activePolicies.map((policy, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 mb-0.5">{policy.name}</span>
                                                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{policy.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600">{policy.type}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-wide">
                                                {policy.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 mb-0.5">{policy.premium}</span>
                                                <span className="text-[10px] font-semibold text-slate-400">Exp: {policy.exp}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="inline-flex w-8 h-8 items-center justify-center bg-slate-100 text-slate-500 rounded-lg hover:bg-[#124C89] hover:text-white transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
                                                <ExternalLink size={14} strokeWidth={2.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Recent Claims */}
                <div className="lg:col-span-4 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 pb-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Recent Claims</h2>
                    </div>
                    <div className="flex-1 p-6 pt-3 space-y-4">
                        {recentClaims.map((claim, i) => (
                            <div key={i} className="flex items-center justify-between group hover:translate-x-1 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${claim.status === 'PENDING' ? 'bg-orange-50' : claim.status === 'APPROVED' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                                        <Clock size={16} className={claim.status === 'PENDING' ? 'text-orange-600' : claim.status === 'APPROVED' ? 'text-emerald-600' : 'text-rose-600'} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">{claim.id}</span>
                                        <span className="text-[12px] font-medium text-slate-400 leading-tight">{claim.name}</span>
                                        <span className="text-[13px] font-bold text-slate-800 mt-0.5">{claim.amount}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md tracking-wider ${claim.color}`}>
                                        {claim.status}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-400">{claim.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <button className="w-full py-3 border-2 border-slate-100 rounded-[1rem] text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:border-[#124C89]/20 transition-all active:scale-95">
                            View All Claims
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="pb-8">
                <h2 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "New Policy", icon: Search },
                        { label: "Add Item", icon: PlusCircle },
                        { label: "Profile", icon: Users },
                        { label: "Support", icon: Headphones },
                    ].map((action, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="bg-white aspect-square rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <action.icon size={24} strokeWidth={2.5} className="text-slate-800 group-hover:text-[#124C89] transition-colors relative z-10" />
                            </div>
                            <p className="mt-3 text-center text-[12px] font-bold text-slate-600 group-hover:text-[#124C89] transition-colors">{action.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
