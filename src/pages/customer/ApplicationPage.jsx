import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, FileText, Upload, 
    CheckCircle2, Lock, AlertCircle, Shield, ShieldCheck,
    X, RefreshCcw, Heart, Car, Home, Globe, Check
} from "lucide-react";

const STEPS = [
    { id: 1, label: "Select Plan" },
    { id: 2, label: "Personal Details" },
    { id: 3, label: "Documents" },
    { id: 4, label: "Payment" },
    { id: 5, label: "Confirmation" },
];

const ApplicationPage = () => {
    const { user, profile } = useContext(AuthContext);
    const { state } = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const policy = state?.policy;
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState("1 Year");
    const [selectedFrequency, setSelectedFrequency] = useState("Monthly");
    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (!policy) navigate("/customer");
    }, [policy, navigate]);

    if (!policy) return null;

    const validateStep = () => {
        if (step === 2) {
            const requiredFields = ['name', 'dob', 'phone', 'email', 'aadhar', 'pan', 'address'];
            for (const field of requiredFields) {
                if (!formData[field]) {
                    toast({ title: "Validation Error", description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`, variant: "destructive" });
                    return false;
                }
            }
            
            // Phone validation (10 digits)
            if (!/^\d{10}$/.test(formData.phone)) {
                toast({ title: "Invalid Phone", description: "Phone number must be exactly 10 digits.", variant: "destructive" });
                return false;
            }
            
            // Aadhar validation (12 digits)
            if (!/^\d{12}$/.test(formData.aadhar)) {
                toast({ title: "Invalid Aadhaar", description: "Aadhaar number must be exactly 12 digits.", variant: "destructive" });
                return false;
            }
            
            // PAN validation
            if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
                toast({ title: "Invalid PAN", description: "PAN format must be ABCDE1234F.", variant: "destructive" });
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(s => Math.min(5, s + 1));
        }
    };
    const handleBack = () => setStep(s => Math.max(1, s - 1));

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles.map(f => ({ file: f, name: f.name, url: URL.createObjectURL(f) }))]);
    };

    const handleFileRemove = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!profile?.nationalId) {
            toast({ 
                title: "Missing ID Proof", 
                description: "Please update your Aadhar/PAN in your profile before applying.",
                variant: "destructive"
            });
            navigate("/customer/profile");
            return;
        }
        setLoading(true);
        try {
            const mockDocuments = files.map(f => ({ name: f.name, url: `https://storage.shieldpro.com/${f.name}` }));
            const application = await api.post("/applications", {
                policyId: policy._id,
                formData,
                documents: mockDocuments
            }, user.token);

            if (application._id) {
                toast({ title: "Application Submitted!", description: "Your application has been queued for verification. Proceed to payment." });
                navigate("/customer/checkout", { state: { policy, applicationId: application._id } });
            }
        } catch (error) {
            toast({ 
                title: "Submission Failed", 
                description: error?.errors?.[0]?.message || error?.message || "An error occurred. Please try again.", 
                variant: "destructive" 
            });
        } finally {
            setLoading(false);
        }
    };

    const getPolicyIcon = () => {
        const p = { size: 28, className: "text-gray-400" };
        switch(policy.policyType) {
            case 'Health': return <Heart {...p} className="text-blue-400" />;
            case 'Vehicle': case 'Auto': return <Car {...p} className="text-purple-400" />;
            case 'Property': case 'Home': return <Home {...p} className="text-orange-400" />;
            case 'Travel': return <Globe {...p} className="text-teal-400" />;
            default: return <Shield {...p} className="text-green-400" />;
        }
    };

    const gstAmount = Math.round(policy.premiumAmount * 0.18);
    const discount = selectedDuration === "3 Years" ? 300 : 0;
    const total = policy.premiumAmount * (selectedDuration === "1 Year" ? 1 : selectedDuration === "2 Years" ? 2 : 3) + 1200 + gstAmount - discount;

    const renderStep = () => (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
            >
                {step === 1 && (
                    <div className="space-y-6">
                        {/* Selected Plan */}
                        <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center">
                                    {React.cloneElement(getPolicyIcon(), { size: 24 })}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">{policy.policyName}</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Comprehensive medical coverage with cashless hospitalization.</p>
                                </div>
                            </div>
                            <button className="text-[12px] font-bold text-white hover:text-[#003b5c] transition-colors border-b border-dashed border-[#002b45]">
                                Change
                            </button>
                        </div>

                        {/* Choose Duration */}
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                                <span className="text-base">📅</span> Choose Duration
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "1 Year", tag: "Standard", save: null },
                                    { label: "2 Years", tag: "Popular", save: "Save 5% on Premium" },
                                    { label: "3 Years", tag: "Best Value", save: "Save 10% on Premium" },
                                ].map(d => (
                                    <button
                                        key={d.label}
                                        onClick={() => setSelectedDuration(d.label)}
                                        className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                                            selectedDuration === d.label
                                                ? 'border-[#002b45] bg-[#002b45]/5 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-1.5">
                                            <span className={`text-[9px] font-black uppercase tracking-wider ${selectedDuration === d.label ? 'text-white' : 'text-gray-400'}`}>{d.tag}</span>
                                            {selectedDuration === d.label && <Check size={14} className="text-white" />}
                                        </div>
                                        <p className={`text-base font-black ${selectedDuration === d.label ? 'text-white' : 'text-gray-700'}`}>{d.label}</p>
                                        {d.save && <p className="text-[9px] text-emerald-600 font-bold mt-1">{d.save}</p>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Frequency */}
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                                <span className="text-base">💳</span> Payment Frequency
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {["Monthly", "Quarterly", "Yearly"].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setSelectedFrequency(f)}
                                        className={`py-3 rounded-xl border-2 text-[13px] font-semibold flex items-center gap-2.5 px-4 transition-all ${
                                            selectedFrequency === f
                                                ? 'border-[#002b45] bg-[#002b45]/5 text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedFrequency === f ? 'border-[#002b45]' : 'border-gray-300'}`}>
                                            {selectedFrequency === f && <div className="w-1.5 h-1.5 rounded-full bg-[#002b45]" />}
                                        </div>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5">
                        <h3 className="text-sm font-bold text-white">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Full Name", name: "name", type: "text", placeholder: "Enter your full name", required: true },
                                { label: "Date of Birth", name: "dob", type: "date", placeholder: "", required: true },
                                { label: "Phone Number (10 Digits)", name: "phone", type: "tel", placeholder: "9876543210", pattern: "[0-9]*", maxLength: 10 },
                                { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com", required: true },
                                { label: "Aadhaar Number (12 Digits)", name: "aadhar", type: "text", placeholder: "XXXX XXXX XXXX", maxLength: 12 },
                                { label: "PAN Number", name: "pan", type: "text", placeholder: "ABCDE1234F", maxLength: 10 },
                            ].map(field => (
                                <div key={field.name} className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{field.label}</label>
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={formData[field.name] || ''}
                                        maxLength={field.maxLength}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if ((field.name === 'phone' || field.name === 'aadhar') && val && !/^\d+$/.test(val)) return;
                                            if (field.name === 'pan') {
                                                setFormData(prev => ({ ...prev, [field.name]: val.toUpperCase() }));
                                            } else {
                                                setFormData(prev => ({ ...prev, [field.name]: val }));
                                            }
                                        }}
                                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#002b45] transition-colors bg-gray-50/30"
                                    />
                                </div>
                            ))}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Address</label>
                                <textarea
                                    rows="2"
                                    placeholder="Enter your full address..."
                                    value={formData.address || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#002b45] transition-colors resize-none bg-gray-50/30"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-5">
                        <h3 className="text-sm font-bold text-white">Upload Documents</h3>
                        <p className="text-[13px] text-gray-500">Please upload clear, readable documents. Supported formats: PDF, JPG, PNG (Max 10MB each)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer hover:border-[#002b45] hover:bg-[#002b45]/5 transition-all relative">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                <Upload size={28} className="text-gray-300" />
                                <div>
                                    <p className="font-bold text-gray-600 text-[13px] mb-0.5">Identity Proof</p>
                                    <p className="text-[11px] text-gray-400">Aadhar, PAN, Passport</p>
                                </div>
                            </label>
                            <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer hover:border-[#002b45] hover:bg-[#002b45]/5 transition-all relative">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                <FileText size={28} className="text-gray-300" />
                                <div>
                                    <p className="font-bold text-gray-600 text-[13px] mb-0.5">Supporting Documents</p>
                                    <p className="text-[11px] text-gray-400">Medical Reports, Bills</p>
                                </div>
                            </label>
                        </div>
                        <AnimatePresence>
                            {files.length > 0 && (
                                <div className="space-y-2.5">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{files.length} File{files.length > 1 ? 's' : ''} Uploaded</p>
                                    {files.map((f, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            key={i}
                                            className="flex items-center justify-between border border-gray-100 rounded-lg p-3 bg-white"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText size={16} className="text-white" />
                                                <div>
                                                    <p className="text-[13px] font-semibold text-white">{f.name}</p>
                                                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Ready</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleFileRemove(i)} className="w-6 h-6 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors">
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-5">
                        <h3 className="text-sm font-bold text-white">Review & Confirm</h3>
                        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Order Summary</p>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-gray-600">Base Premium ({selectedDuration})</span>
                                    <span className="font-bold">₹{policy.premiumAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-gray-600">Add-on: Critical Illness</span>
                                    <span className="font-bold">₹1,200.00</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-gray-600">GST (18%)</span>
                                    <span className="font-bold">₹{gstAmount.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-[13px] text-emerald-600">
                                        <span>Discount (Multi-year)</span>
                                        <span className="font-bold">-₹{discount}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-100 pt-3.5 flex justify-between items-end">
                                    <span className="font-bold text-white text-sm mb-1">Total Premium</span>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white">₹{total.toLocaleString()}</p>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider">*INCLUSIVE OF ALL TAXES</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 rounded-xl border border-rose-100 text-rose-700">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p className="text-[12px] leading-relaxed">By proceeding, you confirm that all provided information and documents are accurate. Any falsification may result in account suspension and claim rejection.</p>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col items-center justify-center text-center py-16 space-y-6">
                        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
                            <ShieldCheck size={48} className="text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-2">Application Submitted!</h3>
                            <p className="text-gray-500 text-sm max-w-sm">Your application for <strong>{policy.policyName}</strong> has been successfully submitted and is under review.</p>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-blue-700 text-sm font-medium">
                            <CheckCircle2 size={18} /> You'll receive a confirmation email within 24 hours.
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            {/* Progress bar */}
            <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-2.5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                            STEP {step} OF 5: {STEPS[step-1]?.label.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">{step * 20}% Complete</span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#002b45] rounded-full"
                            animate={{ width: `${step * 20}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 overflow-x-auto no-scrollbar">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s.id}>
                                {i > 0 && <span className="text-gray-300">/</span>}
                                <span className={`whitespace-nowrap font-semibold ${step === s.id ? 'text-white underline' : step > s.id ? 'text-emerald-600' : ''}`}>
                                    {s.label}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-100 shadow-sm mb-5">
                            {renderStep()}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                                <button
                                    onClick={() => step === 1 ? navigate(-1) : handleBack()}
                                    className="flex items-center gap-1.5 text-[13px] font-bold text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                    {step === 1 ? 'Cancel' : 'Back'}
                                </button>
                                {step < 4 ? (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-1.5 bg-[#002b45] text-white px-6 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#003b5c] transition-colors shadow-sm"
                                    >
                                        Continue to {STEPS[step]?.label} <ChevronRight size={16} />
                                    </button>
                                ) : step === 4 ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex items-center gap-1.5 bg-[#10b981] text-white px-6 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#059669] transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {loading ? <RefreshCcw className="animate-spin" size={16} /> : <><ShieldCheck size={16} /> Submit Application</>}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1.5 uppercase tracking-wider">
                            <Lock size={10} /> SSL Encrypted Secure Transaction
                        </p>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm sticky top-28">
                            <h3 className="font-bold text-white text-[15px] mb-4">Payment Breakdown</h3>
                            <div className="space-y-2.5 text-[13px] mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Base Premium ({selectedDuration})</span>
                                    <span className="font-semibold text-gray-900">₹{(policy.premiumAmount * (selectedDuration === "1 Year" ? 1 : selectedDuration === "2 Years" ? 2 : 3)).toLocaleString()}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Add-on: Critical Illness</span>
                                    <span className="font-semibold text-gray-900">₹1,200.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">GST (18%)</span>
                                    <span className="font-semibold text-gray-900">₹{gstAmount}.00</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount (Multi-year)</span>
                                        <span className="font-bold">-₹{discount}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
                                    <span className="font-bold text-white">Total Premium</span>
                                    <span className="font-black text-lg text-white">₹{total.toLocaleString()}.00</span>
                                </div>
                                <p className="text-[9px] text-gray-400 text-right uppercase tracking-wider">*INCLUSIVE OF ALL TAXES</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 mb-4">
                                <div className="flex items-start gap-2.5">
                                    <Shield size={16} className="text-white shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-wider mb-1">TRUST GUARANTEE</p>
                                        <p className="text-[11px] text-gray-400 leading-relaxed">Your purchase is secure. Secure Shield is IRDAI certified and provides 24/7 support.</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-[11px] text-gray-400">
                                Need help? <span className="font-bold text-white">Call 1800-SECURE</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-400 mt-4">
                © 2024 Secure Shield Insurance Co. Ltd.
            </footer>
        </div>
    );
};

export default ApplicationPage;
