import React, { useContext } from "react";
import { 
    Shield, 
    Clock, 
    CheckCircle, 
    Wallet, 
    ExternalLink, 
    Search,
    Headphones,
    PlusCircle,
    Users,
    ChevronRight,
    FileText,
    CreditCard,
    ShoppingCart,
    Check,
    XCircle
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Reveal from "../../components/common/Reveal";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const userName = user?.name || "Rahul Sharma";

    const { data: myPolicies = [] } = useQuery({
        queryKey: ['myPolicies', user?.token],
        queryFn: () => api.get('/user-policies', user.token),
        enabled: !!user?.token,
    });

    const { data: myClaims = [] } = useQuery({
        queryKey: ['myClaims', user?.token],
        queryFn: () => api.get('/claims', user.token),
        enabled: !!user?.token,
    });

    const { data: myTransactions = [] } = useQuery({
        queryKey: ['myTransactions', user?.token],
        queryFn: () => api.get('/transactions/my', user.token),
        enabled: !!user?.token,
    });

    // Mock data if empty to show the design correctly
    const activePoliciesDisplay = myPolicies.length > 0 ? myPolicies : [
        { policyNumber: "SS-450921-2023", policy: { policyName: "Health Shield Plus", policyType: "Health", premiumAmount: 1200 }, endDate: "2024-11-12" },
        { policyNumber: "SS-CAR-8822", policy: { policyName: "Safe Drive Auto", policyType: "Motor", premiumAmount: 850 }, endDate: "2025-01-01" },
        { policyNumber: "SS-HOM-0092", policy: { policyName: "Home Security Max", policyType: "Property", premiumAmount: 2100 }, endDate: "2024-08-15" }
    ];

    const recentClaimsDisplay = myClaims.length > 0 ? myClaims : [
        { _id: "CLM-99231", userPolicy: { policy: { policyName: "Health Shield Plus" } }, amount: 12400, status: "Pending", createdAt: "2023-10-24" },
        { _id: "CLM-98440", userPolicy: { policy: { policyName: "Safe Drive Auto" } }, amount: 4200, status: "Approved", createdAt: "2023-09-12" },
        { _id: "CLM-98112", userPolicy: { policy: { policyName: "Home Security Max" } }, amount: 25000, status: "Rejected", createdAt: "2023-08-05" }
    ];

    const totalPremium = myTransactions.reduce((acc, t) => acc + (t.amount || 0), 0) || 45000;
    const pendingClaimsCount = myClaims.filter(c => c.status === 'Pending').length || 1;
    const approvedClaimsCount = myClaims.filter(c => c.status === 'Approved').length || 5;

    const stats = [
        { label: "Active Policies", value: "3", icon: Shield, color: "bg-blue-100 text-blue-600" },
        { label: "Pending Claims", value: pendingClaimsCount.toString(), icon: Clock, color: "bg-orange-100 text-orange-600" },
        { label: "Approved Claims", value: approvedClaimsCount.toString(), icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
        { label: "Total Premium Paid", value: `₹${totalPremium.toLocaleString()}`, icon: Wallet, color: "bg-purple-100 text-purple-600" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 font-sans pb-10">
            {/* Welcome Banner */}
            <Reveal direction="up">
                <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-[2rem] p-12 text-white shadow-2xl">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl font-black mb-4 tracking-tight drop-shadow-sm flex items-center gap-3">
                            Welcome back, {userName}! 👋
                        </h1>
                        <p className="text-white/80 text-lg font-medium leading-relaxed">
                            Your insurance dashboard is up to date. You have {pendingClaimsCount} claim pending review and 3 active policies protecting your assets.
                        </p>
                    </div>
                    {/* Ghost Shield Watermark */}
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 hidden lg:block rotate-12">
                         <Shield size={220} strokeWidth={1} />
                    </div>
                </div>
            </Reveal>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-105`}>
                                <stat.icon size={26} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: My Active Policies */}
                <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 pb-4 flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">My Active Policies</h2>
                        <button 
                            onClick={() => navigate('/customer/policies')}
                            className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto px-4 pb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Policy Detail</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Premium</th>
                                    <th className="px-6 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {activePoliciesDisplay.map((policy, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-black text-slate-800 mb-1">{policy.policy?.policyName}</span>
                                                <span className="text-[11px] font-black text-slate-400/80 tracking-widest uppercase">{policy.policyNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold text-slate-500">{policy.policy?.policyType}</td>
                                        <td className="px-6 py-6">
                                            <span className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-black text-slate-800 mb-0.5">₹{policy.policy?.premiumAmount?.toLocaleString()}/mo</span>
                                                <span className="text-[11px] font-bold text-slate-400">Exp: {new Date(policy.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <button className="w-10 h-10 inline-flex items-center justify-center bg-slate-100/50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-200/50 hover:border-blue-600">
                                                <ExternalLink size={18} strokeWidth={2.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Recent Claims */}
                <div className="lg:col-span-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 pb-4">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Claims</h2>
                    </div>
                    <div className="flex-1 px-8 space-y-8 pb-8">
                        {recentClaimsDisplay.map((claim, i) => {
                            const isPending = claim.status === 'Pending';
                            const isApproved = claim.status === 'Approved';
                            const isRejected = claim.status === 'Rejected';
                            
                            return (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            isApproved ? 'bg-emerald-50 text-emerald-600' : 
                                            isRejected ? 'bg-rose-50 text-rose-600' : 
                                            'bg-orange-50 text-orange-600'
                                        }`}>
                                            {isApproved ? <Check size={20} strokeWidth={3} /> : 
                                             isRejected ? <XCircle size={20} strokeWidth={3} /> : 
                                             <Clock size={20} strokeWidth={3} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[15px] font-black text-slate-800 leading-tight mb-0.5">{claim._id}</span>
                                            <span className="text-[11px] font-bold text-slate-400 mb-0.5">{claim.userPolicy?.policy?.policyName}</span>
                                            <span className="text-[14px] font-black text-slate-800 mt-0.5">₹{claim.amount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[9px] font-black px-2 py-1 rounded-md tracking-widest ${
                                            isApproved ? 'bg-emerald-100 text-emerald-700' : 
                                            isRejected ? 'bg-rose-100 text-rose-700' : 
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {claim.status.toUpperCase()}
                                        </span>
                                        <span className="text-[11px] font-black text-slate-400">
                                            {new Date(claim.createdAt).toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-8 pt-0 mt-auto">
                        <button 
                            onClick={() => navigate('/customer/claims')}
                            className="w-full py-4 bg-white hover:bg-slate-50 rounded-2xl text-[13px] font-black text-slate-700 transition-all border border-slate-200 shadow-sm"
                        >
                            View All Claims
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight mb-8">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: ShoppingCart, id: 1 },
                        { icon: PlusCircle, id: 2 },
                        { icon: Users, id: 3 },
                        { icon: Headphones, id: 4 }
                    ].map((action, i) => (
                        <div 
                            key={i} 
                            className="group cursor-pointer flex justify-center"
                        >
                            <div className="w-full aspect-square max-w-[140px] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                                <action.icon size={32} strokeWidth={2} className="text-slate-800 group-hover:text-blue-600 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
