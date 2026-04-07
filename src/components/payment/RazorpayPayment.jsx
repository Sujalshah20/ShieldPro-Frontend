import React, { useState } from 'react';
import { api } from '../../utils/api';

const RazorpayPayment = ({ amount = 500, onSuccess, onFailure, className = "", buttonText = "" }) => {
    const [loading, setLoading] = useState(false);

    // Function to load the Razorpay checkout script dynamically
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        // 1. Load Razorpay script
        const isScriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!isScriptLoaded) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // 2. Create order on the backend
            const amountInPaise = Math.round(amount * 100);
            const order = await api.post('/payments/order', {
                amount: amountInPaise,
                receipt: `receipt_${Date.now()}`
            });

            // 3. Open Razorpay Checkout Popup
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID', 
                amount: order.amount,
                currency: order.currency,
                name: 'ShieldPro Insurance',
                description: 'Payment for Policy Premium',
                image: '/logo.png',
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
                            if (onSuccess) onSuccess(result);
                        } else {
                            if (onFailure) onFailure(result);
                        }
                    } catch (err) {
                        console.error('Verification Error:', err);
                        if (onFailure) onFailure(err);
                    }
                },
                prefill: {
                    name: 'Guest User',
                    email: 'guest@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#002b45', 
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
            className={className || `w-full h-16 bg-[#002b45] text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-4 hover:bg-[#134e8d] hover:translate-y-[-2px] transition-all shadow-xl shadow-[#002b45]/10 group disabled:opacity-50 mt-4`}
        >
            {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
            ) : (
                buttonText || `Pay ₹${amount?.toLocaleString()}`
            )}
        </button>
    );
};

export default RazorpayPayment;
