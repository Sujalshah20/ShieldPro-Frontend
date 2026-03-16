import React from "react";
import { 
    Shield, ShieldCheck, FileText, 
    ArrowRight, Bell, Plus,
    Home, Car, Heart, Plane,
    Clock, CheckCircle2, Search,
    Layout
} from "lucide-react";
import Reveal from "../../components/common/Reveal";

const CustomerDashboard = () => {
    const policies = [
        { id: "SH-88291", title: "Home Insurance", status: "Active", type: "Home", date: "Dec 2024", icon: Home },
        { id: "SA-22184", title: "Auto Premium", status: "Active", type: "Auto", date: "June 2025", icon: Car },
    ];

    const claimProgress = [
        { label: "Received", completed: true, active: false, step: 1 },
        { label: "Review", completed: false, active: true, step: 2 },
        { label: "Evaluation", completed: false, active: false, step: 3 },
        { label: "Settlement", completed: false, active: false, step: 4 },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-display">
            {/* Customer Navigation */}
            <nav className="bg-white border-b border-[#ccdbdc]/30 sticky top-0 z-50">
                <div className="saas-container h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#007ea7] p-1.5 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-black text-[#003249]">My Shield</span>
                        </div>
                        <nav className="hidden md:flex gap-6 text-[13px] font-semibold text-[#003249]/60">
                            <a href="#" className="text-[#007ea7]">Dashboard</a>
                            <a href="#" className="hover:text-[#007ea7] transition-colors">Policies</a>
                            <a href="#" className="hover:text-[#007ea7] transition-colors">Claims</a>
                            <a href="#" className="hover:text-[#007ea7] transition-colors">Support</a>
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#003249] cursor-pointer hover:bg-slate-200">
                             <Bell size={18} />
                        </div>
                        <div className="flex items-center gap-3 pl-4 border-l border-[#ccdbdc]/50">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-black text-[#003249]">Alex Wright</p>
                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Premium Node</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#ccdbdc] overflow-hidden">
                                <img src="https://i.pravatar.cc/100?u=customer" alt="Customer" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-12">
                <div className="saas-container">
                    {/* Welcome Section */}
                    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1>Hello, Alex.</h1>
                            <p className="max-w-md">Your active protocols are running nominally. We are currently processing your pending service request.</p>
                        </div>
                        <button className="btn btn-primary px-6 py-3 shadow-lg shadow-[#007ea7]/20 flex-shrink-0">
                            <Plus size={16} /> Submit New Claim
                        </button>
                    </header>

                    {/* Active Inventory Grid */}
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-[#007ea7]" />
                                <h3 className="text-lg">Active Inventory</h3>
                            </div>
                            <button className="text-[12px] font-bold text-[#007ea7] hover:underline">Manage All Policies</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {policies.map((p, i) => (
                                <div key={i} className="saas-card group">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="w-12 h-12 bg-slate-50 border border-[#ccdbdc]/30 rounded-2xl flex items-center justify-center text-[#003249]">
                                            <p.icon size={24} />
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                            {p.status}
                                        </span>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="text-xl mb-1">{p.title}</h3>
                                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Protocol ID: {p.id}</p>
                                    </div>
                                    <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-slate-400 capitalize">Renewal: {p.date}</span>
                                        <button className="text-[#007ea7] flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2.5">
                                            View Vault <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Add New Card */}
                            <div className="border-2 border-dashed border-[#ccdbdc] rounded-[1.5rem] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-[#007ea7]/40 hover:bg-[#007ea7]/5 transition-all group min-h-[220px]">
                                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#003249]/30 mb-4 group-hover:bg-[#007ea7]/10 group-hover:text-[#007ea7]">
                                     <Plus size={20} />
                                 </div>
                                 <p className="text-[11px] font-black text-[#003249]/40 uppercase tracking-widest group-hover:text-[#007ea7]">Add New Coverage</p>
                            </div>
                        </div>
                    </section>

                    {/* Claim Synchronization Status */}
                    <section className="mb-16">
                        <div className="flex items-center gap-2 mb-8">
                            <Clock size={20} className="text-[#007ea7]" />
                            <h3 className="text-lg">Service Sync Status</h3>
                        </div>
                        <div className="saas-card !p-0 overflow-hidden shadow-xl">
                            <div className="flex flex-col lg:flex-row">
                                <div className="lg:w-1/3 p-10 bg-slate-50 border-r border-[#ccdbdc]/30 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 bg-[#003249] rounded-xl flex items-center justify-center text-[#9ad1d4]">
                                                <Car size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg text-[#003249]">Claim #CL-95021</p>
                                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Filed 12 Oct 2023</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed opacity-60">
                                            Estimates received for front bumper impact. Specialists are finalizing the evaluation phase of the sync.
                                        </p>
                                    </div>
                                    <div className="mt-10 pt-6 border-t border-[#ccdbdc]/50 flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">ETA: Oct 28</span>
                                        <button className="text-[11px] font-black text-[#007ea7] uppercase tracking-widest hover:underline">Message Agent</button>
                                    </div>
                                </div>
                                <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center bg-white">
                                    <div className="relative flex justify-between">
                                        {/* Simplified Stepper for SaaS Look */}
                                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2" />
                                        <div className="absolute top-1/2 left-0 w-1/3 h-0.5 bg-[#007ea7] -translate-y-1/2" />

                                        {claimProgress.map((step, i) => (
                                            <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                    step.completed ? 'bg-[#007ea7] text-white' : 
                                                    step.active ? 'bg-[#007ea7] text-white ring-8 ring-[#007ea7]/10' : 
                                                    'bg-white border border-[#ccdbdc] text-slate-300'
                                                }`}>
                                                    {step.completed ? <CheckCircle2 size={14} /> : <span className="text-[11px] font-bold">{step.step}</span>}
                                                </div>
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-[#007ea7]' : 'opacity-30'}`}>{step.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recommended Sync Grid */}
                    <section className="mb-20">
                        <div className="flex items-center gap-2 mb-8">
                            <Activity size={20} className="text-[#007ea7]" />
                            <h3 className="text-lg">Optimize Your Coverage</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { title: "Nexus Travel", desc: "Borderless protection for your next global deployment.", icon: Plane, tag: "Popular" },
                                { title: "Pet Integrity", desc: "Full lifecycle care for your designated security assets.", icon: Heart, tag: "Updated" }
                            ].map((c, i) => (
                                <div key={i} className="saas-card flex flex-row items-center gap-8 group">
                                    <div className="w-16 h-16 bg-[#ccdbdc]/30 rounded-2xl flex-shrink-0 flex items-center justify-center text-[#007ea7] group-hover:bg-[#003249] group-hover:text-[#9ad1d4] transition-all">
                                        <c.icon size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg">{c.title}</h3>
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black text-[#003249]/40 uppercase tracking-widest">{c.tag}</span>
                                        </div>
                                        <p className="text-sm opacity-60 mb-4">{c.desc}</p>
                                        <button className="text-[11px] font-black text-[#007ea7] uppercase tracking-[2px] flex items-center gap-1.5 hover:gap-2.5 transition-all">
                                            Deploy Coverage <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Simple Bottom Footer */}
                    <footer className="pt-10 border-t border-[#ccdbdc]/30 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-[#003249]/30 uppercase tracking-[2px]">
                        <div className="flex items-center gap-4">
                            <Shield size={14} />
                            <span>ShieldPro Node Console © 2024</span>
                        </div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-[#007ea7]">Encryption Policy</a>
                            <a href="#" className="hover:text-[#007ea7]">Support Uplink</a>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;
