import React from "react";
    import { 
        Shield, LayoutDashboard, Users, FileText, 
        ArrowUpRight, ArrowDownRight, Bell, 
        Search, Plus, Filter, MoreHorizontal,
        CheckCircle2, Database, TrendingUp
    } from "lucide-react";
    import Reveal from "../../components/common/Reveal";
    import { motion } from "framer-motion";
    
    const AdminDashboard = () => {
        const stats = [
            { label: "Total Net Premiums", value: "$4.82M", trend: "+12.5%", icon: Database, trendUp: true },
            { label: "Loss Ratio Index", value: "62.4%", trend: "+8.2%", icon: TrendingUp, trendUp: true },
            { label: "Pending Vetting", value: "156", trend: "-3.1%", icon: FileText, trendUp: false },
            { label: "Authorized Nodes", value: "12,842", trend: "+68%", icon: Users, trendUp: true },
        ];
    
        const policies = [
            { id: "POL-88219", client: "Jane Doe", type: "Auto", status: "Active", premium: "$2,450.00", date: "Oct 12, 2024" },
            { id: "POL-88220", client: "Robert King", type: "Life", status: "Pending", premium: "$4,820.00", date: "Nov 05, 2024" },
            { id: "POL-88221", client: "Linda Meyer", type: "Health", status: "Active", premium: "$1,150.00", date: "Sep 18, 2024" },
            { id: "POL-88222", client: "Arthur Taylor", type: "Auto", status: "Expired", premium: "$8,200.00", date: "Aug 30, 2024" },
        ];
    
        return (
            <div className="min-h-screen bg-[#f8fafc] font-display">
                {/* Admin Header */}
                <div className="bg-white border-b border-[#ccdbdc]/30 sticky top-0 z-50">
                    <div className="saas-container h-16 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="bg-[#003249] p-1.5 rounded-lg">
                                    <Shield className="w-5 h-5 text-[#80ced7]" />
                                </div>
                                <span className="text-lg font-black text-[#003249]">Admin Console</span>
                            </div>
                            <nav className="hidden md:flex gap-6 text-[13px] font-semibold text-[#003249]/60">
                                <a href="#" className="text-[#007ea7]">Overview</a>
                                <a href="#" className="hover:text-[#007ea7] transition-colors">Users</a>
                                <a href="#" className="hover:text-[#007ea7] transition-colors">Infrastructure</a>
                                <a href="#" className="hover:text-[#007ea7] transition-colors">Security</a>
                            </nav>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                                <input 
                                    type="text" 
                                    placeholder="Search global records..." 
                                    className="bg-slate-50 border border-[#ccdbdc]/50 rounded-lg py-1.5 pl-9 pr-4 text-[12px] font-semibold w-72 focus:outline-none focus:ring-2 focus:ring-[#007ea7]/10 transition-all"
                                />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#003249] hover:bg-[#ccdbdc]/30 cursor-pointer">
                                 <Bell size={18} />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#003249] text-white flex items-center justify-center font-black text-[10px]">
                                M
                            </div>
                        </div>
                    </div>
                </div>
    
                <main className="py-10">
                    <div className="saas-container">
                        {/* Header Area */}
                        <div className="flex flex-wrap items-center justify-between mb-10 gap-4">
                            <div>
                                <h1 className="text-2xl mb-1">Global Overview</h1>
                                <p className="text-sm font-semibold opacity-40">Operational Command Center</p>
                            </div>
                            <button className="btn btn-primary px-6 py-2.5 shadow-lg shadow-[#007ea7]/20">
                                <Plus size={16} /> Deploy New Protocol
                            </button>
                        </div>
    
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {stats.map((s, i) => (
                                <div key={i} className="saas-card">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-10 h-10 rounded-xl bg-[#ccdbdc]/30 flex items-center justify-center text-[#003249]`}>
                                            <s.icon size={20} />
                                        </div>
                                        <div className={`text-[11px] font-black flex items-center gap-1 ${s.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {s.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {s.trend}
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-black text-[#003249]/40 uppercase tracking-widest mb-1">{s.label}</p>
                                    <h3 className="text-3xl font-black">{s.value}</h3>
                                </div>
                            ))}
                        </div>
    
                        {/* Registry Table Card */}
                        <div className="saas-card !p-0 overflow-hidden mb-10">
                            <div className="p-8 border-b border-[#ccdbdc]/30 flex justify-between items-center bg-slate-50/30">
                                <h3 className="text-lg">Network Policy Registry</h3>
                                <div className="flex gap-2">
                                    <button className="btn btn-ghost px-3 py-1.5 bg-white">
                                        <Filter size={14} /> Refine
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-[#ccdbdc]/30">
                                            <th className="px-8 py-4 text-[10px] font-black text-[#003249]/40 uppercase tracking-widest">Protocol ID</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-[#003249]/40 uppercase tracking-widest">Client Identity</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-[#003249]/40 uppercase tracking-widest">Tier</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-[#003249]/40 uppercase tracking-widest text-center">Lifecycle</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-[#003249]/40 uppercase tracking-widest">Settlement</th>
                                            <th className="px-8 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#ccdbdc]/20">
                                        {policies.map((p, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer font-semibold text-sm">
                                                <td className="px-8 py-5 text-[#003249]/60">{p.id}</td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-[#ccdbdc]/30 text-[#003249] flex items-center justify-center text-[10px] font-black">
                                                            {p.client.charAt(0)}
                                                        </div>
                                                        {p.client}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-[#003249]/60">{p.type}</td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                        p.status === 'Active' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' :
                                                        p.status === 'Pending' ? 'text-amber-500 bg-amber-50 border-amber-100' :
                                                        'text-rose-500 bg-rose-50 border-rose-100'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 font-bold">{p.premium}</td>
                                                <td className="px-8 py-5 text-right">
                                                    <button className="text-slate-300 hover:text-[#007ea7]"><MoreHorizontal size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
    
                        {/* Lower Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 saas-card">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg">Event Logs</h3>
                                    <button className="text-[11px] font-black text-[#007ea7] uppercase tracking-widest">View Archives</button>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { title: "Service Request #CLM-9021 Inbound", detail: "Property damage sync initialized for POL-88210.", time: "2h ago", color: "bg-[#007ea7]" },
                                        { title: "Protocol Renewal Synchronized", detail: "Automatic settlement for Client: Jane Doe completed.", time: "5h ago", color: "bg-emerald-500" },
                                    ].map((act, i) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className={`w-1 h-10 rounded-full ${act.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                                            <div>
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <p className="text-sm font-bold text-[#003249]">{act.title}</p>
                                                    <span className="text-[10px] font-black opacity-30">{act.time}</span>
                                                </div>
                                                <p className="text-[11px] font-semibold opacity-60">{act.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
    
                            <div className="lg:col-span-1 saas-card">
                                <h3 className="text-lg mb-8">Asset Liquidity</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "Vetting Queue", val: 78, color: "bg-[#007ea7]" },
                                        { label: "Underwriting Index", val: 42, color: "bg-[#9ad1d4]" },
                                        { label: "Settlement Liquidity", val: 91, color: "bg-[#003249]" }
                                    ].map((q, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">
                                                <span>{q.label}</span>
                                                <span>{q.val}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${q.val}%` }}
                                                    className={`h-full ${q.color}`} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    };
    
    export default AdminDashboard;
