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
            className="w-full max-w-5xl mx-auto pb-20"
        >
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Submit Insurance Claim</h2>
                    <p className="text-gray-500 mt-1">Provide details and documentation to process your request.</p>
                </div>
                <button 
                    onClick={onCancel}
                    className="flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <X size={18} /> Cancel
                </button>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Claim Details Section */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <Info className="text-white" size={20} />
                        <h3 className="text-lg font-bold text-gray-800">Claim Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Select Policy</label>
                            <select 
                                value={policy} onChange={(e) => setPolicy(e.target.value)} required
                                className="rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-[#002b45] focus:border-[#002b45]"
                            >
                                <option value="">-- Select a Policy --</option>
                                <option value="pol-8829">Health Shield Plus - #POL-8829</option>
                                <option value="pol-4412">Safe Drive Auto - #POL-4412</option>
                                <option value="pol-0931">Home Secure - #POL-0931</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Claim Type</label>
                            <select 
                                value={claimType} onChange={(e) => setClaimType(e.target.value)} required
                                className="rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-[#002b45] focus:border-[#002b45]"
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
                            <label className="text-sm font-semibold text-gray-700">Claim Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                                <input 
                                    type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required
                                    className="w-full pl-8 pr-3 py-3 rounded-xl border-gray-200 bg-gray-50 text-sm focus:ring-[#002b45] focus:border-[#002b45]" 
                                    placeholder="0.00" 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Date of Incident</label>
                            <input 
                                type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                                className="rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-[#002b45] focus:border-[#002b45]" 
                            />
                        </div>
                        <div className="col-span-full flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Description of Claim</label>
                            <textarea 
                                value={description} onChange={(e) => setDescription(e.target.value)} required
                                className="rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-[#002b45] focus:border-[#002b45]" 
                                placeholder="Describe the event and nature of the claim in detail..." rows="4"
                            ></textarea>
                        </div>
                    </div>
                </section>

                {/* Documents Upload Section */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <UploadCloud className="text-white" size={20} />
                        <h3 className="text-lg font-bold text-gray-800">Upload Supporting Documents</h3>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud className="text-[#14b8a6] scale-150" size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-700">Drag and drop files here</p>
                        <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (Max size 5MB per file)</p>
                        <button className="mt-6 px-6 py-2 bg-[#002b45] text-white text-sm font-bold rounded-xl shadow-md" type="button">
                            Browse Files
                        </button>
                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <Receipt className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs font-bold text-gray-800">Hospital Bills</p>
                                <p className="text-[10px] text-gray-500">Required</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <FileText className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs font-bold text-gray-800">FIR Copy</p>
                                <p className="text-[10px] text-gray-500">For Accidents</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <CheckCircle2 className="text-emerald-500" size={20} />
                            <div>
                                <p className="text-xs font-bold text-gray-800">Doctor's Report</p>
                                <p className="text-[10px] text-emerald-600">Uploaded</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bank Details Section */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <Landmark className="text-white w-5 h-5" />
                        <h3 className="text-lg font-bold text-gray-800">Bank Account Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Account Number</label>
                            <input 
                                type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} required
                                className="rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-[#002b45] focus:border-[#002b45]" 
                                placeholder="000000000000" 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Location / Branch code</label>
                            <input 
                                type="text" value={ifsc} onChange={(e) => setIfsc(e.target.value)} required
                                className="rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-[#002b45] focus:border-[#002b45] uppercase" 
                                placeholder="BR-1234" 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Bank Name</label>
                            <input 
                                type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} required
                                className="rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-[#002b45] focus:border-[#002b45]" 
                                placeholder="e.g. Chase Bank" 
                            />
                        </div>
                    </div>
                </section>

                {/* Declaration & Submit */}
                <div className="flex flex-col gap-6 py-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={declarationAccepted} onChange={(e) => setDeclarationAccepted(e.target.checked)}
                            className="mt-1 rounded border-gray-300 text-white focus:ring-[#002b45] w-5 h-5" 
                        />
                        <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                            I hereby declare that the information provided above is true and accurate to the best of my knowledge. I understand that any false declaration may lead to claim rejection and legal consequences.
                        </span>
                    </label>

                    <div className="flex justify-end gap-4 mt-4">
                        <button 
                            type="button"
                            className="px-8 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 border border-gray-200 transition-colors text-sm"
                        >
                            Save as Draft
                        </button>
                        <button 
                            type="submit"
                            className="px-10 py-3.5 bg-[#14b8a6] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all transform hover:-translate-y-1"
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
