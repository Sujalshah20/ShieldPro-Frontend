import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Shield, CheckCircle2, ChevronDown, ChevronRight,
    Share2, Download, Phone, Lock, Zap, Headphones,
    Building2, Heart, Cross
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
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
            {/* Simple top nav */}
            <header className="bg-white border-b border-gray-100 px-6 py-2.5 flex items-center gap-6 sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-2">
                    <Shield size={20} className="text-black" />
                    <span className="font-bold text-black text-base">Secure Shield</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 ml-8 text-[13px] font-black text-black uppercase tracking-wider">
                    <button onClick={() => navigate('/customer')} className="hover:text-black transition-colors">Dashboard</button>
                    <button onClick={() => navigate('/customer/policies')} className="hover:text-black transition-colors border-b-2 border-[#002b45] text-black">Policies</button>
                    <button onClick={() => navigate('/customer/claims')} className="hover:text-black transition-colors">Claims</button>
                    <button className="hover:text-black transition-colors">Support</button>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] font-black text-black opacity-30 mb-4 uppercase tracking-[4px] italic">
                    {BREADCRUMBS.map((crumb, i) => (
                        <React.Fragment key={crumb}>
                            {i > 0 && <ChevronRight size={12} />}
                            <span className={i === BREADCRUMBS.length - 1 ? 'text-black font-black uppercase tracking-widest' : 'hover:text-[#124C89] cursor-pointer'}>{crumb}</span>
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT: Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Policy Header Card */}
                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-xl font-bold text-black">{display.policyName}</h1>
                                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">ACTIVE</span>
                                    </div>
                                    <p className="text-[13px] font-bold text-black uppercase tracking-widest">{display.provider}</p>
                                </div>
                                <button className="flex items-center gap-2 text-[13px] font-bold text-black border-2 border-slate-100 rounded-xl px-3 py-1.5 hover:bg-slate-50 transition-all shrink-0">
                                    <Share2 size={14} /> Share
                                </button>
                            </div>
                            <p className="text-[14px] text-black font-medium leading-relaxed italic">{display.description}</p>
                        </div>

                        {/* Key Benefits */}
                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                            <h2 className="text-base font-bold text-black flex items-center gap-2 mb-4">
                                <Shield size={18} className="text-black" /> Key Benefits
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {keyBenefits.map((b, i) => (
                                    <div key={i} className="border border-gray-100 rounded-xl p-3 flex items-start gap-4 hover:shadow-sm transition-shadow">
                                        <div className="w-8 h-8 rounded-lg bg-[#002b45]/5 text-white flex items-center justify-center shrink-0">
                                            {React.cloneElement(b.icon, { size: 18 })}
                                        </div>
                                        <div>
                                            <p className="font-bold text-black text-[13px] mb-0.5">{b.title}</p>
                                            <p className="text-[11px] text-black font-bold leading-relaxed">{b.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Coverage Details */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-black text-black flex items-center gap-2 mb-5">
                                <CheckCircle2 size={20} className="text-emerald-500" /> Coverage Details
                            </h2>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-[10px] font-black text-black uppercase tracking-[2px] pb-4">Feature</th>
                                        <th className="text-right text-[10px] font-black text-black uppercase tracking-[2px] pb-4">Coverage Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {coverageDetails.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3.5 text-black font-medium">{row.feature}</td>
                                            <td className="py-3.5 text-right font-semibold text-black">{row.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Terms & Conditions (Accordion) */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-black mb-5">Terms & Conditions</h2>
                            <div className="space-y-3">
                                {faqData.map((item, i) => (
                                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                                        <button
                                            className="w-full flex items-center justify-between text-left px-5 py-4 text-sm font-semibold text-black hover:bg-gray-50 transition-colors"
                                            onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                                        >
                                            {item.q}
                                            <ChevronDown size={18} className={`shrink-0 transition-transform text-black ${openFaq === i ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openFaq === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <p className="px-5 pb-4 text-sm text-black font-medium leading-relaxed italic">{item.a}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Documents Required */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-black mb-5">Documents Required</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {documentsRequired.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-xl p-4">
                                        <div className="text-black">{doc.icon}</div>
                                        <span className="text-sm font-bold text-black">{doc.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Purchase Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md sticky top-24">
                            <p className="text-[9px] font-black uppercase tracking-[2px] text-black mb-1">STARTING PREMIUM</p>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-3xl font-black text-black">₹{display.premiumAmount?.toLocaleString()}</span>
                                <span className="text-xs text-black font-bold uppercase tracking-widest">/month</span>
                            </div>
                            <p className="text-[10px] text-black font-bold mt-1 uppercase tracking-wider">or ₹{(display.premiumAmount * 12)?.toLocaleString()} billed annually</p>

                            <div className="flex items-center justify-between mb-4 py-3 border-t border-b border-gray-100">
                                <span className="text-[13px] font-black text-black uppercase tracking-wider">Coverage Amount</span>
                                <span className="font-bold text-black">₹{display.coverageAmount?.toLocaleString()}</span>
                            </div>

                            <p className="text-[10px] font-black text-black uppercase tracking-[2px] mb-4">Select Duration</p>
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                {durations.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                                            duration === d
                                                ? 'bg-[#002b45] text-white border-[#002b45]'
                                                : 'bg-white text-black border-2 border-slate-100 hover:bg-slate-50 font-bold'
                                        }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate('/customer/apply', { state: { policy: display } })}
                                className="w-full bg-[#10b981] text-white py-3 rounded-lg font-bold text-[13px] hover:bg-[#059669] transition-colors shadow-sm mb-3"
                            >
                                Buy This Policy
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 border-2 border-slate-100 py-3 rounded-xl text-[12px] font-black text-black uppercase tracking-widest hover:bg-slate-50 transition-all mb-3 shadow-sm italic">
                                <Download size={15} /> Download Brochure
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 border-2 border-slate-100 py-3 rounded-xl text-[12px] font-black text-black uppercase tracking-widest hover:bg-slate-50 transition-all italic">
                                <Phone size={15} /> Talk to Agent
                            </button>

                            <div className="flex items-center justify-around mt-6 pt-5 border-t border-gray-100 text-center">
                                <div className="flex flex-col items-center gap-1 text-black font-bold uppercase tracking-tighter">
                                    <Lock size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">SECURE PAYMENT</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-black font-bold uppercase tracking-tighter">
                                    <Zap size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">INSTANT POLICY</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-black font-bold uppercase tracking-tighter">
                                    <Headphones size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">24/7 SUPPORT</span>
                                </div>
                            </div>
                        </div>

                        {/* Need Help Card */}
                        <div className="bg-[#002b45] rounded-2xl p-5 text-white">
                            <p className="font-bold mb-1">Need Help?</p>
                            <p className="text-xs text-white/60 leading-relaxed mb-4">Our health experts are available to guide you through the best choices.</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">CALL US AT</p>
                                    <p className="font-bold">1800-456-7890</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 mt-10 py-10 text-center">
                <div className="flex items-center justify-center gap-3 text-black mb-2 opacity-60">
                    <Shield size={20} strokeWidth={3} />
                    <span className="font-black text-[12px] uppercase tracking-[4px] italic">Secure Shield</span>
                </div>
                <p className="text-[10px] font-black text-black opacity-30 uppercase tracking-[5px] italic">© 2024 Secure Shield Insurance Brokers // IRDAI_REG_12345_ACTIVE</p>
            </div>
        </div>
    );
};

export default PolicyDetail;
