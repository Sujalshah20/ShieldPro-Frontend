import React, { useState } from "react";
import { 
    Search, Heart, Car, Home, 
    Users, Plane, Activity, CheckCircle2, ChevronDown,
    ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { api } from "../../utils/api";

const tabs = ["All Policies", "Health", "Life", "Vehicle", "Home", "Travel"];

const BrowsePolicies = () => {
    const navigate = useNavigate();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All Policies");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All Types");
    const [priceRange, setPriceRange] = useState("All Prices");
    const [duration, setDuration] = useState("All Durations");
    
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showDurationDropdown, setShowDurationDropdown] = useState(false);

    React.useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const data = await api.get('/policies/available');
                setPolicies(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching policies:", error);
                setPolicies([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    const filteredPolicies = policies.filter(policy => {
        const matchesTab = activeTab === "All Policies" || policy.policyType === activeTab;
        const matchesSearch = policy.policyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === "All Types" || policy.policyType === selectedType;
        
        // Price filtering logic (extracting from premiumAmount)
        const premium = policy.premiumAmount;
        let matchesPrice = true;
        if (priceRange === "Under $50") matchesPrice = premium < 4000; // rough 50*80
        else if (priceRange === "$50 - $100") matchesPrice = premium >= 4000 && premium <= 8000;
        else if (priceRange === "Over $100") matchesPrice = premium > 8000;

        return matchesTab && matchesSearch && matchesType && matchesPrice;
    });

    if (loading) return <div className="p-20 text-center font-bold text-[#002b45]">Loading policies...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans pb-12">
            {/* Search & Filters */}
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-3 mb-6 relative z-50">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search for insurance policies, companies..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#002b45]/20 focus:border-[#002b45] transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {/* Type Filter */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-600 flex items-center justify-between min-w-[120px] hover:bg-gray-100 transition-colors"
                            >
                                {selectedType} <ChevronDown size={14} />
                            </button>
                            {showTypeDropdown && (
                                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                                    {["All Types", "Health", "Life", "Vehicle", "Home", "Travel"].map(t => (
                                        <button key={t} onClick={() => { setSelectedType(t); setShowTypeDropdown(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50">{t}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price Filter */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-600 flex items-center justify-between min-w-[120px] hover:bg-gray-100 transition-colors"
                            >
                                {priceRange} <ChevronDown size={14} />
                            </button>
                            {showPriceDropdown && (
                                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                                    {["All Prices", "Under $50", "$50 - $100", "Over $100"].map(p => (
                                        <button key={p} onClick={() => { setPriceRange(p); setShowPriceDropdown(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50">{p}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Duration Filter */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-600 flex items-center justify-between min-w-[120px] hover:bg-gray-100 transition-colors"
                            >
                                {duration} <ChevronDown size={14} />
                            </button>
                            {showDurationDropdown && (
                                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                                    {["All Durations", "1 Year", "2 Years", "3 Years", "5 Years"].map(d => (
                                        <button key={d} onClick={() => { setDuration(d); setShowDurationDropdown(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50">{d}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-[13px] font-medium whitespace-nowrap transition-colors relative ${
                                activeTab === tab ? "text-[#002b45]" : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="browsePolicyTab"
                                    className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#002b45]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {filteredPolicies.map((policy, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={policy._id} 
                            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative flex flex-col"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center justify-center mb-4">
                                {policy.policyType === 'Health' ? <Heart size={22} className="text-rose-500" /> :
                                 policy.policyType === 'Vehicle' ? <Car size={22} className="text-blue-500" /> :
                                 policy.policyType === 'Home' ? <Home size={22} className="text-orange-500" /> :
                                 policy.policyType === 'Life' ? <Users size={22} className="text-purple-500" /> :
                                 policy.policyType === 'Travel' ? <Plane size={22} className="text-emerald-500" /> :
                                 <Activity size={22} className="text-gray-500" />}
                            </div>

                            <h3 className="text-lg font-bold text-[#002b45] mb-0.5">{policy.policyName}</h3>
                            <p className="text-[12px] text-gray-500 mb-4">Underwritten by ShieldPro Insurance</p>

                            <div className="space-y-2.5 mb-6 flex-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-500" />
                                    <span>Coverage: ₹{policy.coverageAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-500" />
                                    <span>Premium: ₹{policy.premiumAmount}/mo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-500" />
                                    <span>Duration: {policy.durationYears} Years</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => navigate(`/customer/policies/${policy._id}`, { state: { policy } })}
                                    className="flex-1 py-2 px-3 text-[12px] font-semibold text-[#002b45] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Details
                                </button>
                                <button 
                                    onClick={() => navigate('/customer/apply', { state: { policy } })}
                                    className="flex-1 py-2 px-3 text-[12px] font-semibold text-white bg-[#10b981] border border-transparent rounded-lg hover:bg-[#059669] transition-colors shadow-sm"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-500">
                        Showing {filteredPolicies.length} of 42 policies
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#002b45] text-white font-medium text-sm transition-colors">
                            1
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
                            2
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
                            3
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
        </div>
    );
};

export default BrowsePolicies;
