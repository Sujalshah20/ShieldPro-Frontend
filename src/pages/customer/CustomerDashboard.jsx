import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/customer.css";
import { useNavigate } from "react-router-dom";
import { User, Shield, CheckCircle, ClipboardList, Search, AlertCircle } from "lucide-react";
import { api } from "../../utils/api";
import Toggle from "../../components/common/Toggle";
import { CardSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../hooks/use-toast";

// This component has been rewritten for a premium desktop experience.
// Layout is intentionally spacious, typography scaled for large screens,
// and interactive elements follow enterprise UI conventions.

const CustomerDashboard = () => {
  const { user, profile } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // derive activeTab from current path
  const activeTab = location.pathname.split('/')[2] || 'overview';

  const [isAnnual, setIsAnnual] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  // read query param for search
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

  useEffect(() => {
    // status notification logic omitted for brevity
  }, [myClaims, user?._id]);

  const loading = isAvailLoading || isMyPolLoading || isClaimsLoading;

  const { data: myApplications = [] } = useQuery({
    queryKey: ["myApplications", user?.token],
    queryFn: () => api.get("/applications/my", user.token),
    enabled: !!user?.token
  });

  const stats = [
    { title: "My Policies", value: myPolicies.length, icon: Shield },
    { title: "Applications", value: myApplications.filter(a => a.status !== 'Paid').length, icon: ClipboardList },
    { title: "Active Claims", value: myClaims.filter(c => c.status === 'Pending').length, icon: CheckCircle }
  ];

  const handleBuy = (policy) => {
    // Before applying, check if profile has minimum data (Name and Phone)
    // Detailed check is inside the ApplicationPage, but this is a quick UX guard
    if (!profile?.name || !profile?.phone) {
      toast({ 
        title: "Profile Incomplete", 
        description: "Please complete your basic profile before applying for policies.",
        variant: "destructive"
      });
      navigate("/customer/profile");
      return;
    }
    navigate("apply", { state: { policy } });
  };

  // utility helpers
  const formatPrice = (n) => `₹${n.toLocaleString()}`;

  // filter available policies based on search and type
  const filteredPolicies = availablePolicies.filter(policy => {
    const matchesSearch = policy.policyName.toLowerCase().includes(searchQuery.toLowerCase());
    const policyType = (policy.policyType || "").toLowerCase();
    const selected = filterType.toLowerCase();
    const matchesType = selected === "all" || policyType === selected;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-12 pb-12">
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 md:p-12 text-white shadow-2xl shadow-blue-500/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome back, {profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Member'}!
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium opacity-90 leading-relaxed">
            Your protection is our priority. Manage your active policies and track claims with ease.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -right-10 top-20 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl" />
        
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-blue-100 opacity-70 leading-none">Account Status</div>
              <div className="text-sm font-semibold text-white">Verified Member</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <div className="text-right">
              <div className="text-xs text-blue-100 opacity-70 leading-none">Member ID</div>
              <div className="text-sm font-semibold text-white">#{user?._id?.slice(-6).toUpperCase() || 'N/A'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Completion Prompt */}
      {(!profile?.nationalId || !profile?.nominee?.name || !profile?.bankDetails?.accountNumber) && (
        <section className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-500/5">
           <div className="flex items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 animate-pulse">
                 <AlertCircle size={32} />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-amber-500 tracking-tight">Complete Your Shield Profile</h3>
                 <p className="opacity-70 font-medium">Adding your National ID and Nominee details ensures 2x faster claim processing.</p>
              </div>
           </div>
           <button 
              onClick={() => navigate('/customer/profile')}
              className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
           >
              Update Profile Now
           </button>
        </section>
      )}

      {/* QUICK STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <div key={s.title} className="group relative overflow-hidden bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 group-hover:opacity-20 transition-opacity bg-blue-600 rounded-full blur-2xl`} />
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <s.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">{s.title}</p>
                <p className="text-3xl font-bold tracking-tight">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* DASHBOARD TABS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-1">
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {['overview','browse','mypolicies','applications','claims'].map(tab => (
              <button
                key={tab}
                onClick={() => navigate(`/customer/${tab === 'overview' ? '' : tab}`)}
                className={`relative px-6 py-3 text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                  ? 'text-gold' 
                  : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.replace('mypolicies','My Policies').replace('browse','Browse Plans').replace('overview', 'Overview').replace('claims', 'Claims').replace('applications', 'Applications')}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gold rounded-t-full" 
                  />
                )}
              </button>
            ))}
          </nav>
          
          {activeTab === 'browse' && (
             <div className="flex items-center gap-4 bg-background p-1 rounded-2xl border border-border">
                <Toggle isOn={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} labelLeft="Monthly" labelRight="Annual" />
             </div>
          )}
        </div>

        {/* TAB CONTENT */}
        <div className="min-h-[400px]">
          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Recent Policies</h2>
                  <button onClick={() => navigate('/customer/mypolicies')} className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {loading ? (
                    <CardSkeleton rows={1} cols={2} />
                  ) : myPolicies.length > 0 ? (
                    myPolicies.slice(0, 4).map(p => (
                      <div key={p._id} className="group flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-border hover:border-blue-500/50 hover:shadow-lg transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                              {p.policy?.policyType}
                            </span>
                            <Shield className="w-5 h-5 text-blue-600/30 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <h3 className="text-lg font-bold leading-tight mb-2">{p.policy?.policyName}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            Secure your future with our {p.policy?.policyType?.toLowerCase()} plan.
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                           <span className="text-sm font-semibold">Active</span>
                           <button className="text-xs font-bold text-blue-600">Details</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-border">
                      <p className="text-muted-foreground">No active policies found.</p>
                      <button onClick={()=>navigate('/customer/browse')} className="mt-4 btn-primary">Browse Policies</button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Recent Claims</h2>
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-border overflow-hidden shadow-sm">
                   {myClaims.length > 0 ? (
                     <div className="divide-y divide-border">
                        {myClaims.slice(0, 3).map(claim => (
                          <div key={claim._id} className="p-5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer text-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <ClipboardList className="w-5 h-5 opacity-50" />
                              </div>
                              <div>
                                <div className="font-bold">Claim #{claim._id.slice(-6)}</div>
                                <div className="text-xs text-muted-foreground">Submitted {new Date(claim.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                              claim.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                              claim.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {claim.status}
                            </span>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="p-8 text-center text-muted-foreground italic text-sm">
                        No recent claims to show.
                     </div>
                   )}
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab Content */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black">My Applications</h2>
                  <p className="text-sm opacity-60 font-medium">Track your underwriting progress.</p>
               </div>
               
               <div className="grid grid-cols-1 gap-4">
                  {myApplications.filter(a => a.status !== 'Paid').length > 0 ? (
                    myApplications.filter(a => a.status !== 'Paid').map(app => (
                      <div key={app._id} className="glass p-6 md:p-8 rounded-[2.5rem] border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-gold/30">
                         <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-gold/10 text-gold rounded-3xl flex items-center justify-center shrink-0">
                               <Shield size={32} />
                            </div>
                            <div>
                               <h3 className="text-xl font-bold">{app.policy?.policyName}</h3>
                               <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">{app.policy?.policyType}</span>
                                  <span className="w-1 h-1 bg-border rounded-full" />
                                  <span className="text-xs font-bold text-gold">ID: #{app._id.slice(-6).toUpperCase()}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex flex-wrap items-center gap-4 md:gap-8">
                            <div className="text-right">
                               <div className="text-[10px] uppercase font-black opacity-30 tracking-widest mb-1">Status</div>
                               <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md ${
                                  app.status === 'Pending' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                                  app.status === 'Approved' ? 'bg-green-100 text-green-600 border border-green-200' :
                                  app.status === 'Rejected' ? 'bg-red-100 text-red-600 border border-red-200' :
                                  'bg-slate-100 text-slate-600'
                               }`}>
                                  {app.status}
                               </span>
                            </div>

                            {app.status === 'Approved' ? (
                               <button 
                                  onClick={() => navigate('/customer/checkout', { state: { policy: app.policy, applicationId: app._id } })}
                                  className="px-8 py-4 bg-gold text-gold-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-gold/30 hover:scale-105 active:scale-95 transition-all"
                               >
                                  Proceed to Payment
                               </button>
                            ) : (
                               <button className="px-8 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-2xl font-black uppercase tracking-widest text-xs cursor-default">
                                  Under Review
                               </button>
                            )}
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center glass rounded-[3rem] border-2 border-dashed border-border">
                       <p className="text-xl font-bold opacity-20">No active applications</p>
                       <button onClick={()=>navigate('/customer/browse')} className="mt-4 text-blue-600 font-bold hover:underline">Start an application</button>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Browse Tab Content */}
          {activeTab === 'browse' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-1">Protection Plans</h2>
                  <p className="text-muted-foreground">Select the coverage that fits your lifestyle.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search coverage..." 
                      className="pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full md:w-64 transition-all" 
                      value={searchQuery} 
                      onChange={e=>setSearchQuery(e.target.value)} 
                    />
                  </div>
                  
                  <select
                    className="px-4 py-3 bg-white dark:bg-zinc-900 border border-border rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer font-medium"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Life">Life Insurance</option>
                    <option value="Health">Health Insurance</option>
                    <option value="Vehicle">Vehicle Insurance</option>
                    <option value="Property">Property Protection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  <CardSkeleton rows={2} cols={3} />
                ) : filteredPolicies.length > 0 ? (
                  filteredPolicies.map(pol => (
                    <div key={pol._id} className="group relative bg-white dark:bg-zinc-900 rounded-[32px] border border-border overflow-hidden hover:shadow-2xl hover:border-gold/50 transition-all duration-500">
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-3 rounded-2xl bg-gold-50 dark:bg-gold-900/20 text-gold-600">
                             <Shield className="w-6 h-6" />
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black">{formatPrice(isAnnual ? pol.premiumAmount : Math.floor(pol.premiumAmount/12))}</span>
                            <span className="text-xs text-muted-foreground block font-medium uppercase tracking-tighter">per {isAnnual ? 'year' : 'month'}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-gold transition-colors">{pol.policyName}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                          Comprehensive {pol.policyType?.toLowerCase()} coverage with premium support and fast payouts.
                        </p>
                        
                        <div className="space-y-3 mb-8">
                           {['Fast Claim Processing', 'Global Coverage', '24/7 Support'].map(feature => (
                             <div key={feature} className="flex items-center gap-3 text-xs font-semibold">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {feature}
                             </div>
                           ))}
                        </div>

                        <button 
                          className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold hover:scale-[1.02] transform transition-all active:scale-100" 
                          onClick={()=>handleBuy(pol)}
                        >
                          Select Plan
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center">
                     <p className="text-2xl font-bold opacity-20">No matching plans found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;
