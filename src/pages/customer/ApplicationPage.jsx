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
    Terminal, HeartPulse, RefreshCcw, IndianRupee, ChevronDown,
    X, CreditCard, SearchCheck, Award, Compass, Database, ShieldAlert
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

    const handleFileRemove = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!profile?.nationalId) {
            toast({ 
                title: "IDENTITY_ANOMALY", 
                description: "National ID node missing. Update identity manifest before deployment.",
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
                    title: "DEPLOYMENT_COMMITTED", 
                    description: "Strategic asset application queued for verification." 
                });
                navigate("/customer/policies"); 
            }
        } catch (error) {
            toast({ 
                title: "UPLINK_DENIED", 
                description: error?.errors?.[0]?.message || error?.message || "Operational anomaly during deployment protocol.", 
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
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-16"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-12 p-14 bg-[#003249] rounded-[4rem] text-white border-4 border-white shadow-4xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.05] group-hover:scale-150 transition-transform duration-[8000ms] pointer-events-none -rotate-12">
                                <FileText size={450} strokeWidth={1} />
                            </div>
                            <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
                            <div className="w-28 h-28 bg-[#007ea7] rounded-[2.5rem] flex items-center justify-center text-[#003249] shrink-0 shadow-4xl relative z-10 group-hover:rotate-[360deg] transition-all duration-[2000ms] border-4 border-white/20">
                                <FileText size={48} strokeWidth={3} />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-[#80ced7]">Manifest_Audit_v4.2</h3>
                                <p className="text-[13px] font-black text-white/40 uppercase tracking-[6px] leading-relaxed italic">Review strategic parameters and coverage chassis before initializing deployment protocol. All metrics are calibrated to SIGMA sector standards.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                { title: "CAPACITY", value: `₹${(policy.coverageAmount / 100000).toFixed(1)}L`, icon: Shield, accent: 'text-[#007ea7]', bg: 'bg-[#007ea7]/5' },
                                { title: "UNIT_YIELD", value: `₹${policy.premiumAmount.toLocaleString()}`, icon: Zap, accent: 'text-amber-500', bg: 'bg-amber-500/5' },
                                { title: "CYCLE_LIFE", value: `${policy.durationYears}Y`, icon: Clock, accent: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                                { title: "CLASS_DNA", value: policy.policyType.toUpperCase(), icon: Target, accent: 'text-rose-500', bg: 'bg-rose-500/5' }
                            ].map((item, i) => (
                                <motion.div 
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                                    className="p-10 bg-white/50 backdrop-blur-md rounded-[4rem] border-4 border-slate-50 group hover:border-[#007ea7]/30 shadow-4xl transition-all duration-1000 flex flex-col justify-between h-64 relative overflow-hidden"
                                >
                                     <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-150 transition-transform duration-[6000ms] pointer-events-none"><item.icon size={150} strokeWidth={1} /></div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="text-[12px] uppercase font-black text-slate-300 tracking-[10px] italic leading-none">{item.title}</div>
                                        <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.accent} flex items-center justify-center group-hover:bg-[#003249] group-hover:text-white transition-all duration-700 shadow-xl border-2 border-transparent group-hover:border-white/10`}><item.icon size={28} strokeWidth={3} /></div>
                                    </div>
                                    <div className="font-black text-4xl text-[#003249] tracking-tighter uppercase italic leading-none relative z-10 group-hover:text-[#007ea7] transition-all duration-700">{item.value}</div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-16 bg-[#003249] text-white rounded-[5.5rem] border-4 border-white relative overflow-hidden group shadow-4xl mt-12">
                             <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#007ea7]/10 rounded-full blur-[180px]" />
                                <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
                                <div className="absolute bottom-0 left-0 p-16 opacity-[0.05] group-hover:scale-110 transition-transform duration-[8000ms]">
                                    <Award size={400} strokeWidth={1} />
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-center justify-between mb-16 relative z-10 border-b-4 border-white/5 pb-14">
                                <h4 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-12 text-[#80ced7] italic leading-none">
                                    <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-[#007ea7] border-4 border-white/10 shadow-4xl group-hover:rotate-[360deg] transition-all duration-[2000ms]">
                                        <ShieldCheck size={48} strokeWidth={3} />
                                    </div>
                                    Yield_Advantages
                                </h4>
                                <div className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-3xl flex items-center gap-8 italic backdrop-blur-md">
                                     <Compass size={24} className="text-[#007ea7] animate-pulse" strokeWidth={3} />
                                     <span className="text-[13px] font-black uppercase tracking-[8px] text-white/30">CORE_SYNC: ACTIVE</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                                {[
                                    { label: "INCIDENT_COORD_PROTOCOL", sub: "End-to-end anomaly management and trauma support node." },
                                    { label: "ZEROX_FRICTION_YIELD", sub: "Automated fiscal settlement nodes with real-time liquidity." },
                                    { label: "SAT_LINK_COMMAND_CMD", sub: "Always-on command center access via encrypted satellite." },
                                    { label: "TAX_YIELD_OPTIMIZATION", sub: "Optimal tax-adjusted configurations for wealth retention." }
                                ].map((benefit, bIdx) => (
                                    <motion.div 
                                        key={benefit.label} 
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: bIdx * 0.15 }}
                                        className="flex items-start gap-12 group/benefit p-10 bg-white/5 rounded-[3.5rem] border-4 border-white/5 hover:bg-white/10 transition-all duration-1000 shadow-inner"
                                    >
                                        <div className="w-16 h-16 rounded-[1.8rem] bg-[#007ea7]/20 border-2 border-[#007ea7]/30 flex items-center justify-center text-[#80ced7] group-hover/benefit:scale-110 group-hover/benefit:rotate-12 transition-all duration-700 shadow-4xl">
                                            <CheckCircle2 size={32} strokeWidth={4} />
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[15px] font-black uppercase tracking-[8px] italic leading-none text-[#80ced7] group-hover:text-white transition-colors">{benefit.label}</span>
                                            <span className="text-[11px] font-black uppercase tracking-[4px] text-white/20 leading-relaxed group-hover:text-white/40 transition-colors italic">{benefit.sub}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-16"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-16 border-b-8 border-slate-50 pb-20 group">
                             <div className="relative group/dna">
                                <div className="absolute inset-0 bg-[#007ea7] blur-[80px] opacity-0 group-hover/dna:opacity-20 transition-all duration-1000" />
                                <div className={`w-44 h-44 rounded-[4rem] shadow-4xl bg-[#003249] text-[#007ea7] flex items-center justify-center border-4 border-white relative z-10 group-hover:rotate-[360deg] transition-all duration-[3000ms] overflow-hidden`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                    {policy.policyType === 'Health' && <HeartPulse size={80} strokeWidth={2.5} />}
                                    {(policy.policyType === 'Vehicle' || policy.policyType === 'Auto') && <Truck size={80} strokeWidth={2.5} />}
                                    {(policy.policyType === 'Property' || policy.policyType === 'Home') && <Home size={80} strokeWidth={2.5} />}
                                    {policy.policyType === 'Life' && <Shield size={80} strokeWidth={2.5} />}
                                    {policy.policyType === 'Travel' && <Globe size={80} strokeWidth={2.5} />}
                                </div>
                             </div>
                             <div className="space-y-6 flex-1">
                                <h3 className="text-6xl md:text-8xl font-black text-[#003249] uppercase tracking-tighter italic leading-none group-hover:text-[#007ea7] transition-all duration-1000">{policy.policyType.toUpperCase()} DNA_CALIB</h3>
                                <p className="text-[15px] font-black text-slate-300 uppercase tracking-[12px] italic opacity-60 leading-relaxed">Calibrate asset-specific operational parameters and sector traits for the <span className="text-[#003249] underline decoration-4 underline-offset-8 decoration-[#007ea7]">{policy.policyName.toUpperCase()}</span> chassis.</p>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-10">
                            {(policy.policyType === 'Vehicle' || policy.policyType === 'Auto') && (
                                <>
                                    <div className="space-y-8">
                                        <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-10 flex items-center gap-10 italic leading-none">
                                            <Fingerprint size={24} strokeWidth={3} /> ASSET_SEQUENCE_X
                                        </label>
                                        <div className="relative group/input">
                                            <input 
                                                placeholder="VIN_OR_REG_TAG_REQUIRED"
                                                className="w-full h-24 bg-slate-50 border-4 border-slate-100 rounded-[3rem] px-14 font-black text-xl uppercase tracking-[10px] outline-none focus:border-[#007ea7] focus:bg-white transition-all text-[#003249] shadow-inner italic"
                                                value={formData.regNo || ""}
                                                onChange={e => setFormData({...formData, regNo: e.target.value})}
                                            />
                                            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[#007ea7] opacity-20 group-hover/input:opacity-100 transition-all duration-700 hover:rotate-12"><SearchCheck size={32} strokeWidth={3} /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-10 flex items-center gap-10 italic leading-none">
                                            <Cpu size={24} strokeWidth={3} /> UNIT_CHASSIS_MODEL
                                        </label>
                                        <input 
                                            placeholder="ARCHITECTURE_DESCRIPTOR"
                                            className="w-full h-24 bg-slate-50 border-4 border-slate-100 rounded-[3rem] px-14 font-black text-lg uppercase tracking-[8px] outline-none focus:border-[#007ea7] focus:bg-white transition-all text-[#003249] shadow-inner italic"
                                            value={formData.model || ""}
                                            onChange={e => setFormData({...formData, model: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            {policy.policyType === 'Health' && (
                                <>
                                    <div className="space-y-8">
                                        <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-10 flex items-center gap-10 italic leading-none">
                                            <Activity size={24} strokeWidth={3} /> BIOMETRIC_ANOMALY
                                        </label>
                                        <textarea 
                                            rows="1"
                                            placeholder="REPORT_EXISTING_GRID_LOGS..."
                                            className="w-full p-14 bg-slate-50 border-4 border-slate-100 rounded-[3.5rem] font-black text-base uppercase tracking-[6px] outline-none focus:border-[#007ea7] focus:bg-white transition-all text-[#003249] shadow-inner italic resize-none no-scrollbar h-24"
                                            onChange={e => setFormData({...formData, healthConditions: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-8">
                                        <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-10 flex items-center gap-10 italic leading-none">
                                            <Clock size={24} strokeWidth={3} /> SYNC_LAST_AUDIT
                                        </label>
                                        <div className="relative group">
                                            <input 
                                                type="date"
                                                className="w-full h-24 bg-slate-50 border-4 border-slate-100 rounded-[3rem] px-14 font-black text-sm uppercase tracking-[8px] outline-none focus:border-[#007ea7] focus:bg-white transition-all text-[#003249] shadow-inner italic"
                                                onChange={e => setFormData({...formData, lastCheckup: e.target.value})}
                                            />
                                            <RefreshCcw size={28} className="absolute right-12 top-1/2 -translate-y-1/2 text-[#007ea7] animate-spin-slow opacity-20 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {(policy.policyType === 'Property' || policy.policyType === 'Home') && (
                                <>
                                    <div className="space-y-8">
                                        <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-10 flex items-center gap-10 italic leading-none">
                                            <Globe size={24} strokeWidth={3} /> SECTOR_GEOLOCATION
                                        </label>
                                        <input 
                                            placeholder="HUB_COORDINATES_TAG"
                                            className="w-full h-24 bg-slate-50 border-4 border-slate-100 rounded-[3rem] px-14 font-black text-lg uppercase tracking-[6px] outline-none focus:border-[#007ea7] focus:bg-white transition-all text-[#003249] shadow-inner italic"
                                            onChange={e => setFormData({...formData, propAddress: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-8">
                                        <label className="text-[13px] font-black uppercase tracking-[12px] text-[#007ea7] ml-10 flex items-center gap-10 italic leading-none">
                                            <IndianRupee size={24} strokeWidth={3} /> ASSET_VALUATION
                                        </label>
                                        <div className="relative group">
                                            <input 
                                                type="number"
                                                className="w-full h-32 bg-[#003249] border-4 border-white rounded-[3.5rem] px-24 text-right font-black text-5xl tracking-tighter outline-none focus:border-[#007ea7] text-[#80ced7] shadow-4xl italic overflow-hidden"
                                                placeholder="0.00"
                                                onChange={e => setFormData({...formData, propValue: e.target.value})}
                                            />
                                            <div className="absolute left-14 top-1/2 -translate-y-1/2 text-[#007ea7] font-black text-[15px] uppercase tracking-[15px] italic leading-none opacity-40">VAL:</div>
                                            <div className="absolute inset-x-0 bottom-0 h-2.5 bg-gradient-to-r from-transparent via-[#007ea7] to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000" />
                                        </div>
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
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-16"
                    >
                        <div className="flex flex-col items-center text-center space-y-12">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#007ea7] blur-[120px] opacity-20 animate-pulse rounded-full" />
                                <div className="w-44 h-44 bg-[#003249] text-[#007ea7] rounded-[4rem] flex items-center justify-center border-4 border-white shadow-4xl relative z-10 group-hover:rotate-12 transition-all duration-1000">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                    <Upload size={80} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <h3 className="text-6xl font-black text-[#003249] uppercase tracking-tighter leading-none italic group-hover:text-[#007ea7] transition-all duration-700">Transmission_Uplink</h3>
                                <p className="max-w-4xl mx-auto text-[14px] font-black text-slate-400 uppercase tracking-[12px] leading-loose italic opacity-60">Transmit encrypted artifact documentation for rapid verification & underwriting uplink. Supported formats: .PDF, .JPG, .PNG (MAX 50MB per node).</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-10">
                            <div className="p-20 bg-slate-50/50 border-4 border-dashed border-slate-200 rounded-[6rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#007ea7] hover:bg-white transition-all duration-1000 group relative overflow-hidden shadow-inner">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleFileChange} />
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-[10000ms]">
                                    <Fingerprint size={550} className="mx-auto rotate-12" />
                                </div>
                                <div className="w-36 h-36 bg-white rounded-[3rem] shadow-4xl mb-12 flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 border-4 border-slate-50 relative z-10">
                                    <Layers className="text-slate-200 group-hover:text-[#007ea7] transition-all duration-700" size={80} strokeWidth={2} />
                                </div>
                                <span className="font-black text-[#003249] uppercase tracking-[15px] italic text-[18px] mb-6 relative z-10 group-hover:text-[#007ea7] transition-colors">IDENTITY_CORES</span>
                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-[8px] italic leading-none relative z-10">PASSPORT / NATIONAL_NODES</span>
                            </div>
                            <div className="p-20 bg-slate-50/50 border-4 border-dashed border-slate-200 rounded-[6rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#007ea7] hover:bg-white transition-all duration-1000 group relative overflow-hidden shadow-inner">
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleFileChange} />
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-[10000ms]">
                                    <Cpu size={550} className="mx-auto -rotate-12" />
                                </div>
                                <div className="w-36 h-36 bg-white rounded-[3rem] shadow-4xl mb-12 flex items-center justify-center group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 border-4 border-slate-50 relative z-10">
                                    <Zap className="text-slate-200 group-hover:text-[#007ea7] transition-all duration-700" size={80} strokeWidth={2} />
                                </div>
                                <span className="font-black text-[#003249] uppercase tracking-[15px] italic text-[18px] mb-6 relative z-10 group-hover:text-[#007ea7] transition-colors">ASSET_CREDENTIALS</span>
                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-[8px] italic leading-none relative z-10">VALUATION_REPORTS_V2</span>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-10 pt-16">
                                <div className="flex items-center gap-10 ml-12">
                                    <div className="w-4 h-12 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                                    <h4 className="text-[15px] font-black text-[#003249] uppercase tracking-[12px] italic leading-none">
                                        Staged_Artifacts (<span className="text-[#007ea7]">{files.length}_NODES</span>)
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                    <AnimatePresence>
                                        {files.map((f, i) => (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.8, y: 30 }} 
                                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                                exit={{ opacity: 0, scale: 0.8, x: -30 }}
                                                key={i} 
                                                className="p-10 bg-white/80 backdrop-blur-md rounded-[4rem] border-4 border-slate-50 flex items-center justify-between group shadow-4xl hover:border-[#007ea7]/30 transition-all duration-1000 relative overflow-hidden"
                                            >
                                                <div className="flex items-center gap-10 relative z-10 w-full overflow-hidden">
                                                    <div className="w-20 h-20 bg-[#003249] text-[#007ea7] rounded-3xl flex items-center justify-center shadow-4xl group-hover:rotate-12 transition-all duration-1000 shrink-0 border-4 border-white/5">
                                                        <FileText size={40} strokeWidth={2.5} />
                                                    </div>
                                                    <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                                                        <span className="text-[14px] font-black text-[#003249] uppercase tracking-[4px] truncate italic group-hover:text-[#007ea7] transition-all duration-500">{f.name}</span>
                                                        <div className="flex items-center gap-4">
                                                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse" />
                                                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px] italic">READY_UPLINK</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleFileRemove(i)} className="w-16 h-16 bg-slate-50 hover:bg-rose-500 hover:text-white rounded-[2rem] transition-all duration-1000 group/close flex items-center justify-center shrink-0 border-4 border-slate-100/50 ml-6 relative z-10 shadow-inner group-hover:rotate-12 group-hover:scale-110">
                                                    <X size={28} className="text-slate-300 group-hover/close:text-white transition-colors" strokeWidth={5} />
                                                </button>
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#007ea7]/5 to-transparent animate-shimmer pointer-events-none" />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
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
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center space-y-20 py-10"
                    >
                        <div className="relative inline-block group">
                            <div className="absolute inset-0 bg-[#007ea7] blur-[150px] opacity-30 animate-pulse rounded-full" />
                            <div className="w-56 h-56 bg-[#003249] rounded-[4.5rem] flex items-center justify-center text-[#007ea7] shadow-4xl mx-auto relative z-10 border-4 border-white group-hover:rotate-[360deg] transition-all duration-[4000ms]">
                                 <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/30 to-transparent pointer-events-none" />
                                 <ShieldCheck size={110} strokeWidth={2.5} className="group-hover:scale-110 transition-transform duration-1000" />
                            </div>
                        </div>
                        
                        <div className="space-y-10">
                            <h3 className="text-7xl font-black text-[#003249] tracking-tighter uppercase italic leading-none group-hover:text-[#007ea7] transition-all duration-1000">Authorize <span className="text-[#007ea7]">Deployment_</span></h3>
                            <p className="max-w-5xl mx-auto text-[15px] font-black text-slate-400 uppercase tracking-[15px] leading-loose italic opacity-60">
                                Finalizing protocol for <span className="text-[#003249] underline decoration-8 underline-offset-[16px] decoration-[#007ea7]">{policy.policyName.toUpperCase()}</span>. 
                                Internal nodes will audit artifact integrity within 24-48 business cycles for full calibration.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto p-20 bg-white/60 backdrop-blur-xl border-4 border-white rounded-[6rem] space-y-20 shadow-4xl group transition-all duration-1000 hover:border-[#007ea7]/20 relative overflow-hidden text-left h-fit">
                            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none group-hover:scale-150 group-hover:rotate-[15deg] transition-transform duration-[10000ms]"><IndianRupee size={500} strokeWidth={1} /></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10 border-b-8 border-slate-50 pb-20">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-8 ml-4">
                                        <div className="w-3 h-10 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse" />
                                        <span className="text-[14px] font-black text-slate-300 uppercase tracking-[12px] italic">Operational_Yield</span>
                                    </div>
                                    <div className="flex items-center gap-10 bg-slate-50/50 p-12 rounded-[4rem] border-4 border-slate-50 shadow-inner group-hover:bg-white transition-all duration-1000 relative overflow-hidden backdrop-blur-sm">
                                        <div className="w-20 h-20 bg-[#003249] rounded-3xl flex items-center justify-center text-amber-500 shadow-4xl border-2 border-white/5 rotate-[-5deg] group-hover:rotate-0 transition-transform duration-1000">
                                            <IndianRupee size={44} strokeWidth={3} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-6xl font-black italic tracking-tighter text-[#003249] leading-none group-hover:text-[#007ea7] transition-all duration-1000">₹{policy.premiumAmount.toLocaleString()}</span>
                                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-[6px] mt-4 italic">PER_CYCLE_PREMIUM_COMMITTED</span>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                                    </div>
                                </div>
                                <div className="space-y-8 md:text-right">
                                    <div className="flex items-center justify-end gap-8 mr-4">
                                        <span className="text-[14px] font-black text-slate-300 uppercase tracking-[12px] italic">Capacity_Cap</span>
                                        <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse" />
                                    </div>
                                    <div className="flex flex-col items-end gap-4 pr-6">
                                        <div className="flex items-center justify-end gap-6 text-emerald-500 font-black italic tracking-widest text-3xl group-hover:scale-125 transition-transform duration-1000 leading-none">
                                            <Shield size={36} strokeWidth={4} className="animate-pulse" /> ₹{policy.coverageAmount.toLocaleString()}
                                        </div>
                                        <span className="text-[13px] font-black text-slate-200 uppercase tracking-[8px] italic opacity-40 leading-none block">TOTAL_CAPACITY_SIGMA_ACTIVE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-16 relative z-10 px-6">
                                <div className="flex items-center gap-12 group/total">
                                    <div className="w-28 h-28 bg-[#003249] rounded-[3.5rem] flex items-center justify-center text-[#80ced7] shadow-4xl group-hover:rotate-[360deg] transition-all duration-[2000ms] border-4 border-white">
                                        <CreditCard size={56} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-4">
                                        <span className="font-black text-[#003249] uppercase tracking-[15px] text-[20px] italic leading-none block group-hover:text-[#007ea7] transition-colors">Total_Commit_V4.2</span>
                                        <div className="flex items-center gap-6 bg-[#003249]/5 px-6 py-2 rounded-2xl border border-[#003249]/10 italic">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[12px] font-black text-slate-400 uppercase tracking-[8px] italic leading-none">UPLINK_BUFFER_INITIALIZED</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative group/price">
                                    <div className="absolute inset-[-40px] bg-[#007ea7] blur-[100px] opacity-0 group-hover/price:opacity-20 transition-all duration-1000" />
                                    <span className="text-8xl font-black text-[#003249] italic tracking-tighter leading-none group-hover:text-[#007ea7] transition-all duration-1000 relative z-10">₹{policy.premiumAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer pointer-events-none" />
                        </div>

                        <Reveal direction="up" delay={0.2}>
                            <div className="flex items-start gap-12 p-16 max-w-5xl mx-auto bg-rose-50/50 backdrop-blur-xl border-4 border-rose-100/50 text-rose-600 rounded-[5.5rem] text-left group/warning relative overflow-hidden shadow-4xl group-hover:border-rose-500/30 transition-all duration-1000">
                                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover/warning:scale-[2] group-hover/warning:rotate-12 transition-transform duration-[8000ms] pointer-events-none"><ShieldAlert size={400} strokeWidth={1} /></div>
                                 <div className="w-20 h-20 bg-rose-500 text-white rounded-[2.2rem] flex items-center justify-center shadow-4xl animate-pulse shrink-0 border-4 border-white/20 group-hover:rotate-12 transition-all duration-700">
                                     <AlertCircle size={40} strokeWidth={4} />
                                 </div>
                                 <div className="relative z-10 space-y-6 flex-1">
                                    <span className="text-[16px] font-black uppercase tracking-[15px] italic mb-2 block leading-none">Security_Protocol_Termination_Guard</span>
                                    <p className="text-[12px] font-black leading-loose uppercase tracking-[8px] opacity-70 group-hover:opacity-100 transition-opacity italic">By committing this signal, you verify all provided artifact documentation and identity metadata. Protocol 64-SIGMA dictates that any falsified nodes will trigger immediate account suspension and asset isolation. Finalize only after verified audit cycle.</p>
                                 </div>
                            </div>
                        </Reveal>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="space-y-16 pb-24">
            {/* Command Navigation Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 relative z-10">
                <Reveal direction="left">
                    <div className="space-y-8">
                        <motion.button 
                            whileHover={{ x: -20, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => step === 1 ? navigate(-1) : handleBack()}
                            className="flex items-center gap-8 text-[13px] font-black uppercase tracking-[15px] text-[#007ea7] italic group bg-white/50 backdrop-blur-md px-10 py-5 rounded-[2.5rem] w-fit shadow-4xl border-2 border-slate-50 transition-all duration-500"
                        >
                            <div className="w-12 h-12 rounded-[1.2rem] bg-[#003249] text-white flex items-center justify-center group-hover:bg-[#007ea7] transition-all shadow-4xl group-hover:rotate-[360deg] duration-1000 shrink-0">
                                <ChevronLeft size={28} strokeWidth={4} /> 
                            </div>
                            <span className="group-hover:text-[#003249] transition-colors">{step === 1 ? 'Abort_Uplink' : 'Return_Sequence'}</span>
                        </motion.button>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-8">
                                <div className="w-4 h-14 bg-[#007ea7] rounded-full shadow-[0_0_20px_#007ea7]" />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-black uppercase tracking-[10px] text-[#003249] italic leading-none opacity-60">Asset Initialization Command_v4.2</span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px] mt-2 italic shadow-sm">SECTOR_ALPHA_7_ACTIVE</span>
                                </div>
                            </div>
                            <h1 className="text-7xl md:text-9xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Asset_<span className="text-[#007ea7]">Deploy_</span></h1>
                            <div className="flex items-center gap-10">
                                <div className="px-8 py-3 bg-[#003249] text-[#80ced7] rounded-2xl text-[12px] font-black uppercase tracking-[8px] italic shadow-4xl border-4 border-white transition-all hover:scale-105 duration-500">
                                    NODE_ID: {policy._id.slice(-8).toUpperCase()}
                                </div>
                                <div className="flex items-center gap-4 italic group/signal cursor-help">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
                                    <span className="text-[12px] font-black text-slate-300 uppercase tracking-[6px] group-hover:text-[#003249] transition-colors">Uplink_Signal_STABLE_100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="right">
                    <div className="flex items-center gap-10 w-full xl:w-[750px] bg-white/50 backdrop-blur-2xl p-10 rounded-[5rem] border-4 border-white shadow-4xl relative overflow-hidden group">
                        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-transparent via-[#007ea7]/40 to-transparent group-hover:animate-shimmer" />
                        <div className="flex items-center justify-between w-full">
                            {[1, 2, 3, 4].map((s, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="flex flex-col items-center gap-6 relative z-10 group/step cursor-pointer" onClick={() => s < step && setStep(s)}>
                                        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center font-black text-2xl italic transition-all duration-1000 border-4 ${
                                            s === step ? 'bg-[#003249] text-[#80ced7] shadow-[0_30px_60px_-15px_rgba(0,50,73,0.5)] scale-110 border-white rotate-12' : 
                                            s < step ? 'bg-emerald-500 text-white shadow-4xl border-white scale-90' : 
                                            'bg-slate-50 text-slate-200 border-slate-50 shadow-inner'
                                        }`}>
                                            {s < step ? <CheckCircle2 size={44} strokeWidth={4} className="animate-pulse" /> : `0${s}`}
                                        </div>
                                        <motion.span 
                                            initial={false}
                                            animate={{ y: s === step ? 0 : -10, opacity: s === step ? 1 : 0 }}
                                            className={`text-[11px] font-black uppercase tracking-[8px] italic leading-none text-[#003249]`}
                                        >
                                            {s === 1 && 'SPECS'}
                                            {s === 2 && 'DNA'}
                                            {s === 3 && 'LINK'}
                                            {s === 4 && 'SYNC'}
                                        </motion.span>
                                    </div>
                                    {s < 4 && <div className={`flex-1 h-2 rounded-full mx-4 transition-all duration-1000 shadow-inner overflow-hidden relative ${s < step ? 'bg-emerald-500/20' : 'bg-slate-100'}`}>
                                        {s < step && <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1 }} className="absolute inset-0 bg-emerald-500" />}
                                    </div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Content Chassis */}
            <Reveal width="100%" direction="up" delay={0.2}>
                <div className="saas-card p-16 md:p-32 rounded-[7rem] group relative overflow-hidden shadow-4xl border-4 border-white bg-white/50 backdrop-blur-md transition-all duration-[2000ms] hover:border-[#007ea7]/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-[10000ms] -rotate-12">
                         <ShieldCheck size={800} strokeWidth={1} className="text-[#003249]" />
                    </div>

                    <AnimatePresence mode="wait">
                        <div key={step}>
                            {renderStepContent()}
                        </div>
                    </AnimatePresence>

                    {/* Operational Actions */}
                    <div className="mt-32 flex flex-col md:flex-row gap-16 relative z-10 border-t-8 border-slate-50 pt-24 group/actions">
                        {step < 4 ? (
                            <button 
                                onClick={handleNext}
                                className="h-32 px-24 bg-[#003249] text-[#80ced7] rounded-[4.5rem] flex-1 text-[20px] font-black uppercase tracking-[25px] shadow-4xl active:scale-95 group/btn italic relative overflow-hidden transition-all duration-1000 border-4 border-white hover:text-white"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                                <span className="relative z-10 flex items-center justify-center gap-16">
                                    Proceed_Deployment
                                    <ChevronRight className="group-hover/btn:translate-x-10 transition-transform duration-1000" size={48} strokeWidth={5} />
                                </span>
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className="h-32 px-24 bg-[#007ea7] text-white rounded-[4.5rem] flex-1 text-[22px] font-black uppercase tracking-[30px] shadow-4xl active:scale-95 group/btn italic relative overflow-hidden transition-all duration-1000 border-8 border-[#003249] shadow-[0_45px_90px_-20px_rgba(0,126,167,0.6)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
                                <span className="relative z-10 flex items-center justify-center gap-16">
                                    {loading ? (
                                        <RefreshCcw className="animate-spin text-white" size={56} strokeWidth={5} />
                                    ) : (
                                        <>COMMIT_FULL_DEPLOYMENT <Zap size={56} fill="currentColor" className="animate-pulse text-[#003249]" /></>
                                    )}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </Reveal>
            
            {/* System Status Logs */}
            <Reveal direction="up" delay={0.8}>
                <div className="flex flex-wrap justify-center gap-28 opacity-30 pt-20 border-t-8 border-slate-50 relative">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-72 h-3 bg-[#007ea7] rounded-full shadow-[0_0_30px_#007ea7]" />
                    
                    {[
                        { icon: Fingerprint, label: "IDENTITY_AUDIT" },
                        { icon: Layers, label: "ARTIFACT_STAGED" },
                        { icon: Zap, label: "ENCRYPT_UPLINK" },
                        { icon: Command, label: "SIGNAL_AUTH" }
                    ].map((status, i) => (
                        <div key={i} className="flex items-center gap-10 group cursor-crosshair">
                            <status.icon size={32} strokeWidth={3} className="text-[#007ea7] opacity-20 group-hover:opacity-100 group-hover:rotate-[360deg] transition-all duration-[1500ms]" />
                            <span className="text-[14px] font-black text-slate-300 uppercase tracking-[15px] italic leading-none group-hover:text-[#003249] transition-all duration-700">{status.label}</span>
                        </div>
                    ))}
                </div>
            </Reveal>
        </div>
    );
};

export default ApplicationPage;
