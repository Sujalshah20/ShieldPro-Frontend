import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { Button } from "@/components/lightswind/button";
import { Input } from "@/components/lightswind/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/lightswind/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Filter, Shield, Activity, Truck, Home, FileText, Star, ArrowUpRight, Plus, X } from "lucide-react";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../hooks/use-toast";

const AdminPolicies = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    policyName: "",
    policyType: "Health",
    premiumAmount: "",
    coverageAmount: "",
    durationYears: "",
    description: ""
  });

  const { data: policies, isLoading } = useQuery({
    queryKey: ['adminPolicies', user?.token],
    queryFn: () => api.get('/policies', user.token),
    enabled: !!user?.token
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/policies', data, user.token),
    onSuccess: () => {
        queryClient.invalidateQueries(['adminPolicies']);
        toast({ title: "Policy Initialized", description: "New insurance product is now live." });
        setIsAdding(false);
        setFormData({ policyName: "", policyType: "Health", premiumAmount: "", coverageAmount: "", durationYears: "", description: "" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/policies/${id}`, user.token),
    onSuccess: () => {
        queryClient.invalidateQueries(['adminPolicies']);
        toast({ title: "Product Sunset", description: "Policy has been removed from the catalog." });
    }
  });

  const getPolicyIcon = (type) => {
    switch(type) {
        case 'Health': return <Activity size={24} />;
        case 'Vehicle': return <Truck size={24} />;
        case 'Property': case 'Home': return <Home size={24} />;
        case 'Life': return <Shield size={24} />;
        default: return <FileText size={24} />;
    }
  };

  const filteredPolicies = policies?.filter((policy) => {
    const matchesSearch = policy.policyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || policy.policyType === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={4} /></div>;

  return (
    <div className="p-8 premium-gradient min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight italic">
                Product <span className="text-gold">Catalog</span>
            </h1>
            <p className="opacity-70 font-medium">Manage the system's insurance inventory and risk parameters.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold opacity-50" size={18} />
            <Input
              type="text"
              placeholder="Search assets..."
              className="pl-12 h-14 bg-white/5 border-border/50 rounded-2xl focus:border-gold transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-14 bg-white/5 border-border/50 rounded-2xl px-6 hover:bg-gold/10 hover:text-gold border flex gap-2 font-black uppercase text-[10px] tracking-widest">
                <Filter size={14} /> {filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-premium border-border/50 rounded-2xl p-2 min-w-[180px]">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-40 p-2">Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["All", "Health", "Vehicle", "Home", "Life", "Auto", "Property"].map(type => (
                  <DropdownMenuItem key={type} className="rounded-xl font-bold cursor-pointer" onClick={() => setFilterType(type)}>
                      {type}
                  </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button 
            onClick={() => setIsAdding(true)}
            className="h-14 px-8 bg-gold text-gold-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-2xl shadow-gold/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} /> New Product
          </button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {filteredPolicies?.map((policy, idx) => (
          <motion.div
            key={policy._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass p-1 rounded-[2.5rem] border border-border/50 hover:border-gold/30 transition-all group overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    policy.policyType === 'Health' ? 'bg-red-500/10 text-red-500' :
                    policy.policyType === 'Vehicle' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-gold/10 text-gold'
                }`}>
                  {getPolicyIcon(policy.policyType)}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-1 bg-gold/5 border border-gold/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gold italic">
                        {policy.policyType}
                    </div>
                </div>
              </div>

              <h2 className="text-2xl font-black mb-3 group-hover:text-gold transition-colors leading-tight italic">
                {policy.policyName}
              </h2>
              <p className="opacity-60 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">
                {policy.description}
              </p>

              <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Premium</span>
                      <span className="text-xl font-black text-gold">₹{policy.premiumAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                       <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Coverage</span>
                       <span className="text-sm font-bold">₹{policy.coverageAmount?.toLocaleString()}</span>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30">
                <Link to={`/admin/policies/${policy._id}`} className="flex-1">
                    <button className="w-full py-4 bg-white/5 border border-border/50 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    Insights <ArrowUpRight size={14} />
                    </button>
                </Link>
                <button 
                    onClick={() => deleteMutation.mutate(policy._id)}
                    className="flex-1 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Sunset <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Policy Modal */}
      <AnimatePresence>
        {isAdding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                <motion.div className="relative w-full max-w-2xl glass-premium p-12 rounded-[4rem] border border-white/20 shadow-2xl overflow-hidden">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-4xl font-black italic tracking-tight">Birth <span className="text-gold">Policy</span></h3>
                            <p className="text-xs opacity-40 uppercase tracking-[0.3em] font-black mt-1">Initialize System Asset</p>
                        </div>
                        <div className="p-4 bg-gold/10 rounded-2xl text-gold">
                            <Plus size={32} />
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }}>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Product Name</label>
                                <Input 
                                    className="h-14 bg-white/5 border-border/50 rounded-2xl font-bold"
                                    value={formData.policyName}
                                    onChange={e => setFormData({...formData, policyName: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Asset Class</label>
                                <select 
                                    className="w-full h-14 bg-zinc-900 border border-border/50 rounded-2xl px-4 font-bold outline-none focus:border-gold transition-all"
                                    value={formData.policyType}
                                    onChange={e => setFormData({...formData, policyType: e.target.value})}
                                >
                                    {["Life", "Health", "Vehicle", "Home", "Travel", "Auto", "Property"].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Premium (₹)</label>
                                <Input 
                                    className="h-14 bg-white/5 border-border/50 rounded-2xl font-bold"
                                    type="number"
                                    value={formData.premiumAmount}
                                    onChange={e => setFormData({...formData, premiumAmount: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Coverage (₹)</label>
                                <Input 
                                    className="h-14 bg-white/5 border-border/50 rounded-2xl font-bold"
                                    type="number"
                                    value={formData.coverageAmount}
                                    onChange={e => setFormData({...formData, coverageAmount: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Validity (Years)</label>
                                <Input 
                                    className="h-14 bg-white/5 border-border/50 rounded-2xl font-bold"
                                    type="number"
                                    value={formData.durationYears}
                                    onChange={e => setFormData({...formData, durationYears: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Product Manifesto (Description)</label>
                            <textarea 
                                className="w-full h-32 bg-white/5 border border-border/50 rounded-2xl p-6 outline-none focus:border-gold transition-all font-medium no-scrollbar text-sm"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button 
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="flex-1 py-5 bg-white/5 border border-border/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-black italic"
                            >
                                Cancel Sync
                            </button>
                            <button 
                                type="submit"
                                className="flex-2 py-5 bg-gold text-gold-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-gold/20 font-black italic"
                            >
                                Deploy Asset
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {filteredPolicies?.length === 0 && (
          <div className="text-center py-32 glass rounded-[3rem] border-dashed">
              <Shield size={64} className="mx-auto mb-6 opacity-10" />
              <h3 className="text-2xl font-bold opacity-30">No matching assets found</h3>
              <p className="opacity-20 max-w-xs mx-auto mt-2">Adjust system filters to locate the required insurance product.</p>
          </div>
      )}
    </div>
  );
};

export default AdminPolicies;