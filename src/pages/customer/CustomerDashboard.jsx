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
    LifeBuoy
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
        { title: "Active Policies", value: safeMyPolicies.length, icon: ShieldCheck, color: "text-primary", bg: "bg-primary/5" },
        { title: "Applications", value: safeMyApplications.filter(a => a.status !== 'Paid').length, icon: ClipboardList, color: "text-accent", bg: "bg-accent/5" },
        { title: "Claims History", value: safeMyClaims.length, icon: Activity, color: "text-header-bg", bg: "bg-header-bg/5" }
    ];

    const handleBuy = (policy) => {
        if (!profile?.name || !profile?.phone) {
            toast({ 
                title: "Complete Profile", 
                description: "Please update your profile information before applying.",
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
        <div className="customer-dashboard p-6 md:p-10 bg-background-main min-h-screen space-y-12 font-display">
            {/* DASHBOARD HERO */}
            <Reveal width="100%" direction="down">
                <section className="relative overflow-hidden rounded-[2.5rem] bg-header-bg p-12 md:p-20 text-white shadow-2xl">
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] left-[20%] w-[300px] h-[300px] bg-accent rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 max-w-4xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="px-5 py-2 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-[3px] text-primary">
                                SECURE ACCOUNT: ACTIVE
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                                MEMBER ID: {user?._id?.slice(-8).toUpperCase()}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
                            WELCOME, <span className="text-primary">{profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'MEMEBER'}</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
                            Your personal secure shield is active. Managing {safeMyPolicies.length} protected assets across your global portfolio.
                        </p>
                    </div>

                    <div className="mt-16 flex flex-wrap gap-8 relative z-10">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Health Status</span>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" />
                                <span className="text-xs font-black uppercase tracking-widest">Shield Active</span>
                            </div>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Service Level</span>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl">
                                <Shield className="w-5 h-5 text-primary" />
                                <span className="text-xs font-black uppercase tracking-widest text-primary">Enterprise Elite</span>
                            </div>
                         </div>
                    </div>
                </section>
            </Reveal>

            {/* ACTION REQUIRED */}
            {(!profile?.nationalId || !profile?.nominee?.name) && (
                <Reveal width="100%" direction="up">
                    <section className="bg-primary/5 border-2 border-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
                        <div className="flex items-center gap-8 text-center md:text-left">
                            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xl shadow-primary/20 transition-transform group-hover:rotate-12">
                                <ShieldCheck size={36} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-header-bg">Validation Required</h3>
                                <p className="font-bold text-slate-500 uppercase tracking-widest text-xs mt-2">Complete your validation records to ensure seamless claim processing.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/customer/profile')}
                            className="px-10 py-5 bg-primary text-white rounded-xl font-black uppercase tracking-[3px] text-xs hover:bg-header-bg transition-all shadow-xl shadow-primary/20"
                        >
                            VERIFY IDENTITY
                        </button>
                    </section>
                </Reveal>
            )}

            {/* QUICK STATS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, idx) => (
                    <Reveal key={s.title} width="100%" delay={idx * 0.1} direction="up">
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
                             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                                <s.icon size={100} className={s.color} />
                            </div>
                            <div className="relative z-10 text-center md:text-left">
                                <div className={`w-16 h-16 ${s.bg} rounded-2xl flex items-center justify-center ${s.color} mb-8 border border-slate-50 mx-auto md:mx-0`}>
                                    <s.icon size={32} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] mb-3">{s.title}</h3>
                                <p className="text-4xl font-black tracking-tight text-header-bg uppercase">{s.value}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </section>

            {/* TAB SYSTEM */}
            <section className="space-y-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 border-b border-slate-200 pb-2">
                    <nav className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                        {['overview','browse','mypolicies','applications','claims'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => navigate(`/customer/${tab === 'overview' ? '' : tab}`)}
                                className={`relative px-8 py-5 text-[10px] font-black uppercase tracking-[4px] transition-all whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'text-primary' 
                                    : 'text-slate-400 hover:text-header-bg'
                                }`}
                            >
                                {tab.replace('mypolicies','Policies').replace('browse','Browse').replace('overview', 'Dashboard').replace('claims', 'Claims').replace('applications', 'Process')}
                                {activeTab === tab && (
                                    <motion.div 
                                        layoutId="activeTabUnderline" 
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-lg shadow-primary/40" 
                                    />
                                )}
                            </button>
                        ))}
                    </nav>
                    
                    {activeTab === 'browse' && (
                        <div className="flex items-center gap-6 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
                            <Toggle isOn={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} labelLeft="Monthly" labelRight="Annual" />
                        </div>
                    )}
                </div>

                {/* CONTENT AREA */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Dashboard Overview */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                                    <div className="lg:col-span-3 space-y-10">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-3xl font-black uppercase tracking-tight text-header-bg flex items-center gap-4">
                                                <ShieldCheck className="text-primary w-8 h-8" /> Active Protected Assets
                                            </h2>
                                            <Link to="/customer/mypolicies" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-header-bg transition-colors">Managed Records →</Link>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            {loading ? (
                                                <CardSkeleton rows={1} cols={2} />
                                            ) : safeMyPolicies.length > 0 ? (
                                                safeMyPolicies.slice(0, 4).map(p => (
                                                    <div key={p._id} className="group p-10 bg-white rounded-[2rem] border border-slate-200 hover:border-primary/50 hover:shadow-2xl transition-all relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                                                            {getPolicyIcon(p.policy?.policyType)}
                                                        </div>
                                                        <div className="relative z-10">
                                                            <div className="flex items-center gap-4 mb-8">
                                                                <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                                                                    {getPolicyIcon(p.policy?.policyType)}
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">{p.policy?.policyType} Protection</span>
                                                            </div>
                                                            <h3 className="text-2xl font-black tracking-tight text-header-bg mb-6 group-hover:text-primary transition-colors uppercase leading-tight">{p.policy?.policyName}</h3>
                                                            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-3">
                                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg" />
                                                                    Global Active
                                                                </span>
                                                                <Link to="/customer/mypolicies" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Details</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                                    <Shield size={48} className="mx-auto mb-6 text-slate-200" />
                                                    <p className="text-sm font-black uppercase tracking-[5px] text-slate-400">No active shields deployed</p>
                                                    <button onClick={()=>navigate('/customer/browse')} className="mt-8 px-10 py-4 bg-header-bg text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">Explore Assets</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="lg:col-span-2 space-y-10">
                                        <h2 className="text-3xl font-black uppercase tracking-tight text-header-bg flex items-center gap-4">
                                            <Activity className="text-accent w-8 h-8" /> Operations Status
                                        </h2>
                                        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                                            {safeMyClaims.length > 0 ? (
                                                <div className="divide-y divide-slate-100">
                                                    {safeMyClaims.slice(0, 4).map(claim => (
                                                        <div key={claim._id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-white transition-colors">
                                                                    <Zap size={24} className="text-slate-300 group-hover:text-primary transition-colors" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-black text-xs text-header-bg uppercase tracking-widest mb-1.5">RECORD-ID: {claim._id.slice(-6).toUpperCase()}</div>
                                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">{new Date(claim.createdAt).toLocaleDateString()}</div>
                                                                </div>
                                                            </div>
                                                            <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                                claim.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                                                claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                            }`}>
                                                                {claim.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-24 text-center">
                                                    <Activity className="mx-auto mb-6 text-slate-100" size={48} />
                                                    <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">No active operations logs</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-primary p-12 rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                                <Headphones size={150} className="text-white" />
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="text-white text-3xl font-black uppercase tracking-tight leading-none mb-6">GLOBAL<br/>SUPPORT HUB</h3>
                                                <p className="text-white/70 text-[10px] font-bold uppercase tracking-[4px] mb-10 leading-relaxed">Direct encrypted uplink to our elite insurance coordinators.</p>
                                                <button className="w-full py-5 bg-white text-header-bg rounded-xl font-black uppercase tracking-[3px] text-xs hover:translate-y-[-5px] transition-all shadow-xl active:scale-95">
                                                    OPEN UPLINK
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Plan Arsenal */}
                            {activeTab === 'browse' && (
                                <div className="space-y-12">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                        <div>
                                            <h2 className="text-4xl font-black uppercase tracking-tight text-header-bg">ASSET <span className="text-primary">ARSENAL</span></h2>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[5px] mt-2">Deploy new protection protocols for your assets</p>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="relative group">
                                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    type="text" 
                                                    placeholder="SEARCH PROTOCOLS..." 
                                                    className="pl-16 pr-8 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none w-full md:w-96 transition-all font-bold text-xs uppercase tracking-widest text-header-bg" 
                                                    value={searchQuery} 
                                                    onChange={e=>setSearchQuery(e.target.value)} 
                                                />
                                            </div>
                                            
                                            <div className="relative group">
                                                <select
                                                    className="appearance-none pl-8 pr-16 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer font-black text-[10px] uppercase tracking-widest text-header-bg"
                                                    value={filterType}
                                                    onChange={e => setFilterType(e.target.value)}
                                                >
                                                    <option value="All">All Assets</option>
                                                    <option value="Life">Biological</option>
                                                    <option value="Health">Medical</option>
                                                    <option value="Vehicle">Logistics</option>
                                                    <option value="Auto">Logistics</option>
                                                    <option value="Property">Infrastructure</option>
                                                    <option value="Travel">Expedition</option>
                                                </select>
                                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {loading ? (
                                            <CardSkeleton rows={2} cols={3} />
                                        ) : filteredPolicies.length > 0 ? (
                                            filteredPolicies.map(pol => (
                                                <div key={pol._id} className="group relative bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-700">
                                                    <div className="p-10">
                                                        <div className="flex justify-between items-start mb-10">
                                                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                                                                {getPolicyIcon(pol.policyType)}
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-3xl font-black tracking-tighter text-header-bg italic">{formatPrice(isAnnual ? pol.premiumAmount : Math.floor(pol.premiumAmount/12))}</span>
                                                                <span className="text-[9px] text-slate-400 block font-black uppercase tracking-[4px] mt-1.5 italic">/ {isAnnual ? 'OPERATIONAL YEAR' : 'SERVICE CYCLE'}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <h3 className="text-2xl font-black mb-4 tracking-tight text-header-bg uppercase group-hover:text-primary transition-colors leading-tight">{pol.policyName}</h3>
                                                        <p className="text-xs font-bold text-slate-400 leading-relaxed mb-10 line-clamp-3 uppercase tracking-wider">
                                                            {pol.description}
                                                        </p>
                                                        
                                                        <div className="space-y-4 mb-12 border-t border-slate-50 pt-8">
                                                            {['MAXIMUM_SHIELDING', 'INSTANT_UPLINK', 'GLOBAL_NETWORK'].map(feature => (
                                                                <div key={feature} className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                                                    <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center p-1 border border-emerald-100 shadow-sm">
                                                                        <CheckCircle size={14} />
                                                                    </div>
                                                                    {feature}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <button 
                                                            className="w-full py-5 bg-header-bg text-white rounded-xl font-black uppercase tracking-[4px] text-xs hover:bg-primary hover:translate-y-[-5px] shadow-xl transition-all active:scale-95" 
                                                            onClick={()=>handleBuy(pol)}
                                                        >
                                                            DEPLOY ASSET
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )) : (
                                            <div className="col-span-full py-40 text-center opacity-40">
                                                <Search size={80} className="mx-auto text-slate-200 mb-8" />
                                                <p className="text-xl font-black uppercase tracking-[8px] text-slate-400">NO MATCHING ASSETS FOUND</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Application Status Pipeline */}
                            {activeTab === 'applications' && (
                                <div className="space-y-12">
                                    <h2 className="text-4xl font-black uppercase tracking-tight text-header-bg">PROCUREMENT <span className="text-accent">PIPELINE</span></h2>
                                    
                                    <div className="grid grid-cols-1 gap-8">
                                        {safeMyApplications.filter(a => a.status !== 'Paid').length > 0 ? (
                                            safeMyApplications.filter(a => a.status !== 'Paid').map(app => (
                                                <div key={app._id} className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-12 transition-all hover:shadow-2xl hover:border-accent/40 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                                                        <Clock size={150} />
                                                    </div>
                                                    <div className="flex items-center gap-10 relative z-10">
                                                        <div className="w-24 h-24 bg-slate-50 text-accent rounded-3xl border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-accent group-hover:text-white transition-all transform group-hover:rotate-6">
                                                            <Zap size={44} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-4 mb-3">
                                                                <span className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/40" />
                                                                <span className="text-[10px] font-black uppercase tracking-[5px] text-accent">Analysis Active</span>
                                                            </div>
                                                            <h3 className="text-3xl font-black tracking-tight text-header-bg uppercase leading-none mb-3">{app.policy?.policyName}</h3>
                                                            <div className="flex items-center gap-5">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.policy?.policyType} Protection</span>
                                                                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">RECORD_ID: {app._id.slice(-8).toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-10 relative z-10">
                                                        <div className="text-right">
                                                            <div className="text-[9px] uppercase font-black text-slate-400 tracking-[4px] mb-3">Protocol Status</div>
                                                            <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
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
                                                                className="px-12 py-5 bg-accent text-white rounded-xl font-black uppercase tracking-[4px] text-xs shadow-2xl shadow-accent/30 hover:bg-header-bg hover:translate-y-[-5px] transition-all"
                                                            >
                                                                FINALIZE PROCUREMENT
                                                            </button>
                                                        ) : (
                                                            <div className="px-10 py-5 bg-slate-50 text-slate-400 rounded-xl font-black uppercase tracking-[3px] text-xs flex items-center gap-4 border border-slate-100">
                                                                <Clock size={18} />
                                                                PROCESSING_UPLINK
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-48 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 opacity-40">
                                                <ClipboardList size={64} className="mx-auto text-slate-200 mb-8" />
                                                <p className="text-xl font-black uppercase tracking-[8px] text-slate-400">NO ACTIVE TARGETS IN PIPELINE</p>
                                                <button onClick={()=>navigate('/customer/browse')} className="mt-10 text-primary font-black uppercase tracking-[4px] text-[10px] hover:text-header-bg transition-colors">Find Your Shield →</button>
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
