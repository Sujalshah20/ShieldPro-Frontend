import React from 'react';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileNav = ({ isOpen, onClose, children }) => {
    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#0a0a0a] border-r border-slate-200 dark:border-white/10 z-50 md:hidden overflow-y-auto"
                        >
                            <div className="p-4">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <X size={24} className="text-slate-700 dark:text-white" />
                                </button>

                                <div className="mt-12">
                                    {children}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export const MobileMenuButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
        >
            <Menu size={24} className="text-white" />
        </button>
    );
};

export default MobileNav;
