import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, FileText, Upload, 
    CheckCircle2, Lock, AlertCircle, Globe,
    Shield, ShieldCheck, Zap, Activity,
    Truck, Home, Target, Cpu, 
    Satellite, Command, Layers, TrendingUp, Clock, Fingerprint,
    Terminal, HeartPulse
} from "lucide-react";
import Reveal from "../../components/common/Reveal";

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
            navigate("/customer");
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
            url: URL.createObjectURL(f) 
        }))]);
    };

    const handleSubmit = async () => {
        if (!profile?.nationalId) {
            toast({ 
                title: "IDENTITY_ERROR", 
                description: "The national identification node is missing. Please update your profile architecture before proceeding.",
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
                toast({ 
                    title: "INITIALIZATION_SUCCESS", 
                    description: "Your strategic asset application has been queued for verification." 
                });
                navigate("/customer/applications"); 
            }
        } catch (error) {
            toast({ 
                title: "DEPLOYMENT_FAILED", 
                description: error?.errors?.[0]?.message || error?.message || "Operational anomaly detected during deployment protocol.", 
                variant: "destructive" 
            });
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
                        className="space-y-10"
                    >
                        <div className="flex items-center gap-6 p-8 bg-[#0082a1]/10 rounded-[2.5rem] border border-[#0082a1]/20">
                            <div className="w-14 h-14 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shrink-0 shadow-2xl">
                                <FileText size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#012b3f] uppercase tracking-tight">Artifact_Examination</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Review strategic parameters before initializing protocol deployment.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "CAPACITY", value: `₹${policy.coverageAmount.toLocaleString()}`, icon: Shield },
                                { title: "UNIT_YIELD", value: `₹${policy.premiumAmount.toLocaleString()} / CYC`, icon: Zap },
                                { title: "CYCLE_LIFE", value: `${policy.durationYears} YEARS`, icon: Clock },
                                { title: "CLASSIFICATION", value: policy.policyType.toUpperCase(), icon: Target }
                            ].map(item => (
                                <div key={item.title} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-[#0082a1]/30 transition-all flex flex-col justify-between h-40">
                                    <div className="flex justify-between items-start">
                                        <div className="text-[9px] uppercase font-black text-slate-300 tracking-[3px] italic">{item.title}</div>
                                        <item.icon size={18} className="text-[#0082a1] opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="font-black text-2xl text-[#012b3f] tracking-tighter uppercase italic">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 bg-[#012b3f] text-white rounded-[3rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                <ShieldCheck size={180} className="text-[#0082a1]" />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tight mb-8 relative z-10 flex items-center gap-4 text-[#0082a1] italic">
                                <ShieldCheck size={20} strokeWidth={3} />
                                Protection_Advantages
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                {[
                                    "FULL_INCIDENT_COORDINATION",
                                    "ZERO_FRICTION_PAYOUTS",
                                    "24/7_TACTICAL_ASSISTANCE",
                                    "REGULATORY_YIELD_BENEFITS"
                                ].map(benefit => (
                                    <li key={benefit} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle2 className="text-emerald-500" size={14} strokeWidth={4} /> {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div className="flex items-center gap-6">
                             <div className={`p-6 rounded-[1.5rem] shadow-2xl bg-[#012b3f] text-[#0082a1]`}>
                                {policy.policyType === 'Health' && <HeartPulse size={32} strokeWidth={3} />}
                                {(policy.policyType === 'Vehicle' || policy.policyType === 'Auto') && <Truck size={32} strokeWidth={3} />}
                                {(policy.policyType === 'Property' || policy.policyType === 'Home') && <Home size={32} strokeWidth={3} />}
                                {policy.policyType === 'Life' && <Shield size={32} strokeWidth={3} />}
                                {policy.policyType === 'Travel' && <Globe size={32} strokeWidth={3} />}
                             </div>
                             <div>
                                <h3 className="text-2xl font-black text-[#012b3f] uppercase tracking-tight">{policy.policyType.toUpperCase()} DNA_ENCODING</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] mt-1 italic">Calibrate asset-specific operational parameters.</p>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            {(policy.policyType === 'Vehicle' || policy.policyType === 'Auto') && (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] ml-2">Asset Identifier (VIN/REG)</label>
                                        <input 
                                            placeholder="SIGNAL_CODE_X"
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner"
                                            value={formData.regNo || ""}
                                            onChange={e => setFormData({...formData, regNo: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] ml-2">Chassis Architecture</label>
                                        <input 
                                            placeholder="MODEL_DESCRIPTOR..."
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner"
                                            value={formData.model || ""}
                                            onChange={e => setFormData({...formData, model: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Health' && (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] ml-2">Biometric Anomalies</label>
                                        <input 
                                            placeholder="REPORT_EXISTING_LOGS..."
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner"
                                            onChange={e => setFormData({...formData, healthConditions: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] ml-2">Last Architecture Sync</label>
                                        <input 
                                            type="date"
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner"
                                            onChange={e => setFormData({...formData, lastCheckup: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Property' && (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] ml-2">Geographic Coordinates</label>
                                        <input 
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner"
                                            onChange={e => setFormData({...formData, propAddress: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] ml-2">Asset Valuation (₹)</label>
                                        <input 
                                            type="number"
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-base tracking-tighter outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner"
                                            onChange={e => setFormData({...formData, propValue: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Travel' && (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] ml-2">Global Passport ID</label>
                                        <input 
                                            placeholder="REG_CODE_IDENTIFIER"
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner"
                                            onChange={e => setFormData({...formData, passport: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] ml-2">Primary Sector Destination</label>
                                        <input 
                                            placeholder="TARGET_ZONE..."
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#0082a1] focus:bg-white transition-all text-[#012b3f] shadow-inner"
                                            onChange={e => setFormData({...formData, destination: e.target.value})}
                                        />
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
                        className="space-y-10"
                    >
                        <div className="flex flex-col items-center text-center space-y-6 pt-6">
                            <div className="w-20 h-20 bg-[#012b3f] text-[#0082a1] rounded-[1.5rem] flex items-center justify-center border border-[#0082a1]/20 shadow-2xl animate-pulse">
                                <Upload size={36} strokeWidth={3} />
                            </div>
                            <h3 className="text-3xl font-black text-[#012b3f] uppercase tracking-tight leading-none italic">Identity_Synergy</h3>
                            <p className="max-w-md text-[9px] font-black text-slate-400 uppercase tracking-[5px] leading-loose">Transmit encrypted artifact documentation for rapid verification & underwriting uplink.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                            <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0082a1] hover:bg-white transition-all group relative overflow-hidden">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                    <Fingerprint size={180} className="mx-auto" />
                                </div>
                                <Layers className="mb-4 text-slate-300 group-hover:text-[#0082a1] transition-all" size={40} strokeWidth={2.5} />
                                <span className="font-black text-[#012b3f] uppercase tracking-[4px] italic text-[10px] mb-2">Identification_Core</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[3px]">PASSPORT / NATIONAL_ID</span>
                            </div>
                            <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0082a1] hover:bg-white transition-all group relative overflow-hidden">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                    <Cpu size={180} className="mx-auto" />
                                </div>
                                <Zap className="mb-4 text-slate-300 group-hover:text-[#0082a1] transition-all" size={40} strokeWidth={2.5} />
                                <span className="font-black text-[#012b3f] uppercase tracking-[4px] italic text-[10px] mb-2">Asset_Credentials</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[3px]">REG_DOCS / MED_REPORTS</span>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-4 pt-6">
                                <h4 className="text-[9px] font-black text-[#0082a1] uppercase tracking-[5px] italic ml-6 flex items-center gap-3">
                                    Uuplink_Queue Node ({files.length} ARTIFACTS)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {files.map((f, i) => (
                                        <div key={i} className="p-5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between group shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#012b3f] text-[#0082a1] rounded-xl flex items-center justify-center">
                                                    <FileText size={18} />
                                                </div>
                                                <span className="text-[10px] font-bold text-[#012b3f] uppercase tracking-widest truncate max-w-[120px]">{f.name}</span>
                                            </div>
                                            <CheckCircle2 className="text-emerald-500 shadow-[0_0_8px_#10b98140]" size={16} strokeWidth={3} />
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
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-10 py-6"
                    >
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-[#012b3f] rounded-2xl flex items-center justify-center text-[#0082a1] shadow-2xl mx-auto relative z-10">
                                 <ShieldCheck size={56} strokeWidth={3} />
                            </div>
                            <div className="absolute inset-0 bg-[#0082a1]/20 rounded-full blur-3xl animate-pulse" />
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-[#012b3f] tracking-tighter uppercase italic leading-none">Authorize <span className="text-[#0082a1]">Deployment</span></h3>
                            <p className="max-w-xl mx-auto text-[9px] font-black text-slate-400 uppercase tracking-[4px] leading-loose">
                                Initializing finalize protocol for <span className="text-[#012b3f]">{policy.policyName}</span>. 
                                Internal nodes will audit artifact integrity within 24-48 business cycles.
                            </p>
                        </div>

                        <div className="max-w-md mx-auto p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6 shadow-inner">
                            <div className="flex justify-between items-center text-[#012b3f]">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px]">Operational Yield</span>
                                <span className="text-xl font-black italic tracking-tighter">₹{policy.premiumAmount.toLocaleString()} / CYC</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[4px]">Uplink Optimization</span>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">ENABLED</span>
                            </div>
                            <div className="h-px bg-slate-200 my-2" />
                            <div className="flex justify-between items-center">
                                <span className="font-black text-[#012b3f] uppercase tracking-[5px] text-[10px]">Total Commit</span>
                                <span className="text-3xl font-black text-[#0082a1] italic tracking-tighter">₹{policy.premiumAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-8 max-w-xl mx-auto bg-rose-50 border border-rose-100 text-rose-600 rounded-[2rem] text-left">
                             <AlertCircle className="shrink-0 mt-0.5" size={20} strokeWidth={3} />
                             <p className="text-[9px] font-black leading-relaxed uppercase tracking-[3px] opacity-80">By committing, you verify artifact precision. Encryption integrity may be compromised if data is falsified according to system protocol 84.4.</p>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="application-page p-4 md:p-8 bg-[#dae5e5] min-h-screen relative overflow-hidden font-display">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] right-[-10%] opacity-[0.05] pointer-events-none">
                <Satellite size={800} className="animate-spin-slow rotate-45 text-[#012b3f]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Tactical Header */}
                <Reveal width="100%" direction="down">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div>
                            <button 
                                onClick={() => step === 1 ? navigate(-1) : handleBack()}
                                className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[4px] text-[#0082a1] hover:translate-x-[-8px] transition-all mb-8 italic"
                            >
                                <ChevronLeft size={16} strokeWidth={4} /> 
                                {step === 1 ? 'Abort_Protocol' : 'Return_Sequence'}
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-[#0082a1] rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Asset Initialization Command</span>
                            </div>
                            <h1 className="text-3xl font-black text-[#012b3f] uppercase tracking-tight italic">
                                Asset_Deployment
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className="flex-1 md:w-16 group relative">
                                    <div className={`h-1.5 rounded-full transition-all duration-1000 ${s <= step ? 'bg-[#0082a1] shadow-[0_0_10px_#0082a1]' : 'bg-slate-200'}`} />
                                    <div className={`absolute -bottom-5 left-0 right-0 text-center text-[8px] font-black uppercase tracking-widest transition-colors ${s === step ? 'text-[#012b3f]' : 'text-slate-300'}`}>
                                        {s === 1 && 'Specs'}
                                        {s === 2 && 'DNA'}
                                        {s === 3 && 'Uplink'}
                                        {s === 4 && 'Commit'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Content Chassis */}
                <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                         <ShieldCheck size={300} strokeWidth={1} className="text-[#012b3f]" />
                    </div>

                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>

                    {/* Operational Actions */}
                    <div className="mt-16 flex gap-6 relative z-10">
                        {step < 4 ? (
                            <button 
                                onClick={handleNext}
                                className="flex-1 h-16 bg-[#012b3f] text-[#0082a1] rounded-xl font-black uppercase tracking-[4px] text-[10px] shadow-xl hover:bg-[#0082a1] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-4 group border border-white/5"
                            >
                                Proceed_Initialization
                                <ChevronRight className="group-hover:translate-x-2 transition-transform" strokeWidth={4} />
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 h-20 bg-[#0082a1] text-white rounded-2xl font-black uppercase tracking-[6px] text-[11px] shadow-2xl hover:bg-[#012b3f] transition-all active:scale-95 flex items-center justify-center gap-6 disabled:opacity-50 border border-white/5"
                            >
                                {loading ? (
                                    <RefreshCcw className="animate-spin text-white" size={24} />
                                ) : (
                                    <>Authorize_Full_Deployment <Zap size={20} fill="currentColor" /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="mt-10 flex justify-center gap-12 opacity-30">
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#012b3f] uppercase tracking-widest">
                        <Terminal size={14} /> Encrypted_Payload_Active
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-[#012b3f] uppercase tracking-widest">
                        <Command size={14} /> Agent_ID_Synced
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationPage;
