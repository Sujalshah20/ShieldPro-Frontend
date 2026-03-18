import React, { useState, useEffect } from "react";
import { 
    FileText, Search, Filter, Mail, Phone, 
    Calendar, Shield, ChevronRight,
    ArrowUpRight, AlertCircle, CheckCircle2, 
    XCircle, Clock, MoreHorizontal,
    Eye, Download, RefreshCcw,
    Activity, ShieldAlert, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import api from "../../utils/api";

const AdminClaims = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [claims, setClaims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/claims/all', user.token);
            setClaims(response.data);
        } catch (error) {
            toast({ title: "Error fetching claims", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { label: "New Claims", value: claims.filter(c => c.status === 'Pending').length, icon: Clock, color: "blue" },
        { label: "In Review", value: claims.filter(c => c.status === 'Investigation').length, icon: Activity, color: "amber" },
        { label: "Setttled", value: claims.filter(c => c.status === 'Approved').length, icon: CheckCircle2, color: "emerald" },
    ];

    const tabs = ["All", "Pending", "Investigation", "Approved", "Rejected"];

    const filteredClaims = claims.filter(claim => {
        const matchesSearch = 
            claim.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.userPolicy?.policy?.policyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim._id?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTab = activeTab === "All" || claim.status === activeTab;
        
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">All Claims</h1>
                        <p className="text-slate-500 font-medium">Coordinate and process insurance claim submissions.</p>
                    </div>
                </Reveal>
                <Reveal direction="right">
                    <button className="h-11 px-6 bg-blue-600 text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                        <Download size={18} /> Export Report
                    </button>
                </Reveal>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400`}>
                                <s.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{s.label}</p>
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{s.value}</h3>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Tabs and Filters */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-fit overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 hide-scrollbar py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                    activeTab === tab 
                                    ? "bg-white text-blue-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by ID, policy or name..." 
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Claims Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-6 py-5">Claim ID</th>
                                    <th className="px-6 py-5">Customer Info</th>
                                    <th className="px-6 py-5">Policy Context</th>
                                    <th className="px-6 py-5 text-right">Magnitude</th>
                                    <th className="px-6 py-5 text-center">Status</th>
                                    <th className="px-6 py-5">Date Filed</th>
                                    <th className="px-6 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 italic font-medium">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
                                        </td>
                                    </tr>
                                ) : filteredClaims.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center text-slate-400">No claims found matchings your search or filters.</td>
                                    </tr>
                                ) : (
                                    filteredClaims.map((claim) => (
                                        <tr key={claim._id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-bold text-slate-500">#{claim._id.slice(-6).toUpperCase()}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                        {claim.user?.name?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col not-italic">
                                                        <span className="text-sm font-bold text-slate-700">{claim.user?.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{claim.user?.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col not-italic">
                                                    <span className="text-sm font-bold text-slate-700 leading-none mb-1">{claim.userPolicy?.policy?.policyName}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{claim.userPolicy?.policyNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className="text-base font-bold text-slate-800">₹{claim.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                                                        claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                                        claim.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                                                        claim.status === 'Investigation' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                                            claim.status === 'Approved' ? 'bg-emerald-500' : 
                                                            claim.status === 'Rejected' ? 'bg-rose-500' : 
                                                            'bg-amber-500 animate-pulse'
                                                        }`} />
                                                        {claim.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-slate-500">{new Date(claim.createdAt).toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminClaims;