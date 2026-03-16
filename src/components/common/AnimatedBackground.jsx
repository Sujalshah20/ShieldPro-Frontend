import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = ({ children }) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#dae5e5] text-[#012b3f] transition-colors duration-500">
            {/* Soft Professional Gradients */}
            <div className="absolute inset-0 z-0 opacity-40 mesh-gradient-premium" />
            
            {/* Floating Subtle Blobs - Refined for "Same to Same" Look */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 80, 0],
                        y: [0, -100, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.4, 0.3]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] bg-white blur-[130px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -60, 0],
                        y: [0, 80, 0],
                        scale: [1, 0.9, 1],
                        opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#0082a1]/10 blur-[150px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#012b3f]/5 blur-[100px] rounded-full"
                />
            </div>

            {/* Main Content Content Container */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>

            {/* Subtle Vignette for Premium Feel */}
            <div className="fixed inset-0 pointer-events-none z-[160] border-[50px] border-black/[0.02] bg-transparent shadow-[inset_0_0_80px_rgba(0,0,0,0.02)]" />
        </div>
    );
};

export default AnimatedBackground;
