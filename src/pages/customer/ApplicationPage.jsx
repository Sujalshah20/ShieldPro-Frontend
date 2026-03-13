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
    Satellite, Command, Layers, TrendingUp, Clock, Fingerprint
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
                description: "National identification node missing. Update profile architecture before deployment.",
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
                    description: "Strategic asset application has been queued for verification." 
                });
                navigate("/customer/claims"); 
            }
        } catch (error) {
            toast({ 
                title: "DEPLOYMENT_FAILED", 
                description: error?.errors?.[0]?.message || error?.message || "Signal interruption during deployment protocol.", 
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
                        className="space-y-12"
                    >
                        <div className="flex items-center gap-6 p-8 bg-accent/5 rounded-[2.5rem] border border-accent/20">
                            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-accent/20">
                                <FileText size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">ARTIFACT_EXAMINATION</h3>
                                <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 italic mt-1">Review strategic parameters before initializing deployment.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { title: "CAPACITY", value: `₹${policy.coverageAmount.toLocaleString()}`, icon: Shield },
                                { title: "UNIT_YIELD", value: `₹${policy.premiumAmount.toLocaleString()} / CYC`, icon: Zap },
                                { title: "CYCLE_LIFE", value: `${policy.durationYears} YEARS`, icon: Clock },
                                { title: "CLASSIFICATION", value: policy.policyType.toUpperCase(), icon: Target }
                            ].map(item => (
                                <div key={item.title} className="p-8 bg-zinc-50 dark:bg-white/5 rounded-[2rem] border border-border/50 group hover:border-accent/40 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-[10px] uppercase font-black opacity-30 tracking-[4px] italic">{item.title}</div>
                                        <item.icon size={16} className="text-accent opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="font-black text-2xl italic tracking-tighter uppercase">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 bg-zinc-950 text-white rounded-[3rem] border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                            <h4 className="text-xl font-black italic uppercase tracking-tighter mb-8 relative z-10 flex items-center gap-4">
                                <ShieldCheck className="text-accent" size={20} strokeWidth={3} />
                                PROTECTION_ADVANTAGES
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                {[
                                    "FULL_INCIDENT_COORDINATION",
                                    "ZERO_FRICTION_PAYOUTS",
                                    "24/7_TACTICAL_ASSISTANCE",
                                    "REGULATORY_YIELD_BENEFITS"
                                ].map(benefit => (
                                    <li key={benefit} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[3px] italic opacity-60 group-hover:opacity-100 transition-opacity">
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
                        className="space-y-12"
                    >
                        <div className="flex items-center gap-6 mb-12">
                             <div className={`p-6 rounded-[2rem] shadow-xl ${
                                policy.policyType === 'Health' ? 'bg-rose-500 shadow-rose-500/30' :
                                policy.policyType === 'Vehicle' || policy.policyType === 'Auto' ? 'bg-accent shadow-accent/30' :
                                policy.policyType === 'Property' || policy.policyType === 'Home' ? 'bg-primary shadow-primary/30' :
                                policy.policyType === 'Life' ? 'bg-emerald-500 shadow-emerald-500/30' :
                                policy.policyType === 'Travel' ? 'bg-indigo-500 shadow-indigo-500/30' :
                                'bg-zinc-500 shadow-zinc-500/30'
                             } text-white`}>
                                {policy.policyType === 'Health' && <Activity size={32} strokeWidth={3} />}
                                {(policy.policyType === 'Vehicle' || policy.policyType === 'Auto') && <Truck size={32} strokeWidth={3} />}
                                {(policy.policyType === 'Property' || policy.policyType === 'Home') && <Home size={32} strokeWidth={3} />}
                                {policy.policyType === 'Life' && <Zap size={32} strokeWidth={3} />}
                                {policy.policyType === 'Travel' && <Globe size={32} strokeWidth={3} />}
                             </div>
                             <div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">{policy.policyType.toUpperCase()} DNA_ENCODING</h3>
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic mt-1 ml-1">Calibrate asset-specific operational parameters.</p>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {(policy.policyType === 'Vehicle' || policy.policyType === 'Auto') && (
                                <>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">ASSET_IDENTIFIER (VIN/REG)</label>
                                        <input 
                                            placeholder="SIGNAL_CODE_X"
                                            className="w-full h-20 bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                            value={formData.regNo || ""}
                                            onChange={e => setFormData({...formData, regNo: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">CHASSIS_ARCHITECTURE</label>
                                        <input 
                                            placeholder="MODEL_DESCRIPTOR..."
                                            className="w-full h-20 bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                            value={formData.model || ""}
                                            onChange={e => setFormData({...formData, model: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Health' && (
                                <>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">BIOMETRIC_ANOMALIES</label>
                                        <input 
                                            placeholder="REPORT_EXISTING_LOGS..."
                                            className="w-full h-20 bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                            onChange={e => setFormData({...formData, healthConditions: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">LAST_ARCHITECTURE_SYNC</label>
                                        <input 
                                            type="date"
                                            className="w-full h-20 bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                            onChange={e => setFormData({...formData, lastCheckup: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Property' && (
                                <>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">GEOGRAPHIC_COORDINATES</label>
                                        <input 
                                            className="w-full h-20 bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                            onChange={e => setFormData({...formData, propAddress: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">ASSET_VALUATION (₹)</label>
                                        <input 
                                            type="number"
                                            className="w-full h-20 bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-8 font-black text-xl italic tracking-tighter outline-none focus:border-accent transition-all shadow-sm focus:ring-8 focus:ring-accent/5"
                                            onChange={e => setFormData({...formData, propValue: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Travel' && (
                                <>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">GLOBAL_PASSPORT_ID</label>
                                        <input 
                                            placeholder="Z_PROTOCOL_IDENTIFIER"
                                            className="w-full h-20 bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all italic shadow-sm focus:ring-8 focus:ring-accent/5"
                                            onChange={e => setFormData({...formData, passport: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-2">PRIMARY_SECTOR_DESTINATION</label>
                                        <input 
                                            placeholder="TARGET_ZONE..."
                                            className="w-full h-20 bg-zinc-50 dark:bg-white/5 border border-border/50 rounded-2xl px-8 font-black text-xs uppercase tracking-[4px] outline-none focus:border-accent transition-all italic shadow-sm focus:ring-8 focus:ring-accent/5"
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
                        className="space-y-12"
                    >
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-24 h-24 bg-accent/10 text-accent rounded-[2.5rem] flex items-center justify-center border-2 border-accent/20 shadow-xl shadow-accent/10 animate-pulse">
                                <Upload size={40} strokeWidth={3} />
                            </div>
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">IDENTITY_SYNERGY</h3>
                            <p className="max-w-md text-[10px] font-black uppercase tracking-[5px] opacity-40 italic leading-loose">Transmit encrypted artifact documentation for rapid verification & underwriting uplink.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-12 border-2 border-dashed border-border/50 rounded-[3rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all group relative overflow-hidden">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none transform group-hover:scale-110 transition-transform duration-1000">
                                    <Fingerprint size={200} className="mx-auto" />
                                </div>
                                <Layers className="mb-6 text-zinc-300 group-hover:text-accent group-hover:rotate-12 transition-all" size={48} strokeWidth={2.5} />
                                <span className="font-black uppercase tracking-[4px] italic text-xs mb-2">IDENTIFICATION_CORE</span>
                                <span className="text-[9px] font-black opacity-30 uppercase tracking-[3px] italic">PASSPORT / NATIONAL_ID</span>
                            </div>
                            <div className="p-12 border-2 border-dashed border-border/50 rounded-[3rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all group relative overflow-hidden">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none transform group-hover:scale-110 transition-transform duration-1000">
                                    <Cpu size={200} className="mx-auto" />
                                </div>
                                <Zap className="mb-6 text-zinc-300 group-hover:text-accent group-hover:-rotate-12 transition-all" size={48} strokeWidth={2.5} />
                                <span className="font-black uppercase tracking-[4px] italic text-xs mb-2">ASSET_SPECIFICATIONS</span>
                                <span className="text-[9px] font-black opacity-30 uppercase tracking-[3px] italic">REG_DOCS / MED_REPORTS</span>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[6px] text-accent italic ml-8 flex items-center gap-4">
                                    UPLINK_QUEUE ({files.length} ARTIFACTS)
                                </h4>
                                <div className="space-y-3">
                                    {files.map((f, i) => (
                                        <div key={i} className="p-6 bg-white dark:bg-zinc-800 rounded-3xl border border-border/50 flex items-center justify-between group hover:border-accent/30 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="p-4 bg-accent/10 text-accent rounded-xl">
                                                    <FileText size={20} strokeWidth={3} />
                                                </div>
                                                <span className="text-xs font-black italic uppercase tracking-[3px] transition-colors">{f.name}</span>
                                            </div>
                                            <CheckCircle2 className="text-emerald-500 shadow-[0_0_10px_#10b981] rounded-full" size={20} strokeWidth={3} />
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
                        className="text-center space-y-12"
                    >
                        <div className="relative inline-block mt-4">
                            <div className="w-32 h-32 bg-accent rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_30px_60px_rgba(255,90,0,0.4)] mx-auto relative z-10 group-hover:rotate-12 transition-transform duration-500">
                                 <ShieldCheck size={64} strokeWidth={3} />
                            </div>
                            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
                        </div>
                        
                        <div className="space-y-6">
                            <h3 className="text-5xl font-black tracking-tighter italic leading-none uppercase">AUTHORIZE <span className="text-accent italic-none not-italic">DEPLOYMENT?</span></h3>
                            <p className="max-w-xl mx-auto text-xs font-black uppercase tracking-[5px] opacity-40 leading-loose italic">
                                Initializing finalize protocol for <span className="text-accent opacity-100">{policy.policyName}</span>. 
                                Security nodes will review artifact integrity within 24-48 cycles.
                            </p>
                        </div>

                        <div className="max-w-md mx-auto p-10 bg-zinc-50 dark:bg-white/[0.03] rounded-[3rem] space-y-6 border border-border/50 shadow-inner">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic">UNIT_YIELD</span>
                                <span className="text-2xl font-black italic tracking-tighter text-accent leading-none">₹{policy.premiumAmount.toLocaleString()} / CYC</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black opacity-30 uppercase tracking-[4px] italic">UPLINK_FEE</span>
                                <span className="text-xs font-black text-emerald-500 uppercase tracking-[4px]">OPTIMIZED</span>
                            </div>
                            <div className="h-px bg-border/30 my-4" />
                            <div className="flex justify-between items-center">
                                <span className="font-black uppercase tracking-[6px] text-[11px] italic">TOTAL_COMMIT</span>
                                <span className="text-4xl font-black text-accent italic tracking-tighter leading-none">₹{policy.premiumAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-6 p-8 max-w-xl mx-auto bg-rose-500/5 text-rose-500 rounded-[2.5rem] text-left border border-rose-500/10">
                             <AlertCircle className="shrink-0 mt-1" size={24} strokeWidth={3} />
                             <p className="text-[11px] font-black leading-relaxed uppercase tracking-[3px] italic opacity-80">By committing, you verify artifact precision. Encryption integrity is compromised if data is falsified according to system protocol 84.4.</p>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="application-page p-6 md:p-10 bg-[#F4F7FB] dark:bg-[#10221c] min-h-screen relative overflow-hidden">
            {/* Orbital Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] opacity-[0.03] pointer-events-none">
                <Satellite size={800} className="animate-spin-slow rotate-45" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Tactical Header */}
                <Reveal width="100%" direction="down">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div>
                            <button 
                                onClick={() => step === 1 ? navigate(-1) : handleBack()}
                                className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[5px] text-accent hover:translate-x-[-10px] transition-all mb-8 italic"
                            >
                                <ChevronLeft size={16} strokeWidth={4} /> 
                                {step === 1 ? 'ABORT_TO_CATALOG' : 'PREVIOUS_SEQUENCE'}
                            </button>
                            <div className="flex items-center gap-4 mb-3">
                                 <div className="w-2.5 h-10 bg-accent rounded-full shadow-[0_0_20px_#FF5A00]" />
                                 <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                                    ASSET<span className="text-accent tracking-normal">_INITIALIZATION</span>
                                 </h1>
                            </div>
                            <p className="text-xs font-black opacity-30 uppercase tracking-[6px] ml-7 italic">
                                Constructing custom safeguard architecture node v9.2
                            </p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className="flex-1 md:w-20 group relative">
                                    <div className={`h-2 rounded-full transition-all duration-1000 ${s <= step ? 'bg-accent shadow-[0_0_15px_#FF5A00]' : 'bg-border/30 dark:bg-white/10'}`} />
                                    <div className={`absolute -bottom-6 left-0 right-0 text-center text-[8px] font-black uppercase tracking-[3px] italic transition-colors ${s === step ? 'text-accent opacity-100' : 'opacity-20'}`}>
                                        {s === 1 && 'SPECS'}
                                        {s === 2 && 'DNA'}
                                        {s === 3 && 'UPLINK'}
                                        {s === 4 && 'COMMIT'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Content Chassis */}
                <div className="bg-white dark:bg-zinc-900/50 p-12 md:p-20 rounded-[5rem] border border-border/50 shadow-2xl relative overflow-hidden group backdrop-blur-md">
                    <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000">
                         <ShieldCheck size={300} strokeWidth={1} />
                    </div>

                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>

                    {/* Operational Actions */}
                    <div className="mt-20 flex gap-8">
                        {step < 4 ? (
                            <button 
                                onClick={handleNext}
                                className="flex-1 h-20 bg-zinc-950 text-white rounded-[2rem] font-black uppercase tracking-[6px] text-xs transform transition-all active:scale-95 flex items-center justify-center gap-6 group hover:bg-accent border-2 border-zinc-950 hover:border-accent italic"
                            >
                                PROCEED_INITIALIZATION
                                <ChevronRight className="group-hover:translate-x-3 transition-transform" strokeWidth={4} />
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 h-24 bg-accent text-white rounded-[2.5rem] font-black uppercase tracking-[8px] text-sm shadow-[0_30px_70px_rgba(255,90,0,0.4)] transform transition-all active:scale-95 flex items-center justify-center gap-6 disabled:opacity-50 disabled:grayscale italic"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-white" />
                                ) : (
                                    <>AUTHORIZE_SYSTEM_DEPLOYMENT <Zap size={24} strokeWidth={4} /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="mt-12 flex justify-center gap-16 opacity-[0.15]">
                    <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-[4px] italic">
                        <Lock size={14} strokeWidth={4} /> CODON_ENCRYPTION_ACTIVE
                    </div>
                    <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-[4px] italic">
                        <ShieldCheck size={14} strokeWidth={4} /> AGENT_ID_VERIFIED
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationPage;
