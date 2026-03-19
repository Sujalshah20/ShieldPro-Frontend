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
    CreditCard
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
    const userName = user?.name || "Valued Customer";

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

    const activePolicies = myPolicies.filter(p => new Date(p.expiryDate) > new Date()).slice(0, 3);
    const recentClaims = myClaims.slice(0, 3);

    const totalPremium = myTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

    const pendingClaims = myClaims.filter(c => c.status === 'Pending').length;
    const approvedClaims = myClaims.filter(c => c.status === 'Approved').length;

    const stats = [
        { label: "Active Policies", value: activePolicies.length.toString(), icon: Shield, color: "bg-blue-50 text-blue-600" },
        { label: "Pending Claims", value: pendingClaims.toString(), icon: Clock, color: "bg-orange-50 text-orange-600" },
        { label: "Approved Claims", value: approvedClaims.toString(), icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
        { label: "Total Premium Paid", value: `₹${totalPremium.toLocaleString()}`, icon: Wallet, color: "bg-purple-50 text-purple-600" },
    ];

    const getClaimStatusColor = (status) => {
        if (status === 'Pending') return { bg: 'bg-orange-50', text: 'text-orange-600', badge: 'text-orange-600 bg-orange-100' };
        if (status === 'Approved') return { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'text-emerald-600 bg-emerald-100' };
        return { bg: 'bg-rose-50', text: 'text-rose-600', badge: 'text-rose-600 bg-rose-100' };
    };

    const quickActions = [
        { label: "Browse Policies", icon: Search, route: '/customer/browse' },
        { label: "File a Claim", icon: PlusCircle, route: '/customer/claims', state: { openNewClaim: true } },
        { label: "My Profile", icon: Users, route: '/customer/profile' },
        { label: "Payment History", icon: CreditCard, route: '/customer/payments' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Welcome Banner */}
            <Reveal direction="up">
                <div className="relative overflow-hidden bg-[#124C89] rounded-[1.5rem] p-8 md:p-10 text-white shadow-xl">
                    <div className="relative z-10 max-w-xl">
                        <h1 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-sm flex items-center gap-3">
                            Welcome back, {userName}! 👋
                        </h1>
                        <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed">
                            Your insurance dashboard is up to date. You have {pendingClaims} claim{pendingClaims !== 1 ? 's' : ''} pending review and {activePolicies.length} active polic{activePolicies.length !== 1 ? 'ies' : 'y'} protecting your assets.
                        </p>
                    </div>
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 hidden lg:block scale-110">
                         <Shield size={180} />
                    </div>
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
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 pb-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">My Active Policies</h2>
                        <button 
                            onClick={() => navigate('/customer/policies')}
                            className="text-[11px] font-bold text-[#124C89] hover:underline flex items-center gap-1"
                        >
                            View All <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        {activePolicies.length === 0 ? (
                            <div className="px-6 py-12 text-center text-slate-400">
                                <Shield size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm font-medium">No active policies found.</p>
                                <button 
                                    onClick={() => navigate('/customer/browse')}
                                    className="mt-3 text-[#124C89] text-xs font-bold hover:underline"
                                >
                                    Browse Policies →
                                </button>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Policy Detail</th>
                                        <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Premium</th>
                                        <th className="px-6 py-3 text-right text-[9px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {activePolicies.map((policy, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800 mb-0.5">{policy.policy?.policyName || 'Policy'}</span>
                                                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{policy.policyNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-600">{policy.policy?.policyType || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-wide">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800 mb-0.5">₹{policy.policy?.premiumAmount?.toLocaleString() || '—'}/mo</span>
                                                    <span className="text-[10px] font-semibold text-slate-400">Exp: {new Date(policy.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => navigate('/customer/policies')}
                                                    className="inline-flex w-8 h-8 items-center justify-center bg-slate-100 text-slate-500 rounded-lg hover:bg-[#124C89] hover:text-white transition-all group-hover:shadow-md group-hover:-translate-y-0.5"
                                                >
                                                    <ExternalLink size={14} strokeWidth={2.5} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right Column: Recent Claims */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 pb-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Recent Claims</h2>
                    </div>
                    <div className="flex-1 p-6 pt-3 space-y-4">
                        {recentClaims.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <FileText size={36} className="mx-auto mb-2 opacity-30" />
                                <p className="text-xs font-medium">No claims yet.</p>
                            </div>
                        ) : recentClaims.map((claim, i) => {
                            const colors = getClaimStatusColor(claim.status);
                            return (
                                <div key={i} className="flex items-center justify-between group hover:translate-x-1 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                                            <Clock size={16} className={colors.text} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">CLM-{claim._id.slice(-4).toUpperCase()}</span>
                                            <span className="text-[12px] font-medium text-slate-400 leading-tight">{claim.userPolicy?.policy?.policyName || 'Policy'}</span>
                                            <span className="text-[13px] font-bold text-slate-800 mt-0.5">₹{claim.amount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md tracking-wider ${colors.badge}`}>
                                            {claim.status.toUpperCase()}
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400">
                                            {new Date(claim.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <button 
                            onClick={() => navigate('/customer/claims')}
                            className="w-full py-3 border-2 border-slate-100 rounded-[1rem] text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:border-[#124C89]/20 transition-all active:scale-95"
                        >
                            View All Claims
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="pb-8">
                <h2 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <div 
                            key={i} 
                            className="group cursor-pointer"
                            onClick={() => navigate(action.route, action.state ? { state: action.state } : undefined)}
                        >
                            <div className="bg-white aspect-square rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden">
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
