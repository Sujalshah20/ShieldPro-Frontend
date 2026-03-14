import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
    User, Shield, CheckCircle, ClipboardList, 
    Search, AlertCircle, Activity, Truck, 
    Home, FileText, Globe, ArrowRight,
    Zap, Star, ShieldCheck, CreditCard,
    Headphones, TrendingUp, Clock, HeartPulse,
    LifeBuoy, Fingerprint, Lock, ShieldAlert,
    ChevronDown, Terminal, Target
} from "lucide-react";
import { api } from "../../utils/api";
import Toggle from "../../components/common/Toggle";
import { CardSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const CustomerDashboard = () => {
    const { user, profile } = useContext(AuthContext);
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = location.pathname.split('/')[2] || 'overview';

    const [isAnnual, setIsAnnual] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('search') || '';
        if (q) setSearchQuery(q);
    }, [location.search]);

    const { data: availablePolicies = [], isLoading: isAvailLoading } = useQuery({
        queryKey: ["availablePolicies"],
        queryFn: () => api.get("/policies/available")
    });

    const { data: myPolicies = [], isLoading: isMyPolLoading } = useQuery({
        queryKey: ["myPolicies", user?.token],
        queryFn: () => api.get("/user-policies", user.token),
        enabled: !!user?.token
    });

    const { data: myClaims = [], isLoading: isClaimsLoading } = useQuery({
        queryKey: ["myClaims", user?.token],
        queryFn: () => api.get("/claims", user.token),
        enabled: !!user?.token
    });

    const { data: myApplications = [] } = useQuery({
        queryKey: ["myApplications", user?.token],
        queryFn: () => api.get("/applications/my", user.token),
        enabled: !!user?.token
    });

    const loading = isAvailLoading || isMyPolLoading || isClaimsLoading;

    const safeMyPolicies = Array.isArray(myPolicies) ? myPolicies : [];
    const safeMyApplications = Array.isArray(myApplications) ? myApplications : [];
    const safeMyClaims = Array.isArray(myClaims) ? myClaims : [];

    const stats = [
        { title: "Active Shields", value: safeMyPolicies.length, icon: ShieldCheck, color: "text-[#0082a1]", bg: "bg-[#0082a1]/10", tag: "PROTECTED" },
        { title: "Pending Uplinks", value: safeMyApplications.filter(a => a.status !== 'Paid').length, icon: Zap, color: "text-amber-500", bg: "bg-amber-50", tag: "IN_QUEUE" },
        { title: "Operational Logs", value: safeMyClaims.length, icon: Activity, color: "text-[#012b3f]", bg: "bg-slate-100", tag: "HISTORY" }
    ];

    const handleBuy = (policy) => {
        if (!profile?.name || !profile?.phone) {
            toast({ 
                title: "Incomplete Profile", 
                description: "Security protocols require a complete profile before asset deployment.",
                variant: "destructive"
            });
            navigate("/customer/profile");
            return;
        }
        navigate("apply", { state: { policy } });
    };

    const formatPrice = (n) => `₹${n.toLocaleString()}`;

    const getPolicyIcon = (type) => {
        switch(type) {
            case 'Health': return <HeartPulse className="w-6 h-6" />;
            case 'Vehicle': case 'Auto': return <Truck className="w-6 h-6" />;
            case 'Property': case 'Home': return <Home className="w-6 h-6" />;
            case 'Life': return <Shield className="w-6 h-6" />;
            case 'Travel': return <Globe className="w-6 h-6" />;
            default: return <FileText className="w-6 h-6" />;
        }
    };

    const safeAvailablePolicies = Array.isArray(availablePolicies) ? availablePolicies : [];
    const filteredPolicies = safeAvailablePolicies.filter(policy => {
        const matchesSearch = policy.policyName?.toLowerCase().includes(searchQuery.toLowerCase());
        const policyType = (policy.policyType || "").toLowerCase();
        const selected = filterType.toLowerCase();
        const matchesType = selected === "all" || policyType === selected;
        return matchesSearch && matchesType;
    });

    return (
        <div className="customer-dashboard p-4 md:p-8 bg-[#dae5e5] min-h-screen space-y-10 font-display">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-[#0082a1] rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Citizen Command Node</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#012b3f] uppercase tracking-tight">
                        Welcome back, <span className="text-[#0082a1] italic">{profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Member'}</span>
                    </h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#012b3f]">Neural_Link: Active</span>
                    </div>
                    <div className="hidden lg:flex px-5 py-2.5 bg-[#012b3f] text-white rounded-2xl items-center gap-4 shadow-xl">
                        <Lock size={14} className="text-[#0082a1]" />
                        <span className="text-[9px] font-black uppercase tracking-widest">ID:{user?._id?.slice(-8).toUpperCase()}</span>
                    </div>
                </div>
            </div>

            {/* HIGH-SECURITY HERO */}
            <Reveal width="100%" direction="down">
                <section className="relative overflow-hidden rounded-[3rem] bg-[#012b3f] p-10 md:p-16 text-white shadow-2xl border border-white/5 group">
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#0082a1]/20 rounded-full blur-[120px] transition-transform duration-[5000ms] group-hover:scale-110" />
                        <div className="absolute bottom-[-10%] left-[20%] w-[300px] h-[300px] bg-slate-500/10 rounded-full blur-[100px]" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 2px, transparent 0)`, backgroundSize: '40px 40px' }} />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                        <div className="max-w-3xl text-center lg:text-left">
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                                <div className="px-4 py-1.5 bg-[#0082a1]/20 border border-[#0082a1]/30 rounded-full text-[9px] font-black uppercase tracking-[3px] text-[#0082a1]">
                                    Global Portfolio Management
                                </div>
                                <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[3px] text-slate-400">
                                    Status: Optimal_Flow
                                </div>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.9] italic">
                                Your <span className="text-[#0082a1]">Personal Shield</span> Is Fully Operational.
                            </h2>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-xl leading-relaxed mx-auto lg:mx-0">
                                Monitoring {safeMyPolicies.length} deployed protection vectors across your enterprise assets. Real-time encryption active on all fiscal channels.
                            </p>
                            
                            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6">
                                <button onClick={()=>navigate('/customer/browse')} className="h-14 px-10 bg-[#0082a1] text-white rounded-xl font-black uppercase tracking-[3px] text-[10px] hover:bg-white hover:text-[#012b3f] transition-all shadow-xl active:scale-95 flex items-center gap-4">
                                    DEPLOY NEW MASK <Zap size={16} fill="currentColor" />
                                </button>
                                <button onClick={()=>navigate('/customer/mypolicies')} className="h-14 px-10 border border-white/10 text-white rounded-xl font-black uppercase tracking-[3px] text-[10px] hover:bg-white/5 transition-all flex items-center gap-4">
                                    VIEW INVENTORY <Shield size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="relative hidden xl:block">
                            <div className="w-64 h-64 bg-white/5 rounded-[4rem] flex items-center justify-center border border-white/10 backdrop-blur-3xl shadow-2xl rotate-3 group-hover:rotate-6 transition-transform duration-700">
                                <Fingerprint size={100} className="text-[#0082a1]" />
                                <div className="absolute inset-x-0 bottom-8 flex justify-center">
                                     <span className="text-[8px] font-black uppercase tracking-[5px] text-white/40">Identity_Verified</span>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#0082a1] rounded-2xl flex items-center justify-center text-white shadow-xl animate-bounce">
                                <ShieldCheck size={24} />
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* SECURITY ADVISORY / ACTION REQUIRED */}
            {(!profile?.nationalId || !profile?.nominee?.name) && (
                <Reveal width="100%" direction="up">
                    <section className="bg-white border-2 border-[#0082a1]/30 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 group shadow-xl">
                        <div className="flex items-center gap-8 text-center md:text-left">
                            <div className="w-16 h-16 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shrink-0 shadow-xl transition-transform group-hover:rotate-12">
                                <Terminal size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-[#012b3f]">Protocol Validation Required</h3>
                                <p className="font-bold text-slate-500 uppercase tracking-widest text-[9px] mt-2 leading-relaxed">Identity manifest incomplete. Security clearance restricted until national credentials are synchronized.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/customer/profile')}
                            className="h-14 px-8 bg-[#012b3f] text-white rounded-xl font-black uppercase tracking-[3px] text-[10px] hover:bg-[#0082a1] transition-all shadow-xl active:scale-95 flex items-center gap-4"
                        >
                            COMMIT DATA <ArrowRight size={16} />
                        </button>
                    </section>
                </Reveal>
            )}

            {/* TACTICAL METRICS Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, idx) => (
                    <Reveal key={s.title} width="100%" delay={idx * 0.1} direction="up">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-xl relative overflow-hidden group hover:border-[#0082a1]/30 transition-all">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                                <s.icon size={120} className={s.color} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center ${s.color} shadow-inner border border-white/50 group-hover:rotate-6 transition-transform`}>
                                        <s.icon size={28} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-[4px] text-slate-300 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">{s.tag}</span>
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] mb-2">{s.title}</h3>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black tracking-tighter text-[#012b3f] uppercase">{s.value}</p>
                                    <span className="text-[10px] font-black text-[#0082a1] uppercase mb-1.5 italic">Total_Logs</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </section>

            {/* ORCHESTRATION HUB (TABS) */}
            <section className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 border-b border-slate-300/50 pb-2">
                    <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                        {['overview','browse','mypolicies','applications','claims'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => navigate(`/customer/${tab === 'overview' ? '' : tab}`)}
                                className={`relative px-4 py-4 text-[10px] font-black uppercase tracking-[4px] transition-all whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'text-[#012b3f]' 
                                    : 'text-slate-400 hover:text-[#0082a1]'
                                }`}
                            >
                                {tab.replace('mypolicies','My_Inventory').replace('browse','Explore').replace('overview', 'Dashboard').replace('claims', 'Operations').replace('applications', 'Pipeline')}
                                {activeTab === tab && (
                                    <motion.div 
                                        layoutId="activeTabUnderline" 
                                        className="absolute bottom-[-2px] left-0 right-0 h-1 bg-[#0082a1] rounded-t-lg shadow-[0_0_10px_#0082a1]" 
                                    />
                                )}
                            </button>
                        ))}
                    </nav>
                    
                    {activeTab === 'browse' && (
                        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                             <span className="text-[8px] font-black text-slate-400 uppercase">Cycle:</span>
                            <Toggle isOn={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} labelLeft="Monthly" labelRight="Annual" />
                        </div>
                    )}
                </div>

                {/* CONTENT AREA */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Dashboard Overview */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                                    <div className="lg:col-span-3 space-y-8">
                                        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                                            <div>
                                                <h2 className="text-2xl font-black uppercase tracking-tight text-[#012b3f] flex items-center gap-3">
                                                    <ShieldCheck className="text-[#0082a1] w-6 h-6" /> Deployed Shields
                                                </h2>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct access to active protections</p>
                                            </div>
                                            <Link to="/customer/mypolicies" className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[3px] text-[#0082a1] hover:text-[#012b3f] transition-colors">
                                                ACCESS FULL MATRIX <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            {loading ? (
                                                <CardSkeleton rows={1} cols={2} />
                                            ) : safeMyPolicies.length > 0 ? (
                                                safeMyPolicies.slice(0, 4).map(p => (
                                                    <div key={p._id} className="group p-8 bg-white rounded-[2.5rem] border border-white hover:border-[#0082a1]/30 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-64">
                                                        <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:rotate-12 group-hover:scale-125 transition-all duration-700">
                                                            {getPolicyIcon(p.policy?.policyType)}
                                                        </div>
                                                        <div className="relative z-10 flex flex-col h-full">
                                                            <div className="flex items-center gap-4 mb-6">
                                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0082a1] border border-slate-100 shadow-sm group-hover:bg-[#012b3f] transition-colors">
                                                                    {getPolicyIcon(p.policy?.policyType)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-[10px] font-black uppercase tracking-tight text-[#012b3f] leading-none mb-1 group-hover:text-[#0082a1] transition-colors line-clamp-2">{p.policy?.policyName}</div>
                                                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.policy?.policyType} Protection</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1" />
                                                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-[#0082a1] flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]" />
                                                                    Operational
                                                                </span>
                                                                <Link to="/customer/mypolicies" className="text-[8px] font-black uppercase tracking-widest text-slate-300 hover:text-[#012b3f] transition-colors border-b border-transparent hover:border-[#012b3f]">Manage</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full py-20 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-300/50 group hover:border-[#0082a1]/50 transition-all">
                                                    <ShieldAlert size={40} className="mx-auto mb-6 text-slate-300 group-hover:text-[#0082a1] transition-colors" />
                                                    <p className="text-[10px] font-black uppercase tracking-[5px] text-slate-400">No active shields deployed</p>
                                                    <button onClick={()=>navigate('/customer/browse')} className="mt-8 px-8 py-3.5 bg-[#012b3f] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#0082a1] transition-all shadow-xl">Explore Arsenal</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="lg:col-span-2 space-y-10">
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight text-[#012b3f] flex items-center gap-3 mb-1">
                                                <Activity className="text-[#0082a1] w-6 h-6" /> Operations Feed
                                            </h2>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Real-time settlement lifecycle logs</p>
                                        </div>

                                        <div className="bg-white rounded-[2.5rem] border border-white shadow-xl overflow-hidden min-h-[300px]">
                                            {safeMyClaims.length > 0 ? (
                                                <div className="divide-y divide-slate-50">
                                                    {safeMyClaims.slice(0, 4).map(claim => (
                                                        <div key={claim._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-[#012b3f] transition-colors">
                                                                    <Terminal size={18} className="text-slate-300 group-hover:text-[#0082a1] transition-colors" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-black text-[10px] text-[#012b3f] uppercase tracking-tighter mb-1">LOG_{claim._id.slice(-6).toUpperCase()}</div>
                                                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(claim.createdAt).toLocaleDateString()}</div>
                                                                </div>
                                                            </div>
                                                            <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                                                                claim.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                                                claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                                            }`}>
                                                                {claim.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-20 text-center uppercase">
                                                    <Activity className="mx-auto mb-6 text-slate-100" size={48} />
                                                    <p className="text-[8px] font-black tracking-[4px] text-slate-400">Inventory Status: Dormant</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-gradient-to-br from-[#012b3f] to-[#0082a1] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                                <LifeBuoy size={120} className="text-white" />
                                            </div>
                                            <div className="relative z-10 text-white">
                                                <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-4">Tactical Support</h3>
                                                <p className="text-white/60 text-[9px] font-bold uppercase tracking-[4px] mb-8 leading-relaxed">Direct encrypted channel for high-priority claim coordination.</p>
                                                <button className="w-full h-14 bg-white text-[#012b3f] rounded-xl font-black uppercase tracking-[3px] text-[10px] hover:translate-y-[-4px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                                                    INITIATE UPLINK <Headphones size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Plan Arsenal */}
                            {activeTab === 'browse' && (
                                <div className="space-y-10">
                                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                                        <div className="relative group w-full lg:w-96">
                                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0082a1] transition-colors" />
                                            <input 
                                                type="text" 
                                                placeholder="FILTER ARSENAL..." 
                                                className="pl-16 pr-8 h-12 bg-white border border-slate-200 rounded-xl focus:border-[#0082a1] outline-none w-full transition-all font-bold text-[10px] uppercase tracking-widest text-[#012b3f] shadow-sm" 
                                                value={searchQuery} 
                                                onChange={e=>setSearchQuery(e.target.value)} 
                                            />
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="flex items-center gap-3">
                                                 <span className="text-[9px] font-black text-slate-400 uppercase">Sector:</span>
                                                 <select
                                                    className="pl-6 pr-12 h-11 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-[#012b3f] focus:border-[#0082a1] outline-none cursor-pointer appearance-none shadow-sm"
                                                    value={filterType}
                                                    onChange={e => setFilterType(e.target.value)}
                                                >
                                                    <option value="All">All Domains</option>
                                                    <option value="Life">Biological</option>
                                                    <option value="Health">Clinical</option>
                                                    <option value="Vehicle">Logistics</option>
                                                    <option value="Auto">Mobile_Asset</option>
                                                    <option value="Property">Infrastructure</option>
                                                    <option value="Travel">Expedition</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {loading ? (
                                            <CardSkeleton rows={2} cols={3} />
                                        ) : filteredPolicies.length > 0 ? (
                                            filteredPolicies.map(pol => (
                                                <div key={pol._id} className="group bg-white rounded-[3rem] border border-white overflow-hidden hover:shadow-2xl hover:border-[#0082a1]/40 transition-all duration-500 relative flex flex-col h-full">
                                                    <div className="p-10 flex-1">
                                                        <div className="flex justify-between items-start mb-8">
                                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0082a1] group-hover:bg-[#012b3f] group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                                                                {getPolicyIcon(pol.policyType)}
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-3xl font-black tracking-tighter text-[#012b3f]">₹{Math.floor(isAnnual ? pol.premiumAmount : pol.premiumAmount/12).toLocaleString()}</div>
                                                                <div className="text-[8px] text-slate-400 font-black uppercase tracking-[3px] mt-1 group-hover:text-[#0082a1]">/ {isAnnual ? 'Operational Year' : 'Service Cycle'}</div>
                                                            </div>
                                                        </div>
                                                        
                                                        <h3 className="text-xl font-black mb-4 tracking-tight text-[#012b3f] uppercase group-hover:text-[#0082a1] transition-colors leading-tight line-clamp-2">{pol.policyName}</h3>
                                                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-8 uppercase tracking-widest h-12 overflow-hidden text-ellipsis">
                                                            {pol.description}
                                                        </p>
                                                        
                                                        <div className="space-y-3 mb-10 border-t border-slate-50 pt-8">
                                                            {['MAX_SHIELDING', 'INSTANT_UPLINK'].map(feature => (
                                                                <div key={feature} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                                                    <ShieldCheck size={14} className="text-[#0082a1]" />
                                                                    {feature}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <button 
                                                            className="w-full h-14 bg-[#012b3f] text-white rounded-xl font-black uppercase tracking-[4px] text-[10px] hover:bg-[#0082a1] hover:translate-y-[-4px] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3" 
                                                            onClick={()=>handleBuy(pol)}
                                                        >
                                                            DEPLOY ASSET <Zap size={14} fill="currentColor" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )) : (
                                            <div className="col-span-full py-40 text-center opacity-40 uppercase">
                                                <Search size={64} className="mx-auto text-slate-200 mb-6" />
                                                <p className="text-sm font-black tracking-[8px] text-slate-400">NO MATCHING ASSETS DETECTED</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Procurement Pipeline */}
                            {activeTab === 'applications' && (
                                <div className="space-y-10">
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#012b3f]">Procurement <span className="text-[#0082a1]">Pipeline</span></h2>
                                    
                                    <div className="grid grid-cols-1 gap-8">
                                        {safeMyApplications.filter(a => a.status !== 'Paid').length > 0 ? (
                                            safeMyApplications.filter(a => a.status !== 'Paid').map(app => (
                                                <div key={app._id} className="bg-white p-10 rounded-[2.5rem] border border-white flex flex-col md:flex-row md:items-center justify-between gap-10 transition-all hover:shadow-2xl hover:border-[#0082a1]/40 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                                                        <Target size={150} />
                                                    </div>
                                                    <div className="flex items-center gap-8 relative z-10">
                                                        <div className="w-16 h-16 bg-[#012b3f] text-[#0082a1] rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:bg-[#0082a1] group-hover:text-white transition-all transform group-hover:rotate-6">
                                                            <Zap size={28} strokeWidth={3} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-1.5 h-1.5 bg-[#0082a1] rounded-full animate-pulse" />
                                                                <span className="text-[9px] font-black uppercase tracking-[4px] text-[#0082a1]">Analysis Active</span>
                                                            </div>
                                                            <h3 className="text-2xl font-black tracking-tight text-[#012b3f] uppercase leading-none mb-2">{app.policy?.policyName}</h3>
                                                            <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                                <span>{app.policy?.policyType} Sector</span>
                                                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                                <span>LOG: {app._id.slice(-8).toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-8 relative z-10">
                                                        <div className="text-right">
                                                            <div className="text-[8px] uppercase font-black text-slate-300 tracking-[3px] mb-2">Lifecycle Stage</div>
                                                            <span className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                                app.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                'bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}>
                                                                {app.status}
                                                            </span>
                                                        </div>

                                                        {app.status === 'Approved' ? (
                                                            <button 
                                                                onClick={() => navigate('/customer/checkout', { state: { policy: app.policy, applicationId: app._id } })}
                                                                className="h-14 px-10 bg-[#0082a1] text-white rounded-xl font-black uppercase tracking-[3px] text-[10px] shadow-xl hover:bg-[#012b3f] hover:translate-y-[-4px] transition-all flex items-center gap-3"
                                                            >
                                                                FINALIZE PROCUREMENT <ArrowRight size={16} />
                                                            </button>
                                                        ) : (
                                                            <div className="h-14 px-8 bg-slate-50 text-slate-400 rounded-xl font-black uppercase tracking-[3px] text-[9px] flex items-center gap-4 border border-slate-100">
                                                                <Clock size={16} /> SYNCING_WITH_MAINFRAME
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-40 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-300/50 grayscale opacity-50 group hover:grayscale-0 hover:opacity-100 transition-all">
                                                <ClipboardList size={48} className="mx-auto text-slate-200 mb-6 group-hover:text-[#0082a1] transition-colors" />
                                                <p className="text-sm font-black uppercase tracking-[8px] text-slate-400">PIPELINE: EMPTY</p>
                                                <button onClick={()=>navigate('/customer/browse')} className="mt-8 text-[#0082a1] font-black uppercase tracking-[4px] text-[10px] hover:text-[#012b3f] transition-colors flex items-center gap-3 mx-auto">DEPLOY FIRST SHIELD <ArrowRight size={14} /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

export default CustomerDashboard;
