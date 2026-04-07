import React, { useState, useContext } from 'react';
import RazorpayPayment from '../../components/payment/RazorpayPayment';
import { AuthContext } from '../../context/AuthContext';
import { Shield, CheckCircle, XCircle, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RazorpayDemo = () => {
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState('idle'); // idle, success, failure
    const [paymentDetails, setPaymentDetails] = useState(null);

    const handleSuccess = (details) => {
        setStatus('success');
        setPaymentDetails(details);
    };

    const handleFailure = (error) => {
        setStatus('failure');
        console.error('Payment failed:', error);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 leading-none">Razorpay Test</h1>
                        <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mt-1 italic">Secure Gateway Node</p>
                    </div>
                </div>

                {!user ? (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                            <LogIn size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Login Required</h2>
                        <p className="text-slate-500 text-sm">Please login to a customer account to test the Razorpay integration.</p>
                        <Link 
                            to="/login"
                            className="inline-block w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : status === 'idle' ? (
                    <div className="space-y-8">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-500 font-bold text-sm">Product</span>
                                <span className="text-slate-900 font-black italic">ShieldPro Premium</span>
                            </div>
                            <div className="flex justify-between items-center text-2xl font-black">
                                <span className="text-slate-900">Total Amount</span>
                                <span className="text-blue-600 tracking-tighter">₹500.00</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <RazorpayPayment 
                                amount={500} 
                                onSuccess={handleSuccess} 
                                onFailure={handleFailure} 
                            />
                            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                TEST MODE ONLY // NO REAL MONEY CHARGED
                            </p>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[3px] mb-4">Test Credentials (Razorpay)</h3>
                            <ul className="text-[11px] font-bold text-slate-500 space-y-2">
                                <li className="flex justify-between"><span>Card:</span> <code className="bg-slate-100 px-2 rounded text-blue-600">4111 1111 1111 1111</code></li>
                                <li className="flex justify-between"><span>Expiry:</span> <code className="bg-slate-100 px-2 rounded text-blue-600">Any future date</code></li>
                                <li className="flex justify-between"><span>CVV:</span> <code className="bg-slate-100 px-2 rounded text-blue-600">123</code></li>
                                <li className="flex justify-between"><span>UPI:</span> <code className="bg-slate-100 px-2 rounded text-blue-600">success@razorpay</code></li>
                            </ul>
                        </div>
                    </div>
                ) : status === 'success' ? (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-6 py-4">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle size={40} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900">Payment Successful!</h2>
                            <p className="text-slate-500 font-medium">Your transaction was successful.</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-left font-mono text-[11px] text-slate-500 break-all border border-slate-100">
                            <p className="font-bold mb-1 text-slate-700">DEBUG_INFO:</p>
                            {JSON.stringify(paymentDetails, null, 2)}
                        </div>
                        <button 
                            onClick={() => setStatus('idle')}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                        >
                            Try Again
                        </button>
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-6 py-4">
                        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                            <XCircle size={40} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900">Payment Failed</h2>
                            <p className="text-slate-500 font-medium">Something went wrong with your transaction.</p>
                        </div>
                        <button 
                            onClick={() => setStatus('idle')}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                        >
                            Retry Payment
                        </button>
                    </motion.div>
                )}
            </motion.div>
            
            <p className="mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[5px] italic">
                © 2026 ShieldPro // Razorpay Integration Node 1.0
            </p>
        </div>
    );
};

export default RazorpayDemo;
