import React, { useContext } from "react";
import { 
    Home, Car, Heart, Plane,
    Clock, CheckCircle2,
    Activity, Shield, Zap, IndianRupee, Terminal, Fingerprint, Layers, ShieldCheck, ChevronRight,
    Satellite, Compass, Target, Globe, Award, Briefcase, RefreshCcw, SearchCheck, ArrowRight, Plus,
    Cpu, Command, Layout, Eye, MessageSquare, Wallet
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const firstName = user?.name?.split(' ')[0] || "Citizen";

    const policies = [
        { id: "SH-88291", title: "Home Insurance", status: "Active", type: "Home", date: "Dec 2026", icon: Home, premium: "₹12,500", color: "from-blue-500/10 to-transparent" },
        { id: "SA-22184", title: "Auto Premium", status: "Active", type: "Auto", date: "June 2027", icon: Car, premium: "₹8,400", color: "from-emerald-500/10 to-transparent" },
    ];

    const claimProgress = [
        { label: "Received", completed: true, active: false, step: 1 },
        { label: "Review", completed: false, active: true, step: 2 },
        { label: "Evaluation", completed: false, active: false, step: 3 },
        { label: "Settlement", completed: false, active: false, step: 4 },
    ];

    const stats = [
        { label: "Active_Nodes", value: "02", icon: ShieldCheck, color: "text-emerald-500" },
        { label: "Pending_Syncs", value: "01", icon: RefreshCcw, color: "text-amber-500" },
        { label: "Security_Score", value: "98%", icon: Target, color: "text-[#007ea7]" },
        { label: "Vault_Capacity", value: "₹2.4M", icon: Wallet, color: "text-[#003249]" },
    ];

    return (
        <div className="space-y-16 pb-20">
            {/* Mission Critical Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-3 h-12 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black uppercase tracking-[8px] text-[#003249] italic leading-none opacity-60">Strategic Citizen Hub_v4.2</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] mt-2 italic">AUTH_MAPPING: SUCCESSFUL</span>
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Hello, <span className="text-[#007ea7]">{firstName}_</span></h1>
                        <p className="max-w-xl text-slate-400 font-bold uppercase tracking-[4px] text-xs italic leading-relaxed">
                            Your personal asset defensive grid is currently <span className="text-emerald-500 underline underline-offset-8 decoration-2">OPTIMIZED</span>. 
                            All synchronization vectors are stable across registered sectors.
                        </p>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex items-center gap-10 bg-white/50 backdrop-blur-xl px-12 py-8 rounded-[4rem] border-2 border-slate-50 shadow-4xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#007ea7]/5 to-transparent animate-shimmer" />
                        <div className="flex flex-col items-center gap-3">
                             <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981] animate-pulse" />
                             <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">LIVE</span>
                        </div>
                        <div className="w-px h-14 bg-slate-100" />
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-[#003249] uppercase tracking-[6px] italic leading-none mb-2">UPLINK_SYNC: 99.9%</span>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] italic">X_AES_512_ENCRYPTION_ACTIVE</span>
                        </div>
                        <Satellite size={32} className="text-[#007ea7] opacity-40 group-hover:rotate-45 transition-transform duration-[3000ms]" strokeWidth={2.5} />
                    </div>
                </Reveal>
            </div>

            {/* Tactical Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((s, i) => (
                    <Reveal key={i} direction="up" delay={0.1 + i * 0.1}>
                        <div className="bg-white/50 backdrop-blur-md border-2 border-slate-50 rounded-[2.5rem] p-10 flex flex-col gap-6 group hover:translate-y-[-10px] transition-all duration-700 hover:shadow-4xl overflow-hidden relative shadow-3xl">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-150 transition-transform duration-[5000ms]">
                                <s.icon size={120} strokeWidth={1} />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className={`w-14 h-14 bg-[#003249] rounded-2xl flex items-center justify-center ${s.color} border-2 border-white shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
                                    <s.icon size={28} strokeWidth={2.5} />
                                </div>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px] italic">{s.label}</span>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-4xl font-black text-[#003249] italic tracking-tighter uppercase">{s.value}</h4>
                                <div className="w-8 h-1 bg-[#007ea7] mt-3 rounded-full group-hover:w-16 transition-all duration-700" />
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Active Inventory Grid */}
            <div className="space-y-12">
                <Reveal direction="up" delay={0.4}>
                    <div className="flex items-center justify-between border-b-4 border-slate-50 pb-8 relative overflow-hidden">
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-16 h-16 bg-[#003249] rounded-[1.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl relative group overflow-hidden border-2 border-white/5">
                                 <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent" />
                                <ShieldCheck size={32} strokeWidth={3} className="group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Active_Inventory</h3>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic opacity-60 flex items-center gap-3">
                                    <Activity size={12} strokeWidth={4} className="text-emerald-500" /> DEPLOYED_NODES_RUNNING_NOMINAL
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/customer/policies')}
                            className="h-16 px-10 bg-[#003249] text-[#80ced7] rounded-[1.8rem] flex items-center gap-6 text-[11px] font-black uppercase tracking-[8px] border-2 border-white/5 shadow-4xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-95 italic group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10">EXPLORE_VAULT</span>
                            <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-700 relative z-10" strokeWidth={3} />
                        </button>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {policies.map((p, i) => (
                        <Reveal key={i} direction="up" delay={0.5 + i * 0.1}>
                            <div className="saas-card group relative overflow-hidden shadow-4xl hover:border-[#007ea7]/40 transition-all duration-1000 h-full flex flex-col p-14 border-2 border-slate-50 bg-white/50 backdrop-blur-md min-h-[500px] rounded-[4.5rem]">
                                {/* Dynamic Ambient Light */}
                                <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br ${p.color} blur-[100px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-[4000ms] opacity-50`} />
                                
                                <div className="flex justify-between items-start mb-16 relative z-10">
                                    <div className="w-28 h-28 bg-[#003249] border-4 border-white shadow-3xl rounded-[2.8rem] flex items-center justify-center text-[#007ea7] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 relative overflow-hidden">
                                         <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                        <p.icon size={48} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col items-end gap-6">
                                        <div className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[6px] border-2 shadow-2xl italic flex items-center gap-4 ${
                                            p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-50' : 'bg-slate-50 text-slate-400 border-slate-50'
                                        }`}>
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]" />
                                            {p.status.toUpperCase()}
                                        </div>
                                        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-2xl border border-slate-100 shadow-sm italic">
                                            <IndianRupee size={16} className="text-[#007ea7]" strokeWidth={3} />
                                            <span className="text-[14px] font-black text-[#003249] tracking-widest leading-none">{p.premium}/yr</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-16 relative z-10 flex-1">
                                    <h3 className="text-5xl font-black text-[#003249] leading-tight mb-4 uppercase tracking-tighter italic group-hover:text-[#007ea7] transition-colors">{p.title}</h3>
                                    <div className="w-16 h-2 bg-[#007ea7] mb-8 rounded-full group-hover:w-32 transition-all duration-1000 shadow-[0_0_20px_#007ea7]" />
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-5 text-[11px] font-black text-slate-300 uppercase tracking-[6px] italic leading-none group-hover:text-slate-400 transition-colors">
                                            <Terminal size={14} className="text-[#007ea7]" strokeWidth={3} /> PROTOCOL_ID: {p.id}
                                        </div>
                                        <div className="flex items-center gap-5 text-[11px] font-black text-slate-300 uppercase tracking-[6px] italic leading-none group-hover:text-slate-400 transition-colors">
                                            <Fingerprint size={14} className="text-[#007ea7]" strokeWidth={3} /> BIOMETRIC_LOCKED
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-12 border-t-2 border-slate-50/50 flex justify-between items-center relative z-10">
                                    <div className="flex flex-col gap-3">
                                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic leading-none">CYCLE_END_GATE</span>
                                         <span className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">{p.date.toUpperCase()}</span>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/customer/policies')}
                                        className="w-16 h-16 bg-[#003249] text-[#80ced7] rounded-3xl flex items-center justify-center shadow-4xl hover:bg-[#007ea7] hover:text-white transition-all active:scale-90 group/btn border-2 border-white/5"
                                    >
                                        <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform duration-700" strokeWidth={4} />
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    ))}

                    <Reveal direction="up" delay={0.8}>
                        <div className="h-full border-4 border-dashed border-slate-100 rounded-[4.5rem] flex flex-col items-center justify-center p-16 text-center cursor-pointer hover:border-[#007ea7]/40 hover:bg-[#007ea7]/5 transition-all duration-1000 group min-h-[500px] shadow-inner relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#007ea7]/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                             <div className="w-32 h-32 bg-white border-2 border-slate-50 rounded-[3.5rem] flex items-center justify-center text-slate-100 mb-12 group-hover:bg-[#003249] group-hover:text-[#007ea7] group-hover:shadow-4xl transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110 shadow-2xl relative overflow-hidden">
                                 <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-50" />
                                 <Plus size={64} strokeWidth={4} className="relative z-10" />
                             </div>
                             <div className="space-y-4">
                                <p className="text-[16px] font-black text-[#003249] uppercase tracking-[10px] italic leading-none group-hover:tracking-[12px] duration-1000 transition-all opacity-20 group-hover:opacity-100">Deploy_New_Node</p>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic opacity-40 group-hover:opacity-100">INJECT_PROTOCOL_PARAM</p>
                             </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Incident Resolution Module */}
            <div className="space-y-12">
                <Reveal direction="up" delay={0.9}>
                    <div className="flex items-center gap-8 border-b-4 border-slate-50 pb-8 relative">
                        <div className="w-16 h-16 bg-[#007ea7] rounded-[1.5rem] flex items-center justify-center text-white shadow-4xl shadow-[#007ea7]/30 relative overflow-hidden border-2 border-white/20 group">
                             <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                            <Clock size={32} strokeWidth={3} className="group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-4xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Incident_Sync_Status</h3>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic opacity-60 flex items-center gap-3">
                                <RefreshCcw size={12} strokeWidth={4} className="text-amber-500 animate-spin-slow" /> ACTIVE_VETTING_PROTOCOL_IN_PROGRESS
                            </p>
                        </div>
                    </div>
                </Reveal>

                <Reveal width="100%" direction="up" delay={1}>
                    <div className="saas-card !p-0 overflow-hidden shadow-4xl border-2 border-slate-50 bg-white/50 backdrop-blur-md rounded-[5rem]">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-[45%] p-16 bg-slate-50/50 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-50 flex flex-col justify-between relative overflow-hidden group/info">
                                 {/* Tactical Ambiance */}
                                <div className="absolute top-0 left-0 p-12 opacity-[0.02] pointer-events-none group-hover/info:scale-110 transition-transform duration-[5000ms]">
                                    <Compass size={400} strokeWidth={1} className="text-[#003249] rotate-45" />
                                </div>

                                <div className="relative z-10 space-y-14">
                                    <div className="flex items-center gap-10 border-b border-[#003249]/5 pb-10">
                                        <div className="w-24 h-24 bg-[#003249] rounded-[2.5rem] flex items-center justify-center text-[#007ea7] shadow-3xl border-2 border-white relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                            <Car size={48} strokeWidth={2.5} className="group-hover:rotate-12 group-hover:scale-110 transition-all duration-700" />
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[12px] font-black text-[#007ea7] uppercase tracking-[8px] italic leading-none">CLAIM_NODE_CL-95021_</h4>
                                            <div className="flex items-center gap-5">
                                                 <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_20px_#f59e0b]" />
                                                 <span className="text-4xl font-black text-[#003249] uppercase tracking-tighter italic">VETTING_PHASE</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/60 p-12 rounded-[3.5rem] border-2 border-white shadow-inner group-hover/info:bg-white transition-all duration-700">
                                         <div className="flex items-center gap-6 mb-8">
                                            <div className="w-12 h-12 bg-[#003249] text-[#007ea7] rounded-2xl flex items-center justify-center shadow-xl">
                                                <Target size={24} strokeWidth={3} />
                                            </div>
                                            <span className="text-[12px] font-black uppercase tracking-[8px] text-[#003249] italic">Analysis_Manifest</span>
                                         </div>
                                         <p className="text-[14px] font-black leading-relaxed text-[#003249]/40 uppercase tracking-[4px] italic">
                                            Advanced structural evaluation initiated for front-end chassis impact. Synchronizing data with Sector-B repair terminals. Stability: 92%.
                                         </p>
                                    </div>
                                </div>

                                <div className="mt-16 pt-12 border-t-2 border-slate-50 flex items-center justify-between relative z-10">
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic leading-none">SETTLEMENT_GATE_SYNC</span>
                                        <span className="text-3xl font-black text-[#003249] uppercase tracking-[6px] italic leading-none">OCT_28_2026</span>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/customer/messages')}
                                        className="h-20 px-12 bg-white border-2 border-slate-100 text-[#007ea7] rounded-[2rem] text-[13px] font-black uppercase tracking-[8px] shadow-4xl hover:bg-[#003249] hover:text-[#80ced7] hover:border-[#003249] transition-all active:scale-95 italic group/btn flex items-center gap-6"
                                    >
                                        <MessageSquare size={24} strokeWidth={3} className="group-hover:rotate-12 transition-all" />
                                        SIGNAL_HUB
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 p-20 lg:p-32 flex flex-col justify-center bg-white relative overflow-hidden min-h-[500px]">
                                {/* Visual Data Grid */}
                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
                                
                                <div className="relative">
                                    {/* Connectivity Backbone */}
                                    <div className="absolute top-1/2 left-0 right-0 h-4 bg-slate-50 -translate-y-1/2 hidden lg:block rounded-full shadow-inner border border-slate-100" />
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '33.33%' }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute top-1/2 left-0 h-4 bg-[#007ea7] -translate-y-1/2 hidden lg:block rounded-full shadow-[0_0_30px_#007ea7] z-10" 
                                    />
                                    
                                    <div className="relative z-20 flex flex-col lg:flex-row justify-between gap-24 lg:gap-0">
                                        {claimProgress.map((step, i) => (
                                            <div key={i} className="flex items-center lg:flex-col gap-10 lg:gap-14 bg-white/0 lg:px-6 group/step">
                                                <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-1000 shadow-4xl relative overflow-hidden group-hover/step:scale-110 ${
                                                    step.completed ? 'bg-[#007ea7] text-white' : 
                                                    step.active ? 'bg-[#003249] text-[#007ea7] ring-16 ring-[#007ea7]/10 scale-125 rotate-12 border-4 border-white' : 
                                                    'bg-slate-50 border-2 border-slate-100 text-slate-200'
                                                }`}>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-50" />
                                                    {step.completed ? <CheckCircle2 size={36} strokeWidth={4} /> : <span className="text-3xl font-black italic">{step.step}</span>}
                                                </div>
                                                <div className="flex flex-col items-start lg:items-center gap-4">
                                                    <span className={`text-[13px] font-black uppercase tracking-[10px] italic leading-none transition-colors duration-700 ${step.active ? 'text-[#007ea7]' : step.completed ? 'text-[#003249]' : 'text-slate-200'}`}>{step.label}</span>
                                                    {step.active && (
                                                        <motion.div 
                                                            layoutId="active-sync-dot" 
                                                            className="w-4 h-4 rounded-full bg-[#007ea7] shadow-[0_0_20px_#007ea7] relative"
                                                        >
                                                            <div className="absolute inset-0 bg-[#007ea7] animate-ping opacity-40 rounded-full" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Strategic Recommendations Grid */}
            <div className="space-y-12 pb-16">
                <Reveal direction="up" delay={1.1}>
                    <div className="flex items-center gap-8 border-b-4 border-slate-50 pb-8 relative overflow-hidden group">
                        <div className="w-16 h-16 bg-[#003249] rounded-[1.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl relative overflow-hidden border-2 border-white/5 transition-transform group-hover:rotate-12 duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent" />
                            <Zap size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-4xl font-black uppercase tracking-tighter text-[#003249] italic leading-none">Grid_Optimization</h3>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[6px] italic opacity-60 flex items-center gap-3">
                                <SearchCheck size={12} strokeWidth={4} className="text-[#007ea7]" /> HIGH_YIELD_PROTOCOLS_IDENTIFIED_FOR_YOUR_SECTOR
                            </p>
                        </div>
                    </div>
                </Reveal>

                <div className="grid md:grid-cols-2 gap-12">
                    {[
                        { title: "Nexus Travel", desc: "Borderless protection for global operatives. Synchronized medical evacuation & mobility support in 180+ global sectors.", icon: Plane, tag: "POPULAR", color: "from-blue-500/10 to-transparent" },
                        { title: "BioSync Pro", desc: "Advanced biological entity coverage with real-time biometric vetting and trauma-center synchronization protocols.", icon: Heart, tag: "SYSTEM_GEN", color: "from-rose-500/10 to-transparent" }
                    ].map((c, i) => (
                        <Reveal key={i} direction={i % 2 === 0 ? "left" : "right"} delay={1.2 + i * 0.1}>
                            <div className="saas-card flex flex-col md:flex-row items-center gap-14 group shadow-4xl hover:border-[#007ea7]/40 transition-all duration-1000 overflow-hidden relative p-16 border-2 border-slate-50 bg-white/50 backdrop-blur-md min-h-[350px] rounded-[5rem]">
                                 {/* Decorative Backdrop */}
                                 <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${c.color} blur-[120px] rounded-full group-hover:scale-150 transition-transform duration-[6000ms] opacity-50`} />
                                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#003249_1px,transparent_0)] [background-size:24px_24px] opacity-[0.015] pointer-events-none" />

                                <div className="w-32 h-32 bg-[#003249] border-4 border-white rounded-[3rem] shrink-0 flex items-center justify-center text-[#007ea7] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 shadow-4xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent" />
                                    <c.icon size={52} strokeWidth={2.5} className="relative z-10" />
                                </div>

                                <div className="flex-1 relative z-10 space-y-8">
                                    <div className="flex flex-wrap items-center gap-8">
                                        <h3 className="text-4xl font-black text-[#003249] uppercase tracking-tighter italic leading-none group-hover:text-[#007ea7] transition-colors">{c.title}</h3>
                                        <div className="px-6 py-2 bg-[#003249] rounded-xl border border-white/10 shadow-3xl relative overflow-hidden group/tag">
                                             <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-shimmer" />
                                             <span className="text-[10px] font-black text-[#80ced7] uppercase tracking-[8px] italic leading-none">{c.tag}</span>
                                        </div>
                                    </div>
                                    <p className="text-[14px] font-black text-slate-400 uppercase tracking-[5px] italic leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-700">{c.desc}</p>
                                    <button className="flex items-center gap-8 text-[12px] font-black text-[#007ea7] uppercase tracking-[12px] hover:gap-14 transition-all outline-none italic group-hover:translate-x-4 duration-700 scale-95 group-hover:scale-100 origin-left">
                                        INITIALIZE_SYNC <ArrowRight size={32} strokeWidth={4} className="group-hover:rotate-[-45deg] transition-transform duration-700" />
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>

            {/* System Log Footer */}
            <Reveal direction="up" delay={1.4}>
                <div className="flex flex-wrap justify-between gap-12 bg-[#003249] p-12 rounded-[4rem] border-2 border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#007ea7]/10 via-transparent to-transparent opacity-50" />
                    <div className="flex flex-wrap items-center gap-16 relative z-10">
                        <div className="flex items-center gap-6 text-[10px] font-black text-white/30 uppercase tracking-[8px] italic leading-none hover:text-[#80ced7] transition-all cursor-crosshair">
                            <Fingerprint size={24} strokeWidth={3} className="text-[#007ea7]" /> IDENTITY://{user?._id?.slice(-12).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-black text-white/30 uppercase tracking-[8px] italic leading-none hover:text-[#80ced7] transition-all cursor-crosshair">
                            <Layers size={24} strokeWidth={3} className="text-[#007ea7]" /> PROTOCOL://ACTIVE_v4.2
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-black text-white/30 uppercase tracking-[8px] italic leading-none hover:text-[#80ced7] transition-all cursor-crosshair">
                            <Globe size={24} strokeWidth={3} className="text-[#007ea7]" /> SECTOR://CTZ-99-ALPHA
                        </div>
                    </div>
                    <div className="flex items-center gap-6 relative z-10 px-8 py-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]" />
                        <span className="text-[10px] font-black text-[#80ced7] tracking-[6px] italic leading-none uppercase">Grid_Status: Secure</span>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default CustomerDashboard;
