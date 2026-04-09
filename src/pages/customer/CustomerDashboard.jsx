import React, { useContext } from "react";
import { 
    Shield, 
    Clock, 
    CheckCircle, 
    Wallet
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Reveal from "../../components/common/Reveal";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const userName = user?.name || "User";

    const { data: myPolicies = [], isLoading: policiesLoading } = useQuery({
        queryKey: ['myPolicies', user?.token],
        queryFn: () => api.get('/user-policies', user.token),
        enabled: !!user?.token,
    });

    const { data: myClaims = [], isLoading: claimsLoading } = useQuery({
        queryKey: ['myClaims', user?.token],
        queryFn: () => api.get('/claims', user.token),
        enabled: !!user?.token,
    });

    const { data: myTransactions = [], isLoading: transactionsLoading } = useQuery({
        queryKey: ['myTransactions', user?.token],
        queryFn: () => api.get('/transactions/my', user.token),
        enabled: !!user?.token,
    });

    const { data: myApplications = [], isLoading: applicationsLoading } = useQuery({
        queryKey: ['myApplications', user?.token],
        queryFn: () => api.get('/applications/my', user.token),
        enabled: !!user?.token,
    });

    const activePoliciesCount = myPolicies.filter(p => p.status === 'Active').length;
    const totalPremium = myTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);
    const pendingClaimsCount = myClaims.filter(c => c.status === 'Pending').length;
    const approvedClaimsCount = myClaims.filter(c => c.status === 'Approved').length;
    const approvedApplications = myApplications.filter(a => a.status === 'Approved');

    const stats = [
        { label: "Active Policies", value: activePoliciesCount.toString(), icon: Shield, color: "bg-blue-100/50 text-blue-600" },
        { label: "Pending Claims", value: pendingClaimsCount.toString(), icon: Clock, color: "bg-orange-100/50 text-orange-600" },
        { label: "Approved Claims", value: approvedClaimsCount.toString(), icon: CheckCircle, color: "bg-emerald-100/50 text-emerald-600" },
        { label: "Total Premium Paid", value: `₹${totalPremium.toLocaleString()}`, icon: Wallet, color: "bg-purple-100/50 text-purple-600" },
    ];

    if (policiesLoading || claimsLoading || transactionsLoading || applicationsLoading) {
        return (
            <div className="space-y-12 animate-pulse pb-20">
                <div className="h-64 bg-slate-100 rounded-[2rem]" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
                </div>
                <div className="h-96 bg-slate-100 rounded-[2rem]" />
            </div>
        );
    }

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
                            Your insurance dashboard is up to date. You have {pendingClaimsCount} active {pendingClaimsCount === 1 ? 'claim' : 'claims'} pending review and {activePoliciesCount} active {activePoliciesCount === 1 ? 'policy' : 'policies'} protecting your assets.
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
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Pending Actions Section */}
            {approvedApplications.length > 0 && (
                <Reveal direction="up" delay={0.3}>
                    <div className="bg-amber-50 rounded-[2rem] border border-amber-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-100 italic">
                                🔔
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Pending Action: Payment Required</h2>
                                <p className="text-slate-600 text-[14px] font-medium leading-relaxed">
                                    You have {approvedApplications.length} approved {approvedApplications.length === 1 ? 'application' : 'applications'} ready for activation. 
                                    Pay the premium to start your protection.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            {approvedApplications.map((app) => (
                                <button
                                    key={app._id}
                                    onClick={() => navigate('/customer/checkout', { state: { policy: app.policy, applicationId: app._id } })}
                                    className="px-8 py-3 bg-[#1e3a8a] text-white rounded-full font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10"
                                >
                                    Pay for {app.policy?.policyName}
                                </button>
                            ))}
                        </div>
                    </div>
                </Reveal>
            )}

            {/* Main Content: Full Width Table */}
            <Reveal direction="up" delay={0.4}>
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-10 pb-6 flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">My Active Policies</h2>
                        {myPolicies.length === 0 && (
                            <button 
                                onClick={() => navigate('/customer/policies')}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
                            >
                                Browse Policies →
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto px-6 pb-10">
                        {myPolicies.length > 0 ? (
                            <table className="w-full table-fixed cursor-default">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="w-[35%] px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Policy Detail</th>
                                        <th className="w-[15%] px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                                        <th className="w-[15%] px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="w-[20%] px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Premium</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {myPolicies.map((policy, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[15px] font-black text-slate-800 mb-1">{policy.policy?.policyName}</span>
                                                    <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase">{policy.policyNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 text-[14px] font-bold text-slate-500">{policy.policy?.policyType}</td>
                                            <td className="px-8 py-8">
                                                <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                    policy.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                                                }`}>
                                                    {policy.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 font-sans">
                                                <div className="flex flex-col">
                                                    <span className="text-[16px] font-black text-slate-800 mb-0.5">₹{policy.policy?.premiumAmount?.toLocaleString()}/mo</span>
                                                    <span className="text-[11px] font-bold text-slate-400">Exp: {new Date(policy.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                    <Shield size={40} />
                                </div>
                                <div className="px-4">
                                    <h3 className="text-lg font-black text-slate-800">No Active Policies</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto">You haven't purchased any insurance policies yet. Your protection begins here.</p>
                                </div>
                                <button 
                                    onClick={() => navigate('/customer/policies')}
                                    className="mt-4 px-8 py-3 bg-[#1e3a8a] text-white rounded-full font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                                >
                                    Get Insured Today
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default CustomerDashboard;
