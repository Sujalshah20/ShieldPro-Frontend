import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { 
    Shield, Users, UserCheck, Activity, 
    Globe as GlobeIcon, FileText, TrendingUp,
    Clock, ArrowUpRight, Zap, Target,
    Fingerprint, Cpu, BarChart3,
    IndianRupee, AlertCircle, Box, Layers,
    Command, Layout, ClipboardList, ShieldCheck,
    ReceiptText, HandCoins, HeartPulse, ChevronRight,
    Search, Bell, User, ExternalLink, Database
} from "lucide-react";
import { api } from "../../utils/api";
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, AreaChart, Area
} from "recharts";
import { TableSkeleton } from "../../components/common/Skeleton";
import Reveal from "../../components/common/Reveal";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    // Fetch dashboard stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['adminStats', user?.token],
        queryFn: () => api.get('/stats/admin', user.token),
        enabled: !!user?.token
    });

    if (statsLoading) {
        return (
            <div className="p-8 bg-[#dae5e5] min-h-screen">
                <div className="mb-10">
                    <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg mb-4" />
                    <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}
                </div>
                <TableSkeleton rows={8} cols={5} />
            </div>
        );
    }

    const metrics = [
        { label: "Aggregate Premiums", value: "₹42.8M", trend: "+12.5%", icon: TrendingUp, color: "text-[#0082a1]", bg: "bg-[#0082a1]/10" },
        { label: "Loss Intelligence", value: "62.4%", trend: "+8.2%", icon: Activity, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Pending Vetting", value: "156", trend: "-3.1%", icon: ClipboardList, color: "text-rose-500", bg: "bg-rose-50" },
        { label: "Active Nodes", value: "12,842", trend: "68%", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50" }
    ];

    const pipeline = [
        { id: "POL-829104", client: "Alexander Wright", type: "Health Shield", status: "Active", value: "₹12,400", priority: "High" },
        { id: "POL-723102", client: "Sophia Martinez", type: "Cyber Protocol", status: "Pending", value: "₹8,200", priority: "Critical" },
        { id: "POL-441209", client: "Jonathan Reed", type: "Asset Guard", status: "Review", value: "₹15,600", priority: "Medium" },
        { id: "POL-992103", client: "Eleanor Vance", type: "Direct Armor", status: "Active", value: "₹22,100", priority: "High" },
    ];

    return (
        <div className="admin-dashboard p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Command Header */}
            <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#012b3f] mb-1 uppercase tracking-tight">Mainframe Intelligence</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Welcome, Administrator {user?.name}. System uplink synchronized.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-[#0082a1] transition-all">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#012b3f]">Orbital Synchronized</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-[#0082a1] transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>

            {/* Tactical Metrics Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {metrics.map((metric, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[2rem] shadow-xl border border-white hover:border-[#0082a1]/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none transform rotate-12 scale-150">
                            <metric.icon size={100} className="text-[#012b3f]" />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{metric.label}</span>
                            <div className={`p-2.5 rounded-xl ${metric.bg} ${metric.color} shadow-inner`}>
                                <metric.icon size={20} strokeWidth={3} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                            <h2 className="text-4xl font-black text-[#012b3f] tracking-tighter">{metric.value}</h2>
                            <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-lg ${metric.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                {metric.trend.startsWith('+') ? <ArrowUpRight size={12} strokeWidth={4} /> : <TrendingUp size={12} strokeWidth={4} className="rotate-180" />}
                                {metric.trend}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Command Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Protocol Registry (Table) */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
                        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl">
                                    <Database size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#012b3f] uppercase tracking-tight">Active Protocols</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time engagement tracking</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 transition-all"><Search size={18} /></button>
                                <button className="p-3 rounded-xl bg-[#012b3f] text-white hover:bg-[#0082a1] transition-all shadow-lg"><Activity size={18} /></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr className="border-b border-slate-100">
                                        {["Entity ID", "Client Hub", "Scheme", "Status", "Value"].map(h => (
                                            <th key={h} className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                        ))}
                                        <th className="px-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {pipeline.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                            <td className="px-10 py-6 text-xs font-black text-[#0082a1] tracking-widest">{item.id}</td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#012b3f]/5 flex items-center justify-center font-black text-[#012b3f] text-xs border border-slate-100">
                                                        {item.client.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-[#012b3f] leading-none mb-1">{item.client}</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Node Verified</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-[10px] font-black text-[#012b3f] uppercase tracking-widest">{item.type}</td>
                                            <td className="px-10 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                    item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    item.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-sm font-black text-[#012b3f]">{item.value}</td>
                                            <td className="px-10 py-6 text-right">
                                                <button className="p-2 text-slate-200 hover:text-[#0082a1] transition-colors"><ExternalLink size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Displaying Sector 7G Logic Core</p>
                            <div className="flex gap-4">
                                <button className="px-6 py-2.5 rounded-xl border border-slate-200 text-[#012b3f] text-[10px] font-black uppercase tracking-[2px] hover:bg-white transition-all shadow-sm">Decrypt More</button>
                                <button className="px-6 py-2.5 bg-[#012b3f] text-white rounded-xl text-[10px] font-black uppercase tracking-[2px] hover:bg-[#0082a1] transition-all shadow-xl">Next Subsector</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tactical Sidebar */}
                <div className="space-y-8">
                    {/* Live Event Stream */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white p-10 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-[#0082a1]/10 rounded-xl flex items-center justify-center text-[#0082a1]">
                                <Activity size={20} className="animate-pulse" />
                            </div>
                            <h3 className="text-xl font-black text-[#012b3f] uppercase tracking-tight">Signal Feed</h3>
                        </div>
                        
                        <div className="space-y-8 relative z-10">
                            {[
                                { title: "Protocol Breach Mitigated", user: "Node_XR_821", time: "2m ago", icon: Shield, bg: "bg-[#012b3f]", color: "text-[#0082a1]" },
                                { title: "Asset Yield Authorized", user: "Admin_Auth_01", time: "1h ago", icon: Zap, bg: "bg-[#0082a1]/10", color: "text-[#0082a1]" },
                                { title: "New Node Provisioned", user: "Network_Core", time: "3h ago", icon: UserCheck, bg: "bg-emerald-50", color: "text-emerald-600" },
                            ].map((act, i) => (
                                <div key={i} className="flex gap-6 group/item cursor-pointer">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white transition-transform group-hover/item:scale-110 duration-500 shadow-xl ${act.bg} ${act.color}`}>
                                        <act.icon size={22} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-[#012b3f] group-hover/item:text-[#0082a1] transition-colors">{act.title}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{act.user}</p>
                                            <p className="text-[9px] text-slate-300 font-black uppercase">{act.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-[#012b3f] hover:text-white transition-all shadow-inner">View Full Log Stream</button>
                    </div>

                    {/* Mission Critical Status */}
                    <div className="bg-[#012b3f] rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] opacity-10 pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform duration-[5000ms]">
                            <ShieldCheck size={280} />
                        </div>
                        
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                             <div className="w-10 h-10 bg-[#0082a1] rounded-xl flex items-center justify-center text-[#012b3f] shadow-2xl">
                                <Cpu size={20} strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Mainframe Load</h3>
                        </div>
                        
                        <div className="space-y-10 relative z-10">
                            {[
                                { label: "Encryption Depth", val: 88, color: "bg-[#0082a1]" },
                                { label: "Underwriting Matrix", val: 64, color: "bg-amber-500" },
                                { label: "Threat Mitigation", val: 98, color: "bg-emerald-500" },
                            ].map((q, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{q.label}</span>
                                        <span className="text-lg font-black tracking-tighter">{q.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${q.val}%` }}
                                            transition={{ duration: 2, delay: 0.5 + (i * 0.2), ease: "easeOut" }}
                                            className={`h-full ${q.color} rounded-full shadow-[0_0_15px] shadow-current`} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between opacity-40">
                            <div className="flex items-center gap-2">
                                <Lock size={12} />
                                <span className="text-[8px] font-black uppercase tracking-[3px]">AES-4096 Multi-Layer</span>
                            </div>
                            <Fingerprint size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
