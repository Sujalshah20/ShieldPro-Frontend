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

    const activePolicies = myPolicies.filter(p => new Date(p.endDate) > new Date()).slice(0, 3);
    const recentClaims = myClaims.slice(0, 3);

    const totalPremium = myTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

    const pendingClaims = myClaims.filter(c => c.status === 'Pending').length;
    const approvedClaims = myClaims.filter(c => c.status === 'Approved').length;

    const stats = [
        { label: "Active Policies", value: activePolicies.length.toString(), icon: Shield, color: "bg-blue-50 text-[#134e8d]" },
        { label: "Pending Claims", value: pendingClaims.toString(), icon: Clock, color: "bg-orange-50 text-orange-600" },
        { label: "Approved Claims", value: approvedClaims.toString(), icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
        { label: "Total Paid", value: `₹${totalPremium.toLocaleString()}`, icon: Wallet, color: "bg-blue-50 text-[#134e8d]" },
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
        { label: "Payments", icon: CreditCard, route: '/customer/payments' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 font-sans px-4">
            {/* Welcome Banner */}
            <Reveal direction="up">
                <div className="relative overflow-hidden bg-[#134e8d] rounded-3xl p-8 md:p-10 text-white shadow-xl">
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
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon size={22} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-0.5">{stat.label}</p>
                                <p className="text-xl font-bold text-[#1e293b]">{stat.value}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Active Policies */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 flex items-center justify-between border-b border-slate-50">
                        <h2 className="text-lg font-bold text-[#134e8d]">My Active Policies</h2>
                        <button 
                            onClick={() => navigate('/customer/policies')}
                            className="text-xs font-bold text-[#134e8d] hover:underline flex items-center gap-1"
                        >
                            View All <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        {activePolicies.length === 0 ? (
                            <div className="px-6 py-16 text-center text-slate-400">
                                <Shield size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-wider">No active policies found.</p>
                                <button 
                                    onClick={() => navigate('/customer/browse')}
                                    className="mt-4 px-6 py-2 bg-blue-50 text-[#134e8d] rounded-xl text-xs font-bold hover:bg-[#134e8d] hover:text-white transition-all"
                                >
                                    Browse Policies
                                </button>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Policy Detail</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Premium</th>
                                        <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activePolicies.map((policy, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800 mb-1">{policy.policy?.policyName || 'Policy'}</span>
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{policy.policyNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-xs font-bold text-slate-600">{policy.policy?.policyType || '—'}</td>
                                            <td className="px-6 py-5">
                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-tight">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800 mb-1">₹{policy.policy?.premiumAmount?.toLocaleString() || '—'}/mo</span>
                                                    <span className="text-[11px] font-bold text-slate-400">Exp: {new Date(policy.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => navigate('/customer/policies')}
                                                    className="inline-flex w-9 h-9 items-center justify-center bg-slate-100 text-[#134e8d] rounded-xl hover:bg-[#134e8d] hover:text-white transition-all shadow-sm"
                                                >
                                                    <ExternalLink size={16} strokeWidth={2.5} />
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
                    <div className="p-6 border-b border-slate-50">
                        <h2 className="text-lg font-bold text-[#134e8d]">Recent Claims</h2>
                    </div>
                    <div className="flex-1 p-6 space-y-5">
                        {recentClaims.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-wider">No claims yet.</p>
                            </div>
                        ) : recentClaims.map((claim, i) => {
                            const colors = getClaimStatusColor(claim.status);
                            return (
                                <div key={i} className="flex items-center justify-between group hover:translate-x-1 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors.bg} transition-transform group-hover:scale-110`}>
                                            <Clock size={18} className={colors.text} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">CLM-{claim._id.slice(-4).toUpperCase()}</span>
                                            <span className="text-sm font-bold text-slate-800 leading-none mb-1">{claim.userPolicy?.policy?.policyName || 'Policy'}</span>
                                            <span className="text-sm font-bold text-[#134e8d]">₹{claim.amount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[9px] font-bold px-2 py-1 rounded-md tracking-wider ${colors.badge}`}>
                                            {claim.status.toUpperCase()}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {new Date(claim.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <button 
                            onClick={() => navigate('/customer/claims')}
                            className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-all border border-slate-100"
                        >
                            View All Claims
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="pb-10">
                <h2 className="text-lg font-bold text-[#134e8d] mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {quickActions.map((action, i) => (
                        <div 
                            key={i} 
                            className="group cursor-pointer"
                            onClick={() => navigate(action.route, action.state ? { state: action.state } : undefined)}
                        >
                            <div className="bg-white aspect-square rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#134e8d] opacity-0 group-hover:opacity-100 transition-all" />
                                <action.icon size={28} strokeWidth={2.5} className="text-[#1e293b] group-hover:text-[#134e8d] transition-all relative z-10" />
                            </div>
                            <p className="mt-4 text-center text-sm font-bold text-slate-600 group-hover:text-[#134e8d] transition-colors">{action.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
