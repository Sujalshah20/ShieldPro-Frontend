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
    Headphones, TrendingUp, Clock
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const stats = [
        { title: "Active Shields", value: myPolicies.length, icon: Shield, color: "text-primary", bg: "bg-primary/5" },
        { title: "Review Pipeline", value: myApplications.filter(a => a.status !== 'Paid').length, icon: Clock, color: "text-accent", bg: "bg-accent/5" },
        { title: "Claims Filed", value: myClaims.length, icon: ClipboardList, color: "text-indigo-500", bg: "bg-indigo-500/5" }
    ];

    const handleBuy = (policy) => {
        if (!profile?.name || !profile?.phone) {
            toast({ 
                title: "Incomplete Dossier", 
                description: "Update your profile coordinates before deployment.",
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
            case 'Health': return <Activity className="w-6 h-6" />;
            case 'Vehicle': case 'Auto': return <Truck className="w-6 h-6" />;
            case 'Property': case 'Home': return <Home className="w-6 h-6" />;
            case 'Life': return <Shield className="w-6 h-6" />;
            case 'Travel': return <Globe className="w-6 h-6" />;
            default: return <FileText className="w-6 h-6" />;
        }
    };

    const filteredPolicies = availablePolicies.filter(policy => {
        const matchesSearch = policy.policyName.toLowerCase().includes(searchQuery.toLowerCase());
        const policyType = (policy.policyType || "").toLowerCase();
        const selected = filterType.toLowerCase();
        const matchesType = selected === "all" || policyType === selected;
        return matchesSearch && matchesType;
    });

    return (
        <div className="customer-dashboard p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#10221c] min-h-screen space-y-12">
            {/* COMMANDER HEADER */}
            <Reveal width="100%" direction="down">
                <section className="relative overflow-hidden rounded-[3rem] bg-zinc-900 p-10 md:p-16 text-white shadow-2xl">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[20%] w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
                    </div>

                    <div className="relative z-10 max-w-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-[3px] text-primary">
                                Verified Operator
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[3px] opacity-30">
                                ID: #{user?._id?.slice(-6).toUpperCase() || 'SECURE'}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-tight">
                            WELCOME BACK,<br/>
                            <span className="text-primary">{profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'MEMEBER'}</span>
                        </h1>
                        <p className="text-zinc-400 text-lg font-bold uppercase tracking-wider max-w-xl leading-relaxed opacity-80">
                            Your global protection network is active and monitoring for threats.
                        </p>
                    </div>

                    <div className="mt-12 flex flex-wrap gap-6 relative z-10">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Network Status</span>
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest">Global Secure</span>
                            </div>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Claim Speed</span>
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                                <Zap size={16} className="text-accent" />
                                <span className="text-xs font-black uppercase tracking-widest text-accent">Express Lane</span>
                            </div>
                         </div>
                    </div>
                </section>
            </Reveal>

            {/* ACTION REQUIRED */}
            {(!profile?.nationalId || !profile?.nominee?.name) && (
                <Reveal width="100%" direction="up">
                    <section className="bg-accent/10 border-2 border-accent/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
                        <div className="flex items-center gap-8 text-center md:text-left">
                            <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-white shrink-0 shadow-xl shadow-accent/20 group-hover:scale-110 transition-transform">
                                <AlertCircle size={36} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight text-accent">Security Clearance Required</h3>
                                <p className="font-bold opacity-60 uppercase tracking-widest text-xs mt-1">Provide your National ID and Nominee coordinates for full shield deployment.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/customer/profile')}
                            className="px-10 py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-[3px] whitespace-nowrap hover:translate-y-[-4px] active:scale-95 transition-all shadow-xl shadow-accent/30"
                        >
                            Update Dossier
                        </button>
                    </section>
                </Reveal>
            )}

            {/* STRATEGIC OVERVIEW */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, idx) => (
                    <Reveal key={s.title} width="100%" delay={idx * 0.1} direction="up">
                        <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[2.5rem] border border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-transform">
                                <s.icon size={80} className={s.color} />
                            </div>
                            <div className="relative z-10">
                                <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center ${s.color} mb-6 border border-white/20`}>
                                    <s.icon size={28} />
                                </div>
                                <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[5px] mb-2">{s.title}</h3>
                                <p className="text-3xl font-black italic tracking-tight">{s.value}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </section>

            {/* OPERATIONS CENTRE TABS */}
            <section className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 border-b border-border/50 pb-2">
                    <nav className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                        {['overview','browse','mypolicies','applications','claims'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => navigate(`/customer/${tab === 'overview' ? '' : tab}`)}
                                className={`relative px-6 py-4 text-[10px] font-black uppercase tracking-[3px] transition-all whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'text-primary' 
                                    : 'text-zinc-400 hover:text-foreground'
                                }`}
                            >
                                {tab.replace('mypolicies','Shields').replace('browse','Arsenal').replace('overview', 'Log').replace('claims', 'Operations').replace('applications', 'Pipeline')}
                                {activeTab === tab && (
                                    <motion.div 
                                        layoutId="activeTabUnderline" 
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(1,101,255,0.4)]" 
                                    />
                                )}
                            </button>
                        ))}
                    </nav>
                    
                    {activeTab === 'browse' && (
                        <div className="flex items-center gap-6 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-border/50">
                            <Toggle isOn={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} labelLeft="Monthly" labelRight="Annual" />
                        </div>
                    )}
                </div>

                {/* TAB INTELLIGENCE */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Overview Intelligence */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                                    <div className="lg:col-span-3 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                                                <ShieldCheck className="text-primary w-6 h-6" /> Active Safeguards
                                            </h2>
                                            <Link to="/customer/mypolicies" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Full Inventory</Link>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {loading ? (
                                                <CardSkeleton rows={1} cols={2} />
                                            ) : myPolicies.length > 0 ? (
                                                myPolicies.slice(0, 4).map(p => (
                                                    <div key={p._id} className="group p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                                                            {getPolicyIcon(p.policy?.policyType)}
                                                        </div>
                                                        <div className="relative z-10">
                                                            <div className="flex items-center gap-3 mb-6">
                                                                <span className="w-2 h-6 bg-primary rounded-full" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{p.policy?.policyType}</span>
                                                            </div>
                                                            <h3 className="text-xl font-black leading-tight mb-4 group-hover:text-primary transition-colors italic tracking-tighter uppercase">{p.policy?.policyName}</h3>
                                                            <div className="flex items-center justify-between pt-6 border-t border-border/30">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                                    Operational
                                                                </span>
                                                                <button onClick={() => navigate('/customer/mypolicies')} className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">Details</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full py-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-border/50">
                                                    <p className="text-sm font-black uppercase tracking-[5px] opacity-20">No active assets found</p>
                                                    <button onClick={()=>navigate('/customer/browse')} className="mt-6 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest">Browse Arsenal</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="lg:col-span-2 space-y-8">
                                        <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                                            <TrendingUp className="text-indigo-500 w-6 h-6" /> Live Ops Feedback
                                        </h2>
                                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-border/50 overflow-hidden shadow-sm">
                                            {myClaims.length > 0 ? (
                                                <div className="divide-y divide-border/30">
                                                    {myClaims.slice(0, 4).map(claim => (
                                                        <div key={claim._id} className="p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group">
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-border/50 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                                                                    <ClipboardList className="w-5 h-5 opacity-40" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-black text-xs uppercase tracking-widest mb-1 italic">#CLM-{claim._id.slice(-6).toUpperCase()}</div>
                                                                    <div className="text-[10px] font-black uppercase tracking-[2px] opacity-30">{new Date(claim.createdAt).toLocaleDateString()}</div>
                                                                </div>
                                                            </div>
                                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                                claim.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' : 
                                                                claim.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                                            }`}>
                                                                {claim.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-20 text-center flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                                                        <Activity className="opacity-10" size={32} />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[3px] opacity-20 italic">No operational feedback</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-primary p-10 rounded-[3rem] shadow-2xl shadow-primary/30 relative overflow-hidden group border border-white/10">
                                            <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                                            <Headphones size={32} className="text-white mb-6 opacity-40" />
                                            <h3 className="text-white text-2xl font-black italic uppercase leading-tight mb-4">TACTICAL<br/>SUPPORT 24/7</h3>
                                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-8">Direct line to elite protection handlers for immediate assistance.</p>
                                            <button className="w-full py-4 bg-white text-primary rounded-2xl font-black uppercase tracking-[3px] hover:translate-y-[-5px] active:scale-[0.95] transition-all">
                                                Open Channel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Arsenal Tab Intelligence */}
                            {activeTab === 'browse' && (
                                <div className="space-y-10">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div>
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">PLAN <span className="text-primary">ARSENAL</span></h2>
                                            <p className="text-xs font-bold opacity-40 uppercase tracking-[4px] mt-1">Select your strategic coverage assets</p>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="relative group">
                                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    type="text" 
                                                    placeholder="LOCATE SYSTEM..." 
                                                    className="pl-14 pr-6 py-4 bg-white dark:bg-zinc-900 border border-border/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none w-full md:w-80 transition-all font-bold text-xs uppercase tracking-widest shadow-sm" 
                                                    value={searchQuery} 
                                                    onChange={e=>setSearchQuery(e.target.value)} 
                                                />
                                            </div>
                                            
                                            <div className="relative group">
                                                <select
                                                    className="appearance-none pl-6 pr-12 py-4 bg-white dark:bg-zinc-900 border border-border/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer font-black text-[10px] uppercase tracking-widest shadow-sm"
                                                    value={filterType}
                                                    onChange={e => setFilterType(e.target.value)}
                                                >
                                                    <option value="All">All Arsenals</option>
                                                    <option value="Life">Biological Shield</option>
                                                    <option value="Health">Vitals Guard</option>
                                                    <option value="Vehicle">Fleet Armour</option>
                                                    <option value="Auto">Tactical Drive</option>
                                                    <option value="Property">Asset Base</option>
                                                    <option value="Travel">Global Passage</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                    <TrendingUp size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {loading ? (
                                            <CardSkeleton rows={2} cols={3} />
                                        ) : filteredPolicies.length > 0 ? (
                                            filteredPolicies.map(pol => (
                                                <div key={pol._id} className="group relative bg-white dark:bg-zinc-900 rounded-[3rem] border border-border/50 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-primary/50 transition-all duration-700">
                                                    <div className="p-10">
                                                        <div className="flex justify-between items-start mb-8">
                                                            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-border/50 group-hover:bg-primary group-hover:text-white transition-all group-hover:scale-110 shadow-sm">
                                                                {getPolicyIcon(pol.policyType)}
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-3xl font-black italic tracking-tighter">{formatPrice(isAnnual ? pol.premiumAmount : Math.floor(pol.premiumAmount/12))}</span>
                                                                <span className="text-[9px] text-zinc-400 block font-black uppercase tracking-[4px] mt-1 italic">/ {isAnnual ? 'OPERATIONAL YEAR' : 'SERVICE CYCLE'}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase italic group-hover:text-primary transition-colors">{pol.policyName}</h3>
                                                        <p className="text-xs font-bold text-zinc-400 leading-relaxed mb-8 line-clamp-3 uppercase tracking-wider opacity-60">
                                                            {pol.description}
                                                        </p>
                                                        
                                                        <div className="grid grid-cols-1 gap-4 mb-10">
                                                            {['MAXIMUM DEFENSE', 'RAPID RESPONSE', 'GLOBAL RANGE'].map(feature => (
                                                                <div key={feature} className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-border/10">
                                                                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center p-1 shadow-lg shadow-emerald-500/20">
                                                                        <CheckCircle className="text-white w-full h-full" />
                                                                    </div>
                                                                    {feature}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <button 
                                                            className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black uppercase tracking-[4px] text-xs hover:translate-y-[-5px] shadow-xl hover:shadow-primary/20 transition-all active:scale-95 group-hover:bg-primary group-hover:text-white" 
                                                            onClick={()=>handleBuy(pol)}
                                                        >
                                                            PURCHASE SHIELD
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )) : (
                                            <div className="col-span-full py-32 text-center">
                                                <Search size={64} className="mx-auto text-zinc-200 mb-6 opacity-40" />
                                                <p className="text-xl font-black uppercase tracking-[5px] opacity-20 italic">No matching assets in arsenal</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Applications Pipeline Intelligence */}
                            {activeTab === 'applications' && (
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">PROCUREMENT <span className="text-accent">PIPELINE</span></h2>
                                        <p className="text-[10px] font-black uppercase tracking-[3px] opacity-30 italic">Target tracking & review status</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        {myApplications.filter(a => a.status !== 'Paid').length > 0 ? (
                                            myApplications.filter(a => a.status !== 'Paid').map(app => (
                                                <div key={app._id} className="bg-white dark:bg-zinc-900/50 p-8 md:p-10 rounded-[3.5rem] border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-10 transition-all hover:border-accent/40 shadow-sm relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                                                        <Clock size={120} />
                                                    </div>
                                                    <div className="flex items-center gap-8 relative z-10">
                                                        <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 text-accent rounded-[2rem] border border-border/50 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-accent group-hover:text-white transition-all">
                                                            <Shield size={36} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                                                <span className="text-[10px] font-black uppercase tracking-[4px] text-accent italic">Underwriting Mode</span>
                                                            </div>
                                                            <h3 className="text-2xl font-black italic tracking-tighter uppercase">{app.policy?.policyName}</h3>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{app.policy?.policyType}</span>
                                                                <span className="w-1 h-1 bg-border rounded-full" />
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">ID: #{app._id.slice(-6).toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-6 relative z-10">
                                                        <div className="text-right">
                                                            <div className="text-[9px] uppercase font-black opacity-30 tracking-[3px] mb-2">Clearance Level</div>
                                                            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                                app.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                                app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                                app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                                'bg-zinc-100 text-zinc-600 border-zinc-200'
                                                            }`}>
                                                                {app.status}
                                                            </span>
                                                        </div>

                                                        {app.status === 'Approved' ? (
                                                            <button 
                                                                onClick={() => navigate('/customer/checkout', { state: { policy: app.policy, applicationId: app._id } })}
                                                                className="px-10 py-5 bg-accent text-white rounded-[1.5rem] font-black uppercase tracking-[3px] text-xs shadow-2xl shadow-accent/20 hover:translate-y-[-5px] active:scale-95 transition-all"
                                                            >
                                                                Finalise Procurement
                                                            </button>
                                                        ) : (
                                                            <div className="px-10 py-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-[1.5rem] font-black uppercase tracking-[3px] text-xs flex items-center gap-3">
                                                                <Clock size={16} />
                                                                Analysis In Progress
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-40 text-center bg-white dark:bg-zinc-900/50 rounded-[4rem] border-2 border-dashed border-border/50">
                                                <ClipboardList size={64} className="mx-auto text-zinc-200 mb-6 opacity-40" />
                                                <p className="text-xl font-black uppercase tracking-[5px] opacity-20 italic">No procurement targets</p>
                                                <button onClick={()=>navigate('/customer/browse')} className="mt-8 text-primary font-black uppercase tracking-widest text-[10px] hover:underline">Initialise First Target</button>
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
