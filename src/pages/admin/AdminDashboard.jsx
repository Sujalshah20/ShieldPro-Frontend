import React from "react";
import { 
    Users, FileText, 
    TrendingUp, 
    Search, Bell, 
    Briefcase, AlertCircle,
    IndianRupee, ClipboardCheck,
    MoreHorizontal, Star, UserPlus,
    CheckCircle2, Clock, XCircle, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const StatCard = ({ title, value, trend, icon: Icon, color, sparkline }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                    <TrendingUp size={14} />
                    {trend}
                </div>
            )}
        </div>
        <div className="space-y-1">
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        {sparkline && (
            <div className="mt-4 h-12 w-full">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                    <path 
                        d="M0 25 Q 20 5, 40 20 T 80 10 T 100 25" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        )}
        {title === "Pending Actions" && (
            <div className="mt-4">
                <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Urgent</span>
            </div>
        )}
    </div>
);

const RevenueTrends = () => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-slate-800">Revenue Trends</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Last 12 Months</span>
        </div>
        <div className="h-64 relative group">
            <svg viewBox="0 0 800 200" className="w-full h-full">
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Grid Lines */}
                {[0, 50, 100, 150].map((y) => (
                    <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}
                {/* Path */}
                <path 
                    d="M0 160 C 100 160, 150 80, 200 100 C 250 120, 300 180, 400 120 C 500 60, 600 160, 700 80 L 800 80" 
                    fill="none" 
                    stroke="#1e3a8a" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-lg"
                />
                <path 
                    d="M0 160 C 100 160, 150 80, 200 100 C 250 120, 300 180, 400 120 C 500 60, 600 160, 700 80 L 800 80 V 200 H 0 Z" 
                    fill="url(#gradient)" 
                />
                {/* Dots */}
                {[0, 200, 400, 600, 700, 800].map((x, i) => (
                    <circle key={i} cx={x} cy={i === 0 ? 160 : i === 1 ? 100 : i === 2 ? 120 : i === 3 ? 150 : 80} r="6" fill="#1e3a8a" className="cursor-pointer hover:r-8 transition-all" />
                ))}
            </svg>
            <div className="flex justify-between mt-6 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
        </div>
    </div>
);

const PolicyDistribution = () => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
        <h3 className="text-xl font-bold text-slate-800 self-start mb-8">Policy Distribution</h3>
        <div className="relative w-48 h-48 mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                {/* Health (35%) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="163.28" />
                {/* Life (20%) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="113.04" className="rotate-[126deg] origin-center" />
                {/* Vehicle (25%) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#003249" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="188.4" className="rotate-[198deg] origin-center" />
                {/* Home/Travel (20%) */}
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="200.96" className="rotate-[288deg] origin-center" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 leading-none">10,234</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
            </div>
        </div>
        <div className="w-full space-y-3">
            {[
                { label: "Health", val: "35%", color: "bg-emerald-500" },
                { label: "Life", val: "20%", color: "bg-blue-500" },
                { label: "Vehicle", val: "25%", color: "bg-[#003249]" },
                { label: "Home", val: "10%", color: "bg-orange-500" },
                { label: "Travel", val: "10%", color: "bg-rose-500" }
            ].map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${d.color}`} />
                        <span className="text-slate-500">{d.label}</span>
                    </div>
                    <span className="text-slate-800">{d.val}</span>
                </div>
            ))}
        </div>
    </div>
);

const RecentActivities = () => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">Recent Activities</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
        </div>
        <div className="space-y-8">
            {[
                { title: "Policy #SS-8923 Approved", desc: "Health Insurance - Rahul Sharma", time: "10 MINUTES AGO", color: "text-emerald-500" },
                { title: "New Claim Submission", desc: "Vehicle Damage - Claim #CLM-401", time: "45 MINUTES AGO", color: "text-amber-500" },
                { title: "Agent Onboarding Complete", desc: "New agent: Sarah Jenkins (Mumbai Region)", time: "2 HOURS AGO", color: "text-blue-500" },
                { title: "Claim #CLM-388 Rejected", desc: "Missing documentation for Travel Policy", time: "5 HOURS AGO", color: "text-rose-500" }
            ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.color.replace('text-', 'bg-')}`} />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800 leading-tight">{activity.title}</p>
                        <p className="text-[11px] font-medium text-slate-400">{activity.desc}</p>
                        <p className="text-[10px] font-black text-slate-300 tracking-wider mt-1">{activity.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const TopAgents = () => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex-1">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">Top Performing Agents</h3>
            <button className="text-[10px] font-bold text-slate-500 border border-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-50">Export Table</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                        <th className="pb-4">Agent Name</th>
                        <th className="pb-4">Policies Sold</th>
                        <th className="pb-4">Revenue Generated</th>
                        <th className="pb-4">Rating</th>
                        <th className="pb-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { name: "Vikram Singh", sold: "1,245", rev: "₹45,20,000", rating: 5, img: "https://i.pravatar.cc/100?u=1" },
                        { name: "Ananya Reddy", sold: "1,102", rev: "₹38,90,000", rating: 5, img: "https://i.pravatar.cc/100?u=2" },
                        { name: "Michael Tan", sold: "945", rev: "₹31,45,000", rating: 5, img: "https://i.pravatar.cc/100?u=3" },
                        { name: "Priya Verma", sold: "882", rev: "₹29,10,000", rating: 5, img: "https://i.pravatar.cc/100?u=4" }
                    ].map((agent, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                                        <img src={agent.img} alt={agent.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{agent.name}</span>
                                </div>
                            </td>
                            <td className="py-4 text-xs font-medium text-slate-600">{agent.sold}</td>
                            <td className="py-4 text-xs font-bold text-slate-800">{agent.rev}</td>
                            <td className="py-4">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, star) => (
                                        <Star key={star} size={10} className="fill-orange-400 text-orange-400" />
                                    ))}
                                </div>
                            </td>
                            <td className="py-4">
                                <button className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-white transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const AdminDashboard = () => {
    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome back, Administrator!</h1>
                        <p className="text-sm font-medium text-slate-400 font-bold uppercase tracking-widest text-[10px]">Here's what's happening with your platform today.</p>
                    </div>
                </Reveal>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Policies" value="52" trend="+2.4%" icon={FileText} color="bg-blue-500" />
                <StatCard title="Total Customers" value="10,234" trend="+5%" icon={Users} color="bg-blue-400" />
                <StatCard title="Total Agents" value="156" icon={UserPlus} color="bg-emerald-500" />
                <StatCard title="Total Claims" value="3,456" icon={AlertCircle} color="bg-rose-500" />
                <StatCard title="Total Revenue" value="₹2,45,00,000" icon={IndianRupee} color="bg-emerald-600" sparkline />
                <StatCard title="Pending Actions" value="23" icon={ClipboardCheck} color="bg-orange-500" />
            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <RevenueTrends />
                </div>
                <div className="xl:col-span-1">
                    <PolicyDistribution />
                </div>
            </div>

            {/* Bottom Section: Activities & Agents */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <RecentActivities />
                <TopAgents />
            </div>
        </div>
    );
};

export default AdminDashboard;
