import React, { useContext } from "react";
import { 
    Shield, 
    Clock, 
    CheckCircle, 
    Wallet, 
    ExternalLink
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Reveal from "../../components/common/Reveal";
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

    const totalPremium = myTransactions.reduce((acc, t) => acc + (t.amount || 0), 0) || 45000;
    const pendingClaimsCount = myClaims.filter(c => c.status === 'Pending').length || 1;
    const approvedClaimsCount = myClaims.filter(c => c.status === 'Approved').length || 5;

    const stats = [
        { label: "Active Policies", value: "3", icon: Shield, color: "bg-blue-100/50 text-blue-600" },
        { label: "Pending Claims", value: pendingClaimsCount.toString(), icon: Clock, color: "bg-orange-100/50 text-orange-600" },
        { label: "Approved Claims", value: approvedClaimsCount.toString(), icon: CheckCircle, color: "bg-emerald-100/50 text-emerald-600" },
        { label: "Total Premium Paid", value: `₹${totalPremium.toLocaleString()}`, icon: Wallet, color: "bg-purple-100/50 text-purple-600" },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700 font-sans pb-20">
            {/* Welcome Banner */}
            <Reveal direction="up">
                <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-[2rem] p-12 text-white shadow-xl">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl font-black mb-4 tracking-tight flex items-center gap-3">
                            Welcome back, {userName}! 👋
                        </h1>
                        <p className="text-white/80 text-lg font-medium leading-relaxed max-w-lg">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6 group cursor-default">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-105`}>
                                <stat.icon size={26} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Main Content: Full Width Table */}
            <Reveal direction="up" delay={0.4}>
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-10 pb-6 flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">My Active Policies</h2>
                        <button 
                            onClick={() => navigate('/customer/policies')}
                            className="text-[14px] font-black text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto px-6 pb-10">
                        <table className="w-full table-fixed cursor-default">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="w-[35%] px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Policy Detail</th>
                                    <th className="w-[15%] px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                                    <th className="w-[15%] px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="w-[20%] px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Premium</th>
                                    <th className="w-[15%] px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {activePoliciesDisplay.map((policy, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-black text-slate-800 mb-1">{policy.policy?.policyName}</span>
                                                <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase">{policy.policyNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-[14px] font-bold text-slate-500">{policy.policy?.policyType}</td>
                                        <td className="px-8 py-8">
                                            <span className="px-4 py-1.5 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 font-sans">
                                            <div className="flex flex-col">
                                                <span className="text-[16px] font-black text-slate-800 mb-0.5">₹{policy.policy?.premiumAmount?.toLocaleString()}/mo</span>
                                                <span className="text-[11px] font-bold text-slate-400">Exp: {new Date(policy.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-center">
                                            <button 
                                                onClick={() => navigate(`/customer/policy-detail/${policy.policyNumber}`)}
                                                className="w-12 h-12 inline-flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100 group-hover:border-blue-600 group-hover:text-blue-600 hover:group-hover:text-white"
                                            >
                                                <ExternalLink size={18} strokeWidth={2.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default CustomerDashboard;
