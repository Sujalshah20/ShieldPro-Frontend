import React, { useContext } from "react";
import { 
    User, Mail, Phone, MapPin, Edit3, 
    Award, Shield, FileText, BarChart3, 
    TrendingUp, Star, StarHalf, DollarSign,
    Download, Briefcase, Calendar, CheckCircle2,
    ChevronRight, ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import Reveal from "../../components/common/Reveal";

const AgentProfile = () => {
    const { user } = useContext(AuthContext);

    // Mock data for demonstration (real data would come from context/api)
    const agentData = {
        name: user?.name || "Vikram Malhotra",
        role: "Senior Agent",
        id: "AG-7829",
        email: user?.email || "v.malhotra@secureshield.com",
        phone: "+1 (555) 902-3481",
        location: "Chicago, IL",
        specialization: "Health & Life Insurance",
        experience: "8 Years",
        joinDate: "March 12, 2016",
        address: "4228 North Clark St, Chicago, IL 60613, United States",
        commission: "$12,480.00",
        stats: [
            { label: "Total Customers", value: "124", change: "+8%", icon: Users },
            { label: "Policies Sold", value: "312", change: "+12%", icon: Shield },
            { label: "Settlement Rate", value: "98.5%", icon: CheckCircle2 },
            { label: "Avg. Rating", value: "4.8 / 5.0", icon: Star }
        ],
        certificates: [
            { title: "Life Underwriting Cert", date: "Jan 2023", icon: Award },
            { title: "Advanced Health Advisor", date: "Nov 2022", icon: Shield },
            { title: "State Compliance License", date: "May 2023", icon: FileText },
            { title: "Ethical Sales Master", date: "Aug 2022", icon: Star }
        ]
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8 min-h-screen">
            {/* Header Navigation/Title */}
            <div className="flex items-center justify-between mb-4">
                <Reveal>
                    <h1 className="text-2xl font-bold text-black tracking-tight">Agent Profile Management</h1>
                </Reveal>
            </div>

            {/* Profile Header Card */}
            <Reveal delay={0.1}>
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 transition-opacity group-hover:opacity-80" />
                    
                    <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                                <User size={64} className="text-slate-400" />
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-[#14b8a6] text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform">
                                <Edit3 size={16} />
                            </button>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                                    <h2 className="text-3xl font-black text-black tracking-tighter italic uppercase leading-none">{agentData.name}</h2>
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black bg-black text-white uppercase tracking-[4px] italic shadow-3xl">
                                        {agentData.role}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-black/40 uppercase tracking-[5px] mt-2 italic shadow-sm">OPERATOR_ID: {agentData.id}</p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2 text-black/80 font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-black">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-sm">{agentData.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-black/80 font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-black">
                                        <Phone size={16} />
                                    </div>
                                    <span className="text-sm">{agentData.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-black/80 font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-black">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-sm">{agentData.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Actions */}
                        <div className="flex gap-4">
                            <button className="flex items-center gap-4 px-10 py-5 bg-black text-white rounded-2xl font-black text-[11px] shadow-3xl hover:bg-black/90 transition-all whitespace-nowrap uppercase tracking-[4px] italic border-b-4 border-white/10">
                                <Edit3 size={20} className="text-white/40" />
                                UPDATE_PROFILE
                            </button>
                        </div>
                    </div>

                    {/* Tabs Placeholder */}
                    <div className="mt-12 flex gap-12 border-b border-slate-100 relative">
                        {["Personal Information", "Performance", "Commission", "Documents"].map((tab, i) => (
                            <button 
                                key={tab}
                                className={`pb-5 text-[10px] font-black uppercase tracking-[3px] transition-all relative italic ${
                                    i === 0 ? "text-black opacity-100" : "text-black/20 hover:text-black/60"
                                }`}
                            >
                                {tab}
                                {i === 0 && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </Reveal>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Details & Certificates */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Personal Details Section */}
                    <Reveal delay={0.2}>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <h3 className="text-[12px] font-black text-black flex items-center gap-3 uppercase tracking-[3px] italic">
                                    <User size={18} className="text-black/20" />
                                    PERSONAL_DETAILS_ACCESS
                                </h3>
                                <button className="text-[9px] font-black text-black/40 hover:text-black uppercase tracking-widest transition-all italic underline decoration-2 underline-offset-4 decoration-black/10">EXPAND_FULL_LOG</button>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <DetailItem label="Full Name" value={agentData.name} />
                                <DetailItem label="Email Address" value={agentData.email} />
                                <DetailItem label="Phone Number" value={agentData.phone} />
                                <DetailItem label="Specialization" value={agentData.specialization} />
                                <DetailItem label="Experience" value={agentData.experience} />
                                <DetailItem label="Join Date" value={agentData.joinDate} />
                                <div className="md:col-span-2">
                                    <DetailItem label="Registered Protocol Address" value={agentData.address} />
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Certificates Section */}
                    <Reveal delay={0.3}>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <h3 className="text-[12px] font-black text-black flex items-center gap-3 uppercase tracking-[3px] italic">
                                    <Award size={18} className="text-black/20" />
                                    CERTIFICATIONS_LIST_VTL
                                </h3>
                                <button className="text-[9px] font-black text-black/40 hover:text-black uppercase tracking-widest transition-all italic underline decoration-2 underline-offset-4 decoration-black/10">VERIFY_CHAIN</button>
                            </div>
                            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {agentData.certificates.map((cert, i) => {
                                    const CertIcon = cert.icon;
                                    return (
                                         <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-black/10 hover:bg-slate-50 transition-all cursor-pointer">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-black/40 transition-colors group-hover:bg-black group-hover:text-white">
                                                <CertIcon size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black text-black uppercase tracking-tighter truncate">{cert.title}</p>
                                                <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">Issued: {cert.date}</p>
                                            </div>
                                            <div className="p-2 text-black/10 group-hover:text-black transition-colors">
                                                <Download size={18} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Right Column: Stats & Commission */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Performance Stats */}
                    <Reveal delay={0.4}>
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-[11px] font-black text-black uppercase tracking-[3px] italic font-black mb-8 flex items-center gap-3">
                                <BarChart3 size={18} className="text-black/20" />
                                PERFORMANCE_METRICS_V2
                            </h3>
                            <div className="space-y-6">
                                <StatRow label="Total Customers" value="124" icon={Users} color="teal" change="+8.2%" />
                                <StatRow label="Policies Sold" value="312" icon={Shield} color="blue" change="+12.5%" />
                                <StatRow label="Settlement Rate" value="98.5%" icon={CheckCircle2} color="indigo" progress={98.5} />
                                <StatRow label="Avg. Rating" value="4.8 / 5.0" icon={Star} color="amber" rating={4.8} />
                            </div>
                        </div>
                    </Reveal>

                    {/* Commission Card */}
                    <Reveal delay={0.5}>
                        <div className="bg-black rounded-2xl p-10 text-white relative overflow-hidden group shadow-3xl border-b-8 border-white/5">
                            {/* Decorative blur */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[100px] -mr-16 -mt-16 opacity-10" />
                            
                            <div className="relative z-10 flex flex-col justify-between h-full space-y-10">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                                        <DollarSign size={28} className="text-white/40" />
                                    </div>
                                    <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[4px] mb-3 italic">COMMISSION_POOL_TOTAL</h3>
                                    <div className="flex flex-col">
                                        <p className="text-5xl font-black tracking-tighter italic">{agentData.commission}</p>
                                        <div className="flex items-center gap-2 mt-4 text-white/60">
                                            <TrendingUp size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest italic">+15.4% VOL_INCR</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-5 pt-8 border-t border-white/5">
                                    <div className="flex items-center justify-between text-[9px] font-black text-white/30 uppercase tracking-[3px] italic">
                                        <span>NEXT_PAYOUT_WINDOW</span>
                                        <span className="text-white">OCT_05_2023</span>
                                    </div>
                                    <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-[11px] shadow-3xl hover:bg-white/90 transition-all transform hover:-translate-y-1 uppercase tracking-[5px] italic">
                                        ACCESS_LEDGER_MANIFEST
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

            </div>
        </div>
    );
};

// Helper Components
const DetailItem = ({ label, value }) => (
    <div className="space-y-2 group">
        <label className="text-[9px] font-black text-black/30 uppercase tracking-[4px] group-hover:text-black transition-colors italic">{label}</label>
        <div className="p-5 bg-slate-50/50 rounded-2xl border-2 border-slate-50 text-black font-black text-[12px] group-hover:border-black/10 group-hover:bg-white transition-all italic uppercase tracking-tighter shadow-inner">
            {value}
        </div>
    </div>
);

const StatRow = ({ label, value, icon: Icon, color, change, progress, rating }) => {
    const colorClasses = {
        teal: "text-[#14b8a6] bg-teal-50",
        blue: "text-blue-500 bg-blue-50",
        indigo: "text-indigo-500 bg-indigo-50",
        amber: "text-amber-500 bg-amber-50"
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-black text-white shadow-3xl">
                        <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-black text-black/40 uppercase tracking-[3px] italic">{label}</span>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black text-black italic uppercase tracking-tighter">{value}</span>
                    {change && (
                        <div className="flex items-center gap-1.5 text-[9px] text-black font-black justify-end uppercase tracking-widest italic">
                            <TrendingUp size={10} className="opacity-20" />
                            {change}
                        </div>
                    )}
                </div>
            </div>
            
            {progress !== undefined && (
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-indigo-500 rounded-full"
                    />
                </div>
            )}

            {rating !== undefined && (
                <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    <StarHalf size={14} fill="currentColor" />
                    <span className="ml-2 text-[11px] font-bold text-slate-400">Extremely Reliable</span>
                </div>
            )}
        </div>
    );
};

const Users = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default AgentProfile;
