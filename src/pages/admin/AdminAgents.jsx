import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Plus, MoreHorizontal,
    Mail, Phone, Shield, 
    ChevronLeft, ChevronRight,
    Briefcase, Users, FileText, 
    DollarSign, Filter, X,
    Edit2, Eye, Trash2, MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AdminAgents = () => {
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("All Agents");

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading } = useQuery({
        queryKey: ['adminAgents', user?.token, debouncedSearch, currentPage],
        queryFn: () => api.get(`/admin/agents?search=${debouncedSearch}&page=${currentPage}&limit=10`, user.token),
        enabled: !!user?.token
    });

    const agents = data?.agents || [];
    const totalPages = data?.pages || 1;
    const totalCount = data?.total || 0;
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => api.patch(`/admin/agents/${id}/status`, { status }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminAgents']);
            toast({ title: "Agent status updated! ✨", description: "The agent's access has been modified.", variant: "success" });
        },
        onError: (err) => {
            toast({ title: "Update failed", description: err.message || "Could not update agent status", variant: "destructive" });
        }
    });

    const toggleStatus = (agent) => {
        const newStatus = agent.status === 'Active' ? 'Inactive' : 'Active';
        if (window.confirm(`Are you sure you want to set ${agent.name} to ${newStatus}?`)) {
            statusMutation.mutate({ id: agent._id, status: newStatus });
        }
    };

    const tabs = ["All Agents", "Active", "Inactive", "Onboarding"];

    const getStatusStyle = (status) => {
        switch(status?.toLowerCase()) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'inactive': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'onboarding': return 'bg-slate-50 text-slate-500 border-slate-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const getStatusDot = (status) => {
        switch(status?.toLowerCase()) {
            case 'active': return 'bg-emerald-500';
            case 'inactive': return 'bg-rose-500';
            case 'onboarding': return 'bg-slate-400';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <Reveal direction="left">
                        <h1 className="text-2xl font-black text-black tracking-tight">Agent Management</h1>
                        <p className="text-xs font-bold text-black/40 max-w-2xl">
                            Create, edit, and oversee all insurance agent profiles and performance metrics.
                        </p>
                    </Reveal>
                </div>
                
                <Reveal direction="right">
                    <button className="h-12 px-6 bg-[#1e293b] text-white rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-95 whitespace-nowrap">
                        <Plus size={18} strokeWidth={3} /> Create New Agent
                    </button>
                </Reveal>
            </div>

            {/* Filters Row */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by agent ID or name..." 
                        className="w-full pl-12 pr-4 h-12 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:bg-white focus:border-black focus:ring-8 focus:ring-black/5 outline-none transition-all uppercase tracking-widest placeholder:text-black/10 italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                    <select className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-black/40 outline-none focus:border-black transition-all cursor-pointer min-w-[140px] uppercase tracking-widest italic">
                        <option>Region</option>
                        <option>North</option>
                        <option>South</option>
                        <option>East</option>
                        <option>West</option>
                    </select>
                    
                    <select className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-black/40 outline-none focus:border-black transition-all cursor-pointer min-w-[140px] uppercase tracking-widest italic">
                        <option>Level</option>
                        <option>Junior</option>
                        <option>Senior</option>
                        <option>Elite</option>
                    </select>

                    <select className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-black/40 outline-none focus:border-black transition-all cursor-pointer min-w-[140px] uppercase tracking-widest italic">
                        <option>Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Onboarding</option>
                    </select>

                    <button className="h-12 px-6 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Tabs */}
                <div className="px-8 border-b border-slate-50">
                    <div className="flex items-center gap-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-6 text-sm font-bold border-b-2 transition-all relative ${
                                    activeTab === tab 
                                    ? "text-blue-600 border-blue-600" 
                                    : "text-slate-400 border-transparent hover:text-slate-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-black/30 uppercase tracking-[3px] border-b border-slate-50 italic">
                                <th className="px-6 py-4">OPERATIONAL_ID</th>
                                <th className="px-6 py-4">ENTITY_IDENTITY</th>
                                <th className="px-6 py-4">DEPLOYMENT_REGION</th>
                                <th className="px-6 py-4">ACTIVE_SCHEMES</th>
                                <th className="px-6 py-4">CUMULATIVE_YIELD</th>
                                <th className="px-6 py-4">SIGNAL_STATUS</th>
                                <th className="px-6 py-4 text-right">COMMAND</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="7" className="px-8 py-20"><TableSkeleton /></td></tr>
                            ) : agents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-10 py-32 text-center text-slate-300 italic uppercase font-black tracking-widest">
                                        No corresponding records found in manifest...
                                    </td>
                                </tr>
                            ) : agents.map((a, i) => (
                                <tr key={a._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-[10px] font-black text-black/20 italic tracking-widest">
                                        AGT - {a._id.slice(-4).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 group/entity">
                                            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-3xl group-hover:rotate-6 transition-transform">
                                                <img src={`https://i.pravatar.cc/100?u=${a._id}`} alt={a.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-black text-black tracking-tighter uppercase italic">{a.name}</span>
                                                <span className="text-[9px] font-black text-black/30 uppercase tracking-widest italic">{a.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-black/60 font-black text-[10px] uppercase tracking-widest italic leading-none">
                                            <MapPin size={12} className="text-black/20" />
                                            {a.address || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[12px] font-black text-black italic">{a.stats?.sales || 0}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[14px] font-black text-black tracking-tighter uppercase italic">
                                            ₹{a.stats?.earnings?.toLocaleString() || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(a.status)}`}>
                                            <span className={`w-1 h-1 rounded-full ${getStatusDot(a.status)}`} />
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => toggleStatus(a)}
                                                className={`p-1.5 rounded-lg transition-all ${a.status === 'Active' ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                                title={a.status === 'Active' ? "Deactivate Agent" : "Activate Agent"}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                <Eye size={14} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-8 bg-slate-50/30 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <span className="text-[10px] font-black text-black/20 uppercase tracking-[3px] italic">
                        REGISTRY_STATUS: {agents.length} OF {totalCount} NODES_ACTIVE
                    </span>
                    <div className="flex items-center gap-4">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-12 h-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-black/20 hover:text-black hover:border-black disabled:opacity-10 transition-all bg-white shadow-sm italic"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-12 h-12 rounded-2xl text-[11px] font-black transition-all italic ${
                                    currentPage === i + 1 
                                    ? "bg-black text-white shadow-3xl" 
                                    : "bg-white border-2 border-slate-50 text-black/30 hover:border-black/10 hover:text-black"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-12 h-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-black/20 hover:text-black hover:border-black disabled:opacity-10 transition-all bg-white shadow-sm italic"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAgents;
