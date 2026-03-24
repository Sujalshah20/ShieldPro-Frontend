import React, { useState } from 'react';
import { Info, UploadCloud, FileText, Image as ImageIcon, Receipt, Landmark, CheckCircle2, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SubmitClaimForm = ({ onCancel, onSubmit }) => {
    const [policy, setPolicy] = useState('');
    const [claimType, setClaimType] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const [bankAccount, setBankAccount] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [bankName, setBankName] = useState('');
    
    const [declarationAccepted, setDeclarationAccepted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!declarationAccepted) {
            alert("Please accept the declaration to proceed.");
            return;
        }
        // Mock payload
        const payload = { policy, claimType, amount, date, description, bankAccount, ifsc, bankName };
        onSubmit(payload);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-5xl mx-auto pb-20 font-sans px-4"
        >
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-[#134e8d] tracking-tight">Submit Insurance Claim</h2>
                    <p className="text-slate-500 mt-2 font-medium">Provide details and documentation to process your request.</p>
                </div>
                <button 
                    onClick={onCancel}
                    className="flex items-center justify-center gap-2 bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <X size={18} /> Cancel
                </button>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Claim Details Section */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                        <Info className="text-[#134e8d]" size={20} />
                        <h3 className="text-lg font-bold text-slate-800">Claim Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Policy</label>
                            <select 
                                value={policy} onChange={(e) => setPolicy(e.target.value)} required
                                className="rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:ring-[#134e8d] focus:border-[#134e8d] font-medium text-slate-700"
                            >
                                <option value="">-- Select a Policy --</option>
                                <option value="pol-8829">Health Shield Plus - #POL-8829</option>
                                <option value="pol-4412">Safe Drive Auto - #POL-4412</option>
                                <option value="pol-0931">Home Secure - #POL-0931</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Claim Type</label>
                            <select 
                                value={claimType} onChange={(e) => setClaimType(e.target.value)} required
                                className="rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:ring-[#134e8d] focus:border-[#134e8d] font-medium text-slate-700"
                            >
                                <option value="">Select Category</option>
                                <option value="hospitalization">Hospitalization</option>
                                <option value="accident">Accident</option>
                                <option value="death">Death</option>
                                <option value="damage">Damage</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Claim Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                                <input 
                                    type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required
                                    className="w-full pl-8 pr-3 py-3 rounded-xl border-slate-200 bg-slate-50 text-sm focus:ring-[#134e8d] focus:border-[#134e8d] font-medium text-slate-700" 
                                    placeholder="0.00" 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Incident</label>
                            <input 
                                type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                                className="rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:ring-[#134e8d] focus:border-[#134e8d] font-medium text-slate-700" 
                            />
                        </div>
                        <div className="col-span-full flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description of Claim</label>
                            <textarea 
                                value={description} onChange={(e) => setDescription(e.target.value)} required
                                className="rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:ring-[#134e8d] focus:border-[#134e8d] font-medium text-slate-700" 
                                placeholder="Describe the event and nature of the claim in detail..." rows="4"
                            ></textarea>
                        </div>
                    </div>
                </section>

                {/* Documents Upload Section */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                        <UploadCloud className="text-[#134e8d]" size={20} />
                        <h3 className="text-lg font-bold text-slate-800">Upload Supporting Documents</h3>
                    </div>
                    <div className="border-2 border-dashed border-slate-100 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="bg-white p-5 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform border border-slate-50">
                            <UploadCloud className="text-[#10b981]" size={28} />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Drag and drop files here</p>
                        <p className="text-xs text-slate-400 mt-2 font-medium">PDF, JPG, PNG (Max size 5MB per file)</p>
                        <button className="mt-6 px-8 py-2.5 bg-[#134e8d] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#002b45] transition-all" type="button">
                            Browse Files
                        </button>
                    </div>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Receipt className="text-[#134e8d]" size={20} />
                            <div>
                                <p className="text-xs font-bold text-slate-700">Hospital Bills</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Required</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <FileText className="text-[#134e8d]" size={20} />
                            <div>
                                <p className="text-xs font-bold text-slate-700">FIR Copy</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">For Accidents</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <CheckCircle2 className="text-[#10b981]" size={20} />
                            <div>
                                <p className="text-xs font-bold text-slate-700">Doctor's Report</p>
                                <p className="text-[10px] text-[#10b981] font-bold uppercase">Uploaded</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bank Details Section */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                        <Landmark className="text-[#134e8d] w-5 h-5" />
                        <h3 className="text-lg font-bold text-slate-800">Bank Account Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Number</label>
                            <input 
                                type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} required
                                className="rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:ring-[#134e8d] focus:border-[#134e8d] font-medium text-slate-700" 
                                placeholder="0000 0000 0000" 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location / Branch code</label>
                            <input 
                                type="text" value={ifsc} onChange={(e) => setIfsc(e.target.value)} required
                                className="rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:ring-[#134e8d] focus:border-[#134e8d] uppercase font-medium text-slate-700" 
                                placeholder="BR-1234" 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bank Name</label>
                            <input 
                                type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} required
                                className="rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:ring-[#134e8d] focus:border-[#134e8d] font-medium text-slate-700" 
                                placeholder="e.g. Shield Trust Bank" 
                            />
                        </div>
                    </div>
                </section>

                {/* Declaration & Submit */}
                <div className="flex flex-col gap-6 py-6">
                    <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="mt-1">
                            <input 
                                type="checkbox" 
                                checked={declarationAccepted} onChange={(e) => setDeclarationAccepted(e.target.checked)}
                                className="rounded border-slate-300 text-[#134e8d] focus:ring-[#134e8d] w-5 h-5 cursor-pointer" 
                            />
                        </div>
                        <span className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-800 transition-colors">
                            I hereby declare that the information provided above is true and accurate to the best of my knowledge. I understand that any false declaration may lead to claim rejection and legal consequences.
                        </span>
                    </label>

                    <div className="flex justify-end gap-4 mt-8">
                        <button 
                            type="button"
                            className="px-8 py-3.5 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 border border-slate-200 transition-all text-xs uppercase tracking-wider"
                        >
                            Save as Draft
                        </button>
                        <button 
                            type="submit"
                            className="px-10 py-3.5 bg-[#10b981] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-[#059669] transition-all transform hover:-translate-y-1"
                        >
                            Submit Claim
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default SubmitClaimForm;
