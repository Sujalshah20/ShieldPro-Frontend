import React, { useState } from 'react';
import { api } from '../../utils/api';

const RazorpayPayment = ({ amount = 500, onSuccess, onFailure, className = "", buttonText = "", user = null, policyId = null, applicationId = null }) => {
    const [loading, setLoading] = useState(false);

    const loadScript = (src) => {
        return new Promise((resolve) => {
            // BUG FIX: Guard against injecting the same script on every click.
            // Without this, each payment attempt appends another <script> tag — a memory leak.
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };


    const handlePayment = async () => {
        setLoading(true);

        const isScriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!isScriptLoaded) {
            alert('Razorpay SDK failed to load. Check your connection.');
            setLoading(false);
            return;
        }

        try {
            const amountInPaise = Math.round(amount * 100);
            const order = await api.post('/payments/order', {
                amount: amountInPaise,
                receipt: `receipt_${Date.now()}`,
                policyId: policyId, // Pass the policy ID to link the payment
                applicationId: applicationId // Pass application ID if any
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: order.amount,
                currency: order.currency,
                name: 'ShieldPro Insurance',
                description: 'Premium Protection Payment',
                image: '/shield-logo.png',
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        const result = await api.post('/payments/verify', verificationData);

                        if (result.success) {
                            if (onSuccess) onSuccess({ ...result, razorpay_payment_id: response.razorpay_payment_id });
                        } else {
                            if (onFailure) onFailure(result);
                        }
                    } catch (err) {
                        console.error('Verification Error:', err);
                        if (onFailure) onFailure(err);
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || '',
                },
                theme: {
                    color: '#0c2e59', 
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            paymentObject.on('payment.failed', function (response) {
                if (onFailure) onFailure(response.error);
            });

        } catch (error) {
            console.error('Payment Error:', error);
            if (onFailure) onFailure(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={className || `w-full h-14 bg-[#134e8d] text-white rounded-full text-sm font-bold flex items-center justify-center gap-3 hover:bg-[#0c2e59] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50 group`}
        >
            {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
                <>
                    {buttonText || `Pay ₹${amount?.toLocaleString()} Securely`}
                </>
            )}
        </button>
    );
};

export default RazorpayPayment;
