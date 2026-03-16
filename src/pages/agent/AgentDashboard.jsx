import React from "react";
import { 
    FileText, DollarSign, 
    ArrowUpRight, ArrowDownRight, 
    Bell, CheckCircle2,
    BarChart3, LayoutDashboard,
    Activity, TrendingUp, Search, Plus
} from "lucide-react";
import Reveal from "../../components/common/Reveal";
import { 
    BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer,
    Cell
} from 'recharts';

const AgentDashboard = () => {
    const data = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 450 },
        { name: 'Mar', value: 300 },
        { name: 'Apr', value: 700 },
        { name: 'May', value: 550 },
        { name: 'Jun', value: 900 },
    ];

    const stats = [
        { label: "Pipeline Applications", value: "86", trend: "+12%", icon: FileText, trendUp: true },
        { label: "Active Trackers", value: "24", trend: "+5%", icon: Activity, trendUp: true },
        { label: "Net Commission", value: "$14,250", trend: "+2%", icon: DollarSign, trendUp: true },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-display">
            {/* SaaS Header */}
            <div className="bg-white border-b border-[#ccdbdc]/30 sticky top-0 z-50">
                <div className="saas-container h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#007ea7] p-1.5 rounded-lg">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-black text-[#003249]">Agent Hub</span>
                        </div>
                        <nav className="hidden md:flex gap-6 text-[13px] font-semibold text-[#003249]/60">
                            <a href="#" className="text-[#007ea7]">Overview</a>
                            <a href="#" className="hover:text-[#007ea7] transition-colors">Portfolio</a>
                            <a href="#" className="hover:text-[#007ea7] transition-colors">Security</a>
                            <a href="#" className="hover:text-[#007ea7] transition-colors">Nodes</a>
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                            <input 
                                type="text" 
                                placeholder="Sync search..." 
                                className="bg-[#f1f5f9] border border-[#ccdbdc]/50 rounded-lg py-1.5 pl-9 pr-4 text-[12px] font-semibold w-64 focus:outline-none focus:ring-2 focus:ring-[#007ea7]/10"
                            />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#003249] relative cursor-pointer hover:bg-slate-200">
                             <Bell size={18} />
                             <span className="absolute top-0 right-0 w-2 h-2 bg-[#007ea7] rounded-full border border-white" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-[#ccdbdc]">
                             <img src="https://i.pravatar.cc/100?u=agent" alt="Agent" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="py-10">
                <div className="saas-container">
                    <div className="flex flex-wrap items-center justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-[#003249]">Operational Overview</h2>
                            <p className="text-sm font-semibold opacity-40">Command center for Agent Alexander Wright</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn btn-ghost bg-white px-4 py-2">
                                Export Logs
                            </button>
                            <button className="btn btn-primary px-4 py-2">
                                <Plus size={16} /> New Application
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {stats.map((s, i) => (
                            <div key={i} className="saas-card">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#ccdbdc]/30 flex items-center justify-center text-[#007ea7]">
                                        <s.icon size={20} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-[11px] font-black ${s.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {s.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {s.trend}
                                    </div>
                                </div>
                                <p className="text-[11px] font-black text-[#003249]/40 uppercase tracking-widest mb-1">{s.label}</p>
                                <h3 className="text-3xl font-black">{s.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Visual & Activity Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Metrics Chart */}
                        <div className="lg:col-span-8 saas-card !p-0 overflow-hidden">
                            <div className="p-8 border-b border-[#ccdbdc]/30 flex justify-between items-center">
                                <h3 className="text-lg">Revenue Distribution</h3>
                                <div className="flex gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#007ea7]" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-[#003249]/40">Active Projections</span>
                                </div>
                            </div>
                            <div className="p-8 h-[360px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                                            dy={15}
                                        />
                                        <YAxis hide />
                                        <Tooltip 
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #ccdbdc', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#007ea7' : '#9ad1d4'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Activity Panel */}
                        <div className="lg:col-span-4 saas-card flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg">Activity Stream</h3>
                                <TrendingUp size={16} className="text-[#007ea7]" />
                            </div>
                            <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                                {[
                                    { title: "Node Authorization", desc: "Policy #12345 verified by system.", time: "2m ago", status: "SYNCED" },
                                    { title: "Claim Inbound", desc: "Collision report filed for Miller, T.", time: "14m ago", status: "PENDING" },
                                    { title: "Premium Settlement", desc: "Batch processed for protocol 4421.", time: "1h ago", status: "COMPLETE" },
                                    { title: "Vetting Required", desc: "Identity check flagged for Jenkins, S.", time: "3h ago", status: "ALERT" },
                                ].map((act, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-1 h-10 rounded-full bg-[#ccdbdc] group-hover:bg-[#007ea7] transition-colors" />
                                        <div>
                                            <div className="flex justify-between items-center mb-0.5">
                                                <p className="text-sm font-bold text-[#003249]">{act.title}</p>
                                                <span className="text-[10px] font-black text-[#003249]/30">{act.time}</span>
                                            </div>
                                            <p className="text-[11px] font-semibold text-[#003249]/50 mb-1">{act.desc}</p>
                                            <span className="text-[9px] font-black tracking-widest text-[#007ea7]">{act.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-ghost w-full py-3 mt-8 bg-[#f8fafc] border-[#ccdbdc]/50">
                                Expand Activity Log
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AgentDashboard;
