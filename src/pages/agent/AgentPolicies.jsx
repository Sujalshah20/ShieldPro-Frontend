import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { motion } from "framer-motion";
import { Search, Filter, Shield, Activity, Truck, Home, FileText, Star, ArrowUpRight } from "lucide-react";
import { TableSkeleton } from "../../components/common/Skeleton";

const AgentPolicies = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const { data: policies, isLoading } = useQuery({
    queryKey: ['allPolicies', user?.token],
    queryFn: () => api.get('/policies', user.token),
    enabled: !!user?.token
  });

  const filteredPolicies = policies?.filter((policy) => {
    const matchesSearch = policy.policyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || policy.policyType === filterType;
    return matchesSearch && matchesType;
  });

  const getPolicyIcon = (type) => {
    switch(type) {
        case 'Health': return <Activity size={24} />;
        case 'Vehicle': return <Truck size={24} />;
        case 'Property': return <Home size={24} />;
        default: return <FileText size={24} />;
    }
  };

  if (isLoading) return <div className="p-8"><TableSkeleton rows={10} cols={4} /></div>;

  return (
    <div className="p-8 premium-gradient min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">
                Policy <span className="text-gold">Catalog</span>
            </h1>
            <p className="opacity-70 font-medium">Explore and recommend premium protection plans to your clients.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold opacity-50" size={18} />
            <Input
              type="text"
              placeholder="Search plans by name..."
              className="pl-12 h-14 bg-white/5 border-border/50 rounded-2xl focus:border-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-14 bg-white/5 border-border/50 rounded-2xl px-6 hover:bg-gold/10 hover:text-gold border flex gap-2">
                <Filter size={18} /> {filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-premium border-border/50 rounded-2xl p-2 min-w-[180px]">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-40 p-2">Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["All", "Health", "Vehicle", "Property", "Life"].map(type => (
                  <DropdownMenuItem key={type} className="rounded-xl font-bold cursor-pointer" onClick={() => setFilterType(type)}>
                      {type}
                  </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
                <div className="px-3 py-1 bg-gold/5 border border-gold/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gold">
                    {policy.policyType}
                </div>
              </div>

              <h2 className="text-2xl font-black mb-3 group-hover:text-gold transition-colors leading-tight">
                {policy.policyName}
              </h2>
              <p className="opacity-60 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">
                {policy.description}
              </p>

              <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Premium</span>
                      <span className="text-xl font-black text-gold">₹{policy.premiumAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                       <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Coverage</span>
                       <span className="text-sm font-bold">₹{policy.coverageAmount.toLocaleString()}</span>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30">
                <button className="flex-1 py-4 bg-gold text-gold-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  Recommend <Star size={14} />
                </button>
                <button className="flex-1 py-4 bg-white/5 border border-border/50 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  Details <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredPolicies?.length === 0 && (
          <div className="text-center py-32 glass rounded-[3rem] border-dashed">
              <Shield size={64} className="mx-auto mb-6 opacity-10" />
              <h3 className="text-2xl font-bold opacity-30">No matching plans found</h3>
              <p className="opacity-20 max-w-xs mx-auto mt-2">Try adjusting your search or filters to find the right coverage.</p>
          </div>
      )}
    </div>
  );
};

export default AgentPolicies;
