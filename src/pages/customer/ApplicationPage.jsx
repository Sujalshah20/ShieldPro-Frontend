import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, FileText, Upload, 
    ShieldCheck, Activity, Truck, Home, CheckCircle2,
    Lock, AlertCircle
} from "lucide-react";

const ApplicationPage = () => {
    const { user, profile } = useContext(AuthContext);
    const { state } = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const policy = state?.policy;
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (!policy) {
            navigate("/customer/browse");
        }
    }, [policy, navigate]);

    if (!policy) return null;

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles.map(f => ({ 
            file: f, 
            name: f.name,
            type: f.type,
            url: URL.createObjectURL(f) // Mock URL for preview
        }))]);
    };

    const handleSubmit = async () => {
        // Check if profile is complete enough (National ID is required)
        if (!profile?.nationalId) {
            toast({ 
                title: "Profile Incomplete", 
                description: "You must add your National ID in your profile before applying for a policy.",
                variant: "destructive"
            });
            navigate("/customer/profile");
            return;
        }

        setLoading(true);
        try {
            // In a real app, we'd upload files to S3/Cloudinary first
            // Here we'll mock the document URLs
            const mockDocuments = files.map(f => ({ name: f.name, url: `https://storage.shieldpro.com/${f.name}` }));

            const application = await api.post("/applications", {
                policyId: policy._id,
                formData,
                documents: mockDocuments
            }, user.token);

            if (application._id) {
                toast({ 
                    title: "Application Submitted", 
                    description: "Your insurance application is now under review by our agents." 
                });
                navigate("/customer/claims"); // Redirect to a page where they can see status
            }
        } catch (error) {
            toast({ title: "Submission failed", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch(step) {
            case 1:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-4 p-6 bg-gold/5 rounded-3xl border border-gold/10">
                            <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-gold-foreground shrink-0">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Detailed Terms & Benefits</h3>
                                <p className="text-sm opacity-60">Please review the plan details before proceeding.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Coverage", value: `₹${policy.coverageAmount.toLocaleString()}` },
                                { title: "Premium", value: `₹${policy.premiumAmount.toLocaleString()} / year` },
                                { title: "Duration", value: `${policy.durationYears} Years` },
                                { title: "Policy Type", value: policy.policyType }
                            ].map(item => (
                                <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                                    <div className="text-[10px] uppercase font-black opacity-40 mb-1">{item.title}</div>
                                    <div className="font-bold text-lg">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-zinc-900 text-white rounded-3xl space-y-4">
                            <h4 className="font-bold flex items-center gap-2">
                                <ShieldCheck className="text-gold" size={18} />
                                Why this plan?
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-80">
                                <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={14} /> Full Accident Support</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={14} /> Cashless Payouts</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={14} /> 24/7 Roadside Assist</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={14} /> Tax Benefits (80C/D)</li>
                            </ul>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                             <div className={`p-4 rounded-3xl ${
                                policy.policyType === 'Health' ? 'bg-red-100 text-red-600' :
                                policy.policyType === 'Vehicle' ? 'bg-orange-100 text-orange-600' :
                                'bg-gold/10 text-gold'
                             }`}>
                                {policy.policyType === 'Health' && <Activity size={32} />}
                                {policy.policyType === 'Vehicle' && <Truck size={32} />}
                                {policy.policyType === 'Property' && <Home size={32} />}
                                {policy.policyType === 'Life' && <FileText size={32} />}
                             </div>
                             <div>
                                <h3 className="text-2xl font-black">{policy.policyType} Details</h3>
                                <p className="opacity-60 font-medium">Please provide the required specific details.</p>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {policy.policyType === 'Vehicle' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-2">Registration Number</label>
                                        <input 
                                            placeholder="e.g. MH01-AB-1234"
                                            className="w-full p-5 rounded-[1.5rem] bg-white dark:bg-zinc-800 border border-border outline-none focus:ring-2 focus:ring-gold/20 font-bold uppercase transition-all"
                                            onChange={e => setFormData({...formData, regNo: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-2">Vehicle Model & Year</label>
                                        <input 
                                            placeholder="e.g. Tesla Model 3 (2023)"
                                            className="w-full p-5 rounded-[1.5rem] bg-white dark:bg-zinc-800 border border-border outline-none focus:ring-2 focus:ring-gold/20 font-bold transition-all"
                                            onChange={e => setFormData({...formData, model: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Health' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-2">Any pre-existing conditions?</label>
                                        <input 
                                            placeholder="e.g. Diabetes, None"
                                            className="w-full p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-blue-600/20 font-bold transition-all"
                                            onChange={e => setFormData({...formData, healthConditions: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-2">Last Medical Checkup Date</label>
                                        <input 
                                            type="date"
                                            className="w-full p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-blue-600/20 font-bold transition-all"
                                            onChange={e => setFormData({...formData, lastCheckup: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Property' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-2">Property Address</label>
                                        <input 
                                            className="w-full p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-blue-600/20 font-bold transition-all"
                                            onChange={e => setFormData({...formData, propAddress: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-2">Property Value (Est)</label>
                                        <input 
                                            type="number"
                                            className="w-full p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-blue-600/20 font-bold transition-all"
                                            onChange={e => setFormData({...formData, propValue: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Life' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-2">Smoker / Non-Smoker</label>
                                        <select 
                                            className="w-full p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-blue-600/20 font-bold transition-all"
                                            onChange={e => setFormData({...formData, habits: e.target.value})}
                                        >
                                            <option value="Non-Smoker">Non-Smoker</option>
                                            <option value="Smoker">Smoker</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-blue-600/10 text-blue-600 rounded-[2rem] flex items-center justify-center">
                                <Upload size={40} />
                            </div>
                            <h3 className="text-3xl font-black">Identify & Verify</h3>
                            <p className="max-w-md opacity-60 font-medium leading-relaxed">Please upload clear copies of the required documents for rapid processing and underwriting.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-600/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group relative">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                                <Upload className="mb-4 text-slate-300 group-hover:text-blue-600 transition-colors" size={40} />
                                <span className="font-bold">National ID / Passport</span>
                                <span className="text-xs opacity-40">Drop PDF or Images here</span>
                            </div>
                            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-600/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group relative">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                                <Upload className="mb-4 text-slate-300 group-hover:text-blue-600 transition-colors" size={40} />
                                <span className="font-bold">Asset Documents</span>
                                <span className="text-xs opacity-40">Registration certificate / Medical reports</span>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest flex items-center gap-2">
                                    Selected Documents ({files.length})
                                </h4>
                                <div className="space-y-2">
                                    {files.map((f, i) => (
                                        <div key={i} className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-border flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-sm font-bold truncate max-w-[200px]">{f.name}</span>
                                            </div>
                                            <CheckCircle2 className="text-green-500" size={18} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-gold-foreground mx-auto shadow-2xl shadow-gold/40">
                             <ShieldCheck size={48} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black tracking-tight">Ready to Submit?</h3>
                            <p className="max-w-lg mx-auto opacity-70 font-medium leading-relaxed">
                                You are about to apply for the <span className="text-gold font-bold">{policy.policyName}</span>. 
                                Our agents will review your application and documents within 24-48 hours.
                            </p>
                        </div>

                        <div className="max-w-sm mx-auto p-6 bg-white dark:bg-zinc-900 rounded-3xl space-y-3 border border-border">
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-50 font-medium">Policy Premium</span>
                                <span className="font-bold tracking-tight">₹{policy.premiumAmount.toLocaleString()} / year</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-50 font-medium">Processing Fee</span>
                                <span className="font-bold text-green-600">FREE</span>
                            </div>
                            <div className="h-px bg-border my-2" />
                            <div className="flex justify-between items-center">
                                <span className="font-black uppercase tracking-widest text-[10px]">Total Est.</span>
                                <span className="text-xl font-black text-gold">₹{policy.premiumAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 max-w-lg mx-auto bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-2xl text-left border border-amber-100 dark:border-amber-900/30">
                             <AlertCircle className="shrink-0 mt-1" size={20} />
                             <p className="text-xs font-semibold leading-relaxed">By clicking submit, you declare that all information provided is accurate of your knowledge. Misrepresentation can lead to rejection of future claims.</p>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 premium-gradient">
            <div className="max-w-4xl mx-auto">
                {/* Stepper Header */}
                <div className="mb-12">
                    <button 
                        onClick={() => step === 1 ? navigate(-1) : handleBack()}
                        className="flex items-center gap-2 text-sm font-bold opacity-50 hover:opacity-100 transition-all mb-8 uppercase tracking-widest active:scale-95"
                    >
                        <ChevronLeft size={16} /> 
                        {step === 1 ? 'Back to Policies' : 'Previous Step'}
                    </button>

                    <div className="flex items-center gap-4">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className="flex-1 flex flex-col gap-3">
                                <div className={`h-1.5 rounded-full transition-all duration-700 ${s <= step ? 'bg-gold shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'bg-slate-200 dark:bg-white/10'}`} />
                                <div className={`text-[10px] font-black uppercase tracking-widest text-center transition-colors ${s === step ? 'text-gold' : 'opacity-30'}`}>
                                    {s === 1 && 'Plan info'}
                                    {s === 2 && 'Details'}
                                    {s === 3 && 'Documents'}
                                    {s === 4 && 'Complete'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="glass p-8 md:p-12 rounded-[4rem] border-2 border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000">
                         <ShieldCheck size={200} />
                    </div>

                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="mt-12 flex gap-4">
                        {step < 4 ? (
                            <button 
                                onClick={handleNext}
                                className="flex-1 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2rem] font-black uppercase tracking-[0.2em] transform transition-all active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                Continue Application
                                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-6 bg-gold text-gold-foreground rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-gold/40 transform transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-gold-foreground/30 border-t-gold-foreground" />
                                ) : (
                                    <>Submit Application <ShieldCheck size={20} /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="mt-8 flex justify-center gap-8 opacity-30">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest">
                        <Lock size={12} /> SSL Encrypted
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest">
                        <ShieldCheck size={12} /> Verified Agency
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationPage;
