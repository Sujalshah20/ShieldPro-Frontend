import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Shield, CheckCircle2, ChevronDown, ChevronRight,
    Lock, Zap, Building2, Heart, Cross
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
    {
        q: "Eligibility & Age Limit",
        a: "Minimum entry age is 18 years for adults and 91 days for children. Maximum entry age is 65 years."
    },
    {
        q: "Waiting Periods",
        a: "There is a standard 30-day waiting period for all illnesses (except accidents). Pre-existing diseases have a 2-year waiting period."
    },
    {
        q: "Exclusions (What is not covered)",
        a: "Cosmetic surgery, experimental treatments, war-related injuries, and self-inflicted injuries are not covered under this plan."
    }
];

const BREADCRUMBS = ["Policies", "Health Insurance", "Health Shield Plus"];

const PolicyDetail = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const policy = state?.policy;
    const [openFaq, setOpenFaq] = useState(0);
    const [duration, setDuration] = useState("1 Year");

    // Demo data if no policy passed
    const display = policy || {
        policyName: "Health Shield Plus",
        policyType: "Health",
        premiumAmount: 1200,
        coverageAmount: 500000,
        durationYears: 1,
        description: "Health Shield Plus is a premium health insurance plan meticulously crafted to offer broad-spectrum medical coverage for individuals and families. From unexpected emergencies to planned procedures, this policy ensures you have access to the best healthcare facilities without the burden of escalating medical costs. Featuring a vast network of 5,000+ hospitals, it prioritizes your health and financial security.",
        provider: "Guardian Life Insurance Co.",
        _id: "demo1234567890"
    };

    const keyBenefits = [
        { icon: <Building2 size={22} />, title: "Cashless Hospitalization", sub: "Get treated at any network hospital without paying upfront cash." },
        { icon: <Cross size={22} />, title: "Pre & Post Hospitalization", sub: "Coverage for expenses 30 days before and 60 days after admission." },
        { icon: <Heart size={22} />, title: "No Medical Check-up", sub: "Instant approval for individuals under 45 years of age." },
        { icon: <Shield size={22} />, title: "Tax Benefits", sub: "Save tax under Section 80D on the premium paid for this policy." },
    ];

    const coverageDetails = [
        { feature: "In-patient Hospitalization", amount: "Up to ₹5,00,000" },
        { feature: "ICU Charges", amount: "₹10,000 / day" },
        { feature: "Ambulance Charges", amount: "₹2,000 per event" },
        { feature: "Day Care Procedures", amount: "All procedures covered" },
        { feature: "Domiciliary Treatment", amount: "Up to ₹50,000" },
    ];

    const documentsRequired = [
        { icon: <Shield size={18} />, label: "Identity Proof (Aadhar/PAN)" },
        { icon: <Building2 size={18} />, label: "Address Proof" },
        { icon: <CheckCircle2 size={18} />, label: "Age Proof" },
        { icon: <Heart size={18} />, label: "Passport size photographs" },
    ];

    const durations = ["1 Year", "2 Years", "3 Years"];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            {/* Simple top nav */}
            <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-6 sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/customer')}>
                    <Shield size={20} className="text-[#134e8d]" />
                    <span className="font-bold text-[#134e8d] text-base tracking-tight">ShieldPro</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 ml-8 text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                    <button onClick={() => navigate('/customer')} className="hover:text-[#134e8d] transition-colors">Dashboard</button>
                    <button onClick={() => navigate('/customer/policies')} className="text-[#134e8d] border-b-2 border-[#134e8d] pb-0.5">Policies</button>
                    <button onClick={() => navigate('/customer/claims')} className="hover:text-[#134e8d] transition-colors">Claims</button>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 mb-8 uppercase tracking-wider">
                    {BREADCRUMBS.map((crumb, i) => (
                        <React.Fragment key={crumb}>
                            {i > 0 && <ChevronRight size={12} className="opacity-50" />}
                            <span className={i === BREADCRUMBS.length - 1 ? 'text-[#134e8d] font-bold' : 'hover:text-[#134e8d] cursor-pointer transition-colors'}>{crumb}</span>
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* LEFT: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Policy Header Card */}
                        <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-slate-800">{display.policyName}</h1>
                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Active Policy</span>
                                </div>
                                <p className="text-sm font-bold text-[#134e8d]/60 uppercase tracking-widest">{display.provider}</p>
                            </div>
                            <p className="text-[17px] text-slate-500 font-medium leading-relaxed">{display.description}</p>
                        </div>

                        {/* Key Benefits */}
                        <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-8">
                                <Shield size={24} className="text-[#134e8d]" /> Key Benefits
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {keyBenefits.map((b, i) => (
                                    <div key={i} className="border border-slate-50 rounded-2xl p-6 flex items-start gap-5 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#134e8d] flex items-center justify-center shrink-0 group-hover:bg-[#134e8d] group-hover:text-white transition-all">
                                            {React.cloneElement(b.icon, { size: 24 })}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-base mb-1">{b.title}</p>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{b.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Coverage Details */}
                        <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-8">
                                <CheckCircle2 size={28} className="text-[#10b981]" /> Coverage Details
                            </h2>
                            <div className="overflow-hidden rounded-xl border border-slate-50">
                                <table className="w-full text-base">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-8 py-5">Feature</th>
                                            <th className="text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider px-8 py-5">Coverage Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {coverageDetails.map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-5 text-slate-700 font-medium">{row.feature}</td>
                                                <td className="px-8 py-5 text-right font-bold text-slate-900">{row.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Terms & Conditions (Accordion) */}
                        <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 mb-8">Terms & Conditions</h2>
                            <div className="space-y-4">
                                {faqData.map((item, i) => (
                                    <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden transition-all hover:border-slate-200">
                                        <button
                                            className="w-full flex items-center justify-between text-left px-8 py-6 text-base font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                            onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                                        >
                                            {item.q}
                                            <ChevronDown size={20} className={`shrink-0 transition-transform text-[#134e8d] ${openFaq === i ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openFaq === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <p className="px-8 pb-6 text-[15px] text-slate-500 font-medium leading-relaxed">
                                                        {item.a}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Documents Required */}
                        <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 mb-8">Documents Required</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {documentsRequired.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-5 border border-slate-100 rounded-2xl p-6 hover:bg-slate-50 transition-all group">
                                        <div className="text-[#134e8d] group-hover:scale-110 transition-transform">{React.cloneElement(doc.icon, { size: 22 })}</div>
                                        <span className="text-base font-bold text-slate-700">{doc.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Purchase Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg shadow-slate-100/50 sticky top-24">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Starting Premium</p>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold text-slate-900">₹{display.premiumAmount?.toLocaleString()}</span>
                                <span className="text-sm text-slate-400 font-bold uppercase">/ month</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium mb-8">Annual billed amount: ₹{(display.premiumAmount * 12)?.toLocaleString()}</p>

                            <div className="space-y-5 mb-10 py-8 border-t border-b border-slate-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coverage</span>
                                    <span className="text-base font-bold text-slate-800">₹{display.coverageAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID Number</span>
                                    <span className="text-[13px] font-mono font-medium text-slate-500">#SP-{display._id.slice(-6).toUpperCase()}</span>
                                </div>
                            </div>

                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5 px-1">Select Tenure</p>
                            <div className="grid grid-cols-3 gap-3 mb-10">
                                {durations.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`py-3 rounded-xl text-[13px] font-bold border transition-all ${
                                            duration === d
                                                ? 'bg-[#134e8d] text-white border-[#134e8d] shadow-md shadow-blue-100'
                                                : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                                        }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate('/customer/apply', { state: { policy: display } })}
                                className="w-full bg-[#10b981] text-white py-5 rounded-xl font-bold text-base hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100 mb-8 transform hover:-translate-y-0.5"
                            >
                                Buy Policy Now
                            </button>
                            
                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Secure</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Zap size={18} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Instant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetail;
