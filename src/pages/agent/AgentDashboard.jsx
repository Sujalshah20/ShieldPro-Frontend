import React from "react";
import { 
    FileText, DollarSign, 
    ArrowUpRight, ArrowDownRight, 
    CheckCircle2, TrendingUp, Plus, Activity, Terminal, Fingerprint, Layers, Shield, Zap, IndianRupee, BarChart3, Clock,
    Satellite, Search, RefreshCcw, ChevronRight, SearchCheck, Globe, Cpu, Award
} from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer,
    Cell
} from 'recharts';
import { motion } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const AgentDashboard = () => {
    const data = [
        { name: 'JAN', value: 400 },
        { name: 'FEB', value: 450 },
        { name: 'MAR', value: 300 },
        { name: 'APR', value: 700 },
        { name: 'MAY', value: 550 },
        { name: 'JUN', value: 900 },
    ];

    const stats = [
        { label: "Pipeline_Applications", value: "86", trend: "+12%", icon: FileText, trendUp: true, tag: "QUEUE_FLOW" },
        { label: "Active_Trackers", value: "24", trend: "+5%", icon: Activity, trendUp: true, tag: "SIGNAL_SYNC" },
        { label: "Net_Commission", value: "₹1,42,250", trend: "+2%", icon: IndianRupee, trendUp: true, tag: "YIELD_ACC" },
    ];

    return (
        <div className="space-y-16 pb-20">
            {/* Page Title Section */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-[#007ea7] rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[6px] text-[#007ea7] italic leading-none">Operative_Mainframe_V4.2</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Operational <span className="text-[#007ea7]">Grid_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-widest text-xs italic leading-relaxed">Command center for Agent Alexander Wright. Portfolio tracking and performance metrics. Uplink: <span className="text-emerald-500">STABLE</span></p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex items-center gap-6 bg-slate-50 px-10 py-5 rounded-[2.5rem] border-2 border-slate-50 shadow-inner group hover:border-[#007ea7]/20 transition-all duration-700">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
                        <span className="text-[10px] font-black text-[#003249] uppercase tracking-[5px] italic">HW-0128::UPLINK_STABLE</span>
                    </div>
                </Reveal>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, i) => (
                    <Reveal key={i} direction="up" delay={i * 0.1}>
                        <div className="saas-card group relative p-10 border-2 border-slate-50 hover:border-[#007ea7]/30 transition-all duration-700 min-h-[280px] flex flex-col justify-between overflow-hidden shadow-3xl">
                             {/* Decorative Background Icon */}
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <s.icon size={120} className="text-[#003249]" />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-16 h-16 bg-[#003249] rounded-[1.8rem] flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5 group-hover:rotate-12 transition-transform duration-500">
                                    <s.icon size={26} strokeWidth={3} />
                                </div>
                                <div className={`text-[10px] font-black flex items-center gap-3 px-5 py-2.5 rounded-2xl border shadow-xl italic ${s.trendUp ? 'text-emerald-500 bg-emerald-50 border-emerald-50' : 'text-rose-500 bg-rose-50 border-rose-50'}`}>
                                    {s.trendUp ? <ArrowUpRight size={16} strokeWidth={4} className="animate-pulse" /> : <ArrowDownRight size={16} strokeWidth={4} />}
                                    {s.trend}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[6px] mb-4 italic flex items-center gap-4 text-opacity-50">
                                    <Terminal size={14} className="text-[#007ea7]" strokeWidth={3} /> {s.label}
                                </p>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-5xl font-black text-[#003249] tracking-tighter italic uppercase group-hover:text-[#007ea7] transition-colors leading-none">{s.value}</h2>
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[5px] italic border-l-2 border-slate-100 pl-4">{s.tag}</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Visual & Activity Split */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Metrics Chart */}
                <div className="xl:col-span-8 saas-card !p-0 overflow-hidden min-h-[600px] flex flex-col shadow-3xl border-2 border-slate-50">
                    <div className="p-12 border-b-2 border-slate-50 bg-slate-50/20 flex flex-col md:flex-row items-center justify-between gap-10 relative">
                         {/* Tactical Background */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-18 h-18 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5">
                                <BarChart3 size={36} strokeWidth={2.5} className="animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-[#003249] leading-none mb-1 italic">Revenue Distribution</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] leading-none italic opacity-60">Active projections and fiscal yield mapping</p>
                            </div>
                        </div>
                        <button className="h-16 px-10 bg-white border-2 border-slate-100 text-[#003249] rounded-2xl text-[10px] font-black uppercase tracking-[5px] shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center gap-5 active:scale-95 italic group relative z-10">
                            <Terminal size={22} className="text-[#007ea7] group-hover:rotate-12 transition-transform" strokeWidth={3} /> EXPORT_REPORTS
                        </button>
                    </div>
                    <div className="p-12 flex-1 relative min-h-[400px] bg-white z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#E2E8F0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#003249', fontSize: 11, fontWeight: 900, letterSpacing: '4px' }} 
                                    dy={20}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(0, 126, 167, 0.05)', radius: 15 }}
                                    contentStyle={{ 
                                        borderRadius: '3rem', 
                                        border: '2px solid #F1F5F9', 
                                        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15)',
                                        padding: '24px',
                                        backgroundColor: '#fff',
                                        fontFamily: 'inherit',
                                        textTransform: 'uppercase',
                                        fontWeight: 900,
                                        fontSize: '11px',
                                        letterSpacing: '4px',
                                        fontStyle: 'italic'
                                    }}
                                />
                                <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={60}>
                                    {data.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index === data.length - 1 ? '#007ea7' : '#F1F5F9'} 
                                            className="transition-all duration-700 hover:opacity-80"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Panel */}
                <div className="xl:col-span-4 saas-card !p-0 flex flex-col min-h-[600px] shadow-3xl border-2 border-slate-50 relative overflow-hidden group">
                     {/* Decorative Elements */}
                     <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]">
                        <Zap size={200} className="text-[#003249]" />
                     </div>
                     
                    <div className="p-12 border-b-2 border-slate-50 bg-slate-50/20 flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-[#003249] rounded-2xl flex items-center justify-center text-[#007ea7] shadow-xl border border-white/5">
                                <Clock size={28} strokeWidth={3} className="animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-[#003249] italic leading-none">Activity Stream</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] leading-none italic opacity-60">Real-time node telemetry</p>
                            </div>
                        </div>
                        <TrendingUp size={24} className="text-[#007ea7] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
                    </div>
                    
                    <div className="p-12 space-y-10 flex-1 overflow-y-auto no-scrollbar relative z-10 pr-4 custom-scrollbar-v2">
                        {[
                            { title: "Node Authorization", desc: "Policy #12345 verified by mainframe system.", time: "2M_AGO", status: "SYNCED", color: "text-emerald-500", icon: ShieldCheck },
                            { title: "Claim Inbound", desc: "Collision report filed and pending vetting.", time: "14M_AGO", status: "PENDING", color: "text-amber-500", icon: AlertTriangle },
                            { title: "Premium Settlement", desc: "Batch processed for protocol group 4421.", time: "1H_AGO", status: "COMPLETE", color: "text-[#007ea7]", icon: CheckCircle2 },
                            { title: "Vetting Required", desc: "Identity checksum deviation detected.", time: "3H_AGO", status: "ALERT", color: "text-rose-500", icon: Target },
                        ].map((act, i) => (
                            <div key={i} className="flex gap-8 group/item cursor-pointer">
                                <div className="relative">
                                    <div className="w-3 h-16 rounded-full bg-slate-50 border border-slate-100 group-hover/item:bg-[#003249] transition-all duration-700 shadow-inner group-hover/item:scale-y-110 flex flex-col items-center justify-start py-2">
                                        <div className={`w-1 h-1 rounded-full ${act.color} animate-ping`} />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[14px] font-black text-[#003249] uppercase tracking-tighter italic group-hover/item:text-[#007ea7] transition-colors leading-none">{act.title}</p>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px] italic">{act.time}</span>
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed opacity-60 group-hover/item:opacity-100 transition-opacity">{act.desc}</p>
                                    <div className="flex items-center gap-3">
                                        <span className={`${act.color} text-[9px] font-black tracking-[5px] uppercase italic leading-none`}>{"// " + act.status}</span>
                                        <div className="h-px bg-slate-100 flex-1 group-hover/item:bg-[#007ea7]/20 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-12 border-t-2 border-slate-50 bg-slate-50/10 relative z-10">
                        <button className="h-16 w-full bg-white border-2 border-slate-100 text-[#003249] rounded-2xl text-[10px] font-black uppercase tracking-[5px] shadow-xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all flex items-center justify-center gap-5 active:scale-95 italic group/btn">
                            EXPAND_ACTIVITY_LOG <ChevronRight size={18} strokeWidth={4} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sub-Metadata Footer */}
            <Reveal direction="up" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-16 opacity-30 pt-16 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Fingerprint size={20} strokeWidth={3} className="text-[#007ea7]" /> Operative_ID: HW-0128
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Layers size={20} strokeWidth={3} className="text-[#007ea7]" /> Regional_Sync_Active
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Globe size={20} strokeWidth={3} className="text-[#007ea7]" /> Area_Sector: Sigma-X
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                        <Zap size={20} strokeWidth={3} className="text-[#007ea7]" /> Mainframe_Ping: 0.8ms
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default AgentDashboard;
