import React, { useContext } from "react";
import { 
    Home, Car, Heart, Plane,
    Clock, CheckCircle2,
    Activity, Shield, Zap, IndianRupee, Layers, ShieldCheck, ChevronRight,
    Award, Briefcase, RefreshCcw, SearchCheck, ArrowRight, Plus,
    Cpu, Command, Layout, Eye, MessageSquare, Wallet, UserCircle, TrendingUp, AlertTriangle
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { useNavigate } from "react-router-dom";

/**
 * Clean & Professional Customer Dashboard for Secure Shield
 * Replaced tactical "Hub" with corporate "Account Overview"
 */
const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const firstName = user?.name?.split(' ')[0] || "Client";

    const policies = [
        { id: "POL-88291", title: "Home Protection", status: "Active", type: "Home", date: "Dec 2026", icon: Home, premium: "₹12,500", color: "from-blue-600/5 to-transparent" },
        { id: "POL-22184", title: "Auto Insurance", status: "Expiring soon", type: "Auto", date: "June 2027", icon: Car, premium: "₹8,400", color: "from-amber-600/5 to-transparent" },
    ];

    const stats = [
        { label: "Active Policies", value: "02", icon: ShieldCheck, color: "text-[#10b981]", bg: "bg-emerald-50" },
        { label: "Pending Claims", value: "01", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Coverage Score", value: "98/100", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Total Insured", value: "₹2.4M", icon: Wallet, color: "text-[#002b45]", bg: "bg-slate-100" },
    ];

    const quickActions = [
        { title: "Apply for New Policy", icon: Plus, path: "/customer/checkout", desc: "Browse our latest insurance plans" },
        { title: "File a New Claim", icon: AlertTriangle, path: "/customer/claims", desc: "Report an incident quickly" },
        { title: "Download ID Cards", icon: UserCircle, path: "/customer/profile", desc: "Access policy documentation" },
    ];

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto">
            {/* Professional Welcome Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <Reveal direction="left">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-emerald-100 text-[#10b981] text-[10px] font-bold uppercase tracking-widest rounded-full">Secure Shield Account</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status: Fully Verified</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#002b45] leading-tight tracking-tight">
                            Welcome back, <span className="text-[#10b981]">{firstName}</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm max-w-lg leading-relaxed">
                            Manage your properties, health, and vehicles with complete peace of mind. Your current coverage is optimized for maximum protection.
                        </p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl flex items-center gap-6 group hover:border-[#10b981] transition-all duration-500">
                        <div className="w-14 h-14 bg-emerald-50 text-[#10b981] rounded-2xl flex items-center justify-center group-hover:bg-[#10b981] group-hover:text-white transition-all duration-500">
                            <ShieldCheck size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Protection Status</span>
                            <span className="text-lg font-bold text-[#002b45]">All Systems Secure</span>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Account Insights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <Reveal key={i} direction="up" delay={0.1 + i * 0.1}>
                        <div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col gap-6 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-125 transition-transform duration-700`}>
                                <s.icon size={80} strokeWidth={1} />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6`}>
                                    <s.icon size={22} strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</span>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-3xl font-extrabold text-[#002b45] tracking-tight">{s.value}</h4>
                                <div className="w-6 h-1 bg-[#10b981] mt-3 rounded-full group-hover:w-12 transition-all duration-500" />
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Active Policies List */}
                <div className="xl:col-span-2 space-y-6">
                    <Reveal direction="up" delay={0.4}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-[#002b45] tracking-tight">Active Policies</h3>
                            <button 
                                onClick={() => navigate('/customer/policies')}
                                className="text-sm font-bold text-[#10b981] hover:underline flex items-center gap-2"
                            >
                                View all policies <ChevronRight size={16} />
                            </button>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {policies.map((p, i) => (
                            <Reveal key={i} direction="up" delay={0.5 + i * 0.1}>
                                <div className="bg-white border border-slate-100 rounded-3xl p-8 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden h-full flex flex-col">
                                    <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${p.color} blur-[60px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700 opacity-60`} />
                                    
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="w-16 h-16 bg-[#002b45] text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                                            <p.icon size={28} strokeWidth={2} />
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border-2 ${
                                            p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {p.status}
                                        </div>
                                    </div>

                                    <div className="mb-8 relative z-10 flex-1">
                                        <h3 className="text-xl font-bold text-[#002b45] mb-2 leading-tight">{p.title}</h3>
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                                            ID: {p.id}
                                        </div>
                                        <div className="flex items-center gap-3 text-lg font-bold text-[#002b45]">
                                            <IndianRupee size={16} className="text-[#10b981]" /> {p.premium} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/ Yearly</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Next Renewal</span>
                                            <span className="text-sm font-bold text-[#002b45]">{p.date}</span>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/customer/policies')}
                                            className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-[#10b981] hover:text-white transition-all group/btn"
                                        >
                                            <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Quick Actions & Support */}
                <div className="space-y-6">
                    <Reveal direction="right" delay={0.6}>
                        <h3 className="text-2xl font-bold text-[#002b45] tracking-tight">Quick Actions</h3>
                    </Reveal>

                    <div className="space-y-4">
                        {quickActions.map((action, i) => (
                            <Reveal key={i} direction="up" delay={0.7 + i * 0.1}>
                                <button 
                                    onClick={() => navigate(action.path)}
                                    className="w-full bg-white border border-slate-100 p-6 rounded-3xl flex items-center gap-5 hover:shadow-xl hover:-translate-x-1 hover:border-[#10b981]/20 transition-all duration-300 group text-left"
                                >
                                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-[#10b981] group-hover:text-white transition-all duration-300">
                                        <action.icon size={22} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#002b45] mb-0.5">{action.title}</span>
                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{action.desc}</span>
                                    </div>
                                    <ChevronRight size={16} className="ml-auto text-slate-300 group-hover:text-[#10b981] transition-colors" />
                                </button>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal direction="up" delay={1.1}>
                        <div className="bg-[#002b45] p-10 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/20 to-transparent opacity-40" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#10b981]">
                                    <MessageSquare size={24} />
                                </div>
                                <h4 className="text-2xl font-bold text-white tracking-tight">Need Expert Assistance?</h4>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                    Our dedicated insurance agents are ready to help with claims, renewals, or answering your questions.
                                </p>
                                <button 
                                    onClick={() => navigate('/customer/messages')}
                                    className="px-8 py-3 bg-[#10b981] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#0da371] active:scale-95 transition-all shadow-lg"
                                >
                                    Signal Support Center
                                </button>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Claims Tracker Overview */}
            <div className="pt-6">
                <Reveal direction="up" delay={1.2}>
                    <div className="bg-slate-50 border border-slate-100 p-8 md:p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-[#002b45] tracking-tight">Track Your Claims</h3>
                            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto md:mx-0">
                                Monitor your active insurance claims and synchronization status across all sectors in real-time.
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <button className="px-6 py-2 bg-[#002b45] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:shadow-lg transition-all">
                                    Open Claims Portal
                                </button>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Tracking Active
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm self-stretch md:self-auto">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <Clock size={24} />
                            </div>
                            <div className="flex flex-col pr-8">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Latest Update</span>
                                <span className="text-sm font-bold text-[#002b45]">Vehicle claim under review</span>
                            </div>
                            <div className="flex -space-x-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default CustomerDashboard;
