import { 
    Users, FileText, ShieldCheck, 
    ChevronDown, MoreHorizontal,
    ArrowUpRight, AlertCircle, PieChart as PieChartIcon,
    CreditCard, Shield, Heart, Sparkles, Star, Target, Zap, CheckCircle2, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch Agent Stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['agentStats'],
        queryFn: () => api.get('/stats/agent')
    });

    const stats = [
        { 
            label: "Total Customers", 
            value: statsData?.stats?.assignedCustomers || 0, 
            icon: Users, 
            color: "text-[#134e8d]", 
            bg: "bg-blue-50"
        },
        { 
            label: "Pending Applications", 
            value: statsData?.stats?.pendingApplications || 0, 
            icon: FileText, 
            color: "text-amber-600", 
            bg: "bg-amber-50"
        },
        { 
            label: "Claims to Review", 
            value: statsData?.stats?.claimsToReview || 0, 
            icon: AlertCircle, 
            color: "text-rose-600", 
            bg: "bg-rose-50"
        },
        { 
            label: "Month Commission", 
            value: `₹${(statsData?.stats?.totalCommission || 0).toLocaleString()}`, 
            icon: CreditCard, 
            color: "text-emerald-600", 
            bg: "bg-emerald-50"
        },
    ];

    if (statsLoading) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="h-10 w-64 bg-slate-200 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-80 bg-white rounded-2xl border border-slate-100" />
                    <div className="h-80 bg-white rounded-2xl border border-slate-100" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8 font-sans px-4">
            {/* Welcome Section */}
            <div className="pt-2">
                <h1 className="text-2xl font-bold text-[#134e8d] flex items-center gap-2">
                    Welcome back, {user?.name}! 📈
                </h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">Here's your performance snapshot.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center ${s.color} border border-white/50 transition-all group-hover:scale-110`}>
                                <s.icon size={22} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-[11px] font-bold mb-1 uppercase tracking-wider">{s.label}</p>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{s.value}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Premium Dashboard Replacement */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* 1. Main Hero / Welcome Section */}
                <div className="xl:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0c2e59] via-[#134e8d] to-[#1e6cb8] p-8 sm:p-10 text-white shadow-xl flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Shield className="w-64 h-64" />
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-20">
                        <Heart className="w-48 h-48" />
                    </div>
                    <div className="absolute top-10 right-20 opacity-20 hidden sm:block">
                        <Sparkles className="w-16 h-16" />
                    </div>
                    <div className="relative z-10 w-full md:w-5/6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-6 w-max">
                            <Star className="w-4 h-4 text-emerald-300" fill="currentColor" />
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-50">Premium Agent Portal</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
                            Protect More Lives. <br className="hidden sm:block"/> Build More Trust.
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base font-medium mb-8 leading-relaxed max-w-lg">
                            Manage customers, review applications, and support claims with confidence and clarity. Your guidance builds customer confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => navigate('/agent/applications')} className="bg-white text-[#134e8d] px-6 py-3.5 rounded-full font-bold text-sm sm:text-[13px] uppercase tracking-wider shadow-[0_8px_20px_-6px_rgba(255,255,255,0.4)] hover:shadow-none hover:bg-slate-50 transition-all text-center">
                                Review Applications
                            </button>
                            <button onClick={() => navigate('/agent/claims')} className="bg-[#0c2e59]/40 text-white border border-white/30 px-6 py-3.5 rounded-full font-bold text-sm sm:text-[13px] uppercase tracking-wider hover:bg-[#0c2e59]/60 transition-all backdrop-blur-sm text-center">
                                View Pending Claims
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Useful Supporting Info Cards */}
                <div className="flex flex-col gap-6">
                    {/* Card A: Today's Focus */}
                    <div className="bg-gradient-to-br from-blue-50 to-white p-7 rounded-[2rem] border border-blue-100 shadow-sm relative overflow-hidden flex-1 group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100/50 rounded-full opacity-50 group-hover:scale-[2] transition-transform duration-700 ease-in-out" />
                        <div className="relative z-10 h-full flex flex-col justify-center">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#134e8d] mb-5 border border-slate-100">
                                <Target size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 mb-2">Today's Focus</h3>
                            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                                Review pending applications quickly and guide customers toward the right coverage.
                            </p>
                        </div>
                    </div>

                    {/* Card B: Insurance Value Message */}
                    <div className="bg-gradient-to-br from-slate-800 to-[#134e8d] p-7 rounded-[2rem] shadow-lg relative overflow-hidden flex-1 group">
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                            <ShieldCheck size={140} />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-center">
                            <h3 className="text-xl font-extrabold text-white mb-3">Insurance Value</h3>
                            <p className="text-[13px] font-medium text-blue-100 leading-relaxed italic border-l-2 border-blue-400 pl-3">
                                "Insurance is not just a policy — it is peace of mind, financial protection, and family security."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Optional micro stats / highlight chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-2">
                {[
                    { label: "Trusted Service", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                    { label: "Fast App Review", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                    { label: "Customer-First Support", icon: Heart, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
                    { label: "Secure Guidance", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" }
                ].map((chip, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                        className={`flex items-center gap-4 p-4 rounded-[1.5rem] ${chip.bg} border ${chip.border}`}
                    >
                        <div className={`w-10 h-10 flex shrink-0 items-center justify-center bg-white rounded-xl shadow-sm ${chip.color}`}>
                            <chip.icon size={18} strokeWidth={3} />
                        </div>
                        <span className="text-[13px] font-bold text-slate-800 tracking-tight">{chip.label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Agent Tip Row */}
            <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 shadow-sm mt-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
                <div className="w-12 h-12 shrink-0 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 ml-2">
                    <Clock size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <div className="inline-flex items-center gap-1.5 mb-1">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Agent Tip</h4>
                    </div>
                    <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                        Timely follow-up on applications and claims improves trust and conversion rates. Stay proactive!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
