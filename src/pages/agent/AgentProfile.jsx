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
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Agent Profile Management</h1>
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
                                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-1">
                                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{agentData.name}</h2>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#14b8a6]/10 text-[#14b8a6] uppercase tracking-wider">
                                        {agentData.role}
                                    </span>
                                </div>
                                <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">Agent ID: {agentData.id}</p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#14b8a6]">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-sm font-medium">{agentData.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                        <Phone size={16} />
                                    </div>
                                    <span className="text-sm font-medium">{agentData.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-sm font-medium">{agentData.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Actions */}
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-[#14b8a6] text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-[#0d9488] transition-all whitespace-nowrap">
                                <Edit3 size={18} />
                                Update Profile
                            </button>
                        </div>
                    </div>

                    {/* Tabs Placeholder */}
                    <div className="mt-10 flex gap-10 border-b border-slate-100 relative">
                        {["Personal Information", "Performance", "Commission", "Documents"].map((tab, i) => (
                            <button 
                                key={tab}
                                className={`pb-4 text-[13px] font-bold tracking-tight transition-all relative ${
                                    i === 0 ? "text-[#14b8a6]" : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {tab}
                                {i === 0 && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#14b8a6] rounded-full"
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
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <User size={18} className="text-[#14b8a6]" />
                                    Personal Details
                                </h3>
                                <button className="text-[12px] font-bold text-[#14b8a6] hover:underline uppercase tracking-wider">Expand All</button>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <DetailItem label="Full Name" value={agentData.name} />
                                <DetailItem label="Email Address" value={agentData.email} />
                                <DetailItem label="Phone Number" value={agentData.phone} />
                                <DetailItem label="Specialization" value={agentData.specialization} />
                                <DetailItem label="Experience" value={agentData.experience} />
                                <DetailItem label="Join Date" value={agentData.joinDate} />
                                <div className="md:col-span-2">
                                    <DetailItem label="Registered Address" value={agentData.address} />
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Certificates Section */}
                    <Reveal delay={0.3}>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Award size={18} className="text-amber-500" />
                                    Certifications & Licenses
                                </h3>
                                <button className="text-[12px] font-bold text-[#14b8a6] hover:underline uppercase tracking-wider">Verify All</button>
                            </div>
                            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {agentData.certificates.map((cert, i) => {
                                    const CertIcon = cert.icon;
                                    return (
                                        <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-teal-100 hover:bg-teal-50/30 transition-all cursor-pointer">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-teal-600 transition-colors group-hover:bg-[#14b8a6] group-hover:text-white">
                                                <CertIcon size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">{cert.title}</p>
                                                <p className="text-[11px] font-medium text-slate-400">Issued: {cert.date}</p>
                                            </div>
                                            <div className="p-2 text-slate-300 group-hover:text-[#14b8a6] transition-colors">
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
                            <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <BarChart3 size={18} className="text-blue-500" />
                                Performance Highlights
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
                        <div className="bg-[#1a2b4b] rounded-2xl p-8 text-white relative overflow-hidden group shadow-xl shadow-blue-900/10">
                            {/* Decorative blur */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#14b8a6] rounded-full blur-[80px] -mr-16 -mt-16 opacity-30" />
                            
                            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                        <DollarSign size={24} className="text-[#14b8a6]" />
                                    </div>
                                    <h3 className="text-white/60 font-bold text-[12px] uppercase tracking-widest mb-2">Current Commission Pool</h3>
                                    <div className="flex flex-col">
                                        <p className="text-4xl font-extrabold tracking-tight">{agentData.commission}</p>
                                        <div className="flex items-center gap-2 mt-2 text-teal-400">
                                            <TrendingUp size={14} />
                                            <span className="text-[11px] font-bold">15.4% increase from last period</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-white/40 uppercase tracking-wider">
                                        <span>Next Payout Cycle</span>
                                        <span className="text-white">Oct 05, 2023</span>
                                    </div>
                                    <button className="w-full bg-white text-[#1a2b4b] py-4 rounded-2xl font-extrabold text-sm shadow-lg hover:bg-[#14b8a6] hover:text-white transition-all transform hover:-translate-y-1">
                                        Full Ledger Details
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
        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-[#14b8a6] transition-colors">{label}</label>
        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50 text-slate-800 font-bold text-sm group-hover:border-teal-100 group-hover:bg-white transition-all">
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
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
                        <Icon size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-500">{label}</span>
                </div>
                <div className="text-right">
                    <span className="text-lg font-extrabold text-slate-800">{value}</span>
                    {change && (
                        <div className="flex items-center gap-0.5 text-[10px] text-green-600 font-bold justify-end">
                            <TrendingUp size={10} />
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
